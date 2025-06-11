// Download Tracking System
class DownloadTracker {
    constructor() {
        this.downloads = JSON.parse(localStorage.getItem('secureFolderDownloads')) || {
            total: 2500000,
            today: 0,
            dates: {}
        };
        
        this.initDownloadEvents();
        this.updateDownloadCounters();
    }
    
    initDownloadEvents() {
        // Play Store download
        document.getElementById('play-store-download')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.trackDownload('play-store');
            window.open('https://play.google.com/store/apps/details?id=com.securefolder.app', '_blank');
        });
        
        // Direct download
        document.getElementById('direct-download')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.trackDownload('direct');
            
            // Show download counter
            this.showDownloadCounter();
            
            // In a real app, this would trigger the actual download
            console.log('Initiating direct download...');
        });
    }
    
    trackDownload(type) {
        const today = new Date().toISOString().split('T')[0];
        
        // Update counts
        this.downloads.total++;
        this.downloads.today++;
        
        // Update date tracking
        if (!this.downloads.dates[today]) {
            this.downloads.dates[today] = 0;
        }
        this.downloads.dates[today]++;
        
        // Save to localStorage
        localStorage.setItem('secureFolderDownloads', JSON.stringify(this.downloads));
        
        // Update UI
        this.updateDownloadCounters();
        
        // Send to analytics in a real app
        console.log(`Download tracked - Type: ${type}, Total: ${this.downloads.total}`);
    }
    
    updateDownloadCounters() {
        // Update main counter
        const totalElement = document.getElementById('total-downloads');
        if (totalElement) {
            totalElement.textContent = this.formatNumber(this.downloads.total);
            totalElement.setAttribute('data-count', this.downloads.total);
        }
        
        // Animate the counter if needed
        this.animateCounter('total-downloads');
    }
    
    animateCounter(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const target = parseInt(element.getAttribute('data-count'));
        const current = parseInt(element.textContent.replace(/,/g, ''));
        
        if (current < target) {
            const increment = Math.ceil((target - current) / 10);
            element.textContent = this.formatNumber(current + increment);
            setTimeout(() => this.animateCounter(elementId), 50);
        }
    }
    
    showDownloadCounter() {
        const counter = document.createElement('div');
        counter.className = 'download-counter';
        counter.textContent = `Downloading... (${this.formatNumber(this.downloads.total)} total downloads)`;
        document.body.appendChild(counter);
        
        // Show counter
        counter.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            counter.style.opacity = '0';
            setTimeout(() => counter.remove(), 500);
        }, 3000);
    }
    
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

// Initialize download tracker
const downloadTracker = new DownloadTracker();