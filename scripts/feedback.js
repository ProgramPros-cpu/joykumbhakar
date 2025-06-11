// Feedback System with Reply Functionality
class FeedbackSystem {
    constructor() {
        this.feedbackItems = JSON.parse(localStorage.getItem('secureFolderFeedback')) || [];
        this.initFeedbackEvents();
        this.loadUserFeedback();
    }
    
    initFeedbackEvents() {
        // Feedback form submission
        document.getElementById('feedback-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFeedbackSubmit();
        });
        
        // Load feedback when auth state changes
        document.addEventListener('authStateChanged', () => {
            this.loadUserFeedback();
        });
    }
    
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
            status: 'open',
            replies: []
        };
        
        // Add to feedback array
        this.feedbackItems.unshift(newFeedback);
        localStorage.setItem('secureFolderFeedback', JSON.stringify(this.feedbackItems));
        
        // Update user's feedback count in profile
        if (auth.currentUser) {
            auth.loadUserReviews();
        }
        
        // Reset form
        document.getElementById('feedback-form').reset();
        
        // Reload feedback list
        this.loadUserFeedback();
        
        // Show success notification
        notifications.addNotification({
            title: 'Feedback submitted',
            message: 'Thank you for your feedback! We appreciate your input.',
            type: 'success',
            read: false
        });
    }
    
    loadUserFeedback() {
        const feedbackList = document.getElementById('feedback-list');
        if (!feedbackList) return;
        
        // Hide section if no user logged in
        if (!auth.currentUser) {
            document.getElementById('feedback-responses').style.display = 'none';
            return;
        }
        
        // Filter feedback by current user
        const userFeedback = this.feedbackItems
            .filter(item => item.userId === auth.currentUser.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        feedbackList.innerHTML = '';
        
        if (userFeedback.length === 0) {
            feedbackList.innerHTML = '<p>You haven\'t submitted any feedback yet.</p>';
            document.getElementById('feedback-responses').style.display = 'none';
            return;
        }
        
        // Show feedback section
        document.getElementById('feedback-responses').style.display = 'block';
        
        // Add feedback items to list
        userFeedback.forEach(feedback => {
            const feedbackItem = document.createElement('div');
            feedbackItem.className = 'feedback-item';
            
            // Create status badge
            const statusBadge = feedback.status === 'resolved' ? 
                '<span class="feedback-status resolved">Resolved</span>' : 
                '<span class="feedback-status open">Open</span>';
            
            // Create replies HTML if they exist
            let repliesHtml = '';
            if (feedback.replies && feedback.replies.length > 0) {
                repliesHtml = `
                    <div class="feedback-item-replies">
                        <h4>Responses (${feedback.replies.length})</h4>
                        ${feedback.replies.map(reply => `
                            <div class="feedback-reply ${reply.isAdmin ? 'feedback-reply-admin' : ''}">
                                <div class="reply-header">
                                    <span class="reply-author">${reply.author}</span>
                                    <span class="reply-date">${new Date(reply.date).toLocaleDateString()}</span>
                                </div>
                                <div class="reply-message">${reply.message}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            
            feedbackItem.innerHTML = `
                <div class="feedback-item-header">
                    <div class="feedback-item-title">${feedback.subject}</div>
                    <div class="feedback-item-type ${feedback.type}">${feedback.type}</div>
                </div>
                ${statusBadge}
                <div class="feedback-item-date">Submitted on ${new Date(feedback.date).toLocaleDateString()}</div>
                <div class="feedback-item-message">${feedback.message}</div>
                ${feedback.screenshot ? `<div class="feedback-screenshot">Screenshot: ${feedback.screenshot}</div>` : ''}
                ${repliesHtml}
            `;
            
            feedbackList.appendChild(feedbackItem);
        });
    }
    
    // Admin would call this to add replies (in a real app, this would be server-side)
    addReplyToFeedback(feedbackId, message, isAdmin = true) {
        const feedbackIndex = this.feedbackItems.findIndex(f => f.id === feedbackId);
        if (feedbackIndex === -1) return false;
        
        const reply = {
            id: 'reply_' + Math.random().toString(36).substr(2, 9),
            author: isAdmin ? 'Secure Folder Team' : auth.currentUser.name,
            message: message,
            date: new Date().toISOString(),
            isAdmin: isAdmin
        };
        
        // Add reply to feedback
        if (!this.feedbackItems[feedbackIndex].replies) {
            this.feedbackItems[feedbackIndex].replies = [];
        }
        this.feedbackItems[feedbackIndex].replies.push(reply);
        
        // Mark as resolved if admin reply
        if (isAdmin) {
            this.feedbackItems[feedbackIndex].status = 'resolved';
        }
        
        // Save to localStorage
        localStorage.setItem('secureFolderFeedback', JSON.stringify(this.feedbackItems));
        
        // Reload feedback
        this.loadUserFeedback();
        
        // Notify user if admin reply
        if (isAdmin) {
            notifications.addNotification({
                title: 'Response to your feedback',
                message: `The Secure Folder team has responded to your feedback about "${this.feedbackItems[feedbackIndex].subject}"`,
                type: 'feedback',
                read: false,
                feedbackId: feedbackId
            });
        }
        
        return true;
    }
}

// Initialize feedback system
const feedback = new FeedbackSystem();

// Example admin function (would be protected in a real app)
function adminReplyToFeedback(feedbackId, message) {
    return feedback.addReplyToFeedback(feedbackId, message);
}
