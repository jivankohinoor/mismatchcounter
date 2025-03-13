// Birthday and Special Features Module
const BirthdayManager = {
    // Check if it's birthday or after birthday
    isBirthdayOrAfter: function(config) {
        const now = new Date().getTime();
        return now >= new Date(config.recipient.birthdayDate).getTime();
    },
    
    // Update countdown timer
    updateCountdown: function(config) {
        const now = new Date().getTime();
        const distance = new Date(config.recipient.birthdayDate).getTime() - now;
        
        // If it's already birthday or past it
        if (distance <= 0) {
            this.showBirthdayCelebration();
            return;
        }
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display countdown
        document.getElementById("countdown").innerHTML = 
            days + "d " + hours + "h " + minutes + "m " + seconds + "s";
    },
    
    // Show birthday celebration
    showBirthdayCelebration: function() {
        // Hide preloader countdown
        document.getElementById("preloader").style.opacity = "0";
        
        // Show birthday message
        setTimeout(() => {
            document.getElementById("preloader").style.display = "none";
            document.getElementById("birthday-message").style.display = "block";
            this.createConfetti();
        }, 1000);
    },
    
    // Create confetti animation
    createConfetti: function() {
        // Remove any existing confetti first
        document.querySelectorAll('.confetti').forEach(el => el.remove());
        
        const confettiCount = 200;
        const colors = ['#ffd700', '#ff69b4', '#87CEEB', '#90EE90', '#FF6347', '#9370DB'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Set a non-infinite animation with random duration
            const duration = Math.random() * 3 + 2;
            confetti.style.animation = `confetti-fall ${duration}s linear`;
            
            // Auto-remove confetti after animation completes
            confetti.addEventListener('animationend', function() {
                this.remove();
            });
            
            document.body.appendChild(confetti);
        }
    },
    
    // Check birthday status
    checkBirthdayStatus: function(config) {
        this.updateCountdown(config);
        const countdownInterval = setInterval(() => this.updateCountdown(config), 1000);
        
        // If it's already birthday or after
        if (this.isBirthdayOrAfter(config)) {
            this.showBirthdayCelebration();
            clearInterval(countdownInterval);
        }
    }
}; 