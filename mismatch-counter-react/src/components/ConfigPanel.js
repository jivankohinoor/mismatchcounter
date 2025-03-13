import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';

const ConfigPanel = ({ isVisible, onClose }) => {
  const { config, saveConfig } = useConfig();
  
  // Local state for form values
  const [formData, setFormData] = useState({
    recipient: {
      name: '',
      birthdayDate: '',
      secretCode: ''
    },
    sender: {
      name: ''
    },
    theme: {
      mainColor: '#ff69b4',
      secondaryColor: '#4682b4',
      backgroundColor: '#fff0f5',
      iconEmoji: '🐱'
    },
    messages: {
      birthdayTitle: '',
      birthdayMessage: '',
      loveMessages: []
    }
  });
  
  // Temporary state for message being edited
  const [newMessage, setNewMessage] = useState('');
  
  // Initialize form with current config
  useEffect(() => {
    if (config) {
      setFormData({
        recipient: {
          name: config.recipient?.name || '',
          birthdayDate: config.recipient?.birthdayDate || '',
          secretCode: config.recipient?.secretCode || ''
        },
        sender: {
          name: config.sender?.name || ''
        },
        theme: {
          mainColor: config.theme?.mainColor || '#ff69b4',
          secondaryColor: config.theme?.secondaryColor || '#4682b4',
          backgroundColor: config.theme?.backgroundColor || '#fff0f5',
          iconEmoji: config.theme?.iconEmoji || '🐱'
        },
        messages: {
          birthdayTitle: config.messages?.birthdayTitle || '',
          birthdayMessage: config.messages?.birthdayMessage || '',
          loveMessages: [...(config.messages?.loveMessages || [])]
        }
      });
    }
  }, [config]);
  
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
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    saveConfig({
      ...config,
      ...formData
    });
    if (onClose) onClose();
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
        
        <form onSubmit={handleSubmit}>
          <div className="config-section active">
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
              <label htmlFor="senderName">Your Name:</label>
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
              <label htmlFor="theme">Theme Color:</label>
              <input
                type="color"
                id="themeColor"
                name="theme.mainColor"
                value={formData.theme.mainColor}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="config-section active">
            <h3>Birthday Settings</h3>
            <div className="form-group">
              <label htmlFor="birthdayDate">Birthday Date:</label>
              <input
                type="date"
                id="birthdayDate"
                name="recipient.birthdayDate"
                value={formData.recipient.birthdayDate}
                onChange={handleChange}
              />
            </div>
            
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
              <label htmlFor="unlockCode">Unlock Code:</label>
              <input
                type="text"
                id="unlockCode"
                name="recipient.secretCode"
                value={formData.recipient.secretCode}
                onChange={handleChange}
                placeholder="Secret code to unlock before birthday"
              />
            </div>
          </div>
          
          <div className="config-section active">
            <h3>Love Messages</h3>
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
                Add
              </button>
            </div>
          </div>
          
          <div className="config-actions">
            <button 
              type="submit" 
              className="save-config-btn"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigPanel; 