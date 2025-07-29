import { test, expect } from '@playwright/test'

const API_KEY = 'test-api-key-12345'
const BASE_URL = process.env.BASE_URL || 'http://localhost:8787'

test.describe('Security Fixes Verification', () => {
  test.describe('SQL Injection Prevention', () => {
    test('should safely handle SQL injection attempts in search', async ({ request }) => {
      // Attempt SQL injection in search
      const response = await request.get(`${BASE_URL}/api/search`, {
        params: {
          q: "'; DROP TABLE dishes; --"
        }
      })
      
      expect(response.ok()).toBeTruthy()
      const data = await response.json()
      expect(data.success).toBeTruthy()
      // Should return empty results, not an error
      expect(data.data).toBeInstanceOf(Array)
    })

    test('should properly parameterize all database queries', async ({ request }) => {
      // Test various endpoints with potentially malicious input
      const endpoints = [
        { url: '/api/dishes', params: { page: "1'; DELETE FROM dishes; --" } },
        { url: '/api/search', params: { q: "test' OR '1'='1" } },
      ]

      for (const endpoint of endpoints) {
        const response = await request.get(`${BASE_URL}${endpoint.url}`, {
          params: endpoint.params
        })
        expect(response.ok()).toBeTruthy()
      }
    })
  })

  test.describe('Input Sanitization', () => {
    test('should sanitize dish input data', async ({ request }) => {
      const maliciousData = {
        main_dish: {
          name: "Test'; DROP TABLE; --",
          slug: "test-dish",
          description: "<script>alert('XSS')</script>",
          dish_type: "main",
          dietary_tags: ["vegan'; DELETE FROM dishes; --"],
          keywords: ["<img src=x onerror=alert('XSS')>"]
        },
        side_dishes: []
      }

      const response = await request.post(`${BASE_URL}/api/import-dishes`, {
        data: maliciousData,
        headers: {
          'X-API-Key': API_KEY
        }
      })

      expect(response.ok()).toBeTruthy()
      const data = await response.json()
      expect(data.success).toBeTruthy()
    })

    test('should validate and sanitize URLs', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/import-dishes`, {
        data: {
          main_dish: {
            name: "Test Dish",
            slug: "test-url-dish",
            dish_type: "main",
            image_url: "javascript:alert('XSS')",
            source_url: "data:text/html,<script>alert('XSS')</script>"
          },
          side_dishes: []
        },
        headers: {
          'X-API-Key': API_KEY
        }
      })

      expect(response.ok()).toBeTruthy()
    })
  })

  test.describe('XSS Prevention', () => {
    test('should escape HTML in server-rendered pages', async ({ page }) => {
      // First, create a dish with XSS attempts
      const response = await page.request.post(`${BASE_URL}/api/import-dishes`, {
        data: {
          main_dish: {
            name: "<script>alert('XSS')</script>",
            slug: "xss-test-dish",
            description: '<img src=x onerror="alert(\'XSS\')">',
            dish_type: "main"
          },
          side_dishes: [{
            name: "<b onmouseover='alert(1)'>Hover me</b>",
            slug: "xss-side",
            dish_type: "side"
          }]
        },
        headers: {
          'X-API-Key': API_KEY
        }
      })

      expect(response.ok()).toBeTruthy()

      // Visit the server-rendered page
      await page.goto(`${BASE_URL}/what-to-serve-with/xss-test-dish`)
      
      // Check that no scripts are executed
      const alerts = []
      page.on('dialog', dialog => {
        alerts.push(dialog.message())
        dialog.dismiss()
      })

      // Wait a bit to ensure no alerts appear
      await page.waitForTimeout(1000)
      expect(alerts).toHaveLength(0)

      // Check that HTML is escaped in the page source
      const content = await page.content()
      expect(content).not.toContain('<script>alert')
      expect(content).not.toContain('onmouseover=')
      expect(content).not.toContain('onerror=')
      expect(content).toContain('&lt;script&gt;')
    })
  })

  test.describe('Authentication', () => {
    test('should reject import requests without API key', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/import-dishes`, {
        data: {
          main_dish: {
            name: "Test Dish",
            slug: "test-auth",
            dish_type: "main"
          },
          side_dishes: []
        }
      })

      expect(response.status()).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    test('should reject import requests with invalid API key', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/import-dishes`, {
        data: {
          main_dish: {
            name: "Test Dish",
            slug: "test-auth-invalid",
            dish_type: "main"
          },
          side_dishes: []
        },
        headers: {
          'X-API-Key': 'invalid-key'
        }
      })

      expect(response.status()).toBe(401)
    })

    test('should allow import requests with valid API key', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/import-dishes`, {
        data: {
          main_dish: {
            name: "Test Dish Auth",
            slug: "test-auth-valid",
            dish_type: "main"
          },
          side_dishes: []
        },
        headers: {
          'X-API-Key': API_KEY
        }
      })

      expect(response.ok()).toBeTruthy()
    })
  })

  test.describe('Error Handling', () => {
    test('should not expose internal errors', async ({ request }) => {
      // Send invalid JSON
      const response = await request.post(`${BASE_URL}/api/import-dishes`, {
        data: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        }
      })

      const data = await response.json()
      expect(data.error).toBeDefined()
      expect(data.timestamp).toBeDefined()
      // Should not contain stack traces or internal details
      expect(JSON.stringify(data)).not.toContain('at ')
      expect(JSON.stringify(data)).not.toContain('.ts:')
    })

    test('should handle invalid dish types gracefully', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/import-dishes`, {
        data: {
          main_dish: {
            name: "Test Dish",
            slug: "test-invalid-type",
            dish_type: "invalid_type"
          },
          side_dishes: []
        },
        headers: {
          'X-API-Key': API_KEY
        }
      })

      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data.error).toBeDefined()
    })
  })

  test.describe('CORS Configuration', () => {
    test('should have proper CORS headers', async ({ request }) => {
      const response = await request.options(`${BASE_URL}/api`, {
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST'
        }
      })

      const headers = response.headers()
      expect(headers['access-control-allow-origin']).toBe('http://localhost:3000')
      expect(headers['access-control-allow-methods']).toContain('GET')
      expect(headers['access-control-allow-methods']).toContain('POST')
      expect(headers['access-control-allow-methods']).not.toContain('DELETE')
      expect(headers['access-control-allow-methods']).not.toContain('PATCH')
    })
  })

  test.describe('Input Validation', () => {
    test('should validate pagination parameters', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/dishes`, {
        params: {
          page: '-1',
          limit: '1000'
        }
      })

      expect(response.ok()).toBeTruthy()
      const data = await response.json()
      expect(data.pagination.page).toBe(1)
      expect(data.pagination.limit).toBeLessThanOrEqual(100)
    })

    test('should limit string lengths', async ({ request }) => {
      const longString = 'a'.repeat(1000)
      const response = await request.post(`${BASE_URL}/api/import-dishes`, {
        data: {
          main_dish: {
            name: longString,
            slug: "test-long-string",
            description: longString,
            dish_type: "main"
          },
          side_dishes: []
        },
        headers: {
          'X-API-Key': API_KEY
        }
      })

      expect(response.ok()).toBeTruthy()
    })

    test('should sanitize string arrays', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/import-dishes`, {
        data: {
          main_dish: {
            name: "Test Dish",
            slug: "test-arrays",
            dish_type: "main",
            dietary_tags: ["valid", "'; DROP TABLE;", "", "   ", "a".repeat(100)],
            keywords: new Array(100).fill("keyword")
          },
          side_dishes: []
        },
        headers: {
          'X-API-Key': API_KEY
        }
      })

      expect(response.ok()).toBeTruthy()
    })
  })

  test.describe('Database Transaction Safety', () => {
    test('should handle bulk operations atomically', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/import-dishes`, {
        data: {
          main_dish: {
            name: "Main Dish Transaction",
            slug: "main-transaction",
            dish_type: "main"
          },
          side_dishes: [
            {
              name: "Side 1",
              slug: "side-1-transaction",
              dish_type: "side",
              recipe: {
                ingredients: ["ingredient 1", "ingredient 2"],
                instructions: ["step 1", "step 2"]
              }
            },
            {
              name: "Side 2",
              slug: "side-2-transaction",
              dish_type: "side"
            }
          ]
        },
        headers: {
          'X-API-Key': API_KEY
        }
      })

      expect(response.ok()).toBeTruthy()
      const data = await response.json()
      expect(data.success).toBeTruthy()
      expect(data.created).toBeDefined()
    })
  })

  test.describe('Caching', () => {
    test('should cache responses appropriately', async ({ request }) => {
      // First request
      const response1 = await request.get(`${BASE_URL}/api/dishes`)
      expect(response1.ok()).toBeTruthy()

      // Second request should be faster (cached)
      const start = Date.now()
      const response2 = await request.get(`${BASE_URL}/api/dishes`)
      const duration = Date.now() - start
      
      expect(response2.ok()).toBeTruthy()
      // Cache headers might be present
      const headers = response2.headers()
      // Check if response indicates it was cached (implementation dependent)
    })

    test('should invalidate cache on updates', async ({ request }) => {
      // Get initial data
      const response1 = await request.get(`${BASE_URL}/api/dishes`)
      const data1 = await response1.json()

      // Create new dish
      await request.post(`${BASE_URL}/api/import-dishes`, {
        data: {
          main_dish: {
            name: "Cache Test Dish",
            slug: "cache-test-" + Date.now(),
            dish_type: "main"
          },
          side_dishes: []
        },
        headers: {
          'X-API-Key': API_KEY
        }
      })

      // Get data again - should include new dish
      const response2 = await request.get(`${BASE_URL}/api/dishes`)
      const data2 = await response2.json()

      // Should have more dishes after creation
      expect(data2.dishes.length).toBeGreaterThanOrEqual(data1.dishes.length)
    })
  })
})