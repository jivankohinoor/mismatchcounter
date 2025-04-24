import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';

const LoveMessage = () => {
  const { config } = useConfig();
  const [message, setMessage] = useState('');
  const [opacity, setOpacity] = useState(1);
  
  // Set initial message
  useEffect(() => {
    if (config?.messages?.loveMessages?.length > 0) {
      const randomIndex = Math.floor(Math.random() * config.messages.loveMessages.length);
      setMessage(config.messages.loveMessages[randomIndex]);
    }
  }, [config]);
  
  // Set up interval to change messages
  useEffect(() => {
    if (!config?.messages?.loveMessages?.length) return;
    
    const interval = setInterval(() => {
      // Fade out
      setOpacity(0);
      
      setTimeout(() => {
        // Change message
        let newMessage = message;
        // Make sure we don't get the same message twice
        while (newMessage === message) {
          const randomIndex = Math.floor(Math.random() * config.messages.loveMessages.length);
          newMessage = config.messages.loveMessages[randomIndex];
        }
        setMessage(newMessage);
        
        // Fade in
        setOpacity(1);
      }, 1000);
    }, config?.advanced?.randomMessageInterval || 10000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [config, message]);
  
  return (
    <div className="love-messages-container" aria-live="polite">
      <div 
        className="random-love-message" 
        style={{ opacity }}
      >
        {message}
      </div>
    </div>
  );
};

export default LoveMessage; 