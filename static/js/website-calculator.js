// Function to switch between calculator tabs
function setupCalculatorTabs() {
    // Get tab elements
    const personalTab = document.getElementById('personal-tab');
    const websiteTab = document.getElementById('website-tab');
    const personalCalculator = document.getElementById('personal-calculator');
    const websiteCalculator = document.getElementById('website-calculator');
    
    // Debug to help identify issues
    console.log('Tabs found:', !!personalTab, !!websiteTab);
    console.log('Calculators found:', !!personalCalculator, !!websiteCalculator);
    
    // Log initial display values for debugging
    console.log('Initial display values:', 
                'personalCalculator:', personalCalculator.className,
                'websiteCalculator:', websiteCalculator.className);
    
    // Make sure all elements exist before adding event handlers
    if (personalTab && websiteTab && personalCalculator && websiteCalculator) {
        console.log('Initializing calculator tabs');
        
        // Function to switch to personal calculator
        function showPersonalCalculator() {
            personalCalculator.classList.add('active');
            personalCalculator.classList.remove('inactive');
            websiteCalculator.classList.remove('active');
            websiteCalculator.classList.add('inactive');
            
            console.log('Personal calculator activated:', 
                        personalCalculator.className,
                        websiteCalculator.className);
            
            // Update tab styles
            personalTab.classList.add('border-b-2', 'border-primary', 'text-primary');
            personalTab.classList.remove('text-gray-500');
            websiteTab.classList.remove('border-b-2', 'border-primary', 'text-primary');
            websiteTab.classList.add('text-gray-500');
            
            console.log('Switching to personal calculator tab');
        }
        
        // Function to switch to website calculator
        function showWebsiteCalculator() {
            personalCalculator.classList.remove('active');
            personalCalculator.classList.add('inactive');
            websiteCalculator.classList.add('active');
            websiteCalculator.classList.remove('inactive');
            
            console.log('Website calculator activated:', 
                        personalCalculator.className,
                        websiteCalculator.className);
            
            // Update tab styles
            websiteTab.classList.add('border-b-2', 'border-primary', 'text-primary');
            websiteTab.classList.remove('text-gray-500');
            personalTab.classList.remove('border-b-2', 'border-primary', 'text-primary');
            personalTab.classList.add('text-gray-500');
            
            console.log('Switching to website calculator tab');
        }
        
        // Tab switching event listeners
        personalTab.addEventListener('click', function(e) {
            e.preventDefault();
            showPersonalCalculator();
        });
        
        websiteTab.addEventListener('click', function(e) {
            e.preventDefault();
            showWebsiteCalculator();
        });
        
        // Check if URL has a hash to determine which tab to show
        if (window.location.hash === '#website-calculator') {
            showWebsiteCalculator();
        }
        
        // Make the showWebsiteCalculator function globally accessible
        window.showWebsiteCalculator = showWebsiteCalculator;
    } else {
        console.error('Calculator tab elements not found');
    }
}

// Ensure the tab setup runs after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCalculatorTabs);
} else {
    setupCalculatorTabs();
}

document.addEventListener('DOMContentLoaded', function() {
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
            websiteEmpty.style.display = 'none';
            websiteResults.style.display = 'none';
            websiteLoader.style.display = 'block';
            websiteError.style.display = 'none';
            
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
        // Hide loader and empty state
        websiteLoader.style.display = 'none';
        websiteEmpty.style.display = 'none';
        websiteError.style.display = 'none';
        
        // Show results
        websiteResults.style.display = 'block';
        
        console.log('Website calculation result:', result);
        
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
        websiteLoader.style.display = 'none';
        websiteResults.style.display = 'none';
        websiteEmpty.style.display = 'none';
        websiteError.style.display = 'block';
        websiteErrorMessage.textContent = message;
    }
});