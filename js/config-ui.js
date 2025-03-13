// Configuration UI Module
const ConfigUI = {
    // Populate the configuration form with current settings
    populateConfigForm: function() {
        const config = ConfigManager.loadConfig();
        
        // Basic info
        document.getElementById('recipient-name').value = config.recipient.name;
        document.getElementById('recipient-relationship').value = config.recipient.relationship;
        document.getElementById('sender-name').value = config.sender.name;
        
        // Format date for datetime-local input (YYYY-MM-DDThh:mm)
        const birthdayDate = new Date(config.recipient.birthdayDate);
        const formattedDate = birthdayDate.toISOString().slice(0, 16);
        document.getElementById('birthday-date').value = formattedDate;
        
        document.getElementById('secret-code').value = config.recipient.secretCode;
        
        // Appearance
        document.getElementById('main-color').value = config.theme.mainColor;
        document.getElementById('secondary-color').value = config.theme.secondaryColor;
        document.getElementById('background-color').value = config.theme.backgroundColor;
        document.getElementById('icon-emoji').value = config.theme.iconEmoji;
        
        // Template selection
        document.querySelectorAll('.relationship-template').forEach(template => {
            template.classList.remove('selected');
            if (template.getAttribute('data-template') === config.selectedTemplate) {
                template.classList.add('selected');
            }
        });
        
        // Message customization
        document.getElementById('birthday-title-text').value = config.messages.birthdayTitle;
        document.getElementById('birthday-message-text').value = config.messages.birthdayMessage;
        document.getElementById('footer-message').value = config.messages.footerMessage;
        document.getElementById('countdown-message').value = config.messages.countdownMessage;
        
        // Populate theme presets dropdown if it exists
        const themePresetSelect = document.getElementById('theme-preset');
        if (themePresetSelect) {
            // Set to custom by default since we don't know which preset matches current theme
            themePresetSelect.value = 'custom';
        }
        
        // Initialize custom message management
        this.initializeCustomMessagesUI();
    },
    
    // Save configuration from form values
    saveConfigFromForm: function() {
        const config = ConfigManager.loadConfig();
        
        // Basic info
        config.recipient.name = document.getElementById('recipient-name').value;
        config.recipient.relationship = document.getElementById('recipient-relationship').value;
        config.sender.name = document.getElementById('sender-name').value;
        
        const birthdayDate = document.getElementById('birthday-date').value;
        if (birthdayDate) {
            config.recipient.birthdayDate = new Date(birthdayDate).toISOString();
        }
        
        config.recipient.secretCode = document.getElementById('secret-code').value;
        
        // Appearance
        config.theme.mainColor = document.getElementById('main-color').value;
        config.theme.secondaryColor = document.getElementById('secondary-color').value;
        config.theme.backgroundColor = document.getElementById('background-color').value;
        config.theme.iconEmoji = document.getElementById('icon-emoji').value;
        
        // Template selection
        const selectedTemplate = document.querySelector('.relationship-template.selected');
        if (selectedTemplate) {
            config.selectedTemplate = selectedTemplate.getAttribute('data-template');
        }
        
        // Message customization
        config.messages.birthdayTitle = document.getElementById('birthday-title-text').value;
        config.messages.birthdayMessage = document.getElementById('birthday-message-text').value;
        config.messages.footerMessage = document.getElementById('footer-message').value;
        config.messages.countdownMessage = document.getElementById('countdown-message').value;
        
        // Advanced settings (if they exist in the UI)
        const animationsCheckbox = document.getElementById('enable-animations');
        if (animationsCheckbox) {
            if (!config.advanced) config.advanced = {};
            config.advanced.enableAnimations = animationsCheckbox.checked;
        }
        
        const debugModeCheckbox = document.getElementById('debug-mode');
        if (debugModeCheckbox) {
            if (!config.advanced) config.advanced = {};
            config.advanced.debugMode = debugModeCheckbox.checked;
        }
        
        const messageIntervalInput = document.getElementById('message-interval');
        if (messageIntervalInput) {
            if (!config.advanced) config.advanced = {};
            const interval = parseInt(messageIntervalInput.value, 10);
            config.advanced.randomMessageInterval = isNaN(interval) ? 10000 : interval * 1000; // Convert to milliseconds
        }
        
        // Save the updated configuration
        ConfigManager.saveConfig(config);
        
        // Update UI with new configuration
        MismatchUI.updateUIFromConfig(config);
        
        // Show success message
        alert('Configuration saved successfully!');
    },
    
    // Show a preview of theme changes in real-time
    initializeThemePreview: function() {
        // Add event listeners to color inputs for real-time previewing
        document.getElementById('main-color').addEventListener('input', function() {
            document.documentElement.style.setProperty('--main-color', this.value);
        });
        
        document.getElementById('secondary-color').addEventListener('input', function() {
            document.documentElement.style.setProperty('--secondary-color', this.value);
        });
        
        document.getElementById('background-color').addEventListener('input', function() {
            document.documentElement.style.setProperty('--background-color', this.value);
        });
        
        // Icon emoji preview
        document.getElementById('icon-emoji').addEventListener('change', function() {
            document.getElementById('app-icon').textContent = this.value;
            document.getElementById('counter-icon').textContent = this.value;
        });
        
        // Set up theme preset selector if it exists
        const themePresetSelect = document.getElementById('theme-preset');
        if (themePresetSelect) {
            themePresetSelect.addEventListener('change', function() {
                const selectedPreset = this.value;
                if (selectedPreset !== 'custom') {
                    ConfigUI.applyThemePreset(selectedPreset);
                }
            });
        }
        
        // Create theme preset UI if it doesn't exist
        this.createThemePresetsUI();
    },
    
    // Apply a theme preset and update form controls
    applyThemePreset: function(presetName) {
        const presets = ConfigManager.getThemePresets();
        if (presets[presetName]) {
            const preset = presets[presetName];
            
            // Update form inputs with preset values
            document.getElementById('main-color').value = preset.mainColor;
            document.getElementById('secondary-color').value = preset.secondaryColor;
            document.getElementById('background-color').value = preset.backgroundColor;
            document.getElementById('icon-emoji').value = preset.iconEmoji;
            
            // Apply theme preview
            document.documentElement.style.setProperty('--main-color', preset.mainColor);
            document.documentElement.style.setProperty('--secondary-color', preset.secondaryColor);
            document.documentElement.style.setProperty('--background-color', preset.backgroundColor);
            
            // Update icon preview
            document.getElementById('app-icon').textContent = preset.iconEmoji;
            document.getElementById('counter-icon').textContent = preset.iconEmoji;
        }
    },
    
    // Create UI for theme presets
    createThemePresetsUI: function() {
        const appearanceConfig = document.getElementById('appearance-config');
        if (!appearanceConfig) return;
        
        // Check if presets UI already exists
        if (document.getElementById('theme-preset')) return;
        
        // Create theme presets dropdown
        const presetsGroup = document.createElement('div');
        presetsGroup.className = 'config-group';
        
        const presetsLabel = document.createElement('label');
        presetsLabel.setAttribute('for', 'theme-preset');
        presetsLabel.textContent = 'Theme Presets:';
        
        const presetsSelect = document.createElement('select');
        presetsSelect.id = 'theme-preset';
        presetsSelect.className = 'config-input';
        
        // Add option for custom (current) theme
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.textContent = 'Custom / Current';
        presetsSelect.appendChild(customOption);
        
        // Add preset options
        const presets = ConfigManager.getThemePresets();
        for (const [name, preset] of Object.entries(presets)) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name.charAt(0).toUpperCase() + name.slice(1);
            presetsSelect.appendChild(option);
        }
        
        presetsGroup.appendChild(presetsLabel);
        presetsGroup.appendChild(presetsSelect);
        
        // Insert as the first child of the appearance config section
        appearanceConfig.insertBefore(presetsGroup, appearanceConfig.firstChild);
        
        // Add event listener
        presetsSelect.addEventListener('change', function() {
            if (this.value !== 'custom') {
                ConfigUI.applyThemePreset(this.value);
            }
        });
    },
    
    // Initialize custom messages UI
    initializeCustomMessagesUI: function() {
        const messagesConfig = document.getElementById('messages-config');
        if (!messagesConfig) return;
        
        // Check if custom messages UI already exists
        if (document.getElementById('custom-messages-container')) return;
        
        // Create section for custom love messages
        const customMessagesContainer = document.createElement('div');
        customMessagesContainer.id = 'custom-messages-container';
        customMessagesContainer.className = 'config-group';
        
        const loveMessagesHeader = document.createElement('h4');
        loveMessagesHeader.textContent = 'Custom Love Messages';
        
        // Create form for adding new love messages
        const newLoveMessageForm = document.createElement('div');
        newLoveMessageForm.className = 'custom-message-form';
        
        const newLoveMessageInput = document.createElement('input');
        newLoveMessageInput.type = 'text';
        newLoveMessageInput.id = 'new-love-message';
        newLoveMessageInput.className = 'config-input';
        newLoveMessageInput.placeholder = 'Enter a new love message...';
        
        const addLoveMessageBtn = document.createElement('button');
        addLoveMessageBtn.textContent = 'Add Message';
        addLoveMessageBtn.className = 'config-btn';
        addLoveMessageBtn.id = 'add-love-message-btn';
        
        newLoveMessageForm.appendChild(newLoveMessageInput);
        newLoveMessageForm.appendChild(addLoveMessageBtn);
        
        // Create section for custom consequences
        const consequencesHeader = document.createElement('h4');
        consequencesHeader.textContent = 'Custom Consequences';
        consequencesHeader.style.marginTop = '20px';
        
        const newConsequenceForm = document.createElement('div');
        newConsequenceForm.className = 'custom-message-form';
        
        const newConsequenceInput = document.createElement('input');
        newConsequenceInput.type = 'text';
        newConsequenceInput.id = 'new-consequence';
        newConsequenceInput.className = 'config-input';
        newConsequenceInput.placeholder = 'Enter a new consequence...';
        
        const addConsequenceBtn = document.createElement('button');
        addConsequenceBtn.textContent = 'Add Consequence';
        addConsequenceBtn.className = 'config-btn';
        addConsequenceBtn.id = 'add-consequence-btn';
        
        newConsequenceForm.appendChild(newConsequenceInput);
        newConsequenceForm.appendChild(addConsequenceBtn);
        
        // Create message lists
        const loveMessagesList = document.createElement('div');
        loveMessagesList.id = 'love-messages-list';
        loveMessagesList.className = 'messages-list';
        
        const consequencesList = document.createElement('div');
        consequencesList.id = 'consequences-list';
        consequencesList.className = 'messages-list';
        
        // Add all elements to container
        customMessagesContainer.appendChild(loveMessagesHeader);
        customMessagesContainer.appendChild(newLoveMessageForm);
        customMessagesContainer.appendChild(loveMessagesList);
        customMessagesContainer.appendChild(consequencesHeader);
        customMessagesContainer.appendChild(newConsequenceForm);
        customMessagesContainer.appendChild(consequencesList);
        
        // Add container to messages config section
        messagesConfig.appendChild(customMessagesContainer);
        
        // Add event listeners for buttons
        document.getElementById('add-love-message-btn').addEventListener('click', this.addCustomLoveMessage);
        document.getElementById('add-consequence-btn').addEventListener('click', this.addCustomConsequence);
        
        // Display existing custom messages
        this.displayCustomMessages();
    },
    
    // Display existing custom messages
    displayCustomMessages: function() {
        const config = ConfigManager.loadConfig();
        const loveMessagesList = document.getElementById('love-messages-list');
        const consequencesList = document.getElementById('consequences-list');
        
        if (!loveMessagesList || !consequencesList) return;
        
        // Clear current lists
        loveMessagesList.innerHTML = '';
        consequencesList.innerHTML = '';
        
        // Display love messages
        config.messages.loveMessages.forEach((message, index) => {
            const messageItem = document.createElement('div');
            messageItem.className = 'message-item';
            
            const messageText = document.createElement('span');
            messageText.textContent = message;
            messageText.className = 'message-text';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '×';
            deleteBtn.className = 'delete-message-btn';
            deleteBtn.setAttribute('data-type', 'love');
            deleteBtn.setAttribute('data-index', index);
            deleteBtn.addEventListener('click', this.deleteCustomMessage);
            
            messageItem.appendChild(messageText);
            messageItem.appendChild(deleteBtn);
            loveMessagesList.appendChild(messageItem);
        });
        
        // Display consequences
        config.messages.consequences.forEach((message, index) => {
            const messageItem = document.createElement('div');
            messageItem.className = 'message-item';
            
            const messageText = document.createElement('span');
            messageText.textContent = message;
            messageText.className = 'message-text';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '×';
            deleteBtn.className = 'delete-message-btn';
            deleteBtn.setAttribute('data-type', 'consequence');
            deleteBtn.setAttribute('data-index', index);
            deleteBtn.addEventListener('click', this.deleteCustomMessage);
            
            messageItem.appendChild(messageText);
            messageItem.appendChild(deleteBtn);
            consequencesList.appendChild(messageItem);
        });
    },
    
    // Add a custom love message
    addCustomLoveMessage: function() {
        const input = document.getElementById('new-love-message');
        const message = input.value.trim();
        
        if (message) {
            const config = ConfigManager.loadConfig();
            
            // Avoid duplicates
            if (!config.messages.loveMessages.includes(message)) {
                config.messages.loveMessages.push(message);
                ConfigManager.saveConfig(config);
                
                // Clear input and update display
                input.value = '';
                ConfigUI.displayCustomMessages();
                alert('Love message added successfully!');
            } else {
                alert('This message already exists!');
            }
        } else {
            alert('Please enter a message.');
        }
    },
    
    // Add a custom consequence
    addCustomConsequence: function() {
        const input = document.getElementById('new-consequence');
        const consequence = input.value.trim();
        
        if (consequence) {
            const config = ConfigManager.loadConfig();
            
            // Avoid duplicates
            if (!config.messages.consequences.includes(consequence)) {
                config.messages.consequences.push(consequence);
                ConfigManager.saveConfig(config);
                
                // Clear input and update display
                input.value = '';
                ConfigUI.displayCustomMessages();
                alert('Consequence added successfully!');
            } else {
                alert('This consequence already exists!');
            }
        } else {
            alert('Please enter a consequence.');
        }
    },
    
    // Delete a custom message
    deleteCustomMessage: function(event) {
        const type = event.target.getAttribute('data-type');
        const index = parseInt(event.target.getAttribute('data-index'), 10);
        
        if (confirm(`Are you sure you want to delete this ${type === 'love' ? 'love message' : 'consequence'}?`)) {
            const config = ConfigManager.loadConfig();
            
            if (type === 'love') {
                // Don't delete the last message
                if (config.messages.loveMessages.length <= 1) {
                    alert("You can't delete the last love message!");
                    return;
                }
                config.messages.loveMessages.splice(index, 1);
            } else {
                // Don't delete the last consequence
                if (config.messages.consequences.length <= 1) {
                    alert("You can't delete the last consequence!");
                    return;
                }
                config.messages.consequences.splice(index, 1);
            }
            
            ConfigManager.saveConfig(config);
            ConfigUI.displayCustomMessages();
        }
    },
    
    // Create advanced settings UI
    createAdvancedSettingsUI: function() {
        // Check if advanced tab exists in config panel - if not create it
        const configTabs = document.querySelector('.config-tabs');
        if (!configTabs) return;
        
        // Check if advanced tab already exists
        if (document.querySelector('[data-tab="advanced"]')) return;
        
        // Create advanced tab
        const advancedTab = document.createElement('div');
        advancedTab.className = 'config-tab';
        advancedTab.setAttribute('data-tab', 'advanced');
        advancedTab.textContent = 'Advanced';
        configTabs.appendChild(advancedTab);
        
        // Create advanced settings section
        const configPanel = document.getElementById('config-panel');
        const advancedSection = document.createElement('div');
        advancedSection.className = 'config-section';
        advancedSection.id = 'advanced-config';
        
        // Get current config
        const config = ConfigManager.loadConfig();
        if (!config.advanced) config.advanced = {};
        
        // Create content
        const enableAnimationsGroup = document.createElement('div');
        enableAnimationsGroup.className = 'config-group';
        
        const animationsLabel = document.createElement('label');
        animationsLabel.setAttribute('for', 'enable-animations');
        animationsLabel.textContent = 'Enable Animations:';
        
        const animationsInput = document.createElement('input');
        animationsInput.type = 'checkbox';
        animationsInput.id = 'enable-animations';
        animationsInput.checked = config.advanced.enableAnimations !== false;
        
        enableAnimationsGroup.appendChild(animationsLabel);
        enableAnimationsGroup.appendChild(animationsInput);
        
        const messageIntervalGroup = document.createElement('div');
        messageIntervalGroup.className = 'config-group';
        
        const intervalLabel = document.createElement('label');
        intervalLabel.setAttribute('for', 'message-interval');
        intervalLabel.textContent = 'Message Rotation Interval (seconds):';
        
        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.id = 'message-interval';
        intervalInput.className = 'config-input';
        intervalInput.min = '5';
        intervalInput.max = '600';
        intervalInput.value = Math.floor((config.advanced.randomMessageInterval || 10000) / 1000);
        
        messageIntervalGroup.appendChild(intervalLabel);
        messageIntervalGroup.appendChild(intervalInput);
        
        const debugModeGroup = document.createElement('div');
        debugModeGroup.className = 'config-group';
        
        const debugLabel = document.createElement('label');
        debugLabel.setAttribute('for', 'debug-mode');
        debugLabel.textContent = 'Debug Mode:';
        
        const debugInput = document.createElement('input');
        debugInput.type = 'checkbox';
        debugInput.id = 'debug-mode';
        debugInput.checked = config.advanced.debugMode === true;
        
        debugModeGroup.appendChild(debugLabel);
        debugModeGroup.appendChild(debugInput);
        
        // Add elements to section
        advancedSection.appendChild(enableAnimationsGroup);
        advancedSection.appendChild(messageIntervalGroup);
        advancedSection.appendChild(debugModeGroup);
        
        // Add section to config panel
        configPanel.appendChild(advancedSection);
        
        // Add event listener for tab
        advancedTab.addEventListener('click', function() {
            document.querySelectorAll('.config-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.config-section').forEach(section => {
                section.classList.remove('active');
            });
            
            document.getElementById('advanced-config').classList.add('active');
        });
    }
}; 