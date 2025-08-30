const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testSpanishFunctionality() {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    // Create screenshots directory
    const screenshotsDir = path.join(__dirname, 'spanish-test-screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }

    console.log('🚀 Starting Spanish functionality test...');
    
    // Navigate to the site
    await page.goto('https://ai-frontera-defender-fdhlegt5j-abel-rincons-projects.vercel.app');
    await page.waitForTimeout(3000);
    
    console.log('📸 Taking initial page screenshot...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '01-initial-page.png'), 
      fullPage: true 
    });

    // Check current language state
    console.log('🔍 Checking initial language state...');
    const initialLanguage = await page.evaluate(() => {
      const langButton = document.querySelector('[data-language]');
      return langButton ? langButton.textContent : 'No language button found';
    });
    console.log('Initial language button text:', initialLanguage);

    // Click the Spanish language button
    console.log('🇪🇸 Clicking Spanish language button...');
    try {
      // Try different selectors for the Spanish button
      const spanishButton = await page.locator('button:has-text("ES"), a:has-text("ES"), [data-language="es"]').first();
      await spanishButton.click();
      await page.waitForTimeout(2000);
      console.log('✅ Spanish button clicked successfully');
    } catch (error) {
      console.log('❌ Could not find/click Spanish button:', error.message);
      // Try alternative approach
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button, a');
        for (let button of buttons) {
          if (button.textContent.includes('ES') || button.textContent.includes('Español')) {
            button.click();
            break;
          }
        }
      });
      await page.waitForTimeout(2000);
    }

    // Take screenshot after language switch
    console.log('📸 Taking post-language-switch screenshot...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '02-after-spanish-switch.png'), 
      fullPage: true 
    });

    // Test each major section
    const sections = [
      { name: 'Hero Section', selector: 'main section:first-child, .hero, [data-section="hero"]' },
      { name: 'Trust Indicators', selector: '[data-section="trust"], .trust-indicators, .logos' },
      { name: 'Threat Landscape', selector: '[data-section="threat"], .threat-landscape' },
      { name: 'Attack Cards', selector: '[data-section="attacks"], .attack-cards, .threats' },
      { name: 'Platform Pillars', selector: '[data-section="pillars"], .pillars, .features' },
      { name: 'Authority/Metrics', selector: '[data-section="metrics"], .authority, .stats' },
      { name: 'Pricing', selector: '[data-section="pricing"], .pricing' },
      { name: 'Footer', selector: 'footer' }
    ];

    const analysisResults = [];

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      console.log(`🔍 Analyzing ${section.name}...`);
      
      try {
        // Scroll to section
        await page.evaluate((selector) => {
          const element = document.querySelector(selector);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, section.selector);
        
        await page.waitForTimeout(1000);
        
        // Take screenshot of section
        await page.screenshot({ 
          path: path.join(screenshotsDir, `${String(i + 3).padStart(2, '0')}-${section.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`), 
          fullPage: false 
        });

        // Analyze text content
        const sectionAnalysis = await page.evaluate(({ selector, sectionName }) => {
          const element = document.querySelector(selector);
          if (!element) {
            return {
              sectionName,
              found: false,
              error: 'Section not found'
            };
          }

          const textContent = element.innerText || element.textContent || '';
          const allText = textContent.toLowerCase();
          
          // Spanish indicators
          const spanishWords = [
            'protección', 'seguridad', 'frontera', 'defensa', 'artificial',
            'inteligencia', 'amenazas', 'ciberseguridad', 'empresas',
            'solución', 'plataforma', 'tecnología', 'experiencia',
            'contacto', 'precios', 'características', 'sobre', 'nosotros',
            'servicios', 'productos', 'inicio', 'más', 'información'
          ];
          
          // English indicators  
          const englishWords = [
            'protection', 'security', 'border', 'defense', 'artificial',
            'intelligence', 'threats', 'cybersecurity', 'companies',
            'solution', 'platform', 'technology', 'experience',
            'contact', 'pricing', 'features', 'about', 'us',
            'services', 'products', 'home', 'more', 'information'
          ];

          const spanishCount = spanishWords.filter(word => allText.includes(word)).length;
          const englishCount = englishWords.filter(word => allText.includes(word)).length;

          return {
            sectionName,
            found: true,
            textLength: textContent.length,
            spanishWordsFound: spanishCount,
            englishWordsFound: englishCount,
            primaryLanguage: spanishCount > englishCount ? 'Spanish' : 
                           englishCount > spanishCount ? 'English' : 'Mixed/Unknown',
            sampleText: textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '')
          };
        }, { selector: section.selector, sectionName: section.name });

        analysisResults.push(sectionAnalysis);
        console.log(`   ${sectionAnalysis.found ? '✅' : '❌'} ${section.name}: ${sectionAnalysis.found ? sectionAnalysis.primaryLanguage : 'Not found'}`);
        
      } catch (error) {
        console.log(`❌ Error analyzing ${section.name}:`, error.message);
        analysisResults.push({
          sectionName: section.name,
          found: false,
          error: error.message
        });
      }
    }

    // Generate detailed report
    console.log('\n📊 DETAILED ANALYSIS REPORT');
    console.log('='.repeat(50));
    
    analysisResults.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.sectionName}`);
      if (result.found) {
        console.log(`   Language: ${result.primaryLanguage}`);
        console.log(`   Spanish words detected: ${result.spanishWordsFound}`);
        console.log(`   English words detected: ${result.englishWordsFound}`);
        console.log(`   Sample text: "${result.sampleText}"`);
      } else {
        console.log(`   ❌ ${result.error || 'Not found'}`);
      }
    });

    // Summary
    const foundSections = analysisResults.filter(r => r.found);
    const spanishSections = foundSections.filter(r => r.primaryLanguage === 'Spanish').length;
    const englishSections = foundSections.filter(r => r.primaryLanguage === 'English').length;
    const mixedSections = foundSections.filter(r => r.primaryLanguage === 'Mixed/Unknown').length;

    console.log('\n🎯 SUMMARY');
    console.log('='.repeat(30));
    console.log(`Total sections analyzed: ${analysisResults.length}`);
    console.log(`Sections found: ${foundSections.length}`);
    console.log(`Sections in Spanish: ${spanishSections}`);
    console.log(`Sections in English: ${englishSections}`);
    console.log(`Sections with mixed content: ${mixedSections}`);
    
    console.log(`\n📁 Screenshots saved to: ${screenshotsDir}`);
    
    // Save analysis to file
    const reportPath = path.join(__dirname, 'spanish-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      url: 'https://ai-frontera-defender-fdhlegt5j-abel-rincons-projects.vercel.app',
      summary: {
        totalSections: analysisResults.length,
        foundSections: foundSections.length,
        spanishSections,
        englishSections,
        mixedSections
      },
      detailedResults: analysisResults
    }, null, 2));
    
    console.log(`📋 Detailed report saved to: ${reportPath}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testSpanishFunctionality().catch(console.error);