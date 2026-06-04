// ============================================
// MAIN JAVASCRIPT - SIMPLIFIED (NO CAROUSEL)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeMobileMenu();
    initializeHeroImages();
    initializeLogoImage();
    initializeContactScroll();
    initializeStrengthsAnimation();
    forceImagesVisible();
});

// ============================================
// FORCE CRITICAL IMAGES VISIBLE
// ============================================
function forceImagesVisible() {
    // Force logo images to be visible immediately
    document.querySelectorAll('.logo-img').forEach(img => {
        img.style.opacity = '1';
        img.classList.add('loaded');
    });
    
    // Force hero slogan image visible
    document.querySelectorAll('.hero-slogan-image img').forEach(img => {
        img.style.opacity = '1';
        img.classList.add('loaded');
    });
    
    // Force hero background image visible
    document.querySelectorAll('.hero-image').forEach(img => {
        img.style.opacity = '1';
        img.classList.add('loaded');
    });
    
    // Force all other images
    document.querySelectorAll('img').forEach(img => {
        if (img.complete && img.naturalWidth > 0) {
            img.style.opacity = '1';
            img.classList.add('loaded');
        }
    });
}

// ============================================
// STRENGTHS ANIMATION
// ============================================
function initializeStrengthsAnimation() {
    const strengthItems = document.querySelectorAll('.strengths-list li');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('li');
                items.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    item.style.transition = 'all 0.4s ease';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });
    
    const strengthsList = document.querySelector('.strengths-list');
    if (strengthsList) {
        observer.observe(strengthsList);
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.achievement-card, .section-title, .hero-slogan-image'
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
                const menu = document.querySelector('.nav-menu');
                const toggle = document.querySelector('.mobile-menu-toggle');
                if (menu && menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    toggle?.classList.remove('active');
                    
                    const spans = toggle?.querySelectorAll('span');
                    if (spans) {
                        spans[0].style.transform = 'none';
                        spans[1].style.opacity = '1';
                        spans[2].style.transform = 'none';
                    }
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
    const menu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
            
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
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav') && menu.classList.contains('active')) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && menu.classList.contains('active')) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// ============================================
// HERO SLOGAN IMAGE HANDLING
// ============================================
function initializeHeroImages() {
    const sloganImages = document.querySelectorAll('.hero-slogan-image img');
    
    sloganImages.forEach((img, index) => {
        img.style.opacity = '1';
        
        img.addEventListener('load', () => {
            img.classList.add('loaded');
            img.style.opacity = '1';
        });
        
        img.addEventListener('error', () => {
            console.warn(`Hero slogan image ${index + 1} failed to load`);
            createFallbackImage(img, index);
        });
        
        if (img.complete) {
            if (img.naturalWidth === 0) {
                createFallbackImage(img, index);
            } else {
                img.classList.add('loaded');
                img.style.opacity = '1';
            }
        }
    });
    
    // Handle hero background images
    const heroImages = document.querySelectorAll('.hero-image');
    heroImages.forEach((heroImg, index) => {
        heroImg.style.opacity = '1';
        
        const bgImage = heroImg.style.backgroundImage;
        if (bgImage && bgImage !== 'none') {
            const url = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
            const tempImg = new Image();
            tempImg.onload = () => {
                heroImg.classList.add('loaded');
                heroImg.style.opacity = '1';
            };
            tempImg.onerror = () => {
                console.warn(`Hero background image ${index + 1} failed to load`);
                heroImg.style.background = 'linear-gradient(135deg, #1DA8E8, #0D47A1)';
                heroImg.classList.add('loaded');
            };
            tempImg.src = url;
        }
    });
}

// ============================================
// LOGO IMAGE HANDLING
// ============================================
function initializeLogoImage() {
    const logoImages = document.querySelectorAll('.logo-img');
    
    logoImages.forEach(img => {
        img.style.opacity = '1';
        
        img.addEventListener('load', () => {
            img.classList.add('loaded');
            img.style.opacity = '1';
        });
        
        img.addEventListener('error', () => {
            console.warn('Logo image failed to load');
            const logoCircle = img.closest('.logo-circle');
            if (logoCircle) {
                const orgName = document.querySelector('.org-name')?.textContent || 'A';
                logoCircle.innerHTML = `<span style="
                    color: #1DA8E8;
                    font-family: 'Oswald', sans-serif;
                    font-size: 24px;
                    font-weight: 700;
                    line-height: 1;
                ">${orgName.charAt(0)}</span>`;
                logoCircle.style.background = '#e8f6fd';
            }
        });
        
        if (img.complete) {
            if (img.naturalWidth === 0) {
                img.dispatchEvent(new Event('error'));
            } else {
                img.classList.add('loaded');
                img.style.opacity = '1';
            }
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
    
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#1DA8E8');
    gradient.addColorStop(0.5, '#1976D2');
    gradient.addColorStop(1, '#0D47A1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(size/2, size/2, i * 30, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const lines = ['Building a Better', 'Future Together'];
    lines.forEach((line, i) => {
        ctx.fillText(line, size/2, size/2 - 20 + (i * 40));
    });
    
    ctx.font = '48px Arial';
    ctx.fillText('✨', size/2, size/2 + 60);
    
    img.src = canvas.toDataURL('image/png');
    img.classList.add('loaded', 'fallback-image');
    img.style.opacity = '1';
}

// ============================================
// CONTACT BUTTON SCROLL
// ============================================
function initializeContactScroll() {
    const contactButtons = document.querySelectorAll('a[href="#contact"]');
    contactButtons.forEach(button => {
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
// PERFORMANCE OPTIMIZATION
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

const handleResize = debounce(() => {
    forceImagesVisible();
}, 250);

window.addEventListener('resize', handleResize);

// ============================================
// INITIAL LOAD
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    forceImagesVisible();
    console.log('✅ Website fully loaded and initialized');
});

// Force images visible after a short delay
setTimeout(forceImagesVisible, 500);
setTimeout(forceImagesVisible, 1000);
