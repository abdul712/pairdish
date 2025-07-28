import { describe, it, expect, beforeEach, vi } from 'vitest'
import app from './index'

// Mock the environment bindings
const mockEnv = {
  DB: {
    prepare: vi.fn(),
    batch: vi.fn()
  },
  CACHE: {
    get: vi.fn(),
    put: vi.fn()
  },
  DOMAIN: 'test.pairdish.com'
}

// Mock D1 database responses
const mockDbFirst = vi.fn()
const mockDbAll = vi.fn()
const mockDbRun = vi.fn()
const mockDbBind = vi.fn().mockReturnValue({
  first: mockDbFirst,
  all: mockDbAll,
  run: mockDbRun,
  bind: mockDbBind
})

beforeEach(() => {
  vi.clearAllMocks()
  mockEnv.DB.prepare.mockReturnValue({
    bind: mockDbBind
  })
})

describe('API Routes', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const req = new Request('http://localhost/')
      const res = await app.request(req, mockEnv)
      
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.name).toBe('PairDish API')
      expect(json.version).toBe('1.0.0')
      expect(json.endpoints).toBeDefined()
    })
  })

  describe('Route Precedence Bug Fix', () => {
    it('should route /dishes/popular correctly (not as slug)', async () => {
      // Mock popular dishes data
      mockDbAll.mockResolvedValue({
        results: [
          {
            id: 1,
            name: 'Popular Dish',
            slug: 'popular-dish',
            dish_type: 'main',
            dietary_tags: '[]',
            keywords: '[]'
          }
        ]
      })

      const req = new Request('http://localhost/dishes/popular')
      const res = await app.request(req, mockEnv)
      
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(Array.isArray(json)).toBe(true)
      
      // Verify it's not trying to treat 'popular' as a slug
      expect(mockEnv.DB.prepare).toHaveBeenCalledWith(
        expect.stringContaining('popular_dishes')
      )
    })

    it('should route /dishes/:slug correctly for actual slugs', async () => {
      // Mock dish data
      mockDbFirst.mockResolvedValue({
        id: 1,
        name: 'Test Dish',
        slug: 'test-dish',
        dish_type: 'main',
        dietary_tags: '[]',
        keywords: '[]'
      })

      const req = new Request('http://localhost/dishes/test-dish')
      const res = await app.request(req, mockEnv)
      
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.name).toBe('Test Dish')
      expect(json.slug).toBe('test-dish')
    })
  })

  describe('Safe JSON Parsing', () => {
    it('should handle malformed dietary_tags gracefully', async () => {
      // Mock dish with malformed JSON
      mockDbFirst.mockResolvedValue({
        id: 1,
        name: 'Test Dish',
        slug: 'test-dish',
        dish_type: 'main',
        dietary_tags: 'invalid json{',
        keywords: '[]'
      })

      const req = new Request('http://localhost/dishes/test-dish')
      const res = await app.request(req, mockEnv)
      
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.dietaryTags).toEqual([]) // Should fallback to empty array
    })

    it('should handle null dietary_tags gracefully', async () => {
      mockDbFirst.mockResolvedValue({
        id: 1,
        name: 'Test Dish',
        slug: 'test-dish',
        dish_type: 'main',
        dietary_tags: null,
        keywords: null
      })

      const req = new Request('http://localhost/dishes/test-dish')
      const res = await app.request(req, mockEnv)
      
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.dietaryTags).toEqual([])
      expect(json.keywords).toEqual([])
    })

    it('should handle malformed recipe JSON gracefully in pairings', async () => {
      // Mock main dish
      mockDbFirst.mockResolvedValueOnce({
        id: 1,
        name: 'Main Dish',
        slug: 'main-dish',
        dietary_tags: '[]',
        keywords: '[]'
      })

      // Mock pairings with malformed recipe JSON
      mockDbAll.mockResolvedValue({
        results: [
          {
            id: 2,
            name: 'Side Dish',
            slug: 'side-dish',
            dish_type: 'side',
            dietary_tags: '[]',
            match_score: 95,
            order_position: 1,
            ingredients: 'invalid json{',
            instructions: '["Step 1"]',
            prep_time: 10,
            cook_time: 20,
            servings: 4,
            difficulty: 'easy'
          }
        ]
      })

      // Mock popular dishes check
      mockDbFirst.mockResolvedValueOnce(null)

      const req = new Request('http://localhost/dishes/main-dish/pairings')
      const res = await app.request(req, mockEnv)
      
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.sideDishes[0].recipe.ingredients).toEqual([]) // Should fallback to empty array
      expect(json.sideDishes[0].recipe.instructions).toEqual(['Step 1']) // Valid JSON should parse
    })
  })

  describe('GET /dishes', () => {
    it('should return transformed dishes', async () => {
      mockDbAll.mockResolvedValue({
        results: [
          {
            id: 1,
            name: 'Test Dish',
            slug: 'test-dish',
            image_url: 'https://example.com/image.jpg',
            dish_type: 'main',
            dietary_tags: '["vegetarian"]',
            keywords: '["healthy"]'
          }
        ]
      })

      const req = new Request('http://localhost/dishes')
      const res = await app.request(req, mockEnv)
      
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json[0]).toEqual(
        expect.objectContaining({
          id: 1,
          name: 'Test Dish',
          slug: 'test-dish',
          imageUrl: 'https://example.com/image.jpg',
          category: 'main',
          dietaryTags: ['vegetarian'],
          keywords: ['healthy']
        })
      )
    })

    it('should filter by dish type', async () => {
      mockDbAll.mockResolvedValue({ results: [] })

      const req = new Request('http://localhost/dishes?type=main')
      await app.request(req, mockEnv)
      
      expect(mockEnv.DB.prepare).toHaveBeenCalledWith(
        expect.stringContaining('WHERE dish_type = ?')
      )
    })
  })

  describe('GET /dishes/:slug/pairings', () => {
    it('should use cache when available', async () => {
      const cachedData = {
        mainDish: { id: 1, name: 'Cached Dish' },
        sideDishes: []
      }
      
      mockEnv.CACHE.get.mockResolvedValue(cachedData)

      const req = new Request('http://localhost/dishes/test-dish/pairings')
      const res = await app.request(req, mockEnv)
      
      expect(res.status).toBe(200)
      expect(res.headers.get('X-Cache')).toBe('HIT')
      const json = await res.json()
      expect(json).toEqual(cachedData)
    })

    it('should update popular dishes view count', async () => {
      mockEnv.CACHE.get.mockResolvedValue(null)
      
      // Mock main dish
      mockDbFirst.mockResolvedValueOnce({
        id: 1,
        name: 'Main Dish',
        slug: 'main-dish',
        dietary_tags: '[]',
        keywords: '[]'
      })

      // Mock pairings
      mockDbAll.mockResolvedValue({ results: [] })

      // Mock existing popular dish
      mockDbFirst.mockResolvedValueOnce({ id: 1 })

      const req = new Request('http://localhost/dishes/main-dish/pairings')
      await app.request(req, mockEnv)
      
      // Should update view count
      expect(mockEnv.DB.prepare).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE popular_dishes SET')
      )
    })
  })

  describe('GET /search', () => {
    it('should require minimum query length', async () => {
      const req = new Request('http://localhost/search?q=a')
      const res = await app.request(req, mockEnv)
      
      expect(res.status).toBe(400)
      const json = await res.json()
      expect(json.error).toContain('at least 2 characters')
    })

    it('should return search results with pagination', async () => {
      mockDbAll.mockResolvedValue({
        results: [
          {
            id: 1,
            name: 'Chicken Teriyaki',
            slug: 'chicken-teriyaki',
            dish_type: 'main',
            dietary_tags: '[]',
            keywords: '[]'
          }
        ]
      })

      const req = new Request('http://localhost/search?q=chicken&page=2&limit=10')
      const res = await app.request(req, mockEnv)
      
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.dishes).toBeDefined()
      expect(json.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 1
      })
    })
  })

  describe('GET /categories', () => {
    it('should return unique dish categories', async () => {
      mockDbAll.mockResolvedValue({
        results: [
          { category: 'main' },
          { category: 'side' },
          { category: 'dessert' }
        ]
      })

      const req = new Request('http://localhost/categories')
      const res = await app.request(req, mockEnv)
      
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json).toEqual(['main', 'side', 'dessert'])
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      mockDbFirst.mockRejectedValue(new Error('Database error'))

      const req = new Request('http://localhost/dishes/nonexistent')
      const res = await app.request(req, mockEnv)
      
      expect(res.status).toBe(500)
      const json = await res.json()
      expect(json.error).toBe('Failed to fetch dish')
    })

    it('should return 404 for nonexistent dishes', async () => {
      mockDbFirst.mockResolvedValue(null)

      const req = new Request('http://localhost/dishes/nonexistent')
      const res = await app.request(req, mockEnv)
      
      expect(res.status).toBe(404)
      const json = await res.json()
      expect(json.error).toBe('Dish not found')
    })
  })

  describe('Import Endpoint Security', () => {
    it('should validate schema for import data', async () => {
      const invalidData = {
        invalid: 'data'
      }

      const req = new Request('http://localhost/api/import-dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })
      
      const res = await app.request(req, mockEnv)
      expect(res.status).toBe(400) // Schema validation should fail
    })

    it('should handle valid import data', async () => {
      const validData = {
        main_dish: {
          name: 'Test Main Dish',
          slug: 'test-main-dish',
          dish_type: 'main',
          dietary_tags: ['vegetarian'],
          keywords: ['healthy']
        },
        side_dishes: [
          {
            name: 'Test Side Dish',
            slug: 'test-side-dish',
            dish_type: 'side',
            dietary_tags: ['vegan']
          }
        ]
      }

      // Mock database responses for import
      mockDbFirst.mockResolvedValue(null) // No existing dish
      mockDbFirst.mockResolvedValueOnce({ id: 1 }) // Main dish created
      mockDbFirst.mockResolvedValueOnce(null) // No existing side dish
      mockDbFirst.mockResolvedValueOnce({ id: 2 }) // Side dish created
      mockDbFirst.mockResolvedValueOnce(null) // No existing pairing

      const req = new Request('http://localhost/api/import-dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData)
      })
      
      const res = await app.request(req, mockEnv)
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
    })
  })
})

describe('Utility Functions', () => {
  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      // We'd need to export the function to test it directly
      // For now, it's tested indirectly through the API endpoints
    })
  })

  describe('transformDish', () => {
    it('should transform dish data correctly', () => {
      // We'd need to export the function to test it directly
      // For now, it's tested indirectly through the API endpoints
    })
  })
})