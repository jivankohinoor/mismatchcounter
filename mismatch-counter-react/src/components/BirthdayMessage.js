import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useBirthday } from '../contexts/BirthdayContext';

const BirthdayMessage = () => {
  const { config } = useConfig();
  const { handleBirthdayButtonClick } = useBirthday();
  
  return (
    <div id="birthday-message" className="birthday-message" role="dialog" aria-labelledby="birthday-title">
      <h2 id="birthday-title">{config.messages.birthdayTitle}</h2>
      <p id="birthday-text">{config.messages.birthdayMessage}</p>
      <button 
        className="birthday-button" 
        id="birthday-button" 
        aria-label="Open your gift"
        onClick={handleBirthdayButtonClick}
      >
        Open Your Gift!
      </button>
    </div>
  );
};

export default BirthdayMessage; 