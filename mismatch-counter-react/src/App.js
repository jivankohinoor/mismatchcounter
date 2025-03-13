import React from 'react';
import { ConfigProvider } from './contexts/ConfigContext';
import { DataProvider } from './contexts/DataContext';
import { BirthdayProvider } from './contexts/BirthdayContext';
import MismatchApp from './components/MismatchApp';
import './styles/styles.css';

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
