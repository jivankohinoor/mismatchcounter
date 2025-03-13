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
    }
}; 