document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // Particles.js Background Configuration
    // =============================================
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
                "value": "#4a6cf7"
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
                "color": "#4a6cf7",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out"
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

    // =============================================
    // Mobile Navigation
    // =============================================
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a, .footer-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.hash) {
                e.preventDefault();
                
                nav.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =============================================
    // Header Scroll Effect
    // =============================================
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 100);
    });

    // =============================================
    // Animated Counters
    // =============================================
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;
        
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
    };
    
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

    // =============================================
    // App Screenshot Carousel
    // =============================================
    const screenshots = document.querySelectorAll('.screen-animation img');
    if (screenshots.length > 0) {
        let currentScreenshot = 0;
        
        function rotateScreenshots() {
            screenshots[currentScreenshot].classList.remove('active');
            currentScreenshot = (currentScreenshot + 1) % screenshots.length;
            screenshots[currentScreenshot].classList.add('active');
        }
        
        setInterval(rotateScreenshots, 3000);
    }

    // =============================================
    // FAQ Accordion
    // =============================================
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
            
            // Toggle icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-chevron-up');
            icon.classList.toggle('fa-chevron-down');
        });
    });

    // =============================================
    // Testimonials Slider
    // =============================================
    if (document.querySelector('.testimonials-slider')) {
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
    }

    // =============================================
    // Auth Modals
    // =============================================
    const authModals = {
        init: function() {
            // Modal elements
            this.loginModal = document.getElementById('login-modal');
            this.signupModal = document.getElementById('signup-modal');
            this.forgotModal = document.getElementById('forgot-password-modal');
            this.replyModal = document.getElementById('reply-modal');
            
            // Buttons
            this.loginBtn = document.getElementById('login-btn');
            this.signupBtn = document.getElementById('signup-btn');
            this.closeBtns = document.querySelectorAll('.close-modal');
            
            // Switch between auth forms
            this.switchToSignup = document.querySelectorAll('.switch-to-signup');
            this.switchToLogin = document.querySelectorAll('.switch-to-login');
            this.forgotPasswordLinks = document.querySelectorAll('.forgot-password');
            
            // Initialize
            this.bindEvents();
        },
        
        bindEvents: function() {
            // Open modals
            this.loginBtn.addEventListener('click', () => this.openModal('login'));
            this.signupBtn.addEventListener('click', () => this.openModal('signup'));
            
            // Close modals
            this.closeBtns.forEach(btn => {
                btn.addEventListener('click', () => this.closeModal());
            });
            
            // Switch between forms
            this.switchToSignup.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeModal();
                    this.openModal('signup');
                });
            });
            
            this.switchToLogin.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeModal();
                    this.openModal('login');
                });
            });
            
            this.forgotPasswordLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeModal();
                    this.openModal('forgot');
                });
            });
            
            // Close when clicking outside modal
            window.addEventListener('click', (e) => {
                if (e.target.classList.contains('auth-modal')) {
                    this.closeModal();
                }
            });
        },
        
        openModal: function(type) {
            document.body.style.overflow = 'hidden';
            
            switch(type) {
                case 'login':
                    this.loginModal.style.display = 'block';
                    break;
                case 'signup':
                    this.signupModal.style.display = 'block';
                    break;
                case 'forgot':
                    this.forgotModal.style.display = 'block';
                    break;
                case 'reply':
                    this.replyModal.style.display = 'block';
                    break;
            }
        },
        
        closeModal: function() {
            document.body.style.overflow = '';
            document.querySelectorAll('.auth-modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    };
    
    authModals.init();

    // =============================================
    // Chatbot Implementation
    // =============================================
    const chatbot = {
        init: function() {
            // Elements
            this.container = document.getElementById('chatbot-container');
            this.toggleBtn = document.getElementById('open-chatbot');
            this.minimizeBtn = document.getElementById('minimize-chatbot');
            this.closeBtn = document.getElementById('close-chatbot');
            this.messagesContainer = document.getElementById('chatbot-messages');
            this.inputField = document.getElementById('chatbot-input-field');
            this.sendBtn = document.getElementById('send-chatbot-message');
            
            // State
            this.isOpen = false;
            this.isMinimized = false;
            
            // Initialize
            this.bindEvents();
            this.addBotMessage("Hello! I'm your SecureThing assistant. How can I help you today?");
        },
        
        bindEvents: function() {
            // Toggle chatbot
            this.toggleBtn.addEventListener('click', () => {
                if (!this.isOpen) {
                    this.openChatbot();
                } else if (this.isMinimized) {
                    this.expandChatbot();
                }
            });
            
            // Minimize chatbot
            this.minimizeBtn.addEventListener('click', () => this.minimizeChatbot());
            
            // Close chatbot
            this.closeBtn.addEventListener('click', () => this.closeChatbot());
            
            // Send message
            this.sendBtn.addEventListener('click', () => this.sendMessage());
            this.inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
            
            // Quick question buttons
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('quick-question-btn')) {
                    const question = e.target.getAttribute('data-question');
                    this.addUserMessage(question);
                    setTimeout(() => this.getBotResponse(question), 500);
                }
            });
        },
        
        openChatbot: function() {
            this.container.classList.add('active');
            this.isOpen = true;
            this.isMinimized = false;
        },
        
        minimizeChatbot: function() {
            this.container.style.height = '40px';
            this.isMinimized = true;
        },
        
        expandChatbot: function() {
            this.container.style.height = '500px';
            this.isMinimized = false;
        },
        
        closeChatbot: function() {
            this.container.classList.remove('active');
            this.isOpen = false;
        },
        
        sendMessage: function() {
            const message = this.inputField.value.trim();
            if (message) {
                this.addUserMessage(message);
                this.inputField.value = '';
                setTimeout(() => this.getBotResponse(message), 800);
            }
        },
        
        addUserMessage: function(text) {
            this.addMessage(text, 'user');
        },
        
        addBotMessage: function(text) {
            this.addMessage(text, 'bot');
        },
        
        addMessage: function(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message ${sender}-message`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.innerHTML = `<p>${text}</p>`;
            
            // Add quick questions for certain bot responses
            if (sender === 'bot') {
                const quickQuestions = this.generateQuickQuestions(text);
                if (quickQuestions) {
                    contentDiv.appendChild(quickQuestions);
                }
            }
            
            messageDiv.appendChild(contentDiv);
            this.messagesContainer.appendChild(messageDiv);
            this.scrollToBottom();
        },
        
        generateQuickQuestions: function(text) {
            const lowerText = text.toLowerCase();
            const quickQuestionsDiv = document.createElement('div');
            quickQuestionsDiv.className = 'quick-questions';
            
            if (lowerText.includes('hello') || lowerText.includes('help')) {
                quickQuestionsDiv.innerHTML = `
                    <button class="quick-question-btn" data-question="How do I install SecureThing?">How to install?</button>
                    <button class="quick-question-btn" data-question="What encryption does SecureThing use?">Encryption info</button>
                    <button class="quick-question-btn" data-question="How to recover my password?">Password recovery</button>
                `;
                return quickQuestionsDiv;
            }
            
            if (lowerText.includes('install')) {
                quickQuestionsDiv.innerHTML = `
                    <button class="quick-question-btn" data-question="Is the app free?">Is the app free?</button>
                    <button class="quick-question-btn" data-question="What Android version is required?">Android version?</button>
                `;
                return quickQuestionsDiv;
            }
            
            if (lowerText.includes('encryption')) {
                quickQuestionsDiv.innerHTML = `
                    <button class="quick-question-btn" data-question="Is my data stored online?">Data stored online?</button>
                    <button class="quick-question-btn" data-question="Can I recover my password?">Password recovery?</button>
                `;
                return quickQuestionsDiv;
            }
            
            return null;
        },
        
        getBotResponse: function(message) {
            const lowerMessage = message.toLowerCase();
            let response = "";
            
            if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                response = "Hello! How can I help you with SecureThing today?";
            } 
            else if (lowerMessage.includes('install') || lowerMessage.includes('download')) {
                response = "You can download SecureThing directly from our website. Just go to the Download section and click on the APK download button. Make sure to enable 'Install unknown sources' in your Android settings if prompted.";
            }
            else if (lowerMessage.includes('free') || lowerMessage.includes('cost')) {
                response = "Yes, SecureThing is completely free to download and use with no hidden costs or subscriptions. All features are available without payment.";
            }
            else if (lowerMessage.includes('encryption') || lowerMessage.includes('secure')) {
                response = "SecureThing uses AES-256 encryption, which is military-grade protection for your files. All data is encrypted before being stored on your device, and the app works completely offline for maximum security.";
            }
            else if (lowerMessage.includes('password') && lowerMessage.includes('recover')) {
                response = "For security reasons, we cannot recover your password as all encryption is tied to it. However, you can enable biometric authentication (fingerprint/face ID) as a backup login method in the app settings.";
            }
            else if (lowerMessage.includes('android') || lowerMessage.includes('version')) {
                response = "SecureThing works on Android 6.0 (Marshmallow) and above. For biometric authentication, you'll need Android 8.0 (Oreo) or later. The app is optimized for both phones and tablets.";
            }
            else if (lowerMessage.includes('online') || lowerMessage.includes('cloud')) {
                response = "No, SecureThing works completely offline. Your data never leaves your device and isn't stored on any servers. This ensures maximum privacy and security for your files.";
            }
            else if (lowerMessage.includes('feature') || lowerMessage.includes('function')) {
                response = "SecureThing offers file encryption, password vault, biometric login, and more. Check out our Features section for a complete list of what the app can do to protect your privacy.";
            }
            else {
                response = "I'm not sure I understand. Could you rephrase your question? Or you might find the answer in our FAQ section.";
            }
            
            this.addBotMessage(response);
        },
        
        scrollToBottom: function() {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    };
    
    chatbot.init();

    // =============================================
    // Version History Table
    // =============================================
    const versionHistory = {
        init: function() {
            this.table = document.querySelector('.versions-table');
            if (!this.table) return;
            
            this.sortSelect = document.getElementById('version-sort');
            this.searchInput = document.getElementById('version-search');
            
            this.bindEvents();
        },
        
        bindEvents: function() {
            this.sortSelect.addEventListener('change', () => this.sortTable());
            this.searchInput.addEventListener('input', () => this.searchTable());
        },
        
        sortTable: function() {
            const rows = Array.from(this.table.querySelectorAll('tbody tr'));
            const sortBy = this.sortSelect.value;
            
            rows.sort((a, b) => {
                const aValue = a.cells[0].textContent;
                const bValue = b.cells[0].textContent;
                
                if (sortBy === 'version-desc') {
                    return this.compareVersions(bValue, aValue);
                } else if (sortBy === 'version-asc') {
                    return this.compareVersions(aValue, bValue);
                } else {
                    const aDate = new Date(a.cells[1].textContent);
                    const bDate = new Date(b.cells[1].textContent);
                    return sortBy === 'date-desc' ? bDate - aDate : aDate - bDate;
                }
            });
            
            const tbody = this.table.querySelector('tbody');
            tbody.innerHTML = '';
            rows.forEach(row => tbody.appendChild(row));
        },
        
        compareVersions: function(a, b) {
            const aParts = a.replace('v', '').split('.').map(Number);
            const bParts = b.replace('v', '').split('.').map(Number);
            
            for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                const aVal = aParts[i] || 0;
                const bVal = bParts[i] || 0;
                if (aVal !== bVal) return aVal - bVal;
            }
            return 0;
        },
        
        searchTable: function() {
            const searchTerm = this.searchInput.value.toLowerCase();
            const rows = this.table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const version = row.cells[0].textContent.toLowerCase();
                const date = row.cells[1].textContent.toLowerCase();
                const changes = row.cells[3].textContent.toLowerCase();
                
                if (version.includes(searchTerm) {
                    row.style.display = '';
                } else if (date.includes(searchTerm)) {
                    row.style.display = '';
                } else if (changes.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
    };
    
    versionHistory.init();

    // =============================================
    // Form Submissions
    // =============================================
    // Newsletter Form
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

    // Language Selector
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            console.log('Selected language:', this.value);
            // In a real implementation, this would change the site language
        });
    }

    // =============================================
    // Review Form
    // =============================================
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        // Star rating
        const stars = reviewForm.querySelectorAll('.stars i');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                reviewForm.querySelector('#review-rating').value = rating;
                
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
        });
        
        // Form submission
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const rating = this.querySelector('#review-rating').value;
            const text = this.querySelector('#review-text').value;
            
            if (!rating || rating == 0) {
                alert('Please select a rating');
                return;
            }
            
            // Here you would send the review to your server
            console.log('Review submitted:', { rating, text });
            
            // Show success message
            alert('Thank you for your review!');
            this.reset();
            
            // Reset stars
            stars.forEach(star => {
                star.classList.remove('fas');
                star.classList.add('far');
            });
        });
    }
});
