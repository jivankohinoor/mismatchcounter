import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useData } from '../contexts/DataContext';
import Counter from './Counter';
import AddCounterForm from './AddCounterForm';
import WeeklyStats from './WeeklyStats';
import HistoryTabs from './HistoryTabs';

const CounterSection = () => {
  const { config } = useConfig();
  const { counters } = useData();
  
  return (
    <div className="counter-section">
      <h2>
        Mismatch Counters 
        <span id="counter-icon" className="cat-icon">{config.theme?.iconEmoji || '🐱'}</span>
      </h2>
      
      {/* Counters Container */}
      <div id="counters-container" role="list">
        {counters.map((counter, index) => (
          <Counter 
            key={index}
            name={counter.name}
            counter={counter}
          />
        ))}
      </div>
      
      {/* Add New Counter Form */}
      <AddCounterForm />
      
      {/* Weekly Statistics */}
      <WeeklyStats />
      
      {/* History Tabs */}
      <div className="mismatch-history">
        <h3 className="history-title">Mismatch History</h3>
        <HistoryTabs />
      </div>
    </div>
  );
};

export default CounterSection; 