// ============================================
// GALLERY CAROUSEL
// ============================================
class GalleryCarousel {
    constructor() {
        this.track = document.getElementById('galleryTrack');
        this.slides = document.querySelectorAll('.gallery-slide');
        this.dotsContainer = document.getElementById('galleryDots');
        this.prevBtn = document.querySelector('.gallery-prev');
        this.nextBtn = document.querySelector('.gallery-next');
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoplayDelay = 5000; // 5 seconds
        this.autoplayInterval = null;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        if (this.totalSlides === 0) return;
        
        this.createDots();
        this.updateSlide();
        this.addEventListeners();
        this.startAutoplay();
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('.gallery-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    goToSlide(index) {
        if (this.isTransitioning) return;
        if (index === this.currentIndex) return;
        
        this.isTransitioning = true;
        this.currentIndex = index;
        
        // Handle wrap-around
        if (index < 0) {
            this.currentIndex = this.totalSlides - 1;
        } else if (index >= this.totalSlides) {
            this.currentIndex = 0;
        }
        
        this.updateSlide();
        
        // Reset transitioning flag after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }
    
    nextSlide() {
        this.goToSlide(this.currentIndex + 1);
    }
    
    prevSlide() {
        this.goToSlide(this.currentIndex - 1);
    }
    
    updateSlide() {
        const translateX = -(this.currentIndex * 100);
        this.track.style.transform = `translateX(${translateX}%)`;
        this.updateDots();
    }
    
    addEventListeners() {
        // Button navigation
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoplay();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoplay();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const gallerySection = document.getElementById('gallery');
            const rect = gallerySection?.getBoundingClientRect();
            
            // Only respond when gallery is visible in viewport
            if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                    this.resetAutoplay();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                    this.resetAutoplay();
                }
            }
        });
        
        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
                this.resetAutoplay();
            }
        });
        
        // Pause autoplay on hover
        const carousel = document.getElementById('galleryCarousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoplay());
            carousel.addEventListener('mouseleave', () => this.startAutoplay());
            
            // Touch events for mobile - pause on touch, resume after
            carousel.addEventListener('touchstart', () => this.stopAutoplay(), { passive: true });
            carousel.addEventListener('touchend', () => {
                setTimeout(() => this.startAutoplay(), 3000);
            });
        }
        
        // Handle visibility change - pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoplay();
            } else {
                this.startAutoplay();
            }
        });
    }
    
    startAutoplay() {
        if (this.autoplayInterval) return;
        
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// ============================================
// INITIALIZE GALLERY ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    new GalleryCarousel();
});
