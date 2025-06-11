// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Particles.js initialization
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#0066ff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false
            },
            "size": {
                "value": 3,
                "random": true
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#0066ff",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "push": {
                    "particles_nb": 4
                }
            }
        },
        "retina_detect": true
    });

    // Dispatch auth state change event
    function dispatchAuthEvent() {
        document.dispatchEvent(new CustomEvent('authStateChanged'));
    }

    // Modify auth.updateAuthUI to dispatch event
    const originalUpdateUI = auth.updateAuthUI;
    auth.updateAuthUI = function() {
        originalUpdateUI.apply(this);
        dispatchAuthEvent();
    };

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn?.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            nav.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animated counter for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.textContent.replace(/,/g, '');
            const increment = target / speed;
            
            if (count < target) {
                counter.textContent = Math.ceil(count + increment).toLocaleString();
                setTimeout(animateCounters, 1);
            }
        });
    }
    
    // Start counter animation when stats section is in view
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entries[0].target);
        }
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // App screenshot carousel
    const screenshots = document.querySelectorAll('.screen-animation img');
    let currentScreenshot = 0;
    
    function rotateScreenshots() {
        screenshots[currentScreenshot].classList.remove('active');
        currentScreenshot = (currentScreenshot + 1) % screenshots.length;
        screenshots[currentScreenshot].classList.add('active');
    }
    
    if (screenshots.length > 0) {
        setInterval(rotateScreenshots, 3000);
    }

    // FAQ accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Check for new version updates
    function checkForUpdates() {
        // In a real app, you would check with your backend
        const currentVersion = '2.4.1';
        const latestVersion = '2.5.0';
        
        if (currentVersion !== latestVersion && auth.currentUser) {
            notifications.addNotification({
                title: 'New Version Available',
                message: `Secure Folder ${latestVersion} is now available with new features and security improvements.`,
                type: 'update',
                read: false
            });
        }
    }
    
    // Check for updates every 24 hours
    setInterval(checkForUpdates, 24 * 60 * 60 * 1000);
    checkForUpdates(); // Also check on page load

    // Close reply modal
    document.querySelector('#reply-modal .close-modal')?.addEventListener('click', () => {
        document.getElementById('reply-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});