import React, { useState, useEffect } from 'react';
import themePresets from '../utils/themePresets';
import ThemeIcon, { getThemeIcon } from './ThemeIcon';

const ThemePreview = ({ currentTheme, previewTheme, onApplyTheme, onRevertTheme }) => {
  // Local state to track theme changes
  const [appliedTheme, setAppliedTheme] = useState(null);
  const [animatePreview, setAnimatePreview] = useState(false);
  
  // Determine which theme to display (preview, applied, or current)
  const displayTheme = previewTheme || appliedTheme || currentTheme;
  
  // Animation effect when theme changes
  useEffect(() => {
    if (previewTheme) {
      setAnimatePreview(true);
      const timer = setTimeout(() => setAnimatePreview(false), 300);
      return () => clearTimeout(timer);
    }
  }, [previewTheme]);
  
  // Generate styles for preview panel based on theme
  const previewStyle = {
    backgroundColor: displayTheme.backgroundColor,
    color: "#333333",
    fontFamily: displayTheme.fontFamily,
    transition: "all 0.3s ease",
    animation: animatePreview ? "preview-pulse 0.3s ease" : "none",
  };
  
  // Dynamic styles to add to document
  useEffect(() => {
    // Create style element for preview animation
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes preview-pulse {
        0% { transform: scale(0.98); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  const headerStyle = {
    color: displayTheme.secondaryColor,
    borderBottom: `2px solid ${displayTheme.mainColor}20`,
    paddingBottom: "0.5rem",
    marginBottom: "1rem"
  };
  
  const buttonStyle = {
    backgroundColor: displayTheme.mainColor,
    color: 'white',
    borderRadius: "0.375rem",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "none",
    fontSize: "0.875rem",
  };
  
  const secondaryButtonStyle = {
    backgroundColor: displayTheme.secondaryColor,
    color: 'white',
    borderRadius: "0.375rem",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "none",
    marginLeft: "0.5rem",
    fontSize: "0.875rem",
  };
  
  // Récupérer l'icône du thème
  const IconComponent = getThemeIcon(displayTheme.iconName);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Prévisualisation du thème</h3>
      
      <div 
        className="p-6 rounded-lg shadow-md mb-6" 
        style={previewStyle}
      >
        <div className="flex items-center mb-4" style={headerStyle}>
          <IconComponent size={24} color={displayTheme.secondaryColor} />
          <h4 className="ml-2 text-xl font-semibold" style={{ color: displayTheme.secondaryColor }}>
            Exemple d'affichage
          </h4>
        </div>
        
        <p className="mb-4" style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
          Ce panneau montre un aperçu de votre thème actuel avec la police <strong>{displayTheme.fontFamily.split(',')[0].replace(/'/g, '')}</strong>.
        </p>
        
        <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: `${displayTheme.mainColor}15` }}>
          <div className="flex items-center">
            <ThemeIcon name="Info" size={18} color={displayTheme.mainColor} />
            <span className="ml-2" style={{ color: displayTheme.mainColor, fontWeight: "500" }}>
              Information importante
            </span>
          </div>
          <p className="mt-2 text-sm">
            Les couleurs, polices et icônes sont personnalisables selon vos préférences.
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <ThemeIcon name="Check" size={18} color={displayTheme.secondaryColor} />
            <span className="ml-2 text-sm">Thème appliqué</span>
          </div>
          
          <div className="flex">
            <button style={buttonStyle}>
              Bouton principal
            </button>
            <button style={secondaryButtonStyle}>
              Option
            </button>
          </div>
        </div>
      </div>
      
      <h4 className="font-medium text-base mb-2">Thèmes prédéfinis</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Object.keys(themePresets).map(presetName => (
          <button 
            key={presetName}
            type="button" 
            onClick={() => onApplyTheme(themePresets[presetName])}
            className="flex flex-col items-center p-3 rounded-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
            style={{
              backgroundColor: themePresets[presetName].mainColor,
              color: 'white',
              border: `1px solid ${themePresets[presetName].secondaryColor}`
            }}
          >
            <ThemeIcon name={themePresets[presetName].iconName} size={18} />
            <span className="mt-1 capitalize text-sm">{presetName}</span>
          </button>
        ))}
      </div>
      
      <div className="flex space-x-3 mt-4">
        <button 
          type="button" 
          className="bg-green-500 text-white px-4 py-2 rounded-md transition-colors hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={() => {
            // Set the locally applied theme
            setAppliedTheme(displayTheme);
            // Call the parent component's apply function
            onApplyTheme(displayTheme);
          }}
          disabled={!previewTheme}
        >
          Appliquer
        </button>
        <button 
          type="button" 
          className="bg-gray-500 text-white px-4 py-2 rounded-md transition-colors hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={() => {
            // Clear the locally applied theme
            setAppliedTheme(null);
            // Call the parent's revert function
            onRevertTheme();
          }}
          disabled={!previewTheme}
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default ThemePreview; 