import React from 'react';
import themePresets from '../utils/themePresets';
import ThemeIcon, { getThemeIcon } from './ThemeIcon';

const ThemePreview = ({ currentTheme, previewTheme, onApplyTheme, onRevertTheme }) => {
  // Déterminer quel thème afficher (prévisualisation ou actuel)
  const displayTheme = previewTheme || currentTheme;
  
  // Générer un style pour la prévisualisation basé sur le thème
  const previewStyle = {
    backgroundColor: displayTheme.backgroundColor,
    color: displayTheme.mainColor,
    fontFamily: displayTheme.fontFamily,
  };
  
  const headerStyle = {
    color: displayTheme.secondaryColor,
  };
  
  // Récupérer l'icône du thème
  const IconComponent = getThemeIcon(displayTheme.iconName);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Prévisualisation du thème</h3>
      
      <div 
        className="p-6 rounded-lg shadow-md mb-6" 
        style={previewStyle}
      >
        <div className="flex items-center mb-3" style={headerStyle}>
          <IconComponent size={24} color={displayTheme.secondaryColor} />
          <h4 className="ml-2 text-lg font-semibold" style={headerStyle}>
            Exemple d'affichage
          </h4>
        </div>
        <p className="mb-4">Ceci est un aperçu de votre thème sélectionné.</p>
        <button 
          className="px-4 py-2 rounded transition-colors duration-200"
          style={{
            backgroundColor: displayTheme.mainColor,
            color: 'white'
          }}
        >
          Bouton exemple
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Object.keys(themePresets).map(presetName => (
          <button 
            key={presetName}
            type="button" 
            onClick={() => onApplyTheme(themePresets[presetName])}
            className="flex items-center justify-center p-3 rounded-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
            style={{
              backgroundColor: themePresets[presetName].mainColor,
              color: 'white',
              border: `1px solid ${themePresets[presetName].secondaryColor}`
            }}
          >
            <ThemeIcon name={themePresets[presetName].iconName} size={18} />
            <span className="ml-2 capitalize">{presetName}</span>
          </button>
        ))}
      </div>
      
      <div className="flex space-x-3 mt-4">
        <button 
          type="button" 
          className="bg-green-500 text-white px-4 py-2 rounded-md transition-colors hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={() => onApplyTheme(displayTheme)}
          disabled={!previewTheme}
        >
          Appliquer
        </button>
        <button 
          type="button" 
          className="bg-red-500 text-white px-4 py-2 rounded-md transition-colors hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
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