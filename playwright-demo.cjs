/**
 * Political Spectrum App - Playwright Demo Script
 * 
 * This script demonstrates the app functionality with screenshots
 * for both Algorithm and AI analysis modes.
 * 
 * Usage:
 *   node playwright-demo.cjs           # Run demo
 *   node playwright-demo.cjs --ai      # Include AI analysis
 *   node playwright-demo.cjs --video   # Record video
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  outputDir: './docs/demo',
  slowMo: 100, // Slow down actions for visibility
  timeout: 30000,
  defaultViewport: { width: 1920, height: 1080 },
};

// Demo articles for testing
const DEMO_ARTICLES = [
  {
    headline: 'Congress Passes Major Infrastructure Bill After Months of Negotiations',
    source: 'CNN',
    url: 'https://cnn.com/politics/infrastructure-bill',
    category: 'Politics',
  },
  {
    headline: 'Supreme Court Rules on Landmark Environmental Case',
    source: 'Fox News',
    url: 'https://foxnews.com/politics/supreme-court-environment',
    category: 'Politics',
  },
  {
    headline: 'Federal Reserve Announces Interest Rate Decision',
    source: 'Reuters',
    url: 'https://reuters.com/business/fed-rates',
    category: 'Economy',
  },
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors.cyan}[${timestamp}]${colors.reset} ${colors[color]}${message}${colors.reset}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDemo() {
  const args = process.argv.slice(2);
  const includeAI = args.includes('--ai');
  const recordVideo = args.includes('--video');
  
  log('🎭 Political Spectrum App - Playwright Demo', 'bright');
  log('━'.repeat(50), 'cyan');
  
  ensureDir(CONFIG.outputDir);
  ensureDir(path.join(CONFIG.outputDir, 'screenshots'));
  if (recordVideo) {
    ensureDir(path.join(CONFIG.outputDir, 'videos'));
  }

  let browser;
  let context;
  let page;

  try {
    // Launch browser
    log('Launching browser...', 'blue');
    browser = await chromium.launch({
      headless: false,
      slowMo: CONFIG.slowMo,
      args: ['--start-maximized'],
    });

    context = await browser.newContext({
      viewport: CONFIG.defaultViewport,
      recordVideo: recordVideo ? { dir: path.join(CONFIG.outputDir, 'videos') } : undefined,
    });

    page = await context.newPage();
    page.setDefaultTimeout(CONFIG.timeout);

    // ==========================================
    // SCENARIO 1: App Loading & Home Page
    // ==========================================
    log('\n📍 Scenario 1: Loading Application', 'yellow');
    log('━'.repeat(40), 'cyan');

    await page.goto(CONFIG.baseUrl);
    await page.waitForLoadState('networkidle');
    await sleep(1000);

    // Take screenshot of home page
    await page.screenshot({ 
      path: path.join(CONFIG.outputDir, 'screenshots', '01-homepage.png'),
      fullPage: false 
    });
    log('✓ Screenshot: 01-homepage.png', 'green');

    // Check version badge
    const versionBadge = await page.locator('text=v2.').first();
    if (await versionBadge.isVisible()) {
      const version = await versionBadge.textContent();
      log(`✓ Version detected: ${version}`, 'green');
    }

    // ==========================================
    // SCENARIO 2: Headlines View
    // ==========================================
    log('\n📍 Scenario 2: Headlines View', 'yellow');
    log('━'.repeat(40), 'cyan');

    // Wait for headlines to load
    await page.waitForSelector('[class*="Card"]', { timeout: 10000 });
    await sleep(1500);

    await page.screenshot({ 
      path: path.join(CONFIG.outputDir, 'screenshots', '02-headlines.png'),
      fullPage: true 
    });
    log('✓ Screenshot: 02-headlines.png', 'green');

    // ==========================================
    // SCENARIO 3: Algorithm Analysis Demo
    // ==========================================
    log('\n📍 Scenario 3: Algorithm Analysis', 'yellow');
    log('━'.repeat(40), 'cyan');

    // Click on first headline
    const firstHeadline = page.locator('button:has-text(":")').first();
    if (await firstHeadline.isVisible()) {
      log('Clicking first headline...', 'blue');
      await firstHeadline.click();
      
      // Wait for analysis to complete
      await page.waitForSelector('text=Spectrum Score', { timeout: 15000 });
      await sleep(2000);

      // Take screenshot of algorithm analysis
      await page.screenshot({ 
        path: path.join(CONFIG.outputDir, 'screenshots', '03-algorithm-analysis.png'),
        fullPage: true 
      });
      log('✓ Screenshot: 03-algorithm-analysis.png', 'green');

      // Check for analysis elements
      const spectrumScore = await page.locator('text=Spectrum Score').isVisible();
      const tags = await page.locator('[class*="Badge"]').count();
      const signals = await page.locator('text=Signal Analysis').isVisible();

      log(`  ├─ Spectrum Score visible: ${spectrumScore ? '✓' : '✗'}`, spectrumScore ? 'green' : 'red');
      log(`  ├─ Tags count: ${tags}`, 'blue');
      log(`  └─ Signal Analysis visible: ${signals ? '✓' : '✗'}`, signals ? 'green' : 'red');

      // Scroll to capture evidence panel
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await sleep(500);

      await page.screenshot({ 
        path: path.join(CONFIG.outputDir, 'screenshots', '04-algorithm-evidence.png'),
        fullPage: true 
      });
      log('✓ Screenshot: 04-algorithm-evidence.png', 'green');
    }

    // ==========================================
    // SCENARIO 4: Analytics Dashboard
    // ==========================================
    log('\n📍 Scenario 4: Analytics Dashboard', 'yellow');
    log('━'.repeat(40), 'cyan');

    // Go back to home
    await page.goto(CONFIG.baseUrl);
    await page.waitForLoadState('networkidle');

    // Click Analytics button
    const analyticsBtn = page.locator('button:has-text("Analytics")');
    if (await analyticsBtn.isVisible()) {
      await analyticsBtn.click();
      await sleep(2000);

      await page.screenshot({ 
        path: path.join(CONFIG.outputDir, 'screenshots', '05-analytics.png'),
        fullPage: true 
      });
      log('✓ Screenshot: 05-analytics.png', 'green');

      // Check analytics elements
      const totalArticles = await page.locator('text=Total Articles').isVisible();
      const biasDist = await page.locator('text=Bias Distribution').isVisible();
      const topSources = await page.locator('text=Top Sources').isVisible();

      log(`  ├─ Total Articles visible: ${totalArticles ? '✓' : '✗'}`, totalArticles ? 'green' : 'red');
      log(`  ├─ Bias Distribution visible: ${biasDist ? '✓' : '✗'}`, biasDist ? 'green' : 'red');
      log(`  └─ Top Sources visible: ${topSources ? '✓' : '✗'}`, topSources ? 'green' : 'red');
    }

    // ==========================================
    // SCENARIO 5: Authors View
    // ==========================================
    log('\n📍 Scenario 5: Authors Political Leanings', 'yellow');
    log('━'.repeat(40), 'cyan');

    // Click Authors button
    const authorsBtn = page.locator('button:has-text("Authors")');
    if (await authorsBtn.isVisible()) {
      await authorsBtn.click();
      await sleep(2000);

      await page.screenshot({ 
        path: path.join(CONFIG.outputDir, 'screenshots', '06-authors.png'),
        fullPage: true 
      });
      log('✓ Screenshot: 06-authors.png', 'green');

      // Check for author categories
      const leftAuthors = await page.locator('text=Left-Leaning').isVisible();
      const centerAuthors = await page.locator('text=Center').isVisible();
      const rightAuthors = await page.locator('text=Right-Leaning').isVisible();

      log(`  ├─ Left-Leaning authors: ${leftAuthors ? '✓' : '✗'}`, leftAuthors ? 'green' : 'red');
      log(`  ├─ Center authors: ${centerAuthors ? '✓' : '✗'}`, centerAuthors ? 'green' : 'red');
      log(`  └─ Right-Leaning authors: ${rightAuthors ? '✓' : '✗'}`, rightAuthors ? 'green' : 'red');
    }

    // ==========================================
    // SCENARIO 6: Settings Page
    // ==========================================
    log('\n📍 Scenario 6: Settings Page', 'yellow');
    log('━'.repeat(40), 'cyan');

    // Click Settings button
    const settingsBtn = page.locator('button:has-text("Settings")');
    if (await settingsBtn.isVisible()) {
      await settingsBtn.click();
      await sleep(1000);

      await page.screenshot({ 
        path: path.join(CONFIG.outputDir, 'screenshots', '07-settings.png'),
        fullPage: true 
      });
      log('✓ Screenshot: 07-settings.png', 'green');

      // Check API key fields
      const openaiField = await page.locator('input[id="openai"]').isVisible();
      const anthropicField = await page.locator('input[id="anthropic"]').isVisible();

      log(`  ├─ OpenAI API field: ${openaiField ? '✓' : '✗'}`, openaiField ? 'green' : 'red');
      log(`  └─ Anthropic API field: ${anthropicField ? '✓' : '✗'}`, anthropicField ? 'green' : 'red');
    }

    // ==========================================
    // SCENARIO 7: AI Analysis (Optional)
    // ==========================================
    if (includeAI) {
      log('\n📍 Scenario 7: AI Analysis', 'yellow');
      log('━'.repeat(40), 'cyan');

      // Go back to headlines
      await page.goto(CONFIG.baseUrl);
      await page.waitForLoadState('networkidle');
      await sleep(1000);

      // Click on a headline
      const headline = page.locator('button:has-text(":")').first();
      if (await headline.isVisible()) {
        await headline.click();
        await page.waitForSelector('text=Spectrum Score', { timeout: 15000 });
        await sleep(1000);

        // Look for AI analysis button
        const aiBtn = page.locator('button:has-text("Analyze with AI")');
        if (await aiBtn.isVisible()) {
          log('Clicking AI analysis button...', 'blue');
          await aiBtn.click();

          // Wait for AI analysis
          await sleep(5000);

          try {
            await page.waitForSelector('text=AI Analysis', { timeout: 30000 });
            await sleep(2000);

            await page.screenshot({ 
              path: path.join(CONFIG.outputDir, 'screenshots', '08-ai-analysis.png'),
              fullPage: true 
            });
            log('✓ Screenshot: 08-ai-analysis.png', 'green');

            // Check for AI-specific elements
            const aiProvider = await page.locator('text=Provider:').isVisible();
            const enhancedPerspective = await page.locator('text=Perspective').isVisible();

            log(`  ├─ AI Provider info: ${aiProvider ? '✓' : '✗'}`, aiProvider ? 'green' : 'red');
            log(`  └─ Enhanced perspectives: ${enhancedPerspective ? '✓' : '✗'}`, enhancedPerspective ? 'green' : 'red');
          } catch (e) {
            log('⚠ AI analysis timed out or no API key configured', 'yellow');
            await page.screenshot({ 
              path: path.join(CONFIG.outputDir, 'screenshots', '08-ai-analysis-timeout.png'),
              fullPage: true 
            });
          }
        } else {
          log('⚠ AI analysis button not found', 'yellow');
        }
      }
    }

    // ==========================================
    // SCENARIO 8: System Test
    // ==========================================
    log('\n📍 Scenario 8: System Test Endpoint', 'yellow');
    log('━'.repeat(40), 'cyan');

    await page.goto(`${CONFIG.baseUrl}/api/test?type=all`);
    await sleep(2000);

    // Get JSON response
    const content = await page.content();
    if (content.includes('"success"') || content.includes('"passed"')) {
      log('✓ System test endpoint responding', 'green');
      await page.screenshot({ 
        path: path.join(CONFIG.outputDir, 'screenshots', '09-system-test.png'),
      });
      log('✓ Screenshot: 09-system-test.png', 'green');
    } else {
      log('⚠ System test may have issues', 'yellow');
    }

    // ==========================================
    // Generate Demo Summary
    // ==========================================
    log('\n📊 Demo Summary', 'bright');
    log('━'.repeat(50), 'cyan');

    const screenshots = fs.readdirSync(path.join(CONFIG.outputDir, 'screenshots'));
    log(`Total screenshots captured: ${screenshots.length}`, 'blue');
    screenshots.forEach(file => {
      log(`  ├─ ${file}`, 'green');
    });

    if (recordVideo) {
      const videos = fs.readdirSync(path.join(CONFIG.outputDir, 'videos'));
      log(`Videos recorded: ${videos.length}`, 'blue');
    }

    // Create demo report
    const report = generateReport(screenshots, includeAI, recordVideo);
    fs.writeFileSync(path.join(CONFIG.outputDir, 'README.md'), report);
    log('\n✓ Demo report saved to docs/demo/README.md', 'green');

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    console.error(error);

    // Save error screenshot
    if (page) {
      await page.screenshot({ 
        path: path.join(CONFIG.outputDir, 'screenshots', 'error.png'),
      });
    }
  } finally {
    if (context) await context.close();
    if (browser) await browser.close();
    log('\n🎭 Demo completed!', 'bright');
  }
}

function generateReport(screenshots, includeAI, recordVideo) {
  return `# Political Spectrum App - Demo Screenshots

**Generated:** ${new Date().toISOString()}

## Screenshots

| # | Screenshot | Description |
|---|------------|-------------|
| 01 | home.png | Application home page with headlines ticker |
| 02 | headlines.png | Main headlines view with left/center/right columns |
| 03 | algorithm-analysis.png | Algorithm-based analysis result |
| 04 | algorithm-evidence.png | Evidence panel with signals and tags |
| 05 | analytics.png | Analytics dashboard with bias distribution |
| 06 | authors.png | Author political leanings database |
| 07 | settings.png | Settings page with API key configuration |
| 08 | ai-analysis.png | AI-powered analysis result |
| 09 | system-test.png | System test endpoint response |

## Features Demonstrated

### Algorithm Analysis (Default)
- **3-Layer Scoring Pipeline**: Outlet baseline → Article delta → Final score
- **Evidence Panel**: Shows exactly what influenced the classification
- **Signal Detection**: Headline emotionality, topic framing, source diversity
- **Confidence Scoring**: Reliability indicator for each analysis

### AI Analysis (Optional)
${includeAI ? '- AI-powered deep analysis with enhanced perspectives' : '- Requires --ai flag and configured API keys'}

### Analytics Dashboard
- Total articles count
- Bias distribution visualization
- Top sources analysis
- Topic distribution

### Author Database
- 18+ journalists categorized by political lean
- Reliability ratings
- Outlet associations

## Running the Demo

\`\`\`bash
# Basic demo (algorithm analysis only)
node playwright-demo.cjs

# Include AI analysis
node playwright-demo.cjs --ai

# Record video
node playwright-demo.cjs --video

# Both
node playwright-demo.cjs --ai --video
\`\`\`

## Prerequisites

1. App running on localhost:3000
2. Playwright installed: \`npm install -D @playwright/test\`
3. Browser installed: \`npx playwright install chromium\`
4. For AI demo: API keys configured in settings

---
*Generated by Playwright Demo Script*
`;
}

// Run the demo
runDemo().catch(console.error);
