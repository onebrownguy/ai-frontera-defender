// Branch-specific Configuration System
// Automatically detects current branch and loads appropriate animation library

const AnimationConfig = {
    // Configuration settings
    config: {
        animationLibrary: 'vanilla', // Default to vanilla
        enableAnimations: true,
        respectMotionPreference: true,
        performanceMode: 'auto', // auto, high, low
        debugMode: false
    },

    // Branch detection
    detectBranch: function() {
        // Check URL parameters first (for testing)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('animation')) {
            return urlParams.get('animation');
        }

        // Check localStorage for A/B testing
        const storedPreference = localStorage.getItem('animationLibrary');
        if (storedPreference) {
            return storedPreference;
        }

        // Check deployment URL for branch detection
        const hostname = window.location.hostname;
        if (hostname.includes('anime-enhanced')) {
            return 'anime';
        } else if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
            // For local development, check meta tag
            const branchMeta = document.querySelector('meta[name="branch"]');
            return branchMeta ? branchMeta.content : 'vanilla';
        }

        // Default to vanilla for production
        return 'vanilla';
    },

    // Performance detection
    detectPerformance: function() {
        if (this.config.performanceMode !== 'auto') {
            return this.config.performanceMode;
        }

        // Check device capabilities
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        const connection = navigator.connection;
        
        // Simple performance scoring
        let score = 0;
        score += memory >= 4 ? 2 : 1;
        score += cores >= 4 ? 2 : 1;
        
        if (connection) {
            const effectiveType = connection.effectiveType;
            score += effectiveType === '4g' ? 2 : 1;
        }

        return score >= 5 ? 'high' : 'low';
    },

    // Motion preference detection
    detectMotionPreference: function() {
        if (!this.config.respectMotionPreference) {
            return false;
        }
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    // Initialize configuration
    init: function() {
        // Detect animation library
        const detectedLibrary = this.detectBranch();
        this.config.animationLibrary = detectedLibrary;

        // Detect performance mode
        this.config.performanceMode = this.detectPerformance();

        // Check motion preference
        if (this.detectMotionPreference()) {
            this.config.enableAnimations = false;
            console.log('Animations disabled: User prefers reduced motion');
        }

        // Add branch indicator to body for CSS
        document.body.setAttribute('data-animation-library', detectedLibrary);
        document.body.setAttribute('data-performance-mode', this.config.performanceMode);

        // Log configuration in debug mode
        if (this.config.debugMode || window.location.hostname === 'localhost') {
            console.log('Animation Configuration:', this.config);
        }

        return this.config;
    },

    // Load appropriate animation library
    loadAnimationLibrary: function() {
        return new Promise((resolve, reject) => {
            if (!this.config.enableAnimations) {
                resolve('animations-disabled');
                return;
            }

            if (this.config.animationLibrary === 'anime') {
                // Load anime.js from CDN
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js';
                script.onload = () => {
                    console.log('anime.js loaded successfully');
                    resolve('anime');
                };
                script.onerror = () => {
                    console.error('Failed to load anime.js, falling back to vanilla');
                    this.config.animationLibrary = 'vanilla';
                    resolve('vanilla');
                };
                document.head.appendChild(script);
            } else {
                // Use vanilla animations
                console.log('Using vanilla animations');
                resolve('vanilla');
            }
        });
    },

    // Get current configuration
    getConfig: function() {
        return this.config;
    },

    // Update configuration
    updateConfig: function(updates) {
        Object.assign(this.config, updates);
        // Re-apply attributes
        document.body.setAttribute('data-animation-library', this.config.animationLibrary);
        document.body.setAttribute('data-performance-mode', this.config.performanceMode);
    },

    // A/B Testing utilities
    setTestVariant: function(variant) {
        localStorage.setItem('animationLibrary', variant);
        this.config.animationLibrary = variant;
        window.location.reload();
    },

    clearTestVariant: function() {
        localStorage.removeItem('animationLibrary');
        window.location.reload();
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AnimationConfig.init();
    });
} else {
    AnimationConfig.init();
}

// Export for use in other modules
window.AnimationConfig = AnimationConfig;