/**
 * Screenshot Script for Political Spectrum App
 * Captures all pages including the new Share and Misc pages
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  baseUrl: 'http://localhost:3000',
  outputDir: './test-results/screenshots',
  viewport: { width: 1920, height: 1080 },
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureScreenshots() {
  console.log('📸 Starting screenshot capture...');
  
  // Ensure output directory exists
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: CONFIG.viewport,
  });
  const page = await context.newPage();

  try {
    // 1. Homepage
    console.log('📷 Capturing homepage...');
    await page.goto(CONFIG.baseUrl);
    await page.waitForLoadState('networkidle');
    await sleep(3000);
    await page.screenshot({ path: path.join(CONFIG.outputDir, 'homepage.png'), fullPage: true });
    console.log('  ✓ homepage.png');

    // 2. Share Page
    console.log('📷 Capturing share page...');
    await page.goto(`${CONFIG.baseUrl}/share`);
    await page.waitForLoadState('networkidle');
    await sleep(2000);
    await page.screenshot({ path: path.join(CONFIG.outputDir, 'share-page.png'), fullPage: true });
    console.log('  ✓ share-page.png');

    // 3. Misc Page
    console.log('📷 Capturing misc page...');
    await page.goto(`${CONFIG.baseUrl}/misc`);
    await page.waitForLoadState('networkidle');
    await sleep(2000);
    await page.screenshot({ path: path.join(CONFIG.outputDir, 'misc-page.png'), fullPage: true });
    console.log('  ✓ misc-page.png');

    // 4. Footer close-up
    console.log('📷 Capturing footer...');
    await page.goto(CONFIG.baseUrl);
    await page.waitForLoadState('networkidle');
    await sleep(2000);
    
    // Scroll to footer
    await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (footer) footer.scrollIntoView({ behavior: 'instant' });
    });
    await sleep(500);
    
    const footer = await page.$('footer');
    if (footer) {
      await footer.screenshot({ path: path.join(CONFIG.outputDir, 'footer.png') });
      console.log('  ✓ footer.png');
    }

    // 5. Mobile views
    console.log('📷 Capturing mobile views...');
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(CONFIG.baseUrl);
    await page.waitForLoadState('networkidle');
    await sleep(2000);
    await page.screenshot({ path: path.join(CONFIG.outputDir, 'homepage-mobile.png'), fullPage: true });
    console.log('  ✓ homepage-mobile.png');

    await page.goto(`${CONFIG.baseUrl}/share`);
    await page.waitForLoadState('networkidle');
    await sleep(1500);
    await page.screenshot({ path: path.join(CONFIG.outputDir, 'share-mobile.png'), fullPage: true });
    console.log('  ✓ share-mobile.png');

    await page.goto(`${CONFIG.baseUrl}/misc`);
    await page.waitForLoadState('networkidle');
    await sleep(1500);
    await page.screenshot({ path: path.join(CONFIG.outputDir, 'misc-mobile.png'), fullPage: true });
    console.log('  ✓ misc-mobile.png');

    // 6. Dark mode views
    console.log('📷 Capturing dark mode views...');
    await page.setViewportSize(CONFIG.viewport);
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.goto(CONFIG.baseUrl);
    await page.waitForLoadState('networkidle');
    await sleep(2000);
    await page.screenshot({ path: path.join(CONFIG.outputDir, 'homepage-dark.png'), fullPage: true });
    console.log('  ✓ homepage-dark.png');

    await page.goto(`${CONFIG.baseUrl}/share`);
    await page.waitForLoadState('networkidle');
    await sleep(1500);
    await page.screenshot({ path: path.join(CONFIG.outputDir, 'share-dark.png'), fullPage: true });
    console.log('  ✓ share-dark.png');

    await page.goto(`${CONFIG.baseUrl}/misc`);
    await page.waitForLoadState('networkidle');
    await sleep(1500);
    await page.screenshot({ path: path.join(CONFIG.outputDir, 'misc-dark.png'), fullPage: true });
    console.log('  ✓ misc-dark.png');

    console.log('\n✅ All screenshots captured successfully!');
    
    // List all screenshots
    const files = fs.readdirSync(CONFIG.outputDir).filter(f => f.endsWith('.png'));
    console.log(`\n📁 ${files.length} screenshots saved to ${CONFIG.outputDir}/`);
    files.forEach(f => console.log(`   - ${f}`));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
