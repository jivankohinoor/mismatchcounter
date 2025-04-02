import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useData } from '../contexts/DataContext';
import ThemePreview from './ThemePreview';
import CounterTemplateSelector from './CounterTemplateSelector';
import MessagesList from './MessagesList';
import themePresets from '../utils/themePresets';
import profiles from '../utils/profiles';
import '../styles/configPanel.css';
import ThemeIcon from './ThemeIcon';
import IconSelector from './IconSelector';
import FontSelector from './FontSelector';

const ConfigPanel = ({ isVisible, onClose }) => {
  const { config, saveConfig, resetConfig } = useConfig();
  const { initializeCounters } = useData();
  
  // Onglets de configuration
  const [activeTab, setActiveTab] = useState('basic');
  
  // État local pour les valeurs du formulaire
  const [formData, setFormData] = useState({
    recipient: {
      name: '',
      birthdayDate: '',
      secretCode: '',
      relationship: ''
    },
    sender: {
      name: ''
    },
    theme: {
      mainColor: '#ff69b4',
      secondaryColor: '#4682b4',
      backgroundColor: '#fff0f5',
      iconName: 'Heart',
      fontFamily: "'Poppins', sans-serif"
    },
    messages: {
      birthdayTitle: '',
      birthdayMessage: '',
      loveMessages: [],
      consequences: [],
      footerMessage: '',
      countdownMessage: ''
    },
    selectedTemplate: 'romantic',
    advanced: {
      randomMessageInterval: 10000,
      enableAnimations: true,
      debugMode: false,
      autoSaveInterval: 60000,
      allowNotifications: true,
      mobileOptimized: true,
      enableDataExport: true,
      enableCharts: true
    },
    notifications: {
      thresholdAlerts: true,
      streakCelebrations: true,
      birthdayReminders: true,
      dailyReminders: false
    }
  });
  
  // État pour la prévisualisation du thème
  const [previewTheme, setPreviewTheme] = useState(null);
  
  // Initialiser le formulaire avec la configuration actuelle
  useEffect(() => {
    if (config) {
      setFormData({
        recipient: {
          name: config.recipient?.name || '',
          birthdayDate: config.recipient?.birthdayDate || '',
          secretCode: config.recipient?.secretCode || '',
          relationship: config.recipient?.relationship || ''
        },
        sender: {
          name: config.sender?.name || ''
        },
        theme: {
          mainColor: config.theme?.mainColor || '#ff69b4',
          secondaryColor: config.theme?.secondaryColor || '#4682b4',
          backgroundColor: config.theme?.backgroundColor || '#fff0f5',
          iconName: config.theme?.iconName || 'Heart',
          fontFamily: config.theme?.fontFamily || "'Poppins', sans-serif"
        },
        messages: {
          birthdayTitle: config.messages?.birthdayTitle || '',
          birthdayMessage: config.messages?.birthdayMessage || '',
          loveMessages: [...(config.messages?.loveMessages || [])],
          consequences: [...(config.messages?.consequences || [])],
          footerMessage: config.messages?.footerMessage || '',
          countdownMessage: config.messages?.countdownMessage || ''
        },
        selectedTemplate: config.selectedTemplate || 'romantic',
        advanced: {
          randomMessageInterval: config.advanced?.randomMessageInterval || 10000,
          enableAnimations: config.advanced?.enableAnimations !== false,
          debugMode: config.advanced?.debugMode || false,
          autoSaveInterval: config.advanced?.autoSaveInterval || 60000,
          allowNotifications: config.advanced?.allowNotifications !== false,
          mobileOptimized: config.advanced?.mobileOptimized !== false,
          enableDataExport: config.advanced?.enableDataExport !== false,
          enableCharts: config.advanced?.enableCharts !== false
        },
        notifications: {
          thresholdAlerts: config.notifications?.thresholdAlerts !== false,
          streakCelebrations: config.notifications?.streakCelebrations !== false,
          birthdayReminders: config.notifications?.birthdayReminders !== false,
          dailyReminders: config.notifications?.dailyReminders || false
        }
      });
    }
  }, [config]);
  
  // Gérer les changements d'onglets
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Gérer les changements de prévisualisation de thème
  const handlePreviewTheme = (theme) => {
    setPreviewTheme(theme);
  };
  
  // Appliquer le thème en prévisualisation
  const handleApplyTheme = () => {
    if (previewTheme) {
      setFormData(prev => ({
        ...prev,
        theme: { ...previewTheme }
      }));
      setPreviewTheme(null);
    }
  };
  
  // Annuler la prévisualisation du thème
  const handleRevertTheme = () => {
    setPreviewTheme(null);
  };
  
  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Gérer les propriétés imbriquées avec la notation par points
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Gérer la sélection de modèle
  const handleTemplateChange = (template) => {
    // Mettre à jour le formData
    setFormData(prev => ({
      ...prev,
      selectedTemplate: template
    }));
    
    // Mettre à jour immédiatement la configuration pour que d'autres composants puissent y accéder
    saveConfig({
      ...config,
      selectedTemplate: template
    });
  };
  
  // Ajouter un message d'amour
  const addLoveMessage = (message) => {
    setFormData(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        loveMessages: [...prev.messages.loveMessages, message]
      }
    }));
  };
  
  // Supprimer un message d'amour
  const removeLoveMessage = (index) => {
    setFormData(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        loveMessages: prev.messages.loveMessages.filter((_, i) => i !== index)
      }
    }));
  };
  
  // Ajouter une conséquence
  const addConsequence = (consequence) => {
    setFormData(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        consequences: [...prev.messages.consequences, consequence]
      }
    }));
  };
  
  // Supprimer une conséquence
  const removeConsequence = (index) => {
    setFormData(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        consequences: prev.messages.consequences.filter((_, i) => i !== index)
      }
    }));
  };
  
  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    saveConfig({
      ...config,
      ...formData
    });
    if (onClose) onClose();
  };
  
  // Exporter la configuration en JSON
  const handleExportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mismatch_config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  // Gérer l'importation de fichier
  const handleImportConfig = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target.result);
        saveConfig(importedConfig);
        alert("Configuration importée avec succès !");
      } catch (error) {
        alert("Échec de l'importation : " + error.message);
      }
    };
    reader.readAsText(file);
  };
  
  // Réinitialiser la configuration
  const handleResetConfig = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser la configuration par défaut ? Cette action est irréversible.")) {
      resetConfig();
      if (onClose) onClose();
    }
  };
  
  // Si le panneau n'est pas visible, ne rien afficher
  if (!isVisible) return null;
  
  return (
    <div className="config-panel">
      <div className="config-panel-content">
        <h2>Personnalisez votre application</h2>
        <button 
          className="close-config-btn"
          onClick={onClose}
        >
          &times;
        </button>
        
        <div className="config-tabs">
          <button 
            className={`config-tab ${activeTab === 'basic' ? 'active' : ''}`} 
            onClick={() => handleTabChange('basic')}
          >
            Informations
          </button>
          <button 
            className={`config-tab ${activeTab === 'appearance' ? 'active' : ''}`} 
            onClick={() => handleTabChange('appearance')}
          >
            Apparence
          </button>
          <button 
            className={`config-tab ${activeTab === 'templates' ? 'active' : ''}`} 
            onClick={() => handleTabChange('templates')}
          >
            Modèles
          </button>
          <button 
            className={`config-tab ${activeTab === 'messages' ? 'active' : ''}`} 
            onClick={() => handleTabChange('messages')}
          >
            Messages
          </button>
          <button 
            className={`config-tab ${activeTab === 'advanced' ? 'active' : ''}`} 
            onClick={() => handleTabChange('advanced')}
          >
            Avancé
          </button>
          <button 
            className={`config-tab ${activeTab === 'import-export' ? 'active' : ''}`} 
            onClick={() => handleTabChange('import-export')}
          >
            Import/Export
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Section Informations de base */}
          <div className={`config-section ${activeTab === 'basic' ? 'active' : ''}`}>
            <h3>Informations de base</h3>
            <div className="form-group">
              <label htmlFor="recipientName">Nom du destinataire :</label>
              <input
                type="text"
                id="recipientName"
                name="recipient.name"
                value={formData.recipient.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="recipientRelationship">Relation :</label>
              <input
                type="text"
                id="recipientRelationship"
                name="recipient.relationship"
                value={formData.recipient.relationship}
                onChange={handleChange}
                placeholder="ex. conjointe, mari, ami, etc."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="senderName">Votre nom :</label>
              <input
                type="text"
                id="senderName"
                name="sender.name"
                value={formData.sender.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="birthdayDate">Date spéciale :</label>
              <input
                type="date"
                id="birthdayDate"
                name="recipient.birthdayDate"
                value={formData.recipient.birthdayDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="secretCode">Code secret de déverrouillage :</label>
              <input
                type="text"
                id="secretCode"
                name="recipient.secretCode"
                value={formData.recipient.secretCode}
                onChange={handleChange}
                placeholder="Code pour déverrouiller avant la date spéciale"
              />
            </div>
          </div>
          
          {/* Section Apparence */}
          <div className={`config-section ${activeTab === 'appearance' ? 'active' : ''}`}>
            <h3>Apparence</h3>
            
            <ThemePreview 
              currentTheme={formData.theme}
              previewTheme={previewTheme}
              onApplyTheme={handlePreviewTheme}
              onRevertTheme={handleRevertTheme}
            />
            
            <div className="manual-color-inputs">
              <div className="form-group">
                <label htmlFor="mainColor">Couleur principale :</label>
                <input
                  type="color"
                  id="mainColor"
                  name="theme.mainColor"
                  value={formData.theme.mainColor}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="secondaryColor">Couleur secondaire :</label>
                <input
                  type="color"
                  id="secondaryColor"
                  name="theme.secondaryColor"
                  value={formData.theme.secondaryColor}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="backgroundColor">Couleur de fond :</label>
                <input
                  type="color"
                  id="backgroundColor"
                  name="theme.backgroundColor"
                  value={formData.theme.backgroundColor}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <IconSelector
                  value={formData.theme.iconName}
                  onChange={(value) => setFormData(prev => ({
                    ...prev,
                    theme: {
                      ...prev.theme,
                      iconName: value
                    }
                  }))}
                />
              </div>
            </div>
            
            <div className="form-group">
              <FontSelector
                value={formData.theme.fontFamily}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  theme: {
                    ...prev.theme,
                    fontFamily: value
                  }
                }))}
              />
            </div>
          </div>
          
          {/* Section Templates */}
          <div className={`config-section ${activeTab === 'templates' ? 'active' : ''}`}>
            <CounterTemplateSelector
              selectedTemplate={formData.selectedTemplate}
              onSelectTemplate={handleTemplateChange}
            />
          </div>
          
          {/* Section Messages */}
          <div className={`config-section ${activeTab === 'messages' ? 'active' : ''}`}>
            <h3>Messages</h3>
            <div className="form-group">
              <label htmlFor="birthdayTitle">Titre pour l'anniversaire :</label>
              <input
                type="text"
                id="birthdayTitle"
                name="messages.birthdayTitle"
                value={formData.messages.birthdayTitle}
                onChange={handleChange}
                placeholder="ex. Joyeux Anniversaire !"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="birthdayMessage">Message d'anniversaire :</label>
              <textarea
                id="birthdayMessage"
                name="messages.birthdayMessage"
                value={formData.messages.birthdayMessage}
                onChange={handleChange}
                rows="3"
                placeholder="Entrez votre message spécial d'anniversaire ici"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="footerMessage">Message de pied de page :</label>
              <input
                type="text"
                id="footerMessage"
                name="messages.footerMessage"
                value={formData.messages.footerMessage}
                onChange={handleChange}
                placeholder="Message à afficher dans le pied de page"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="countdownMessage">Message de compte à rebours :</label>
              <input
                type="text"
                id="countdownMessage"
                name="messages.countdownMessage"
                value={formData.messages.countdownMessage}
                onChange={handleChange}
                placeholder="Message à afficher pendant le compte à rebours"
              />
            </div>
            
            <MessagesList 
              messages={formData.messages.loveMessages}
              onAddMessage={addLoveMessage}
              onRemoveMessage={removeLoveMessage}
              type="loveMessages"
            />
            
            <MessagesList 
              messages={formData.messages.consequences}
              onAddMessage={addConsequence}
              onRemoveMessage={removeConsequence}
              type="consequences"
            />
          </div>
          
          {/* Section Paramètres Avancés */}
          <div className={`config-section ${activeTab === 'advanced' ? 'active' : ''}`}>
            <h3>Paramètres Avancés</h3>

            <div className="form-section">
              <h4>Fonctionnalités</h4>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="enableAnimations"
                  name="advanced.enableAnimations"
                  checked={formData.advanced?.enableAnimations}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      advanced: {
                        ...prev.advanced,
                        enableAnimations: e.target.checked
                      }
                    }));
                  }}
                />
                <label htmlFor="enableAnimations">Activer les animations</label>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="mobileOptimized"
                  name="advanced.mobileOptimized"
                  checked={formData.advanced?.mobileOptimized}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      advanced: {
                        ...prev.advanced,
                        mobileOptimized: e.target.checked
                      }
                    }));
                  }}
                />
                <label htmlFor="mobileOptimized">Optimisation mobile</label>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="enableDataExport"
                  name="advanced.enableDataExport"
                  checked={formData.advanced?.enableDataExport}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      advanced: {
                        ...prev.advanced,
                        enableDataExport: e.target.checked
                      }
                    }));
                  }}
                />
                <label htmlFor="enableDataExport">Autoriser l'exportation des données</label>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="enableCharts"
                  name="advanced.enableCharts"
                  checked={formData.advanced?.enableCharts}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      advanced: {
                        ...prev.advanced,
                        enableCharts: e.target.checked
                      }
                    }));
                  }}
                />
                <label htmlFor="enableCharts">Activer les graphiques</label>
              </div>
            </div>
            
            <div className="form-section">
              <h4>Notifications</h4>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="allowNotifications"
                  name="advanced.allowNotifications"
                  checked={formData.advanced?.allowNotifications}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      advanced: {
                        ...prev.advanced,
                        allowNotifications: e.target.checked
                      }
                    }));
                  }}
                />
                <label htmlFor="allowNotifications">Autoriser les notifications</label>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="thresholdAlerts"
                  name="notifications.thresholdAlerts"
                  checked={formData.notifications?.thresholdAlerts}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        thresholdAlerts: e.target.checked
                      }
                    }));
                  }}
                />
                <label htmlFor="thresholdAlerts">Alertes de seuil</label>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="streakCelebrations"
                  name="notifications.streakCelebrations"
                  checked={formData.notifications?.streakCelebrations}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        streakCelebrations: e.target.checked
                      }
                    }));
                  }}
                />
                <label htmlFor="streakCelebrations">Célébrations de série</label>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="birthdayReminders"
                  name="notifications.birthdayReminders"
                  checked={formData.notifications?.birthdayReminders}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        birthdayReminders: e.target.checked
                      }
                    }));
                  }}
                />
                <label htmlFor="birthdayReminders">Rappels d'anniversaire</label>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="dailyReminders"
                  name="notifications.dailyReminders"
                  checked={formData.notifications?.dailyReminders}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        dailyReminders: e.target.checked
                      }
                    }));
                  }}
                />
                <label htmlFor="dailyReminders">Rappels quotidiens</label>
              </div>
            </div>
            
            <div className="form-section">
              <h4>Performance</h4>
              
              <div className="form-group">
                <label htmlFor="randomMessageInterval">Intervalle de message aléatoire (ms) :</label>
                <input
                  type="number"
                  id="randomMessageInterval"
                  name="advanced.randomMessageInterval"
                  value={formData.advanced?.randomMessageInterval}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      advanced: {
                        ...prev.advanced,
                        randomMessageInterval: parseInt(e.target.value, 10)
                      }
                    }));
                  }}
                  min="1000"
                  step="1000"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="autoSaveInterval">Intervalle de sauvegarde auto (ms) :</label>
                <input
                  type="number"
                  id="autoSaveInterval"
                  name="advanced.autoSaveInterval"
                  value={formData.advanced?.autoSaveInterval}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      advanced: {
                        ...prev.advanced,
                        autoSaveInterval: parseInt(e.target.value, 10)
                      }
                    }));
                  }}
                  min="5000"
                  step="1000"
                />
              </div>
            </div>
          </div>
          
          {/* Section Import/Export */}
          <div className={`config-section ${activeTab === 'import-export' ? 'active' : ''}`}>
            <h3>Import & Export</h3>
            <div className="form-group">
              <h4>Exporter la configuration</h4>
              <p>Téléchargez votre configuration actuelle sous forme de fichier JSON :</p>
              <button 
                type="button" 
                className="export-btn" 
                onClick={handleExportConfig}
              >
                Exporter la configuration
              </button>
            </div>
            
            <div className="form-group">
              <h4>Importer une configuration</h4>
              <p>Importez une configuration préalablement sauvegardée :</p>
              <input 
                type="file" 
                id="import-file" 
                accept=".json"
                onChange={handleImportConfig}
              />
            </div>
            
            <div className="form-group">
              <h4>Réinitialiser la configuration</h4>
              <p>Réinitialiser tous les paramètres aux valeurs par défaut :</p>
              <button 
                type="button" 
                className="reset-btn" 
                onClick={handleResetConfig}
              >
                Réinitialiser
              </button>
            </div>
          </div>
          
          <div className="config-actions">
            <button 
              type="submit" 
              className="save-config-btn"
            >
              Enregistrer les changements
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigPanel; 