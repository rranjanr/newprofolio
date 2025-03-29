// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Send data to Formspree
            fetch("https://formspree.io/f/mldjwlyk", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Show success message
                    contactSuccess.classList.remove('hidden');
                    contactForm.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        contactSuccess.classList.add('hidden');
                    }, 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Sorry, there was a problem submitting your form. Please try again later.');
            });
        });
    }
    
    // Check if we're returning from form submission (hash will be #contact-success)
    if (window.location.hash === '#contact-success') {
        if (contactSuccess) {
            // Show success message
            contactSuccess.classList.remove('hidden');
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                contactSuccess.classList.add('hidden');
                // Remove the hash from the URL
                history.pushState("", document.title, window.location.pathname);
            }, 5000);
        }
    }
    
    // Initialize Snow Effect
    initSnowEffect();
    
    // Initialize Custom Cursor
    initCustomCursor();
    
    // Add active class to nav items on scroll
    window.addEventListener('scroll', function() {
        handleNavActiveState();
        parallaxEffect();
    });
    
    // Trigger once on load
    handleNavActiveState();
    
    // Skill bars animation
    animateSkillBars();
    
    // Typed.js effect for hero section
    animateHeroText();
});

// Snow Effect
function initSnowEffect() {
    const snowContainer = document.getElementById('snow-container');
    const isMobile = window.innerWidth < 768;
    const snowflakeCount = isMobile ? 20 : 50; // Fewer snowflakes on mobile
    
    // Performance optimization - pause animations when tab is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            snowContainer.style.display = 'none';
        } else {
            snowContainer.style.display = 'block';
            
            // Restart animations
            while (snowContainer.firstChild) {
                snowContainer.removeChild(snowContainer.firstChild);
            }
            
            for (let i = 0; i < snowflakeCount; i++) {
                createSnowflake(true);
            }
        }
    });
    
    // Create snowflake pool
    for (let i = 0; i < snowflakeCount; i++) {
        createSnowflake(true);
    }
    
    function createSnowflake(isInitial = false) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.style.position = 'absolute';
        snowflake.style.color = 'white';
        snowflake.style.userSelect = 'none';
        snowflake.style.willChange = 'transform'; // Performance optimization
        
        // Randomize snowflake properties
        const size = Math.random() * 10 + 5;
        const opacity = Math.random() * 0.6 + 0.2;
        const initialX = Math.random() * window.innerWidth;
        const initialY = isInitial ? Math.random() * window.innerHeight * -1 : -20;
        const duration = Math.random() * 8 + 7; // Longer duration for smoother fall
        const horizontalSwing = Math.random() * 150 - 75;
        
        // Variety of snowflake characters
        const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❉', '❊', '❋'];
        const randomChar = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
        
        // Apply styles
        snowflake.style.fontSize = `${size}px`;
        snowflake.style.opacity = opacity;
        snowflake.style.left = `${initialX}px`;
        snowflake.style.top = `${initialY}px`;
        snowflake.innerHTML = randomChar;
        
        // Use CSS animations for smoother performance
        snowflake.style.transition = `transform ${duration}s linear, top ${duration}s linear`;
        
        // Add to DOM
        snowContainer.appendChild(snowflake);
        
        // Start animation with a small delay for staggered effect
        setTimeout(() => {
            snowflake.style.transform = `translateY(${window.innerHeight + 50}px) translateX(${horizontalSwing}px) rotate(${Math.random() * 360}deg)`;
            snowflake.style.top = `${window.innerHeight + 50}px`;
        }, Math.random() * 500);
        
        // Remove and recreate snowflake after animation completes
        setTimeout(() => {
            if (snowflake.parentNode === snowContainer) {
                snowflake.remove();
                createSnowflake();
            }
        }, duration * 1000);
        
        return snowflake;
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Clear all snowflakes
        while (snowContainer.firstChild) {
            snowContainer.removeChild(snowContainer.firstChild);
        }
        
        // Create new snowflakes based on new window size
        const newSnowflakeCount = window.innerWidth < 768 ? 20 : 50;
        for (let i = 0; i < newSnowflakeCount; i++) {
            createSnowflake(true);
        }
    });
}

