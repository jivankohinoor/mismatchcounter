import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useData } from './DataContext';
import { useConfig } from './ConfigContext';

// Create notification context
export const NotificationContext = createContext();

// Types of notifications
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  CONFIRM: 'confirm',
  THRESHOLD: 'threshold',
  STREAK: 'streak'
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [confirmCallback, setConfirmCallback] = useState(null);
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
          const message = `"${counter.name}" has reached the threshold of ${counter.threshold}!`;
          const title = 'Threshold Reached';
          
          addNotificationObj({
            id: notificationId,
            type: NOTIFICATION_TYPES.THRESHOLD,
            title: title,
            message: message,
            counterName: counter.name,
            count: counter.count,
            threshold: counter.threshold,
            date: new Date(),
            read: false
          });
          
          // Show browser notification if enabled
          showBrowserNotification(title, message);
        }
      }
    });
  }, [counters]);

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
              const message = `"${counter.name}" has gone ${milestone} days without a mistake!`;
              const title = `${milestone}-Day Streak!`;
              
              addNotificationObj({
                id: notificationId,
                type: NOTIFICATION_TYPES.STREAK,
                title: title,
                message: message,
                counterName: counter.name,
                days: milestone,
                date: new Date(),
                read: false
              });
              
              // Show browser notification if enabled
              showBrowserNotification(title, message);
            }
          }
        });
      }
    });
  }, [counters]);
  
  // Helper function to show browser notifications
  const showBrowserNotification = (title, message) => {
    if (config?.advanced?.allowNotifications && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification(title, {
              body: message,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
  };

  // Add a notification with just message
  const addNotification = useCallback((message, type = NOTIFICATION_TYPES.INFO, timeout = 3000) => {
    const id = Date.now() + Math.random().toString(36);
    
    const newNotification = {
      id,
      message, 
      type,
      timeout,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      date: new Date(),
      read: false
    };
    
    setNotifications(prevNotifications => [
      ...prevNotifications,
      newNotification
    ]);
    
    // Auto-remove notification after timeout (except for confirm type)
    if (type !== NOTIFICATION_TYPES.CONFIRM && timeout > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }
    
    return id;
  }, []);
  
  // Add a notification with an object
  const addNotificationObj = useCallback((notificationObj) => {
    setNotifications(prevNotifications => [
      ...prevNotifications,
      notificationObj
    ]);
    
    // Auto-remove notification after timeout if specified
    if (notificationObj.timeout && notificationObj.timeout > 0 &&
        notificationObj.type !== NOTIFICATION_TYPES.CONFIRM) {
      setTimeout(() => {
        removeNotification(notificationObj.id);
      }, notificationObj.timeout);
    }
    
    return notificationObj.id;
  }, []);
  
  // Show a confirmation dialog
  const showConfirmation = useCallback((message, onConfirm, onCancel) => {
    const id = addNotification(message, NOTIFICATION_TYPES.CONFIRM, 0);
    setConfirmCallback({ id, onConfirm, onCancel });
    return id;
  }, [addNotification]);
  
  // Handle confirmation
  const handleConfirm = useCallback((id, confirmed) => {
    if (confirmCallback && confirmCallback.id === id) {
      if (confirmed && confirmCallback.onConfirm) {
        confirmCallback.onConfirm();
      } else if (!confirmed && confirmCallback.onCancel) {
        confirmCallback.onCancel();
      }
      setConfirmCallback(null);
    }
    removeNotification(id);
  }, [confirmCallback]);
  
  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  }, []);
  
  // Success notification shorthand
  const success = useCallback((message, timeout = 3000) => {
    return addNotification(message, NOTIFICATION_TYPES.SUCCESS, timeout);
  }, [addNotification]);
  
  // Error notification shorthand
  const error = useCallback((message, timeout = 5000) => {
    return addNotification(message, NOTIFICATION_TYPES.ERROR, timeout);
  }, [addNotification]);
  
  // Warning notification shorthand
  const warning = useCallback((message, timeout = 4000) => {
    return addNotification(message, NOTIFICATION_TYPES.WARNING, timeout);
  }, [addNotification]);
  
  // Info notification shorthand
  const info = useCallback((message, timeout = 3000) => {
    return addNotification(message, NOTIFICATION_TYPES.INFO, timeout);
  }, [addNotification]);
  
  // Confirm dialog shorthand
  const confirm = useCallback((message, onConfirm, onCancel) => {
    return showConfirmation(message, onConfirm, onCancel);
  }, [showConfirmation]);
  
  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  }, []);
  
  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  // Get unread notifications count
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        addNotificationObj,
        removeNotification,
        success,
        error,
        warning,
        info,
        confirm,
        handleConfirm,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        unreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};