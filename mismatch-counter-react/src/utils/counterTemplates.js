// Counter templates for different relationship types
const counterTemplates = {
  romantic: [
    { name: "Oublier une date importante", count: 0, lastIncrement: null, threshold: 3 },
    { name: "Laisser la vaisselle sale", count: 0, lastIncrement: null, threshold: 5 },
    { name: "Ronfler trop fort", count: 0, lastIncrement: null, threshold: 10 },
    { name: "Oublier d'envoyer un message", count: 0, lastIncrement: null, threshold: 3 },
    { name: "Passer trop de temps sur le téléphone", count: 0, lastIncrement: null, threshold: 5 }
  ],
  
  roommates: [
    { name: "Oublier de sortir les poubelles", count: 0, lastIncrement: null, threshold: 3 },
    { name: "Laisser des poils dans la salle de bain", count: 0, lastIncrement: null, threshold: 5 },
    { name: "Finir le café sans en refaire", count: 0, lastIncrement: null, threshold: 3 },
    { name: "Laisser la lumière allumée", count: 0, lastIncrement: null, threshold: 5 },
    { name: "Manger la nourriture des autres", count: 0, lastIncrement: null, threshold: 3 }
  ],
  
  friends: [
    { name: "Arriver en retard", count: 0, lastIncrement: null, threshold: 3 },
    { name: "Oublier un anniversaire", count: 0, lastIncrement: null, threshold: 3 },
    { name: "Annuler à la dernière minute", count: 0, lastIncrement: null, threshold: 5 },
    { name: "Ne pas répondre aux messages", count: 0, lastIncrement: null, threshold: 3 },
    { name: "Spoiler une série/film", count: 0, lastIncrement: null, threshold: 3 }
  ],
  
  family: [
    { name: "Oublier un appel familial", count: 0, lastIncrement: null, threshold: 3 },
    { name: "Raconter des histoires embarrassantes", count: 0, lastIncrement: null, threshold: 5 },
    { name: "Oublier de passer du temps ensemble", count: 0, lastIncrement: null, threshold: 3 },
    { name: "Être trop critique", count: 0, lastIncrement: null, threshold: 3 },
    { name: "Parler politique aux repas", count: 0, lastIncrement: null, threshold: 5 }
  ]
};

export default counterTemplates; 