// --- Constants ---
const ALLISONS_BIRTHDAY = new Date("2025-03-05T00:00:00"); // *** SET ACTUAL BIRTHDAY DATE AND TIME ***
const SECRET_CODE = "love"; // *** CHOOSE A SECRET CODE ***
const LOVE_MESSAGES = [
    "Remember that time when...? 😉 Love you!",
    "Just a little reminder: You're amazing!",
    "Even with all the mismatches, you're perfect to me.",
    "Let's make more good memories than mismatches!",
    "Thanks for putting up with me! ❤️",
    "Every day with you is a gift (even dishwasher days).",
    "You're my favorite person.",
    "Thinking of you!",
    "Can't wait for our next adventure.",
    "My love for you > number of mismatches.",
    "Let's aim for a perfect week!",
    "You make my world brighter.",
    "So lucky to have you.",
    "How did I get so lucky?",
    "You + Me = Perfect Match (mostly!)",
    "Let's order takeout tonight?",
    "Sending you a virtual hug!",
    "Beeeeep boooop I love you! (Even when I talk about AI).",
    "You're the best part of my day.",
    "Thanks for your patience and love.",
    "Let's cuddle later?",
];
const RANDOM_EXCUSES = [
    "The cat hypnotized me.",
    "A rogue sock demanded my immediate attention.",
    "I was pondering the profound mysteries of the universe.",
    "It seemed like a good idea at the time...?",
    "I blame the cosmic rays.",
    "Wasn't me, it was my evil twin.",
    "My programming malfunctioned temporarily.",
    "I was distracted by how beautiful you are.",
    "The instructions were written in invisible ink.",
    "Gravity suddenly increased in that specific spot.",
    "I thought that's how you liked it?",
    "A tiny dinosaur ran off with my motivation.",
    "It's avant-garde housekeeping.",
    "I was practicing my mindfulness... and forgot.",
    "My hands were full... of snacks.",
    "I specifically remember *not* doing that.",
    "It's performance art.",
    "The dishwasher manual is clearly subjective.",
    "I was saving energy.",
    "Honestly? No excuse. Just love me anyway?",
];
const CONSEQUENCE_OPTIONS = [
    "Bring home flowers",
    "Extra long foot rubs",
    "Cook dinner tonight",
    "Do all the dishes for a day",
    "Write a love poem",
    "Give a 10-minute back massage",
    "Plan the next date night",
    "No complaints for 24 hours",
    "Clean the bathroom",
    "Let Allison pick the movie",
    "Breakfast in bed",
    "Take over cat litter duty for a week",
    "Sincerely apologize and give a long hug",
    "Wash and fold a load of laundry",
    "Make Allison's favorite drink/snack",
    // Add more as desired
];

const ICONS = {
    default: '❓',
    dish: '🍴', door: '🚪', knife: '🔪', clean: '🧹', mess: '🛋️', cat: '🐱', litter: '💩',
    trash: '🗑️', toilet: '🚽', seat: '🚽', vacuum: '🧹', yell: '📢', mad: '😡', ai: '🤖',
    bed: '🛏️', kitchen: '✨', gift: '🎁', surprise: '🎉', date: '❤️', love: '💖', ask: '🤔',
    flower: '🌸', sock: '🧦', floor: '🧹', coffee: '☕', chore: '🧼', help: '🤝', kind: '😊',
    listen: '👂', talk: '🗣️', walk: '🚶‍♀️'
    // Add more keyword mappings
};

// --- State Variables ---
let counters = {};
let goodBehaviors = {};
let weeklyStats = {};
let achievements = {};
let appUnlocked = false;
let countdownInterval;
let loveMessageInterval;
let chartInstances = {}; // To store Chart.js instances
let actionHistory = []; // For undo functionality
let undoTimeout;

// --- DOM Elements ---
const birthdayLockScreen = document.getElementById('birthday-lock-screen');
const countdownTimerEl = document.getElementById('countdown-timer');
const secretCodeInput = document.getElementById('secret-code');
const unlockButton = document.getElementById('unlock-button');
const unlockErrorEl = document.getElementById('unlock-error');
const birthdayMessageModal = document.getElementById('birthday-message-modal');
const mainApp = document.getElementById('main-app');
const loveMessageArea = document.getElementById('love-message-area');
const tabNavigation = document.getElementById('tab-navigation');
const tabContent = document.getElementById('tab-content');
const mismatchListEl = document.getElementById('mismatch-list');
const goodBehaviorListEl = document.getElementById('good-behavior-list');
const achievementListEl = document.getElementById('achievement-list');
const addMismatchForm = document.getElementById('add-mismatch-form');
const addBehaviorForm = document.getElementById('add-behavior-form');
const weeklyMismatchesEl = document.getElementById('weekly-mismatches');
const weeklyGoodDeedsEl = document.getElementById('weekly-good-deeds');
const weeklyPerfectDaysEl = document.getElementById('weekly-perfect-days');
const weekStartDateEl = document.getElementById('week-start-date');
const confirmationModal = document.getElementById('confirmation-modal');
const confirmationMessageEl = document.getElementById('confirmation-message');
const confirmYesButton = document.getElementById('confirm-yes-button');
const excuseModal = document.getElementById('excuse-modal');
const excuseTextEl = document.getElementById('excuse-text');
const copyConfirmationEl = document.getElementById('copy-confirmation');
const reportModal = document.getElementById('report-modal');
const reportContentEl = document.getElementById('report-content');
const consequenceModal = document.getElementById('consequence-modal');
const consequenceMismatchNameEl = document.getElementById('consequence-mismatch-name');
const consequenceTextEl = document.getElementById('consequence-text');
const customizeConsequenceModal = document.getElementById('customize-consequence-modal');
const customConsequenceMismatchNameEl = document.getElementById('custom-consequence-mismatch-name');
const consequenceOptionsEl = document.getElementById('consequence-options');
const customConsequenceInput = document.getElementById('custom-consequence-input');
const saveConsequenceButton = document.getElementById('save-consequence-button');
const toastContainer = document.getElementById('toast-container');
const undoArea = document.getElementById('undo-area');
const undoTimerEl = document.getElementById('undo-timer');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    console.log("Initializing Allison's Mismatch Counter...");
    loadData();
    setupEventListeners();
    checkBirthdayLock();
    populateConsequenceOptions();
}

function setupEventListeners() {
    unlockButton.addEventListener('click', checkSecretCode);
    secretCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkSecretCode();
    });

    tabNavigation.addEventListener('click', handleTabClick);

    // Event listeners for dynamically created buttons will be added during rendering
}

// --- Data Management ---
function loadData() {
    const storedCounters = localStorage.getItem('mismatchCounters');
    const storedGoodBehaviors = localStorage.getItem('goodBehaviors');
    const storedWeeklyStats = localStorage.getItem('weeklyStats');
    const storedAchievements = localStorage.getItem('achievements');
    const storedUnlockStatus = localStorage.getItem('appUnlocked');

    appUnlocked = storedUnlockStatus === 'true';

    try {
        counters = storedCounters ? JSON.parse(storedCounters) : {};
        goodBehaviors = storedGoodBehaviors ? JSON.parse(storedGoodBehaviors) : {};
        weeklyStats = storedWeeklyStats ? JSON.parse(storedWeeklyStats) : {};
        achievements = storedAchievements ? JSON.parse(storedAchievements) : {};

        // Data migration/validation could go here if structure changes
        // Ensure history exists
        Object.values(counters).forEach(c => { if (!c.history) c.history = {}; });
        Object.values(goodBehaviors).forEach(b => { if (!b.history) b.history = {}; });

    } catch (e) {
        console.error("Error parsing localStorage data:", e);
        // Reset to defaults if parsing fails catastrophically
        initializeDefaultData();
    }

    if (!storedCounters || Object.keys(counters).length === 0) {
       if(appUnlocked) { // Only init defaults if unlocked and empty
         console.log("No data found, initializing defaults.");
         initializeDefaultData();
       }
    }

     // Always ensure weekly stats object is valid and for the current week
    initializeOrUpdateWeeklyStats();

    console.log("Data loaded:", { counters, goodBehaviors, weeklyStats, achievements, appUnlocked });
}

