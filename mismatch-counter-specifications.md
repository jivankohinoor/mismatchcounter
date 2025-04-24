Cahier des Spécifications
Application "Allison's Mismatch Counter"
1. Introduction et Vision du Projet
1.1 Contexte
L'application "Allison's Mismatch Counter" est un cadeau d'anniversaire personnalisé conçu pour permettre au couple de suivre de façon ludique les petites erreurs quotidiennes du partenaire. Cette application combine humour et affection, et transforme ce qui pourrait être des sujets de tension en moments amusants.
1.2 Objectifs

Créer une application engageante et amusante pour suivre les "mismatches" (erreurs) du quotidien
Offrir une interface intuitive et attrayante
Permettre le suivi statistique des comportements
Intégrer des éléments d'affection et d'humour
Garantir la persistance des données
Proposer une expérience utilisateur fluide sur tous les appareils

1.3 Public Cible
L'application est destinée principalement à un couple, mais pourrait être adaptée pour:

Couples en général
Colocataires
Familles (version adaptée pour les enfants)

2. Fonctionnalités Principales
2.1 Système de Compteurs

Création et gestion de compteurs personnalisés
Compteurs avec seuils configurables
Déclenchement de "conséquences" ludiques quand les seuils sont dépassés
Statistiques de fréquence et historique des compteurs

2.2 Messages d'Affection

Affichage aléatoire de messages d'amour et d'encouragement
Possibilité d'ajouter des messages personnalisés
Animation des transitions entre messages

2.3 Statistiques et Visualisations

Statistiques hebdomadaires, mensuelles et annuelles
Graphiques de tendances et d'évolution
Identification du "mismatch" le plus fréquent
Calcul des jours parfaits (sans erreur)
Moyenne quotidienne des erreurs

2.4 Fonctionnalités d'Anniversaire

Countdown jusqu'à la date d'anniversaire
Animation festive (confettis) le jour J
Message spécial d'anniversaire
Possibilité de déverrouiller avant la date avec un code secret

2.5 Système de Récompenses (Nouvelle Fonctionnalité)

"Médailles" pour les améliorations notables
Périodes record sans erreur spécifique
Système de "challenges" (ex: une semaine sans laisser le lave-vaisselle ouvert)
Génération de certificats humoristiques de progrès

3. Architecture Technique
3.1 Technologies Frontend

HTML5/CSS3/JavaScript moderne (ES6+)
Framework: React.js ou Vue.js
Bibliothèque graphique: Chart.js pour les visualisations
PWA (Progressive Web App) pour installation sur appareils mobiles
Interface responsive (mobile-first)

3.2 Technologies Backend (Optionnel pour version avancée)

Node.js avec Express
Base de données MongoDB ou Firebase Firestore
Authentification par Firebase Authentication

3.3 Stockage de Données

Version locale: LocalStorage avec sauvegarde/export
Version avancée: Base de données cloud pour synchronisation multi-appareils

3.4 Sécurité

Chiffrement des données sensibles
Authentification sécurisée
Protection contre les injections et autres vulnérabilités web

4. Interfaces Utilisateur
4.1 Écran Principal

Liste des compteurs organisée par catégories
Indicateurs visuels de seuils atteints
Zone des messages d'affection avec animation
Menu d'accès aux statistiques et paramètres

4.2 Écran de Statistiques

Onglets pour différentes périodes (semaine, mois, année)
Graphiques interactifs
Tableau récapitulatif des tendances
Indicateurs de performance ("jours parfaits", "amélioration la plus notable")

4.3 Écran de Gestion des Compteurs

Création/modification/suppression des compteurs
Configuration des seuils et conséquences
Organisation par catégories
Options d'archivage

4.4 Écran de Paramètres

Personnalisation du thème (couleurs, polices)
Gestion des sauvegardes
Configuration des notifications (version mobile)
Options d'importation/exportation des données
Réinitialisation complète ou partielle

4.5 Écran d'Anniversaire

Animation de compte à rebours
Animation de confettis
Message personnalisé
Option de déverrouillage anticipé

