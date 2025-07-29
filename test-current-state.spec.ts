import { test, expect } from '@playwright/test';

const BASE_URL = 'https://pairdish.mabdulrahim.workers.dev';

test.describe('Document Current Issues', () => {
  test('Document homepage issues', async ({ page }) => {
    console.log('=== Testing Homepage ===');
    await page.goto(BASE_URL);
    await page.waitForTimeout(3000);
    
    // Take screenshot of homepage
    await page.screenshot({ path: 'issues/01-homepage-current.png', fullPage: true });
    
    // Count dishes shown
    const dishCards = await page.locator('a[href*="/what-to-serve-with"]').all();
    console.log(`Number of dishes shown: ${dishCards.length}`);
    
    // Check for images
    const images = await page.locator('img').all();
    console.log(`Number of images found: ${images.length}`);
    
    // Check image sources
    for (let i = 0; i < Math.min(5, images.length); i++) {
      const src = await images[i].getAttribute('src');
      console.log(`Image ${i + 1} src: ${src}`);
    }
    
    // Check dish URLs
    for (let i = 0; i < Math.min(5, dishCards.length); i++) {
      const href = await dishCards[i].getAttribute('href');
      console.log(`Dish ${i + 1} URL: ${href}`);
    }
  });

  test('Document dish page issues', async ({ page }) => {
    console.log('\n=== Testing Dish Pages ===');
    
    // Test the double-prefix URL (current broken state)
    console.log('Testing double-prefix URL...');
    await page.goto(`${BASE_URL}/what-to-serve-with/what-to-serve-with-15-bean-soup`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'issues/02-dish-page-double-prefix.png', fullPage: true });
    
    // Check for error messages
    const errorText = await page.locator('body').textContent();
    console.log('Page shows:', errorText?.substring(0, 100));
    
    // Test the correct URL format
    console.log('\nTesting correct URL format...');
    await page.goto(`${BASE_URL}/what-to-serve-with/15-bean-soup`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'issues/03-dish-page-correct-format.png', fullPage: true });
    
    // Check what's shown
    const correctPageText = await page.locator('body').textContent();
    console.log('Page shows:', correctPageText?.substring(0, 100));
  });

  test('Document API responses', async ({ page }) => {
    console.log('\n=== Testing API Endpoints ===');
    
    // Test dishes endpoint
    const dishesResponse = await page.request.get(`${BASE_URL}/api/dishes?limit=10`);
    const dishesData = await dishesResponse.json();
    console.log(`Total dishes returned: ${dishesData.data?.length || 0}`);
    
    // Check first few dishes
    if (dishesData.data) {
      for (let i = 0; i < Math.min(3, dishesData.data.length); i++) {
        const dish = dishesData.data[i];
        console.log(`\nDish ${i + 1}:`);
        console.log(`  Name: ${dish.name}`);
        console.log(`  Slug: ${dish.slug}`);
        console.log(`  Image URL: ${dish.image_url}`);
      }
    }
    
    // Test pairing endpoint
    const pairingResponse = await page.request.get(`${BASE_URL}/api/pairings/what-to-serve-with-15-bean-soup`);
    const pairingData = await pairingResponse.json();
    console.log(`\nPairing API response status: ${pairingResponse.status()}`);
    if (pairingData.success) {
      console.log(`Main dish: ${pairingData.data.main_dish.name}`);
      console.log(`Side dishes count: ${pairingData.data.side_dishes.length}`);
    }
  });

  test('Navigate and check broken image loading', async ({ page }) => {
    console.log('\n=== Testing Image Loading ===');
    await page.goto(BASE_URL);
    await page.waitForTimeout(3000);
    
    // Listen for failed image loads
    const failedImages: string[] = [];
    page.on('response', response => {
      if (response.url().includes('unsplash.com') && response.status() >= 400) {
        failedImages.push(response.url());
      }
    });
    
    // Wait for images to attempt loading
    await page.waitForTimeout(5000);
    
    console.log(`Failed image loads: ${failedImages.length}`);
    failedImages.forEach((url, i) => {
      console.log(`Failed image ${i + 1}: ${url}`);
    });
    
    // Take close-up screenshot of first few dish cards
    const firstDishCard = await page.locator('a[href*="/what-to-serve-with"]').first();
    if (await firstDishCard.isVisible()) {
      await firstDishCard.screenshot({ path: 'issues/04-dish-card-broken-image.png' });
    }
  });
});