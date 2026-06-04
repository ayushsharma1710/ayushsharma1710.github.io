// ============================================
// UNIVERSAL CAROUSEL SYSTEM
// ============================================
class Carousel {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.track = this.container.querySelector('.carousel-track');
        this.slides = this.track.children;
        this.dotsContainer = this.container.querySelector('.carousel-dots');
        this.prevButton = this.container.closest('section')?.querySelector(`.prev-${containerId.replace('Carousel', '')}`) ||
                         this.container.querySelector('.carousel-prev');
        this.nextButton = this.container.closest('section')?.querySelector(`.next-${containerId.replace('Carousel', '')}`) ||
                         this.container.querySelector('.carousel-next');
        
        this.currentIndex = 0;
        this.slidesPerView = options.slidesPerView || 3;
        this.autoplay = options.autoplay || false;
        this.autoplayDelay = options.autoplayDelay || 5000;
        this.loop = options.loop || false;
        this.autoplayInterval = null;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.updateCarousel();
        this.addEventListeners();
        
        if (this.autoplay) {
            this.startAutoplay();
        }
        
        // Recalculate on resize
        window.addEventListener('resize', () => {
            this.updateSlidesPerView();
            this.updateCarousel();
        });
    }
    
    updateSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 768) {
            this.slidesPerView = 1;
        } else if (width <= 1024) {
            this.slidesPerView = 2;
        } else {
            this.slidesPerView = 3;
        }
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        const totalDots = Math.ceil(this.slides.length / this.slidesPerView);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        const activeDotIndex = Math.floor(this.currentIndex / this.slidesPerView);
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }
    
    goToSlide(index) {
        const maxIndex = Math.ceil(this.slides.length / this.slidesPerView) - 1;
        
        if (index < 0) {
            this.currentIndex = this.loop ? maxIndex : 0;
        } else if (index > maxIndex) {
            this.currentIndex = this.loop ? 0 : maxIndex;
        } else {
            this.currentIndex = index;
        }
        
        this.updateCarousel();
        this.updateDots();
    }
    
    nextSlide() {
        this.goToSlide(this.currentIndex + 1);
    }
    
    prevSlide() {
        this.goToSlide(this.currentIndex - 1);
    }
    
    updateCarousel() {
        const slideWidth = 100 / this.slidesPerView;
        const translateX = -(this.currentIndex * slideWidth * this.slidesPerView);
        
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update slide styles for grid layout
        Array.from(this.slides).forEach(slide => {
            slide.style.flex = `0 0 ${slideWidth}%`;
        });
    }
    
    addEventListeners() {
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextSlide());
        }
        
        // Touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
        
        // Pause autoplay on hover
        if (this.autoplay) {
            this.container.addEventListener('mouseenter', () => this.stopAutoplay());
            this.container.addEventListener('mouseleave', () => this.startAutoplay());
        }
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
}
