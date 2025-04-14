import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useData } from '../contexts/DataContext';
import { useBirthday } from '../contexts/BirthdayContext';
import { useNotifications } from '../contexts/NotificationContext';
import AppHeader from './AppHeader';
import LoveMessage from './LoveMessage';
import CounterSection from './CounterSection';
import Footer from './Footer';
import Preloader from './Preloader';
import BirthdayMessage from './BirthdayMessage';
import ConfigPanel from './ConfigPanel';
import ChartDashboard from './ChartDashboard';
import DataManager from './DataManager';
import { BarChart2, Settings, List, Database } from 'lucide-react';

const MismatchApp = () => {
  const { config, isLoading: configLoading } = useConfig();
  const { isLoading: dataLoading } = useData();
  const { showPreloader, showBirthdayMessage } = useBirthday();
  const { unreadCount } = useNotifications();
  const [activeTab, setActiveTab] = useState('counters');

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
        <AppHeader recipient={config.recipient} sender={config.sender} theme={config.theme} />
        
        <LoveMessage />
        
        {/* Navigation Tabs */}
        <div className="app-tabs">
          <button 
            className={`tab-btn ${activeTab === 'counters' ? 'active' : ''}`}
            onClick={() => setActiveTab('counters')}
            title="Counters"
          >
            <List size={16} />
            <span>Counters</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveTab('charts')}
            title="Analytics"
          >
            <BarChart2 size={16} />
            <span>Analytics</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
            title="Data Management"
          >
            <Database size={16} />
            <span>Data</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            title="Settings"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'counters' && <CounterSection />}
        {activeTab === 'charts' && <ChartDashboard />}
        {activeTab === 'data' && <DataManager />}
        {activeTab === 'settings' && <ConfigPanel embedded={true} />}
        
        <Footer />
      </div>
    </>
  );
};

export default MismatchApp; 