// @ts-check
import { test, expect } from '@playwright/test';

test.describe('EcoAlert Create Post Tests', () => {
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

  test('should open create post modal', async ({ page }) => {
    // Click on the create post button (the '+' icon in BottomNav)
    await page.locator('button').filter({ hasText: '+' }).click();
    
    // Wait for modal to appear
    await expect(page.locator('text=Report an Issue')).toBeVisible();
  });

  test('should submit a new post', async ({ page }) => {
    // Click on the create post button
    await page.locator('button').filter({ hasText: '+' }).click();
    
    // Fill in post details
    await page.locator('textarea[placeholder="What environmental issue are you reporting?"]').fill('Test Environmental Issue - This is a test report of an environmental issue.');
    
    // Select a category
    await page.locator('button').filter({ hasText: 'Air' }).click();
    await page.locator('button').filter({ hasText: 'Water' }).click(); // Select Water category
    
    // Submit the post
    await page.locator('button[type="submit"]').click();
    
    // Wait for submission to complete
    await page.waitForTimeout(2000);
    
    // Verify the post appears on the page
    await expect(page.locator('text=Test Environmental Issue')).toBeVisible();
  });
});