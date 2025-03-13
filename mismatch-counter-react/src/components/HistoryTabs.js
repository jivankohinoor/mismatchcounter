import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';

const HistoryTabs = () => {
  const { counters } = useData();
  const [activeTab, setActiveTab] = useState('recent');
  
  const allEvents = useMemo(() => {
    // Collect all events from all counters
    const events = [];
    counters.forEach(counter => {
      if (counter.events && Array.isArray(counter.events)) {
        counter.events.forEach(event => {
          events.push({
            ...event,
            counterName: counter.name
          });
        });
      }
    });
    
    // Sort by date, most recent first
    return events.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [counters]);
  
  // Get the 20 most recent events
  const recentEvents = allEvents.slice(0, 20);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get event type display text and class
  const getEventInfo = (type) => {
    switch (type) {
      case 'increment':
        return { text: 'Increment', className: 'increment-event' };
      case 'reset':
        return { text: 'Reset', className: 'reset-event' };
      default:
        return { text: type, className: 'other-event' };
    }
  };
  
  // Calculate days since last increment for a counter
  const getDaysSinceLastIncrement = (counter) => {
    if (!counter.events || !Array.isArray(counter.events) || counter.events.length === 0) {
      return 0;
    }
    
    // Filter increment events and sort by date (newest first)
    const incrementEvents = counter.events
      .filter(event => event.type === 'increment')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (incrementEvents.length === 0) {
      // If no increment events, use lastReset or 0
      return counter.lastReset ? 
        Math.floor((new Date() - new Date(counter.lastReset)) / (1000 * 60 * 60 * 24)) : 0;
    }
    
    // Calculate days between last increment and now
    const lastDate = new Date(incrementEvents[0].date);
    const now = new Date();
    return Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
  };
  
  return (
    <div className="history-section">
      <h3>History</h3>
      
      <div className="history-tabs">
        <button 
          className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          Recent Activity
        </button>
        <button 
          className={`tab-btn ${activeTab === 'streaks' ? 'active' : ''}`}
          onClick={() => setActiveTab('streaks')}
        >
          Streaks & Records
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'recent' && (
          <div className="recent-events">
            {recentEvents.length > 0 ? (
              <ul className="event-list">
                {recentEvents.map((event, index) => {
                  const eventInfo = getEventInfo(event.type);
                  return (
                    <li key={index} className={`event-item ${eventInfo.className}`}>
                      <span className="event-counter">{event.counterName}</span>
                      <span className="event-type">{eventInfo.text}</span>
                      <span className="event-date">{formatDate(event.date)}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="no-events">No events recorded yet.</p>
            )}
          </div>
        )}
        
        {activeTab === 'streaks' && (
          <div className="streaks-content">
            <h4>Current Streaks</h4>
            <ul className="streaks-list">
              {counters.map((counter, index) => {
                const daysSinceLastIncrement = getDaysSinceLastIncrement(counter);
                return (
                  <li key={index} className="streak-item">
                    <span className="streak-name">{counter.name}</span>
                    <span className="streak-days">{daysSinceLastIncrement} day{daysSinceLastIncrement !== 1 ? 's' : ''}</span>
                  </li>
                );
              })}
            </ul>
            
            <h4>Total Counts</h4>
            <ul className="total-counts-list">
              {counters.map((counter, index) => {
                const totalIncrements = counter.events && Array.isArray(counter.events) ? 
                  counter.events.filter(e => e.type === 'increment').length : 0;
                return (
                  <li key={index} className="total-count-item">
                    <span className="count-name">{counter.name}</span>
                    <span className="count-value">{totalIncrements}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTabs; 