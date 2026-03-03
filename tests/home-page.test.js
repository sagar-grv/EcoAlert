// @ts-check
import { test, expect } from '@playwright/test';

test.describe('EcoAlert Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Don't navigate in beforeEach since we want to test different scenarios
  });

  test('should redirect to login when accessing home page without authentication', async ({ page }) => {
    await page.goto('/');
    
    // Should be redirected to login page
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/.*\/login$/);
    
    // Check page title contains EcoAlert
    await expect(page).toHaveTitle(/EcoAlert/);
  });

  test('should navigate to login page when not authenticated', async ({ page }) => {
    // Since we're using mock authentication, initially user will be redirected to login
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/.*\/login$/);
    await expect(page.locator('text=login')).toBeVisible();
  });

  test('should allow user signup', async ({ page }) => {
    // Go to signup page
    await page.goto('/signup');
    
    // Fill in signup form
    await page.locator('[placeholder="Enter your name"]').fill('Test User');
    await page.locator('[placeholder="Enter your phone"]').fill('1234567890');
    
    // Click signup button
    await page.locator('button[type="submit"]').click();
    
    // Wait for the loading state to finish
    await page.waitForTimeout(1000);
    
    // After signup, should be redirected to home page
    await page.waitForURL('**/');
    await expect(page).toHaveURL(/.*\/$/);
  });

  test('should allow user login', async ({ page }) => {
    // Go to login page
    await page.goto('/login');
    
    // Fill in login form (using mock data)
    await page.locator('[placeholder="Enter your name"]').fill('Test User');
    await page.locator('[placeholder="Enter your phone"]').fill('1234567890');
    
    // Click login button
    await page.locator('button[type="submit"]').click();
    
    // Wait for the loading state to finish
    await page.waitForTimeout(1000);
    
    // After login, should be redirected to home page
    await page.waitForURL('**/');
    await expect(page).toHaveURL(/.*\/$/);
  });
});