4.6 Journal des Moments (Nouvelle Fonctionnalité)

Historique chronologique avec option d'ajout de photos
Possibilité d'ajouter des commentaires aux incidents
Filtrage par type d'erreur ou période
Fonction "Ce jour il y a un an"

5. Fonctionnalités Détaillées
5.1 Système de Compteurs Avancé

Compteurs récurrents (réinitialisés quotidiennement/hebdomadairement)
Compteurs liés (ex: si erreur A, alors erreur B est plus probable)
Catégorisation par zones de la maison (cuisine, salle de bain, etc.)
Indicateurs de tendance (amélioration/détérioration)
Compteurs positifs pour les bonnes actions

5.2 Système de Notification (Version Mobile)

Rappels personnalisés pour éviter les erreurs fréquentes
Notifications de félicitations pour les périodes sans erreur
Notifications pour les défis accomplis
Option "Do Not Disturb" configurable

5.3 Mode Multi-utilisateurs (Extension Future)

Compteurs partagés avec permissions
Possibilité d'assigner des erreurs à différentes personnes
Comparaison amicale des performances
Option "compteur anonyme" pour tact et diplomatie

5.4 Automatisation (Extension Future)

Intégration avec systèmes domotiques (si porte du lave-vaisselle ouverte > 10min)
Connectivité avec applications de rappels
Intégration avec calendriers pour événements spéciaux

5.5 Gamification Étendue

Système de niveaux et progression
"Achievement unlocked" style récompenses
Mini-jeux liés aux erreurs les plus fréquentes
Systèmes de paris amicaux sur l'amélioration

6. Stockage et Persistance des Données
6.1 Modèle de Données
javascriptCopy// Structure des compteurs
counter = {
  id: 'unique_id',
  name: 'Nom du compteur',
  category: 'Catégorie',
  count: 0,
  threshold: 5,
  lastIncrement: '2025-03-05',
  lastReset: '2025-03-01',
  history: {
    '2025-03-01': 2,
    '2025-03-02': 1,
    // dates et occurrences
  },
  consequences: ['conséquence1', 'conséquence2'],
  notes: 'notes additionnelles'
}

// Structure des statistiques
statistics = {
  startDate: '2025-03-01',
  endDate: '2025-03-07',
  counts: {
    '2025-03-01': {
      'counter_id_1': 2,
      'counter_id_2': 1
    },
    // autres dates
  },
  perfectDays: 2,
  trends: {
    improving: ['counter_id_1'],
    worsening: ['counter_id_3'],
    stable: ['counter_id_2']
  }
}

// Structure du journal
journalEntry = {
  date: '2025-03-05T14:35:00',
  counterId: 'counter_id_1',
  value: 1,
  comment: 'Cette fois c\'était vraiment drôle...',
  mediaUrls: ['url_to_photo'],
  mood: 'amusé'
}
6.2 Stratégies de Sauvegarde

Sauvegarde automatique à chaque modification
Option de sauvegarde manuelle
Export au format JSON pour sauvegarde externe
Sauvegarde cloud pour version avancée (sync multi-appareils)
Historique des versions avec possibilité de restauration

6.3 Optimisation des Performances

Pagination pour grandes quantités de données
Archivage automatique des anciennes entrées
Agrégation des données pour statistiques à long terme
Mise en cache intelligente des données fréquemment utilisées

7. Expérience Utilisateur et Design
7.1 Principes de Design

Interface ludique et non-intimidante
Feedback visuel immédiat
Animations subtiles mais engageantes
Équilibre entre humour et fonctionnalité
Accessibilité pour tous les utilisateurs

7.2 Thèmes et Personnalisation

Plusieurs thèmes prédéfinis (classique, nuit, pastel)
Personnalisation des couleurs principales
Options de taille de texte
Thèmes saisonniers (Noël, Saint-Valentin)
Support mode sombre automatique

7.3 Accessibilité

