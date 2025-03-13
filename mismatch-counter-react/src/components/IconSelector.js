import React from 'react';
import ThemeIcon, { availableIcons } from './ThemeIcon';

const IconSelector = ({ value, onChange }) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Icône :
      </label>
      <div className="grid grid-cols-4 gap-2 p-2 bg-white border border-gray-300 rounded-md shadow-sm">
        {availableIcons.map(icon => (
          <button
            key={icon.name}
            type="button"
            onClick={() => onChange(icon.name)}
            className={`flex flex-col items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${
              value === icon.name ? 'bg-gray-200 border border-blue-500' : ''
            }`}
          >
            <ThemeIcon name={icon.name} size={24} />
            <span className="text-xs mt-1">{icon.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center">
        <ThemeIcon name={value} size={20} />
        <span className="ml-2 text-sm">Sélectionné : {(availableIcons.find(i => i.name === value) || { label: 'Cœur' }).label}</span>
      </div>
    </div>
  );
};

export default IconSelector; 