function saveData() {
    try {
        localStorage.setItem('mismatchCounters', JSON.stringify(counters));
        localStorage.setItem('goodBehaviors', JSON.stringify(goodBehaviors));
        localStorage.setItem('weeklyStats', JSON.stringify(weeklyStats));
        localStorage.setItem('achievements', JSON.stringify(achievements));
        localStorage.setItem('appUnlocked', String(appUnlocked));
        console.log("Data saved.");
    } catch (e) {
        console.error("Error saving data to localStorage:", e);
        showToast("Error saving data. LocalStorage might be full.", "warning");
    }
}

function initializeDefaultData() {
    counters = {
        "Left the dishwasher door open": { count: 0, threshold: 5, lastIncrement: null, lastReset: null, history: {}, icon: getIconForKeyword("dishwasher door"), customConsequence: '' },
        "Put the wrong knives in the dishwasher": { count: 0, threshold: 3, lastIncrement: null, lastReset: null, history: {}, icon: getIconForKeyword("knife dish"), customConsequence: '' },
        "Didn't clean my mess before going to bed": { count: 0, threshold: 1, lastIncrement: null, lastReset: null, history: {}, icon: getIconForKeyword("clean mess"), customConsequence: '' },
        "Didn't empty the cat litter box": { count: 0, threshold: 2, lastIncrement: null, lastReset: null, history: {}, icon: getIconForKeyword("cat litter"), customConsequence: '' },
        "Didn't take out the trash": { count: 0, threshold: 1, lastIncrement: null, lastReset: null, history: {}, icon: getIconForKeyword("trash"), customConsequence: '' },
        "Didn't put the toilet seat down": { count: 0, threshold: 10, lastIncrement: null, lastReset: null, history: {}, icon: getIconForKeyword("toilet seat"), customConsequence: '' },
        "Didn't put the vacuum cleaner away": { count: 0, threshold: 5, lastIncrement: null, lastReset: null, history: {}, icon: getIconForKeyword("vacuum"), customConsequence: '' },
        "Yelled at you for no reason": { count: 0, threshold: 3, lastIncrement: null, lastReset: null, history: {}, icon: getIconForKeyword("yell"), customConsequence: '' },
        "Got mad at you for no reason": { count: 0, threshold: 3, lastIncrement: null, lastReset: null, history: {}, icon: getIconForKeyword("mad"), customConsequence: '' },
        "Talked about AI again ...": { count: 0, threshold: 100, lastIncrement: null, lastReset: null, history: {}, icon: getIconForKeyword("ai"), customConsequence: '' },
    };
    goodBehaviors = {
        "Made the bed without being asked": { count: 0, milestone: 10, lastIncrement: null, history: {}, icon: getIconForKeyword("bed ask") },
        "Cleaned the kitchen spotless": { count: 0, milestone: 5, lastIncrement: null, history: {}, icon: getIconForKeyword("clean kitchen") },
        "Surprised you with a gift": { count: 0, milestone: 5, lastIncrement: null, history: {}, icon: getIconForKeyword("surprise gift") },
        "Took care of all cat needs": { count: 0, milestone: 10, lastIncrement: null, history: {}, icon: getIconForKeyword("cat") },
        "Planned a special date": { count: 0, milestone: 5, lastIncrement: null, history: {}, icon: getIconForKeyword("date plan") },
    };
    achievements = {};
    initializeOrUpdateWeeklyStats(true); // Force reset weekly stats
    saveData();
}

function resetAllData() {
    showConfirmation("Are you sure you want to reset ALL data? This cannot be undone.", () => {
        console.log("Resetting all data...");
        localStorage.removeItem('mismatchCounters');
        localStorage.removeItem('goodBehaviors');
        localStorage.removeItem('weeklyStats');
        localStorage.removeItem('achievements');
        // Keep unlock status
        // localStorage.removeItem('appUnlocked');
        // appUnlocked = false;
        counters = {};
        goodBehaviors = {};
        weeklyStats = {};
        achievements = {};
        actionHistory = []; // Clear undo history
        initializeDefaultData();
        renderAll();
        showToast("All data has been reset to default.", "info");
        hideModal('confirmation-modal');
        // checkBirthdayLock(); // Re-check lock status if unlock status is also reset
    });
}


// --- Birthday Lock Logic ---
function checkBirthdayLock() {
    const now = new Date();
    if (appUnlocked) {
        console.log("App already unlocked.");
        hideLockScreen();
        initializeAppUI();
        return;
    }

    if (now >= ALLISONS_BIRTHDAY) {
        console.log("It's Allison's birthday or later!");
        unlockApp(true); // Unlock and show birthday message
    } else {
        console.log("Birthday hasn't arrived yet. Showing lock screen.");
        showLockScreen();
        startCountdown();
    }
}

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    updateCountdown(); // Initial display
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date();
    const timeLeft = ALLISONS_BIRTHDAY - now;

    if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        countdownTimerEl.textContent = "It's time!";
        unlockApp(true); // Automatically unlock and show message
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    countdownTimerEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function checkSecretCode() {
    const enteredCode = secretCodeInput.value.trim().toLowerCase();
    if (enteredCode === SECRET_CODE) {
        unlockErrorEl.textContent = '';
        secretCodeInput.value = '';
        console.log("Secret code correct!");
        unlockApp(false); // Unlock without birthday message
    } else {
        unlockErrorEl.textContent = 'Incorrect code. Try again!';
        console.log("Incorrect secret code entered.");
    }
}

function unlockApp(showBirthdayMsg) {
    if (appUnlocked) return; // Already unlocked

    appUnlocked = true;
    saveData(); // Save the unlocked state immediately
    clearInterval(countdownInterval);
    hideLockScreen();

    if (showBirthdayMsg) {
        showModal('birthday-message-modal');
        // Add confetti or other celebration effects here if desired
         triggerConfettiEffect(200); // More confetti for birthday!
    } else {
        showMainApp(); // Directly show main app if unlocked via code early
    }
}

function showLockScreen() {
    birthdayLockScreen.classList.add('visible');
    birthdayLockScreen.classList.remove('hidden');
    mainApp.style.display = 'none'; // Ensure main app is hidden
}

function hideLockScreen() {
    birthdayLockScreen.classList.remove('visible');
    birthdayLockScreen.classList.add('hidden');
}

function showMainApp() {
    mainApp.style.display = 'block'; // Show the main application container
    initializeAppUI(); // Initialize UI components like messages, stats, etc.
}

function initializeAppUI() {
    if (!appUnlocked) return; // Don't initialize if not unlocked

     // Ensure default data exists if storage was empty
     if (Object.keys(counters).length === 0 && Object.keys(goodBehaviors).length === 0) {
        initializeDefaultData();
    }

    startLoveMessages();
    renderAll(); // Render all components
}


// --- UI Rendering ---
function renderAll() {
    if (!appUnlocked) return;
    console.log("Rendering all components...");
    renderMismatches();
    renderGoodBehaviors();
    renderAchievements();
    renderWeeklyStats();
    renderCharts(); // Ensure charts are rendered/updated
}

