import React, { createContext, useState, useEffect, useContext } from 'react';
import { useConfig } from './ConfigContext';

// Create a context for birthday features
export const BirthdayContext = createContext();

// Create a provider component
export const BirthdayProvider = ({ children }) => {
  const { config } = useConfig();
  const [showPreloader, setShowPreloader] = useState(true);
  const [showBirthdayMessage, setShowBirthdayMessage] = useState(false);
  const [countdownText, setCountdownText] = useState('Loading countdown...');
  const [unlockCode, setUnlockCode] = useState('');

  // Check birthday status when component mounts or config changes
  useEffect(() => {
    if (!config.isLoading) {
      checkBirthdayStatus();
    }
  }, [config]);

  // Check if it's birthday or after birthday
  const isBirthdayOrAfter = () => {
    const now = new Date().getTime();
    return now >= new Date(config.recipient?.birthdayDate).getTime();
  };

  // Update countdown timer
  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = new Date(config.recipient?.birthdayDate).getTime() - now;
    
    // If it's already birthday or past it
    if (distance <= 0) {
      showBirthdayCelebration();
      return;
    }
    
    // Calculate days, hours, minutes, seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update countdown text
    setCountdownText(`${days}d ${hours}h ${minutes}m ${seconds}s`);
  };

  // Show birthday celebration
  const showBirthdayCelebration = () => {
    // Hide preloader countdown
    setShowPreloader(false);
    
    // Show birthday message
    setTimeout(() => {
      setShowBirthdayMessage(true);
      createConfetti();
    }, 1000);
  };

  // Create confetti animation
  const createConfetti = () => {
    // Remove any existing confetti first
    document.querySelectorAll('.confetti').forEach(el => el.remove());
    
    const confettiCount = 200;
    const colors = ['#ffd700', '#ff69b4', '#87CEEB', '#90EE90', '#FF6347', '#9370DB'];
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Set a non-infinite animation with random duration
      const duration = Math.random() * 3 + 2;
      confetti.style.animation = `confetti-fall ${duration}s linear`;
      
      // Auto-remove confetti after animation completes
      confetti.addEventListener('animationend', function() {
        this.remove();
      });
      
      document.body.appendChild(confetti);
    }
  };

  // Check birthday status
  const checkBirthdayStatus = () => {
    if (isBirthdayOrAfter()) {
      showBirthdayCelebration();
    } else {
      // Start countdown timer
      updateCountdown();
      const countdownInterval = setInterval(updateCountdown, 1000);
      
      // Clean up interval on component unmount
      return () => clearInterval(countdownInterval);
    }
  };

  // Handle unlock code input change
  const handleUnlockCodeChange = (e) => {
    setUnlockCode(e.target.value);
  };

  // Try to unlock app with code
  const tryUnlock = () => {
    if (unlockCode === config.recipient?.secretCode) {
      setShowPreloader(false);
      return true;
    } else {
      alert(`Incorrect code. Please wait until ${config.recipient?.name}'s special day!`);
      return false;
    }
  };

  // Handle birthday button click
  const handleBirthdayButtonClick = () => {
    setShowBirthdayMessage(false);
  };

  return (
    <BirthdayContext.Provider
      value={{
        showPreloader,
        showBirthdayMessage,
        countdownText,
        unlockCode,
        handleUnlockCodeChange,
        tryUnlock,
        handleBirthdayButtonClick
      }}
    >
      {children}
    </BirthdayContext.Provider>
  );
};

// Custom hook to use the birthday context
export const useBirthday = () => {
  const context = useContext(BirthdayContext);
  if (context === undefined) {
    throw new Error('useBirthday must be used within a BirthdayProvider');
  }
  return context;
}; 