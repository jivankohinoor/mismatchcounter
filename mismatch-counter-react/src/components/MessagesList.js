import React, { useState } from 'react';

const MessagesList = ({ messages, onAddMessage, onRemoveMessage, type }) => {
  const [newMessage, setNewMessage] = useState('');
  const [timeLimit, setTimeLimit] = useState(120); // Default 2 hours in minutes
  
  // Format time limit for display
  const formatTimeLimit = (minutes) => {
    if (!minutes) return "";
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else if (minutes === 60) {
      return "1 hour";
    } else if (minutes % 60 === 0) {
      return `${minutes / 60} hours`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
  };
  
  // Labels for different message types (in English)
  const labels = {
    loveMessages: {
      title: 'Love Messages',
      inputPlaceholder: 'Enter a new love message',
      buttonText: 'Add Message',
      emptyText: 'No love messages added yet'
    },
    consequences: {
      title: 'Consequences',
      inputPlaceholder: 'Enter a new consequence',
      buttonText: 'Add Consequence',
      emptyText: 'No consequences added yet',
      timeLimitLabel: 'Time Limit (minutes)'
    }
  };
  
  const currentLabels = labels[type] || labels.loveMessages;
  
  const handleAddMessage = () => {
    if (newMessage.trim()) {
      // For consequences, add as object with time limit
      if (type === 'consequences') {
        onAddMessage({
          text: newMessage.trim(),
          timeLimit: Number(timeLimit) || 120 // Default to 2 hours if invalid
        });
      } else {
        // For other message types, just add the text
        onAddMessage(newMessage.trim());
      }
      
      // Reset form fields
      setNewMessage('');
      setTimeLimit(120);
    }
  };
  
  return (
    <div className="messages-list-container">
      <h4>{currentLabels.title}</h4>
      
      <div className="message-list">
        {messages.length === 0 ? (
          <p className="empty-list-message">{currentLabels.emptyText}</p>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="message-item">
              <span className="message-text">
                {typeof message === 'object' && message.text 
                  ? `${message.text} (${formatTimeLimit(message.timeLimit || 120)})` 
                  : message}
              </span>
              <button 
                type="button" 
                className="remove-message-btn"
                onClick={() => onRemoveMessage(index)}
              >
                &times;
              </button>
            </div>
          ))
        )}
      </div>
      
      <div className="add-message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={currentLabels.inputPlaceholder}
          className={type === 'consequences' ? 'consequence-input' : ''}
        />
        
        {type === 'consequences' && (
          <div className="time-limit-input-container">
            <label htmlFor="timeLimit">{currentLabels.timeLimitLabel}:</label>
            <select
              id="timeLimit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="time-limit-select"
            >
              <optgroup label="Minutes">
                <option value="1">1 minute</option>
                <option value="2">2 minutes</option>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
              </optgroup>
              <optgroup label="Hours">
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
                <option value="240">4 hours</option>
                <option value="300">5 hours</option>
                <option value="360">6 hours</option>
                <option value="480">8 hours</option>
                <option value="720">12 hours</option>
                <option value="1440">24 hours</option>
              </optgroup>
              <optgroup label="Days">
                <option value="2880">2 days</option>
                <option value="4320">3 days</option>
                <option value="10080">1 week</option>
              </optgroup>
            </select>
          </div>
        )}
        
        <button 
          type="button" 
          onClick={handleAddMessage}
          className="add-message-btn"
        >
          {currentLabels.buttonText}
        </button>
      </div>
    </div>
  );
};

export default MessagesList; 