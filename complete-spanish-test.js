const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function completeSpanishTest() {
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const page = await browser.newPage();
  
  try {
    const screenshotsDir = path.join(__dirname, 'complete-spanish-analysis');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }

    console.log('🚀 Starting comprehensive Spanish functionality test...');
    
    const url = 'https://aifronteradefender.com';
    console.log(`🔗 Testing: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    console.log('📸 1. Taking initial page screenshot...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '01-initial-load.png'), 
      fullPage: true 
    });

    // Analyze the initial state
    console.log('🔍 Analyzing initial language state...');
    const initialAnalysis = await page.evaluate(() => {
      const content = document.body.textContent;
      return {
        pageTitle: document.title,
        hasSpanishContent: content.includes('Seguridad') || content.includes('Maquiladoras') || content.includes('Frontera'),
        hasEnglishContent: content.includes('Security') || content.includes('Protection') || content.includes('Border'),
        currentLanguageButtonState: {
          esButton: document.querySelector('#btn-es')?.classList.contains('active'),
          enButton: document.querySelector('#btn-en')?.classList.contains('active')
        }
      };
    });
    
    console.log('Initial state:', initialAnalysis);

    // Click EN button first to see English version
    console.log('🇺🇸 2. Switching to English...');
    await page.click('#btn-en');
    await page.waitForTimeout(3000);
    
    console.log('📸 Taking English version screenshot...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '02-english-version.png'), 
      fullPage: true 
    });

    // Click ES button to switch back to Spanish
    console.log('🇪🇸 3. Switching to Spanish...');
    await page.click('#btn-es');
    await page.waitForTimeout(3000);
    
    console.log('📸 Taking Spanish version screenshot...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '03-spanish-version.png'), 
      fullPage: true 
    });

    // Now analyze each major section in Spanish mode
    const sections = [
      { name: 'Hero Section', scroll: 0 },
      { name: 'Trust Indicators', scroll: 800 },
      { name: 'Threat Landscape', scroll: 1600 },
      { name: 'Platform Features', scroll: 2400 },
      { name: 'Metrics/Authority', scroll: 3200 },
      { name: 'Pricing Section', scroll: 4000 },
      { name: 'Footer', scroll: 5000 }
    ];

    const sectionAnalysis = [];

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      console.log(`📍 ${i + 4}. Analyzing ${section.name}...`);
      
      // Scroll to section
      await page.evaluate((scrollY) => {
        window.scrollTo({ top: scrollY, behavior: 'smooth' });
      }, section.scroll);
      
      await page.waitForTimeout(2000);
      
      // Take section screenshot
      await page.screenshot({ 
        path: path.join(screenshotsDir, `${String(i + 4).padStart(2, '0')}-${section.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`),
        fullPage: false 
      });

      // Analyze section content
      const analysis = await page.evaluate(({ sectionName, scrollPosition }) => {
        // Get visible content in viewport
        const elements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        let visibleText = '';
        
        // Get text from elements near the scroll position
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top >= -100 && rect.top <= window.innerHeight + 100) {
            const text = el.textContent?.trim();
            if (text && text.length > 10 && text.length < 200) {
              visibleText += text + ' ';
            }
          }
        });

        const text = visibleText.toLowerCase();
        
        // Count Spanish vs English words
        const spanishWords = ['seguridad', 'maquiladoras', 'frontera', 'defensa', 'protección', 
                             'inteligencia', 'artificial', 'amenazas', 'plataforma', 'solución',
                             'empresas', 'cibernética', 'binacional', 'cumplimiento', 'contacto',
                             'precios', 'gratis', 'evaluación', 'clientes', 'vulnerabilidades',
                             'detección', 'panorama', 'ofensiva', 'nativa', 'comenzar',
                             'proteger', 'starter', 'profesional', 'enterprise', 'personalizado'];
        
        const englishWords = ['security', 'maquiladoras', 'border', 'defense', 'protection',
                             'intelligence', 'artificial', 'threats', 'platform', 'solution',
                             'companies', 'cyber', 'binational', 'compliance', 'contact',
                             'pricing', 'free', 'assessment', 'clients', 'vulnerabilities',
                             'detection', 'landscape', 'offensive', 'native', 'start',
                             'protect', 'starter', 'professional', 'enterprise', 'custom'];

        const spanishCount = spanishWords.filter(word => text.includes(word)).length;
        const englishCount = englishWords.filter(word => text.includes(word)).length;

        return {
          sectionName,
          visibleTextSample: visibleText.substring(0, 300) + (visibleText.length > 300 ? '...' : ''),
          spanishWordsFound: spanishCount,
          englishWordsFound: englishCount,
          primaryLanguage: spanishCount > englishCount ? 'Spanish' : 
                          englishCount > spanishCount ? 'English' : 'Mixed',
          scrollPosition: scrollPosition
        };
      }, { sectionName: section.name, scrollPosition: section.scroll });

      sectionAnalysis.push(analysis);
      console.log(`   ${analysis.primaryLanguage} (ES: ${analysis.spanishWordsFound}, EN: ${analysis.englishWordsFound})`);
    }

    // Generate final comprehensive report
    console.log('\n📊 COMPREHENSIVE SPANISH FUNCTIONALITY ANALYSIS');
    console.log('='.repeat(60));
    
    console.log(`\n🌐 Site: ${url}`);
    console.log(`📄 Initial Page Title: ${initialAnalysis.pageTitle}`);
    console.log(`🇪🇸 Spanish Content Present: ${initialAnalysis.hasSpanishContent ? 'YES' : 'NO'}`);
    console.log(`🇺🇸 English Content Present: ${initialAnalysis.hasEnglishContent ? 'YES' : 'NO'}`);
    console.log(`🔘 ES Button Active Initially: ${initialAnalysis.currentLanguageButtonState.esButton ? 'YES' : 'NO'}`);
    console.log(`🔘 EN Button Active Initially: ${initialAnalysis.currentLanguageButtonState.enButton ? 'YES' : 'NO'}`);

    console.log('\n📋 SECTION-BY-SECTION ANALYSIS:');
    sectionAnalysis.forEach((section, index) => {
      console.log(`\n${index + 1}. ${section.sectionName}`);
      console.log(`   Primary Language: ${section.primaryLanguage}`);
      console.log(`   Spanish Words: ${section.spanishWordsFound}`);
      console.log(`   English Words: ${section.englishWordsFound}`);
      console.log(`   Sample Text: "${section.visibleTextSample.substring(0, 100)}..."`);
    });

    // Summary statistics
    const spanishSections = sectionAnalysis.filter(s => s.primaryLanguage === 'Spanish').length;
    const englishSections = sectionAnalysis.filter(s => s.primaryLanguage === 'English').length;
    const mixedSections = sectionAnalysis.filter(s => s.primaryLanguage === 'Mixed').length;

    console.log('\n🎯 SUMMARY RESULTS:');
    console.log('='.repeat(30));
    console.log(`📊 Total Sections Analyzed: ${sectionAnalysis.length}`);
    console.log(`🇪🇸 Sections Primarily in Spanish: ${spanishSections} (${Math.round(spanishSections/sectionAnalysis.length*100)}%)`);
    console.log(`🇺🇸 Sections Primarily in English: ${englishSections} (${Math.round(englishSections/sectionAnalysis.length*100)}%)`);
    console.log(`🔀 Mixed Language Sections: ${mixedSections} (${Math.round(mixedSections/sectionAnalysis.length*100)}%)`);

    console.log('\n✅ KEY FINDINGS:');
    const findings = [];
    
    if (initialAnalysis.currentLanguageButtonState.esButton) {
      findings.push('✅ Site defaults to Spanish (ES button active)');
    }
    
    if (spanishSections > englishSections) {
      findings.push('✅ Spanish content is predominant across sections');
    }
    
    if (initialAnalysis.pageTitle.includes('Seguridad')) {
      findings.push('✅ Page title is properly localized in Spanish');
    }

    const recommendations = [];
    
    if (englishSections > 2) {
      recommendations.push('🔧 Consider translating remaining English-only sections');
    }
    
    if (mixedSections > 1) {
      recommendations.push('🔧 Review mixed-language sections for consistency');
    }

    findings.forEach(finding => console.log(finding));
    
    if (recommendations.length > 0) {
      console.log('\n🔧 RECOMMENDATIONS:');
      recommendations.forEach(rec => console.log(rec));
    }

    // Save comprehensive report
    const report = {
      timestamp: new Date().toISOString(),
      url,
      initialAnalysis,
      sectionAnalysis,
      summary: {
        totalSections: sectionAnalysis.length,
        spanishSections,
        englishSections, 
        mixedSections,
        spanishPercentage: Math.round(spanishSections/sectionAnalysis.length*100),
        englishPercentage: Math.round(englishSections/sectionAnalysis.length*100)
      },
      findings,
      recommendations
    };

    const reportPath = path.join(__dirname, 'complete-spanish-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📁 Screenshots saved to: ${screenshotsDir}`);
    console.log(`📋 Detailed report saved to: ${reportPath}`);
    console.log('\n🎉 Spanish functionality analysis completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

completeSpanishTest().catch(console.error);