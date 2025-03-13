// UI Management Module
const MismatchUI = {
    // Display all counters
    displayCounters: function() {
        const container = document.getElementById('counters-container');
        container.innerHTML = '';
        
        Object.keys(MismatchData.counters).forEach((counterName, index) => {
            const counter = MismatchData.counters[counterName];
            const daysWithoutMistake = counter.lastIncrement ? 
                MismatchData.daysBetween(counter.lastIncrement, MismatchData.getTodayDateString()) : 
                MismatchData.daysBetween(counter.lastReset, MismatchData.getTodayDateString());
            
            const counterDiv = document.createElement('div');
            counterDiv.className = 'counter';
            counterDiv.setAttribute('role', 'listitem');
            counterDiv.setAttribute('data-counter-name', counterName);
            counterDiv.setAttribute('aria-label', `Mismatch counter ${index + 1}: ${counterName}`);
            
            // Add threshold warning badge if applicable
            if (counter.threshold > 0) {
                const thresholdDiv = document.createElement('div');
                thresholdDiv.className = counter.count >= counter.threshold ? 
                    'threshold-warning threshold-exceeded' : 'threshold-warning';
                thresholdDiv.textContent = `Limit: ${counter.threshold}`;
                counterDiv.appendChild(thresholdDiv);
            }
            
            // Main counter content
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'counter-details';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'counter-name';
            nameSpan.textContent = counterName;
            
            const statsSpan = document.createElement('span');
            statsSpan.className = 'counter-stats';
            statsSpan.textContent = `${daysWithoutMistake} ${daysWithoutMistake === 1 ? 'day' : 'days'} without mistake`;
            
            detailsDiv.appendChild(nameSpan);
            detailsDiv.appendChild(statsSpan);
            
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'counter-buttons';
            
            const countSpan = document.createElement('span');
            countSpan.className = 'count';
            countSpan.textContent = counter.count;
            
            const incrementBtn = document.createElement('button');
            incrementBtn.className = 'increment-btn';
            incrementBtn.textContent = '+1';
            incrementBtn.setAttribute('data-counter', counterName);
            incrementBtn.setAttribute('aria-label', `Increment ${counterName}`);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '🗑️';
            deleteBtn.setAttribute('data-counter', counterName);
            deleteBtn.setAttribute('aria-label', `Delete ${counterName} counter`);
            
            buttonsDiv.appendChild(countSpan);
            buttonsDiv.appendChild(incrementBtn);
            buttonsDiv.appendChild(deleteBtn);
            
            // Add reset/forgive button if count > 0
            if (counter.count > 0) {
                const resetBtn = document.createElement('button');
                resetBtn.className = 'forgive-btn';
                resetBtn.textContent = 'Forgive';
                resetBtn.setAttribute('data-counter', counterName);
                resetBtn.setAttribute('aria-label', `Forgive ${counterName}`);
                buttonsDiv.appendChild(resetBtn);
            }
            
            counterDiv.appendChild(detailsDiv);
            counterDiv.appendChild(buttonsDiv);
            
            // Add consequence alert if threshold is exceeded
            if (counter.threshold > 0 && counter.count >= counter.threshold) {
                const consequenceDiv = document.createElement('div');
                consequenceDiv.className = 'consequence-alert';
                consequenceDiv.style.display = 'block';
                
                const consequenceHeader = document.createElement('h3');
                consequenceHeader.textContent = 'Consequence Triggered!';
                
                const consequenceText = document.createElement('p');
                const randomConsequence = AppConfig.messages.consequences[
                    Math.floor(Math.random() * AppConfig.messages.consequences.length)
                ];
                consequenceText.textContent = randomConsequence;
                
                consequenceDiv.appendChild(consequenceHeader);
                consequenceDiv.appendChild(consequenceText);
                
                counterDiv.appendChild(consequenceDiv);
            }
            
            container.appendChild(counterDiv);
        });
        
        // Update weekly statistics
        this.updateWeeklyStats();
        
        // Update charts
        this.updateCharts();
    },
    
    // Update a single counter without rebuilding the entire list
    updateCounter: function(counterName) {
        const counterElement = document.querySelector(`[data-counter-name="${counterName}"]`);
        if (!counterElement) return;
        
        const counter = MismatchData.counters[counterName];
        const countElement = counterElement.querySelector('.count');
        countElement.textContent = counter.count;
        
        // Update days without mistake
        const daysWithoutMistake = counter.lastIncrement ? 
            MismatchData.daysBetween(counter.lastIncrement, MismatchData.getTodayDateString()) : 
            MismatchData.daysBetween(counter.lastReset, MismatchData.getTodayDateString());
        
        const statsElement = counterElement.querySelector('.counter-stats');
        statsElement.textContent = `${daysWithoutMistake} ${daysWithoutMistake === 1 ? 'day' : 'days'} without mistake`;
        
        // Handle threshold exceeded status
        const thresholdElement = counterElement.querySelector('.threshold-warning');
        if (thresholdElement) {
            thresholdElement.className = counter.count >= counter.threshold ? 
                'threshold-warning threshold-exceeded' : 'threshold-warning';
        }
        
        // Add/remove forgive button as needed
        const buttonsDiv = counterElement.querySelector('.counter-buttons');
        let forgiveBtn = counterElement.querySelector('.forgive-btn');
        
        if (counter.count > 0 && !forgiveBtn) {
            forgiveBtn = document.createElement('button');
            forgiveBtn.className = 'forgive-btn';
            forgiveBtn.textContent = 'Forgive';
            forgiveBtn.setAttribute('data-counter', counterName);
            forgiveBtn.setAttribute('aria-label', `Forgive ${counterName}`);
            forgiveBtn.addEventListener('click', function() {
                MismatchEvents.resetCounter(counterName);
            });
            buttonsDiv.appendChild(forgiveBtn);
        } else if (counter.count === 0 && forgiveBtn) {
            forgiveBtn.remove();
        }
        
        // Update/add consequence alert if needed
        let consequenceAlert = counterElement.querySelector('.consequence-alert');
        
        if (counter.threshold > 0 && counter.count >= counter.threshold) {
            if (!consequenceAlert) {
                consequenceAlert = document.createElement('div');
                consequenceAlert.className = 'consequence-alert';
                
                const consequenceHeader = document.createElement('h3');
                consequenceHeader.textContent = 'Consequence Triggered!';
                
                const consequenceText = document.createElement('p');
                const randomConsequence = AppConfig.messages.consequences[
                    Math.floor(Math.random() * AppConfig.messages.consequences.length)
                ];
                consequenceText.textContent = randomConsequence;
                
                consequenceAlert.appendChild(consequenceHeader);
                consequenceAlert.appendChild(consequenceText);
                
                counterElement.appendChild(consequenceAlert);
            }
            consequenceAlert.style.display = 'block';
        } else if (consequenceAlert) {
            consequenceAlert.style.display = 'none';
        }
        
        // Update weekly stats and charts
        this.updateWeeklyStats();
        this.updateCharts();
    },
    
    // Update weekly statistics
    updateWeeklyStats: function() {
        const stats = MismatchData.getWeeklyStats();
        
        document.getElementById('week-total').textContent = stats.total;
        document.getElementById('week-worst').textContent = stats.worst.name;
        document.getElementById('perfect-days').textContent = stats.perfectDays;
        document.getElementById('average-daily').textContent = stats.averageDaily;
    },
    
    // Create and update charts
    updateCharts: function() {
        // Helper function to draw a simple bar chart
        const drawChart = function(canvasId, chartData, color) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const { labels, data } = chartData;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Set dimensions
            const width = canvas.width;
            const height = canvas.height;
            const padding = 40;
            const chartWidth = width - padding * 2;
            const chartHeight = height - padding * 2;
            
            // Find max value for scaling
            const maxValue = Math.max(...data, 1);
            
            // Draw background
            ctx.fillStyle = '#f9f9f9';
            ctx.fillRect(0, 0, width, height);
            
            // Draw title
            ctx.fillStyle = '#4682b4';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Daily Mismatches', width / 2, 20);
            
            // Draw bars
            const barWidth = chartWidth / data.length * 0.8;
            const barSpacing = chartWidth / data.length * 0.2;
            
            data.forEach((value, index) => {
                const x = padding + index * (barWidth + barSpacing);
                const barHeight = value * (chartHeight / maxValue);
                const y = height - padding - barHeight;
                
                // Draw bar
                ctx.fillStyle = color || '#4682b4';
                ctx.fillRect(x, y, barWidth, barHeight);
                
                // Draw value on top of bar if non-zero
                if (value > 0) {
                    ctx.fillStyle = '#333';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(value, x + barWidth / 2, y - 5);
                }
                
                // Draw label
                ctx.fillStyle = '#666';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(labels[index], x + barWidth / 2, height - padding / 2);
            });
            
            // Draw axes
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 1;
            
            // Y-axis
            ctx.beginPath();
            ctx.moveTo(padding, padding);
            ctx.lineTo(padding, height - padding);
            ctx.stroke();
            
            // X-axis
            ctx.beginPath();
            ctx.moveTo(padding, height - padding);
            ctx.lineTo(width - padding, height - padding);
            ctx.stroke();
        };
        
        // Update week chart
        const weekData = MismatchData.getChartData('week');
        drawChart('week-chart', weekData, '#4682b4');
        
        // Update month chart
        const monthData = MismatchData.getChartData('month');
        drawChart('month-chart', monthData, '#9370db');
        
        // Update all-time chart
        const allData = MismatchData.getChartData('all');
        drawChart('all-chart', allData, '#20b2aa');
    },
    
    // Display a random love message
    displayRandomLoveMessage: function() {
        const messageElement = document.getElementById('randomLoveMessage');
        const oldMessage = messageElement.innerText;
        
        // Set opacity to 0 for fade out
        messageElement.style.opacity = '0';
        
        // After fade out, change the message and fade in
        setTimeout(() => {
            let newMessage = oldMessage;
            // Make sure we don't get the same message twice
            while (newMessage === oldMessage) {
                newMessage = AppConfig.messages.loveMessages[
                    Math.floor(Math.random() * AppConfig.messages.loveMessages.length)
                ];
            }
            messageElement.innerText = newMessage;
            messageElement.style.opacity = '1';
        }, 1000);
    },
    
    // Update the UI with the configuration values
    updateUIFromConfig: function(config) {
        // Update title and metadata
        document.title = `For ${config.recipient.name} 💖`;
        
        // Update header content
        document.getElementById('app-title').innerHTML = 
            `${config.recipient.name}'s Mismatch Counter <span id="app-icon" class="cat-icon">${config.theme.iconEmoji}</span>`;
        
        document.getElementById('app-subtitle').textContent = 
            `A little app to track all the silly things I do, with love from ${config.sender.name}`;
        
        // Update birthday message
        document.getElementById('birthday-title').textContent = config.messages.birthdayTitle;
        document.getElementById('birthday-text').textContent = config.messages.birthdayMessage;
        
        // Update countdown message
        document.getElementById('countdown-text').textContent = config.messages.countdownMessage;
        document.getElementById('countdown-date').textContent = 
            `Please wait until ${new Date(config.recipient.birthdayDate).toLocaleDateString()} to open...`;
        
        // Update footer
        document.getElementById('footer-text').innerHTML = 
            `Made with <span style="color: var(--main-color);">❤️</span> ${config.messages.footerMessage}`;
        
        // Update counter icon
        document.getElementById('counter-icon').textContent = config.theme.iconEmoji;
        
        // Apply theme
        ConfigManager.applyTheme(config.theme);
    },
    
    // Enhance accessibility
    enhanceAccessibility: function() {
        // Add proper ARIA roles
        document.querySelectorAll('.counter').forEach((counter, index) => {
            counter.setAttribute('role', 'region');
            counter.setAttribute('aria-label', `Mismatch counter ${index + 1}`);
        });
        
        // Make buttons more accessible
        document.querySelectorAll('button').forEach(button => {
            if (!button.getAttribute('aria-label')) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });
        
        // Add keyboard navigation for the counter list
        const countersContainer = document.getElementById('counters-container');
        countersContainer.setAttribute('role', 'list');
        countersContainer.tabIndex = 0;
    }
}; 