import React from 'react';
import * as LucideIcons from 'lucide-react';

// Composant qui affiche une icône Lucide en fonction du nom fourni
const ThemeIcon = ({ name, size = 24, color = 'currentColor', className = '' }) => {
  // Récupérer l'icône depuis Lucide
  const LucideIcon = LucideIcons[name] || LucideIcons.Heart;
  
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <LucideIcon size={size} color={color} />
    </span>
  );
};

// Composant qui renvoie l'icône en fonction du thème
export const getThemeIcon = (iconName) => {
  // Si l'icône n'est pas définie, utiliser un cœur par défaut
  const name = iconName || 'Heart';
  
  // Vérifier si l'icône existe dans Lucide
  if (!LucideIcons[name]) {
    console.warn(`Icône "${name}" non trouvée, utilisation de l'icône "Heart" par défaut`);
    return LucideIcons.Heart;
  }
  
  return LucideIcons[name];
};

// Liste des icônes disponibles pour l'utilisateur
export const availableIcons = [
  { name: 'Heart', label: 'Cœur' },
  { name: 'Star', label: 'Étoile' },
  { name: 'Moon', label: 'Lune' },
  { name: 'Sun', label: 'Soleil' },
  { name: 'Leaf', label: 'Feuille' },
  { name: 'Coffee', label: 'Café' },
  { name: 'Gift', label: 'Cadeau' },
  { name: 'Home', label: 'Maison' },
  { name: 'Crown', label: 'Couronne' },
  { name: 'Sparkles', label: 'Étincelles' },
  { name: 'Music', label: 'Musique' },
  { name: 'Smile', label: 'Sourire' },
  { name: 'Cat', label: 'Chat' },
  { name: 'Dog', label: 'Chien' },
  { name: 'Cake', label: 'Gâteau' },
  { name: 'Camera', label: 'Appareil photo' }
];

export default ThemeIcon; 