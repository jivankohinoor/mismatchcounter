# Allison's Mismatch Counter
## Application Specification Document

*March 23, 2025*

---

## 1. Introduction

### 1.1 Purpose
The Mismatch Counter is a personalized web application created as a birthday gift for Allison. It serves as a humorous and loving way to track household "mismatches" (minor mistakes or oversights) made by her husband, while also celebrating good behaviors, fostering positive habits, and strengthening their relationship through playful interaction.

### 1.2 Scope
This application provides features for tracking various types of mismatches, recording good behaviors, visualizing data through interactive charts, setting thresholds for consequences, generating random excuses, celebrating achievements, and creating personalized reports.

### 1.3 Target User
The primary user is Allison, with her husband as a secondary user. The application is designed to be intuitive and user-friendly, requiring no technical knowledge to operate.

---

## 2. Features Overview

### 2.1 Core Features
- **Mismatch Tracking**: Count, categorize, and monitor various types of household mistakes
- **Good Behavior Tracking**: Record and celebrate positive actions
- **Data Visualization**: Visual representation of data through charts
- **Threshold Management**: Set limits for mismatches with customizable consequences
- **Excuse Generator**: Create humorous excuses for mismatches
- **Achievements System**: Unlock badges and milestones for progress
- **Monthly Reports**: Generate personalized summaries with love notes
- **Weekly Statistics**: Track progress on a weekly basis
- **Data Persistence**: Save all data locally to prevent loss

### 2.2 Special Features
- **Birthday Countdown**: Access restriction until Allison's birthday
- **Secret Unlock Code**: Option to unlock early with a password
- **Birthday Celebration**: Special birthday message with animation
- **Randomized Love Messages**: Rotating display of sweet messages
- **Confetti Animations**: Visual celebrations for achievements

---

## 3. User Interface Design

