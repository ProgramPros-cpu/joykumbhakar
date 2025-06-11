// Feedback System
class FeedbackSystem {
    constructor() {
        this.feedbackItems = JSON.parse(localStorage.getItem('secureFolderFeedback')) || [];
        this.initFeedbackEvents();
    }
    
    // Initialize feedback event listeners
    initFeedbackEvents() {
        // Feedback form submission
        document.getElementById('feedback-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFeedbackSubmit();
        });
    }
    
    // Handle feedback submission
    handleFeedbackSubmit() {
        if (!auth.currentUser) {
            alert('Please login to submit feedback');
            return;
        }
        
        const type = document.getElementById('feedback-type').value;
        const subject = document.getElementById('feedback-subject').value;
        const message = document.getElementById('feedback-message').value;
        const screenshot = document.getElementById('feedback-screenshot').files[0];
        
        if (!type || !subject || !message) {
            alert('Please fill all required fields');
            return;
        }
        
        // Create new feedback
        const newFeedback = {
            id: 'feedback_' + Math.random().toString(36).substr(2, 9),
            userId: auth.currentUser.id,
            userName: auth.currentUser.name,
            type: type,
            subject: subject,
            message: message,
            screenshot: screenshot ? screenshot.name : null,
            date: new Date().toISOString(),
            status: 'open'
        };
        
        // Add to feedback array
        this.feedbackItems.unshift(newFeedback);
        localStorage.setItem('secureFolderFeedback', JSON.stringify(this.feedbackItems));
        
        // Update user's feedback count in profile
        auth.loadUserReviews();
        
        // Reset form
        document.getElementById('feedback-form').reset();
        
        // Show success notification
        notifications.addNotification({
            title: 'Feedback submitted',
            message: 'Thank you for your feedback! We appreciate your input.',
            type: 'success',
            read: false
        });
        
        // In a real app, you would send this to your backend
        console.log('New feedback:', newFeedback);
    }
}

// Initialize feedback system
const feedback = new FeedbackSystem();