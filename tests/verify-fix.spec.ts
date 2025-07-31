import { test, expect } from '@playwright/test'

const BASE_URL = 'https://pairdish.mabdulrahim.workers.dev'

test.describe('Verify 404 Fix - Final Verification', () => {
  test('original problematic URL now works', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/what-to-serve-with/a-cheese-souffle`)
    expect(response.ok()).toBeTruthy()
    
    const text = await response.text()
    expect(text).toContain('What to Serve with Cheese Souffle')
    expect(text).toContain('Perfect Pairings')
    expect(text).toContain('Charcuterie Board')
    
    console.log('✅ Original problematic URL now works!')
  })

  test('canonical URL works', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/what-to-serve-with/cheese-souffle`)
    expect(response.ok()).toBeTruthy()
    
    const text = await response.text()
    expect(text).toContain('What to Serve with Cheese Souffle')
    expect(text).toContain('Perfect Pairings')
    
    console.log('✅ Canonical URL works!')
  })

  test('API endpoints now work correctly', async ({ request }) => {
    // Test main dishes API
    const dishesResponse = await request.get(`${BASE_URL}/api/dishes`)
    expect(dishesResponse.ok()).toBeTruthy()
    
    const dishesData = await dishesResponse.json()
    expect(dishesData.success).toBe(true)
    expect(dishesData.dishes).toHaveLength(10)
    
    console.log('✅ API dishes endpoint works!')
    
    // Test individual dish API
    const dishResponse = await request.get(`${BASE_URL}/api/dishes/cheese-souffle`)
    expect(dishResponse.ok()).toBeTruthy()
    
    const dishData = await dishResponse.json()
    expect(dishData.success).toBe(true)
    expect(dishData.data.name).toBe('Cheese Souffle')
    
    console.log('✅ Individual dish API works!')
  })

  test('multiple dish pages work', async ({ request }) => {
    const testSlugs = [
      'cheese-souffle',
      '15-bean-soup', 
      'baked-potato',
      'charcuterie-board',
      'breakfast-casserole'
    ]
    
    for (const slug of testSlugs) {
      const response = await request.get(`${BASE_URL}/what-to-serve-with/${slug}`)
      expect(response.ok(), `${slug} should return 200`).toBeTruthy()
      
      const text = await response.text()
      expect(text, `${slug} should contain page content`).toContain('What to Serve with')
      expect(text, `${slug} should contain pairings`).toContain('Perfect Pairings')
    }
    
    console.log('✅ All major dish pages work!')
  })

  test('slug variations and redirects work', async ({ request }) => {
    // Test "a-" prefix redirects
    const response = await request.get(`${BASE_URL}/what-to-serve-with/a-baked-potato`, {
      redirect: 'manual'
    })
    
    // Should redirect to canonical URL
    expect([200, 301, 302]).toContain(response.status())
    
    if (response.status() === 301 || response.status() === 302) {
      const location = response.headers()['location']
      expect(location).toContain('/what-to-serve-with/baked-potato')
      console.log('✅ Redirects work correctly!')
    } else {
      // If it's 200, it means the route handled it directly
      const text = await response.text()
      expect(text).toContain('What to Serve with')
      console.log('✅ Direct route handling works!')
    }
  })

  test('database contains expected data', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/debug/dishes`)
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.total).toBe(10)
    
    const cheeseSouffle = data.dishes.find(d => d.slug === 'cheese-souffle')
    expect(cheeseSouffle).toBeTruthy()
    expect(cheeseSouffle.name).toBe('Cheese Souffle')
    
    console.log('✅ Database contains all expected dishes!')
  })

  test('pairings work correctly', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/pairings/cheese-souffle`)
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.pairings.length).toBeGreaterThan(0)
    
    // Should have at least one pairing
    const firstPairing = data.pairings[0]
    expect(firstPairing.name).toBeDefined()
    expect(firstPairing.slug).toBeDefined()
    
    console.log(`✅ Pairings work! Found ${data.pairings.length} pairings for cheese souffle`)
  })
})