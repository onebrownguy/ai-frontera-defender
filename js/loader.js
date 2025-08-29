/**
 * Dynamic Animation Loader
 * Loads appropriate animation library based on configuration
 */

(function() {
    'use strict';
    
    // Wait for config to be available
    function initializeAnimations() {
        if (!window.AnimationConfig) {
            setTimeout(initializeAnimations, 10);
            return;
        }
        
        const config = window.AnimationConfig;
        const animationType = config.getAnimationType();
        
        console.log(`🎬 Loading ${animationType} animations...`);
        
        if (animationType === 'anime') {
            loadAnimeAnimations();
        } else {
            loadVanillaAnimations();
        }
    }
    
    function loadAnimeAnimations() {
        // Load anime.js library
        const animeScript = document.createElement('script');
        animeScript.src = 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js';
        animeScript.onload = function() {
            // Load anime-specific animations
            const animationsScript = document.createElement('script');
            animationsScript.src = './js/anime/animations.js';
            animationsScript.onload = function() {
                console.log('✅ Anime.js animations loaded');
                if (window.initAnimeAnimations) {
                    window.initAnimeAnimations();
                }
            };
            document.head.appendChild(animationsScript);
        };
        animeScript.onerror = function() {
            console.warn('❌ Failed to load anime.js, falling back to vanilla');
            loadVanillaAnimations();
        };
        document.head.appendChild(animeScript);
        
        // Load anime-specific CSS
        const animeCSS = document.createElement('link');
        animeCSS.rel = 'stylesheet';
        animeCSS.href = './css/animations-anime.css';
        document.head.appendChild(animeCSS);
    }
    
    function loadVanillaAnimations() {
        // Load vanilla animations
        const animationsScript = document.createElement('script');
        animationsScript.src = './js/vanilla/animations.js';
        animationsScript.onload = function() {
            console.log('✅ Vanilla animations loaded');
            if (window.initVanillaAnimations) {
                window.initVanillaAnimations();
            }
        };
        document.head.appendChild(animationsScript);
        
        // Load vanilla-specific CSS
        const vanillaCSS = document.createElement('link');
        vanillaCSS.rel = 'stylesheet';
        vanillaCSS.href = './css/animations-vanilla.css';
        document.head.appendChild(vanillaCSS);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAnimations);
    } else {
        initializeAnimations();
    }
})();