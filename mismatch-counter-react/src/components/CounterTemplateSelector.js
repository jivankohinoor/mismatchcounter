import React from 'react';
import counterTemplates from '../utils/counterTemplates';
import { useData } from '../contexts/DataContext';

const CounterTemplateSelector = ({ selectedTemplate, onSelectTemplate }) => {
  const { initializeCounters } = useData();
  
  // Fonction pour appliquer le modèle sélectionné
  const applyTemplate = (templateName) => {
    if (window.confirm(`Voulez-vous remplacer vos compteurs actuels par ceux du modèle "${templateName}" ?`)) {
      initializeCounters(counterTemplates[templateName]);
    }
  };
  
  return (
    <div className="counter-template-selector">
      <h3>Modèles de compteurs</h3>
      
      <div className="relationship-templates">
        {Object.keys(counterTemplates).map(templateName => (
          <div 
            key={templateName}
            className={`relationship-template ${selectedTemplate === templateName ? 'selected' : ''}`}
            onClick={() => onSelectTemplate(templateName)}
          >
            <h4>{getTemplateName(templateName)}</h4>
            <p>{getTemplateDescription(templateName)}</p>
            <div className="template-preview">
              {counterTemplates[templateName].slice(0, 2).map((counter, idx) => (
                <div key={idx} className="template-counter">
                  • {counter.name}
                </div>
              ))}
              {counterTemplates[templateName].length > 2 && (
                <div className="template-counter-more">+{counterTemplates[templateName].length - 2} autres...</div>
              )}
            </div>
            <button 
              className="apply-template-btn"
              onClick={(e) => {
                e.stopPropagation();
                applyTemplate(templateName);
              }}
            >
              Utiliser ce modèle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Fonction pour obtenir un nom lisible pour le modèle
function getTemplateName(templateKey) {
  const names = {
    'romantic': 'Couple / Conjoint',
    'roommates': 'Colocataires',
    'friends': 'Amis',
    'family': 'Famille'
  };
  return names[templateKey] || templateKey;
}

// Fonction pour obtenir une description du modèle
function getTemplateDescription(templateKey) {
  const descriptions = {
    'romantic': 'Parfait pour les couples et conjoints',
    'roommates': 'Idéal pour la colocation',
    'friends': 'Pour suivre les petits défauts entre amis',
    'family': 'Pour la vie de famille au quotidien'
  };
  return descriptions[templateKey] || '';
}

export default CounterTemplateSelector; 