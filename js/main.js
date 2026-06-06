// ============================================
// MAIN JAVASCRIPT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeMobileMenu();
    initializeHeroImages();
    initializeProfileImages();
    initializeContactScroll();
    forceImagesVisible();
});

// ============================================
// FORCE CRITICAL IMAGES VISIBLE
// ============================================
function forceImagesVisible() {
    document.querySelectorAll('.profile-img, .footer-profile-img img').forEach(img => {
        img.style.opacity = '1';
        img.classList.add('loaded');
    });
    
    document.querySelectorAll('.hero-slogan-image img').forEach(img => {
        img.style.opacity = '1';
        img.classList.add('loaded');
    });
    
    document.querySelectorAll('.gallery-slide img').forEach(img => {
        img.style.opacity = '1';
        img.classList.add('loaded');
    });
    
    document.querySelectorAll('img').forEach(img => {
        if (img.complete && img.naturalWidth > 0) {
            img.style.opacity = '1';
            img.classList.add('loaded');
        }
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.achievement-card, .section-title, .hero-slogan-image, .gallery-slide'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
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
    
    const achievementsGrid = document.querySelector('.achievements-grid');
    if (achievementsGrid) {
        observer.observe(achievementsGrid);
    }
    
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
                const headerHeight = document.getElementById('siteHeader')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                const mobileMenu = document.querySelector('.mobile-menu');
                const toggle = document.querySelector('.mobile-menu-toggle');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    toggle?.classList.remove('active');
                    resetHamburger(toggle);
                }
            }
        });
    });
}

// ============================================
// MOBILE MENU
// ============================================
function initializeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (toggle && mobileMenu) {
        toggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            toggle.classList.toggle('active');
            
            if (toggle.classList.contains('active')) {
                animateHamburgerOpen(toggle);
            } else {
                resetHamburger(toggle);
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.site-header') && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            toggle.classList.remove('active');
            resetHamburger(toggle);
        }
    });
    
    // Close mobile menu on window resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            toggle.classList.remove('active');
            resetHamburger(toggle);
        }
    });
}

function animateHamburgerOpen(toggle) {
    const spans = toggle.querySelectorAll('span');
    if (spans.length >= 3) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    }
}

function resetHamburger(toggle) {
    const spans = toggle.querySelectorAll('span');
    spans.forEach(span => {
        span.style.transform = 'none';
        span.style.opacity = '1';
    });
}

// ============================================
// HERO IMAGES
// ============================================
function initializeHeroImages() {
    document.querySelectorAll('.hero-slogan-image img').forEach((img, index) => {
        img.style.opacity = '1';
        
        img.addEventListener('load', () => {
            img.classList.add('loaded');
            img.style.opacity = '1';
        });
        
        img.addEventListener('error', () => {
            createFallbackImage(img, 'Hero Slogan');
        });
        
        if (img.complete && img.naturalWidth > 0) {
            img.classList.add('loaded');
            img.style.opacity = '1';
        }
    });
}

// ============================================
// PROFILE IMAGES
// ============================================
function initializeProfileImages() {
    document.querySelectorAll('.profile-img, .footer-profile-img img').forEach(img => {
        img.style.opacity = '1';
        
        img.addEventListener('load', () => {
            img.classList.add('loaded');
            img.style.opacity = '1';
        });
        
        img.addEventListener('error', () => {
            console.warn('Profile image failed to load');
            const container = img.closest('.header-profile-img, .footer-profile-img');
            if (container) {
                container.style.background = '#1DA8E8';
                container.innerHTML = '<span style="color:#fff;font-weight:700;font-size:18px;">AS</span>';
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.justifyContent = 'center';
            }
        });
        
        if (img.complete && img.naturalWidth > 0) {
            img.classList.add('loaded');
            img.style.opacity = '1';
        }
    });
}

// ============================================
// FALLBACK IMAGE GENERATOR
// ============================================
function createFallbackImage(img, text) {
    const canvas = document.createElement('canvas');
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#1DA8E8');
    gradient.addColorStop(1, '#0D47A1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, size/2, size/2);
    
    img.src = canvas.toDataURL('image/png');
    img.classList.add('loaded');
    img.style.opacity = '1';
}

// ============================================
// CONTACT BUTTON SCROLL
// ============================================
function initializeContactScroll() {
    document.querySelectorAll('a[href="#contact"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById('contact');
            if (target) {
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
// PERFORMANCE
// ============================================
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

window.addEventListener('resize', debounce(() => {
    forceImagesVisible();
}, 250));

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    forceImagesVisible();
});

setTimeout(forceImagesVisible, 500);
setTimeout(forceImagesVisible, 1000);

// Share Website
function shareWebsite() {
    const url = window.location.href;
    const title = document.title;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        });
    } else {
        navigator.clipboard.writeText(url).then(() => {
            alert('Website link copied to clipboard!');
        });
    }
}
