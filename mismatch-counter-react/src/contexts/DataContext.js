import React, { createContext, useState, useEffect, useContext } from 'react';
import { useConfig } from './ConfigContext';
import profiles from '../utils/profiles';

// Create a context for the data
export const DataContext = createContext();

// Create a provider component
export const DataProvider = ({ children }) => {
  const { config, getDefaultCounters } = useConfig();
  const [counters, setCounters] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({
    startDate: null,
    counts: {},
    perfectDays: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data when component mounts
  useEffect(() => {
    if (!config.isLoading) {
      initializeData();
    }
  }, [config.isLoading]);
  
  // Auto-save counters to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && counters.length > 0) {
      console.log("Auto-saving counters to localStorage...");
      saveToStorage(counters, weeklyStats);
    }
  }, [counters, weeklyStats]);
  
  // Listen for custom increment events to force save
  useEffect(() => {
    const handleForceSave = () => {
      console.log("Forced save after increment triggered");
      saveToStorage(counters, weeklyStats);
    };
    
    document.addEventListener('mismatch-increment', handleForceSave);
    
    return () => {
      document.removeEventListener('mismatch-increment', handleForceSave);
    };
  }, [counters, weeklyStats]);

  // Initialize data from localStorage or defaults
  const initializeData = () => {
    try {
      setIsLoading(true);
      console.log("Initializing data...");
      
      // Try to load data from localStorage first
      const loadedFromStorage = loadFromStorage();
      
      // If we have counters at this point (from loadFromStorage), use them
      if (loadedFromStorage) {
        console.log("Using existing counters from localStorage");
      } else {
        // Otherwise initialize with defaults - but only if we don't have any counters yet
        console.log("No existing counters found in localStorage, initializing defaults");
        initializeDefaultCounters();
      }
      
      // Check if we need to reset weekly stats
      const currentWeekStart = getStartOfWeek();
      if (weeklyStats.startDate !== currentWeekStart) {
        console.log("Resetting weekly stats for new week");
        const newWeeklyStats = {
          startDate: currentWeekStart,
          counts: {},
          perfectDays: 0
        };
        
        setWeeklyStats(newWeeklyStats);
        localStorage.setItem('mismatchAppWeeklyStats', JSON.stringify(newWeeklyStats));
      }
      
      setIsLoading(false);
    } catch (e) {
      console.error("Error initializing data: ", e);
      // Fallback to in-memory only if localStorage is not available
      initializeDefaultCounters();
      setIsLoading(false);
    }
  };

  // Initialize with default counters from profiles
  const initializeDefaultCounters = () => {
    const today = getTodayDateString();
    // Use the profile counters for the selected template, or default to romantic
    const defaultCounters = profiles[config.selectedTemplate || 'romantic'] || [];
    
    const newCounters = defaultCounters.map(counter => ({
      name: counter.name,
      count: 0,
      threshold: counter.threshold,
      lastIncrement: null,
      lastReset: today,
      events: [],
      activeConsequence: null
    }));
    
    setCounters(newCounters);
    
    const currentWeekStart = getStartOfWeek();
    setWeeklyStats({
      startDate: currentWeekStart,
      counts: {},
      perfectDays: 0
    });
    
    // Save to localStorage
    saveToStorage(newCounters, {
      startDate: currentWeekStart,
      counts: {},
      perfectDays: 0
    });
  };

  // Save data to localStorage
  const saveToStorage = (counterData, statsData) => {
    try {
      // Get the data to save, using parameters or current state
      const countersToSave = counterData || counters;
      const statsToSave = statsData || weeklyStats;
      
      // Only save if we have valid data
      if (Array.isArray(countersToSave) && countersToSave.length > 0) {
        localStorage.setItem('mismatchAppCounters', JSON.stringify(countersToSave));
        console.log("Saved counters to localStorage:", countersToSave);
      } else {
        console.warn("Attempted to save invalid counters:", countersToSave);
      }
      
      localStorage.setItem('mismatchAppWeeklyStats', JSON.stringify(statsToSave));
      return true;
    } catch (e) {
      console.error("Error saving to localStorage: ", e);
      return false;
    }
  };

  // Load data from localStorage
  const loadFromStorage = () => {
    try {
      const savedCounters = localStorage.getItem('mismatchAppCounters');
      const savedStats = localStorage.getItem('mismatchAppWeeklyStats');
      
      let hasLoadedCounters = false;
      
      if (savedCounters) {
        try {
          const parsedCounters = JSON.parse(savedCounters);
          if (Array.isArray(parsedCounters) && parsedCounters.length > 0) {
            // Ensure we have a proper counters array with all required properties
            const validCounters = parsedCounters.map(counter => ({
              name: counter.name || "Unnamed",
              count: typeof counter.count === 'number' ? counter.count : 0,
              threshold: typeof counter.threshold === 'number' ? counter.threshold : 10,
              lastIncrement: counter.lastIncrement || null,
              lastReset: counter.lastReset || getTodayDateString(),
              events: Array.isArray(counter.events) ? counter.events : [],
              activeConsequence: counter.activeConsequence || null
            }));
            
            setCounters(validCounters);
            console.log("Successfully loaded and validated counters from localStorage:", validCounters);
            hasLoadedCounters = true;
          } else {
            console.warn("Found localStorage counters, but data is invalid:", parsedCounters);
          }
        } catch (parseError) {
          console.error("Error parsing localStorage counters:", parseError);
        }
      } else {
        console.warn("No counters found in localStorage");
      }
      
      if (savedStats) {
        try {
          const parsedStats = JSON.parse(savedStats);
          if (parsedStats && typeof parsedStats === 'object') {
            // Ensure we have a proper stats object with all required properties
            const validStats = {
              startDate: parsedStats.startDate || getStartOfWeek(),
              counts: parsedStats.counts || {},
              perfectDays: typeof parsedStats.perfectDays === 'number' ? parsedStats.perfectDays : 0
            };
            
            setWeeklyStats(validStats);
            console.log("Successfully loaded and validated weekly stats from localStorage");
          } else {
            setWeeklyStats({
              startDate: getStartOfWeek(),
              counts: {},
              perfectDays: 0
            });
            console.warn("Weekly stats data is invalid, initializing new ones");
          }
        } catch (parseError) {
          console.error("Error parsing localStorage stats:", parseError);
          setWeeklyStats({
            startDate: getStartOfWeek(),
            counts: {},
            perfectDays: 0
          });
        }
      } else {
        setWeeklyStats({
          startDate: getStartOfWeek(),
          counts: {},
          perfectDays: 0
        });
        console.warn("No weekly stats found in localStorage, initializing new ones");
      }
      
      return hasLoadedCounters;
    } catch (e) {
      console.error("Error loading from localStorage: ", e);
      return false;
    }
  };

  // Clear all localStorage data
  const clearStorage = () => {
    try {
      localStorage.removeItem('mismatchAppCounters');
      localStorage.removeItem('mismatchAppWeeklyStats');
      return true;
    } catch (e) {
      console.error("Error clearing localStorage: ", e);
      return false;
    }
  };

  // Get start of current week (Sunday)
  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = now.getDate() - day;
    return new Date(now.setDate(diff)).toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Calculate days between two dates
  const daysBetween = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
  };

  // Increment a counter
  const incrementCounter = (counterName) => {
    const today = getTodayDateString();
    
    setCounters(prevCounters => {
      // Find the counter with the given name
      const updatedCounters = prevCounters.map(counter => {
        if (counter.name === counterName) {
          // Create a new event
          const newEvent = {
            type: 'increment',
            date: today
          };
          
          // Return updated counter
          return {
            ...counter,
            count: counter.count + 1,
            lastIncrement: today,
            events: [...counter.events, newEvent]
          };
        }
        return counter;
      });
      
      // Update weekly statistics
      const newWeeklyStats = { ...weeklyStats };
      
      if (!newWeeklyStats.counts[today]) {
        newWeeklyStats.counts[today] = {};
      }
      
      if (!newWeeklyStats.counts[today][counterName]) {
        newWeeklyStats.counts[today][counterName] = 0;
      }
      
      newWeeklyStats.counts[today][counterName]++;
      
      // Update state
      setWeeklyStats(newWeeklyStats);
      
      // Save to localStorage
      saveToStorage(updatedCounters, newWeeklyStats);
      
      return updatedCounters;
    });
  };

  // Reset a counter
  const resetCounter = (counterName) => {
    const today = getTodayDateString();
    
    setCounters(prevCounters => {
      const updatedCounters = prevCounters.map(counter => {
        if (counter.name === counterName) {
          // Create a new event
          const newEvent = {
            type: 'reset',
            date: today
          };
          
          return {
            ...counter,
            count: 0,
            lastReset: today,
            events: [...counter.events, newEvent]
          };
        }
        return counter;
      });
      
      // Save to localStorage
      saveToStorage(updatedCounters);
      
      return updatedCounters;
    });
  };

  // Delete a counter
  const deleteCounter = (counterName) => {
    setCounters(prevCounters => {
      const updatedCounters = prevCounters.filter(counter => counter.name !== counterName);
      
      // Save to localStorage
      saveToStorage(updatedCounters);
      
      return updatedCounters;
    });
  };

  // Add a new counter
  const addCounter = (name, threshold) => {
    const today = getTodayDateString();
    
    setCounters(prevCounters => {
      // Check if a counter with this name already exists
      if (prevCounters.some(counter => counter.name === name)) {
        alert(`A counter named "${name}" already exists.`);
        return prevCounters;
      }
      
      const newCounter = {
        name: name,
        count: 0,
        threshold: threshold,
        lastIncrement: null,
        lastReset: today,
        events: [],
        activeConsequence: null
      };
      
      const updatedCounters = [...prevCounters, newCounter];
      
      // Save to localStorage
      saveToStorage(updatedCounters);
      
      return updatedCounters;
    });
  };

  // Reset all counters
  const resetAllCounters = () => {
    const today = getTodayDateString();
    
    setCounters(prevCounters => {
      const updatedCounters = prevCounters.map(counter => {
        // Create a new event
        const newEvent = {
          type: 'reset',
          date: today
        };
        
        return {
          ...counter,
          count: 0,
          lastReset: today,
          events: [...counter.events, newEvent]
        };
      });
      
      // Save to localStorage
      saveToStorage(updatedCounters);
      
      return updatedCounters;
    });
  };

  // Reset everything including localStorage
  const resetEverything = () => {
    clearStorage();
    initializeDefaultCounters();
  };
  
  // Update the active consequence for a counter
  const updateConsequence = (counterName, consequence) => {
    setCounters(prevCounters => {
      const updatedCounters = prevCounters.map(counter => {
        if (counter.name === counterName) {
          return {
            ...counter,
            activeConsequence: consequence
          };
        }
        return counter;
      });
      
      // Save to localStorage
      saveToStorage(updatedCounters);
      
      return updatedCounters;
    });
  };

  // Get weekly statistics data
  const getWeeklyStats = () => {
    let weekTotal = 0;
    let counterTotals = {};
    let perfectDays = 0;
    let dayCount = 0;
    
    // Go through each day in the weekly stats
    Object.keys(weeklyStats.counts).forEach(date => {
      const dayCounts = weeklyStats.counts[date];
      let dayTotal = 0;
      dayCount++;
      
      // Go through each counter for this day
      Object.keys(dayCounts).forEach(counter => {
        const count = dayCounts[counter];
        weekTotal += count;
        dayTotal += count;
        
        // Track totals by counter type
        if (!counterTotals[counter]) {
          counterTotals[counter] = 0;
        }
        counterTotals[counter] += count;
      });
      
      // If no mismatches on this day, it's a perfect day
      if (dayTotal === 0) {
        perfectDays++;
      }
    });
    
    // Find the most frequent mismatch
    let worstCounter = 'None';
    let worstCount = 0;
    
    Object.keys(counterTotals).forEach(counter => {
      if (counterTotals[counter] > worstCount) {
        worstCount = counterTotals[counter];
        worstCounter = counter;
      }
    });
    
    // Calculate average daily mismatches
    const averageDaily = dayCount > 0 ? (weekTotal / dayCount).toFixed(1) : 0;
    
    return {
      total: weekTotal,
      worst: {
        name: worstCount > 0 ? worstCounter : 'None',
        count: worstCount
      },
      perfectDays: perfectDays,
      averageDaily: averageDaily
    };
  };

  // Get data for charts
  const getChartData = (period) => {
    const today = new Date();
    const labels = [];
    const data = [];
    let daysToShow = 7;
    
    if (period === 'month') {
      daysToShow = 30;
    } else if (period === 'all') {
      // Find the earliest date in any counter events
      let earliestDate = today;
      
      counters.forEach(counter => {
        if (counter.events && counter.events.length > 0) {
          counter.events.forEach(event => {
            const dateObj = new Date(event.date);
            if (dateObj < earliestDate) {
              earliestDate = dateObj;
            }
          });
        }
      });
      
      daysToShow = Math.min(365, daysBetween(earliestDate, today) + 1);
    }
    
    // Get data for the specified period
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      labels.push(date.toLocaleDateString('en-US', {
        month: 'short', 
        day: 'numeric'
      }));
      
      // Count total mismatches for this day across all counters
      let dayTotal = 0;
      
      counters.forEach(counter => {
        if (counter.events) {
          const incrementEvents = counter.events.filter(
            event => event.type === 'increment' && event.date.startsWith(dateString)
          );
          dayTotal += incrementEvents.length;
        }
      });
      
      data.push(dayTotal);
    }
    
    return { labels, data };
  };

  // Fonction pour initialiser les compteurs avec un template
  const initializeCounters = (templateCounters) => {
    const today = getTodayDateString();
    
    // Formater correctement les compteurs avec leurs propriétés
    const formattedCounters = templateCounters.map(counter => ({
      name: counter.name,
      count: 0,
      threshold: counter.threshold,
      lastIncrement: null,
      lastReset: today,
      events: [],
      activeConsequence: null
    }));
    
    // Mettre à jour les compteurs dans l'état
    setCounters(formattedCounters);
    
    // Mettre à jour le localStorage avec la bonne clé
    localStorage.setItem('mismatchAppCounters', JSON.stringify(formattedCounters));
    
    // Mettre à jour les statistiques hebdomadaires
    const currentWeekStart = getStartOfWeek();
    setWeeklyStats({
      startDate: currentWeekStart,
      counts: {},
      perfectDays: 0
    });
    
    // Sauvegarder aussi les statistiques
    localStorage.setItem('mismatchAppWeeklyStats', JSON.stringify({
      startDate: currentWeekStart,
      counts: {},
      perfectDays: 0
    }));
  };

  return (
    <DataContext.Provider 
      value={{
        counters,
        weeklyStats,
        isLoading,
        initializeData,
        initializeDefaultCounters,
        incrementCounter,
        resetCounter,
        deleteCounter,
        addCounter,
        resetAllCounters,
        resetEverything,
        getWeeklyStats,
        getChartData,
        daysBetween,
        getTodayDateString,
        initializeCounters,
        updateConsequence
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}; 