function renderMismatches() {
    mismatchListEl.innerHTML = ''; // Clear existing list
    const sortOrder = document.getElementById('sort-mismatches').value;
    let sortedKeys = Object.keys(counters);

    // Sorting logic
    sortedKeys.sort((a, b) => {
        switch (sortOrder) {
            case 'count-desc':
                return counters[b].count - counters[a].count;
            case 'count-asc':
                return counters[a].count - counters[b].count;
            case 'recent':
                 // Sort by lastIncrement date, newest first (nulls last)
                const dateA = counters[a].lastIncrement ? new Date(counters[a].lastIncrement) : new Date(0);
                const dateB = counters[b].lastIncrement ? new Date(counters[b].lastIncrement) : new Date(0);
                return dateB - dateA;
            case 'name':
            default:
                return a.localeCompare(b);
        }
    });


    if (sortedKeys.length === 0) {
        mismatchListEl.innerHTML = '<p>No mismatch types added yet. Click "+ Add Mismatch Type" to start!</p>';
        return;
    }

    sortedKeys.forEach(name => {
        const counter = counters[name];
        const card = document.createElement('div');
        card.className = 'item-card mismatch-card';

        const isOverThreshold = counter.threshold > 0 && counter.count >= counter.threshold;
        const isNearThreshold = counter.threshold > 0 && counter.count >= counter.threshold * 0.7 && !isOverThreshold; // Example: warning at 70%

        let badgesHTML = '';
        if (isOverThreshold) {
            badgesHTML += `<span class="badge threshold-warning-badge">Threshold Met!</span>`;
        } else if (isNearThreshold) {
             badgesHTML += `<span class="badge threshold-warning-badge" style="background-color: orange;">Near Threshold!</span>`;
        }


        // Days without mistake
        let daysWithout = 'N/A';
        if (counter.lastIncrement) {
            const lastDate = new Date(counter.lastIncrement);
            const today = new Date();
            // Set hours to 0 to compare dates only
            lastDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            const diffTime = Math.abs(today - lastDate);
            daysWithout = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        } else if (counter.count === 0) {
             daysWithout = '∞'; // Infinity symbol if never incremented and count is 0
        }


        card.innerHTML = `
            ${badgesHTML}
            <h3><span class="item-icon">${counter.icon || getIconForKeyword(name)}</span> ${name}</h3>
            <div class="item-details">
                <p>Count: <strong>${counter.count}</strong></p>
                <p>Threshold: ${counter.threshold > 0 ? counter.threshold : 'None'}</p>
                 <p>Days Without: ${daysWithout}</p>
                <p class="meta-info">
                    Last incident: ${counter.lastIncrement ? formatDate(counter.lastIncrement) : 'Never'} <br>
                    Last forgiven: ${counter.lastReset ? formatDate(counter.lastReset) : 'Never'}
                </p>
                ${isOverThreshold ? `<p class="consequence-alert">🚨 Consequence Activated: <strong>${getConsequence(name)}</strong></p>` : ''}
            </div>
            <div class="item-actions">
                <button class="increment-button" data-name="${name}">Oops! (+1)</button>
                ${counter.count > 0 ? `<button class="forgive-button" data-name="${name}">Forgive 🙏</button>` : ''}
                 <button class="set-consequence-button" data-name="${name}" title="Set Consequence">⚙️</button>
                <button class="delete-button" data-name="${name}">Delete</button>
            </div>
        `;

        // Add event listeners using delegation from the parent is better, but this works for simplicity
        card.querySelector('.increment-button').addEventListener('click', () => confirmIncrementMismatch(name));
        if (counter.count > 0) {
            card.querySelector('.forgive-button').addEventListener('click', () => forgiveMismatch(name));
        }
         card.querySelector('.set-consequence-button').addEventListener('click', () => showCustomizeConsequenceModal(name));
        card.querySelector('.delete-button').addEventListener('click', () => deleteMismatch(name));

        mismatchListEl.appendChild(card);
    });
}

function renderGoodBehaviors() {
    goodBehaviorListEl.innerHTML = '';
    const sortOrder = document.getElementById('sort-behaviors').value;
    let sortedKeys = Object.keys(goodBehaviors);

     // Sorting logic
    sortedKeys.sort((a, b) => {
        switch (sortOrder) {
            case 'count-desc':
                return goodBehaviors[b].count - goodBehaviors[a].count;
            case 'count-asc':
                return goodBehaviors[a].count - goodBehaviors[b].count;
            case 'recent':
                const dateA = goodBehaviors[a].lastIncrement ? new Date(goodBehaviors[a].lastIncrement) : new Date(0);
                const dateB = goodBehaviors[b].lastIncrement ? new Date(goodBehaviors[b].lastIncrement) : new Date(0);
                return dateB - dateA;
            case 'name':
            default:
                return a.localeCompare(b);
        }
    });

     if (sortedKeys.length === 0) {
        goodBehaviorListEl.innerHTML = '<p>No good behaviors added yet. Time to do something nice! 😉</p>';
        return;
    }

    sortedKeys.forEach(name => {
        const behavior = goodBehaviors[name];
        const card = document.createElement('div');
        card.className = 'item-card behavior-card';

        let badgesHTML = '';
        if (behavior.milestone > 0 && behavior.count >= behavior.milestone) {
            badgesHTML += `<span class="badge achievement-badge">Goal Met! 🎉</span>`;
        } else if (behavior.milestone > 0) {
             badgesHTML += `<span class="badge milestone-badge">Goal: ${behavior.milestone}</span>`;
        }

         // Last performed date
        let lastPerformed = 'Never';
        if (behavior.lastIncrement) {
            lastPerformed = formatDate(behavior.lastIncrement);
        }

        card.innerHTML = `
            ${badgesHTML}
            <h3><span class="item-icon">${behavior.icon || getIconForKeyword(name)}</span> ${name}</h3>
            <div class="item-details">
                <p>Count: <strong>${behavior.count}</strong></p>
                 <p class="meta-info">Last performed: ${lastPerformed}</p>
            </div>
            <div class="item-actions">
                <button class="increment-button" data-name="${name}">Did It! (+1)</button>
                <button class="delete-button" data-name="${name}">Delete</button>
            </div>
        `;

        card.querySelector('.increment-button').addEventListener('click', () => incrementGoodBehavior(name));
        card.querySelector('.delete-button').addEventListener('click', () => deleteGoodBehavior(name));

        goodBehaviorListEl.appendChild(card);
    });
}

function renderAchievements() {
    achievementListEl.innerHTML = '';
    const unlockedIds = Object.keys(achievements);

    if (unlockedIds.length === 0) {
        achievementListEl.innerHTML = '<p>No achievements unlocked yet. Keep up the good work (or lack of mismatches)!</p>';
        return;
    }

     // Sort achievements by date, newest first
     unlockedIds.sort((a, b) => new Date(achievements[b].date) - new Date(achievements[a].date));


    unlockedIds.forEach(id => {
        const achievement = achievements[id];
        const details = getAchievementDetails(id); // Get static details like name, icon, description
        const card = document.createElement('div');
        card.className = 'item-card achievement-card';

        card.innerHTML = `
            <h3><span class="item-icon">${details.icon}</span> ${details.name}</h3>
            <div class="item-details">
                <p>${details.description}</p>
                <p class="achievement-date">Unlocked: ${formatDate(achievement.date)}</p>
                ${achievement.details ? `<p><em>${achievement.details}</em></p>` : ''}
            </div>
        `;
        achievementListEl.appendChild(card);
    });
}

function renderWeeklyStats() {
    if (!weeklyStats.startDate) {
        initializeOrUpdateWeeklyStats(); // Ensure stats are initialized
    }

    weekStartDateEl.textContent = formatDate(weeklyStats.startDate, false); // Don't show time
    weeklyMismatchesEl.textContent = weeklyStats.totalMismatches || 0;
    weeklyGoodDeedsEl.textContent = weeklyStats.totalGoodBehaviors || 0;
    weeklyPerfectDaysEl.textContent = weeklyStats.perfectDays || 0;
}

// --- Mismatch Actions ---
function showAddMismatchForm() {
    addMismatchForm.classList.remove('hidden');
}
function hideAddMismatchForm() {
    addMismatchForm.classList.add('hidden');
    document.getElementById('new-mismatch-name').value = ''; // Clear input
}

function addMismatch() {
    const nameInput = document.getElementById('new-mismatch-name');
    const thresholdSelect = document.getElementById('new-mismatch-threshold');
    const name = nameInput.value.trim();
    const threshold = parseInt(thresholdSelect.value, 10);

    if (!name) {
        alert("Please enter a name for the mismatch.");
        return;
    }
    if (counters[name]) {
        alert(`A mismatch named "${name}" already exists.`);
        return;
    }

    const newCounter = {
        count: 0,
        threshold: threshold,
        lastIncrement: null,
        lastReset: null,
        history: {},
        icon: getIconForKeyword(name),
        customConsequence: ''
    };

    recordAction('add', 'counter', { name, data: newCounter }); // Record for undo

    counters[name] = newCounter;
    saveData();
    renderMismatches();
    renderCharts(); // Update charts if needed
    hideAddMismatchForm();
    showToast(`Mismatch type "${name}" added!`, "success");
}

function confirmIncrementMismatch(name) {
    showConfirmation(`Are you sure you want to record a "${name}" mismatch?`, () => {
        incrementMismatch(name);
        hideModal('confirmation-modal');
    });
}

