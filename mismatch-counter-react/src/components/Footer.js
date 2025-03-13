import React from 'react';
import { useConfig } from '../contexts/ConfigContext';

const Footer = () => {
  const { config } = useConfig();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-text">
          Created with ❤️ for {config.recipientName} by {config.senderName}
        </p>
        <p className="footer-version">
          Version 2.0.0 · React Edition · &copy; {currentYear}
        </p>
        <p className="footer-credits">
          <a 
            href="https://github.com/your-github/mismatch-counter" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          {" · "}
          <button 
            className="footer-link accessibility-btn"
            onClick={() => {
              alert(`Accessibility Features:\n
- All interactive elements are keyboard navigable
- Screen reader friendly semantic HTML
- Color contrast ratios meet WCAG standards
- Descriptive alt text for all images
- Custom focus indicators for better visibility`);
            }}
          >
            Accessibility
          </button>
        </p>
      </div>
    </footer>
  );
};

export default Footer; 