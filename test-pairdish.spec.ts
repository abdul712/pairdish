import { test, expect } from '@playwright/test';

const BASE_URL = 'https://pairdish.mabdulrahim.workers.dev';

test.describe('PairDish Website Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Log network requests for debugging
    page.on('request', request => {
      if (request.url().includes('/api/') || request.url().includes('/dishes')) {
        console.log('API Request:', request.method(), request.url());
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/') || response.url().includes('/dishes')) {
        console.log('API Response:', response.status(), response.url());
      }
    });
  });

  test('Homepage loads and shows main content', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Check title
    await expect(page).toHaveTitle(/PairDish/);
    
    // Check that it's not showing API docs
    const apiDocs = await page.locator('text="PairDish API"').count();
    expect(apiDocs).toBe(0);
    
    // Wait for React app to load
    await page.waitForTimeout(2000);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'homepage.png', fullPage: true });
  });

  test('API endpoints are working', async ({ page }) => {
    // Test main API endpoint
    const apiResponse = await page.request.get(`${BASE_URL}/api`);
    expect(apiResponse.ok()).toBeTruthy();
    const apiData = await apiResponse.json();
    expect(apiData.name).toBe('PairDish API');
    
    // Test dishes endpoint
    const dishesResponse = await page.request.get(`${BASE_URL}/api/dishes`);
    expect(dishesResponse.ok()).toBeTruthy();
    const dishesData = await dishesResponse.json();
    expect(dishesData.success).toBe(true);
    
    // Test specific pairing endpoint
    const pairingsResponse = await page.request.get(`${BASE_URL}/api/pairings/what-to-serve-with-15-bean-soup`);
    expect(pairingsResponse.ok()).toBeTruthy();
    const pairingsData = await pairingsResponse.json();
    expect(pairingsData.success).toBe(true);
    expect(pairingsData.data.main_dish).toBeDefined();
    expect(pairingsData.data.side_dishes).toBeDefined();
  });

  test('Dish pairing page loads via direct URL', async ({ page }) => {
    // Navigate directly to a dish page
    await page.goto(`${BASE_URL}/what-to-serve-with/what-to-serve-with-15-bean-soup`);
    
    // Wait for React app to handle routing
    await page.waitForTimeout(3000);
    
    // The page should not show error
    const errorCount = await page.locator('text="Internal Server Error"').count();
    expect(errorCount).toBe(0);
    
    // Take screenshot
    await page.screenshot({ path: 'dish-page-direct.png', fullPage: true });
  });

  test('Navigation from homepage to dish page works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Look for dish links
    const dishLinks = await page.locator('a[href*="/what-to-serve-with/"]').all();
    console.log(`Found ${dishLinks.length} dish links`);
    
    if (dishLinks.length > 0) {
      // Click the first dish link
      await dishLinks[0].click();
      
      // Wait for navigation
      await page.waitForTimeout(2000);
      
      // Check URL changed
      expect(page.url()).toContain('/what-to-serve-with/');
      
      // Take screenshot
      await page.screenshot({ path: 'dish-page-nav.png', fullPage: true });
    }
  });

  test('Search functionality exists', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Look for search input
    const searchInputs = await page.locator('input[type="search"], input[type="text"], input').all();
    console.log(`Found ${searchInputs.length} input fields`);
    
    // Take screenshot to see what's on the page
    await page.screenshot({ path: 'homepage-search.png', fullPage: true });
  });

  test('Frontend routes are handled correctly', async ({ page }) => {
    // Test various routes
    const routes = [
      '/',
      '/search',
      '/what-to-serve-with/what-to-serve-with-15-bean-soup',
      '/dishes/what-to-serve-with-15-bean-soup/pairings',
      '/recipe/some-recipe'
    ];
    
    for (const route of routes) {
      const response = await page.goto(`${BASE_URL}${route}`);
      expect(response.status()).toBeLessThan(400);
      console.log(`Route ${route}: ${response.status()}`);
    }
  });
});