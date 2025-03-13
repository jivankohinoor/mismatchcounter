import React from 'react';
import fontOptions from '../utils/fontOptions';

const FontSelector = ({ value, onChange }) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Police de caractères :
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
      >
        {fontOptions.map(font => (
          <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
            {font.name} - {font.description}
          </option>
        ))}
      </select>
      <div className="mt-4 p-3 border border-gray-200 rounded-md">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Aperçu :</h3>
        <p style={{ fontFamily: value }}>
          Voici un exemple de texte avec la police {fontOptions.find(f => f.value === value)?.name || 'sélectionnée'}.
        </p>
      </div>
    </div>
  );
};

export default FontSelector; 