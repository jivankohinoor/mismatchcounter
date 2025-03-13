import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useBirthday } from '../contexts/BirthdayContext';

const Preloader = () => {
  const { config } = useConfig();
  const { 
    countdownText, 
    unlockCode, 
    handleUnlockCodeChange, 
    tryUnlock 
  } = useBirthday();
  
  const handleUnlock = (e) => {
    e.preventDefault();
    tryUnlock();
  };
  
  return (
    <div className="preloader">
      <div className="gift-box">
        <div className="gift-ribbon"></div>
        <div className="gift-lid"></div>
      </div>
      
      <div className="countdown-container">
        <div id="countdown">{countdownText}</div>
      </div>
      
      <div className="countdown-message">
        <p id="countdown-text">{config.messages.countdownMessage}</p>
        <p id="countdown-date">
          Please wait until {new Date(config.recipient.birthdayDate).toLocaleDateString()} to open...
        </p>
      </div>
      
      <form className="unlock-section" onSubmit={handleUnlock}>
        <input 
          type="password" 
          className="unlock-input" 
          id="unlock-code" 
          placeholder="Secret code..." 
          aria-label="Secret unlock code"
          value={unlockCode}
          onChange={handleUnlockCodeChange}
        />
        <button 
          className="unlock-button" 
          id="unlock-button" 
          aria-label="Unlock the app"
          type="submit"
        >
          Unlock
        </button>
      </form>
    </div>
  );
};

export default Preloader; 