function incrementMismatch(name) {
    if (!counters[name]) return;

    const oldData = JSON.parse(JSON.stringify(counters[name])); // Deep copy for undo
    const todayStr = getTodayDateString();

    counters[name].count++;
    counters[name].lastIncrement = new Date().toISOString();

    // Update daily history
    if (!counters[name].history) counters[name].history = {};
    counters[name].history[todayStr] = (counters[name].history[todayStr] || 0) + 1;

    recordAction('increment', 'counter', { name, oldData }); // Record for undo

    updateWeeklyStatsOnIncrement('mismatch', name); // Update weekly stats
    saveData();
    renderMismatches();
    renderWeeklyStats();
    renderCharts();
    checkAchievements(); // Check if any achievements were unlocked

    // Check threshold and show consequence alert
    const counter = counters[name];
    if (counter.threshold > 0 && counter.count === counter.threshold) {
         showConsequenceAlert(name);
         triggerConfettiEffect(50, 'warning'); // Warning confetti
    } else {
        triggerConfettiEffect(10, 'sad'); // Small sad confetti for mistake
    }
}

function forgiveMismatch(name) {
    if (!counters[name] || counters[name].count === 0) return;

    const oldData = JSON.parse(JSON.stringify(counters[name])); // Deep copy for undo

    recordAction('forgive', 'counter', { name, oldData }); // Record for undo

    counters[name].count = 0;
    counters[name].lastReset = new Date().toISOString();
    // Note: History is kept, only count and lastReset are changed.

    saveData();
    renderMismatches();
    renderCharts(); // Update charts
    triggerConfettiEffect(100); // Happy confetti!
    showToast(`Mismatch "${name}" forgiven! Count reset to 0.`, 'success');
    checkAchievements('forgive'); // Check specifically for forgiveness achievements
}

function deleteMismatch(name) {
    if (!counters[name]) return;

    showConfirmation(`Are you sure you want to delete the mismatch type "${name}"? All its history will be lost.`, () => {
        const oldData = JSON.parse(JSON.stringify(counters[name])); // Deep copy for undo

        recordAction('delete', 'counter', { name, oldData }); // Record for undo

        delete counters[name];
        saveData();
        renderMismatches();
        renderWeeklyStats(); // Mismatches might affect weekly totals
        renderCharts(); // Update charts
        showToast(`Mismatch type "${name}" deleted.`, "info");
        hideModal('confirmation-modal');
    });
}


// --- Good Behavior Actions ---
function showAddBehaviorForm() {
    addBehaviorForm.classList.remove('hidden');
}
function hideAddBehaviorForm() {
    addBehaviorForm.classList.add('hidden');
    document.getElementById('new-behavior-name').value = '';
}

function addGoodBehavior() {
    const nameInput = document.getElementById('new-behavior-name');
    const milestoneSelect = document.getElementById('new-behavior-milestone');
    const name = nameInput.value.trim();
    const milestone = parseInt(milestoneSelect.value, 10);

    if (!name) {
        alert("Please enter a name for the good behavior.");
        return;
    }
    if (goodBehaviors[name]) {
        alert(`A behavior named "${name}" already exists.`);
        return;
    }

     const newBehavior = {
        count: 0,
        milestone: milestone,
        lastIncrement: null,
        history: {},
        icon: getIconForKeyword(name)
    };

    recordAction('add', 'behavior', { name, data: newBehavior }); // Record for undo

    goodBehaviors[name] = newBehavior;
    saveData();
    renderGoodBehaviors();
    renderCharts();
    hideAddBehaviorForm();
    showToast(`Good behavior "${name}" added!`, "success");
}

function incrementGoodBehavior(name) {
    if (!goodBehaviors[name]) return;

    const oldData = JSON.parse(JSON.stringify(goodBehaviors[name])); // Deep copy for undo
    const todayStr = getTodayDateString();

    goodBehaviors[name].count++;
    goodBehaviors[name].lastIncrement = new Date().toISOString();

    // Update daily history
     if (!goodBehaviors[name].history) goodBehaviors[name].history = {};
     goodBehaviors[name].history[todayStr] = (goodBehaviors[name].history[todayStr] || 0) + 1;

     recordAction('increment', 'behavior', { name, oldData }); // Record for undo

    updateWeeklyStatsOnIncrement('goodBehavior', name);
    saveData();
    renderGoodBehaviors();
    renderWeeklyStats();
    renderCharts();
    triggerConfettiEffect(30); // Confetti for good deeds!
    showToast(`Recorded "${name}"! Keep it up!`, 'success');
    checkAchievements('milestone', name); // Check specifically for milestone achievements
}

function deleteGoodBehavior(name) {
    if (!goodBehaviors[name]) return;

    showConfirmation(`Are you sure you want to delete the good behavior "${name}"?`, () => {
        const oldData = JSON.parse(JSON.stringify(goodBehaviors[name])); // Deep copy for undo

        recordAction('delete', 'behavior', { name, oldData }); // Record for undo

        delete goodBehaviors[name];
        saveData();
        renderGoodBehaviors();
        renderWeeklyStats();
        renderCharts();
        showToast(`Good behavior "${name}" deleted.`, "info");
        hideModal('confirmation-modal');
    });
}


// --- Weekly Stats ---
function initializeOrUpdateWeeklyStats(forceReset = false) {
    const today = new Date();
    const currentWeekStart = getStartOfWeek(today);
    const currentWeekStartStr = currentWeekStart.toISOString().split('T')[0];

    if (forceReset || !weeklyStats.startDate || weeklyStats.startDate !== currentWeekStartStr) {
        console.log("Initializing/Resetting weekly stats for week starting:", currentWeekStartStr);
        // Check achievements for the *previous* week before resetting
        if (weeklyStats.startDate && weeklyStats.startDate !== currentWeekStartStr) {
            checkWeeklyAchievements(weeklyStats); // Pass the old stats object
        }

        weeklyStats = {
            startDate: currentWeekStartStr,
            counts: {}, // { "YYYY-MM-DD": { "counterName": count } }
            goodBehaviorCounts: {}, // { "YYYY-MM-DD": { "behaviorName": count } }
            totalMismatches: 0,
            totalGoodBehaviors: 0,
            perfectDays: 0, // Count of days within the week with 0 mismatches recorded *on that day*
            // We need to recalculate totals based on daily history if we crossed a week boundary
            // For simplicity here, we just reset totals. Recalculation requires iterating history.
        };

         // Recalculate totals for the *new* current week based on history
         recalculateWeeklyTotals(currentWeekStart);

        saveData();
    }
    // Ensure substructures exist
    if (!weeklyStats.counts) weeklyStats.counts = {};
    if (!weeklyStats.goodBehaviorCounts) weeklyStats.goodBehaviorCounts = {};
}

function recalculateWeeklyTotals(weekStartDate) {
    weeklyStats.totalMismatches = 0;
    weeklyStats.totalGoodBehaviors = 0;
    weeklyStats.perfectDays = 0;
    const endOfWeek = new Date(weekStartDate);
    endOfWeek.setDate(weekStartDate.getDate() + 6);

    let dailyMismatchCounts = {}; // Keep track of mismatches per day within the week

    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStartDate);
        day.setDate(weekStartDate.getDate() + i);
        const dayStr = day.toISOString().split('T')[0];
        dailyMismatchCounts[dayStr] = 0; // Initialize day count

        // Aggregate from counter history
        Object.values(counters).forEach(counter => {
            if (counter.history && counter.history[dayStr]) {
                const countOnDay = counter.history[dayStr];
                weeklyStats.totalMismatches += countOnDay;
                 if (!weeklyStats.counts[dayStr]) weeklyStats.counts[dayStr] = {};
                 weeklyStats.counts[dayStr][counter.name] = countOnDay; // Might need name? Spec is ambiguous
                 dailyMismatchCounts[dayStr] += countOnDay;
            }
        });

        // Aggregate from good behavior history
        Object.values(goodBehaviors).forEach(behavior => {
             if (behavior.history && behavior.history[dayStr]) {
                const countOnDay = behavior.history[dayStr];
                weeklyStats.totalGoodBehaviors += countOnDay;
                 if (!weeklyStats.goodBehaviorCounts[dayStr]) weeklyStats.goodBehaviorCounts[dayStr] = {};
                 weeklyStats.goodBehaviorCounts[dayStr][behavior.name] = countOnDay; // Store specific behavior count for the day
            }
        });
    }

     // Calculate perfect days after summing up daily mismatches
     let perfectDaysCount = 0;
     for (let i = 0; i < 7; i++) {
         const day = new Date(weekStartDate);
         day.setDate(weekStartDate.getDate() + i);
         const dayStr = day.toISOString().split('T')[0];
         // A day is perfect if NO mismatches were recorded *for that day* in the history
         if (dailyMismatchCounts[dayStr] === 0) {
             perfectDaysCount++;
         }
     }
     weeklyStats.perfectDays = perfectDaysCount;

}


