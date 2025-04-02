import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useConfig } from '../contexts/ConfigContext';

const DataManager = () => {
  const { counters, weeklyStats } = useData();
  const { config } = useConfig();
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);

  // Function to export all application data
  const exportAllData = () => {
    try {
      const allData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        config,
        counters,
        weeklyStats
      };

      // Create a JSON string
      const dataStr = JSON.stringify(allData, null, 2);
      
      // Create a download link
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      // Create filename with date
      const exportFileName = `mismatch-data-${new Date().toISOString().split('T')[0]}.json`;
      
      // Create a link element and trigger download
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Function to handle file import
  const handleImport = (e) => {
    e.preventDefault();
    setImportError('');
    
    try {
      const importedData = JSON.parse(importData);
      
      // Validate imported data structure
      if (!importedData.version || !importedData.counters || !importedData.config) {
        setImportError('Invalid data format. Please check your import file.');
        return;
      }
      
      // Store in localStorage
      localStorage.setItem('mismatchAppCounters', JSON.stringify(importedData.counters));
      localStorage.setItem('mismatchAppConfig', JSON.stringify(importedData.config));
      
      if (importedData.weeklyStats) {
        localStorage.setItem('mismatchAppWeeklyStats', JSON.stringify(importedData.weeklyStats));
      }
      
      // Prompt to reload the page to apply changes
      if (window.confirm('Data imported successfully. Reload the page to apply changes?')) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportError('Could not parse import data. Please check the format.');
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImportData(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="data-manager bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-bold mb-4">Data Management</h3>
      
      <div className="export-section mb-6">
        <h4 className="text-lg font-semibold mb-2">Export Data</h4>
        <p className="text-sm text-gray-600 mb-3">
          Export all your counters, settings, and statistics for backup or transfer to another device.
        </p>
        <button 
          onClick={exportAllData}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
        >
          Export All Data
        </button>
        {exportSuccess && (
          <div className="mt-2 text-green-600 text-sm">
            ✅ Export successful! File download started.
          </div>
        )}
      </div>
      
      <div className="import-section">
        <h4 className="text-lg font-semibold mb-2">Import Data</h4>
        <p className="text-sm text-gray-600 mb-3">
          Import previously exported data. This will replace your current settings and counters.
        </p>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select a backup file:
          </label>
          <input 
            type="file" 
            accept=".json" 
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
        </div>
        
        {importData && (
          <>
            <button 
              onClick={handleImport}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
            >
              Import Data
            </button>
            
            {importError && (
              <div className="mt-2 text-red-600 text-sm">
                ❌ {importError}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DataManager;