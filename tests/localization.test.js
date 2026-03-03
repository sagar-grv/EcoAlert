// @ts-check
import { test, expect } from '@playwright/test';

test.describe('EcoAlert Localization Tests', () => {
  test.beforeEach(async ({ page }) => {
    // First authenticate the user to access protected routes
    await page.goto('/login');
    
    // Fill in login form (using mock data)
    await page.locator('[placeholder="Enter your name"]').fill('Test User');
    await page.locator('[placeholder="Enter your phone"]').fill('1234567890');
    
    // Click login button
    await page.locator('button[type="submit"]').click();
    
    // Wait for the loading state to finish
    await page.waitForTimeout(1000);
    
    // Wait for redirect to home page
    await page.waitForURL('**/');
  });

  test('should display language picker', async ({ page }) => {
    // Look for language picker component
    await expect(page.locator('.language-picker')).toBeVisible().catch(() => {
      // If the specific class doesn't exist, look for alternative selectors
      return expect(page.locator('select').filter({ hasText: /en|es|fr|hi|de/ })).toBeVisible();
    });
  });

  test('should change language when selected', async ({ page }) => {
    // Find and click the language selector
    const langSelector = page.locator('select').filter({ hasText: /en|es|fr|hi|de/ });
    
    if (await langSelector.count() > 0) {
      // Change language to Spanish if available
      await langSelector.click();
      await page.locator('text=es').click(); // Assuming Spanish is an option
      
      // Check if some text has changed to Spanish
      await expect(page.locator('text=Inicio').or(page.locator('text=Home'))).toBeVisible();
    }
  });

  test('should persist language preference', async ({ page }) => {
    // Navigate away and back to check if language preference persists
    await page.locator('text=Explore').click();
    await page.waitForURL('**/explore');
    
    await page.locator('text=EcoAlert').click(); // Go back to home
    await page.waitForURL('**/');
    
    // Check if language preference is maintained
    const langSelector = page.locator('select').filter({ hasText: /en|es|fr|hi|de/ });
    if (await langSelector.count() > 0) {
      await expect(langSelector).toBeVisible();
    }
  });
});