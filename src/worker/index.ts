import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

// Import types
import type { Bindings } from './types/bindings'
import type { 
  RawDish, 
  TransformedDish, 
  Recipe, 
  ApiResponse,
  PaginatedResponse,
  DishType,
  RecipeDifficulty
} from './types'

// Import utilities
import { 
  sanitizeInput, 
  sanitizeSlug,
  escapeHtml, 
  sanitizeForHtml,
  sanitizeUrl,
  sanitizeStringArray,
  validatePagination,
  sanitizeErrorMessage
} from './utils/security'
import { CacheService } from './utils/cache'
import { executeBatch, safeQuery, createIndexes } from './utils/database'
import { parseCSV } from './utils/csv-parser'
import { generateRecipe } from './utils/recipe-generator'

// Import middleware
import { getCorsConfig } from './middleware/cors'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { apiKeyMiddleware, requireAdmin } from './middleware/auth'

const app = new Hono<{ Bindings: Bindings }>()

// Apply CORS middleware
const isDevelopment = () => false // Will be determined per request
app.use('/*', getCorsConfig(isDevelopment()))

// Apply global error handling middleware
app.use('*', errorHandler)

// Initialize database indexes on first request
let indexesInitialized = false
app.use('*', async (c, next) => {
  if (!indexesInitialized && c.env.DB) {
    indexesInitialized = true
    await createIndexes(c.env.DB).catch(console.error)
  }
  await next()
})

// Cache service helper
function getCacheService(c: any): CacheService {
  return new CacheService(c.env.CACHE)
}

// Safe JSON parsing with fallback values
function safeJsonParse(jsonString: string | null | undefined, fallback: any = null): any {
  if (!jsonString) return fallback
  try {
    return JSON.parse(jsonString) ?? fallback
  } catch (error) {
    console.error('JSON parsing error:', error)
    return fallback
  }
}

// Data transformation function for frontend compatibility
function transformDish(dish: RawDish): TransformedDish {
  if (!dish) return dish as any
  
  // Remove "what-to-serve-with-" prefix from slug if it exists
  let cleanSlug = dish.slug
  if (cleanSlug && cleanSlug.startsWith('what-to-serve-with-')) {
    cleanSlug = cleanSlug.replace('what-to-serve-with-', '')
  }
  
  return {
    ...dish,
    slug: cleanSlug,
    imageUrl: dish.image_url,
    category: dish.dish_type,
    dietaryTags: safeJsonParse(dish.dietary_tags, []),
    keywords: safeJsonParse(dish.keywords, [])
  }
}

// API info route
app.get('/api', (c) => {
  const response: ApiResponse<any> = {
    success: true,
    data: {
      name: 'PairDish API',
      version: '2.0.0',
      endpoints: {
        'GET /api': 'API information',
        'GET /api/dishes': 'List all dishes',
        'GET /api/dishes/:id': 'Get dish by ID',
        'GET /api/dishes/:id/pairings': 'Get pairings for a dish',
        'GET /api/recipes/featured': 'Get featured recipes',
        'GET /api/search': 'Search dishes'
      }
    }
  }
  return c.json(response)
})

// Get all dishes
app.get('/api/dishes', async (c) => {
  const { DB } = c.env
  const cache = getCacheService(c)
  
  try {
    const { limit, offset } = validatePagination(c.req.query())
    const cacheKey = `dishes_${limit}_${offset}`
    
    // Try cache first
    const cached = await cache.get(cacheKey)
    if (cached) {
      return c.json(cached)
    }
    
    // Query database
    const { results: dishes } = await safeQuery(
      DB.prepare(`
        SELECT * FROM dishes 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `).bind(limit, offset)
    )
    
    // Transform data for frontend compatibility
    const transformedDishes = dishes.map(transformDish)
    
    const response = {
      success: true,
      dishes: transformedDishes
    }
    
    // Cache the response
    await cache.set(cacheKey, response, 300) // 5 minutes
    
    return c.json(response)
  } catch (error) {
    console.error('Error fetching dishes:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch dishes'
    }, 500)
  }
})

// Get dish by ID
app.get('/api/dishes/:id', async (c) => {
  const { DB } = c.env
  const dishId = c.req.param('id')
  
  try {
    const { results } = await safeQuery(
      DB.prepare('SELECT * FROM dishes WHERE id = ?').bind(dishId)
    )
    
    if (!results || results.length === 0) {
      return c.json({
        success: false,
        error: 'Dish not found'
      }, 404)
    }
    
    const dish = transformDish(results[0])
    
    return c.json({
      success: true,
      dish
    })
  } catch (error) {
    console.error('Error fetching dish:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch dish'
    }, 500)
  }
})

