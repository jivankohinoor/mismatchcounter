import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';

const ConfigPanel = ({ isVisible, onClose }) => {
  const { config, saveConfig, resetConfig } = useConfig();
  const [activeTab, setActiveTab] = useState('basic');
  
  // Local state for form values
  const [formData, setFormData] = useState({
    recipient: {
      name: '',
      birthdayDate: '',
      secretCode: '',
      relationship: ''
    },
    sender: {
      name: ''
    },
    theme: {
      mainColor: '#ff69b4',
      secondaryColor: '#4682b4',
      backgroundColor: '#fff0f5',
      iconEmoji: '🐱',
      fontFamily: "'Comic Sans MS', cursive, sans-serif"
    },
    messages: {
      birthdayTitle: '',
      birthdayMessage: '',
      loveMessages: [],
      consequences: [],
      footerMessage: '',
      countdownMessage: ''
    },
    selectedTemplate: 'romantic',
    counterTemplates: {
      romantic: [],
      roommates: [],
      friends: [],
      family: []
    },
    advanced: {
      randomMessageInterval: 10000,
      enableAnimations: true,
      debugMode: false,
      autoSaveInterval: 60000
    }
  });
  
  // Temporary state for message being edited
  const [newMessage, setNewMessage] = useState('');
  const [newConsequence, setNewConsequence] = useState('');

  // Predefined themes
  const themePresets = {
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
  
  // Initialize form with current config
  useEffect(() => {
    if (config) {
      setFormData({
        recipient: {
          name: config.recipient?.name || '',
          birthdayDate: config.recipient?.birthdayDate || '',
          secretCode: config.recipient?.secretCode || '',
          relationship: config.recipient?.relationship || ''
        },
        sender: {
          name: config.sender?.name || ''
        },
        theme: {
          mainColor: config.theme?.mainColor || '#ff69b4',
          secondaryColor: config.theme?.secondaryColor || '#4682b4',
          backgroundColor: config.theme?.backgroundColor || '#fff0f5',
          iconEmoji: config.theme?.iconEmoji || '🐱',
          fontFamily: config.theme?.fontFamily || "'Comic Sans MS', cursive, sans-serif"
        },
        messages: {
          birthdayTitle: config.messages?.birthdayTitle || '',
          birthdayMessage: config.messages?.birthdayMessage || '',
          loveMessages: [...(config.messages?.loveMessages || [])],
          consequences: [...(config.messages?.consequences || [])],
          footerMessage: config.messages?.footerMessage || '',
          countdownMessage: config.messages?.countdownMessage || ''
        },
        selectedTemplate: config.selectedTemplate || 'romantic',
        counterTemplates: config.counterTemplates || {
          romantic: [],
          roommates: [],
          friends: [],
          family: []
        },
        advanced: {
          randomMessageInterval: config.advanced?.randomMessageInterval || 10000,
          enableAnimations: config.advanced?.enableAnimations !== false,
          debugMode: config.advanced?.debugMode || false,
          autoSaveInterval: config.advanced?.autoSaveInterval || 60000
        }
      });
    }
  }, [config]);
  
  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Apply a theme preset
  const applyThemePreset = (presetName) => {
    if (themePresets[presetName]) {
      setFormData(prev => ({
        ...prev,
        theme: {
          ...themePresets[presetName]
        }
      }));
    }
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties with dot notation
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };
  
  // Add a new love message
  const addMessage = () => {
    if (newMessage.trim()) {
      setFormData(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          loveMessages: [...prev.messages.loveMessages, newMessage.trim()]
        }
      }));
      setNewMessage('');
    }
  };
  
  // Remove a love message
  const removeMessage = (index) => {
    setFormData(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        loveMessages: prev.messages.loveMessages.filter((_, i) => i !== index)
      }
    }));
  };
  
  // Add a new consequence
  const addConsequence = () => {
    if (newConsequence.trim()) {
      setFormData(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          consequences: [...prev.messages.consequences, newConsequence.trim()]
        }
      }));
      setNewConsequence('');
    }
  };
  
  // Remove a consequence
  const removeConsequence = (index) => {
    setFormData(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        consequences: prev.messages.consequences.filter((_, i) => i !== index)
      }
    }));
  };
  
  // Handle template selection
  const handleTemplateChange = (template) => {
    setFormData(prev => ({
      ...prev,
      selectedTemplate: template
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    saveConfig({
      ...config,
      ...formData
    });
    if (onClose) onClose();
  };
  
  // Export configuration as JSON
  const handleExportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mismatch_config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  // Handle file import
  const handleImportConfig = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target.result);
        saveConfig(importedConfig);
        alert("Configuration imported successfully!");
      } catch (error) {
        alert("Failed to import configuration: " + error.message);
      }
    };
    reader.readAsText(file);
  };
  
  // Handle config reset
  const handleResetConfig = () => {
    if (window.confirm("Are you sure you want to reset to default configuration? This cannot be undone.")) {
      resetConfig();
      if (onClose) onClose();
    }
  };
  
  // Handle panel visibility
  if (!isVisible) return null;
  
  return (
    <div className="config-panel">
      <div className="config-panel-content">
        <h2>Customize Your App</h2>
        <button 
          className="close-config-btn"
          onClick={onClose}
          aria-label="Close configuration panel"
        >
          &times;
        </button>
        
        <div className="config-tabs">
          <button 
            className={`config-tab ${activeTab === 'basic' ? 'active' : ''}`} 
            onClick={() => handleTabChange('basic')}
          >
            Basic Info
          </button>
          <button 
            className={`config-tab ${activeTab === 'appearance' ? 'active' : ''}`} 
            onClick={() => handleTabChange('appearance')}
          >
            Appearance
          </button>
          <button 
            className={`config-tab ${activeTab === 'templates' ? 'active' : ''}`} 
            onClick={() => handleTabChange('templates')}
          >
            Templates
          </button>
          <button 
            className={`config-tab ${activeTab === 'messages' ? 'active' : ''}`} 
            onClick={() => handleTabChange('messages')}
          >
            Messages
          </button>
          <button 
            className={`config-tab ${activeTab === 'import-export' ? 'active' : ''}`} 
            onClick={() => handleTabChange('import-export')}
          >
            Import/Export
          </button>
          <button 
            className={`config-tab ${activeTab === 'advanced' ? 'active' : ''}`} 
            onClick={() => handleTabChange('advanced')}
          >
            Advanced
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={`config-section ${activeTab === 'basic' ? 'active' : ''}`}>
            <h3>Basic Settings</h3>
            <div className="form-group">
              <label htmlFor="recipientName">Recipient's Name:</label>
              <input
                type="text"
                id="recipientName"
                name="recipient.name"
                value={formData.recipient.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="recipientRelationship">Relationship:</label>
              <input
                type="text"
                id="recipientRelationship"
                name="recipient.relationship"
                value={formData.recipient.relationship}
                onChange={handleChange}
                placeholder="e.g., wife, husband, friend, etc."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="senderName">Your Name/Title:</label>
              <input
                type="text"
                id="senderName"
                name="sender.name"
                value={formData.sender.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="birthdayDate">Special Date:</label>
              <input
                type="date"
                id="birthdayDate"
                name="recipient.birthdayDate"
                value={formData.recipient.birthdayDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="secretCode">Secret Unlock Code:</label>
              <input
                type="text"
                id="secretCode"
                name="recipient.secretCode"
                value={formData.recipient.secretCode}
                onChange={handleChange}
                placeholder="Code to unlock before the special date"
              />
            </div>
          </div>
          
          <div className={`config-section ${activeTab === 'appearance' ? 'active' : ''}`}>
            <h3>Appearance</h3>
            <div className="form-group">
              <label>Theme Presets:</label>
              <div className="theme-presets">
                <button type="button" onClick={() => applyThemePreset('pink')}>Pink Theme</button>
                <button type="button" onClick={() => applyThemePreset('blue')}>Blue Theme</button>
                <button type="button" onClick={() => applyThemePreset('dark')}>Dark Theme</button>
                <button type="button" onClick={() => applyThemePreset('nature')}>Nature Theme</button>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="mainColor">Main Color:</label>
              <input
                type="color"
                id="mainColor"
                name="theme.mainColor"
                value={formData.theme.mainColor}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="secondaryColor">Secondary Color:</label>
              <input
                type="color"
                id="secondaryColor"
                name="theme.secondaryColor"
                value={formData.theme.secondaryColor}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="backgroundColor">Background Color:</label>
              <input
                type="color"
                id="backgroundColor"
                name="theme.backgroundColor"
                value={formData.theme.backgroundColor}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="iconEmoji">Icon Emoji:</label>
              <select
                id="iconEmoji"
                name="theme.iconEmoji"
                value={formData.theme.iconEmoji}
                onChange={handleChange}
              >
                <option value="🐱">🐱 Cat</option>
                <option value="🐶">🐶 Dog</option>
                <option value="❤️">❤️ Heart</option>
                <option value="🎁">🎁 Gift</option>
                <option value="🌟">🌟 Star</option>
                <option value="🏠">🏠 House</option>
                <option value="🍕">🍕 Pizza</option>
                <option value="🎮">🎮 Game</option>
                <option value="🌙">🌙 Moon</option>
                <option value="🌿">🌿 Plant</option>
              </select>
            </div>
          </div>
          
          <div className={`config-section ${activeTab === 'templates' ? 'active' : ''}`}>
            <h3>Counter Templates</h3>
            <p>Select a set of default counters based on your relationship:</p>
            
            <div className="relationship-templates">
              <div 
                className={`relationship-template ${formData.selectedTemplate === 'romantic' ? 'selected' : ''}`}
                onClick={() => handleTemplateChange('romantic')}
              >
                <h4>Romantic Partner</h4>
                <p>Counters for couples, spouses, and romantic relationships</p>
              </div>
              
              <div 
                className={`relationship-template ${formData.selectedTemplate === 'roommates' ? 'selected' : ''}`}
                onClick={() => handleTemplateChange('roommates')}
              >
                <h4>Roommates</h4>
                <p>Counters for living together and sharing a home</p>
              </div>
              
              <div 
                className={`relationship-template ${formData.selectedTemplate === 'friends' ? 'selected' : ''}`}
                onClick={() => handleTemplateChange('friends')}
              >
                <h4>Friends</h4>
                <p>Counters for friendship and social relationships</p>
              </div>
              
              <div 
                className={`relationship-template ${formData.selectedTemplate === 'family' ? 'selected' : ''}`}
                onClick={() => handleTemplateChange('family')}
              >
                <h4>Family</h4>
                <p>Counters for family relationships</p>
              </div>
            </div>
          </div>
          
          <div className={`config-section ${activeTab === 'messages' ? 'active' : ''}`}>
            <h3>Messages</h3>
            <div className="form-group">
              <label htmlFor="birthdayTitle">Birthday Title:</label>
              <input
                type="text"
                id="birthdayTitle"
                name="messages.birthdayTitle"
                value={formData.messages.birthdayTitle}
                onChange={handleChange}
                placeholder="e.g., Happy Birthday!"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="birthdayMessage">Birthday Message:</label>
              <textarea
                id="birthdayMessage"
                name="messages.birthdayMessage"
                value={formData.messages.birthdayMessage}
                onChange={handleChange}
                rows="3"
                placeholder="Enter your special birthday message here"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="footerMessage">Footer Message:</label>
              <input
                type="text"
                id="footerMessage"
                name="messages.footerMessage"
                value={formData.messages.footerMessage}
                onChange={handleChange}
                placeholder="Message to display in the footer"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="countdownMessage">Countdown Message:</label>
              <input
                type="text"
                id="countdownMessage"
                name="messages.countdownMessage"
                value={formData.messages.countdownMessage}
                onChange={handleChange}
                placeholder="Message to display during countdown"
              />
            </div>
            
            <h4>Love Messages</h4>
            <div className="love-messages-list">
              {formData.messages.loveMessages.map((message, index) => (
                <div key={index} className="message-item">
                  <span className="message-text">{message}</span>
                  <button 
                    type="button" 
                    className="remove-message-btn"
                    onClick={() => removeMessage(index)}
                    aria-label="Remove this message"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            
            <div className="add-message-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Enter a new love message"
                aria-label="New love message"
              />
              <button 
                type="button" 
                onClick={addMessage}
                className="add-message-btn"
                aria-label="Add new message"
              >
                Add Love Message
              </button>
            </div>
            
            <h4>Consequences</h4>
            <p>Messages shown when a counter threshold is exceeded:</p>
            <div className="love-messages-list">
              {formData.messages.consequences.map((consequence, index) => (
                <div key={index} className="message-item">
                  <span className="message-text">{consequence}</span>
                  <button 
                    type="button" 
                    className="remove-message-btn"
                    onClick={() => removeConsequence(index)}
                    aria-label="Remove this consequence"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            
            <div className="add-message-form">
              <input
                type="text"
                value={newConsequence}
                onChange={(e) => setNewConsequence(e.target.value)}
                placeholder="Enter a new consequence"
                aria-label="New consequence"
              />
              <button 
                type="button" 
                onClick={addConsequence}
                className="add-message-btn"
                aria-label="Add new consequence"
              >
                Add Consequence
              </button>
            </div>
          </div>
          
          <div className={`config-section ${activeTab === 'import-export' ? 'active' : ''}`}>
            <h3>Import & Export</h3>
            <div className="form-group">
              <h4>Export Configuration</h4>
              <p>Download your current configuration as a JSON file:</p>
              <button 
                type="button" 
                className="export-btn" 
                onClick={handleExportConfig}
              >
                Export Configuration
              </button>
            </div>
            
            <div className="form-group">
              <h4>Import Configuration</h4>
              <p>Import a previously saved configuration:</p>
              <input 
                type="file" 
                id="import-file" 
                accept=".json"
                onChange={handleImportConfig}
              />
            </div>
            
            <div className="form-group">
              <h4>Reset Configuration</h4>
              <p>Reset all settings to default values:</p>
              <button 
                type="button" 
                className="reset-btn" 
                onClick={handleResetConfig}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
          
          <div className={`config-section ${activeTab === 'advanced' ? 'active' : ''}`}>
            <h3>Advanced Settings</h3>
            <div className="form-group">
              <label htmlFor="randomMessageInterval">Random Message Interval (ms):</label>
              <input
                type="number"
                id="randomMessageInterval"
                name="advanced.randomMessageInterval"
                value={formData.advanced.randomMessageInterval}
                onChange={handleChange}
                min="1000"
                step="1000"
              />
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="enableAnimations"
                name="advanced.enableAnimations"
                checked={formData.advanced.enableAnimations}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="enableAnimations">Enable Animations</label>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="debugMode"
                name="advanced.debugMode"
                checked={formData.advanced.debugMode}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="debugMode">Debug Mode</label>
            </div>
            
            <div className="form-group">
              <label htmlFor="autoSaveInterval">Auto-Save Interval (ms):</label>
              <input
                type="number"
                id="autoSaveInterval"
                name="advanced.autoSaveInterval"
                value={formData.advanced.autoSaveInterval}
                onChange={handleChange}
                min="10000"
                step="10000"
              />
            </div>
          </div>
          
          <div className="config-actions">
            <button 
              type="submit" 
              className="save-config-btn"
            >
              Save Changes
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigPanel; 