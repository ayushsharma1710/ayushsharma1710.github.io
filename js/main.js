// ============================================
// MAIN JAVASCRIPT - COMPLETE REVISED VERSION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeCarousels();
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeLazyLoading();
    initializeDarkMode();
    initializeMobileMenu();
    initializeFloatingPanel();
    initializeHeroImages();
    initializeHoverEffects();
    initializeKeyboardNavigation();
});

// ============================================
// CAROUSEL INITIALIZATION
// ============================================
function initializeCarousels() {
    // Hero Carousel
    const heroCarousel = new Carousel('heroCarousel', {
        slidesPerView: 1,
        autoplay: true,
        autoplayDelay: 5000,
        loop: true
    });
    
    // News Carousel
    const newsCarousel = new Carousel('newsCarousel', {
        slidesPerView: 3,
        autoplay: false
    });
    
    // Issues Carousel
    const issuesCarousel = new Carousel('issuesCarousel', {
        slidesPerView: 3,
        autoplay: true,
        autoplayDelay: 4000
    });
    
    // Inspiration Carousel
    const inspirationCarousel = new Carousel('inspirationCarousel', {
        slidesPerView: 3,
        autoplay: false
    });
    
    // Store carousel instances globally for external access
    window.carousels = {
        hero: heroCarousel,
        news: newsCarousel,
        issues: issuesCarousel,
        inspiration: inspirationCarousel
    };
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.news-card, .issue-card, .achievement-card, .profile-card, .section-title, .hero-slogan-image'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger children animations for card containers
                const children = entry.target.parentElement?.children;
                if (children && entry.target.classList.contains('carousel-track')) {
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 150); // Stagger delay
                    });
                }
                
                // Handle achievements grid separately
                if (entry.target.classList.contains('achievements-grid')) {
                    const cards = entry.target.children;
                    Array.from(cards).forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 100);
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe section containers for staggered animations
    document.querySelectorAll('.carousel-track, .achievements-grid').forEach(section => {
        observer.observe(section);
    });
    
    // Observe individual elements that should animate
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// SMOOTH SCROLLING
// ============================================
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Calculate offset for sticky header
                const headerHeight = document.getElementById('siteHeader')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// LAZY LOADING IMAGES
// ============================================
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Load the image if it has a data-src attribute
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                
                // Handle load event
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                
                // Handle images that are already cached
                if (img.complete) {
                    img.classList.add('loaded');
                }
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px', // Start loading when image is 50px from viewport
        threshold: 0.01
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    // Load visible images immediately (non-lazy)
    setTimeout(() => {
        document.querySelectorAll('img:not([loading="lazy"])').forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => img.classList.add('loaded'));
            }
        });
    }, 100);
}

// ============================================
// DARK MODE TOGGLE
// ============================================
function initializeDarkMode() {
    const toggle = document.querySelector('.dark-mode-toggle');
    const icon = toggle?.querySelector('i');
    
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    if (toggle) {
        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            if (icon) {
                if (newTheme === 'dark') {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
            
            // Add transition class for smooth theme change
            document.body.classList.add('theme-transitioning');
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 300);
        });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', 
                e.matches ? 'dark' : 'light'
            );
            if (icon) {
                if (e.matches) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        }
    });
}

// ============================================
// MOBILE MENU
// ============================================
function initializeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = toggle.querySelectorAll('span');
            if (toggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Handle dropdowns on mobile
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown');
        
        if (dropdown && link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    item.classList.toggle('active');
                    
                    // Smooth dropdown animation
                    if (item.classList.contains('active')) {
                        dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
                    } else {
                        dropdown.style.maxHeight = '0';
                    }
                    
                    // Close other dropdowns
                    navItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherDropdown = otherItem.querySelector('.dropdown');
                            if (otherDropdown) {
                                otherDropdown.style.maxHeight = '0';
                            }
                        }
                    });
                }
            });
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav') && menu.classList.contains('active')) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            
            // Reset hamburger
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            
            // Close all dropdowns
            navItems.forEach(item => {
                item.classList.remove('active');
                const dropdown = item.querySelector('.dropdown');
                if (dropdown) {
                    dropdown.style.maxHeight = '0';
                }
            });
        }
    });
    
    // Close menu on window resize if desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && menu.classList.contains('active')) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            
            navItems.forEach(item => {
                item.classList.remove('active');
                const dropdown = item.querySelector('.dropdown');
                if (dropdown) {
                    dropdown.style.maxHeight = '';
                }
            });
        }
    });
}

// ============================================
// FLOATING PANEL
// ============================================
function initializeFloatingPanel() {
    const panel = document.getElementById('floatingPanel');
    if (!panel) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 300) {
                    panel.style.opacity = '1';
                    panel.style.transform = 'translateY(-50%) scale(1)';
                    panel.style.pointerEvents = 'auto';
                } else {
                    panel.style.opacity = '0';
                    panel.style.transform = 'translateY(-50%) scale(0.8)';
                    panel.style.pointerEvents = 'none';
                }
                
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Add hover sound effect (subtle scale on items)
    const panelItems = panel.querySelectorAll('.panel-item');
    panelItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            panelItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.style.opacity = '0.6';
                }
            });
        });
        
        item.addEventListener('mouseleave', () => {
            panelItems.forEach(otherItem => {
                otherItem.style.opacity = '1';
            });
        });
    });
}

