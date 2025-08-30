const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testSpanishFunctionality() {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    // Create screenshots directory
    const screenshotsDir = path.join(__dirname, 'spanish-test-screenshots-fixed');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }

    console.log('🚀 Starting Spanish functionality test...');
    
    // Try the production domain first
    const deploymentUrl = 'https://aifronteradefender.com';
    console.log(`🔗 Navigating to: ${deploymentUrl}`);
    
    await page.goto(deploymentUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(3000);
    
    console.log('📸 Taking initial page screenshot...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '01-initial-page.png'), 
      fullPage: true 
    });

    // Check if this is the login page or the actual site
    const pageTitle = await page.title();
    const pageContent = await page.textContent('body');
    
    console.log(`Page Title: ${pageTitle}`);
    console.log(`Page contains login? ${pageContent.includes('Log in to Vercel')}`);
    
    if (pageContent.includes('Log in to Vercel') || pageContent.includes('Vercel')) {
      console.log('❌ Landing on Vercel login page instead of the site');
      console.log('🔄 Trying alternative approaches...');
      
      // Try accessing without auth
      await page.goto(deploymentUrl + '?bypass=true', { 
        waitUntil: 'networkidle',
        timeout: 30000
      });
      await page.waitForTimeout(2000);
      
      const newContent = await page.textContent('body');
      if (newContent.includes('Log in to Vercel')) {
        console.log('❌ Still redirecting to login. The deployment might require authentication.');
        await browser.close();
        return;
      }
    }

    // Get page content for analysis
    const fullContent = await page.textContent('body');
    console.log(`✅ Site loaded! Content length: ${fullContent.length} characters`);
    
    // Look for language switcher elements
    console.log('🔍 Looking for language switcher...');
    
    const languageSwitchers = await page.evaluate(() => {
      const found = [];
      
      // Look for buttons and links that might be language switchers
      const allButtons = document.querySelectorAll('button, a, span, div');
      allButtons.forEach(el => {
        const text = el.textContent.trim().toLowerCase();
        if (text.includes('es') || text.includes('español') || text.includes('spanish') || 
            text === 'en' || text === 'eng' || text.includes('english') ||
            el.hasAttribute('data-lang') || el.hasAttribute('data-language')) {
          found.push({
            text: el.textContent.trim(),
            tag: el.tagName.toLowerCase(),
            visible: el.offsetParent !== null,
            classes: el.className,
            id: el.id
          });
        }
      });
      
      return found;
    });
    
    console.log('Language switchers found:', languageSwitchers);

    // Also check for any Spanish content already present
    const hasSpanishContent = await page.evaluate(() => {
      const content = document.body.textContent.toLowerCase();
      const spanishWords = [
        'protección', 'seguridad', 'frontera', 'defensa', 'inteligencia',
        'artificial', 'amenazas', 'ciberseguridad', 'empresas', 'solución',
        'plataforma', 'tecnología', 'contacto', 'precios', 'español'
      ];
      return spanishWords.some(word => content.includes(word));
    });
    
    console.log(`Spanish content detected: ${hasSpanishContent}`);

    // Try to click Spanish language switcher if found
    let switchedToSpanish = false;
    if (languageSwitchers.length > 0) {
      console.log('🇪🇸 Attempting to switch to Spanish...');
      try {
        // Try clicking the first visible language switcher
        const visibleSwitcher = languageSwitchers.find(s => s.visible);
        if (visibleSwitcher) {
          // Try to click using the element's position or text
          await page.click(`text=${visibleSwitcher.text}`);
          await page.waitForTimeout(3000);
          switchedToSpanish = true;
          console.log('✅ Language switcher clicked');
        }
      } catch (error) {
        console.log('❌ Failed to click language switcher:', error.message);
      }
    } else {
      console.log('⚠️ No language switcher found');
    }
    
    // Take screenshot after language switch attempt
    console.log('📸 Taking post-switch screenshot...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '02-after-spanish-attempt.png'), 
      fullPage: true 
    });

    // Analyze current content for Spanish vs English
    const contentAnalysis = await page.evaluate(() => {
      const content = document.body.textContent.toLowerCase();
      
      const spanishWords = [
        'protección', 'seguridad', 'frontera', 'defensa', 'inteligencia',
        'artificial', 'amenazas', 'ciberseguridad', 'empresas', 'solución',
        'plataforma', 'tecnología', 'experiencia', 'contacto', 'precios',
        'características', 'sobre', 'nosotros', 'servicios', 'productos',
        'inicio', 'más', 'información', 'español'
      ];
      
      const englishWords = [
        'protection', 'security', 'border', 'defense', 'intelligence',
        'artificial', 'threats', 'cybersecurity', 'companies', 'solution',
        'platform', 'technology', 'experience', 'contact', 'pricing',
        'features', 'about', 'us', 'services', 'products', 'home',
        'more', 'information', 'english'
      ];

      const spanishCount = spanishWords.filter(word => content.includes(word)).length;
      const englishCount = englishWords.filter(word => content.includes(word)).length;
      
      // Get sample text from different sections
      const sections = {};
      const sectionSelectors = [
        { name: 'Header/Nav', selector: 'header, nav, [role="navigation"]' },
        { name: 'Main Content', selector: 'main, .main-content, .hero' },
        { name: 'Footer', selector: 'footer' }
      ];
      
      sectionSelectors.forEach(({ name, selector }) => {
        const element = document.querySelector(selector);
        sections[name] = element ? element.textContent.substring(0, 300) : 'Not found';
      });

      return {
        totalLength: content.length,
        spanishWordsFound: spanishCount,
        englishWordsFound: englishCount,
        primaryLanguage: spanishCount > englishCount ? 'Spanish' : 
                         englishCount > spanishCount ? 'English' : 'Mixed/Unknown',
        sections,
        fullSample: content.substring(0, 500)
      };
    });

    // Generate comprehensive report
    console.log('\n📊 SPANISH FUNCTIONALITY ANALYSIS REPORT');
    console.log('='.repeat(50));
    console.log(`🔗 URL Tested: ${deploymentUrl}`);
    console.log(`📄 Page Title: ${pageTitle}`);
    console.log(`📝 Content Length: ${contentAnalysis.totalLength} characters`);
    console.log(`🇪🇸 Spanish Words Detected: ${contentAnalysis.spanishWordsFound}`);
    console.log(`🇺🇸 English Words Detected: ${contentAnalysis.englishWordsFound}`);
    console.log(`🌐 Primary Language: ${contentAnalysis.primaryLanguage}`);
    console.log(`🔄 Language Switcher Available: ${languageSwitchers.length > 0 ? 'Yes' : 'No'}`);
    console.log(`✅ Successfully Switched: ${switchedToSpanish ? 'Yes' : 'No'}`);
    
    console.log('\n🔍 SECTION ANALYSIS:');
    Object.entries(contentAnalysis.sections).forEach(([section, content]) => {
      console.log(`\n${section}:`);
      console.log(`"${content.substring(0, 150)}${content.length > 150 ? '...' : ''}"`);
    });

    console.log('\n📋 SAMPLE CONTENT:');
    console.log(`"${contentAnalysis.fullSample}"`);

    // Save comprehensive report
    const report = {
      timestamp: new Date().toISOString(),
      url: deploymentUrl,
      pageTitle,
      languageSwitchers,
      switchedToSpanish,
      contentAnalysis,
      recommendations: []
    };

    // Add recommendations based on findings
    if (languageSwitchers.length === 0) {
      report.recommendations.push('Add a visible language switcher to allow users to toggle between English and Spanish');
    }
    
    if (contentAnalysis.primaryLanguage === 'English') {
      report.recommendations.push('Implement Spanish translations for the main content');
    } else if (contentAnalysis.primaryLanguage === 'Mixed/Unknown') {
      report.recommendations.push('Review content to ensure consistent language usage');
    }

    const reportPath = path.join(__dirname, 'spanish-functionality-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📁 Screenshots saved to: ${screenshotsDir}`);
    console.log(`📋 Report saved to: ${reportPath}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testSpanishFunctionality().catch(console.error);