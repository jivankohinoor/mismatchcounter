// Default Configuration Object for Mismatch Counter App
const defaultConfig = {
  // App information
  app: {
    version: "1.0.0",
    name: "Mismatch Counter",
    description: "A cute app to track mismatches in a relationship"
  },
  
  // Recipient information
  recipient: {
    name: "Allison",
    relationship: "wife",
    birthdayDate: "March 5, 2025 18:00:00",
    secretCode: "iloveyoubutyoushouldnotpeekatthecode!"
  },
  
  // Sender information
  sender: {
    name: "Your husband"
  },
  
  // Theme settings
  theme: {
    mainColor: "#FF4B91",
    secondaryColor: "#6499E9",
    backgroundColor: "#FFF2F5",
    fontFamily: "'Poppins', sans-serif",
    iconName: "Heart"
  },
  
  // Custom messages
  messages: {
    loveMessages: [
      "You make every day better just by being you. I love you! 💖",
      "Thank you for putting up with my little quirks. You're amazing! 😘",
      "I may forget to close the dishwasher, but I'll never forget how much I love you! 💕",
      "Your smile makes my day, every single day! 😊",
      "Thanks for keeping me in check. It's one of the many reasons I love you! 🥰",
      "You and the cats are my favorite people in the world! 🐱❤️",
      "I promise to try harder with the dishwasher door... maybe. 😜",
      "You're purr-fect in every way! 🐱💕",
      "My favorite place is wherever you are. 💘",
      "Even when I mess up, your love never wavers. Thank you! ❤️",
      "You're the cat's meow! I love you fur-ever! 🐾",
      "I'm so lucky to have you as my wife! 💍",
      "You're the best thing that ever happened to me! 💫",
      "Every day with you is a gift! 🎁",
      "Your patience with me deserves a trophy! 🏆",
      "Happy Birthday to the most amazing person in the world! 🎂",
      "Wishing you a purr-fect birthday, my love! 🐱🎉",
      "Birthday kisses and wishes for my amazing one! 💋✨",
      "Let's make some more memories together! 💖",
      "Let's have a big hug and a big kiss! 💋",
      "I'm sorry for what I said when I was hungry. I love you! 💖"
    ],
    
    consequences: [
      { text: "Time to bring home flowers! 💐", timeLimit: 720 }, // 12 hours
      { text: "A fancy dinner is in order! 🍽️", timeLimit: 1440 }, // 24 hours
      { text: "Looks like someone owes a massage! 💆‍♀️", timeLimit: 360 }, // 6 hours
      { text: "Movie night - your choice! 🎬", timeLimit: 2880 }, // 48 hours
      { text: "Special cuddle duty for a week! 🥰", timeLimit: 240 }, // 4 hours
      { text: "Chocolate delivery required! 🍫", timeLimit: 180 }, // 3 hours
      { text: "Time for a special date night! ❤️", timeLimit: 4320 }, // 72 hours
      { text: "Breakfast in bed coming up! 🥞", timeLimit: 960 }, // 16 hours
      { text: "I'm cooking your favorite food! 🍕", timeLimit: 1080 }, // 18 hours
      { text: "Time for a special treat! 🎁", timeLimit: 120 }, // 2 hours
      { text: "Write a love note with at least 3 compliments 💌", timeLimit: 60 }, // 1 hour
      { text: "Offer a foot or hand massage for 15 minutes 👐", timeLimit: 180 }, // 3 hours
      { text: "Plan a surprise weekend activity 🎭", timeLimit: 2880 }, // 48 hours
      { text: "Do the dishes for the next 3 days 🍽️", timeLimit: 180 }, // 3 hours
      { text: "Take charge of grocery shopping this week 🛒", timeLimit: 1440 }, // 24 hours
      { text: "Handle all pet duties for 2 days 🐱", timeLimit: 240 }, // 4 hours
      { text: "Make the bed every morning for a week 🛏️", timeLimit: 360 }, // 6 hours
      { text: "Brew coffee/tea for both of us for 3 days ☕", timeLimit: 90 }, // 1.5 hours
      { text: "Give a 30-minute back rub tonight 💆", timeLimit: 720 }, // 12 hours
      { text: "No phone during our next dinner date 📵", timeLimit: 480 } // 8 hours
    ],
    
    birthdayTitle: "🎉 Happy Birthday, My Love! 🎂",
    birthdayMessage: "On this special day, I wanted to create something unique just for you! This little app will help you keep track of all my silly mismatches, but more importantly, it's a reminder of how much I love you, even with all my imperfections! I hope your day is as wonderful as you are! 💕",
    footerMessage: "Made with ❤️ for your special day",
    countdownMessage: "A special gift for your Birthday!"
  },
  
  // Selected template (profiles will be loaded from the profiles directory)
  selectedTemplate: 'romantic',
  
  // Advanced settings
  advanced: {
    randomMessageInterval: 10000, // milliseconds
    enableAnimations: true,
    debugMode: false,
    autoSaveInterval: 60000, // milliseconds
    allowNotifications: true,
    mobileOptimized: true,
    enableDataExport: true,
    enableCharts: true
  },
  
  // Notification settings
  notifications: {
    thresholdAlerts: true,
    streakCelebrations: true,
    birthdayReminders: true,
    dailyReminders: false
  }
};

export default defaultConfig; 