function updateWeeklyStatsOnIncrement(type, name) {
    initializeOrUpdateWeeklyStats(); // Ensure we're working with the current week's stats

    const todayStr = getTodayDateString();
    const wasPerfectToday = (weeklyStats.counts[todayStr] ? Object.values(weeklyStats.counts[todayStr]).reduce((a, b) => a + b, 0) : 0) === 0;


    if (type === 'mismatch') {
        if (!weeklyStats.counts[todayStr]) weeklyStats.counts[todayStr] = {};
        weeklyStats.counts[todayStr][name] = (weeklyStats.counts[todayStr][name] || 0) + 1;
        weeklyStats.totalMismatches = (weeklyStats.totalMismatches || 0) + 1;
        // If today *was* perfect and we just added a mismatch, decrement perfect days count
         if (wasPerfectToday) {
             weeklyStats.perfectDays = Math.max(0, (weeklyStats.perfectDays || 0) - 1);
         }

    } else if (type === 'goodBehavior') {
        if (!weeklyStats.goodBehaviorCounts[todayStr]) weeklyStats.goodBehaviorCounts[todayStr] = {};
        weeklyStats.goodBehaviorCounts[todayStr][name] = (weeklyStats.goodBehaviorCounts[todayStr][name] || 0) + 1;
        weeklyStats.totalGoodBehaviors = (weeklyStats.totalGoodBehaviors || 0) + 1;
    }
     // Note: Perfect days logic simplified - accurately tracking needs careful state management on undo/deletes.
     // Recalculating daily totals might be safer on each update if complexity increases.
}

function updateWeeklyStatsOnDecrement(type, name, dateStr) {
     initializeOrUpdateWeeklyStats(); // Ensure current week

     const todayStr = getTodayDateString(); // Or use the dateStr from the action history

     // Check if the day *was not* perfect before this decrement
      const dayTotalBeforeDecrement = weeklyStats.counts[dateStr] ? Object.values(weeklyStats.counts[dateStr]).reduce((a, b) => a + b, 0) : 0;


    if (type === 'mismatch') {
        if (weeklyStats.counts[dateStr] && weeklyStats.counts[dateStr][name] > 0) {
            weeklyStats.counts[dateStr][name]--;
            weeklyStats.totalMismatches = Math.max(0, (weeklyStats.totalMismatches || 0) - 1);
             if (weeklyStats.counts[dateStr][name] === 0) {
                delete weeklyStats.counts[dateStr][name]; // Clean up if count is zero
            }
             // If the day's total mismatch count becomes 0 after decrementing, increment perfect days
             const dayTotalAfterDecrement = weeklyStats.counts[dateStr] ? Object.values(weeklyStats.counts[dateStr]).reduce((a, b) => a + b, 0) : 0;
              if (dayTotalAfterDecrement === 0 && dayTotalBeforeDecrement > 0) {
                 weeklyStats.perfectDays = (weeklyStats.perfectDays || 0) + 1;
             }

        }
    } else if (type === 'goodBehavior') {
         if (weeklyStats.goodBehaviorCounts[dateStr] && weeklyStats.goodBehaviorCounts[dateStr][name] > 0) {
            weeklyStats.goodBehaviorCounts[dateStr][name]--;
            weeklyStats.totalGoodBehaviors = Math.max(0, (weeklyStats.totalGoodBehaviors || 0) - 1);
            if (weeklyStats.goodBehaviorCounts[dateStr][name] === 0) {
                delete weeklyStats.goodBehaviorCounts[dateStr][name]; // Clean up
            }
        }
    }
}


function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday as start of week
    return new Date(d.setDate(diff));
}

// --- Charts ---
function renderCharts() {
     if (!appUnlocked || !document.getElementById('charts-tab').classList.contains('active')) {
        // Don't render if tab isn't visible or app isn't ready
        // console.log("Skipping chart rendering (Tab not active or app locked).")
        return;
     }
     console.log("Rendering charts...");

    // Destroy existing charts before creating new ones
    Object.values(chartInstances).forEach(chart => chart.destroy());
    chartInstances = {};

    renderMismatchDistributionChart();
    renderWeeklyTrendChart();
    renderGoodVsBadChart();
}

function renderMismatchDistributionChart() {
    const ctx = document.getElementById('mismatch-distribution-chart')?.getContext('2d');
    if (!ctx) return;

    const labels = Object.keys(counters);
    const data = labels.map(name => counters[name].count);
    const backgroundColors = labels.map((_, index) => `hsl(${index * 360 / labels.length}, 70%, 70%)`); // Generate distinct colors

    chartInstances.mismatchDistribution = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mismatch Count',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('70%', '50%')), // Darker border
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allow custom height/width via CSS container
            plugins: {
                legend: { display: false }, // Hide legend if too many items
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y;
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Count' } },
                x: { ticks: { autoSkip: false, maxRotation: 90, minRotation: 45 } } // Rotate labels if needed
            }
        }
    });
}

function renderWeeklyTrendChart() {
    const ctx = document.getElementById('weekly-trend-chart')?.getContext('2d');
     if (!ctx) return;

     initializeOrUpdateWeeklyStats(); // Ensure stats are current

    const weekStart = new Date(weeklyStats.startDate);
    const labels = [];
    const mismatchData = [];
    const goodBehaviorData = [];

    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);
        const dayStr = day.toISOString().split('T')[0];
        labels.push(day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })); // Format label

        let dailyMismatches = 0;
        if (weeklyStats.counts && weeklyStats.counts[dayStr]) {
            dailyMismatches = Object.values(weeklyStats.counts[dayStr]).reduce((sum, count) => sum + count, 0);
        }
        mismatchData.push(dailyMismatches);

         let dailyGoodBehaviors = 0;
         if (weeklyStats.goodBehaviorCounts && weeklyStats.goodBehaviorCounts[dayStr]) {
            dailyGoodBehaviors = Object.values(weeklyStats.goodBehaviorCounts[dayStr]).reduce((sum, count) => sum + count, 0);
         }
        goodBehaviorData.push(dailyGoodBehaviors);
    }


    chartInstances.weeklyTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Mismatches',
                    data: mismatchData,
                    borderColor: 'rgba(255, 99, 132, 1)', // Pink/Red
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1, // Smooth curves slightly
                    fill: true,
                },
                {
                    label: 'Good Behaviors',
                    data: goodBehaviorData,
                    borderColor: 'rgba(75, 192, 192, 1)', // Green/Blue
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1,
                    fill: true,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
             plugins: {
                 legend: { position: 'top' },
                  tooltip: { mode: 'index', intersect: false } // Show tooltip for both lines on hover
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Count' } }
            }
        }
    });
}

