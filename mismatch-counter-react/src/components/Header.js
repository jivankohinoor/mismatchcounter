import React from 'react';
import { useConfig } from '../contexts/ConfigContext';

const Header = ({ toggleConfig, children }) => {
  const { config } = useConfig();
  
  return (
    <header>
      <h1 id="app-title">
        {config.recipient.name}'s Mismatch Counter 
        <span id="app-icon" className="cat-icon">{config.theme.iconEmoji}</span>
      </h1>
      <p id="app-subtitle">
        A little app to track all the silly things I do, with love from {config.sender.name}
      </p>
      <div className="header-controls flex items-center">
        {children}
        <button 
          id="config-toggle" 
          className="config-btn ml-2" 
          aria-label="Customize app"
          onClick={toggleConfig}
        >
          ⚙️ Customize
        </button>
      </div>
    </header>
  );
};

export default Header; 