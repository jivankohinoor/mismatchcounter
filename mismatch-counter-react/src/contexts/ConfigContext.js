import React, { createContext, useState, useEffect, useContext } from 'react';
import defaultConfig from '../utils/defaultConfig';
import profiles from '../utils/profiles';

// Create a context for the configuration
export const ConfigContext = createContext();

// Create a provider component
export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  // Load the configuration from localStorage on component mount
  useEffect(() => {
    loadConfig();
  }, []);

  // Function to load configuration
  const loadConfig = () => {
    setIsLoading(true);
    try {
      const savedConfig = localStorage.getItem('mismatchAppConfig');
      
      if (!savedConfig) {
        console.log("No saved configuration found, using defaults");
        setConfig(defaultConfig);
      } else {
        const parsedConfig = JSON.parse(savedConfig);
        // Merge with defaults to ensure all required fields exist
        setConfig(mergeWithDefaults(parsedConfig));
      }
    } catch (e) {
      console.error("Error loading configuration: ", e);
      setConfig(defaultConfig);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save configuration
  const saveConfig = (newConfig) => {
    try {
      // Store new config in localStorage
      localStorage.setItem('mismatchAppConfig', JSON.stringify(newConfig));
      // Update state
      setConfig(newConfig);
      // Apply the theme
      if (newConfig.theme) {
        applyTheme(newConfig.theme);
      }
      return true;
    } catch (e) {
      console.error("Error saving configuration: ", e);
      return false;
    }
  };

  // Function to reset configuration
  const resetConfig = () => {
    try {
      localStorage.removeItem('mismatchAppConfig');
      setConfig(defaultConfig);
      return true;
    } catch (e) {
      console.error("Error resetting configuration: ", e);
      return false;
    }
  };

  // Function to validate configuration
  const validateConfig = (config) => {
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
  };

  // Merge partial config with defaults
  const mergeWithDefaults = (partialConfig) => {
    // Deep copy of defaults to avoid modifying original
    const result = JSON.parse(JSON.stringify(defaultConfig));
    
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
  };

  // Function to export configuration
  const exportConfig = () => {
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
  };

  // Function to import configuration
  const importConfig = (jsonString) => {
    try {
      const importedConfig = JSON.parse(jsonString);
      
      // Validate the imported configuration
      if (!validateConfig(importedConfig)) {
        console.error("Invalid imported configuration");
        return false;
      }
      
      // Merge with defaults to ensure all fields exist
      const mergedConfig = mergeWithDefaults(importedConfig);
      
      // Save and update the config
      saveConfig(mergedConfig);
      return true;
    } catch (e) {
      console.error("Error importing configuration: ", e);
      return false;
    }
  };

  // Get theme presets
  const getThemePresets = () => {
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
  };

  // Apply theme preset
  const applyThemePreset = (presetName) => {
    const presets = getThemePresets();
    if (presets[presetName]) {
      const newConfig = { ...config };
      newConfig.theme = presets[presetName];
      saveConfig(newConfig);
      return true;
    }
    return false;
  };

  // Apply theme CSS variables
  const applyTheme = (theme) => {
    document.documentElement.style.setProperty('--main-color', theme.mainColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
    document.documentElement.style.setProperty('--font-family', theme.fontFamily);
    
    // Appliquer les animations basées sur les paramètres
    if (config.advanced && config.advanced.enableAnimations === false) {
      document.documentElement.style.setProperty('--transition-speed', '0s');
      document.documentElement.style.setProperty('--animation-duration', '0s');
    } else {
      document.documentElement.style.setProperty('--transition-speed', '0.3s');
      document.documentElement.style.setProperty('--animation-duration', '1s');
    }
  };
  
  // Auto-save timer reference
  let autoSaveTimer = null;

  // Set up auto-save
  const setupAutoSave = (interval) => {
    // Clear any existing timer
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
    }
    
    // Set up new timer if interval is valid
    if (interval && interval > 0) {
      autoSaveTimer = setInterval(() => {
        localStorage.setItem('mismatchAppConfig', JSON.stringify(config));
        
        if (config.advanced && config.advanced.debugMode) {
          console.log("Auto-saved configuration at", new Date().toLocaleTimeString());
        }
      }, interval);
    }
  };

  // Apply theme when config changes
  useEffect(() => {
    if (!isLoading) {
      applyTheme(config.theme);
      
      // Set up auto-save if enabled
      if (config.advanced && config.advanced.autoSaveInterval > 0) {
        setupAutoSave(config.advanced.autoSaveInterval);
      }
    }
    
    // Cleanup function to clear auto-save timer
    return () => {
      if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
      }
    };
  }, [config]);

  // Get default counters based on selected template
  const getDefaultCounters = () => {
    return profiles[config.selectedTemplate] || profiles.romantic;
  };

  // Add a custom love message
  const addCustomLoveMessage = (message) => {
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return false;
    }
    
    try {
      const newConfig = { ...config };
      
      // Avoid duplicates
      if (!newConfig.messages.loveMessages.includes(message)) {
        newConfig.messages.loveMessages.push(message);
        saveConfig(newConfig);
        return true;
      }
      
      return false;
    } catch (e) {
      console.error("Error adding custom love message:", e);
      return false;
    }
  };

  // Add a custom consequence
  const addCustomConsequence = (consequence) => {
    if (!consequence || typeof consequence !== 'string' || consequence.trim() === '') {
      return false;
    }
    
    try {
      const newConfig = { ...config };
      
      // Avoid duplicates
      if (!newConfig.messages.consequences.includes(consequence)) {
        newConfig.messages.consequences.push(consequence);
        saveConfig(newConfig);
        return true;
      }
      
      return false;
    } catch (e) {
      console.error("Error adding custom consequence:", e);
      return false;
    }
  };

  return (
    <ConfigContext.Provider 
      value={{
        config,
        isLoading,
        saveConfig,
        loadConfig,
        resetConfig,
        exportConfig,
        importConfig,
        getThemePresets,
        applyThemePreset,
        applyTheme,
        getDefaultCounters,
        addCustomLoveMessage,
        addCustomConsequence
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

// Custom hook to use the config context
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}; 