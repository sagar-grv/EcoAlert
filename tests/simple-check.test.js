// @ts-check
import { test, expect } from '@playwright/test';

test('should load the application', async ({ page }) => {
  // Just navigate to the main page
  await page.goto('http://localhost:5175/');
  
  // Wait for the page to load
  await page.waitForTimeout(2000);
  
  // Check if the root element exists
  const rootElement = await page.$('#root');
  expect(rootElement).toBeTruthy();
  
  // Take a screenshot to see what's rendered
  await page.screenshot({ path: 'debug-home-page.png' });
  
  // Log the page title
  const title = await page.title();
  console.log(`Page title: ${title}`);
  
  // Log the innerHTML of the root element
  const rootContent = await page.innerHTML('#root');
  console.log(`Root content: ${rootContent.substring(0, 200)}...`);
});