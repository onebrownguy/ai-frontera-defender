#!/usr/bin/env node

/**
 * Performance Testing Script
 * Compares performance between vanilla and anime.js implementations
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
    constructor() {
        this.results = {
            vanilla: {},
            anime: {},
            comparison: {}
        };
    }

    async testLoadTime(url, type) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            
            https.get(url, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    const endTime = Date.now();
                    const loadTime = endTime - startTime;
                    
                    // Analyze bundle size
                    const bundleSize = Buffer.byteLength(data, 'utf8');
                    
                    // Check for animation libraries
                    const hasAnimejs = data.includes('anime.min.js') || data.includes('animejs');
                    const animationCount = (data.match(/animation|transition/g) || []).length;
                    
                    resolve({
                        loadTime,
                        bundleSize,
                        hasAnimejs,
                        animationCount,
                        type
                    });
                });
            }).on('error', (err) => {
                console.error(`Error testing ${type}:`, err.message);
                resolve({ error: err.message, type });
            });
        });
    }

    async runTests() {
        console.log('🧪 Starting performance tests...\n');

        const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000';
        
        // Test vanilla version (master branch)
        console.log('📊 Testing vanilla JavaScript version...');
        this.results.vanilla = await this.testLoadTime(baseUrl, 'vanilla');
        
        // Test anime version (if available)
        console.log('📊 Testing anime.js version...');
        const animeUrl = baseUrl.replace('https://', 'https://').replace('.vercel.app', '-git-anime-animations-username.vercel.app');
        this.results.anime = await this.testLoadTime(animeUrl, 'anime');
        
        this.generateReport();
    }

    generateReport() {
        console.log('\n📈 PERFORMANCE COMPARISON REPORT');
        console.log('=====================================\n');

        const vanilla = this.results.vanilla;
        const anime = this.results.anime;

        if (vanilla.error || anime.error) {
            console.log('❌ Test failed:', vanilla.error || anime.error);
            return;
        }

        // Load time comparison
        const loadTimeDiff = anime.loadTime - vanilla.loadTime;
        const loadTimePercent = ((loadTimeDiff / vanilla.loadTime) * 100).toFixed(1);
        
        console.log('⏱️  LOAD TIME ANALYSIS:');
        console.log(`   Vanilla JS: ${vanilla.loadTime}ms`);
        console.log(`   Anime.js:   ${anime.loadTime}ms`);
        console.log(`   Difference: ${loadTimeDiff > 0 ? '+' : ''}${loadTimeDiff}ms (${loadTimePercent}%)\n`);

        // Bundle size comparison
        const sizeDiff = anime.bundleSize - vanilla.bundleSize;
        const sizePercent = ((sizeDiff / vanilla.bundleSize) * 100).toFixed(1);
        const sizeDiffKB = (sizeDiff / 1024).toFixed(1);
        
        console.log('📦 BUNDLE SIZE ANALYSIS:');
        console.log(`   Vanilla JS: ${(vanilla.bundleSize / 1024).toFixed(1)}KB`);
        console.log(`   Anime.js:   ${(anime.bundleSize / 1024).toFixed(1)}KB`);
        console.log(`   Difference: ${sizeDiff > 0 ? '+' : ''}${sizeDiffKB}KB (${sizePercent}%)\n`);

        // Animation analysis
        console.log('🎬 ANIMATION ANALYSIS:');
        console.log(`   Vanilla animations: ${vanilla.animationCount}`);
        console.log(`   Anime.js animations: ${anime.animationCount}`);
        console.log(`   Uses anime.js library: ${anime.hasAnimejs ? 'Yes' : 'No'}\n`);

        // Recommendations
        this.generateRecommendations(vanilla, anime, loadTimeDiff, sizeDiff);

        // Save results
        this.saveResults();
    }

    generateRecommendations(vanilla, anime, loadTimeDiff, sizeDiff) {
        console.log('💡 RECOMMENDATIONS:');
        
        if (loadTimeDiff < 100 && sizeDiff < 50000) {
            console.log('   ✅ Anime.js has minimal performance impact - safe to use');
        } else if (loadTimeDiff > 500) {
            console.log('   ⚠️  Significant load time increase - consider optimization');
        }
        
        if (sizeDiff > 100000) {
            console.log('   ⚠️  Large bundle size increase - consider lazy loading');
        }
        
        if (anime.animationCount > vanilla.animationCount * 1.5) {
            console.log('   ✅ Anime.js provides enhanced animation capabilities');
        }
        
        // Business decision framework
        console.log('\n🎯 DECISION FRAMEWORK:');
        console.log('   Choose Anime.js if:');
        console.log('   - Load time increase < 200ms');
        console.log('   - Bundle size increase < 100KB');
        console.log('   - Enhanced animations provide user value');
        console.log('   - Team comfortable with library dependency\n');
        
        console.log('   Stick with Vanilla if:');
        console.log('   - Performance is critical (< 100ms load times)');
        console.log('   - Bundle size must be minimal');
        console.log('   - Simple animations are sufficient');
        console.log('   - Prefer zero dependencies\n');
    }

    saveResults() {
        const reportPath = path.join(__dirname, '..', 'performance-report.json');
        const report = {
            timestamp: new Date().toISOString(),
            results: this.results,
            summary: {
                loadTimeDifference: this.results.anime.loadTime - this.results.vanilla.loadTime,
                bundleSizeDifference: this.results.anime.bundleSize - this.results.vanilla.bundleSize,
                recommendation: this.getRecommendation()
            }
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📄 Full report saved to: ${reportPath}`);
    }

    getRecommendation() {
        const loadDiff = this.results.anime.loadTime - this.results.vanilla.loadTime;
        const sizeDiff = this.results.anime.bundleSize - this.results.vanilla.bundleSize;
        
        if (loadDiff < 200 && sizeDiff < 100000) {
            return 'anime.js';
        } else if (loadDiff > 500 || sizeDiff > 200000) {
            return 'vanilla';
        } else {
            return 'manual_review_needed';
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const monitor = new PerformanceMonitor();
    monitor.runTests().catch(console.error);
}

module.exports = PerformanceMonitor;