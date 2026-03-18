/**
 * Playwright E2E Tests for Political Spectrum App
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Political Spectrum App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Homepage loads correctly', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/Political Spectrum/);
    
    // Check version badge
    const versionBadge = page.locator('text=v2.');
    await expect(versionBadge.first()).toBeVisible();
    
    // Check main heading
    await expect(page.locator('h1:has-text("Political")')).toBeVisible();
  });

  test('Headlines section loads', async ({ page }) => {
    // Wait for headlines to appear
    await page.waitForSelector('[class*="Card"]', { timeout: 10000 });
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/headlines.png' });
  });

  test('Algorithm analysis works', async ({ page }) => {
    // Wait for headlines
    await page.waitForSelector('button:has-text(":")', { timeout: 10000 });
    
    // Click first headline
    const headline = page.locator('button:has-text(":")').first();
    await headline.click();
    
    // Wait for analysis
    await page.waitForSelector('text=Spectrum Score', { timeout: 15000 });
    
    // Check spectrum score is visible
    await expect(page.locator('text=Spectrum Score')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/algorithm-analysis.png', fullPage: true });
  });

  test('Analytics dashboard loads', async ({ page }) => {
    // Click Analytics button
    await page.click('button:has-text("Analytics")');
    
    // Wait for analytics
    await page.waitForSelector('text=Total Articles', { timeout: 10000 });
    
    // Check elements
    await expect(page.locator('text=Total Articles')).toBeVisible();
    await expect(page.locator('text=Bias Distribution')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/analytics.png', fullPage: true });
  });

  test('Authors view loads', async ({ page }) => {
    // Click Authors button
    await page.click('button:has-text("Authors")');
    
    // Wait for authors
    await page.waitForSelector('text=Left-Leaning', { timeout: 10000 });
    
    // Check categories
    await expect(page.locator('text=Left-Leaning')).toBeVisible();
    await expect(page.locator('text=Center')).toBeVisible();
    await expect(page.locator('text=Right-Leaning')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/authors.png', fullPage: true });
  });

  test('Settings page works', async ({ page }) => {
    // Click Settings button
    await page.click('button:has-text("Settings")');
    
    // Check API key fields
    await expect(page.locator('#openai')).toBeVisible();
    await expect(page.locator('#anthropic')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/settings.png', fullPage: true });
  });

  test('API endpoints respond', async ({ page }) => {
    // Test version endpoint
    const versionResp = await page.request.get(`${BASE_URL}/api/version`);
    expect(versionResp.ok()).toBeTruthy();
    
    // Test test endpoint
    const testResp = await page.request.get(`${BASE_URL}/api/test?type=all`);
    expect(testResp.ok()).toBeTruthy();
  });
});
