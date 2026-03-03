// @ts-check
import { test, expect } from '@playwright/test';

test.describe('EcoAlert Navigation Tests', () => {
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

  test('should navigate to Explore page', async ({ page }) => {
    // Click on Explore in bottom navigation
    await page.locator('text=Explore').click();
    
    // Wait for navigation
    await page.waitForURL('**/explore');
    await expect(page).toHaveURL(/.*\/explore$/);
  });

  test('should navigate to Near Me page', async ({ page }) => {
    // Click on Near Me in bottom navigation
    await page.locator('text=Near Me').click();
    
    // Wait for navigation
    await page.waitForURL('**/near-me');
    await expect(page).toHaveURL(/.*\/near-me$/);
  });

  test('should navigate to Analysis page', async ({ page }) => {
    // Click on Analysis in bottom navigation
    await page.locator('text=Analysis').click();
    
    // Wait for navigation
    await page.waitForURL('**/analysis');
    await expect(page).toHaveURL(/.*\/analysis$/);
  });

  test('should navigate using top navbar', async ({ page }) => {
    // Click on logo to go to home
    await page.locator('text=EcoAlert').click(); // Click on the EcoAlert logo text
    
    // Wait for navigation
    await page.waitForURL('**/');
    await expect(page).toHaveURL(/.*\/$/);
  });
});