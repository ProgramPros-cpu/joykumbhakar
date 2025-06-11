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
        
        // Create stars based on rating
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += i <= review.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }
        
        const reviewCard = document.createElement('div');
        reviewCard.className = 'testimonial-card';
        reviewCard.innerHTML = `
            <div class="rating-stars">
                ${starsHtml}
            </div>
            <p class="testimonial-text">${review.text}</p>
            <div class="testimonial-author">
                <div class="author-avatar">
                    <img src="${review.userAvatar || 'images/default-avatar.jpg'}" alt="${review.userName}">
                </div>
                <div class="author-info">
                    <h4>${review.userName}</h4>
                    <p>Verified User</p>
                </div>
            </div>
        `;
        
        // Add to beginning of slider
        slider.insertBefore(reviewCard, slider.firstChild);
    }
}

// Initialize reviews system
const reviews = new ReviewsSystem();
