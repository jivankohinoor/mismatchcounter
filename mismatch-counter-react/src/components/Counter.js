import React, { useState, useEffect, useCallback } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Plus, RotateCcw, Trash2, AlertTriangle, Calendar, Heart, AlarmClock, CheckCircle } from 'lucide-react';

const Counter = ({ name, counter }) => {
  const { config } = useConfig();
  const { incrementCounter, resetCounter, deleteCounter, daysBetween, getTodayDateString, updateConsequence } = useData();
  const { confirm, success } = useNotifications();
  
  // State for timer
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerId, setTimerId] = useState(null);
  
  // Calculate days without mistake
  const calculateDaysWithoutMistake = () => {
    const today = getTodayDateString();
    
    if (!counter.events || !Array.isArray(counter.events) || counter.events.length === 0) {
      return counter.lastReset ? 
        daysBetween(counter.lastReset, today) : 0;
    }
    
    // Find the most recent increment event
    const incrementEvents = counter.events
      .filter(event => event.type === 'increment')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // If there are no increment events, use the last reset date
    if (incrementEvents.length === 0) {
      return counter.lastReset ? 
        daysBetween(counter.lastReset, today) : 0;
    }
    
    // Return days since the last increment
    return daysBetween(incrementEvents[0].date, today);
  };
  
  const daysWithoutMistake = calculateDaysWithoutMistake();
  
  // Get random consequence if threshold is exceeded
  const getRandomConsequence = useCallback(() => {
    if (config.messages && config.messages.consequences && config.messages.consequences.length > 0) {
      // If a consequence is already set, return it
      if (counter.activeConsequence) {
        return counter.activeConsequence;
      }
      
      // Get random consequence from available ones
      const randomIndex = Math.floor(Math.random() * config.messages.consequences.length);
      const consequence = config.messages.consequences[randomIndex];
      
      return consequence;
    }
    return { text: "Time for a special consequence!", timeLimit: 120 }; // Default: 2 hours
  }, [config.messages, counter.activeConsequence]);
  
  // Generate a new consequence with timer
  const generateNewConsequence = useCallback(() => {
    // Only generate if we crossed the threshold and don't already have an active consequence
    if (counter.threshold > 0 && counter.count >= counter.threshold && !counter.activeConsequence) {
      // Special test consequences with very short timers
      const testConsequences = [
        { text: "⏱️ TEST: This consequence will expire in 30 seconds!", timeLimit: 0.5 }, // 30 seconds
        { text: "⏱️ TEST: You have just 1 minute to complete this!", timeLimit: 1 }, // 1 minute
        { text: "⏱️ TEST: Complete this quick task in 2 minutes!", timeLimit: 2 } // 2 minutes
      ];
      
      // Use test consequences if name contains "test"
      let consequence;
      
      if (counter.name.toLowerCase().includes('test')) {
        // Get a random test consequence
        consequence = testConsequences[Math.floor(Math.random() * testConsequences.length)];
      } else {
        // Normal consequence from config
        consequence = getRandomConsequence();
      }
      
      // Create the complete consequence object
      const newConsequence = {
        text: consequence.text,
        timeLimit: consequence.timeLimit,
        startTime: new Date().toISOString(),
        completed: false,
        doubled: false // Track if this has been doubled already
      };
      
      // Update the counter with the new consequence
      if (updateConsequence) {
        updateConsequence(counter.name, newConsequence);
      }
    }
  }, [counter.threshold, counter.count, counter.activeConsequence, counter.name, getRandomConsequence, updateConsequence]);
  
  // Function to mark a consequence as completed
  const completeConsequence = useCallback(() => {
    if (counter.activeConsequence) {
      const completedConsequence = {
        ...counter.activeConsequence,
        completed: true,
        completedAt: new Date().toISOString()
      };
      
      if (updateConsequence) {
        updateConsequence(counter.name, completedConsequence);
      }
      
      // Clear only this counter's timer
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
      }
      
      // Display success notification
      success(`Consequence for "${counter.name}" completed!`);
      
      // Play success sound
      try {
        const successAudio = new Audio('/sounds/success-sound.mp3');
        successAudio.play().catch(e => console.log('Audio play failed: Browser may require user interaction first'));
      } catch (e) {
        console.log('Audio not supported or not found');
      }
    }
  }, [counter.activeConsequence, counter.name, timerId, updateConsequence, success]);

  // Effect to manage active consequence and timer - specific to this counter only
  useEffect(() => {
    // Local variable to track if the component is mounted
    let isMounted = true;
    
    // Initialize once on mount - only create/clear timer when consequence changes
    const handleConsequence = () => {
      // Clear existing timer first
      if (timerId) {
        clearInterval(timerId);
        if (isMounted) setTimerId(null);
      }
      
      // Only proceed if we have an active, uncompleted consequence
      if (!counter.activeConsequence || counter.activeConsequence.completed) {
        return;
      }
      
      // Calculate remaining time
      const startTime = new Date(counter.activeConsequence.startTime);
      const timeLimit = counter.activeConsequence.timeLimit * 60 * 1000; // convert to ms
      const endTime = new Date(startTime.getTime() + timeLimit);
      const now = new Date();
      const remaining = Math.max(0, endTime - now);
      
      // Update time remaining display
      if (isMounted) setTimeRemaining(remaining);
      
      // Set up timer to update remaining time for this specific counter
      const timer = setInterval(() => {
        if (!isMounted) return; // Skip if unmounted
        
        const now = new Date();
        const remaining = Math.max(0, endTime - now);
        
        if (remaining <= 0) {
          // Time's up! Double the consequence
          clearInterval(timer);
          if (isMounted) setTimeRemaining(0);
          
          // Prevent doubling more than once (to avoid infinite doubling)
          if (counter.activeConsequence && !counter.activeConsequence.doubled && isMounted) {
            // Create doubled consequence with original timeLimit × 2
            const doubledConsequence = {
              ...counter.activeConsequence,
              text: `💥 DOUBLED: ${counter.activeConsequence.text}`,
              timeLimit: counter.activeConsequence.timeLimit * 2,
              startTime: new Date().toISOString(),
              doubled: true // Mark as doubled to prevent further doubling
            };
            
            // Play a sound if available
            try {
              const audio = new Audio('/sounds/alert-sound.mp3');
              audio.play().catch(e => console.log('Audio play failed: Browser may require user interaction first'));
            } catch (e) {
              console.log('Audio not supported or not found');
            }
            
            // Update only this counter with the doubled consequence
            if (updateConsequence) {
              updateConsequence(counter.name, doubledConsequence);
            }
          }
        } else {
          if (isMounted) setTimeRemaining(remaining);
        }
      }, 1000);
      
      // Save the timer ID
      if (isMounted) setTimerId(timer);
    };
    
    // Run the consequence handler
    handleConsequence();
    
    // Clean up function
    return () => {
      isMounted = false;
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [counter.activeConsequence, counter.name, updateConsequence]); // Removed timerId from dependencies
  
  // Separate effect to handle generating new consequences
  useEffect(() => {
    // Generate a new consequence if threshold is exceeded and no active consequence
    if (counter.threshold > 0 && counter.count >= counter.threshold && !counter.activeConsequence) {
      generateNewConsequence();
    }
  }, [counter.threshold, counter.count, counter.activeConsequence, generateNewConsequence]);
  
  // Format time remaining in hours:minutes:seconds
  const formatTimeRemaining = (ms) => {
    if (!ms) return "00:00:00";
    
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Format time limit for display
  const formatTimeLimit = (minutes) => {
    if (!minutes) return "";
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else if (minutes === 60) {
      return "1 hour";
    } else if (minutes % 60 === 0) {
      return `${minutes / 60} hours`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
  };
  
  // Handle increment click
  const handleIncrement = () => {
    // Increment the counter
    incrementCounter(name);
    
    // Force save to localStorage after increment
    setTimeout(() => {
      // This will trigger the useEffect that saves to localStorage
      const event = new CustomEvent('mismatch-increment', { detail: { counterName: name } });
      document.dispatchEvent(event);
      
      // Check if this increment will trigger a consequence
      if (counter.threshold > 0 && counter.count + 1 >= counter.threshold && !counter.activeConsequence) {
        generateNewConsequence();
      }
    }, 100);
  };
  
  // Handle reset click
  const handleReset = () => {
    // Reset counter and clear any active consequence
    resetCounter(name);
    
    // Clear our local timer
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    
    // Clear the active consequence from the counter
    if (counter.activeConsequence && updateConsequence) {
      updateConsequence(counter.name, null);
    }
  };
  
  // Handle delete click
  const handleDelete = () => {
    confirm(
      `Are you sure you want to delete the counter for "${name}"?`,
      () => {
        deleteCounter(name);
        success(`Counter "${name}" has been deleted.`);
      }
    );
  };
  
  return (
    <div 
      className="counter" 
      data-counter-name={name}
      role="listitem"
      aria-label={`Mismatch counter: ${name}`}
    >
      {/* Counter Details */}
      <div className="counter-details">
        {/* Threshold Warning Badge */}
        {counter.threshold > 0 && (
          <div 
            className={`threshold-warning ${counter.count >= counter.threshold ? 'threshold-exceeded' : ''}`}
          >
            <AlertTriangle size={12} style={{marginRight: '3px'}} />
            Limit: {counter.threshold}
          </div>
        )}
        <span className="counter-name">
          <Heart size={16} className="counter-icon" />
          {counter.name}
        </span>
        <span className="counter-stats">
          <Calendar size={14} style={{marginRight: '5px', opacity: 0.7}} />
          {daysWithoutMistake} {daysWithoutMistake === 1 ? 'day' : 'days'} without mistake
        </span>
      </div>
      
      {/* Counter Buttons */}
      <div className="counter-buttons">
        <span className="count">{counter.count}</span>
        
        <button 
          className="increment-btn" 
          aria-label={`Increment ${counter.name}`}
          onClick={handleIncrement}
          type="button"
        >
          <Plus size={20} />
        </button>
        
        <button 
          className="delete-btn" 
          aria-label={`Delete ${counter.name} counter`}
          onClick={handleDelete}
          type="button"
        >
          <Trash2 size={18} />
        </button>
        
        {/* Reserve space for Reset button even when not visible */}
        <div className="reset-btn-container" style={{ width: '40px', height: '40px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
          {counter.count > 0 && (
            <button 
              className="forgive-btn" 
              aria-label={`Forgive ${counter.name}`}
              onClick={handleReset}
              type="button"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      </div>
      
      {/* Consequence Alert if threshold is exceeded */}
      {counter.threshold > 0 && counter.count >= counter.threshold && (
        <div className="consequence-alert">
          <h3>
            {counter.activeConsequence ? 'Active Consequence' : 'Consequence Triggered!'}
            {timeRemaining !== null && (
              <span className="consequence-timer">
                <AlarmClock size={16} className="timer-icon" />
                <span className={timeRemaining < 600000 ? 'time-critical' : ''}>
                  {formatTimeRemaining(timeRemaining)}
                </span>
                <span className="time-limit">
                  {counter.activeConsequence && ` (${formatTimeLimit(counter.activeConsequence.timeLimit)})`}
                </span>
              </span>
            )}
          </h3>
          <p>
            {counter.activeConsequence ? counter.activeConsequence.text : getRandomConsequence().text}
          </p>
          {counter.activeConsequence && !counter.activeConsequence.completed && (
            <button 
              className="complete-consequence-btn" 
              onClick={completeConsequence}
              aria-label="Mark consequence as completed"
            >
              <CheckCircle size={16} />
              Mark as Completed
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Counter; 