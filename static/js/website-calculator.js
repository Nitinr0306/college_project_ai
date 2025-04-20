document.addEventListener('DOMContentLoaded', function() {
    // Get tab elements
    const personalTab = document.getElementById('personal-tab');
    const websiteTab = document.getElementById('website-tab');
    const personalCalculator = document.getElementById('personal-calculator');
    const websiteCalculator = document.getElementById('website-calculator');
    
    // Make sure all elements exist before adding event handlers
    if (personalTab && websiteTab && personalCalculator && websiteCalculator) {
        console.log('Initializing calculator tabs');
        
        // Tab switching functionality
        personalTab.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Switching to personal calculator tab');
            
            // Show personal calculator, hide website calculator
            personalCalculator.classList.remove('hidden');
            websiteCalculator.classList.add('hidden');
            
            // Update tab styles
            personalTab.classList.add('border-b-2', 'border-primary', 'text-primary');
            personalTab.classList.remove('text-gray-500');
            websiteTab.classList.remove('border-b-2', 'border-primary', 'text-primary');
            websiteTab.classList.add('text-gray-500');
        });
        
        websiteTab.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Switching to website calculator tab');
            
            // Show website calculator, hide personal calculator
            websiteCalculator.classList.remove('hidden');
            personalCalculator.classList.add('hidden');
            
            // Update tab styles
            websiteTab.classList.add('border-b-2', 'border-primary', 'text-primary');
            websiteTab.classList.remove('text-gray-500');
            personalTab.classList.remove('border-b-2', 'border-primary', 'text-primary');
            personalTab.classList.add('text-gray-500');
        });
    } else {
        console.error('Calculator tab elements not found');
    }
    
    // Get the website calculator form and results elements
    const websiteForm = document.getElementById('website-calculator-form');
    const websiteResults = document.getElementById('website-results');
    const websiteEmpty = document.getElementById('website-empty');
    const websiteLoader = document.getElementById('website-loader');
    const websiteError = document.getElementById('website-error');
    const websiteErrorMessage = document.getElementById('website-error-message');
    
    // Get the website result display elements
    const websiteSize = document.getElementById('website-size');
    const perVisitResult = document.getElementById('per-visit-result');
    const monthlyResult = document.getElementById('monthly-result');
    const annualResult = document.getElementById('annual-result');
    const websiteTextPreview = document.getElementById('website-text-preview');
    
    // Chart for website visualization
    let websiteChart = null;
    
    // Handle website form submission
    if (websiteForm) {
        websiteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show loader, hide results and error
            websiteEmpty.classList.add('hidden');
            websiteResults.classList.add('hidden');
            websiteLoader.classList.remove('hidden');
            websiteError.classList.add('hidden');
            
            // Get form values
            const websiteUrl = document.getElementById('website_url').value;
            const monthlyViews = parseInt(document.getElementById('monthly_views').value) || 10000;
            
            // Validate inputs
            if (!websiteUrl) {
                showWebsiteError('Please enter a website URL.');
                return;
            }
            
            // Prepare data for API call
            const data = {
                website_url: websiteUrl,
                monthly_views: monthlyViews
            };
            
            // Call the backend API
            fetch('/calculate-website', {
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
                    displayWebsiteResults(data.result);
                } else {
                    showWebsiteError(data.error || 'An unknown error occurred.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showWebsiteError('Failed to analyze website. Please try again.');
            });
        });
    }
    
    // Function to display the website calculation results
    function displayWebsiteResults(result) {
        // Hide loader, show results
        websiteLoader.classList.add('hidden');
        websiteResults.classList.remove('hidden');
        
        // Update result text
        websiteSize.textContent = `${result.website_size_mb} MB`;
        perVisitResult.textContent = `${result.carbon_per_visit} g CO2e`;
        monthlyResult.textContent = `${result.monthly_carbon} kg CO2e`;
        annualResult.textContent = `${result.annual_carbon} kg CO2e`;
        
        // Update website text preview if available
        if (result.website_text_preview) {
            websiteTextPreview.textContent = result.website_text_preview;
        } else {
            websiteTextPreview.textContent = 'No content available';
        }
        
        // Update or create the chart
        updateWebsiteChart(result);
        
        // Add a small animation effect
        websiteResults.classList.add('animate-fade-in');
        setTimeout(() => {
            websiteResults.classList.remove('animate-fade-in');
        }, 800);
    }
    
    // Function to update the website chart
    function updateWebsiteChart(result) {
        const ctx = document.getElementById('website-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (websiteChart) {
            websiteChart.destroy();
        }
        
        // Create a new chart showing monthly vs annual emissions
        websiteChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Monthly', 'Annual'],
                datasets: [{
                    label: 'Carbon Emissions (kg CO2e)',
                    data: [result.monthly_carbon, result.annual_carbon],
                    backgroundColor: [
                        '#3B82F6', // blue for monthly
                        '#8B5CF6'  // purple for annual
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.raw} kg CO2e`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Carbon Emissions (kg CO2e)'
                        }
                    }
                },
                animation: {
                    animateScale: true
                }
            }
        });
    }
    
    // Function to show website error message
    function showWebsiteError(message) {
        websiteLoader.classList.add('hidden');
        websiteResults.classList.add('hidden');
        websiteEmpty.classList.add('hidden');
        websiteError.classList.remove('hidden');
        websiteErrorMessage.textContent = message;
    }
});