#!/usr/bin/env node

/**
 * Branch Comparison Script
 * Provides git workflow automation for A/B testing
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class BranchComparator {
    constructor() {
        this.currentBranch = this.getCurrentBranch();
        this.branches = {
            vanilla: 'master',
            anime: 'anime-animations',
            config: 'animation-config'
        };
    }

    getCurrentBranch() {
        try {
            return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
        } catch (error) {
            console.error('❌ Not in a git repository');
            process.exit(1);
        }
    }

    async setupBranches() {
        console.log('🌿 Setting up animation branches...\n');

        try {
            // Ensure we're on master
            console.log('📍 Switching to master branch...');
            execSync('git checkout master');

            // Create anime-animations branch if it doesn't exist
            console.log('🎬 Creating anime-animations branch...');
            try {
                execSync('git checkout -b anime-animations');
                console.log('✅ Created anime-animations branch');
            } catch {
                execSync('git checkout anime-animations');
                console.log('✅ Switched to existing anime-animations branch');
            }

            // Create animation-config branch for shared utilities
            console.log('⚙️  Creating animation-config branch...');
            try {
                execSync('git checkout master');
                execSync('git checkout -b animation-config');
                console.log('✅ Created animation-config branch');
            } catch {
                execSync('git checkout animation-config');
                console.log('✅ Switched to existing animation-config branch');
            }

            console.log('\n🎉 Branch setup complete!');
            this.showBranchStatus();

        } catch (error) {
            console.error('❌ Error setting up branches:', error.message);
        }
    }

    showBranchStatus() {
        console.log('\n📊 BRANCH STATUS:');
        console.log('==================');

        try {
            const branches = execSync('git branch -a', { encoding: 'utf8' });
            console.log(branches);

            console.log('\n🔗 DEPLOYMENT URLS:');
            console.log('===================');
            console.log('Production (master):    https://your-domain.vercel.app');
            console.log('Preview (anime):        https://your-domain-git-anime-animations-username.vercel.app');
            console.log('Config (shared):        https://your-domain-git-animation-config-username.vercel.app');

        } catch (error) {
            console.error('Error getting branch status:', error.message);
        }
    }

    async deployBoth() {
        console.log('🚀 Deploying both versions for A/B testing...\n');

        const deployResults = {
            vanilla: null,
            anime: null
        };

        try {
            // Deploy vanilla version
            console.log('📦 Deploying vanilla version (master)...');
            execSync('git checkout master');
            const vanillaResult = execSync('vercel --prod --yes', { encoding: 'utf8' });
            deployResults.vanilla = this.extractDeploymentURL(vanillaResult);
            console.log(`✅ Vanilla deployed: ${deployResults.vanilla}`);

            // Deploy anime version  
            console.log('\n📦 Deploying anime version...');
            execSync('git checkout anime-animations');
            const animeResult = execSync('vercel --yes', { encoding: 'utf8' });
            deployResults.anime = this.extractDeploymentURL(animeResult);
            console.log(`✅ Anime deployed: ${deployResults.anime}`);

            this.generateComparisonReport(deployResults);

        } catch (error) {
            console.error('❌ Deployment error:', error.message);
        }
    }

    extractDeploymentURL(deployOutput) {
        const urlMatch = deployOutput.match(/https:\/\/[^\s]+/);
        return urlMatch ? urlMatch[0] : 'URL not found';
    }

    generateComparisonReport(deployResults) {
        console.log('\n📈 A/B TESTING SETUP COMPLETE');
        console.log('==============================\n');

        console.log('🔗 TEST URLS:');
        console.log(`   Vanilla JS: ${deployResults.vanilla}`);
        console.log(`   Anime.js:   ${deployResults.anime}`);
        
        console.log('\n🧪 TESTING CHECKLIST:');
        console.log('   □ Load time comparison');
        console.log('   □ Animation quality assessment');
        console.log('   □ Mobile device testing');
        console.log('   □ Accessibility validation');
        console.log('   □ User preference testing');

        console.log('\n⚡ QUICK COMMANDS:');
        console.log('   npm run test:performance     # Run automated performance tests');
        console.log('   npm run switch:vanilla       # Switch to vanilla branch');
        console.log('   npm run switch:anime         # Switch to anime branch');
        console.log('   git diff master anime-animations  # Compare code differences');

        // Save comparison data
        const reportPath = path.join(__dirname, '..', 'comparison-report.json');
        const report = {
            timestamp: new Date().toISOString(),
            deployments: deployResults,
            branches: this.branches,
            currentBranch: this.currentBranch,
            testingChecklist: [
                'Load time comparison',
                'Animation quality assessment', 
                'Mobile device testing',
                'Accessibility validation',
                'User preference testing'
            ]
        };

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Comparison report saved: ${reportPath}`);
    }

    async runAnalysis() {
        console.log('🔍 Running branch analysis...\n');

        try {
            // File differences
            console.log('📁 FILE DIFFERENCES:');
            const diffStat = execSync('git diff --stat master anime-animations', { encoding: 'utf8' });
            console.log(diffStat || 'No differences found');

            // Commit differences
            console.log('\n📝 COMMIT DIFFERENCES:');
            const commits = execSync('git log --oneline master..anime-animations', { encoding: 'utf8' });
            console.log(commits || 'No new commits on anime-animations');

            // Bundle size estimation
            this.estimateBundleSize();

        } catch (error) {
            console.error('❌ Analysis error:', error.message);
        }
    }

    estimateBundleSize() {
        console.log('\n📦 BUNDLE SIZE ESTIMATION:');
        
        try {
            const masterFiles = this.getDirectorySize('.');
            console.log(`   Current branch size: ${(masterFiles / 1024).toFixed(1)}KB`);

            // Estimate anime.js addition
            const animeSize = 17.5; // anime.js is approximately 17.5KB minified
            console.log(`   Estimated with anime.js: ${(masterFiles / 1024 + animeSize).toFixed(1)}KB`);
            console.log(`   Estimated increase: +${animeSize}KB`);

        } catch (error) {
            console.log('   Unable to estimate bundle size');
        }
    }

    getDirectorySize(dir) {
        let totalSize = 0;
        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            if (file.name.startsWith('.') || file.name === 'node_modules') continue;
            
            const filePath = path.join(dir, file.name);
            
            if (file.isDirectory()) {
                totalSize += this.getDirectorySize(filePath);
            } else if (file.name.endsWith('.js') || file.name.endsWith('.css') || file.name.endsWith('.html')) {
                totalSize += fs.statSync(filePath).size;
            }
        }
        
        return totalSize;
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    const comparator = new BranchComparator();

    switch (args[0]) {
        case 'setup':
            await comparator.setupBranches();
            break;
        case 'deploy':
            await comparator.deployBoth();
            break;
        case 'status':
            comparator.showBranchStatus();
            break;
        case 'analyze':
            await comparator.runAnalysis();
            break;
        default:
            console.log('🎯 Animation Branch Comparator');
            console.log('===============================\n');
            console.log('Available commands:');
            console.log('  node scripts/compare-branches.js setup    # Setup branches');
            console.log('  node scripts/compare-branches.js deploy   # Deploy both versions');
            console.log('  node scripts/compare-branches.js status   # Show branch status');
            console.log('  node scripts/compare-branches.js analyze  # Analyze differences');
            break;
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = BranchComparator;