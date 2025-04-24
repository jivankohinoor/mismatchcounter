import React from 'react';
import { ConfigProvider } from './contexts/ConfigContext';
import { DataProvider } from './contexts/DataContext';
import { BirthdayProvider } from './contexts/BirthdayContext';
import { NotificationProvider } from './contexts/NotificationContext';
import MismatchApp from './components/MismatchApp';
import Notifications from './components/ui/Notifications';

// Importation des styles dans le bon ordre
import './styles/variables.css';  // Variables CSS en premier
import './styles/base.css';       // Styles de base ensuite
import './styles/tailwind.css';   // Tailwind après

// Styles spécifiques à certains composants
import './styles/styles.css';
import './styles/configPanel.tailwind.css';
import './styles/mobile.css';
import './styles/notifications.css'; // New notifications styles

// New layout improvements
import './styles/layout-improvements.css';
import './styles/app.tailwind.css';
import './styles/guidedSetup.tailwind.css';

function App() {
  return (
    <ConfigProvider>
      <DataProvider>
        <BirthdayProvider>
          <NotificationProvider>
            <MismatchApp />
            <Notifications />
          </NotificationProvider>
        </BirthdayProvider>
      </DataProvider>
    </ConfigProvider>
  );
}

export default App;
