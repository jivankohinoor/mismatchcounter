import React, { useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useBirthday } from '../contexts/BirthdayContext';

const BirthdayMessage = () => {
  const { config } = useConfig();
  const { handleBirthdayButtonClick, showBirthdayMessage, setShowBirthdayMessage } = useBirthday();
  
  // Vérifier si nous sommes le jour de l'anniversaire
  useEffect(() => {
    const checkIfBirthdayIsToday = () => {
      if (!config.recipient?.birthdayDate) return false;
      
      const birthday = new Date(config.recipient.birthdayDate);
      const today = new Date();
      
      // Vérifier si nous sommes bien le jour même de l'anniversaire (même jour, même mois)
      return (
        birthday.getDate() === today.getDate() &&
        birthday.getMonth() === today.getMonth() &&
        birthday.getFullYear() <= today.getFullYear()
      );
    };
    
    // Ne pas montrer le message si ce n'est pas le jour de l'anniversaire
    if (!checkIfBirthdayIsToday() && showBirthdayMessage) {
      setShowBirthdayMessage(false);
    }
  }, [config.recipient?.birthdayDate, setShowBirthdayMessage, showBirthdayMessage]);
  
  // Ne rien rendre si ce n'est pas visible
  if (!showBirthdayMessage) return null;
  
  return (
    <div id="birthday-message" className="birthday-message" role="dialog" aria-labelledby="birthday-title">
      <h2 id="birthday-title">{config.messages.birthdayTitle}</h2>
      <p id="birthday-text">{config.messages.birthdayMessage}</p>
      <button 
        className="birthday-button" 
        id="birthday-button" 
        aria-label="Open your gift"
        onClick={handleBirthdayButtonClick}
      >
        Open Your Gift!
      </button>
    </div>
  );
};

export default BirthdayMessage; 