function renderGoodVsBadChart() {
     const ctx = document.getElementById('good-vs-bad-chart')?.getContext('2d');
    if (!ctx) return;

    // Calculate overall totals (could use weekly totals or sum all history)
    // Using weekly totals for consistency with other weekly views
    const totalMismatches = weeklyStats.totalMismatches || 0;
    const totalGoodBehaviors = weeklyStats.totalGoodBehaviors || 0;

     // Prevent chart error if both are 0
    if (totalMismatches === 0 && totalGoodBehaviors === 0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas
        ctx.font = "16px " + getComputedStyle(document.body).fontFamily;
        ctx.textAlign = "center";
        ctx.fillText("No data yet for this week!", ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }


    chartInstances.goodVsBad = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Mismatches', 'Good Behaviors'],
            datasets: [{
                label: 'Overall Balance (This Week)',
                data: [totalMismatches, totalGoodBehaviors],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)', // Pink/Red for Mismatches
                    'rgba(75, 192, 192, 0.7)' // Green/Blue for Good
                ],
                 borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                     callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            const value = context.parsed;
                            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            label += `${value} (${percentage}%)`;
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// --- Achievements ---

// Static details for achievements
const ACHIEVEMENT_DEFINITIONS = {
    firstForgive: { name: "First Forgiveness", icon: "🤝", description: "Forgave a mismatch for the first time." },
    perfectWeek: { name: "Perfect Week", icon: "🌟", description: "Completed a week with zero mismatches recorded." },
    improve3Weeks: { name: "Improvement Path", icon: "📈", description: "Reduced total mismatches for 3 consecutive weeks." },
    perfectBalance: { name: "Perfect Balance", icon: "⚖️", description: "Achieved an equal number of mismatches and good behaviors in a week." },
    milestone5: { name: "Good Deed Starter", icon: "⭐", description: "Reached 5 occurrences for a specific good behavior." },
    milestone10: { name: "Habit Builder", icon: "⭐⭐", description: "Reached 10 occurrences for a specific good behavior." },
    milestone25: { name: "Consistent Kindness", icon: "🏆", description: "Reached 25 occurrences for a specific good behavior." },
    milestone50: { name: "Behavior Master", icon: "🏅", description: "Reached 50 occurrences for a specific good behavior." },
    dishwasherMaster: { name: "Dishwasher Master", icon: "🚪✨", description: "Two consecutive weeks with no dishwasher-related incidents." },
    catHero: { name: "Cat Hero", icon: "👑🐱", description: "A full month with perfect cat care recorded (needs specific tracking)." },
    // Add more achievement definitions here
};

function getAchievementDetails(id) {
    // Extract base ID if it includes specifics (like milestone_behaviorName)
    const baseId = id.split('_')[0];
    return ACHIEVEMENT_DEFINITIONS[baseId] || { name: "Unknown Achievement", icon: "❓", description: "Details not found." };
}


function checkAchievements(triggerType = null, relatedName = null) {
     if (!appUnlocked) return;
     console.log(`Checking achievements (Trigger: ${triggerType}, Related: ${relatedName})`);

     let changed = false; // Track if any achievement state changed

    // --- Specific Trigger Checks ---
    if (triggerType === 'forgive') {
        if (!achievements.firstForgive) {
            // Check if ANY counter has lastReset set
            const forgivenOnce = Object.values(counters).some(c => c.lastReset);
            if (forgivenOnce) {
                 changed = unlockAchievement('firstForgive') || changed;
            }
        }
    }

    if (triggerType === 'milestone' && relatedName) {
        const behavior = goodBehaviors[relatedName];
        if (behavior) {
            // Check standard milestones
            [5, 10, 25, 50].forEach(m => {
                if (behavior.count >= m) {
                     // Generate a unique ID for each behavior's milestone
                     const achievementId = `milestone${m}_${relatedName.replace(/\s+/g, '')}`; // e.g., milestone10_MadeBed
                     if (!achievements[achievementId]) {
                        // Check if this specific behavior just hit this milestone
                         // Use the definition from the generic milestone
                         const definition = ACHIEVEMENT_DEFINITIONS[`milestone${m}`];
                         if (definition) {
                            changed = unlockAchievement(achievementId, `${definition.name} for "${relatedName}"!`) || changed;
                         }
                    }
                }
            });
        }
    }

    // --- General Checks (Can be run periodically or on specific events like week change) ---
    // These might need historical data which is complex with only localStorage.
    // Simplified checks based on current/previous week stats:

    // Perfect Week - Checked when a week rolls over
    // Improvement Path - Checked when a week rolls over (needs history of weekly totals)
    // Perfect Balance - Checked when a week rolls over

    // Dishwasher Master - Complex, needs tracking consecutive weeks. Placeholder logic:
    if (!achievements.dishwasherMaster) {
         // Requires checking history across week boundaries for specific counters
        // console.warn("Dishwasher Master achievement check not fully implemented (requires history).");
    }

    // Cat Hero - Complex, needs tracking consecutive *days* or specific behaviors over a month.
    if (!achievements.catHero) {
        // Requires detailed daily history analysis over a month.
       // console.warn("Cat Hero achievement check not fully implemented (requires history).");
    }


    if (changed) {
        renderAchievements(); // Re-render if any achievement was unlocked
    }
}

// Function called when a week rolls over
function checkWeeklyAchievements(previousWeekStats) {
     if (!appUnlocked || !previousWeekStats || !previousWeekStats.startDate) return;
     console.log("Checking weekly achievements for week starting:", previousWeekStats.startDate);

     let changed = false;

     // Perfect Week
     if (previousWeekStats.totalMismatches === 0 && !achievements.perfectWeek) {
        // Check if total mismatches for the *completed* week was 0
        changed = unlockAchievement('perfectWeek', `Week starting ${formatDate(previousWeekStats.startDate, false)} was mismatch-free!`) || changed;
     }

    // Perfect Balance
     if (previousWeekStats.totalMismatches > 0 && previousWeekStats.totalMismatches === previousWeekStats.totalGoodBehaviors && !achievements.perfectBalance) {
         changed = unlockAchievement('perfectBalance', `Balanced week (${previousWeekStats.totalMismatches} each) starting ${formatDate(previousWeekStats.startDate, false)}!`) || changed;
     }

    // Improvement Path (Requires storing previous weekly totals)
    // This requires more persistent history than currently stored.
    // Placeholder: We'd need an array like `weeklyHistory: [{startDate, totalMismatches}, ...]`
    // console.warn("Improvement Path achievement check requires historical weekly data not currently stored.");


     if (changed) {
        renderAchievements();
     }
}


function unlockAchievement(id, details = null) {
    if (achievements[id]) {
        return false; // Already unlocked
    }

    const definition = getAchievementDetails(id); // Get base details

    achievements[id] = {
        date: new Date().toISOString(),
        details: details // Specific details like behavior name or date range
    };
    saveData();
    showToast(`🏆 Achievement Unlocked: ${definition.name}!`, 'success');
    console.log(`Achievement unlocked: ${id}`, achievements[id]);
    triggerConfettiEffect(80); // Achievement confetti!
    return true; // Indicate that an achievement was unlocked
}

// --- Excuse Generator ---
function showExcuseModal() {
    generateNewExcuse(); // Populate with an initial excuse
    showModal('excuse-modal');
}

function generateNewExcuse() {
    const randomIndex = Math.floor(Math.random() * RANDOM_EXCUSES.length);
    excuseTextEl.textContent = RANDOM_EXCUSES[randomIndex];
    copyConfirmationEl.classList.add('hidden'); // Hide copy confirmation
}

function copyExcuse() {
    const textToCopy = excuseTextEl.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        copyConfirmationEl.classList.remove('hidden');
        console.log('Excuse copied to clipboard');
        setTimeout(() => copyConfirmationEl.classList.add('hidden'), 2000); // Hide after 2s
    }).catch(err => {
        console.error('Failed to copy excuse: ', err);
        alert('Failed to copy text.'); // Fallback for browsers without clipboard API access
    });
}

