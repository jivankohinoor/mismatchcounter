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
    
    // Check birthday status
    BirthdayManager.checkBirthdayStatus(config);
    
    // Set up message rotation interval
    setInterval(MismatchUI.displayRandomLoveMessage, 10000);
});