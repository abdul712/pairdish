import { GET } from '../route'
import pairDishAPI from '@/lib/api'

// Mock the API
jest.mock('@/lib/api', () => ({
  getAllDishes: jest.fn(),
  getAllRecipes: jest.fn(),
}))

const mockDishes = [
  {
    id: 1,
    name: 'Test Dish',
    slug: 'test-dish',
    category: 'main',
  },
  {
    id: 2,
    name: 'Special Dish with & symbols',
    slug: 'special-dish-with-&-symbols',
    category: 'appetizer',
  },
  {
    id: 3,
    name: 'XSS Attempt',
    slug: 'xss<script>alert("hack")</script>',
    category: 'dessert',
  }
]

const mockRecipes = [
  {
    id: 1,
    title: 'Test Recipe',
    slug: 'test-recipe',
  },
  {
    id: 2,
    title: 'Recipe with & symbols',
    slug: 'recipe-with-&-symbols',
  },
  {
    id: 3,
    title: 'XSS Recipe',
    slug: 'xss<script>alert("hack")</script>',
  }
]

describe('/sitemap.xml API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(pairDishAPI.getAllDishes as jest.Mock).mockResolvedValue(mockDishes)
    ;(pairDishAPI.getAllRecipes as jest.Mock).mockResolvedValue(mockRecipes)
  })

  it('generates valid XML sitemap', async () => {
    const response = await GET()
    const sitemapText = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/xml')
    expect(sitemapText).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(sitemapText).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
  })

  it('includes static pages in sitemap', async () => {
    const response = await GET()
    const sitemapText = await response.text()

    expect(sitemapText).toContain('<loc>http://localhost:3000</loc>')
    expect(sitemapText).toContain('<loc>http://localhost:3000/search</loc>')
    expect(sitemapText).toContain('<loc>http://localhost:3000/categories</loc>')
    expect(sitemapText).toContain('<loc>http://localhost:3000/recipes</loc>')
  })

  it('includes dish pages in sitemap', async () => {
    const response = await GET()
    const sitemapText = await response.text()

    expect(sitemapText).toContain('<loc>http://localhost:3000/dishes/test-dish</loc>')
    expect(sitemapText).toContain('<loc>http://localhost:3000/dishes/test-dish/pairings</loc>')
  })

  it('includes recipe pages in sitemap', async () => {
    const response = await GET()
    const sitemapText = await response.text()

    expect(sitemapText).toContain('<loc>http://localhost:3000/recipe/test-recipe</loc>')
  })

  it('properly escapes XML characters in URLs - SECURITY TEST', async () => {
    const response = await GET()
    const sitemapText = await response.text()

    // Test that ampersands are properly escaped
    expect(sitemapText).toContain('special-dish-with-&amp;-symbols')
    expect(sitemapText).toContain('recipe-with-&amp;-symbols')
    
    // Test that < and > are properly escaped (XSS prevention)
    expect(sitemapText).toContain('xss&lt;script&gt;alert(&quot;hack&quot;)&lt;/script&gt;')
    expect(sitemapText).not.toContain('<script>')
    expect(sitemapText).not.toContain('alert("hack")')
  })

  it('sets correct cache headers', async () => {
    const response = await GET()

    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=3600')
  })

  it('handles API errors gracefully', async () => {
    ;(pairDishAPI.getAllDishes as jest.Mock).mockRejectedValue(new Error('API Error'))

    const response = await GET()

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Error generating sitemap')
  })

  it('includes proper sitemap metadata', async () => {
    const response = await GET()
    const sitemapText = await response.text()

    // Check for required sitemap elements
    expect(sitemapText).toContain('<lastmod>')
    expect(sitemapText).toContain('<changefreq>')
    expect(sitemapText).toContain('<priority>')
    
    // Check priority values are set correctly
    expect(sitemapText).toContain('<priority>1.0</priority>') // Homepage
    expect(sitemapText).toContain('<priority>0.9</priority>') // Dishes and recipes
    expect(sitemapText).toContain('<priority>0.8</priority>') // Search and categories
  })
})