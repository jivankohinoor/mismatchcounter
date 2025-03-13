import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useData } from '../contexts/DataContext';

const Counter = ({ name, counter }) => {
  const { config } = useConfig();
  const { incrementCounter, resetCounter, deleteCounter, daysBetween, getTodayDateString } = useData();
  
  // Calculate days without mistake
  const calculateDaysWithoutMistake = () => {
    const today = getTodayDateString();
    
    if (!counter.events || !Array.isArray(counter.events) || counter.events.length === 0) {
      return counter.lastReset ? 
        daysBetween(counter.lastReset, today) : 0;
    }
    
    // Find the most recent increment event
    const incrementEvents = counter.events
      .filter(event => event.type === 'increment')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // If there are no increment events, use the last reset date
    if (incrementEvents.length === 0) {
      return counter.lastReset ? 
        daysBetween(counter.lastReset, today) : 0;
    }
    
    // Return days since the last increment
    return daysBetween(incrementEvents[0].date, today);
  };
  
  const daysWithoutMistake = calculateDaysWithoutMistake();
  
  // Get random consequence if threshold is exceeded
  const getRandomConsequence = () => {
    if (config.messages && config.messages.consequences && config.messages.consequences.length > 0) {
      const randomIndex = Math.floor(Math.random() * config.messages.consequences.length);
      return config.messages.consequences[randomIndex];
    }
    return "Time for a special consequence!";
  };
  
  // Handle increment click
  const handleIncrement = () => {
    incrementCounter(name);
  };
  
  // Handle reset click
  const handleReset = () => {
    resetCounter(name);
  };
  
  // Handle delete click
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the counter for "${name}"?`)) {
      deleteCounter(name);
    }
  };
  
  return (
    <div 
      className="counter" 
      data-counter-name={name}
      role="listitem"
      aria-label={`Mismatch counter: ${name}`}
    >
      {/* Threshold Warning Badge */}
      {counter.threshold > 0 && (
        <div 
          className={`threshold-warning ${counter.count >= counter.threshold ? 'threshold-exceeded' : ''}`}
        >
          Limit: {counter.threshold}
        </div>
      )}
      
      {/* Counter Details */}
      <div className="counter-details">
        <span className="counter-name">{counter.name}</span>
        <span className="counter-stats">
          {daysWithoutMistake} {daysWithoutMistake === 1 ? 'day' : 'days'} without mistake
        </span>
      </div>
      
      {/* Counter Buttons */}
      <div className="counter-buttons">
        <span className="count">{counter.count}</span>
        
        <button 
          className="increment-btn" 
          aria-label={`Increment ${counter.name}`}
          onClick={handleIncrement}
        >
          +1
        </button>
        
        <button 
          className="delete-btn" 
          aria-label={`Delete ${counter.name} counter`}
          onClick={handleDelete}
        >
          🗑️
        </button>
        
        {/* Reset/Forgive button if count > 0 */}
        {counter.count > 0 && (
          <button 
            className="forgive-btn" 
            aria-label={`Forgive ${counter.name}`}
            onClick={handleReset}
          >
            Forgive
          </button>
        )}
      </div>
      
      {/* Consequence Alert if threshold is exceeded */}
      {counter.threshold > 0 && counter.count >= counter.threshold && (
        <div className="consequence-alert">
          <h3>Consequence Triggered!</h3>
          <p>{getRandomConsequence()}</p>
        </div>
      )}
    </div>
  );
};

export default Counter; 