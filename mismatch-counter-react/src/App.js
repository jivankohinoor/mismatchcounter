import React from 'react';
import { ConfigProvider } from './contexts/ConfigContext';
import { DataProvider } from './contexts/DataContext';
import { BirthdayProvider } from './contexts/BirthdayContext';
import MismatchApp from './components/MismatchApp';

// Importation des styles dans le bon ordre
import './styles/variables.css';  // Variables CSS en premier
import './styles/base.css';       // Styles de base ensuite
import './styles/tailwind.css';   // Tailwind après

// Styles spécifiques à certains composants
import './styles/styles.css';
import './styles/configPanel.tailwind.css';

function App() {
  return (
    <ConfigProvider>
      <DataProvider>
        <BirthdayProvider>
          <MismatchApp />
        </BirthdayProvider>
      </DataProvider>
    </ConfigProvider>
  );
}

export default App;
