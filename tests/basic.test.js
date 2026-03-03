// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Basic EcoAlert Tests', () => {
  test('should load the login page', async ({ page }) => {
    // Go directly to the login page
    await page.goto('/login');
    
    // Check page title contains EcoAlert
    await expect(page).toHaveTitle(/EcoAlert/);
    
    // Check that the login form is visible
    await expect(page.locator('[placeholder="Enter your name"]')).toBeVisible();
    await expect(page.locator('[placeholder="Enter your phone"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    console.log('Basic test passed: Login page loaded successfully');
  });

  test('should have the correct app name', async ({ page }) => {
    await page.goto('/login');
    
    // Check for the app name in the logo
    await expect(page.locator('text=EcoAlert')).toBeVisible();
    await expect(page.locator('text=X for the Environment')).toBeVisible();
  });
});