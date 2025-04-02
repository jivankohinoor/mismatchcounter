import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useData } from '../contexts/DataContext';
import { useBirthday } from '../contexts/BirthdayContext';
import { useNotifications } from '../contexts/NotificationContext';
import Header from './Header';
import LoveMessage from './LoveMessage';
import CounterSection from './CounterSection';
import Footer from './Footer';
import Preloader from './Preloader';
import BirthdayMessage from './BirthdayMessage';
import ConfigPanel from './ConfigPanel';
import ChartDashboard from './ChartDashboard';
import DataManager from './DataManager';
import NotificationBell from './ui/NotificationBell';

const MismatchApp = () => {
  const { config, isLoading: configLoading } = useConfig();
  const { isLoading: dataLoading } = useData();
  const { showPreloader, showBirthdayMessage } = useBirthday();
  const { unreadCount } = useNotifications();
  const [showConfig, setShowConfig] = useState(false);
  const [activeTab, setActiveTab] = useState('counters');

  const toggleConfig = () => {
    setShowConfig(!showConfig);
  };

  // Force localStorage consistency on app load
  React.useEffect(() => {
    const forceSyncLocalStorage = () => {
      // This will just trigger the localStorage sync
      const event = new CustomEvent('mismatch-increment');
      document.dispatchEvent(event);
      console.log("Forced localStorage sync on app load");
    };
    
    // Wait for app to be fully loaded
    if (!configLoading && !dataLoading) {
      forceSyncLocalStorage();
    }
  }, [configLoading, dataLoading]);
  
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
        <Header toggleConfig={toggleConfig}>
          <NotificationBell />
        </Header>
        
        {/* Configuration Panel */}
        <ConfigPanel isVisible={showConfig} onClose={toggleConfig} />
        
        <LoveMessage />
        
        {/* Navigation Tabs */}
        <div className="app-tabs flex border-b mb-6">
          <button 
            className={`tab-btn py-2 px-4 font-medium ${activeTab === 'counters' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('counters')}
          >
            Counters
          </button>
          <button 
            className={`tab-btn py-2 px-4 font-medium ${activeTab === 'charts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('charts')}
          >
            Analytics
          </button>
          <button 
            className={`tab-btn py-2 px-4 font-medium ${activeTab === 'data' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('data')}
          >
            Data Management
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'counters' && <CounterSection />}
        {activeTab === 'charts' && <ChartDashboard />}
        {activeTab === 'data' && <DataManager />}
        
        <Footer />
      </div>
    </>
  );
};

export default MismatchApp; 