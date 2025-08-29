/**
 * Anime.js Animations
 * Advanced animations using anime.js library
 */

function initAnimeAnimations() {
    'use strict';
    
    const config = window.AnimationConfig;
    
    if (config.prefersReducedMotion()) {
        console.log('🚫 Reduced motion preferred, skipping animations');
        return;
    }
    
    if (typeof anime === 'undefined') {
        console.error('❌ Anime.js not loaded, falling back to vanilla');
        if (window.initVanillaAnimations) {
            window.initVanillaAnimations();
        }
        return;
    }
    
    // Advanced fade-in with elastic easing
    function fadeInElements(selector, delay = 0) {
        const timeline = anime.timeline({
            easing: 'easeOutElastic(1, .5)',
            duration: 800
        });
        
        timeline.add({
            targets: selector,
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(100, {start: delay})
        });
        
        const elements = document.querySelectorAll(selector);
        config.trackAnimation('animeJS_fadeIn', 800, elements.length);
        
        return timeline;
    }
    
    // Advanced slide with bounce
    function slideInElements(selector, direction = 'left', delay = 0) {
        const translateX = direction === 'left' ? [-50, 0] : [50, 0];
        
        const animation = anime({
            targets: selector,
            opacity: [0, 1],
            translateX: translateX,
            easing: 'easeOutBounce',
            duration: 1000,
            delay: anime.stagger(150, {start: delay})
        });
        
        const elements = document.querySelectorAll(selector);
        config.trackAnimation('animeJS_slideIn', 1000, elements.length);
        
        return animation;
    }
    
    // Scale with rotation
    function scaleInElements(selector, delay = 0) {
        const animation = anime({
            targets: selector,
            opacity: [0, 1],
            scale: [0.3, 1],
            rotate: [180, 0],
            easing: 'easeOutExpo',
            duration: 800,
            delay: anime.stagger(120, {start: delay})
        });
        
        const elements = document.querySelectorAll(selector);
        config.trackAnimation('animeJS_scaleIn', 800, elements.length);
        
        return animation;
    }
    
    // Advanced morphing path animation
    function morphPaths(selector) {
        if (!document.querySelector(selector)) return;
        
        anime({
            targets: selector,
            d: [
                { value: "M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2Z" },
                { value: "M12,2C17,2 21,6.03 21,11C21,16 17,20 12,20C7,20 3,16 3,11C3,6.03 7,2 12,2Z" }
            ],
            easing: 'easeInOutQuad',
            duration: 2000,
            direction: 'alternate',
            loop: true
        });
        
        config.trackAnimation('animeJS_morphPath', 2000, 1);
    }
    
    // Particle effect animation
    function createParticleEffect(selector) {
        const container = document.querySelector(selector);
        if (!container) return;
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.backgroundColor = '#007bff';
            particle.style.borderRadius = '50%';
            container.appendChild(particle);
        }
        
        anime({
            targets: '.particle',
            translateX: () => anime.random(-200, 200),
            translateY: () => anime.random(-200, 200),
            scale: () => anime.random(0.1, 1),
            opacity: [1, 0],
            duration: () => anime.random(1000, 3000),
            delay: () => anime.random(0, 1000),
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutQuad'
        });
        
        config.trackAnimation('animeJS_particles', 3000, 50);
    }
    
    // Intersection Observer with anime.js
    function setupScrollAnimations() {
        if (!config.getDeviceCapabilities().supportsIntersectionObserver) {
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
                        case 'morph':
                            morphPaths(`#${element.id} path`);
                            break;
                        case 'particles':
                            createParticleEffect(`#${element.id}`);
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
    
    // Text animation with typewriter effect
    function typewriterAnimation(selector, delay = 0) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.textContent = text[i];
                span.style.opacity = '0';
                element.appendChild(span);
            }
            
            anime({
                targets: `${selector} span`,
                opacity: [0, 1],
                easing: 'easeInOutQuad',
                duration: 50,
                delay: anime.stagger(50, {start: delay})
            });
        });
        
        config.trackAnimation('animeJS_typewriter', 50 * elements[0]?.textContent.length || 0, elements.length);
    }
    
    // Initialize animations
    function init() {
        console.log('🎬 Initializing anime.js animations');
        
        // Immediate animations with advanced effects
        fadeInElements('.hero-title', 300);
        slideInElements('.hero-subtitle', 'left', 600);
        scaleInElements('.hero-buttons', 900);
        
        // Special effects
        if (document.querySelector('.typewriter')) {
            typewriterAnimation('.typewriter', 1200);
        }
        
        if (document.querySelector('.particle-container')) {
            createParticleEffect('.particle-container');
        }
        
        // Scroll-triggered animations
        setupScrollAnimations();
        
        // Performance monitoring
        const startTime = performance.now();
        requestAnimationFrame(() => {
            const endTime = performance.now();
            console.log(`⚡ Anime.js animations initialized in ${(endTime - startTime).toFixed(2)}ms`);
        });
    }
    
    // Export for global access
    window.AnimeAnimations = {
        fadeInElements,
        slideInElements,
        scaleInElements,
        morphPaths,
        createParticleEffect,
        typewriterAnimation,
        setupScrollAnimations
    };
    
    init();
}

// Auto-initialize if DOM is ready
if (document.readyState !== 'loading') {
    initAnimeAnimations();
}