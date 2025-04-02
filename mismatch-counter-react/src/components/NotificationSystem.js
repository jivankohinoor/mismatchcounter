import React, { useState, useEffect, createContext, useContext } from 'react';
import { useData } from '../contexts/DataContext';
import { useConfig } from '../contexts/ConfigContext';

// Create a notification context
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { counters } = useData();
  const { config } = useConfig();

  // Check for threshold notifications
  useEffect(() => {
    if (!counters || counters.length === 0) return;

    // Check if any counter has reached its threshold
    counters.forEach(counter => {
      if (counter.count >= counter.threshold) {
        // Check if we already sent a notification for this
        const notificationId = `threshold-${counter.name}-${counter.count}`;
        const notificationExists = notifications.some(n => n.id === notificationId);
        
        // If not already notified, add a new notification
        if (!notificationExists) {
          addNotification({
            id: notificationId,
            type: 'threshold',
            title: 'Threshold Reached',
            message: `"${counter.name}" has reached the threshold of ${counter.threshold}!`,
            counterName: counter.name,
            count: counter.count,
            threshold: counter.threshold,
            date: new Date()
          });
        }
      }
    });
  }, [counters, notifications]);

  // Check for streak notifications
  useEffect(() => {
    if (!counters || counters.length === 0) return;

    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Check each counter for streaks
    counters.forEach(counter => {
      // If the counter hasn't been incremented or was reset recently
      if ((!counter.lastIncrement || new Date(counter.lastIncrement) < new Date(counter.lastReset)) && 
          counter.lastReset) {
        
        // Calculate days since last reset
        const daysSinceReset = Math.floor(
          (new Date(today) - new Date(counter.lastReset)) / (1000 * 60 * 60 * 24)
        );
        
        // Check if we've hit milestone streaks (7, 14, 30 days)
        const milestones = [7, 14, 30];
        
        milestones.forEach(milestone => {
          if (daysSinceReset === milestone) {
            const notificationId = `streak-${counter.name}-${milestone}`;
            const notificationExists = notifications.some(n => n.id === notificationId);
            
            if (!notificationExists) {
              addNotification({
                id: notificationId,
                type: 'streak',
                title: `${milestone}-Day Streak!`,
                message: `"${counter.name}" has gone ${milestone} days without a mistake!`,
                counterName: counter.name,
                days: milestone,
                date: new Date()
              });
            }
          }
        });
      }
    });
  }, [counters, notifications]);

  // Add a new notification
  const addNotification = (notification) => {
    setNotifications(prevNotifications => [
      ...prevNotifications,
      { ...notification, read: false }
    ]);

    // Show browser notification if enabled in config
    if (config.allowNotifications && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  // Clear a notification
  const clearNotification = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== notificationId)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Get unread notifications count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Context value
  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// NotificationBell component
export const NotificationBell = () => {
  const { notifications, unreadCount, markAllAsRead, clearNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAllAsRead();
    }
  };

  // Format date relative to now
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-bell relative">
      <button 
        onClick={toggleNotifications}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="notification-dropdown absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {[...notifications].reverse().map(notification => (
                  <li key={notification.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <div className="font-medium text-sm">
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <button 
                        onClick={() => clearNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="text-xs text-gray-400 mt-2">
                      {formatRelativeTime(notification.date)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;