// --- Monthly Report ---
function generateMonthlyReport() {
    const now = new Date();
    // Get the first day of the *previous* month
    const reportMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    // Get the last day of the *previous* month
    const reportMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

     // Get the first day of the month *before* the previous one
     const prevPrevMonthStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
     const prevPrevMonthEnd = new Date(now.getFullYear(), now.getMonth() -1 , 0);


    const reportMonthStr = reportMonthStart.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    console.log(`Generating report for ${reportMonthStr}`);

    let reportData = aggregateDataForPeriod(reportMonthStart, reportMonthEnd);
    let prevMonthData = aggregateDataForPeriod(prevPrevMonthStart, prevPrevMonthEnd);

    // Calculate Improvement Percentage
    let improvementPercentage = null;
    if (prevMonthData.totalMismatches > 0) {
        improvementPercentage = ((prevMonthData.totalMismatches - reportData.totalMismatches) / prevMonthData.totalMismatches) * 100;
    } else if (reportData.totalMismatches === 0) {
        improvementPercentage = 100; // Infinite improvement if previous was 0 and current is 0
    } else {
        improvementPercentage = -Infinity; // Worsened from 0
    }


    // Find most common mismatch/behavior
    const mostCommonMismatch = findMostCommon(reportData.mismatchCounts);
    const mostCommonBehavior = findMostCommon(reportData.behaviorCounts);

    // Generate Personalized Love Note
    let loveNote = `My dearest Allison, reflecting on ${reportMonthStr}... `;
    if (reportData.totalMismatches === 0) {
        loveNote += "Wow! A perfect month! You're clearly rubbing off on me in the best way. ❤️";
    } else if (improvementPercentage !== null && improvementPercentage > 20) {
        loveNote += `I'm really trying! Seeing a ${improvementPercentage.toFixed(0)}% reduction in mishaps makes me happy. Thanks for your patience. 😊`;
    } else if (reportData.totalGoodBehaviors > reportData.totalMismatches) {
        loveNote += `More good deeds than mishaps! That's progress I'm proud of. Thanks for inspiring me. ✨`;
    } else if (mostCommonMismatch.name && reportData.totalMismatches > 5) {
        loveNote += `Okay, I see the "${mostCommonMismatch.name}" thing is a recurring theme... I'll focus on that! 😉 Thanks for putting up with me.`;
    } else {
        loveNote += "Every day with you is special, mishaps and all. Let's keep making wonderful memories. Love you always! 💕";
    }

    // Build HTML Report
    let reportHTML = `<h3>Report for ${reportMonthStr}</h3>`;
    reportHTML += `<p><strong>Total Mismatches:</strong> ${reportData.totalMismatches}</p>`;
    reportHTML += `<p><strong>Total Good Behaviors:</strong> ${reportData.totalGoodBehaviors}</p>`;
    reportHTML += `<hr>`;
    reportHTML += `<p><strong>Comparison to Previous Month:</strong></p>`;
    if (improvementPercentage === null) {
         reportHTML += `<p>Not enough data for comparison.</p>`;
    } else if (improvementPercentage === -Infinity) {
         reportHTML += `<p>⚠️ Increased mismatches from 0 last month.</p>`;
    } else if (improvementPercentage < 0) {
         reportHTML += `<p>⚠️ ${Math.abs(improvementPercentage).toFixed(0)}% more mismatches than last month.</p>`;
    } else {
         reportHTML += `<p>✅ ${improvementPercentage.toFixed(0)}% fewer mismatches than last month! Great job!</p>`;
    }
     reportHTML += `<hr>`;
    reportHTML += `<p><strong>Most Common Mismatch:</strong> ${mostCommonMismatch.name ? `${mostCommonMismatch.name} (${mostCommonMismatch.count} times)` : 'None or Tied'}</p>`;
    reportHTML += `<p><strong>Most Common Good Behavior:</strong> ${mostCommonBehavior.name ? `${mostCommonBehavior.name} (${mostCommonBehavior.count} times)` : 'None or Tied'}</p>`;
     reportHTML += `<hr>`;
     reportHTML += `<h4>💖 A Note For You 💖</h4>`;
     reportHTML += `<p><em>${loveNote}</em></p>`;

    reportContentEl.innerHTML = reportHTML;
    showModal('report-modal');
}

function aggregateDataForPeriod(startDate, endDate) {
    let data = {
        totalMismatches: 0,
        totalGoodBehaviors: 0,
        mismatchCounts: {}, // { name: count }
        behaviorCounts: {}, // { name: count }
    };

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    // Iterate through counters history
    Object.entries(counters).forEach(([name, counter]) => {
        if (!counter.history) return;
        Object.entries(counter.history).forEach(([dateStr, count]) => {
            if (dateStr >= startStr && dateStr <= endStr) {
                data.totalMismatches += count;
                data.mismatchCounts[name] = (data.mismatchCounts[name] || 0) + count;
            }
        });
    });

    // Iterate through behaviors history
    Object.entries(goodBehaviors).forEach(([name, behavior]) => {
         if (!behavior.history) return;
        Object.entries(behavior.history).forEach(([dateStr, count]) => {
            if (dateStr >= startStr && dateStr <= endStr) {
                data.totalGoodBehaviors += count;
                data.behaviorCounts[name] = (data.behaviorCounts[name] || 0) + count;
            }
        });
    });

    return data;
}

function findMostCommon(counts) {
    let maxCount = 0;
    let mostCommonName = null;
    let tie = false;

    Object.entries(counts).forEach(([name, count]) => {
        if (count > maxCount) {
            maxCount = count;
            mostCommonName = name;
            tie = false;
        } else if (count === maxCount && maxCount > 0) {
            tie = true;
        }
    });

    return { name: tie ? null : mostCommonName, count: maxCount };
}

