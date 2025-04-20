document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Tab switching functionality - added here for reliability
    const personalTab = document.getElementById('personal-tab');
    const websiteTab = document.getElementById('website-tab');
    const personalCalculator = document.getElementById('personal-calculator');
    const websiteCalculator = document.getElementById('website-calculator');
    
    console.log("Checking for calculator tabs in animations.js...");
    console.log("Elements found:", !!personalTab, !!websiteTab, !!personalCalculator, !!websiteCalculator);
    
    if (personalTab && websiteTab && personalCalculator && websiteCalculator) {
        console.log("Setting up calculator tabs in animations.js");
        
        // Fix display style
        personalCalculator.style.display = 'block';
        websiteCalculator.style.display = 'none';
        
        // Switch to personal calculator
        personalTab.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Showing personal calculator");
            personalCalculator.style.display = 'block';
            websiteCalculator.style.display = 'none';
            
            personalTab.classList.add('border-b-2', 'border-primary', 'text-primary');
            personalTab.classList.remove('text-gray-500');
            websiteTab.classList.remove('border-b-2', 'border-primary', 'text-primary');
            websiteTab.classList.add('text-gray-500');
        });
        
        // Switch to website calculator
        websiteTab.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Showing website calculator");
            personalCalculator.style.display = 'none';
            websiteCalculator.style.display = 'block';
            
            websiteTab.classList.add('border-b-2', 'border-primary', 'text-primary');
            websiteTab.classList.remove('text-gray-500');
            personalTab.classList.remove('border-b-2', 'border-primary', 'text-primary');
            personalTab.classList.add('text-gray-500');
        });
        
        // Make function globally available
        window.showWebsiteCalculator = function() {
            console.log("Showing website calculator via global function");
            personalCalculator.style.display = 'none';
            websiteCalculator.style.display = 'block';
            
            websiteTab.classList.add('border-b-2', 'border-primary', 'text-primary');
            websiteTab.classList.remove('text-gray-500');
            personalTab.classList.remove('border-b-2', 'border-primary', 'text-primary');
            personalTab.classList.add('text-gray-500');
        };
    } else {
        console.error("Could not find calculator tabs or content elements");
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if it's open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smooth scroll to the target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation classes to elements as they scroll into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate-fade-in');
                // Remove the element from the list once it's animated
                element.classList.remove('animate-on-scroll');
            }
        });
    };
    
    // Add the animate-on-scroll class to sections
    document.querySelectorAll('section').forEach(section => {
        if (!section.classList.contains('animate-fade-in')) {
            section.classList.add('animate-on-scroll');
        }
    });
    
    // Run the animation function on load and scroll
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
    
    // Add hover effects to buttons and cards
    document.querySelectorAll('.hover-scale').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn-ripple').forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});
