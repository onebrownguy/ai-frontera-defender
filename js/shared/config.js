/**
 * Animation Configuration Manager
 * Handles switching between vanilla and anime.js implementations
 */

class AnimationConfig {
    constructor() {
        this.animationType = this.detectAnimationType();
        this.performanceMetrics = {
            startTime: performance.now(),
            animationFrames: 0,
            totalAnimations: 0
        };
    }

    detectAnimationType() {
        // Check if we're on anime.js branch via URL or feature flag
        const urlParams = new URLSearchParams(window.location.search);
        const forceAnime = urlParams.get('anime') === 'true';
        const forceVanilla = urlParams.get('vanilla') === 'true';
        
        if (forceAnime) return 'anime';
        if (forceVanilla) return 'vanilla';
        
        // Check branch-based detection (Vercel preview URLs)
        const hostname = window.location.hostname;
        if (hostname.includes('anime-animations')) return 'anime';
        
        // Default to vanilla for production
        return 'vanilla';
    }

    getAnimationType() {
        return this.animationType;
    }

    // Performance tracking
    trackAnimation(name, duration, elements) {
        this.performanceMetrics.totalAnimations++;
        
        // Send to analytics if available
        if (window.gtag) {
            window.gtag('event', 'animation_executed', {
                'animation_type': this.animationType,
                'animation_name': name,
                'duration': duration,
                'elements_count': elements
            });
        }
    }

    // Animation preferences detection
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Device capability detection
    getDeviceCapabilities() {
        return {
            supportsIntersectionObserver: 'IntersectionObserver' in window,
            supportsRequestAnimationFrame: 'requestAnimationFrame' in window,
            deviceMemory: navigator.deviceMemory || 4,
            hardwareConcurrency: navigator.hardwareConcurrency || 4,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : null
        };
    }
}

// Global configuration instance
window.AnimationConfig = new AnimationConfig();