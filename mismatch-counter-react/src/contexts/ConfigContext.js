import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultConfig from '../utils/defaultConfig';
import profiles from '../utils/profiles';
import counterTemplates from '../utils/counterTemplates';

// Create a context for the configuration
const ConfigContext = createContext();

// Create a provider component
export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load the configuration from localStorage on component mount
  useEffect(() => {
    const loadConfig = () => {
      try {
        const savedConfig = localStorage.getItem('mismatchConfig');
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          setConfig(parsedConfig);
          setIsFirstTime(false);
        }
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Function to save configuration
  const saveConfig = (newConfig) => {
    try {
      localStorage.setItem('mismatchConfig', JSON.stringify(newConfig));
      setConfig(newConfig);
      setIsFirstTime(false);
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  // Function to reset configuration
  const resetConfig = () => {
    saveConfig(defaultConfig);
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
  const applyTheme = () => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.theme.mainColor);
    root.style.setProperty('--secondary-color', config.theme.secondaryColor);
    root.style.setProperty('--background-color', config.theme.backgroundColor);
    root.style.setProperty('--icon-emoji', config.theme.iconEmoji);
    root.style.setProperty('--font-family', config.theme.fontFamily);
  };

  useEffect(() => {
    applyTheme();
  }, [config.theme]);

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
    <ConfigContext.Provider value={{
      config,
      saveConfig,
      resetConfig,
      isFirstTime,
      isLoading,
      exportConfig,
      importConfig,
      getThemePresets,
      applyThemePreset,
      applyTheme,
      getDefaultCounters,
      addCustomLoveMessage,
      addCustomConsequence
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

// Custom hook to use the config context
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}; 