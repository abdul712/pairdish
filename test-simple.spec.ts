import { test, expect } from '@playwright/test';

test('Check what happens on dish page', async ({ page }) => {
  // Enable request logging
  page.on('request', request => {
    console.log('Request:', request.method(), request.url());
  });
  
  page.on('response', response => {
    console.log('Response:', response.status(), response.url());
  });

  // Navigate to the dish page
  await page.goto('https://pairdish.mabdulrahim.workers.dev/what-to-serve-with/what-to-serve-with-15-bean-soup');
  
  // Wait for any network activity
  await page.waitForTimeout(3000);
  
  // Take a screenshot
  await page.screenshot({ path: 'dish-page.png', fullPage: true });
  
  // Check what's on the page
  const content = await page.content();
  console.log('Page title:', await page.title());
  console.log('Page URL:', page.url());
  
  // Check for any error messages
  const errorMessages = await page.locator('text=/error|Error|404|500/i').all();
  for (const error of errorMessages) {
    console.log('Found error text:', await error.textContent());
  }
});