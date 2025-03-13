import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useData } from '../contexts/DataContext';
import { useBirthday } from '../contexts/BirthdayContext';
import Header from './Header';
import LoveMessage from './LoveMessage';
import CounterSection from './CounterSection';
import Footer from './Footer';
import Preloader from './Preloader';
import BirthdayMessage from './BirthdayMessage';
import ConfigPanel from './ConfigPanel';

const MismatchApp = () => {
  const { config, isLoading: configLoading } = useConfig();
  const { isLoading: dataLoading } = useData();
  const { showPreloader, showBirthdayMessage } = useBirthday();
  const [showConfig, setShowConfig] = React.useState(false);

  const toggleConfig = () => {
    setShowConfig(!showConfig);
  };

  // Show loading state while configs and data are loading
  if (configLoading || dataLoading) {
    return <div className="loading">Loading application...</div>;
  }

  return (
    <>
      {/* Birthday Preloader */}
      {showPreloader && <Preloader />}
      
      {/* Birthday Celebration Message */}
      {showBirthdayMessage && <BirthdayMessage />}
      
      {/* Main App Container */}
      <div className="container" role="main">
        <Header toggleConfig={toggleConfig} />
        
        {/* Configuration Panel */}
        <ConfigPanel isVisible={showConfig} onClose={toggleConfig} />
        
        <LoveMessage />
        
        <CounterSection />
        
        <Footer />
      </div>
    </>
  );
};

export default MismatchApp; 