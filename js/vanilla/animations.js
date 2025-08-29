/**
 * Vanilla JavaScript Animations
 * Lightweight animations without external dependencies
 */

function initVanillaAnimations() {
    'use strict';
    
    const config = window.AnimationConfig;
    
    if (config.prefersReducedMotion()) {
        console.log('🚫 Reduced motion preferred, skipping animations');
        return;
    }
    
    // Fade-in animation
    function fadeInElements(selector, delay = 0, duration = 600) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay + (index * 100));
        });
        
        config.trackAnimation('fadeIn', duration, elements.length);
    }
    
    // Slide-in animation
    function slideInElements(selector, direction = 'left', delay = 0) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            const transform = direction === 'left' ? 'translateX(-50px)' : 'translateX(50px)';
            element.style.opacity = '0';
            element.style.transform = transform;
            element.style.transition = 'opacity 800ms ease, transform 800ms ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
            }, delay + (index * 150));
        });
        
        config.trackAnimation('slideIn', 800, elements.length);
    }
    
    // Scale animation
    function scaleInElements(selector, delay = 0) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'scale(0.8)';
            element.style.transition = 'opacity 500ms ease, transform 500ms ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
            }, delay + (index * 100));
        });
        
        config.trackAnimation('scaleIn', 500, elements.length);
    }
    
    // Intersection Observer for scroll-triggered animations
    function setupScrollAnimations() {
        if (!config.getDeviceCapabilities().supportsIntersectionObserver) {
            // Fallback for older browsers
            fadeInElements('.animate-on-scroll');
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.animation || 'fadeIn';
                    
                    switch (animationType) {
                        case 'slideLeft':
                            slideInElements(`#${element.id}`, 'left');
                            break;
                        case 'slideRight':
                            slideInElements(`#${element.id}`, 'right');
                            break;
                        case 'scale':
                            scaleInElements(`#${element.id}`);
                            break;
                        default:
                            fadeInElements(`#${element.id}`);
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });
    }
    
    // Initialize animations
    function init() {
        console.log('🎬 Initializing vanilla animations');
        
        // Immediate animations
        fadeInElements('.hero-title', 200);
        slideInElements('.hero-subtitle', 'left', 400);
        fadeInElements('.hero-buttons', 600);
        
        // Scroll-triggered animations
        setupScrollAnimations();
        
        // Performance monitoring
        const startTime = performance.now();
        requestAnimationFrame(() => {
            const endTime = performance.now();
            console.log(`⚡ Vanilla animations initialized in ${(endTime - startTime).toFixed(2)}ms`);
        });
    }
    
    // Export for global access
    window.VanillaAnimations = {
        fadeInElements,
        slideInElements,
        scaleInElements,
        setupScrollAnimations
    };
    
    init();
}

// Auto-initialize if DOM is ready
if (document.readyState !== 'loading') {
    initVanillaAnimations();
}