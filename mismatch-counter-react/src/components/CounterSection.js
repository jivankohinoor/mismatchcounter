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
  
  // Map iconName to emoji for display
  const getIconEmoji = (iconName) => {
    const iconToEmojiMap = {
      'Heart': '❤️',
      'Star': '⭐',
      'Moon': '🌙',
      'Sun': '☀️',
      'Leaf': '🍃',
      'Coffee': '☕',
      'Gift': '🎁',
      'Home': '🏠',
      'Crown': '👑',
      'Music': '🎵',
      'Smile': '😊',
      'Cat': '🐱',
      'Camera': '📷',
      'Droplets': '💧',
      'Minimize': '🔹',
      'Flame': '🔥',
      'Pizza': '🍕',
      'AlignJustify': '🗂️',
      'ShoppingBag': '🛍️',
      'Cake': '🎂'
    };
    
    return iconToEmojiMap[iconName] || '🐱';
  };
  
  // Get the appropriate emoji from theme config
  const iconEmoji = config.theme?.iconEmoji || getIconEmoji(config.theme?.iconName) || '🐱';
  
  return (
    <div className="counter-section">
      <h2>
        Mismatch Counters 
        <span id="counter-icon" className="cat-icon">{iconEmoji}</span>
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