// Event Handlers Module
const MismatchEvents = {
    // Set up all event listeners
    setupEventListeners: function() {
        // Add counter button
        document.getElementById('add-counter-btn').addEventListener('click', this.addCounter);
        
        // Reset all counters button
        document.getElementById('reset-all-btn').addEventListener('click', this.resetAllCounters);
        
        // Clear storage button
        document.getElementById('clear-storage-btn').addEventListener('click', this.resetEverything);
        
        // Add counter with Enter key
        document.getElementById('new-counter-name').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('add-counter-btn').click();
            }
        });
        
        // Check unlock code
        document.getElementById("unlock-button").addEventListener("click", this.unlockApp);
        
        // Open gift button
        document.getElementById("birthday-button").addEventListener("click", function() {
            document.getElementById("birthday-message").style.display = "none";
        });
        
        // Allow Enter key to submit code
        document.getElementById("unlock-code").addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                document.getElementById("unlock-button").click();
            }
        });
        
        // Set up history tab clicks
        document.querySelectorAll('.history-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                const tabId = this.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');
                
                // Update chart immediately when switching tabs
                MismatchUI.updateCharts();
            });
        });

        // Set up configuration panel events
        this.setupConfigPanelEvents();
        
        // Add event listeners to counter buttons (increment, delete, forgive)
        this.addCounterEventListeners();
    },
    
    // Add event listeners to dynamically created counter buttons
    addCounterEventListeners: function() {
        // Increment buttons
        document.querySelectorAll('.increment-btn').forEach(button => {
            button.addEventListener('click', function() {
                const counterName = this.getAttribute('data-counter');
                MismatchEvents.incrementCounter(counterName);
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const counterName = this.getAttribute('data-counter');
                if (confirm(`Are you sure you want to delete the counter for "${counterName}"?`)) {
                    MismatchEvents.deleteCounter(counterName);
                }
            });
        });
        
        // Forgive buttons
        document.querySelectorAll('.forgive-btn').forEach(button => {
            button.addEventListener('click', function() {
                const counterName = this.getAttribute('data-counter');
                MismatchEvents.resetCounter(counterName);
            });
        });
    },
    
    // Add new counter
    addCounter: function() {
        const input = document.getElementById('new-counter-name');
        const threshold = document.getElementById('new-counter-threshold');
        const counterName = input.value.trim();
        const thresholdValue = parseInt(threshold.value);
        
        if (counterName) {
            MismatchData.addCounter(counterName, thresholdValue);
            MismatchUI.displayCounters();
            MismatchEvents.addCounterEventListeners();
            
            input.value = '';
            threshold.value = '0';
        } else {
            alert('Please enter a name for the counter!');
        }
    },
    
    // Reset all counters
    resetAllCounters: function() {
        if (confirm('Are you sure you want to reset ALL counters to zero?')) {
            MismatchData.resetAllCounters();
            MismatchUI.displayCounters();
            MismatchEvents.addCounterEventListeners();
        }
    },
    
    // Reset everything including clearing localStorage
    resetEverything: function() {
        if (confirm('This will completely reset all data and clear local storage. Continue?')) {
            MismatchData.resetEverything(AppConfig);
            MismatchUI.displayCounters();
            MismatchEvents.addCounterEventListeners();
        }
    },
    
    // Increment a counter
    incrementCounter: function(counterName) {
        MismatchData.incrementCounter(counterName);
        MismatchUI.updateCounter(counterName);
    },
    
    // Reset a single counter
    resetCounter: function(counterName) {
        MismatchData.resetCounter(counterName);
        MismatchUI.updateCounter(counterName);
    },
    
    // Delete a counter
    deleteCounter: function(counterName) {
        MismatchData.deleteCounter(counterName);
        MismatchUI.displayCounters();
        MismatchEvents.addCounterEventListeners();
    },
    
    // Unlock app before birthday
    unlockApp: function() {
        const codeInput = document.getElementById("unlock-code").value;
        const config = ConfigManager.loadConfig();
        
        if (codeInput === config.recipient.secretCode) {
            document.getElementById("preloader").style.opacity = "0";
            setTimeout(() => {
                document.getElementById("preloader").style.display = "none";
            }, 1000);
        } else {
            alert(`Incorrect code. Please wait until ${config.recipient.name}'s special day!`);
        }
    },
    
    // Setup event listeners for the configuration panel
    setupConfigPanelEvents: function() {
        // Toggle configuration panel
        document.getElementById('config-toggle').addEventListener('click', function() {
            const configPanel = document.getElementById('config-panel');
            configPanel.classList.toggle('active');
            
            // Populate form fields with current config
            if (configPanel.classList.contains('active')) {
                ConfigUI.populateConfigForm();
            }
        });
        
        // Handle configuration tab clicks
        document.querySelectorAll('.config-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.config-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('.config-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                const tabId = this.getAttribute('data-tab');
                document.getElementById(`${tabId}-config`).classList.add('active');
            });
        });
        
        // Handle template selection
        document.querySelectorAll('.relationship-template').forEach(template => {
            template.addEventListener('click', function() {
                document.querySelectorAll('.relationship-template').forEach(t => {
                    t.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });
        
        // Save configuration button
        document.getElementById('save-config').addEventListener('click', function() {
            ConfigUI.saveConfigFromForm();
            document.getElementById('config-panel').classList.remove('active');
        });
        
        // Cancel button
        document.getElementById('cancel-config').addEventListener('click', function() {
            document.getElementById('config-panel').classList.remove('active');
        });
        
        // Reset to defaults button
        document.getElementById('reset-config').addEventListener('click', function() {
            if (confirm('This will reset all configuration settings to default values. Continue?')) {
                ConfigManager.resetConfig();
                ConfigUI.populateConfigForm();
                MismatchUI.updateUIFromConfig(AppConfig);
            }
        });
        
        // Export configuration
        document.getElementById('export-config').addEventListener('click', function() {
            const config = ConfigManager.loadConfig();
            ConfigManager.exportConfig(config);
        });
        
        // Import configuration
        document.getElementById('import-config').addEventListener('click', function() {
            const fileInput = document.getElementById('import-file');
            const file = fileInput.files[0];
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const importedConfig = ConfigManager.importConfig(e.target.result);
                        if (importedConfig) {
                            ConfigUI.populateConfigForm();
                            MismatchUI.updateUIFromConfig(importedConfig);
                            alert('Configuration imported successfully!');
                        } else {
                            alert('Error importing configuration. Invalid format.');
                        }
                    } catch (error) {
                        alert('Error importing configuration: ' + error.message);
                    }
                };
                reader.readAsText(file);
            } else {
                alert('Please select a configuration file to import.');
            }
        });
    }
}; 