// Analytics and Performance Monitoring Configuration
// AI PenTest Platform Marketing Website

// Google Analytics 4 Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Initialize analytics when ready
function initializeAnalytics() {
    // Google Analytics 4 - Replace GA_MEASUREMENT_ID with actual ID
    // gtag('js', new Date());
    // gtag('config', 'GA_MEASUREMENT_ID', {
    //     page_title: 'AI PenTest Platform - Marketing',
    //     custom_map: {
    //         'custom_parameter_1': 'security_industry'
    //     }
    // });
    
    console.log('Analytics ready for configuration');
}

// Conversion tracking for marketing goals
function trackConversion(action, category = 'marketing') {
    const conversionData = {
        event_name: action,
        category: category,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        user_agent: navigator.userAgent
    };
    
    // Track key conversion events
    switch(action) {
        case 'cta_click':
            conversionData.value = 'high_intent';
            break;
        case 'pricing_view':
            conversionData.value = 'consideration';
            break;
        case 'contact_form_submit':
            conversionData.value = 'lead_generation';
            break;
        case 'demo_request':
            conversionData.value = 'qualified_lead';
            break;
    }
    
    // Send to analytics (when configured)
    console.log('Conversion tracked:', conversionData);
    
    // Send to Google Analytics 4 (when GA_MEASUREMENT_ID is configured)
    // gtag('event', action, conversionData);
}

// Performance monitoring
function trackPerformance() {
    if ('performance' in window && 'getEntriesByType' in performance) {
        const navigation = performance.getEntriesByType('navigation')[0];
        const performanceMetrics = {
            // Core Web Vitals
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            timeToFirstByte: navigation.responseStart - navigation.requestStart,
            // Custom metrics
            pageLoadTime: Date.now() - window.performance.timing.navigationStart,
            timestamp: new Date().toISOString()
        };
        
        console.log('Performance metrics:', performanceMetrics);
        
        // Track performance in analytics
        trackConversion('page_performance', 'technical');
    }
}

// Lead scoring for marketing qualification
function calculateLeadScore(actions = []) {
    let score = 0;
    const scoring = {
        'page_view': 1,
        'pricing_view': 15,
        'case_study_view': 10,
        'cta_click': 25,
        'demo_request': 50,
        'contact_form_submit': 75,
        'pricing_inquiry': 40,
        'enterprise_interest': 60
    };
    
    actions.forEach(action => {
        score += scoring[action] || 0;
    });
    
    return {
        score: score,
        qualification: score >= 50 ? 'qualified' : score >= 25 ? 'interested' : 'visitor',
        timestamp: new Date().toISOString()
    };
}

// Marketing attribution tracking
function trackSource() {
    const urlParams = new URLSearchParams(window.location.search);
    const attribution = {
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'), 
        utm_campaign: urlParams.get('utm_campaign'),
        utm_content: urlParams.get('utm_content'),
        utm_term: urlParams.get('utm_term'),
        referrer: document.referrer,
        landing_page: window.location.pathname,
        timestamp: new Date().toISOString()
    };
    
    // Store attribution for session
    sessionStorage.setItem('marketing_attribution', JSON.stringify(attribution));
    
    console.log('Marketing attribution:', attribution);
    return attribution;
}

// A/B testing framework
function initializeABTesting() {
    const tests = {
        'hero_cta': {
            variants: ['Start Free Assessment', 'Get Security Audit', 'Begin AI Testing'],
            current: 'Start Free Assessment'
        },
        'pricing_display': {
            variants: ['monthly', 'per_assessment'],
            current: 'per_assessment'
        }
    };
    
    // Simple A/B test assignment (improve with proper testing framework)
    Object.keys(tests).forEach(testName => {
        const variant = tests[testName].variants[Math.floor(Math.random() * tests[testName].variants.length)];
        sessionStorage.setItem(`ab_test_${testName}`, variant);
    });
    
    console.log('A/B tests initialized:', tests);
}

// Heat mapping and user behavior (placeholder for tools like Hotjar)
function initializeBehaviorTracking() {
    const behaviorData = {
        scroll_depth: 0,
        time_on_page: Date.now(),
        clicks: [],
        form_interactions: []
    };
    
    // Track scroll depth
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        behaviorData.scroll_depth = Math.max(behaviorData.scroll_depth, scrollPercent);
    });
    
    // Track clicks on important elements
    document.addEventListener('click', (e) => {
        if (e.target.matches('a, button, .cta-button, .pricing-card')) {
            behaviorData.clicks.push({
                element: e.target.tagName,
                text: e.target.textContent.trim().substring(0, 50),
                timestamp: Date.now()
            });
            
            // Track conversion for CTA clicks
            if (e.target.matches('.cta-button, .primary-cta, .secondary-cta')) {
                trackConversion('cta_click', 'engagement');
            }
        }
    });
    
    return behaviorData;
}

// Initialize all tracking when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core tracking
    initializeAnalytics();
    trackSource();
    initializeABTesting();
    const behaviorTracking = initializeBehaviorTracking();
    
    // Track initial page load
    trackConversion('page_view', 'engagement');
    
    // Track performance after load
    window.addEventListener('load', () => {
        setTimeout(trackPerformance, 1000);
    });
    
    // Track when user leaves page
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Date.now() - behaviorTracking.time_on_page;
        trackConversion('session_end', 'engagement');
        
        console.log('Session summary:', {
            time_on_page: timeOnPage,
            scroll_depth: behaviorTracking.scroll_depth,
            interactions: behaviorTracking.clicks.length
        });
    });
    
    console.log('AI PenTest Platform analytics initialized');
});

// Export functions for use by other scripts
window.aiPentestAnalytics = {
    trackConversion,
    calculateLeadScore,
    trackSource,
    trackPerformance
};