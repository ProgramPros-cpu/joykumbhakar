// User Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('secureFolderUsers')) || [];
        this.initAuthEvents();
        this.checkAuthState();
    }
    
            // Google Sign-in callback
        window.handleGoogleSignIn = (response) => {
            this.handleGoogleResponse(response);
        };
    }
    
    // Handle Google Sign-in response
    handleGoogleResponse(response) {
        const { credential } = response;
        const payload = JSON.parse(atob(credential.split('.')[1]));
        
        // Check if user already exists
        let user = this.users.find(u => u.email === payload.email);
        
        if (!user) {
            // Create new user
            user = {
                id: 'user_' + Math.random().toString(36).substr(2, 9),
                name: payload.name,
                email: payload.email,
                avatar: payload.picture,
                googleId: payload.sub,
                joinedDate: new Date().toISOString()
            };
            
            this.users.push(user);
            localStorage.setItem('secureFolderUsers', JSON.stringify(this.users));
        }
        
        // Set as current user
        this.currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            googleId: user.googleId,
            joinedDate: user.joinedDate
        };
        
        // Save to localStorage with expiration (7 days)
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        
        localStorage.setItem('secureFolderCurrentUser', JSON.stringify({
            user: this.currentUser,
            expires: expires.toISOString()
        }));
        
        // Update UI
        this.updateAuthUI();
        
        // Hide any open auth modals
        this.hideModal('login');
        this.hideModal('signup');
        
        // Show welcome notification
        notifications.addNotification({
            title: 'Welcome back!',
            message: `You've successfully logged in with Google`,
            type: 'success',
            read: false
        });
    }
    
    // Check auth state with expiration
    checkAuthState() {
        const authData = JSON.parse(localStorage.getItem('secureFolderCurrentUser'));
        
        if (authData && authData.user) {
            const now = new Date();
            const expires = new Date(authData.expires);
            
            if (now < expires) {
                this.currentUser = authData.user;
                this.updateAuthUI();
                
                // Refresh the token if using Google
                if (this.currentUser.googleId) {
                    // In a real app, you would verify the token with your backend
                    console.log('Google user session active');
                }
            } else {
                // Session expired
                localStorage.removeItem('secureFolderCurrentUser');
            }
        }
    }
    
    // Enhanced login with remember me
    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        const errorElement = document.getElementById('login-error');
        
        // Basic validation
        if (!email || !password) {
            this.showError(errorElement, 'Please fill in all fields');
            return;
        }
        
        // Find user
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            this.showError(errorElement, 'User not found');
            return;
        }
        
        // In a real app, you would verify the hashed password
        if (user.password !== password) {
            this.showError(errorElement, 'Incorrect password');
            return;
        }
        
        // Successful login
        this.currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            joinedDate: user.joinedDate
        };
        
        // Save to localStorage with or without expiration
        if (rememberMe) {
            const expires = new Date();
            expires.setDate(expires.getDate() + 7);
            
            localStorage.setItem('secureFolderCurrentUser', JSON.stringify({
                user: this.currentUser,
                expires: expires.toISOString()
            }));
        } else {
            // Session will expire when browser closes
            localStorage.setItem('secureFolderCurrentUser', JSON.stringify({
                user: this.currentUser
            }));
        }
        
        // Update UI
        this.updateAuthUI();
        
        // Hide modal
        this.hideModal('login');
        
        // Clear form
        document.getElementById('login-form').reset();
        this.hideError(errorElement);
        
        // Show welcome notification
        notifications.addNotification({
            title: 'Welcome back!',
            message: `You've successfully logged in as ${this.currentUser.name}`,
            type: 'success',
            read: false
        });
    }
    
    // Initialize authentication event listeners
    initAuthEvents() {
        // Login form submission
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Signup form submission
        document.getElementById('signup-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });
        
        // Forgot password form submission
        document.getElementById('forgot-password-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });
        
        // Logout link
        document.getElementById('logout-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });
        
        // Profile link
        document.getElementById('my-profile-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showUserProfile();
        });
        
        // Modal switches
        document.querySelectorAll('.switch-to-signup').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchModal('login', 'signup');
            });
        });
        
        document.querySelectorAll('.switch-to-login').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchModal('signup', 'login');
                this.switchModal('forgot-password', 'login');
            });
        });
        
        document.querySelectorAll('.forgot-password').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchModal('login', 'forgot-password');
            });
        });
        
        // Login buttons from other sections
        document.getElementById('review-login-btn')?.addEventListener('click', () => {
            this.showModal('login');
        });
        
        document.getElementById('feedback-login-btn')?.addEventListener('click', () => {
            this.showModal('login');
        });
    }
    
    // Check authentication state on page load
    checkAuthState() {
        const user = JSON.parse(localStorage.getItem('secureFolderCurrentUser'));
        if (user) {
            this.currentUser = user;
            this.updateAuthUI();
        }
    }
    
    // Update UI based on authentication state
    updateAuthUI() {
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const userDropdown = document.getElementById('user-dropdown');
        const reviewLoginPrompt = document.getElementById('review-login-prompt');
        const reviewForm = document.getElementById('review-form');
        const feedbackLoginPrompt = document.getElementById('feedback-login-prompt');
        const feedbackForm = document.getElementById('feedback-form');
        
        if (this.currentUser) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (userDropdown) {
                userDropdown.style.display = 'flex';
                document.getElementById('username-display').textContent = this.currentUser.name.split(' ')[0];
                document.getElementById('user-avatar-img').src = this.currentUser.avatar || 'images/default-avatar.jpg';
            }
            
            if (reviewLoginPrompt) reviewLoginPrompt.style.display = 'none';
            if (reviewForm) reviewForm.style.display = 'block';
            if (feedbackLoginPrompt) feedbackLoginPrompt.style.display = 'none';
            if (feedbackForm) feedbackForm.style.display = 'block';
        } else {
            // User is not logged in
            if (loginBtn) loginBtn.style.display = 'block';
            if (signupBtn) signupBtn.style.display = 'block';
            if (userDropdown) userDropdown.style.display = 'none';
            
            if (reviewLoginPrompt) reviewLoginPrompt.style.display = 'block';
            if (reviewForm) reviewForm.style.display = 'none';
            if (feedbackLoginPrompt) feedbackLoginPrompt.style.display = 'block';
            if (feedbackForm) feedbackForm.style.display = 'none';
        }
    }
    
    // Handle login
    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorElement = document.getElementById('login-error');
        
        // Basic validation
        if (!email || !password) {
            this.showError(errorElement, 'Please fill in all fields');
            return;
        }
        
        // Find user
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            this.showError(errorElement, 'User not found');
            return;
        }
        
        // In a real app, you would verify the hashed password
        if (user.password !== password) {
            this.showError(errorElement, 'Incorrect password');
            return;
        }
        
        // Successful login
        this.currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            joinedDate: user.joinedDate
        };
        
        // Save to localStorage
        localStorage.setItem('secureFolderCurrentUser', JSON.stringify(this.currentUser));
        
        // Update UI
        this.updateAuthUI();
        
        // Hide modal
        this.hideModal('login');
        
        // Clear form
        document.getElementById('login-form').reset();
        this.hideError(errorElement);
        
        // Show welcome notification
        notifications.addNotification({
            title: 'Welcome back!',
            message: `You've successfully logged in as ${this.currentUser.name}`,
            type: 'success',
            read: false
        });
    }
    
    // Handle signup
    handleSignup() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const errorElement = document.getElementById('signup-error');
        
        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            this.showError(errorElement, 'Please fill in all fields');
            return;
        }
        
        if (password.length < 6) {
            this.showError(errorElement, 'Password must be at least 6 characters');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showError(errorElement, 'Passwords do not match');
            return;
        }
        
        // Check if user already exists
        if (this.users.some(u => u.email === email)) {
            this.showError(errorElement, 'Email already registered');
            return;
        }
        
        // Create new user
        const newUser = {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            name: name,
            email: email,
            password: password, // In a real app, you would hash this
            avatar: 'images/default-avatar.jpg',
            joinedDate: new Date().toISOString()
        };
        
        // Add to users array
        this.users.push(newUser);
        localStorage.setItem('secureFolderUsers', JSON.stringify(this.users));
        
        // Set as current user
        this.currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            joinedDate: newUser.joinedDate
        };
        
        localStorage.setItem('secureFolderCurrentUser', JSON.stringify(this.currentUser));
        
        // Update UI
        this.updateAuthUI();
        
        // Hide modal
        this.hideModal('signup');
        
        // Clear form
        document.getElementById('signup-form').reset();
        this.hideError(errorElement);
        
        // Show welcome notification
        notifications.addNotification({
            title: 'Welcome to Secure Folder!',
            message: `Thanks for joining our community, ${name}!`,
            type: 'success',
            read: false
        });
    }
    
    // Handle forgot password
    handleForgotPassword() {
        const email = document.getElementById('reset-email').value;
        const errorElement = document.getElementById('forgot-error');
        const successElement = document.getElementById('forgot-success');
        
        if (!email) {
            this.showError(errorElement, 'Please enter your email');
            return;
        }
        
        // Check if user exists
        const userExists = this.users.some(u => u.email === email);
        
        if (!userExists) {
            this.showError(errorElement, 'No account found with that email');
            return;
        }
        
        // In a real app, you would send a password reset email
        this.hideError(errorElement);
        this.showSuccess(successElement, 'If an account exists with this email, you will receive a password reset link.');
        
        // Clear form after 3 seconds
        setTimeout(() => {
            document.getElementById('forgot-password-form').reset();
            this.hideSuccess(successElement);
            this.hideModal('forgot-password');
        }, 3000);
    }
    
    // Handle logout
    handleLogout() {
        // Clear current user
        this.currentUser = null;
        localStorage.removeItem('secureFolderCurrentUser');
        
        // Update UI
        this.updateAuthUI();
        
        // Show logout notification
        notifications.addNotification({
            title: 'Logged out',
            message: 'You have been successfully logged out',
            type: 'info',
            read: false
        });
    }
    
    // Show user profile
    showUserProfile() {
        if (!this.currentUser) return;
        
        const modal = document.getElementById('profile-modal');
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const profileAvatar = document.getElementById('profile-avatar-img');
        const reviewsCount = document.getElementById('reviews-count');
        const feedbackCount = document.getElementById('feedback-count');
        const memberSince = document.getElementById('member-since');
        
        // Set profile info
        profileName.textContent = this.currentUser.name;
        profileEmail.textContent = this.currentUser.email;
        profileAvatar.src = this.currentUser.avatar || 'images/default-avatar.jpg';
        
        // Calculate member since days
        const joinDate = new Date(this.currentUser.joinedDate);
        const today = new Date();
        const diffTime = Math.abs(today - joinDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        memberSince.textContent = diffDays;
        
        // Load user reviews
        this.loadUserReviews();
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Avatar upload
        document.getElementById('avatar-upload').addEventListener('change', (e) => {
            this.handleAvatarUpload(e.target.files[0]);
        });
    }
    
    // Load user reviews for profile
    loadUserReviews() {
        if (!this.currentUser) return;
        
        const reviewsList = document.getElementById('user-reviews-list');
        const reviewsCount = document.getElementById('reviews-count');
        
        // Get user's reviews from localStorage
        const allReviews = JSON.parse(localStorage.getItem('secureFolderReviews')) || [];
        const userReviews = allReviews.filter(r => r.userId === this.currentUser.id);
        
        // Update count
        reviewsCount.textContent = userReviews.length;
        
        // Clear existing reviews
        reviewsList.innerHTML = '';
        
        // Add reviews to list
        userReviews.slice(0, 5).forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'user-review-item';
            
            // Create stars based on rating
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                starsHtml += i <= review.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
            }
            
            reviewItem.innerHTML = `
                <div class="user-review-rating">${starsHtml}</div>
                <div class="user-review-text">${review.text}</div>
                <div class="user-review-date">${new Date(review.date).toLocaleDateString()}</div>
            `;
            
            reviewsList.appendChild(reviewItem);
        });
    }
    
    // Handle avatar upload
    handleAvatarUpload(file) {
        if (!file || !file.type.match('image.*')) {
            alert('Please select a valid image file');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            // Update avatar in UI
            document.getElementById('profile-avatar-img').src = e.target.result;
            document.getElementById('user-avatar-img').src = e.target.result;
            
            // Update current user
            this.currentUser.avatar = e.target.result;
            localStorage.setItem('secureFolderCurrentUser', JSON.stringify(this.currentUser));
            
            // Update in users array
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                this.users[userIndex].avatar = e.target.result;
                localStorage.setItem('secureFolderUsers', JSON.stringify(this.users));
            }
            
            // Show success notification
            notifications.addNotification({
                title: 'Avatar updated',
                message: 'Your profile picture has been successfully updated',
                type: 'success',
                read: false
            });
        };
        
        reader.readAsDataURL(file);
    }
    
    // Modal management
    showModal(modalId) {
        const modal = document.getElementById(`${modalId}-modal`);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideModal(modalId) {
        const modal = document.getElementById(`${modalId}-modal`);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    switchModal(fromId, toId) {
        this.hideModal(fromId);
        this.showModal(toId);
    }
    
    // Error handling
    showError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }
    
    hideError(element) {
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
        }
    }
    
    showSuccess(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }
    
    hideSuccess(element) {
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
        }
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Close profile modal
document.querySelector('.close-profile-modal')?.addEventListener('click', () => {
    document.getElementById('profile-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('auth-modal')) {
        const modal = e.target;
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    if (e.target.id === 'profile-modal') {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});