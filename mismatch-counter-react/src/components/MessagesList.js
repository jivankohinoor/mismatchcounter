import React, { useState } from 'react';

const MessagesList = ({ messages, onAddMessage, onRemoveMessage, type }) => {
  const [newMessage, setNewMessage] = useState('');
  
  // Labels en fonction du type de message
  const labels = {
    loveMessages: {
      title: 'Messages d\'amour',
      inputPlaceholder: 'Entrez un nouveau message d\'amour',
      buttonText: 'Ajouter un message',
      emptyText: 'Aucun message d\'amour ajouté'
    },
    consequences: {
      title: 'Conséquences',
      inputPlaceholder: 'Entrez une nouvelle conséquence',
      buttonText: 'Ajouter une conséquence',
      emptyText: 'Aucune conséquence ajoutée'
    }
  };
  
  const currentLabels = labels[type] || labels.loveMessages;
  
  const handleAddMessage = () => {
    if (newMessage.trim()) {
      onAddMessage(newMessage.trim());
      setNewMessage('');
    }
  };
  
  return (
    <div className="messages-list-container">
      <h4>{currentLabels.title}</h4>
      
      <div className="message-list">
        {messages.length === 0 ? (
          <p className="empty-list-message">{currentLabels.emptyText}</p>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="message-item">
              <span className="message-text">{message}</span>
              <button 
                type="button" 
                className="remove-message-btn"
                onClick={() => onRemoveMessage(index)}
              >
                &times;
              </button>
            </div>
          ))
        )}
      </div>
      
      <div className="add-message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={currentLabels.inputPlaceholder}
        />
        <button 
          type="button" 
          onClick={handleAddMessage}
          className="add-message-btn"
        >
          {currentLabels.buttonText}
        </button>
      </div>
    </div>
  );
};

export default MessagesList; 