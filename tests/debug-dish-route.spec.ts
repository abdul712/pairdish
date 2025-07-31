import { test, expect } from '@playwright/test'

const BASE_URL = 'https://pairdish.mabdulrahim.workers.dev'

test.describe('Debug Dish Route Issue', () => {
  test('debug endpoint works', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/debug/dishes`)
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    console.log('Debug endpoint response:', JSON.stringify(data, null, 2))
    
    expect(data.success).toBe(true)
    expect(data.dishes).toHaveLength(10)
    
    const cheeseSouffle = data.dishes.find(d => d.slug === 'cheese-souffle')
    expect(cheeseSouffle).toBeTruthy()
    console.log('Found cheese souffle:', cheeseSouffle)
  })

  test('test dish route directly', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/what-to-serve-with/cheese-souffle`, {
      failOnStatusCode: false
    })
    
    console.log('Status:', response.status())
    console.log('Headers:', await response.allHeaders())
    
    if (response.status() === 200) {
      const text = await response.text()
      console.log('Response length:', text.length)
      console.log('First 500 chars:', text.substring(0, 500))
    } else {
      const text = await response.text()
      console.log('Error response:', text)
    }
  })

  test('test various slug formats', async ({ request }) => {
    const slugs = [
      'cheese-souffle',
      'a-cheese-souffle', 
      'what-to-serve-with-cheese-souffle',
      'baked-potato',
      '15-bean-soup'
    ]
    
    for (const slug of slugs) {
      const response = await request.get(`${BASE_URL}/what-to-serve-with/${slug}`, {
        failOnStatusCode: false
      })
      console.log(`${slug}: ${response.status()}`)
      
      if (response.status() === 301 || response.status() === 302) {
        console.log(`  Redirect to: ${response.headers()['location']}`)
      }
    }
  })

  test('test API endpoints', async ({ request }) => {
    // Test dishes endpoint
    const dishesResponse = await request.get(`${BASE_URL}/api/dishes`)
    console.log('API dishes status:', dishesResponse.status())
    
    if (dishesResponse.ok()) {
      const dishesData = await dishesResponse.json()
      console.log('API dishes count:', dishesData.dishes?.length || 0)
    }
    
    // Test specific dish endpoint
    const dishResponse = await request.get(`${BASE_URL}/api/dishes/cheese-souffle`)
    console.log('API dish status:', dishResponse.status())
    
    if (dishResponse.ok()) {
      const dishData = await dishResponse.json()
      console.log('API dish data:', dishData.name || 'No name')
    }
  })
})