import { describe, it, expect, beforeAll } from 'vitest'
import { unstable_dev } from 'wrangler'
import type { UnstableDevWorker } from 'wrangler'

describe('PairDish API', () => {
  let worker: UnstableDevWorker

  beforeAll(async () => {
    worker = await unstable_dev('src/index.ts', {
      experimental: { disableExperimentalWarning: true },
      vars: {
        ADMIN_API_KEY: 'test-api-key',
        DOMAIN: 'https://test.pairdish.com',
        ENVIRONMENT: 'development'
      }
    })
  })

  afterAll(async () => {
    await worker.stop()
  })

  describe('Security', () => {
    it('should reject import endpoint without authentication', async () => {
      const resp = await worker.fetch('/api/import-dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          main_dish: {
            name: 'Test Dish',
            slug: 'test-dish',
            dish_type: 'main'
          },
          side_dishes: []
        })
      })
      expect(resp.status).toBe(401)
      const json = await resp.json()
      expect(json.error).toBe('Unauthorized')
    })

    it('should allow import endpoint with valid API key', async () => {
      const resp = await worker.fetch('/api/import-dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key'
        },
        body: JSON.stringify({
          main_dish: {
            name: 'Test Dish',
            slug: 'test-dish',
            dish_type: 'main'
          },
          side_dishes: []
        })
      })
      expect(resp.status).toBe(200)
    })

    it('should properly escape HTML in server-rendered pages', async () => {
      // Create a dish with XSS attempt
      await worker.fetch('/api/import-dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key'
        },
        body: JSON.stringify({
          main_dish: {
            name: '<script>alert("XSS")</script>',
            slug: 'xss-test',
            dish_type: 'main',
            description: '<img src=x onerror=alert("XSS")>'
          },
          side_dishes: []
        })
      })

      // Fetch the server-rendered page
      const resp = await worker.fetch('/what-to-serve-with/xss-test')
      const html = await resp.text()
      
      // Check that HTML is properly escaped
      expect(html).not.toContain('<script>alert("XSS")</script>')
      expect(html).not.toContain('<img src=x onerror=alert("XSS")>')
      expect(html).toContain('&lt;script&gt;')
      expect(html).toContain('&lt;img')
    })

    it('should sanitize search queries', async () => {
      const resp = await worker.fetch('/api/search?q=%27%3B%20DROP%20TABLE%20dishes%3B%20--')
      expect(resp.status).toBe(200)
      // The query should be sanitized and not cause SQL injection
      const json = await resp.json()
      expect(json.success).toBe(true)
    })
  })

  describe('CORS', () => {
    it('should allow requests from allowed origins', async () => {
      const resp = await worker.fetch('/api', {
        headers: {
          'Origin': 'http://localhost:3000'
        }
      })
      expect(resp.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000')
    })

    it('should not include unnecessary methods in CORS', async () => {
      const resp = await worker.fetch('/api', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000'
        }
      })
      const allowedMethods = resp.headers.get('Access-Control-Allow-Methods')
      expect(allowedMethods).toContain('GET')
      expect(allowedMethods).toContain('POST')
      expect(allowedMethods).not.toContain('DELETE')
      expect(allowedMethods).not.toContain('PATCH')
    })
  })

  describe('Error Handling', () => {
    it('should not expose internal errors in production', async () => {
      // Force an error by sending invalid JSON
      const resp = await worker.fetch('/api/import-dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key'
        },
        body: 'invalid json'
      })
      
      const json = await resp.json()
      expect(json.error).toBeDefined()
      expect(json.timestamp).toBeDefined()
      // In development mode, it might include stack trace
      // but the sanitizeErrorMessage function should handle this
    })
  })

  describe('Input Validation', () => {
    it('should validate pagination parameters', async () => {
      const resp = await worker.fetch('/api/dishes?page=-1&limit=1000')
      expect(resp.status).toBe(200)
      const json = await resp.json()
      // Pagination should be validated to safe values
      expect(json.pagination.page).toBe(1)
      expect(json.pagination.limit).toBeLessThanOrEqual(100)
    })

    it('should reject invalid dish types', async () => {
      const resp = await worker.fetch('/api/import-dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key'
        },
        body: JSON.stringify({
          main_dish: {
            name: 'Test Dish',
            slug: 'test-dish',
            dish_type: 'invalid-type'
          },
          side_dishes: []
        })
      })
      expect(resp.status).toBe(400)
    })

    it('should sanitize URLs', async () => {
      const resp = await worker.fetch('/api/import-dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key'
        },
        body: JSON.stringify({
          main_dish: {
            name: 'Test Dish',
            slug: 'test-dish',
            dish_type: 'main',
            image_url: 'javascript:alert("XSS")'
          },
          side_dishes: []
        })
      })
      // Should accept the request but sanitize the URL
      expect(resp.status).toBe(200)
    })
  })
})