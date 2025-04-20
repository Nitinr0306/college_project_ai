document.addEventListener('DOMContentLoaded', function() {
    // Get the calculator form and results elements
    const calculatorForm = document.getElementById('carbon-calculator-form');
    const calculatorResults = document.getElementById('calculator-results');
    const calculatorEmpty = document.getElementById('calculator-empty');
    const calculatorLoader = document.getElementById('calculator-loader');
    const calculatorError = document.getElementById('calculator-error');
    const errorMessage = document.getElementById('error-message');
    
    // Get the result display elements
    const totalResult = document.getElementById('total-result');
    const totalProgress = document.getElementById('total-progress');
    const electricityResult = document.getElementById('electricity-result');
    const transportResult = document.getElementById('transport-result');
    const dietResult = document.getElementById('diet-result');
    
    // Chart for visualization
    let footprintChart = null;
    
    // Handle form submission
    calculatorForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Show loader, hide results and error
        calculatorEmpty.classList.add('hidden');
        calculatorResults.classList.add('hidden');
        calculatorLoader.classList.remove('hidden');
        calculatorError.classList.add('hidden');
        
        // Get form values
        const electricity = parseFloat(document.getElementById('electricity').value) || 0;
        const transportType = document.getElementById('transport_type').value;
        const distance = parseFloat(document.getElementById('distance').value) || 0;
        const diet = document.getElementById('diet').value;
        
        // Validate inputs
        if (!transportType || !diet) {
            showError('Please select both transportation type and diet preference.');
            return;
        }
        
        // Prepare data for API call
        const data = {
            electricity: electricity,
            transport_type: transportType,
            distance: distance,
            diet: diet
        };
        
        // Call the backend API
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                displayResults(data.result);
            } else {
                showError(data.error || 'An unknown error occurred.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Failed to calculate carbon footprint. Please try again.');
        });
    });
    
    // Function to display the calculation results
    function displayResults(result) {
        // Hide loader, show results
        calculatorLoader.classList.add('hidden');
        calculatorResults.classList.remove('hidden');
        
        // Update result text
        totalResult.textContent = `${result.total} kg CO2e`;
        electricityResult.textContent = `${result.electricity} kg CO2e`;
        transportResult.textContent = `${result.transport} kg CO2e`;
        dietResult.textContent = `${result.diet} kg CO2e`;
        
        // Update progress bar (assuming a scale of 0-20 kg CO2e)
        const percentage = Math.min(100, (result.total / 20) * 100);
        totalProgress.style.width = `${percentage}%`;
        
        // Change progress bar color based on footprint size
        if (result.total < 5) {
            totalProgress.classList.remove('bg-yellow-500', 'bg-red-500');
            totalProgress.classList.add('bg-primary');
        } else if (result.total < 10) {
            totalProgress.classList.remove('bg-primary', 'bg-red-500');
            totalProgress.classList.add('bg-yellow-500');
        } else {
            totalProgress.classList.remove('bg-primary', 'bg-yellow-500');
            totalProgress.classList.add('bg-red-500');
        }
        
        // Update or create the chart
        updateChart(result);
        
        // Add a small animation effect
        calculatorResults.classList.add('animate-fade-in');
        setTimeout(() => {
            calculatorResults.classList.remove('animate-fade-in');
        }, 800);
    }
    
    // Function to update the chart
    function updateChart(result) {
        const ctx = document.getElementById('footprint-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (footprintChart) {
            footprintChart.destroy();
        }
        
        // Create a new chart
        footprintChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Electricity', 'Transportation', 'Diet'],
                datasets: [{
                    data: [result.electricity, result.transport, result.diet],
                    backgroundColor: [
                        '#FBBF24', // yellow for electricity
                        '#3B82F6', // blue for transportation
                        '#EF4444'  // red for diet
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const percentage = Math.round((value / result.total) * 100);
                                return `${context.label}: ${value} kg CO2e (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '65%',
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
    }
    
    // Function to show error message
    function showError(message) {
        calculatorLoader.classList.add('hidden');
        calculatorResults.classList.add('hidden');
        calculatorEmpty.classList.add('hidden');
        calculatorError.classList.remove('hidden');
        errorMessage.textContent = message;
    }
});