### A. General Layout
- **Color Scheme**: Pink (#ff69b4), white, and pastels
- **Font**: Comic Sans MS (primary), with fallbacks to cursive and sans-serif
- **Container**: White background with rounded corners and subtle shadow
- **Header**: Pink title with cat icon and subtitle
- **Responsive Design**: Adapts to different screen sizes

### B. Navigation
- **Tab System**: Four main tabs (Mismatches, Good Behavior, Charts, Achievements)
- **Modal Windows**: For confirmations, excuse generator, and monthly reports
- **Toast Notifications**: For achievements and milestones

### C. Main Application Screens

#### Birthday Countdown (Initial View)
- Gift box animation with countdown timer
- Background in soft pink
- Secret code input field with unlock button

#### Birthday Message (Post-countdown)
- "Happy Birthday" message with personalized text
- Button to access main application

#### Main Application
- **Love Message Area**: Displays rotating sweet messages
- **Tab Navigation**: Horizontal tabs for different sections
- **Weekly Statistics**: Fixed section showing weekly metrics
- **Footer**: Reset button and copyright message

---

## 4. Detailed Functionality

### 4.1 Mismatch Counters

#### Components
- Counter name with icon
- Current count display
- Days without mistake tracker
- Threshold warning badge (if applicable)
- Increment button
- Delete button
- Forgive button (if count > 0)
- Consequence alert (if threshold exceeded)

#### Actions
- **Add New Counter**: Create a counter with name, threshold, and auto-assigned icon
- **Increment Counter**: Add one to the count with confirmation dialog
- **Forgive/Reset**: Reset counter to zero with confetti animation
- **Delete Counter**: Remove a counter with confirmation
- **Sort Counters**: Order by name, count (high/low), or recent use
- **Set Consequences**: Choose specific consequence for threshold events
- **Customize Thresholds**: Set at 0 (no limit), 3, 5, or 10

### 4.2 Good Behavior Tracking

#### Components
- Behavior name with icon
- Current count display
- Last performed date tracker
- Milestone badge (if applicable)
- Achievement badge (if goal reached)
- Increment button
- Delete button

#### Actions
- **Add New Behavior**: Create with name, milestone goal, and auto-assigned icon
- **Record Behavior**: Increment without confirmation
- **Delete Behavior**: Remove a behavior with confirmation
- **Sort Behaviors**: Order by name, count (high/low), or recent use
- **Set Milestones**: Define goals at 5, 10, 25, or 50 occurrences

### 4.3 Data Visualization

#### Available Charts
- **Mismatch Distribution**: Bar chart showing count by type
- **Weekly Trend**: Line chart tracking mismatches vs. good behaviors
- **Good vs. Bad Balance**: Pie chart comparing overall counts

#### Features
- Interactive chart selection
- Responsive sizing
- Color-coded data representation
- Tooltips with detailed information

### 4.4 Achievements System

#### Achievement Types
- First Forgiveness: First time forgiving a mismatch
- Perfect Week: Week with no mismatches
- Improvement Path: Reduced mismatches for 3 consecutive weeks
- Perfect Balance: Equal good and bad actions in a week
- Milestone achievements: For reaching behavior goals (5, 10, 25)
- Dishwasher Master: No dishwasher incidents for 2 weeks
- Cat Hero: Perfect cat care for a month

#### Display
- Achievement icon and name
- Description of how it was earned
- Date unlocked
- Toast notification when new achievements are earned

### 4.5 Excuse Generator

#### Functionality
- Button to open excuse modal
- Random selection from 20 pre-defined excuses
- Option to generate a new excuse
- Copy to clipboard function

### 4.6 Monthly Report

#### Components
- Monthly statistics overview
- Comparison to previous month
- Most common mismatch and good behavior
- Improvement percentage calculation
- Personalized love note based on performance

#### Features
- Contextual message generation
- Visual formatting with icons
- Printable/shareable format

### 4.7 Undo System

#### Features
- Undo button appears for 5 seconds after actions
- Records last 10 actions
- Supports undo for increments, resets, and deletions
- Automatically updates all relevant statistics and displays

---

## 5. Data Structure

### 5.1 Counters Object
```javascript
{
  "counterName": {
    count: number,
    threshold: number,
    lastIncrement: date,
    lastReset: date,
    history: {
      "YYYY-MM-DD": count
    },
    icon: string,
    customConsequence: string
  }
}
```

### 5.2 Good Behaviors Object
```javascript
{
  "behaviorName": {
    count: number,
    milestone: number,
    lastIncrement: date,
    history: {
      "YYYY-MM-DD": count
    },
    icon: string
  }
}
```

### 5.3 Weekly Stats Object
```javascript
{
  startDate: "YYYY-MM-DD",
  counts: {
    "YYYY-MM-DD": {
      "counterName": count
    }
  },
  goodBehaviorCounts: {
    "YYYY-MM-DD": {
      "behaviorName": count
    }
  },
  perfectDays: number
}
```

### 5.4 Achievements Object
```javascript
{
  "achievementId": {
    date: "YYYY-MM-DD",
    details: string
  }
}
```

### 5.5 Default Data

#### Default Counters
1. Left the dishwasher door open (threshold: 5, icon: 🚪)
2. Put the wrong knives in the dishwasher (threshold: 3, icon: 🍴)
3. Didn't clean my mess before going to bed (threshold: 1, icon: 🧹)
4. Didn't empty the cat litter box (threshold: 2, icon: 🐱)
5. Didn't take out the trash (threshold: 1, icon: 🗑️)
6. Didn't put the toilet seat down (threshold: 10, icon: 🚽)
7. Didn't put the vacuum cleaner away (threshold: 5, icon: 🧹)
8. Yelled at you for no reason (threshold: 3, icon: 📢)
9. Got mad at you for no reason (threshold: 3, icon: 😡)
10. Talked about AI again ... (threshold: 100, icon: 🤖)

#### Default Good Behaviors
1. Made the bed without being asked (milestone: 10, icon: 🛏️)
2. Cleaned the kitchen spotless (milestone: 5, icon: ✨)
3. Surprised you with a gift (milestone: 5, icon: 🎁)
4. Took care of all cat needs (milestone: 10, icon: 🐱)
5. Planned a special date (milestone: 5, icon: ❤️)

---

## 6. Technical Implementation

### 6.1 Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Charts**: Chart.js library
- **Data Storage**: Browser localStorage
- **Animation**: CSS animations and JavaScript

### 6.2 Browser Compatibility
- All modern browsers (Chrome, Firefox, Safari, Edge)
- Minimum recommended version: Chrome 80+, Firefox 72+, Safari 13+, Edge 80+

### 6.3 Performance Considerations
- Optimized animations for mobile devices
- Efficient data storage with minimal footprint
- Responsive design for various screen sizes

### 6.4 Security
- All data stored locally on user's device
- No external API calls or data transfer
- Secret unlock code for restricted access before birthday

---

## 7. Future Enhancement Possibilities

### 7.1 Potential Features
- **Shared Access**: Allow synchronization between multiple devices
- **Photo Gallery**: Add ability to upload photos for significant events
- **Custom Categories**: User-defined grouping of counters and behaviors
- **Progressive Goals**: Automatically increasing thresholds over time
- **Export Data**: Download reports as PDFs or share via email
- **Reminder System**: Notifications for recurring tasks

### 7.2 Technical Upgrades
- **Backend Integration**: Server-side storage for data persistence across devices
- **User Accounts**: Login capability for multiple users
- **Mobile App**: Native application for iOS and Android
- **Voice Commands**: Integration with virtual assistants

---

## 8. Implementation Guidelines

### 8.1 Installation
- No installation required; runs in web browser
- To use locally, download all files and open index.html
- For production, host on any web server

### 8.2 Data Management
- Data automatically saved to localStorage
- Clear browser cache to reset all data
- No backup or export functionality in current version

### 8.3 Customization
- Edit default counters and behaviors in the JavaScript code
- Modify visual styles through CSS
- Update love messages and excuses in the arrays provided

---

## 9. Appendix

### 9.1 Icon Mapping
A comprehensive mapping of keywords to icons is implemented to automatically assign appropriate icons to new counters and behaviors based on their names.

### 9.2 Consequence Options
A list of 15 predefined consequences ranging from "Bring home flowers" to "Extra long foot rubs" is available for selection.

### 9.3 Love Messages
21 rotating love messages are included to display affection and humor.

### 9.4 Random Excuses
20 humorous excuses are available through the excuse generator.

---

*Prepared for Allison's Birthday - March 5, 2025*