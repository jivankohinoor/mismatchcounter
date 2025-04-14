import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationBell from './ui/NotificationBell';
import { Heart } from 'lucide-react';

const AppHeader = ({ recipient, sender, theme }) => {
  const { unreadCount } = useNotifications();
  
  // Get icon emoji based on theme
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
  
  const iconEmoji = theme?.iconEmoji || getIconEmoji(theme?.iconName) || '🐱';
  
  return (
    <header className="app-header">
      <div className="app-title-wrapper">
        <Heart size={24} className="app-logo" style={{ color: theme?.mainColor || '#ff69b4' }} />
        <div className="app-title-content">
          <h1 className="app-title">
            {recipient?.name || 'Your'} Mismatch Counter
            <span className="app-icon">
              {iconEmoji}
            </span>
          </h1>
          {sender?.name && (
            <p className="app-subtitle">
              With love from {sender.name}
            </p>
          )}
        </div>
      </div>
      
      <div className="app-controls">
        <NotificationBell />
      </div>
    </header>
  );
};

export default AppHeader;