Conformité WCAG 2.1
Support des lecteurs d'écran
Options de contraste élevé
Navigation au clavier complète
Textes alternatifs pour toutes les images

7.4 Responsive Design

Adaptation fluide du mobile au desktop
Optimisation spécifique pour tablettes
Interface adaptée aux interactions tactiles
Gestes de swipe pour actions courantes (mobile)

8. Déploiement et Distribution
8.1 Version Web

Hébergement sur GitHub Pages (version basique)
Déploiement sur Netlify/Vercel (version avancée)
Configuration des domaines personnalisés
HTTPS obligatoire

8.2 Version Mobile (PWA)

Manifest pour installation sur écran d'accueil
Service Workers pour fonctionnement hors-ligne
Push notifications (si backend)
Optimisation des performances sur mobile

8.3 Versions Natives (Extension Future)

Packaging avec Capacitor/Cordova
Distribution sur App Store et Google Play
Accès aux fonctionnalités natives (appareil photo, etc.)

9. Fonctionnalités Spéciales pour Occasions
9.1 Module Anniversaire

Compte à rebours personnalisable
Animations festives (confettis, ballons)
Intégration de souhaits personnalisés
Option de partage sur réseaux sociaux

9.2 Modules Saisonniers

Thèmes et compteurs spéciaux pour Noël
Module Saint-Valentin avec compteurs positifs
Adaptations pour autres fêtes et événements importants
Rappels d'anniversaires de couple et dates spéciales

9.3 Module Voyage/Vacances

Mode spécial pour les périodes de voyage
Compteurs temporaires liés aux situations de vacances
Journal de voyage avec photos et souvenirs
Statistiques comparatives (quotidien vs vacances)

10. Évolutions Futures et Roadmap
10.1 Phase 1: Application Web Basique

Implémentation des compteurs et statistiques
Interface responsive basique
Sauvegarde locale (localStorage)
Module anniversaire

10.2 Phase 2: Amélioration de l'Expérience

Transformation en PWA
Amélioration des visualisations
Système de récompenses
Journal des moments
Export/import des données

10.3 Phase 3: Social et Connecté

Backend et authentification
Synchronisation multi-appareils
Partage sur réseaux sociaux
Mode multi-utilisateurs basique

10.4 Phase 4: Extensions Avancées

Intégrations IoT pour certains compteurs
Intelligence artificielle pour prédictions
Versions natives mobile
Personnalisation avancée

11. Aspects Techniques Additionnels
11.1 Performance

Time-to-Interactive < 3 secondes
Taille totale de l'application < 2MB (hors médias)
Score Lighthouse > 90 pour toutes les catégories
Optimisation des animations (utilisation de CSS transforms)

11.2 Tests

Tests unitaires pour logique métier (Jest)
Tests d'interface utilisateur (Cypress)
Tests de performance avec Lighthouse
Tests d'accessibilité automatisés
Tests utilisateurs avec groupe cible

11.3 Documentation

Guide d'utilisation intégré
Documentation technique pour développeurs
Documentation de l'API (version avancée)
Tutoriels vidéo pour fonctionnalités complexes

12. Conclusion
L'application "Allison's Mismatch Counter" vise à créer une expérience à la fois utile, amusante et engageante pour le couple. En transformant ce qui pourrait être des sources de tension en moments de complicité, elle renforce la communication et l'humour dans la relation.
Cette application combine une touche personnelle avec des fonctionnalités avancées, le tout dans une interface intuitive et attrayante. Les futures évolutions permettront d'enrichir l'expérience tout en conservant la simplicité qui fait son charme.
13. Annexes
13.1 Maquettes UI (à développer)

Wireframes des écrans principaux
Flow utilisateur
Palette de couleurs et typographie

13.2 Exemples de Messages d'Affection
Liste extensible de messages positifs et encourageants pour la rotation aléatoire.
13.3 Exemples de Conséquences Ludiques
Liste de "conséquences" positives et amusantes lorsque les seuils sont dépassés.
13.4 Planning de Développement
Calendrier prévisionnel pour les différentes phases de développement.