// Custom Cursor
function initCustomCursor() {
    // Custom cursor elements
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-dot-outline');
    
    // Check if we should enable the custom cursor (disable on touch devices)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.body.classList.remove('cursor-hidden');
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
        return;
    }
    
    // Variables for cursor position
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let dotX = 0;
    let dotY = 0;
    
    // Trail elements array
    const trailElements = [];
    const maxTrailElements = 15;
    
    // Create trail elements
    for (let i = 0; i < maxTrailElements; i++) {
        const trail = document.createElement('div');
        trail.classList.add('cursor-trail');
        trail.style.opacity = (1 - i / maxTrailElements) * 0.5;
        trail.style.width = trail.style.height = `${Math.max(3, 8 - i * 0.5)}px`;
        document.body.appendChild(trail);
        trailElements.push({
            element: trail,
            x: 0,
            y: 0
        });
    }
    
    // Update cursor position on mouse move
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
    
    // Add click effect
    document.addEventListener('mousedown', () => {
        document.body.classList.add('cursor-click');
    });
    
    document.addEventListener('mouseup', () => {
        document.body.classList.remove('cursor-click');
    });
    
    // Animation loop for smooth cursor movement
    function animateCursor() {
        // Calculate smooth movement for outline
        const outlineSpeed = 0.15;
        outlineX += (mouseX - outlineX) * outlineSpeed;
        outlineY += (mouseY - outlineY) * outlineSpeed;
        
        // Calculate smooth movement for dot (faster than outline)
        const dotSpeed = 0.35;
        dotX += (mouseX - dotX) * dotSpeed;
        dotY += (mouseY - dotY) * dotSpeed;
        
        // Update cursor positions
        if (cursorDot) cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        if (cursorOutline) cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
        
        // Update trail positions with delay
        for (let i = trailElements.length - 1; i > 0; i--) {
            trailElements[i].x = trailElements[i-1].x;
            trailElements[i].y = trailElements[i-1].y;
        }
        
        // First trail element follows the cursor
        if (trailElements.length > 0) {
            trailElements[0].x = mouseX;
            trailElements[0].y = mouseY;
        }
        
        // Update trail element positions
        trailElements.forEach((trail, index) => {
            trail.element.style.transform = `translate(${trail.x}px, ${trail.y}px)`;
        });
        
        requestAnimationFrame(animateCursor);
    }
    
    // Start animation
    animateCursor();
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        if (cursorDot) cursorDot.style.opacity = '0';
        if (cursorOutline) cursorOutline.style.opacity = '0';
        trailElements.forEach(trail => {
            trail.element.style.opacity = '0';
        });
    });
    
    // Show cursor when entering window
    document.addEventListener('mouseenter', () => {
        if (cursorDot) cursorDot.style.opacity = '1';
        if (cursorOutline) cursorOutline.style.opacity = '1';
        trailElements.forEach((trail, index) => {
            trail.element.style.opacity = (1 - index / maxTrailElements) * 0.5;
        });
    });
}

// Handle active state of nav items based on scroll position
function handleNavActiveState() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' + currentSection || (href === '#' && currentSection === '')) {
            link.classList.add('active');
        }
    });
}

// Parallax effect on scroll
function parallaxEffect() {
    const heroSection = document.querySelector('section:first-of-type');
    const scrollPosition = window.scrollY;
    
    if (heroSection && scrollPosition < window.innerHeight) {
        const translateY = scrollPosition * 0.5;
        heroSection.style.backgroundPositionY = `${translateY}px`;
    }
}

// Animate skill bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    // Add observer to animate skill bars when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percent = entry.target.getAttribute('data-percent');
                entry.target.style.width = `${percent}%`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    skillBars.forEach(bar => {
        // Start with zero width
        bar.style.width = '0';
        
        // Observe each skill bar
        observer.observe(bar);
    });
    
    // Add hover effect to skill bars for desktop
    if (window.innerWidth > 768) {
        skillBars.forEach(bar => {
            bar.addEventListener('mouseenter', () => {
                const tooltip = bar.querySelector('.skill-tooltip');
                if (tooltip) {
                    tooltip.style.opacity = '1';
                    tooltip.style.transform = 'translateY(0)';
                }
            });
            
            bar.addEventListener('mouseleave', () => {
                const tooltip = bar.querySelector('.skill-tooltip');
                if (tooltip) {
                    tooltip.style.opacity = '0';
                    tooltip.style.transform = 'translateY(10px)';
                }
            });
        });
    }
}

// Animate hero text with typing effect
function animateHeroText() {
    const heroHeading = document.querySelector('section:first-of-type h1');
    if (heroHeading) {
        const nameSpan = heroHeading.querySelector('span');
        if (nameSpan) {
            nameSpan.classList.add('hero-text-animated');
        }
    }
}

// Add 3D tilt effect to project cards but exclude form elements
document.querySelectorAll('.glass-effect').forEach(card => {
    // Skip form elements and their children
    if (card.tagName === 'FORM' || card.tagName === 'INPUT' || 
        card.tagName === 'TEXTAREA' || card.tagName === 'SELECT' ||
        card.closest('form')) {
        return;
    }
    
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
});

function handleTilt(e) {
    // Ignore form elements
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || 
        e.target.tagName === 'SELECT' || e.target.closest('form')) {
        return;
    }
    
    const card = this;
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    const mouseX = e.clientX - cardCenterX;
    const mouseY = e.clientY - cardCenterY;
    const rotateX = (mouseY / (cardRect.height / 2)) * -10;
    const rotateY = (mouseX / (cardRect.width / 2)) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
}

function resetTilt() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
}

// Mobile menu toggle with elegant animation
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuItems = document.querySelectorAll('#mobile-menu a');
    const body = document.body;
    
    if (mobileMenuButton && mobileMenu) {
        // Open menu
        mobileMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
            body.classList.toggle('menu-open');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.replace('fa-times', 'fa-bars');
                } else {
                    icon.classList.replace('fa-bars', 'fa-times');
                }
            }
            
            // Add pulse effect to button
            this.classList.add('animate-pulse');
            setTimeout(() => {
                this.classList.remove('animate-pulse');
            }, 300);
        });
        
        // Close menu when clicking menu items
        mobileMenuItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                body.classList.remove('menu-open');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && 
                !mobileMenuButton.contains(e.target) && 
                !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                body.classList.remove('menu-open');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            }
        });
        
        // Prevent clicks inside mobile menu from closing it
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
} 