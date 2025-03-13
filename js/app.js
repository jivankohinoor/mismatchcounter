// Main Application Entry Point
document.addEventListener('DOMContentLoaded', function() {
    // Load configuration
    const config = ConfigManager.loadConfig();
    
    // Apply theme and update UI with configuration
    ConfigManager.applyTheme(config.theme);
    MismatchUI.updateUIFromConfig(config);
    
    // Initialize data
    MismatchData.initializeData(config);
    
    // Initialize UI components
    MismatchUI.displayCounters();
    MismatchUI.displayRandomLoveMessage();
    MismatchUI.enhanceAccessibility();
    
    // Set up event listeners
    MismatchEvents.setupEventListeners();
    
    // Initialize theme preview for configuration UI
    ConfigUI.initializeThemePreview();
    
    // Create advanced settings UI
    ConfigUI.createAdvancedSettingsUI();
    
    // Check birthday status
    BirthdayManager.checkBirthdayStatus(config);
    
    // Set up message rotation interval using the configured interval
    let messageInterval = config.advanced && config.advanced.randomMessageInterval ? 
        config.advanced.randomMessageInterval : 10000;
    
    setInterval(MismatchUI.displayRandomLoveMessage, messageInterval);
    
    // Set up auto-save if configured
    if (config.advanced && config.advanced.autoSaveInterval > 0) {
        ConfigManager.setupAutoSave(config.advanced.autoSaveInterval);
    }
    
    // Log debug message if debug mode is enabled
    if (config.advanced && config.advanced.debugMode) {
        console.log("Mismatch Counter App initialized with config:", config);
    }
});