function printReport() {
    const reportHTML = reportContentEl.innerHTML;
    const reportTitle = reportContentEl.querySelector('h3')?.textContent || "Monthly Report";
    const printWindow = window.open('', '_blank', 'height=600,width=800');
    printWindow.document.write(`<html><head><title>${reportTitle}</title>`);
    // Optional: Add basic print styles
    printWindow.document.write(`
        <style>
            body { font-family: sans-serif; line-height: 1.4; }
            h3, h4 { color: #ff69b4; } /* Pink */
            hr { border: 0; border-top: 1px solid #ccc; }
            strong { color: #333; }
            em { font-style: italic; color: #555; }
        </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write(reportHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close(); // Necessary for some browsers
    printWindow.focus(); // Necessary for some browsers
    // Delay print command slightly to ensure content is rendered
    setTimeout(() => { printWindow.print(); }, 500);
    // printWindow.print(); // Use Timeout version if print dialog appears blank
}


// --- Consequences ---
function populateConsequenceOptions() {
    consequenceOptionsEl.innerHTML = '<option value="">-- Select Predefined --</option>';
    CONSEQUENCE_OPTIONS.forEach(option => {
        const optElement = document.createElement('option');
        optElement.value = option;
        optElement.textContent = option;
        consequenceOptionsEl.appendChild(optElement);
    });
     // Add listener for select change to update input
     consequenceOptionsEl.addEventListener('change', (e) => {
        if(e.target.value) {
             customConsequenceInput.value = e.target.value;
        }
     });
}

function showCustomizeConsequenceModal(mismatchName) {
    if (!counters[mismatchName]) return;

    customConsequenceMismatchNameEl.textContent = mismatchName;
    const currentConsequence = counters[mismatchName].customConsequence || '';
    customConsequenceInput.value = currentConsequence;

    // Reset select and try to match current consequence
    consequenceOptionsEl.value = "";
    const matchingOption = Array.from(consequenceOptionsEl.options).find(opt => opt.value === currentConsequence);
    if (matchingOption) {
        consequenceOptionsEl.value = currentConsequence;
    }

    // Set up save button listener specifically for this mismatch
    saveConsequenceButton.onclick = () => saveCustomConsequence(mismatchName); // Use onclick to easily reassign

    showModal('customize-consequence-modal');
}

function saveCustomConsequence(mismatchName) {
    if (!counters[mismatchName]) return;

    const newConsequence = customConsequenceInput.value.trim();
    counters[mismatchName].customConsequence = newConsequence;
    saveData();
    renderMismatches(); // Re-render to show updated consequence if threshold is met
    hideModal('customize-consequence-modal');
    showToast(`Consequence for "${mismatchName}" updated.`, 'info');
}

function getConsequence(mismatchName) {
    const counter = counters[mismatchName];
    if (!counter) return "Error";

    if (counter.customConsequence) {
        return counter.customConsequence;
    }

    // Fallback to a default based on threshold or name?
    // Simple default for now:
    const defaultIndex = Math.abs(hashCode(mismatchName)) % CONSEQUENCE_OPTIONS.length; // Pseudo-random based on name
    return CONSEQUENCE_OPTIONS[defaultIndex] || "Do something nice!";
}

function showConsequenceAlert(mismatchName) {
    if (!counters[mismatchName]) return;
    consequenceMismatchNameEl.textContent = `Threshold reached for: "${mismatchName}" (${counters[mismatchName].count}/${counters[mismatchName].threshold})`;
    consequenceTextEl.textContent = getConsequence(mismatchName);
    showModal('consequence-modal');
}


// --- Undo System ---
function recordAction(type, itemType, data) {
     // Clear any pending undo timeout
     clearTimeout(undoTimeout);
     hideUndo(); // Hide existing undo button immediately

    const action = {
        type: type, // 'add', 'delete', 'increment', 'forgive'
        itemType: itemType, // 'counter', 'behavior'
        data: data, // { name, oldData (for delete/increment/forgive), data (for add) }
        timestamp: Date.now()
    };
    actionHistory.push(action);
    if (actionHistory.length > 10) {
        actionHistory.shift(); // Keep only last 10 actions
    }
    console.log("Action recorded:", action);
    showUndo();
}

function showUndo() {
    undoArea.classList.remove('hidden');
    let secondsLeft = 5;
    undoTimerEl.textContent = ` (${secondsLeft}s)`;

    undoTimeout = setInterval(() => {
        secondsLeft--;
        undoTimerEl.textContent = ` (${secondsLeft}s)`;
        if (secondsLeft <= 0) {
            hideUndo();
        }
    }, 1000);
}

function hideUndo() {
    clearInterval(undoTimeout);
    undoArea.classList.add('hidden');
}

function undoLastAction() {
    hideUndo(); // Hide button immediately
    if (actionHistory.length === 0) {
        console.log("No actions to undo.");
        return;
    }

    const lastAction = actionHistory.pop();
    console.log("Undoing action:", lastAction);

    try {
        switch (lastAction.type) {
            case 'add':
                // Undo add = delete
                if (lastAction.itemType === 'counter') {
                    delete counters[lastAction.data.name];
                } else if (lastAction.itemType === 'behavior') {
                    delete goodBehaviors[lastAction.data.name];
                }
                break;
            case 'delete':
                 // Undo delete = re-add using oldData
                 if (lastAction.itemType === 'counter') {
                    counters[lastAction.data.name] = JSON.parse(JSON.stringify(lastAction.data.oldData)); // Restore deep copy
                 } else if (lastAction.itemType === 'behavior') {
                    goodBehaviors[lastAction.data.name] = JSON.parse(JSON.stringify(lastAction.data.oldData));
                 }
                break;
            case 'increment':
                // Undo increment = restore oldData, specifically decrement count & revert history/lastIncrement
                 if (lastAction.itemType === 'counter') {
                     if(counters[lastAction.data.name]) { // Ensure counter still exists
                        // Restore previous state
                        counters[lastAction.data.name] = JSON.parse(JSON.stringify(lastAction.data.oldData));
                         // Also need to update weekly stats by decrementing
                         const incrementDate = new Date(lastAction.data.oldData.lastIncrement || Date.now()); // Approx date if null
                         updateWeeklyStatsOnDecrement('mismatch', lastAction.data.name, incrementDate.toISOString().split('T')[0]);
                    }
                 } else if (lastAction.itemType === 'behavior') {
                     if (goodBehaviors[lastAction.data.name]) {
                         goodBehaviors[lastAction.data.name] = JSON.parse(JSON.stringify(lastAction.data.oldData));
                          const incrementDate = new Date(lastAction.data.oldData.lastIncrement || Date.now());
                          updateWeeklyStatsOnDecrement('goodBehavior', lastAction.data.name, incrementDate.toISOString().split('T')[0]);
                    }
                 }
                break;
            case 'forgive':
                 // Undo forgive = restore oldData (count, lastReset)
                 if (lastAction.itemType === 'counter' && counters[lastAction.data.name]) {
                    counters[lastAction.data.name] = JSON.parse(JSON.stringify(lastAction.data.oldData));
                 }
                 // Forgive doesn't affect weekly counts directly, so no stats update needed here
                break;
            default:
                console.error("Unknown action type to undo:", lastAction.type);
                return; // Don't save if unknown action
        }

        saveData();
        renderAll(); // Re-render everything to reflect the undone state
        showToast("Last action undone.", "info");

    } catch (error) {
        console.error("Error during undo:", error);
        showToast("Failed to undo last action.", "warning");
        // Attempt to restore action history if undo failed? Could be risky.
        // actionHistory.push(lastAction); // Push it back if needed
    }

}


// --- Love Messages ---
function startLoveMessages() {
    if (loveMessageInterval) clearInterval(loveMessageInterval);
    showRandomLoveMessage(); // Show one immediately
    loveMessageInterval = setInterval(showRandomLoveMessage, 30000); // Change every 30 seconds
}

function showRandomLoveMessage() {
     if (!appUnlocked) return;
    const randomIndex = Math.floor(Math.random() * LOVE_MESSAGES.length);
    loveMessageArea.innerHTML = `<p>${LOVE_MESSAGES[randomIndex]}</p>`;
    loveMessageArea.style.animation = 'none'; // Reset animation
    void loveMessageArea.offsetWidth; // Trigger reflow
    loveMessageArea.style.animation = 'fadeIn 0.5s ease-in-out'; // Apply fade-in animation
}

// --- Tabs ---
function handleTabClick(event) {
    if (event.target.classList.contains('tab-button')) {
        const targetTab = event.target.dataset.tab;
        activateTab(targetTab);
    }
}

function activateTab(tabId) {
    // Deactivate all buttons and panes
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

    // Activate the selected button and pane
    const activeButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    const activePane = document.getElementById(`${tabId}-tab`);

    if (activeButton && activePane) {
        activeButton.classList.add('active');
        activePane.classList.add('active');
        console.log(`Activated tab: ${tabId}`);

        // If charts tab is activated, render charts
        if (tabId === 'charts') {
            renderCharts();
        }
    } else {
        console.error(`Tab or pane not found for id: ${tabId}`);
    }
}


// --- Modals ---
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
     // Clear confirmation button listener to prevent accidental multiple calls
    if (modalId === 'confirmation-modal') {
       confirmYesButton.onclick = null;
    }
}

function showConfirmation(message, onConfirm) {
    confirmationMessageEl.textContent = message;
    confirmYesButton.onclick = onConfirm; // Assign the callback directly
    showModal('confirmation-modal');
}

// --- Toasts ---
function showToast(message, type = 'info') { // type: 'success', 'info', 'warning'
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Remove toast after animation finishes (5s total: 0.5s slide in + 4.5s wait + 0.5s fade out)
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// --- Confetti ---
function triggerConfettiEffect(count = 50, type = 'normal') {
     // Prevent excessive confetti
     if (document.querySelectorAll('.confetti').length > 300) return;

    for (let i = 0; i < count; i++) {
        createConfettiParticle(type);
    }
}

function createConfettiParticle(type) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';

    const colors = {
        normal: [/*'#ff69b4', '#ffb6c1',*/ '#ffffff', '#f0f0f0', '#ffdeea'], // Pink, white, pastel
        success: ['#4caf50', '#81c784', '#ffffff', 'gold'], // Green, white, gold
        warning: ['#ff4d4d', '#ff8a80', '#ffffff', 'orange'], // Red, orange, white
         sad: ['#aaaaaa', '#cccccc', '#bbbbbb'] // Shades of gray for mistakes
    };

    const colorSet = colors[type] || colors['normal'];
    confetti.style.backgroundColor = colorSet[Math.floor(Math.random() * colorSet.length)];

    // Randomize position, size, and animation duration/delay
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.width = Math.random() * 8 + 4 + 'px'; // 4px to 12px wide
    confetti.style.height = confetti.style.width;
     confetti.style.opacity = Math.random() * 0.5 + 0.5; // 0.5 to 1.0 opacity
    confetti.style.animationDuration = Math.random() * 2 + 2 + 's'; // 2s to 4s fall time
    confetti.style.animationDelay = Math.random() * 0.5 + 's'; // Slight delay variation

     // Apply different shapes slightly
     if (Math.random() > 0.7) {
         confetti.style.height = (parseInt(confetti.style.width) * 1.5) + 'px'; // rectangle
         confetti.style.borderRadius = '0';
     } else {
         confetti.style.borderRadius = '50%'; // circle
     }


    document.body.appendChild(confetti);

    // Remove the element after animation finishes to clean up DOM
    confetti.addEventListener('animationend', () => {
        confetti.remove();
    });
}


// --- Utility Functions ---
function getIconForKeyword(name) {
    if (!name) return ICONS.default;
    const lowerCaseName = name.toLowerCase();
    // Find the first matching keyword in the name
    for (const keyword in ICONS) {
        if (keyword !== 'default' && lowerCaseName.includes(keyword)) {
            return ICONS[keyword];
        }
    }
    return ICONS.default;
}

function formatDate(dateString, includeTime = true) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
         if (isNaN(date)) return 'Invalid Date'; // Check if date is valid

        const options = {
            year: 'numeric', month: 'short', day: 'numeric',
            // hour: '2-digit', minute: '2-digit', hour12: true
        };
         if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
            options.hour12 = true;
         }
        return date.toLocaleDateString('en-US', options);
    } catch (e) {
        return 'Invalid Date';
    }
}

function getTodayDateString() {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
}

// Simple hash function for pseudo-random default consequence
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

console.log("Script loaded. Waiting for DOMContentLoaded.");