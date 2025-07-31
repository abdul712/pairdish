import { test, expect } from '@playwright/test';

const BASE_URL = 'https://pairdish.mabdulrahim.workers.dev';

test.describe('PairDish Deployment Tests', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check that we're not seeing the API documentation
    await expect(page.locator('text="PairDish API"')).not.toBeVisible();
    
    // Check for main page elements
    await expect(page).toHaveTitle(/PairDish/i);
    
    // Check for navigation or header
    const header = page.locator('header, nav, [role="navigation"]').first();
    await expect(header).toBeVisible();
  });

  test('dish pairing page loads correctly', async ({ page }) => {
    // Test a known dish URL
    await page.goto(`${BASE_URL}/what-to-serve-with/what-to-serve-with-15-bean-soup`);
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check that we get pairing content, not an error
    const errorText = page.locator('text="error"');
    const count = await errorText.count();
    expect(count).toBe(0);
    
    // Check for main dish content
    await expect(page.locator('text="15 Bean Soup"').first()).toBeVisible();
    
    // Check for side dish recommendations
    const sideDishes = page.locator('[data-testid="side-dish"], .side-dish, [class*="dish-card"]');
    await expect(sideDishes.first()).toBeVisible();
  });

  test('search functionality works', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Find and use search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[name="search"]').first();
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('soup');
    await searchInput.press('Enter');
    
    // Wait for search results
    await page.waitForLoadState('networkidle');
    
    // Check for search results
    const results = page.locator('[data-testid="search-result"], .search-result, [class*="result"]');
    await expect(results.first()).toBeVisible();
  });

  test('popular dishes section exists', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for popular dishes section
    const popularSection = page.locator('text="Popular Dishes"').first();
    await expect(popularSection).toBeVisible();
    
    // Check for dish cards
    const dishCards = page.locator('[data-testid="dish-card"], .dish-card, [class*="dish-card"]');
    await expect(dishCards.first()).toBeVisible();
  });

  test('categories/navigation works', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for category links or navigation
    const categories = page.locator('a[href*="/category"], a[href*="/dishes"], nav a');
    const categoryCount = await categories.count();
    expect(categoryCount).toBeGreaterThan(0);
  });

  test('responsive design works', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    // Check that page is still functional
    await expect(page.locator('header, nav').first()).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('header, nav').first()).toBeVisible();
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await expect(page.locator('header, nav').first()).toBeVisible();
  });

  test('error handling works', async ({ page }) => {
    // Test 404 page
    await page.goto(`${BASE_URL}/non-existent-page-12345`);
    
    // Should still show the app shell, not a server error
    await expect(page.locator('header, nav').first()).toBeVisible();
  });

  test('API endpoints are accessible', async ({ page }) => {
    // Test that API endpoints still work
    const response = await page.request.get(`${BASE_URL}/api`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.name).toBe('PairDish API');
    expect(data.version).toBe('1.0.0');
  });

  test('loading states are shown', async ({ page }) => {
    // Slow down network to see loading states
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 1000);
    });
    
    await page.goto(BASE_URL);
    
    // Check for loading indicators
    const loadingIndicators = page.locator('[data-testid="loading"], .loading, [class*="skeleton"], [class*="loading"]');
    const hasLoadingStates = await loadingIndicators.count() > 0;
    expect(hasLoadingStates).toBeTruthy();
  });

  test('dish recipe details are accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/what-to-serve-with/what-to-serve-with-15-bean-soup`);
    
    // Wait for content
    await page.waitForLoadState('networkidle');
    
    // Check if there are recipe links or buttons
    const recipeLinks = page.locator('a[href*="/recipe"], button:has-text("View Recipe"), [data-testid="recipe-link"]');
    if (await recipeLinks.count() > 0) {
      await recipeLinks.first().click();
      
      // Check that recipe page loads
      await page.waitForLoadState('networkidle');
      const recipeContent = page.locator('[data-testid="recipe-content"], .recipe-content, [class*="recipe"]');
      await expect(recipeContent.first()).toBeVisible();
    }
  });
});