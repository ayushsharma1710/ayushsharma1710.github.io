// ============================================
// MAIN JAVASCRIPT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeCarousels();
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeLazyLoading();
    initializeDarkMode();
    initializeMobileMenu();
    initializeFloatingPanel();
});

// Initialize all carousels
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
}

// Scroll animations using Intersection Observer
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.news-card, .issue-card, .achievement-card, .profile-card, .section-title'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger children animations
                const children = entry.target.parentElement?.children;
                if (children) {
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 100);
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe section containers
    document.querySelectorAll('.carousel-track, .achievements-grid').forEach(section => {
        observer.observe(section);
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Lazy loading images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                
                // Fallback for cached images
                if (img.complete) {
                    img.classList.add('loaded');
                }
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    // Load visible images immediately
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

// Dark mode toggle
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
        });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', 
                e.matches ? 'dark' : 'light'
            );
        }
    });
}

// Mobile menu toggle
function initializeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
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
                    
                    // Close other dropdowns
                    navItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
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
        }
    });
}

// Floating panel behavior
function initializeFloatingPanel() {
    const panel = document.getElementById('floatingPanel');
    if (!panel) return;
    
    // Show/hide based on scroll position
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 300) {
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(-50%) scale(1)';
        } else {
            panel.style.opacity = '0.5';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Handle window resize for carousels
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Carousels will auto-update via their internal listeners
        document.querySelectorAll('.carousel-track').forEach(track => {
            track.style.transition = 'none';
            setTimeout(() => {
                track.style.transition = '';
            }, 50);
        });
    }, 250);
});
