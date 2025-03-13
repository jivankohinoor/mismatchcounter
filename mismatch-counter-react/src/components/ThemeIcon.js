import React from 'react';
import * as LucideIcons from 'lucide-react';

// Composant qui affiche une icône Lucide en fonction du nom fourni
const ThemeIcon = ({ name, size = 24, color = 'currentColor', className = '' }) => {
  // Récupérer l'icône depuis Lucide
  const LucideIcon = getThemeIcon(name);
  
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <LucideIcon size={size} color={color} />
    </span>
  );
};

// Fonction qui renvoie l'icône en fonction du thème
export const getThemeIcon = (iconName) => {
  // Si l'icône n'est pas définie, utiliser un cœur par défaut
  if (!iconName) {
    return LucideIcons.Heart;
  }
  
  // Mapper certains noms spécifiques vers des icônes Lucide connues
  const iconMap = {
    'Wave': LucideIcons.Droplets,
    'Minimalize': LucideIcons.Minimize,
    'Sparkles': LucideIcons.Star,
    'Droplets': LucideIcons.Droplets,
    'Sunset': LucideIcons.Sunset || LucideIcons.Sun,
    'Flower': LucideIcons.Flower || LucideIcons.Leaf,
    'IceCream': LucideIcons.IceCream || LucideIcons.Cookie,
    'PanelTopClose': LucideIcons.PanelLeft || LucideIcons.AlignJustify
  };
  
  // Si l'icône est dans notre map personnalisée
  if (iconMap[iconName]) {
    return iconMap[iconName];
  }
  
  // Vérifier si l'icône existe dans Lucide
  if (!LucideIcons[iconName]) {
    console.warn(`Icône "${iconName}" non trouvée, utilisation de l'icône "Heart" par défaut`);
    return LucideIcons.Heart;
  }
  
  return LucideIcons[iconName];
};

// Liste des icônes disponibles pour l'utilisateur - uniquement des icônes standard connues
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
  { name: 'Music', label: 'Musique' },
  { name: 'Smile', label: 'Sourire' },
  { name: 'Cat', label: 'Chat' },
  { name: 'Camera', label: 'Appareil photo' },
  { name: 'Droplets', label: 'Gouttes d\'eau' },
  { name: 'Minimize', label: 'Minimaliste' },
  { name: 'Flame', label: 'Flamme' },
  { name: 'Pizza', label: 'Pizza' },
  { name: 'AlignJustify', label: 'Menu' },
  { name: 'ShoppingBag', label: 'Shopping' },
  { name: 'Cake', label: 'Gâteau' }
];

export default ThemeIcon; 