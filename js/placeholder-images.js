// ============================================
// PLACEHOLDER IMAGE GENERATOR
// Generates colored placeholder images for development
// ============================================

class PlaceholderImageGenerator {
    constructor() {
        this.colors = [
            { bg: '#1DA8E8', text: '#FFFFFF' }, // Sky blue
            { bg: '#0D47A1', text: '#FFFFFF' }, // Dark blue
            { bg: '#1565C0', text: '#FFFFFF' }, // Medium blue
            { bg: '#1976D2', text: '#FFFFFF' }, // Bright blue
            { bg: '#0288D1', text: '#FFFFFF' }, // Light blue
            { bg: '#01579B', text: '#FFFFFF' }, // Navy
        ];
    }
    
    generatePlaceholder(text, width = 800, height = 600, colorIndex = 0) {
        const color = this.colors[colorIndex % this.colors.length];
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = color.bg;
        ctx.fillRect(0, 0, width, height);
        
        // Gradient overlay
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.2)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Text
        ctx.fillStyle = color.text;
        ctx.font = 'bold 32px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Wrap text
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > width - 40) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        lines.push(currentLine);
        
        const lineHeight = 40;
        const startY = (height - (lines.length * lineHeight)) / 2;
        
        lines.forEach((line, index) => {
            ctx.fillText(line, width / 2, startY + (index * lineHeight));
        });
        
        // Add decorative circle
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.3, 0, Math.PI * 2);
        ctx.stroke();
        
        return canvas.toDataURL('image/jpeg', 0.8);
    }
    
    createPlaceholderImages() {
        const imageMap = {
            'assets/images/logo.png': 'Organization Logo',
            'assets/images/hero-1.jpg': 'Hero Slide 1\nCommunity Building',
            'assets/images/hero-2.jpg': 'Hero Slide 2\nInnovation',
            'assets/images/hero-3.jpg': 'Hero Slide 3\nEmpowerment',
            'assets/images/news-1.jpg': 'Featured News 1\nInfrastructure Project',
            'assets/images/news-2.jpg': 'Featured News 2\nEducation Reform',
            'assets/images/news-3.jpg': 'Featured News 3\nEnvironmental Protection',
            'assets/images/issue-1.jpg': 'Key Issue\nHealthcare Access',
            'assets/images/issue-2.jpg': 'Key Issue\nEconomic Growth',
            'assets/images/issue-3.jpg': 'Key Issue\nEducation Reform',
            'assets/images/profile-1.jpg': 'Profile\nJane Doe',
            'assets/images/profile-2.jpg': 'Profile\nJohn Smith',
            'assets/images/profile-3.jpg': 'Profile\nMaria Garcia',
        };
        
        Object.entries(imageMap).forEach(([path, text], index) => {
            const img = document.querySelector(`img[src="${path}"]`);
            if (img) {
                const width = img.closest('.logo-circle') ? 200 : 800;
                const height = img.closest('.logo-circle') ? 200 : 600;
                img.src = this.generatePlaceholder(text, width, height, index);
                img.classList.add('loaded');
            }
        });
        
        // Handle hero background images
        document.querySelectorAll('.hero-image').forEach((el, index) => {
            const text = `Hero Slide ${index + 1}`;
            const dataUrl = this.generatePlaceholder(text, 1200, 800, index);
            el.style.backgroundImage = `url(${dataUrl})`;
        });
    }
}

// Auto-generate placeholders on page load
document.addEventListener('DOMContentLoaded', () => {
    const generator = new PlaceholderImageGenerator();
    generator.createPlaceholderImages();
});
