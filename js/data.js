// Data Management Module
const MismatchData = {
    counters: {},
    weeklyStats: {
        startDate: null,
        counts: {},
        perfectDays: 0
    },
    
    // Initialize default counters if no saved data exists
    initializeData: function(config) {
        try {
            this.loadFromStorage();
            
            if (Object.keys(this.counters).length === 0) {
                this.initializeDefaultCounters(config);
            }
            
            // Check if we need to reset weekly stats
            const currentWeekStart = this.getStartOfWeek();
            if (this.weeklyStats.startDate !== currentWeekStart) {
                this.weeklyStats = {
                    startDate: currentWeekStart,
                    counts: {},
                    perfectDays: 0
                };
                this.saveToStorage();
            }
        } catch (e) {
            console.error("Error initializing data: ", e);
            // Fallback to in-memory only if localStorage is not available
            this.initializeDefaultCounters(config);
        }
    },
    
    // Initialize with default counters from config
    initializeDefaultCounters: function(config) {
        const today = this.getTodayDateString();
        const defaultCounters = ConfigManager.getDefaultCounters(config);
        
        defaultCounters.forEach(counter => {
            this.counters[counter.name] = {
                count: 0,
                threshold: counter.threshold,
                lastIncrement: null,
                lastReset: today,
                history: {}
            };
        });
        
        this.weeklyStats.startDate = this.getStartOfWeek();
        this.saveToStorage();
    },
    
    // Save data to localStorage with error handling
    saveToStorage: function() {
        try {
            localStorage.setItem('mismatchAppCounters', JSON.stringify(this.counters));
            localStorage.setItem('mismatchAppWeeklyStats', JSON.stringify(this.weeklyStats));
            return true;
        } catch (e) {
            console.error("Error saving to localStorage: ", e);
            return false;
        }
    },
    
    // Load data from localStorage with error handling
    loadFromStorage: function() {
        try {
            const savedCounters = localStorage.getItem('mismatchAppCounters');
            const savedStats = localStorage.getItem('mismatchAppWeeklyStats');
            
            if (savedCounters) {
                this.counters = JSON.parse(savedCounters);
            }
            
            if (savedStats) {
                this.weeklyStats = JSON.parse(savedStats);
            } else {
                this.weeklyStats.startDate = this.getStartOfWeek();
            }
            return true;
        } catch (e) {
            console.error("Error loading from localStorage: ", e);
            return false;
        }
    },
    
    // Clear all localStorage data
    clearStorage: function() {
        try {
            localStorage.removeItem('mismatchAppCounters');
            localStorage.removeItem('mismatchAppWeeklyStats');
            return true;
        } catch (e) {
            console.error("Error clearing localStorage: ", e);
            return false;
        }
    },
    
    // Get start of current week (Sunday)
    getStartOfWeek: function() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const diff = now.getDate() - day;
        return new Date(now.setDate(diff)).toISOString().split('T')[0]; // Format as YYYY-MM-DD
    },
    
    // Get today's date in YYYY-MM-DD format
    getTodayDateString: function() {
        return new Date().toISOString().split('T')[0];
    },
    
    // Calculate days between two dates
    daysBetween: function(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
    },
    
    // Increment a counter
    incrementCounter: function(counterName) {
        const today = this.getTodayDateString();
        
        // Update counter
        this.counters[counterName].count++;
        this.counters[counterName].lastIncrement = today;
        
        // Record in history
        if (!this.counters[counterName].history) {
            this.counters[counterName].history = {};
        }
        
        if (!this.counters[counterName].history[today]) {
            this.counters[counterName].history[today] = 0;
        }
        
        this.counters[counterName].history[today]++;
        
        // Update weekly statistics
        if (!this.weeklyStats.counts[today]) {
            this.weeklyStats.counts[today] = {};
        }
        
        if (!this.weeklyStats.counts[today][counterName]) {
            this.weeklyStats.counts[today][counterName] = 0;
        }
        
        this.weeklyStats.counts[today][counterName]++;
        
        this.saveToStorage();
        return this.counters[counterName];
    },
    
    // Reset a counter
    resetCounter: function(counterName) {
        const today = this.getTodayDateString();
        this.counters[counterName].count = 0;
        this.counters[counterName].lastReset = today;
        this.saveToStorage();
    },
    
    // Delete a counter
    deleteCounter: function(counterName) {
        delete this.counters[counterName];
        this.saveToStorage();
    },
    
    // Add a new counter
    addCounter: function(name, threshold) {
        const today = this.getTodayDateString();
        
        this.counters[name] = {
            count: 0,
            threshold: threshold,
            lastIncrement: null,
            lastReset: today,
            history: {}
        };
        
        this.saveToStorage();
    },
    
    // Reset all counters
    resetAllCounters: function() {
        const today = this.getTodayDateString();
        
        Object.keys(this.counters).forEach(key => {
            this.counters[key].count = 0;
            this.counters[key].lastReset = today;
        });
        
        this.saveToStorage();
    },
    
    // Reset everything including localStorage
    resetEverything: function(config) {
        this.clearStorage();
        this.counters = {};
        this.weeklyStats = {
            startDate: this.getStartOfWeek(),
            counts: {},
            perfectDays: 0
        };
        this.initializeDefaultCounters(config);
    },
    
    // Get weekly statistics data
    getWeeklyStats: function() {
        let weekTotal = 0;
        let counterTotals = {};
        let perfectDays = 0;
        let dayCount = 0;
        
        // Go through each day in the weekly stats
        Object.keys(this.weeklyStats.counts).forEach(date => {
            const dayCounts = this.weeklyStats.counts[date];
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
    },
    
    // Get data for charts
    getChartData: function(period) {
        const today = new Date();
        const labels = [];
        const data = [];
        let daysToShow = 7;
        
        if (period === 'month') {
            daysToShow = 30;
        } else if (period === 'all') {
            // Find the earliest date in any counter history
            let earliestDate = today;
            Object.keys(this.counters).forEach(counterName => {
                const counter = this.counters[counterName];
                if (counter.history) {
                    Object.keys(counter.history).forEach(date => {
                        const dateObj = new Date(date);
                        if (dateObj < earliestDate) {
                            earliestDate = dateObj;
                        }
                    });
                }
            });
            
            daysToShow = Math.min(365, this.daysBetween(earliestDate, today) + 1);
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
            
            Object.keys(this.counters).forEach(counterName => {
                const counter = this.counters[counterName];
                if (counter.history && counter.history[dateString]) {
                    dayTotal += counter.history[dateString];
                }
            });
            
            data.push(dayTotal);
        }
        
        return { labels, data };
    }
}; 