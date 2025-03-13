import React from 'react';
import { ConfigProvider } from './contexts/ConfigContext';
import { DataProvider } from './contexts/DataContext';
import { BirthdayProvider } from './contexts/BirthdayContext';
import MismatchApp from './components/MismatchApp';
import './styles/tailwind.css';
import './styles/styles.css';
import './styles/configPanel.css';
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
