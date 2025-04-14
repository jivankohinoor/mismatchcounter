import React from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, RotateCcw, Trash2, AlertTriangle, Calendar, Heart } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

// A compact version of the Counter component
const CompactCounter = ({ name, counter, viewMode }) => {
  const { incrementCounter, resetCounter, deleteCounter, daysBetween, getTodayDateString } = useData();
  const { confirm, success } = useNotifications();
  
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
    confirm(
      `Are you sure you want to delete the counter for "${name}"?`,
      () => {
        deleteCounter(name);
        success(`Counter "${name}" has been deleted.`);
      }
    );
  };
  
  if (viewMode === 'list') {
    // List view - horizontal with minimal info
    return (
      <div className="counter-list-item" data-counter-name={name}>
        <div className="counter-list-info">
          <Heart size={14} className="counter-icon" />
          <span className="counter-name">{name}</span>
          {counter.threshold > 0 && (
            <span className={`threshold-badge ${counter.count >= counter.threshold ? 'threshold-exceeded' : ''}`}>
              {counter.count}/{counter.threshold}
            </span>
          )}
        </div>
        
        <div className="counter-list-stats">
          <Calendar size={12} />
          <span className="days-counter">{daysWithoutMistake}d</span>
        </div>
        
        <div className="counter-list-buttons">
          <button 
            className="compact-increment-btn" 
            onClick={handleIncrement}
            title="Increment counter"
          >
            <Plus size={16} />
          </button>
          
          {counter.count > 0 && (
            <button 
              className="compact-reset-btn" 
              onClick={handleReset}
              title="Reset counter"
            >
              <RotateCcw size={16} />
            </button>
          )}
          
          <button 
            className="compact-delete-btn" 
            onClick={handleDelete}
            title="Delete counter"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  } else {
    // Compact view - smaller cards
    return (
      <div className="counter-compact" data-counter-name={name}>
        <div className="counter-compact-header">
          <span className="counter-name">
            <Heart size={14} className="counter-icon" />
            {name}
          </span>
          
          {counter.threshold > 0 && (
            <span className={`threshold-badge ${counter.count >= counter.threshold ? 'threshold-exceeded' : ''}`}>
              {counter.count}/{counter.threshold}
            </span>
          )}
        </div>
        
        <div className="counter-compact-body">
          <div className="counter-compact-stats">
            <Calendar size={14} className="calendar-icon" />
            <span>{daysWithoutMistake} days</span>
          </div>
          
          <div className="counter-compact-count">{counter.count}</div>
        </div>
        
        <div className="counter-compact-buttons">
          <button 
            className="compact-increment-btn" 
            onClick={handleIncrement}
            title="Increment counter"
          >
            <Plus size={16} />
          </button>
          
          {counter.count > 0 && (
            <button 
              className="compact-reset-btn" 
              onClick={handleReset}
              title="Reset counter"
            >
              <RotateCcw size={16} />
            </button>
          )}
          
          <button 
            className="compact-delete-btn" 
            onClick={handleDelete}
            title="Delete counter"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        {counter.activeConsequence && !counter.activeConsequence.completed && (
          <div className="counter-compact-consequence">
            <AlertTriangle size={14} />
            <span>Active consequence</span>
          </div>
        )}
      </div>
    );
  }
};

export default CompactCounter;