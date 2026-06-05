// ============================================
// STICKY HEADER BEHAVIOR
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    let headerHeight = header.offsetHeight;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Don't hide header if at top or mobile menu is open
        if (currentScrollY <= headerHeight || 
            document.querySelector('.mobile-menu.active')) {
            header.classList.remove('hidden');
            lastScrollY = currentScrollY;
            return;
        }
        
        // Scrolling down - hide header
        if (currentScrollY > lastScrollY && currentScrollY > headerHeight) {
            header.classList.add('hidden');
        } 
        // Scrolling up - show header
        else if (currentScrollY < lastScrollY) {
            header.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Recalculate header height on resize
    window.addEventListener('resize', () => {
        headerHeight = header.offsetHeight;
    });
});
