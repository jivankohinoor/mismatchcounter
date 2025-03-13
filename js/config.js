// Configuration System for Mismatch Counter App
const AppConfig = {
    // App information
    app: {
        version: "1.0.0",
        name: "Mismatch Counter",
        description: "A cute app to track mismatches in a relationship"
    },
    
    // Recipient information
    recipient: {
        name: "Allison",
        relationship: "wife",
        birthdayDate: "March 5, 2025 18:00:00",
        secretCode: "iloveyoubutyoushouldnotpeekatthecode!"
    },
    
    // Sender information
    sender: {
        name: "Your husband"
    },
    
    // Theme settings
    theme: {
        mainColor: "#ff69b4",
        secondaryColor: "#4682b4",
        backgroundColor: "#fff0f5",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        iconEmoji: "🐱"
    },
    
    // Custom messages
    messages: {
        loveMessages: [
            "You make every day better just by being you. I love you! 💖",
            "Thank you for putting up with my little quirks. You're amazing! 😘",
            "I may forget to close the dishwasher, but I'll never forget how much I love you! 💕",
            "Your smile makes my day, every single day! 😊",
            "Thanks for keeping me in check. It's one of the many reasons I love you! 🥰",
            "You and the cats are my favorite people in the world! 🐱❤️",
            "I promise to try harder with the dishwasher door... maybe. 😜",
            "You're purr-fect in every way! 🐱💕",
            "My favorite place is wherever you are. 💘",
            "Even when I mess up, your love never wavers. Thank you! ❤️",
            "You're the cat's meow! I love you fur-ever! 🐾",
            "I'm so lucky to have you as my wife! 💍",
            "You're the best thing that ever happened to me! 💫",
            "Every day with you is a gift! 🎁",
            "Your patience with me deserves a trophy! 🏆",
            "Happy Birthday to the most amazing person in the world! 🎂",
            "Wishing you a purr-fect birthday, my love! 🐱🎉",
            "Birthday kisses and wishes for my amazing one! 💋✨",
            "Let's make some more memories together! 💖",
            "Let's have a big hug and a big kiss! 💋",
            "I'm sorry for what I said when I was hungry. I love you! 💖"
        ],
        
        consequences: [
            "Time to bring home flowers! 💐",
            "A fancy dinner is in order! 🍽️",
            "Looks like someone owes a massage! 💆‍♀️",
            "Movie night - your choice! 🎬",
            "Special cuddle duty for a week! 🥰",
            "Chocolate delivery required! 🍫",
            "Time for a special date night! ❤️",
            "Breakfast in bed coming up! 🥞",
            "I'm cooking your favorite food! 🍕",
            "Time for a special treat! 🎁"
        ],
        
        birthdayTitle: "🎉 Happy Birthday! 🎂",
        birthdayMessage: "On this special day, I wanted to create something unique just for you! This little app will help you keep track of all my silly mismatches, but more importantly, it's a reminder of how much I love you, even with all my imperfections! I hope your day is as wonderful as you are! 💕",
        footerMessage: "Made with ❤️ for your special day",
        countdownMessage: "A special gift for your Birthday!"
    },
    
    // Default counter templates
    counterTemplates: {
        romantic: [
            { name: "Left the dishwasher door open", threshold: 5 },
            { name: "Put the wrong knives in the dishwasher", threshold: 3 },
            { name: "Forgot to call whomever I was supposed to call", threshold: 3 },
            { name: "Didn't clean my mess before going to bed", threshold: 1 },
            { name: "Didn't empty the pet litter box", threshold: 2 },
            { name: "Didn't take out the trash", threshold: 1 },
            { name: "Didn't put the vacuum cleaner away", threshold: 5 },
            { name: "Yelled for no reason", threshold: 3 },
            { name: "Got mad for no reason", threshold: 3 },
            { name: "Talked about work too much", threshold: 5 }
        ],
        
        roommates: [
            { name: "Left dishes in the sink", threshold: 3 },
            { name: "Didn't pay bills on time", threshold: 1 },
            { name: "Forgot to buy shared groceries", threshold: 2 },
            { name: "Hogged the bathroom", threshold: 3 },
            { name: "Left lights on when not home", threshold: 5 },
            { name: "Had friends over without asking", threshold: 2 },
            { name: "Played music too loud", threshold: 3 },
            { name: "Didn't clean common areas", threshold: 2 },
            { name: "Used roommate's stuff without asking", threshold: 1 },
            { name: "Didn't take out trash when full", threshold: 2 }
        ],
        
        friends: [
            { name: "Showed up late", threshold: 3 },
            { name: "Cancelled plans last minute", threshold: 2 },
            { name: "Forgot important date", threshold: 1 },
            { name: "Didn't respond to messages", threshold: 3 },
            { name: "Borrowed something and didn't return", threshold: 2 },
            { name: "Spilled a secret", threshold: 1 },
            { name: "Said something thoughtless", threshold: 2 },
            { name: "Forgot to bring what I promised", threshold: 3 },
            { name: "Made a bad joke", threshold: 10 },
            { name: "Left you with the bill", threshold: 1 }
        ],
        
        family: [
            { name: "Forgot family event", threshold: 2 },
            { name: "Didn't call when promised", threshold: 3 },
            { name: "Didn't help with chores", threshold: 3 },
            { name: "Left a mess in common areas", threshold: 4 },
            { name: "Used the last of something without replacing", threshold: 3 },
            { name: "Borrowed without asking", threshold: 2 },
            { name: "Forgot to feed pets", threshold: 1 },
            { name: "Was grumpy for no reason", threshold: 5 },
            { name: "Spent too much time on phone", threshold: 4 },
            { name: "Forgot to pass on messages", threshold: 2 }
        ]
    },
    
    // Selected template (used at initialization)
    selectedTemplate: "romantic",
    
    // Advanced settings
    advanced: {
        randomMessageInterval: 10000, // milliseconds
        enableAnimations: true,
        debugMode: false,
        autoSaveInterval: 60000 // milliseconds
    }
};

