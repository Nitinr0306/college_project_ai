document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const footprintForm = document.getElementById('footprint-form');
    const resultsSection = document.getElementById('results-section');
    const dailyFootprintEl = document.getElementById('daily-footprint');
    const annualFootprintEl = document.getElementById('annual-footprint');
    const electricityFootprintEl = document.getElementById('electricity-footprint');
    const transportationFootprintEl = document.getElementById('transportation-footprint');
    const dietFootprintEl = document.getElementById('diet-footprint');
    const tipsList = document.getElementById('tips-list');
    
    // Chart element and instance
    const chartCanvas = document.getElementById('footprint-chart');
    let footprintChart = null;
    
    // Diet card selection styling
    const dietOptions = document.querySelectorAll('.diet-option input');
    dietOptions.forEach(option => {
        option.addEventListener('change', function() {
            dietOptions.forEach(opt => {
                const card = opt.nextElementSibling;
                if (opt.checked) {
                    card.classList.add('border-primary-500', 'bg-primary-50');
                } else {
                    card.classList.remove('border-primary-500', 'bg-primary-50');
                }
            });
        });
    });
    
    // Form submission handler
    footprintForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitButton = footprintForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Calculating...';
        submitButton.disabled = true;
        
        // Get form data
        const electricity = parseFloat(document.getElementById('electricity').value) || 0;
        const transportationType = document.getElementById('transportation-type').value;
        const distance = parseFloat(document.getElementById('distance').value) || 0;
        const distanceUnit = document.getElementById('distance-unit').value;
        
        // Get selected diet
        let diet = '';
        dietOptions.forEach(option => {
            if (option.checked) {
                diet = option.value;
            }
        });
        
        // Convert miles to kilometers if needed
        let distanceInKm = distance;
        if (distanceUnit === 'miles') {
            distanceInKm = distance * 1.60934;
        }
        
        // Prepare data for the API
        const formData = {
            electricity: electricity / 30, // Convert monthly to daily
            transportationType: transportationType,
            distance: distanceInKm,
            diet: diet
        };
        
        // Send data to the server
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update the results
                displayResults(data);
                
                // Show the results section
                resultsSection.classList.remove('hidden');
                
                // Scroll to results
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Handle error
                alert('Error calculating footprint: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while calculating your footprint.');
        })
        .finally(() => {
            // Reset button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        });
    });
    
    // Function to display results
    function displayResults(data) {
        // Update result elements
        dailyFootprintEl.textContent = data.totalFootprint;
        annualFootprintEl.textContent = data.annualFootprint;
        
        // Update breakdown
        electricityFootprintEl.textContent = `${data.breakdown.electricity} kg CO2e`;
        transportationFootprintEl.textContent = `${data.breakdown.transportation} kg CO2e`;
        dietFootprintEl.textContent = `${data.breakdown.diet} kg CO2e`;
        
        // Generate and display tips
        generateTips(data.totalFootprint);
        
        // Create or update chart
        createOrUpdateChart(data.breakdown);
        
        // Add animation to the numbers
        animateNumbers();
    }
    
    // Function to generate tips based on footprint size
    function generateTips(footprint) {
        // Clear existing tips
        tipsList.innerHTML = '';
        
        // Get tips based on footprint size
        const tips = getTips(footprint);
        
        // Add tips to the list
        tips.forEach(tip => {
            const li = document.createElement('li');
            li.className = 'flex items-start';
            li.innerHTML = `
                <i class="fas fa-check-circle text-primary-500 mt-1 mr-2"></i>
                <span>${tip}</span>
            `;
            tipsList.appendChild(li);
        });
    }
    
    // Function to get tips based on footprint size
    function getTips(footprint) {
        // General tips for everyone
        const generalTips = [
            "Use LED bulbs which use up to 85% less energy than traditional bulbs",
            "Turn off lights and unplug electronics when not in use",
            "Reduce water usage with shorter showers and fixing leaks",
            "Eat locally grown, seasonal food to reduce transportation emissions",
            "Reduce food waste by planning meals and composting scraps"
        ];
        
        // Additional tips based on footprint size
        if (footprint > 20) {
            return generalTips.concat([
                "Consider renewable energy options for your home",
                "Evaluate home insulation to reduce heating/cooling needs",
                "Look into carbon offset programs for unavoidable emissions",
                "Consider reducing air travel when possible"
            ]);
        } else if (footprint > 10) {
            return generalTips.concat([
                "Try to reduce meat consumption a few days per week",
                "Use public transportation more frequently",
                "Consider carpooling or ride-sharing options"
            ]);
        } else {
            return generalTips.concat([
                "Continue your great sustainability practices",
                "Share your sustainability knowledge with friends and family"
            ]);
        }
    }
    
    // Function to create or update the chart
    function createOrUpdateChart(breakdown) {
        // Prepare data for the chart
        const chartData = {
            labels: ['Electricity', 'Transportation', 'Diet'],
            datasets: [{
                data: [
                    breakdown.electricity,
                    breakdown.transportation,
                    breakdown.diet
                ],
                backgroundColor: [
                    'rgba(255, 205, 86, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(34, 197, 94, 0.6)'
                ],
                borderColor: [
                    'rgb(255, 205, 86)',
                    'rgb(54, 162, 235)',
                    'rgb(34, 197, 94)'
                ],
                borderWidth: 1
            }]
        };
        
        // If chart exists, destroy it
        if (footprintChart) {
            footprintChart.destroy();
        }
        
        // Create new chart
        footprintChart = new Chart(chartCanvas, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} kg CO2e (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Function to animate numbers
    function animateNumbers() {
        const elements = [dailyFootprintEl, annualFootprintEl];
        
        elements.forEach(el => {
            const finalValue = parseFloat(el.textContent);
            
            // Start from 0
            let startValue = 0;
            
            // Calculate the increment per step
            const incrementPerStep = finalValue / 50;
            
            // Set initial value
            el.textContent = '0';
            
            // Animate
            const counter = setInterval(() => {
                startValue += incrementPerStep;
                
                if (startValue >= finalValue) {
                    el.textContent = finalValue;
                    clearInterval(counter);
                } else {
                    el.textContent = Math.round(startValue * 100) / 100;
                }
            }, 20);
        });
    }
});
