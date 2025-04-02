import React from 'react';
import profiles from '../utils/profiles';
import ThemeIcon from './ThemeIcon';
import { useData } from '../contexts/DataContext';

const CounterTemplateSelector = ({ selectedTemplate, onSelectTemplate }) => {
  const { initializeCounters } = useData();
  
  // Configuration des icônes pour chaque template
  const templateIcons = {
    romantic: 'Heart',
    roommates: 'Home',
    friends: 'Users',
    family: 'Smile',
    workplace: 'Briefcase',
    personal: 'Star'
  };
  
  // Descriptions de chaque template
  const templateDescriptions = {
    romantic: 'For couples, spouses, and romantic relationships',
    roommates: 'For living together and sharing a home',
    friends: 'For friendship and social relationships',
    family: 'For family relationships and interactions',
    workplace: 'For professional environments and coworkers',
    personal: 'For tracking your own habits and mismatches'
  };
  
  // Fonction pour prévisualiser les compteurs
  const renderCounterPreview = (templateName) => {
    // Obtenir les compteurs associés à ce template
    const counters = profiles[templateName] || [];
    
    // Afficher un aperçu de quelques compteurs (4 maximum)
    const previewCounters = counters.slice(0, 4);
    const remainingCount = counters.length - 4;
    
    return (
      <div className="template-preview">
        {previewCounters.map((counter, index) => (
          <div key={index} className="template-counter text-xs">
            • {counter.name}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="template-counter-more">
            + {remainingCount} more counters...
          </div>
        )}
      </div>
    );
  };
  
  // Fonction pour appliquer un template et initialiser les compteurs
  const handleSelectTemplate = (templateName) => {
    // Mettre à jour le template sélectionné dans l'application
    onSelectTemplate(templateName);
    
    // Demander confirmation avant de remplacer les compteurs existants
    if (window.confirm(`Do you want to replace your current counters with the "${templateName}" template?`)) {
      // Vérifier que le profile existe
      if (profiles[templateName]) {
        // Initialiser les compteurs avec le template sélectionné
        initializeCounters(profiles[templateName]);
        
        // Afficher un message de confirmation
        setTimeout(() => {
          alert(`Les compteurs du profil "${templateName}" ont été appliqués avec succès!`);
        }, 300);
      } else {
        alert(`Erreur: Le profil "${templateName}" n'a pas été trouvé.`);
      }
    }
  };
  
  return (
    <div className="counter-template-selector">
      <p className="mb-4 text-sm text-gray-600">
        Choose a template of pre-defined counters based on your relationship type.
        You can always customize these later.
      </p>
      
      <div className="relationship-templates">
        {Object.keys(profiles).map((templateName) => (
          <div 
            key={templateName}
            className={`relationship-template ${selectedTemplate === templateName ? 'selected' : ''}`}
            onClick={() => handleSelectTemplate(templateName)}
          >
            <div className="flex items-center mb-2">
              <ThemeIcon name={templateIcons[templateName] || 'Star'} size={18} />
              <h4 className="ml-2 font-medium capitalize">{templateName}</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">{templateDescriptions[templateName]}</p>
            
            {renderCounterPreview(templateName)}
            
            {selectedTemplate !== templateName && (
              <button 
                className="apply-template-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTemplate(templateName);
                }}
              >
                Apply Template
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounterTemplateSelector; 