// ============================================
// HERO SLOGAN IMAGE HANDLING
// ============================================
function initializeHeroImages() {
    const sloganImages = document.querySelectorAll('.hero-slogan-image img');
    
    sloganImages.forEach((img, index) => {
        // Add loaded class when image successfully loads
        img.addEventListener('load', () => {
            img.classList.add('loaded');
            // Add a subtle animation
            img.style.animation = 'fadeInUp 0.8s ease forwards';
        });
        
        // If image fails to load, create a fallback
        img.addEventListener('error', () => {
            console.warn(`Hero slogan image ${index + 1} failed to load:`, img.src);
            createFallbackImage(img, index);
        });
        
        // Check if image is already cached/loaded
        if (img.complete) {
            if (img.naturalWidth === 0) {
                // Image failed to load
                createFallbackImage(img, index);
            } else {
                img.classList.add('loaded');
            }
        }
    });
    
    // Handle hero background images
    const heroImages = document.querySelectorAll('.hero-image');
    heroImages.forEach((heroImg, index) => {
        const bgImage = heroImg.style.backgroundImage;
        if (bgImage && bgImage !== 'none') {
            // Preload the background image
            const url = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
            const tempImg = new Image();
            tempImg.onload = () => {
                heroImg.classList.add('loaded');
            };
            tempImg.onerror = () => {
                console.warn(`Hero background image ${index + 1} failed to load`);
                // Apply fallback gradient
                heroImg.style.background = 'linear-gradient(135deg, #1DA8E8, #0D47A1)';
                heroImg.classList.add('loaded');
            };
            tempImg.src = url;
        }
    });
}

// ============================================
// FALLBACK IMAGE GENERATOR
// ============================================
function createFallbackImage(img, index) {
    const canvas = document.createElement('canvas');
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#1DA8E8');
    gradient.addColorStop(0.5, '#1976D2');
    gradient.addColorStop(1, '#0D47A1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add decorative pattern
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(size/2, size/2, i * 30, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Add text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Multi-line text
    const lines = ['Building a Better', 'Future Together'];
    lines.forEach((line, i) => {
        ctx.fillText(line, size/2, size/2 - 20 + (i * 40));
    });
    
    // Add icon
    ctx.font = '48px Arial';
    ctx.fillText('✨', size/2, size/2 + 60);
    
    img.src = canvas.toDataURL('image/png');
    img.classList.add('loaded', 'fallback-image');
}

// ============================================
// HOVER EFFECTS ENHANCEMENT
// ============================================
function initializeHoverEffects() {
    // Add ripple effect to buttons
    document.querySelectorAll('.cta-button, .btn-view-all').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });
    
    // Enhance card hover effects
    document.querySelectorAll('.news-card, .issue-card, .achievement-card, .profile-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Subtle tilt effect (optional, comment out if not wanted)
            // const centerX = rect.width / 2;
            // const centerY = rect.height / 2;
            // const rotateX = (y - centerY) / 20;
            // const rotateY = (centerX - x) / 20;
            // card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Close mobile menu on Escape
        if (e.key === 'Escape') {
            const menu = document.querySelector('.nav-menu');
            const toggle = document.querySelector('.mobile-menu-toggle');
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
                toggle?.classList.remove('active');
            }
        }
        
        // Carousel navigation with arrow keys when focused
        const focusedCarousel = document.activeElement?.closest('.carousel-track');
        if (focusedCarousel && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            e.preventDefault();
            const carouselId = focusedCarousel.parentElement.id;
            const carousel = window.carousels?.[carouselId.replace('Carousel', '').toLowerCase()];
            
            if (carousel) {
                if (e.key === 'ArrowLeft') {
                    carousel.prevSlide();
                } else {
                    carousel.nextSlide();
                }
            }
        }
    });
    
    // Make carousel tracks focusable
    document.querySelectorAll('.carousel-track').forEach(track => {
        track.setAttribute('tabindex', '0');
        track.setAttribute('role', 'region');
        track.setAttribute('aria-label', 'Content carousel');
    });
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize efficiently
const handleResize = debounce(() => {
    // Update carousel layouts
    document.querySelectorAll('.carousel-track').forEach(track => {
        track.style.transition = 'none';
        setTimeout(() => {
            track.style.transition = '';
        }, 50);
    });
    
    // Update any dynamic calculations here
}, 250);

window.addEventListener('resize', handleResize);

// ============================================
// INITIAL LOAD INDICATOR (OPTIONAL)
// ============================================
// Remove any loading states after everything is initialized
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Log successful initialization
    console.log('✅ Website fully loaded and initialized');
    console.log('   - Carousels: Active');
    console.log('   - Dark Mode:', localStorage.getItem('theme') || 'system default');
    console.log('   - Mobile Menu: Ready');
    console.log('   - Scroll Animations: Active');
    console.log('   - Floating Panel: Active');
});

// ============================================
// ERROR HANDLING
// ============================================
// Global error handler for images
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        // Only handle if not already handled by specific initializers
        if (!e.target.classList.contains('loaded') && !e.target.closest('.hero-slogan-image')) {
            e.target.style.background = '#f0f0f0';
            e.target.style.minHeight = '200px';
            e.target.style.display = 'flex';
            e.target.style.alignItems = 'center';
            e.target.style.justifyContent = 'center';
            e.target.alt = 'Image not available';
        }
    }
}, true);

// ============================================
// EXPORT FOR EXTERNAL USE (OPTIONAL)
// ============================================
// Make key functions available globally if needed
window.refreshCarousels = () => {
    Object.values(window.carousels || {}).forEach(carousel => {
        if (carousel && carousel.updateCarousel) {
            carousel.updateCarousel();
        }
    });
};

window.toggleDarkMode = () => {
    const toggle = document.querySelector('.dark-mode-toggle');
    if (toggle) toggle.click();
};
