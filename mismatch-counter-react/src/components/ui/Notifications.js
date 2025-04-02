import React from 'react';
import { useNotifications, NOTIFICATION_TYPES } from '../../contexts/NotificationContext';
import { X, Check, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Notification wrapper component
const Notifications = () => {
  const { notifications, removeNotification, handleConfirm } = useNotifications();
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="notifications-container">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
          onConfirm={() => handleConfirm(notification.id, true)}
          onCancel={() => handleConfirm(notification.id, false)}
        />
      ))}
    </div>
  );
};

// Individual notification item
const NotificationItem = ({ notification, onClose, onConfirm, onCancel }) => {
  const { id, message, type } = notification;
  
  // Function to render the icon based on notification type
  const renderIcon = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <Check className="notification-icon success" />;
      case NOTIFICATION_TYPES.ERROR:
        return <AlertCircle className="notification-icon error" />;
      case NOTIFICATION_TYPES.WARNING:
        return <AlertTriangle className="notification-icon warning" />;
      case NOTIFICATION_TYPES.CONFIRM:
      case NOTIFICATION_TYPES.INFO:
      default:
        return <Info className="notification-icon info" />;
    }
  };
  
  return (
    <div 
      className={`notification ${type}`} 
      role={type === NOTIFICATION_TYPES.CONFIRM ? 'dialog' : 'alert'}
      aria-labelledby={`notification-${id}`}
    >
      <div className="notification-content">
        {renderIcon()}
        <div className="notification-message" id={`notification-${id}`}>
          {message}
        </div>
        {type !== NOTIFICATION_TYPES.CONFIRM && (
          <button 
            className="notification-close" 
            onClick={onClose}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {type === NOTIFICATION_TYPES.CONFIRM && (
        <div className="notification-actions">
          <button
            className="notification-btn confirm"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="notification-btn cancel"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;