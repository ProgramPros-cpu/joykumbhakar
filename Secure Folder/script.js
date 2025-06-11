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
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
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
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
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
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
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
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    function animateCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target;
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

    // Load features data from JSON
    fetch('data/features.json')
        .then(response => response.json())
        .then(data => {
            const featuresGrid = document.querySelector('.features-grid');
            
            data.features.forEach(feature => {
                const featureCard = document.createElement('div');
                featureCard.className = 'feature-card glass-card';
                featureCard.innerHTML = `
                    <div class="feature-icon">
                        <i class="${feature.icon}"></i>
                    </div>
                    <h3 class="feature-title">${feature.title}</h3>
                    <p class="feature-desc">${feature.description}</p>
                `;
                featuresGrid.appendChild(featureCard);
            });
        });

    // Load testimonials data from JSON
    fetch('data/testimonials.json')
        .then(response => response.json())
        .then(data => {
            const testimonialsSlider = document.querySelector('.testimonials-slider');
            
            data.testimonials.forEach(testimonial => {
                const testimonialCard = document.createElement('div');
                testimonialCard.className = 'testimonial-card';
                testimonialCard.innerHTML = `
                    <p class="testimonial-text">${testimonial.text}</p>
                    <div class="testimonial-author">
                        <div class="author-avatar">
                            <img src="images/avatars/${testimonial.avatar}" alt="${testimonial.name}">
                        </div>
                        <div class="author-info">
                            <h4>${testimonial.name}</h4>
                            <p>${testimonial.position}</p>
                        </div>
                    </div>
                `;
                testimonialsSlider.appendChild(testimonialCard);
            });
            
            // Initialize testimonial slider
            $('.testimonials-slider').slick({
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                adaptiveHeight: true,
                autoplay: true,
                autoplaySpeed: 5000,
                arrows: false
            });
        });

    // Load FAQ data from JSON
    fetch('data/faq.json')
        .then(response => response.json())
        .then(data => {
            const faqAccordion = document.querySelector('.faq-accordion');
            
            data.faqs.forEach(faq => {
                const accordionItem = document.createElement('div');
                accordionItem.className = 'accordion-item';
                accordionItem.innerHTML = `
                    <div class="accordion-header">
                        <h3>${faq.question}</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="accordion-content">
                        <p>${faq.answer}</p>
                    </div>
                `;
                faqAccordion.appendChild(accordionItem);
            });
        });

    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            
            // Here you would typically send the email to your server
            console.log('Subscribed email:', email);
            
            // Show success message
            alert('Thank you for subscribing to our newsletter!');
            this.querySelector('input').value = '';
        });
    }

    // Language selector
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            // In a real implementation, this would change the site language
            console.log('Selected language:', this.value);
        });
    }
});