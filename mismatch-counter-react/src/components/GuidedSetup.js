import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import ConfigPanel from './ConfigPanel';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const GuidedSetup = ({ onComplete }) => {
  const { config, saveConfig } = useConfig();
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfig, setShowConfig] = useState(true);
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    {
      title: 'Welcome',
      description: 'Let\'s set up your Mismatch Counter! We\'ll guide you through the process step by step.',
      component: null
    },
    {
      title: 'Recipient Information',
      description: 'First, let\'s set up who this app is for.',
      component: 'recipient'
    },
    {
      title: 'Theme Settings',
      description: 'Choose a color scheme and style that matches your personality.',
      component: 'theme'
    },
    {
      title: 'Love Messages',
      description: 'Add some sweet messages that will appear randomly.',
      component: 'messages'
    },
    {
      title: 'Consequences',
      description: 'Set up fun consequences for when thresholds are reached.',
      component: 'consequences'
    },
    {
      title: 'Advanced Settings',
      description: 'Fine-tune how the app behaves.',
      component: 'advanced'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps([...completedSteps, currentStep]);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepCompleted = (stepIndex) => {
    return completedSteps.includes(stepIndex);
  };

  return (
    <div className="guided-setup">
      <div className="setup-header">
        <h1>{steps[currentStep].title}</h1>
        <p>{steps[currentStep].description}</p>
      </div>

      <div className="setup-progress">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`step ${currentStep === index ? 'active' : ''} ${isStepCompleted(index) ? 'completed' : ''}`}
          >
            {isStepCompleted(index) ? (
              <CheckCircle size={24} />
            ) : (
              <div className="step-number">{index + 1}</div>
            )}
            <span>{step.title}</span>
          </div>
        ))}
      </div>

      <ConfigPanel 
        isVisible={showConfig} 
        onClose={() => {}}
        embedded={true}
        activeTab={steps[currentStep].component}
      />

      <div className="setup-actions">
        {currentStep > 0 && (
          <button 
            className="btn-secondary"
            onClick={handleBack}
          >
            <ChevronLeft size={20} />
            Back
          </button>
        )}
        <button 
          className="btn-primary"
          onClick={handleNext}
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          {currentStep < steps.length - 1 && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default GuidedSetup; 