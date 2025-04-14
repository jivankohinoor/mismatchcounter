import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useData } from '../contexts/DataContext';
import Counter from './Counter';
import CompactCounter from './CompactCounter';
import AddCounterForm from './AddCounterForm';
import WeeklyStats from './WeeklyStats';
import HistoryTabs from './HistoryTabs';
import { List, Grid, Sliders } from 'lucide-react';

const CounterSection = () => {
  const { config } = useConfig();
  const { counters } = useData();
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'compact', or 'list'
  
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
      <div className="counter-header">
        <h2>
          Mismatch Counters 
          <span id="counter-icon" className="cat-icon">{iconEmoji}</span>
        </h2>
        
        <div className="view-toggle">
          <button 
            className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
            aria-label="Card view"
            title="Card view"
          >
            <Grid size={18} />
          </button>
          <button 
            className={`view-toggle-btn ${viewMode === 'compact' ? 'active' : ''}`}
            onClick={() => setViewMode('compact')}
            aria-label="Compact view"
            title="Compact view"
          >
            <Sliders size={18} />
          </button>
          <button 
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
            title="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>
      
      {/* Counters Container */}
      <div 
        id="counters-container" 
        role="list"
        className={`counters-${viewMode}`}
      >
        {counters.map((counter, index) => {
          // Render different counter components based on the view mode
          if (viewMode === 'cards') {
            return (
              <Counter 
                key={index}
                name={counter.name}
                counter={counter}
              />
            );
          } else {
            return (
              <CompactCounter 
                key={index}
                name={counter.name}
                counter={counter}
                viewMode={viewMode}
              />
            );
          }
        })}
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