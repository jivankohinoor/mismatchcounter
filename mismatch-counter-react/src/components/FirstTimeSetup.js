import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { Heart, Palette, User, Gift } from 'lucide-react';
import '../styles/firstTimeSetup.tailwind.css';

const FirstTimeSetup = () => {
  const { saveConfig } = useConfig();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipient: '',
    sender: '',
    theme: {
      mainColor: '#FF6B6B',
      secondaryColor: '#4ECDC4',
      backgroundColor: '#F7F7F7',
      fontFamily: "'Poppins', sans-serif"
    },
    messages: {
      birthdayTitle: 'Happy Birthday!',
      birthdayMessage: 'Wishing you a wonderful day!',
      loveMessage: 'I love you!'
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThemeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [name]: value
      }
    }));
  };

  const handleMessageChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveConfig(formData);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="first-time-setup">
      <div className="setup-header">
        <h1>Welcome to Mismatch Counter!</h1>
        <p>Let's set up your counter for your special someone.</p>
      </div>

      <div className="setup-progress">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <User size={20} />
          <span>Basic Info</span>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <Heart size={20} />
          <span>Messages</span>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <Palette size={20} />
          <span>Appearance</span>
        </div>
        <div className={`step ${step >= 4 ? 'active' : ''}`}>
          <Gift size={20} />
          <span>Ready!</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="setup-form">
        {step === 1 && (
          <div className="form-step">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label htmlFor="recipient">Recipient's Name</label>
              <input
                type="text"
                id="recipient"
                name="recipient"
                value={formData.recipient}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sender">Your Name</label>
              <input
                type="text"
                id="sender"
                name="sender"
                value={formData.sender}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2>Messages</h2>
            <div className="form-group">
              <label htmlFor="loveMessage">Love Message</label>
              <input
                type="text"
                id="loveMessage"
                name="loveMessage"
                value={formData.messages.loveMessage}
                onChange={handleMessageChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="birthdayTitle">Birthday Title</label>
              <input
                type="text"
                id="birthdayTitle"
                name="birthdayTitle"
                value={formData.messages.birthdayTitle}
                onChange={handleMessageChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="birthdayMessage">Birthday Message</label>
              <textarea
                id="birthdayMessage"
                name="birthdayMessage"
                value={formData.messages.birthdayMessage}
                onChange={handleMessageChange}
                required
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2>Appearance</h2>
            <div className="form-group">
              <label htmlFor="mainColor">Main Color</label>
              <input
                type="color"
                id="mainColor"
                name="mainColor"
                value={formData.theme.mainColor}
                onChange={handleThemeChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="secondaryColor">Secondary Color</label>
              <input
                type="color"
                id="secondaryColor"
                name="secondaryColor"
                value={formData.theme.secondaryColor}
                onChange={handleThemeChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="backgroundColor">Background Color</label>
              <input
                type="color"
                id="backgroundColor"
                name="backgroundColor"
                value={formData.theme.backgroundColor}
                onChange={handleThemeChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="fontFamily">Font Family</label>
              <select
                id="fontFamily"
                name="fontFamily"
                value={formData.theme.fontFamily}
                onChange={handleThemeChange}
              >
                <option value="'Poppins', sans-serif">Poppins</option>
                <option value="'Inter', sans-serif">Inter</option>
                <option value="'Montserrat', sans-serif">Montserrat</option>
              </select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-step">
            <h2>Ready to Go!</h2>
            <p>Your counter is all set up. Click "Finish" to start counting!</p>
            <div className="preview">
              <div className="preview-header">
                <h3>Preview</h3>
              </div>
              <div className="preview-content">
                <p>Recipient: {formData.recipient}</p>
                <p>Sender: {formData.sender}</p>
                <p>Love Message: {formData.messages.loveMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="btn-secondary">
              Back
            </button>
          )}
          {step < 4 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next
            </button>
          ) : (
            <button type="submit" className="btn-primary">
              Finish
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FirstTimeSetup; 