// Get dish pairings
app.get('/api/dishes/:id/pairings', async (c) => {
  const { DB } = c.env
  const cache = getCacheService(c)
  const dishId = c.req.param('id')
  
  try {
    const cacheKey = `pairings_${dishId}`
    
    // Try cache first
    const cached = await cache.get(cacheKey)
    if (cached) {
      return c.json(cached)
    }
    
    // Get the main dish
    const { results: mainDishResults } = await safeQuery(
      DB.prepare('SELECT * FROM dishes WHERE id = ?').bind(dishId)
    )
    
    if (!mainDishResults || mainDishResults.length === 0) {
      return c.json({
        success: false,
        error: 'Dish not found'
      }, 404)
    }
    
    const mainDish = transformDish(mainDishResults[0])
    
    // Get pairings
    const { results: pairings } = await safeQuery(
      DB.prepare(`
        SELECT 
          d.*,
          p.match_score,
          p.pairing_reason
        FROM pairings p
        JOIN dishes d ON p.side_dish_id = d.id
        WHERE p.main_dish_id = ?
        ORDER BY p.order_position ASC, p.match_score DESC
      `).bind(dishId)
    )
    
    // Transform pairings
    const transformedPairings = pairings.map((pairing: any) => ({
      ...transformDish(pairing),
      matchScore: pairing.match_score,
      pairingReason: pairing.pairing_reason
    }))
    
    const response = {
      success: true,
      dish: mainDish,
      pairings: transformedPairings
    }
    
    // Cache the response
    await cache.set(cacheKey, response, 300) // 5 minutes
    
    return c.json(response)
  } catch (error) {
    console.error('Error fetching pairings:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch pairings'
    }, 500)
  }
})

// Get featured recipes
app.get('/api/recipes/featured', async (c) => {
  const { DB } = c.env
  const cache = getCacheService(c)
  
  try {
    const cacheKey = 'featured_recipes'
    
    // Try cache first
    const cached = await cache.get(cacheKey)
    if (cached) {
      return c.json(cached)
    }
    
    // Get 3 random dishes as featured recipes
    const { results: dishes } = await safeQuery(
      DB.prepare(`
        SELECT * FROM dishes 
        WHERE dish_type IN ('main', 'side')
        ORDER BY RANDOM()
        LIMIT 3
      `)
    )
    
    // Transform dishes into recipe format
    const recipes = dishes.map((dish: RawDish) => ({
      id: dish.id,
      title: `Featured: ${dish.name} Recipe`,
      slug: dish.slug,
      description: dish.description || `Delicious ${dish.name} recipe`,
      image_url: dish.image_url,
      cuisine: dish.cuisine,
      difficulty: 'easy' as RecipeDifficulty,
      prep_time: 20,
      cook_time: 45,
      servings: 4
    }))
    
    // Cache the response
    await cache.set(cacheKey, recipes, 1800) // 30 minutes
    
    return c.json(recipes)
  } catch (error) {
    console.error('Error fetching featured recipes:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch featured recipes'
    }, 500)
  }
})

// Search dishes
app.get('/api/search', async (c) => {
  const { DB } = c.env
  const query = c.req.query('q')
  
  if (!query || query.length < 2) {
    return c.json({
      success: false,
      error: 'Search query must be at least 2 characters'
    }, 400)
  }
  
  const sanitizedQuery = sanitizeInput(query)
  
  try {
    const { results } = await safeQuery(
      DB.prepare(`
        SELECT DISTINCT d.* 
        FROM dishes d
        LEFT JOIN dishes_fts fts ON d.id = fts.rowid
        WHERE 
          fts.name MATCH ? OR
          fts.description MATCH ? OR
          d.cuisine LIKE ? OR
          d.dish_type LIKE ?
        LIMIT 20
      `).bind(
        sanitizedQuery,
        sanitizedQuery,
        `%${sanitizedQuery}%`,
        `%${sanitizedQuery}%`
      )
    )
    
    const transformedResults = results.map(transformDish)
    
    return c.json({
      success: true,
      results: transformedResults,
      query: sanitizedQuery
    })
  } catch (error) {
    console.error('Search error:', error)
    return c.json({
      success: false,
      error: 'Search failed'
    }, 500)
  }
})

// Old URL pattern support for backward compatibility
app.get('/what-to-serve-with-:slug', async (c) => {
  const slug = c.req.param('slug')
  
  // Get dish by slug
  const { DB } = c.env
  const { results } = await safeQuery(
    DB.prepare('SELECT id FROM dishes WHERE slug = ?').bind(slug)
  )
  
  if (results && results.length > 0) {
    // Redirect to new pattern
    return c.redirect(`/dish/${results[0].id}`)
  }
  
  return c.notFound()
})

// Apply 404 handler
app.notFound(notFoundHandler)

export default app