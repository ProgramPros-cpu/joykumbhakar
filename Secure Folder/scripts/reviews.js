// Reviews System
class ReviewsSystem {
    constructor() {
        this.reviews = JSON.parse(localStorage.getItem('secureFolderReviews')) || [];
        this.initReviewEvents();
        this.loadReviews();
    }
    
    // Initialize review event listeners
    initReviewEvents() {
        // Star rating
        const stars = document.querySelectorAll('.stars i');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-rating'));
                document.getElementById('review-rating').value = rating;
                
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add('fas', 'active');
                        s.classList.remove('far');
                    } else {
                        s.classList.remove('fas', 'active');
                        s.classList.add('far');
                    }
                });
            });
        });
        
        // Review form submission
        document.getElementById('review-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleReviewSubmit();
        });
    }
    
    // Load reviews from storage
    loadReviews() {
        const slider = document.querySelector('.testimonials-slider');
        if (!slider) return;
        
        // Clear existing reviews
        slider.innerHTML = '';
        
        // Add reviews to slider
        this.reviews.forEach(review => {
            this.addReviewToSlider(review);
        });
        
        // Initialize slick slider
        if (typeof $ !== 'undefined' && $.fn.slick) {
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
    }
    
    // Handle review submission
    handleReviewSubmit() {
        if (!auth.currentUser) {
            alert('Please login to submit a review');
            return;
        }
        
        const rating = document.getElementById('review-rating').value;
        const text = document.getElementById('review-text').value;
        
        if (rating == 0) {
            alert('Please select a rating');
            return;
        }
        
        if (text.length < 10) {
            alert('Please write a more detailed review');
            return;
        }
        
        // Create new review
        const newReview = {
            id: 'review_' + Math.random().toString(36).substr(2, 9),
            userId: auth.currentUser.id,
            userName: auth.currentUser.name,
            userAvatar: auth.currentUser.avatar,
            rating: parseInt(rating),
            text: text,
            date: new Date().toISOString()
        };
        
        // Add to reviews array
        this.reviews.unshift(newReview);
        localStorage.setItem('secureFolderReviews', JSON.stringify(this.reviews));
        
        // Add to UI
        this.addReviewToSlider(newReview);
        
        // Reset form
        document.getElementById('review-form').reset();
        document.querySelectorAll('.stars i').forEach(star => {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        });
        document.getElementById('review-rating').value = 0;
        
        // Show success notification
        notifications.addNotification({
            title: 'Review submitted',
            message: 'Thank you for your review!',
            type: 'success',
            read: false
        });
        
        // Refresh slider if slick is loaded
        if (typeof $ !== 'undefined' && $.fn.slick) {
            $('.testimonials-slider').slick('refresh');
        }
    }
    
    // Add review to slider
    addReviewToSlider(review) {
        const slider = document.querySelector('.testimonials-slider');
        if (!slider) return;
        
         // After adding review:
        this.updateAverageRating();
    }
    
    addReviewToSlider(review) {
        const slider = document.querySelector('.testimonials-slider');
        if (!slider) return;
        
        // Create stars HTML
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += i <= review.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }
        
        // Create replies HTML if they exist
        let repliesHtml = '';
        if (review.replies && review.replies.length > 0) {
            repliesHtml = review.replies.map(reply => `
                <div class="review-reply ${reply.isAdmin ? 'admin-reply' : ''}">
                    <div class="reply-header">
                        <span class="reply-author">${reply.author}</span>
                        <span class="reply-date">${new Date(reply.date).toLocaleDateString()}</span>
                    </div>
                    <div class="reply-message">${reply.message}</div>
                </div>
            `).join('');
        }
        
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <div class="review-header">
                <img src="${review.userAvatar || 'images/default-avatar.jpg'}" alt="${review.userName}" class="review-avatar">
                <div class="review-author">
                    <div class="review-author-name">${review.userName}</div>
                    <div class="review-rating">${starsHtml}</div>
                    <div class="review-author-date">${new Date(review.date).toLocaleDateString()}</div>
                </div>
            </div>
            <div class="review-message">${review.text}</div>
            ${repliesHtml}
            ${auth.currentUser?.id === review.userId ? '' : '<button class="reply-btn" data-review-id="${review.id}">Reply</button>'}
        `;
        
        // Add reply event listener
        const replyBtn = reviewItem.querySelector('.reply-btn');
        if (replyBtn) {
            replyBtn.addEventListener('click', (e) => {
                this.showReplyModal(review.id);
            });
        }
        
        slider.appendChild(reviewItem);
    }
    
    showReplyModal(reviewId) {
        if (!auth.currentUser) {
            auth.showModal('login');
            return;
        }
        
        document.getElementById('reply-review-id').value = reviewId;
        document.getElementById('reply-message').value = '';
        document.getElementById('reply-error').style.display = 'none';
        
        const modal = document.getElementById('reply-modal');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    handleReplySubmit() {
        const reviewId = document.getElementById('reply-review-id').value;
        const message = document.getElementById('reply-message').value;
        const errorElement = document.getElementById('reply-error');
        
        if (!message) {
            this.showError(errorElement, 'Please enter a reply message');
            return;
        }
        
        // Find the review
        const reviewIndex = this.reviews.findIndex(r => r.id === reviewId);
        if (reviewIndex === -1) {
            this.showError(errorElement, 'Review not found');
            return;
        }
        
        // Create reply
        const reply = {
            id: 'reply_' + Math.random().toString(36).substr(2, 9),
            author: auth.currentUser.name,
            message: message,
            date: new Date().toISOString(),
            isAdmin: auth.currentUser.email.endsWith('@securefolder.com') // Example admin check
        };
        
        // Add reply to review
        if (!this.reviews[reviewIndex].replies) {
            this.reviews[reviewIndex].replies = [];
        }
        this.reviews[reviewIndex].replies.push(reply);
        
        // Save to localStorage
        localStorage.setItem('secureFolderReviews', JSON.stringify(this.reviews));
        
        // Hide modal
        document.getElementById('reply-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reload reviews
        this.loadReviews();
        
        // Notify review author if not self-reply
        if (auth.currentUser.id !== this.reviews[reviewIndex].userId) {
            notifications.addNotification({
                title: 'New reply to your review',
                message: `${auth.currentUser.name} responded to your review`,
                type: 'reply',
                read: false,
                reviewId: reviewId
            });
        }
    }
    
    showError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }
}


// Initialize reviews system
const reviews = new ReviewsSystem();