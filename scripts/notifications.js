// Notifications System
class NotificationsSystem {
    constructor() {
        this.notifications = JSON.parse(localStorage.getItem('secureFolderNotifications')) || [];
        this.initNotificationEvents();
        this.loadNotifications();
        this.checkUnreadCount();
    }
    
    // Initialize notification event listeners
    initNotificationEvents() {
        // Notification dropdown link
        document.getElementById('notification-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleNotificationCenter();
        });
        
        // Close notification center
        document.querySelector('.close-notifications')?.addEventListener('click', () => {
            this.toggleNotificationCenter(false);
        });
    }
    
    // Toggle notification center
    toggleNotificationCenter(show = null) {
        const notificationCenter = document.getElementById('notification-center');
        
        if (show === null) {
            show = !notificationCenter.classList.contains('active');
        }
        
        if (show) {
            notificationCenter.classList.add('active');
            this.markAllAsRead();
        } else {
            notificationCenter.classList.remove('active');
        }
    }
    
    // Load notifications
    loadNotifications() {
        const notificationList = document.querySelector('.notification-list');
        if (!notificationList) return;
        
        // Clear existing notifications
        notificationList.innerHTML = '';
        
        // Add notifications to list
        this.notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item ${notification.read ? '' : 'unread'}`;
            
            notificationItem.innerHTML = `
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${this.formatDate(notification.date)}</div>
            `;
            
            notificationList.appendChild(notificationItem);
        });
    }
    
    // Add new notification
    addNotification(notification) {
        const newNotification = {
            id: 'notif_' + Math.random().toString(36).substr(2, 9),
            title: notification.title,
            message: notification.message,
            type: notification.type || 'info',
            date: new Date().toISOString(),
            read: notification.read || false
        };
        
        // Add to beginning of array
        this.notifications.unshift(newNotification);
        localStorage.setItem('secureFolderNotifications', JSON.stringify(this.notifications));
        
        // Update UI
        this.loadNotifications();
        this.checkUnreadCount();
        
        // Show notification badge
        this.showNotificationBadge();
    }
    
    // Mark all notifications as read
    markAllAsRead() {
        this.notifications = this.notifications.map(notif => ({
            ...notif,
            read: true
        }));
        
        localStorage.setItem('secureFolderNotifications', JSON.stringify(this.notifications));
        this.loadNotifications();
        this.checkUnreadCount();
    }
    
    // Check unread count and update badge
    checkUnreadCount() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.getElementById('notification-count');
        
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
        }
    }
    
    // Show notification badge temporarily
    showNotificationBadge() {
        const badge = document.getElementById('notification-count');
        if (badge) {
            badge.classList.add('pulse');
            setTimeout(() => {
                badge.classList.remove('pulse');
            }, 3000);
        }
    }
    
    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }
}

// Initialize notifications system
const notifications = new NotificationsSystem();

// Add some sample notifications if none exist
if (localStorage.getItem('secureFolderNotifications') === null) {
    notifications.addNotification({
        title: 'Welcome to Secure Folder!',
        message: 'Thank you for visiting our website. Feel free to explore our features.',
        type: 'info',
        read: false
    });
    
    notifications.addNotification({
        title: 'New Update Available',
        message: 'Version 2.5.0 is now available with enhanced security features.',
        type: 'update',
        read: false
    });
}