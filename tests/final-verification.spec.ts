import { test, expect } from '@playwright/test'

const BASE_URL = 'https://pairdish.mabdulrahim.workers.dev'

test.describe('Final URL Pattern Verification', () => {
  test('original problematic URL works with correct format', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/what-to-serve-with-a-cheese-souffle`)
    expect(response.ok()).toBeTruthy()
    
    const text = await response.text()
    expect(text).toContain('What to Serve with Cheese Souffle')
    expect(text).toContain('Perfect Pairings')
    expect(text).toContain('Charcuterie Board')
    expect(text).toContain('90% Match')
    
    console.log('✅ CORRECT URL FORMAT WORKS: /what-to-serve-with-a-cheese-souffle')
  })

  test('verify other dish URLs work with correct pattern', async ({ request }) => {
    const testDishes = [
      'what-to-serve-with-15-bean-soup',
      'what-to-serve-with-baked-potato', 
      'what-to-serve-with-breakfast-casserole',
      'what-to-serve-with-charcuterie-board'
    ]
    
    for (const dishUrl of testDishes) {
      const response = await request.get(`${BASE_URL}/${dishUrl}`)
      expect(response.ok(), `${dishUrl} should work`).toBeTruthy()
      
      const text = await response.text()
      expect(text, `${dishUrl} should contain content`).toContain('What to Serve with')
      expect(text, `${dishUrl} should contain pairings`).toContain('Perfect Pairings')
      
      console.log(`✅ ${dishUrl} works correctly`)
    }
  })

  test('wrong URL patterns should not work', async ({ request }) => {
    const wrongUrls = [
      '/what-to-serve-with/a-cheese-souffle', // Wrong: has slash separator
      '/what-to-serve-with/cheese-souffle',   // Wrong: has slash separator
    ]
    
    for (const wrongUrl of wrongUrls) {
      const response = await request.get(`${BASE_URL}${wrongUrl}`, {
        failOnStatusCode: false
      })
      
      // These should either 404 or serve the React app (not the server-rendered page)
      if (response.ok()) {
        const text = await response.text()
        // If it serves content, it should be the React app, not server-rendered
        expect(text).not.toContain('What to Serve with Cheese Souffle')
      }
      
      console.log(`✅ Wrong URL pattern handled correctly: ${wrongUrl} (${response.status()})`)
    }
  })

  test('page content is properly rendered', async ({ page }) => {
    await page.goto(`${BASE_URL}/what-to-serve-with-a-cheese-souffle`)
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/What to Serve with Cheese Souffle/)
    
    // Check that main content is visible
    await expect(page.locator('h1')).toContainText('What to Serve with Cheese Souffle')
    await expect(page.locator('text=Perfect Pairings')).toBeVisible()
    
    // Check that pairings are shown
    await expect(page.locator('text=Charcuterie Board')).toBeVisible()
    await expect(page.locator('text=90% Match')).toBeVisible()
    
    console.log('✅ Page renders correctly with all expected content')
  })

  test('verify URL format consistency across app', async ({ request }) => {
    // Check that the debug endpoint still works
    const debugResponse = await request.get(`${BASE_URL}/api/debug/dishes`)
    expect(debugResponse.ok()).toBeTruthy()
    
    const debugData = await debugResponse.json()
    expect(debugData.success).toBe(true)
    expect(debugData.dishes).toHaveLength(10)
    
    // Check that each dish's slug can be accessed with the correct URL pattern
    for (const dish of debugData.dishes.slice(0, 3)) { // Test first 3 dishes
      const dishUrl = `${BASE_URL}/what-to-serve-with-${dish.slug}`
      const response = await request.get(dishUrl)
      expect(response.ok(), `Dish ${dish.slug} should be accessible`).toBeTruthy()
      
      console.log(`✅ Dish accessible at: /what-to-serve-with-${dish.slug}`)
    }
  })
})