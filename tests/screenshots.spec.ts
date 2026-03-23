/**
 * Screenshot Tests for Political Spectrum App
 * Captures screenshots of all pages for documentation
 */

import { test } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SCREENSHOT_DIR = 'test-results/screenshots';

test.describe('Screenshot Capture', () => {
  test('capture homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/homepage.png`, 
      fullPage: true 
    });
    
    // Take viewport screenshot
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/homepage-viewport.png` 
    });
  });

  test('capture share page', async ({ page }) => {
    await page.goto(`${BASE_URL}/share`);
    await page.waitForLoadState('networkidle');
    
    // Wait for animations
    await page.waitForTimeout(1000);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/share-page.png`, 
      fullPage: true 
    });
    
    // Take viewport screenshot
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/share-page-viewport.png` 
    });
  });

  test('capture misc page', async ({ page }) => {
    await page.goto(`${BASE_URL}/misc`);
    await page.waitForLoadState('networkidle');
    
    // Wait for animations
    await page.waitForTimeout(1000);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/misc-page.png`, 
      fullPage: true 
    });
    
    // Take viewport screenshot
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/misc-page-viewport.png` 
    });
  });

  test('capture mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/homepage-mobile.png`, 
      fullPage: true 
    });
    
    // Mobile share page
    await page.goto(`${BASE_URL}/share`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/share-page-mobile.png`, 
      fullPage: true 
    });
    
    // Mobile misc page
    await page.goto(`${BASE_URL}/misc`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/misc-page-mobile.png`, 
      fullPage: true 
    });
  });

  test('capture dark mode', async ({ page }) => {
    // Emulate dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/homepage-dark.png`, 
      fullPage: true 
    });
    
    // Dark mode share page
    await page.goto(`${BASE_URL}/share`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/share-page-dark.png`, 
      fullPage: true 
    });
    
    // Dark mode misc page
    await page.goto(`${BASE_URL}/misc`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/misc-page-dark.png`, 
      fullPage: true 
    });
  });

  test('capture footer', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Scroll to footer
    await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'instant' });
      }
    });
    
    await page.waitForTimeout(500);
    
    // Take screenshot of footer area
    const footer = await page.locator('footer');
    await footer.screenshot({ 
      path: `${SCREENSHOT_DIR}/footer.png` 
    });
  });
});
