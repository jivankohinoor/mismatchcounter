import React from 'react';
import themePresets from '../utils/themePresets';

const ThemePreview = ({ currentTheme, previewTheme, onApplyTheme, onRevertTheme }) => {
  // Déterminer quel thème afficher (prévisualisation ou actuel)
  const displayTheme = previewTheme || currentTheme;
  
  // Générer un style pour la prévisualisation basé sur le thème
  const previewStyle = {
    backgroundColor: displayTheme.backgroundColor,
    color: displayTheme.mainColor,
    border: `2px solid ${displayTheme.secondaryColor}`,
    fontFamily: displayTheme.fontFamily,
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px'
  };
  
  const headerStyle = {
    color: displayTheme.secondaryColor,
    marginTop: '0'
  };
  
  return (
    <div className="theme-preview-container">
      <h3>Prévisualisation du thème</h3>
      
      <div style={previewStyle} className="theme-preview">
        <h4 style={headerStyle}>
          {displayTheme.iconEmoji} Exemple d'affichage
        </h4>
        <p>Ceci est un aperçu de votre thème sélectionné.</p>
        <div style={{ 
          backgroundColor: displayTheme.mainColor, 
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          Bouton exemple
        </div>
      </div>
      
      <div className="theme-presets">
        {Object.keys(themePresets).map(presetName => (
          <button 
            key={presetName}
            type="button" 
            onClick={() => onApplyTheme(themePresets[presetName])}
            style={{
              backgroundColor: themePresets[presetName].mainColor,
              color: 'white',
              border: '1px solid ' + themePresets[presetName].secondaryColor
            }}
          >
            {themePresets[presetName].iconEmoji} {presetName}
          </button>
        ))}
      </div>
      
      <div className="theme-actions">
        <button 
          type="button" 
          className="apply-theme-btn"
          onClick={() => onApplyTheme(displayTheme)}
          disabled={!previewTheme}
        >
          Appliquer
        </button>
        <button 
          type="button" 
          className="revert-theme-btn"
          onClick={onRevertTheme}
          disabled={!previewTheme}
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default ThemePreview; 