// Helper functions for configuration management
const ConfigManager = {
    // Save configuration to localStorage
    saveConfig: function(config) {
        try {
            // Validate config before saving
            if (!this.validateConfig(config)) {
                console.error("Invalid configuration data");
                return false;
            }
            
            localStorage.setItem('mismatchAppConfig', JSON.stringify(config));
            
            // If auto-save is enabled, setup auto-save timer
            if (config.advanced && config.advanced.autoSaveInterval > 0) {
                this.setupAutoSave(config.advanced.autoSaveInterval);
            }
            
            return true;
        } catch (e) {
            console.error("Error saving configuration: ", e);
            return false;
        }
    },
    
    // Load configuration from localStorage
    loadConfig: function() {
        try {
            const savedConfig = localStorage.getItem('mismatchAppConfig');
            
            if (!savedConfig) {
                console.log("No saved configuration found, using defaults");
                return this.mergeWithDefaults({});
            }
            
            const parsedConfig = JSON.parse(savedConfig);
            
            // Merge with defaults to ensure all required fields exist
            return this.mergeWithDefaults(parsedConfig);
            
        } catch (e) {
            console.error("Error loading configuration: ", e);
            return this.mergeWithDefaults({});
        }
    },
    
    // Merge partial config with defaults to ensure all fields exist
    mergeWithDefaults: function(partialConfig) {
        // Deep copy of defaults to avoid modifying original
        const result = JSON.parse(JSON.stringify(AppConfig));
        
        // Helper function for recursive merging
        const recursiveMerge = (target, source) => {
            for (const key in source) {
                if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    // If property doesn't exist in target, create it
                    if (!target[key]) target[key] = {};
                    recursiveMerge(target[key], source[key]);
                } else {
                    // For arrays and primitives, just replace the value
                    target[key] = source[key];
                }
            }
        };
        
        // Merge partial config into default config
        recursiveMerge(result, partialConfig);
        return result;
    },
    
    // Validate configuration object
    validateConfig: function(config) {
        // Check for required sections
        if (!config.recipient || !config.theme || !config.messages) {
            console.error("Missing required configuration sections");
            return false;
        }
        
        // Validate recipient info
        if (!config.recipient.name || !config.recipient.birthdayDate) {
            console.error("Missing required recipient information");
            return false;
        }
        
        // Validate theme
        if (!config.theme.mainColor || !config.theme.secondaryColor || !config.theme.backgroundColor) {
            console.error("Missing required theme settings");
            return false;
        }
        
        // Validate message arrays
        if (!Array.isArray(config.messages.loveMessages) || config.messages.loveMessages.length === 0) {
            console.error("Love messages array is empty or invalid");
            return false;
        }
        
        if (!Array.isArray(config.messages.consequences) || config.messages.consequences.length === 0) {
            console.error("Consequences array is empty or invalid");
            return false;
        }
        
        return true;
    },
    
    // Reset configuration to defaults
    resetConfig: function() {
        try {
            localStorage.removeItem('mismatchAppConfig');
            return JSON.parse(JSON.stringify(AppConfig)); // Return a deep copy of defaults
        } catch (e) {
            console.error("Error resetting configuration: ", e);
            return AppConfig;
        }
    },
    
    // Apply theme from configuration
    applyTheme: function(theme) {
        document.documentElement.style.setProperty('--main-color', theme.mainColor);
        document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
        document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
        document.documentElement.style.setProperty('--font-family', theme.fontFamily);
        
        // Apply animations based on settings
        const config = this.loadConfig();
        if (config.advanced && config.advanced.enableAnimations === false) {
            document.documentElement.style.setProperty('--transition-speed', '0s');
            document.documentElement.style.setProperty('--animation-duration', '0s');
        } else {
            document.documentElement.style.setProperty('--transition-speed', '0.3s');
            document.documentElement.style.setProperty('--animation-duration', '1s');
        }
    },
    
    // Get theme presets
    getThemePresets: function() {
        return {
            "pink": {
                mainColor: "#ff69b4",
                secondaryColor: "#4682b4", 
                backgroundColor: "#fff0f5",
                fontFamily: "'Comic Sans MS', cursive, sans-serif",
                iconEmoji: "🐱"
            },
            "blue": {
                mainColor: "#4682b4",
                secondaryColor: "#ff69b4",
                backgroundColor: "#f0f8ff",
                fontFamily: "'Arial', sans-serif",
                iconEmoji: "🐶"
            },
            "dark": {
                mainColor: "#9370db",
                secondaryColor: "#20b2aa",
                backgroundColor: "#2c2c2c",
                fontFamily: "'Courier New', monospace",
                iconEmoji: "🌙"
            },
            "nature": {
                mainColor: "#228B22",
                secondaryColor: "#DAA520",
                backgroundColor: "#F5F5DC",
                fontFamily: "'Georgia', serif",
                iconEmoji: "🌿"
            }
        };
    },
    
    // Apply a specific theme preset
    applyThemePreset: function(presetName) {
        const presets = this.getThemePresets();
        if (presets[presetName]) {
            const config = this.loadConfig();
            config.theme = presets[presetName];
            this.saveConfig(config);
            this.applyTheme(config.theme);
            return true;
        }
        return false;
    },
    
    // Auto-save configuration periodically
    setupAutoSave: function(interval) {
        // Clear any existing timer
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        
        // Set up new timer if interval is valid
        if (interval && interval > 0) {
            this.autoSaveTimer = setInterval(() => {
                const config = this.loadConfig();
                this.saveConfig(config);
                
                if (config.advanced && config.advanced.debugMode) {
                    console.log("Auto-saved configuration at", new Date().toLocaleTimeString());
                }
            }, interval);
        }
    },
    
    // Export configuration as a JSON file
    exportConfig: function(config) {
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "mismatch_config.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            return true;
        } catch (e) {
            console.error("Error exporting configuration:", e);
            return false;
        }
    },
    
    // Import configuration from a JSON file
    importConfig: function(jsonString) {
        try {
            const config = JSON.parse(jsonString);
            
            // Validate the imported configuration
            if (!this.validateConfig(config)) {
                console.error("Invalid imported configuration");
                return null;
            }
            
            // Merge with defaults to ensure all fields exist
            const mergedConfig = this.mergeWithDefaults(config);
            
            // Save and return the config
            this.saveConfig(mergedConfig);
            return mergedConfig;
        } catch (e) {
            console.error("Error importing configuration: ", e);
            return null;
        }
    },
    
    // Get default counters based on selected template
    getDefaultCounters: function(config) {
        return config.counterTemplates[config.selectedTemplate] || config.counterTemplates.romantic;
    },
    
    // Add a custom love message
    addCustomLoveMessage: function(message) {
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return false;
        }
        
        try {
            const config = this.loadConfig();
            
            // Avoid duplicates
            if (!config.messages.loveMessages.includes(message)) {
                config.messages.loveMessages.push(message);
                this.saveConfig(config);
                return true;
            }
            
            return false;
        } catch (e) {
            console.error("Error adding custom love message:", e);
            return false;
        }
    },
    
    // Add a custom consequence
    addCustomConsequence: function(consequence) {
        if (!consequence || typeof consequence !== 'string' || consequence.trim() === '') {
            return false;
        }
        
        try {
            const config = this.loadConfig();
            
            // Avoid duplicates
            if (!config.messages.consequences.includes(consequence)) {
                config.messages.consequences.push(consequence);
                this.saveConfig(config);
                return true;
            }
            
            return false;
        } catch (e) {
            console.error("Error adding custom consequence:", e);
            return false;
        }
    },
    
    // Format date for display
    formatDate: function(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString;
        }
    },
    
    // Auto-save timer reference
    autoSaveTimer: null
}; 