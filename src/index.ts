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

// Schema validation for incoming dish data
const dishSchema = z.object({
  name: z.string().min(1).max(255).transform(val => sanitizeInput(val)),
  slug: z.string().min(1).max(255).transform(val => sanitizeInput(val)),
  description: z.string().optional().transform(val => sanitizeInput(val, 1000)),
  image_url: z.string().url().optional().transform(val => sanitizeUrl(val)),
  cuisine: z.string().optional().transform(val => sanitizeInput(val)),
  dish_type: z.enum(['main', 'side', 'dessert', 'appetizer', 'beverage']),
  dietary_tags: z.array(z.string()).optional().transform(val => sanitizeStringArray(val)),
  seo_title: z.string().optional().transform(val => sanitizeInput(val)),
  seo_description: z.string().optional().transform(val => sanitizeInput(val, 500)),
  keywords: z.array(z.string()).optional().transform(val => sanitizeStringArray(val))
})

const recipeSchema = z.object({
  ingredients: z.array(z.string()).transform(val => sanitizeStringArray(val, 100, 200)),
  instructions: z.array(z.string()).transform(val => sanitizeStringArray(val, 50, 1000)),
  prep_time: z.number().optional(),
  cook_time: z.number().optional(),
  servings: z.number().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  nutrition: z.record(z.any()).optional(),
  source_url: z.string().url().optional().transform(val => sanitizeUrl(val))
})

const pairingDataSchema = z.object({
  main_dish: dishSchema,
  side_dishes: z.array(dishSchema.extend({
    recipe: recipeSchema.optional()
  })),
  timestamp: z.string().optional()
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
      version: '1.1.0',
      endpoints: {
        'GET /api': 'API information',
        'POST /api/import-dishes': 'Import dish pairings (requires authentication)',
        'GET /api/dishes': 'List all dishes',
        'GET /api/dishes/:slug': 'Get dish by slug',
        'GET /api/pairings/:slug': 'Get pairings for a dish',
        'GET /api/search': 'Search dishes'
      }
    }
  }
  return c.json(response)
})

// Import dishes endpoint with authentication
app.post('/api/import-dishes',
  requireAdmin,
  zValidator('json', pairingDataSchema),
  async (c) => {
    const data = c.req.valid('json')
    const { DB } = c.env
    const cache = getCacheService(c)
    
    try {
      const operations = []
      
      // 1. Prepare main dish operation
      const mainDish = data.main_dish
      const mainDishOp = DB.prepare(`
        INSERT INTO dishes (name, slug, description, image_url, cuisine, dish_type, dietary_tags, seo_title, seo_description, keywords)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET
          name = excluded.name,
          description = excluded.description,
          image_url = excluded.image_url,
          cuisine = excluded.cuisine,
          dish_type = excluded.dish_type,
          dietary_tags = excluded.dietary_tags,
          seo_title = excluded.seo_title,
          seo_description = excluded.seo_description,
          keywords = excluded.keywords,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        mainDish.name,
        mainDish.slug,
        mainDish.description || '',
        mainDish.image_url || '',
        mainDish.cuisine || '',
        mainDish.dish_type,
        JSON.stringify(mainDish.dietary_tags || []),
        mainDish.seo_title || '',
        mainDish.seo_description || '',
        JSON.stringify(mainDish.keywords || [])
      )
      operations.push(mainDishOp)
      
      // 2. Prepare side dish operations
      for (const sideDish of data.side_dishes) {
        const sideDishOp = DB.prepare(`
          INSERT INTO dishes (name, slug, description, image_url, cuisine, dish_type, dietary_tags)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(slug) DO UPDATE SET
            name = excluded.name,
            description = excluded.description,
            image_url = excluded.image_url,
            cuisine = excluded.cuisine,
            dish_type = excluded.dish_type,
            dietary_tags = excluded.dietary_tags,
            updated_at = CURRENT_TIMESTAMP
        `).bind(
          sideDish.name,
          sideDish.slug,
          sideDish.description || '',
          sideDish.image_url || '',
          sideDish.cuisine || '',
          sideDish.dish_type || 'side',
          JSON.stringify(sideDish.dietary_tags || [])
        )
        operations.push(sideDishOp)
      }
      
      // Execute batch operations
      await executeBatch(DB, operations)
      
      // Get main dish ID
      const mainDishResult = await DB.prepare('SELECT id FROM dishes WHERE slug = ?')
        .bind(mainDish.slug)
        .first()
      
      if (!mainDishResult) {
        throw new Error('Failed to create main dish')
      }
      
      const mainDishId = mainDishResult.id as number
      
      // 3. Create pairings and recipes in a second batch
      const pairingOperations = []
      let position = 1
      
      for (const sideDish of data.side_dishes) {
        // Get side dish ID
        const sideDishResult = await DB.prepare('SELECT id FROM dishes WHERE slug = ?')
          .bind(sideDish.slug)
          .first()
        
        if (sideDishResult) {
          const sideDishId = sideDishResult.id as number
          
          // Create pairing
          const pairingOp = DB.prepare(`
            INSERT INTO pairings (main_dish_id, side_dish_id, match_score, order_position)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(main_dish_id, side_dish_id) DO UPDATE SET
              match_score = excluded.match_score,
              order_position = excluded.order_position
          `).bind(
            mainDishId,
            sideDishId,
            95 - (position * 2), // Simple scoring based on position
            position
          )
          pairingOperations.push(pairingOp)
          
          // Create recipe if provided
          if (sideDish.recipe) {
            const recipeOp = DB.prepare(`
              INSERT INTO recipes (dish_id, ingredients, instructions, prep_time, cook_time, servings, difficulty, nutrition, source_url)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(dish_id) DO UPDATE SET
                ingredients = excluded.ingredients,
                instructions = excluded.instructions,
                prep_time = excluded.prep_time,
                cook_time = excluded.cook_time,
                servings = excluded.servings,
                difficulty = excluded.difficulty,
                nutrition = excluded.nutrition,
                source_url = excluded.source_url
            `).bind(
              sideDishId,
              JSON.stringify(sideDish.recipe.ingredients),
              JSON.stringify(sideDish.recipe.instructions),
              sideDish.recipe.prep_time || 0,
              sideDish.recipe.cook_time || 0,
              sideDish.recipe.servings || 4,
              sideDish.recipe.difficulty || 'medium',
              JSON.stringify(sideDish.recipe.nutrition || {}),
              sideDish.recipe.source_url || ''
            )
            pairingOperations.push(recipeOp)
          }
          
          position++
        }
      }
      
      // Execute pairing operations
      if (pairingOperations.length > 0) {
        await executeBatch(DB, pairingOperations)
      }
      
      // Clear cache for this dish
      await cache.clearPattern(`pairings:${mainDish.slug}`)
      await cache.clearPattern(`dish:${mainDish.slug}`)
      
      const response: ApiResponse<any> = {
        success: true,
        data: {
          message: `Successfully imported ${mainDish.name} with ${data.side_dishes.length} side dishes`,
          main_dish_id: mainDishId
        }
      }
      
      return c.json(response)
      
    } catch (error) {
      console.error('Import error:', error)
      const response: ApiResponse<any> = {
        success: false,
        error: 'Failed to import dishes',
        timestamp: new Date().toISOString()
      }
      return c.json(response, 500)
    }
  }
)

// Debug endpoint to list first 20 dishes with their slugs
app.get('/api/debug/dishes', async (c) => {
  const { DB } = c.env
  
  try {
    const dishes = await DB.prepare('SELECT id, name, slug, dish_type FROM dishes ORDER BY id ASC LIMIT 20').all()
    
    return c.json({
      success: true,
      total: dishes.results?.length || 0,
      dishes: dishes.results || [],
      message: 'Debug endpoint - showing first 20 dishes'
    })
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch dishes',
      details: error instanceof Error ? error.message : String(error)
    }, 500)
  }
})


// Get all dishes
app.get('/api/dishes', async (c) => {
  const { DB } = c.env
  const cache = getCacheService(c)
  const { type, limit = '50', offset = '0' } = c.req.query()
  
  // Validate pagination
  const pagination = validatePagination(
    String(parseInt(offset) / parseInt(limit) + 1),
    limit
  )
  
  const cacheKey = `dishes:${type || 'all'}:${pagination.page}:${pagination.limit}`
  
  try {
    // Check cache - store in debug format for frontend compatibility
    const cached = await cache.get<any>(cacheKey)
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    let query = 'SELECT * FROM dishes'
    const params: any[] = []
    
    if (type) {
      query += ' WHERE dish_type = ?'
      params.push(sanitizeInput(type))
    }
    
    query += ' ORDER BY name ASC LIMIT ? OFFSET ?'
    params.push(pagination.limit, pagination.offset)
    
    const result = await safeQuery<RawDish>(
      DB.prepare(query).bind(...params)
    )
    
    if (!result.success) {
      throw new Error('Database query failed')
    }
    
    // Transform dishes for frontend compatibility
    const transformedDishes = result.results.map(transformDish)
    
    // Return format compatible with frontend expectations (like debug endpoint)
    const response = {
      success: true,
      total: result.results.length,
      dishes: transformedDishes,
      message: `Found ${result.results.length} dishes`
    }
    
    // Cache for 15 minutes
    await cache.set(cacheKey, response, 900)
    
    c.header('X-Cache', 'MISS')
    return c.json(response)
  } catch (error) {
    const response = {
      success: false,
      error: sanitizeErrorMessage(error, isDevelopment()),
      timestamp: new Date().toISOString(),
      dishes: [],
      total: 0
    }
    return c.json(response, 500)
  }
})

// Get dish by slug
app.get('/api/dishes/:slug', async (c) => {
  const { DB } = c.env
  const cache = getCacheService(c)
  let slug = sanitizeSlug(c.req.param('slug'))
  
  // Handle both old format (with prefix) and new format (without prefix)
  const originalSlug = slug
  const slugWithoutPrefix = slug.replace('what-to-serve-with-', '')
  
  const cacheKey = `dish:${originalSlug}`
  
  try {
    // Check cache
    const cached = await cache.get<ApiResponse<any>>(cacheKey)
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    // Try without prefix first
    let dish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
      .bind(slugWithoutPrefix)
      .first() as RawDish | null
    
    // If not found, try with the original slug
    if (!dish && originalSlug !== slugWithoutPrefix) {
      dish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
        .bind(originalSlug)
        .first() as RawDish | null
    }
    
    if (!dish) {
      const response: ApiResponse<any> = {
        success: false,
        error: 'Dish not found'
      }
      return c.json(response, 404)
    }
    
    // Get recipe if exists
    const recipe = await DB.prepare('SELECT * FROM recipes WHERE dish_id = ?')
      .bind(dish.id)
      .first() as Recipe | null
    
    // Transform the dish for consistency
    const transformedDish = transformDish(dish)
    
    const response: ApiResponse<any> = {
      success: true,
      data: {
        ...transformedDish,
        recipe: recipe || null
      }
    }
    
    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600)
    
    c.header('X-Cache', 'MISS')
    return c.json(response)
  } catch (error) {
    const response: ApiResponse<any> = {
      success: false,
      error: sanitizeErrorMessage(error, isDevelopment()),
      timestamp: new Date().toISOString()
    }
    return c.json(response, 500)
  }
})

// Get pairings for a dish
app.get('/api/pairings/:slug', async (c) => {
  const { DB, CACHE } = c.env
  const cache = getCacheService(c)
  let slug = sanitizeSlug(c.req.param('slug'))
  
  // Handle both old format (with prefix) and new format (without prefix)
  const originalSlug = slug
  const slugWithoutPrefix = slug.replace('what-to-serve-with-', '')
  
  const cacheKey = `pairings:${originalSlug}`
  
  try {
    // Check cache first
    const cached = await cache.get<ApiResponse<any>>(cacheKey)
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    // Get main dish - try both with and without prefix
    let mainDish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
      .bind(slugWithoutPrefix)
      .first() as RawDish | null
    
    if (!mainDish && originalSlug !== slugWithoutPrefix) {
      mainDish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
        .bind(originalSlug)
        .first() as RawDish | null
    }
    
    if (!mainDish) {
      const response: ApiResponse<any> = {
        success: false,
        error: 'Main dish not found'
      }
      return c.json(response, 404)
    }
    
    // Get pairings with parameterized query
    
    const result = await safeQuery(
      DB.prepare(`
        SELECT 
          d.*,
          p.match_score,
          p.order_position,
          r.ingredients,
          r.instructions,
          r.prep_time,
          r.cook_time,
          r.servings,
          r.difficulty
        FROM pairings p
        JOIN dishes d ON p.side_dish_id = d.id
        LEFT JOIN recipes r ON d.id = r.dish_id
        WHERE p.main_dish_id = ?
        ORDER BY p.order_position ASC
        LIMIT 15
      `).bind(mainDish.id)
    )
    
    if (!result.success) {
      throw new Error('Failed to fetch pairings')
    }
    
    // Update view count (in background, don't wait)
    const updateViewCount = async () => {
      const existingPopular = await DB.prepare('SELECT id FROM popular_dishes WHERE dish_id = ?')
        .bind(mainDish.id)
        .first()
      
      if (existingPopular) {
        await DB.prepare(`
          UPDATE popular_dishes SET 
            view_count = view_count + 1,
            last_viewed = CURRENT_TIMESTAMP
          WHERE dish_id = ?
        `).bind(mainDish.id).run()
      } else {
        await DB.prepare(`
          INSERT INTO popular_dishes (dish_id, view_count, last_viewed)
          VALUES (?, 1, CURRENT_TIMESTAMP)
        `).bind(mainDish.id).run()
      }
    }
    updateViewCount().catch(console.error)
    
    const response: ApiResponse<any> = {
      success: true,
      data: {
        main_dish: {
          ...mainDish,
          dietary_tags: safeJsonParse(mainDish.dietary_tags, []),
          keywords: safeJsonParse(mainDish.keywords, [])
        },
        side_dishes: result.results.map(p => {
          const sideDish: any = {
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            image_url: p.image_url,
            cuisine: p.cuisine,
            dish_type: p.dish_type,
            match_score: p.match_score,
            order_position: p.order_position,
            dietary_tags: safeJsonParse(p.dietary_tags, [])
          }
          
          // Add recipe if exists
          if (p.ingredients) {
            sideDish.recipe = {
              ingredients: safeJsonParse(p.ingredients, []),
              instructions: safeJsonParse(p.instructions, []),
              prep_time: p.prep_time,
              cook_time: p.cook_time,
              servings: p.servings,
              difficulty: p.difficulty
            }
          }
          
          return sideDish
        })
      }
    }
    
    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600)
    
    c.header('X-Cache', 'MISS')
    return c.json(response)
  } catch (error) {
    console.error('Pairings error:', error)
    const response: ApiResponse<any> = {
      success: false,
      error: sanitizeErrorMessage(error, isDevelopment()),
      timestamp: new Date().toISOString()
    }
    return c.json(response, 500)
  }
})

// Search dishes with proper parameterization
app.get('/api/search', async (c) => {
  const { DB } = c.env
  const cache = getCacheService(c)
  const { q, page = '1', limit = '20' } = c.req.query()
  
  const searchQuery = sanitizeInput(q as string)
  
  if (!searchQuery || searchQuery.length < 2) {
    const response: ApiResponse<any> = {
      success: false,
      error: 'Query must be at least 2 characters'
    }
    return c.json(response, 400)
  }
  
  const pagination = validatePagination(page as string, limit as string)
  const cacheKey = `search:${searchQuery}:${pagination.page}:${pagination.limit}`
  
  try {
    // Check cache
    const cached = await cache.get<ApiResponse<RawDish[]>>(cacheKey)
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    // Use parameterized query to prevent SQL injection
    const searchPattern = `%${searchQuery}%`
    const result = await safeQuery<RawDish>(
      DB.prepare(`
        SELECT * FROM dishes 
        WHERE name LIKE ? OR description LIKE ?
        ORDER BY 
          CASE 
            WHEN name LIKE ? THEN 1
            WHEN name LIKE ? THEN 2
            ELSE 3
          END,
          name ASC
        LIMIT ? OFFSET ?
      `).bind(
        searchPattern, 
        searchPattern,
        searchQuery, // Exact match gets priority
        searchPattern, // Partial match second
        pagination.limit, 
        pagination.offset
      )
    )
    
    if (!result.success) {
      throw new Error('Search query failed')
    }
    
    const response: ApiResponse<RawDish[]> = {
      success: true,
      data: result.results
    }
    
    // Cache for 5 minutes
    await cache.set(cacheKey, response, 300)
    
    c.header('X-Cache', 'MISS')
    return c.json(response)
  } catch (error) {
    const response: ApiResponse<any> = {
      success: false,
      error: sanitizeErrorMessage(error, isDevelopment()),
      timestamp: new Date().toISOString()
    }
    return c.json(response, 500)
  }
})

// Frontend-compatible endpoints (without /api prefix)

// Get all dishes (frontend compatible)
app.get('/dishes', async (c) => {
  const { DB } = c.env
  const cache = getCacheService(c)
  const { type, limit = '50', offset = '0' } = c.req.query()
  
  const pagination = validatePagination(
    String(parseInt(offset as string) / parseInt(limit as string) + 1),
    limit as string
  )
  
  const cacheKey = `fe-dishes:${type || 'all'}:${pagination.page}:${pagination.limit}`
  
  try {
    // Check cache
    const cached = await cache.get<TransformedDish[]>(cacheKey)
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    let query = 'SELECT * FROM dishes'
    const params: any[] = []
    
    if (type) {
      query += ' WHERE dish_type = ?'
      params.push(sanitizeInput(type as string))
    }
    
    query += ' ORDER BY name ASC LIMIT ? OFFSET ?'
    params.push(pagination.limit, pagination.offset)
    
    const result = await safeQuery<RawDish>(
      DB.prepare(query).bind(...params)
    )
    
    if (!result.success) {
      throw new Error('Database query failed')
    }
    
    const transformed = result.results.map(transformDish)
    
    // Cache for 15 minutes
    await cache.set(cacheKey, transformed, 900)
    
    c.header('X-Cache', 'MISS')
    return c.json(transformed)
  } catch (error) {
    return c.json({ error: 'Failed to fetch dishes' }, 500)
  }
})

// Get popular dishes (frontend compatible)
app.get('/dishes/popular', async (c) => {
  const { DB } = c.env
  const cache = getCacheService(c)
  const { limit = '10' } = c.req.query()
  
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string) || 10))
  const cacheKey = `popular-dishes:${limitNum}`
  
  try {
    // Check cache
    const cached = await cache.get<TransformedDish[]>(cacheKey)
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    const result = await safeQuery<RawDish>(
      DB.prepare(`
        SELECT d.* FROM dishes d
        JOIN popular_dishes pd ON d.id = pd.dish_id
        ORDER BY pd.view_count DESC, pd.last_viewed DESC
        LIMIT ?
      `).bind(limitNum)
    )
    
    if (!result.success) {
      throw new Error('Failed to fetch popular dishes')
    }
    
    const transformed = result.results.map(transformDish)
    
    // Cache for 5 minutes
    await cache.set(cacheKey, transformed, 300)
    
    c.header('X-Cache', 'MISS')
    return c.json(transformed)
  } catch (error) {
    return c.json({ error: 'Failed to fetch popular dishes' }, 500)
  }
})

// Get dish by slug (frontend compatible)
app.get('/dishes/:slug', async (c) => {
  const { DB } = c.env
  const cache = getCacheService(c)
  let slug = sanitizeSlug(c.req.param('slug'))
  
  const originalSlug = slug
  const slugWithoutPrefix = slug.replace('what-to-serve-with-', '')
  const cacheKey = `fe-dish:${originalSlug}`
  
  try {
    // Check cache
    const cached = await cache.get<any>(cacheKey)
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    let dish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
      .bind(slugWithoutPrefix)
      .first() as RawDish | null
    
    if (!dish && originalSlug !== slugWithoutPrefix) {
      dish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
        .bind(originalSlug)
        .first() as RawDish | null
    }
    
    if (!dish) {
      return c.json({ error: 'Dish not found' }, 404)
    }
    
    const recipe = await DB.prepare('SELECT * FROM recipes WHERE dish_id = ?')
      .bind(dish.id)
      .first() as Recipe | null
    
    const transformed = transformDish(dish)
    const response = {
      ...transformed,
      recipe: recipe || null
    }
    
    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600)
    
    c.header('X-Cache', 'MISS')
    return c.json(response)
  } catch (error) {
    return c.json({ error: 'Failed to fetch dish' }, 500)
  }
})

// Get dish pairings (frontend compatible)
app.get('/dishes/:slug/pairings', async (c) => {
  const { DB } = c.env
  const cache = getCacheService(c)
  let slug = sanitizeSlug(c.req.param('slug'))
  
  const originalSlug = slug
  const slugWithoutPrefix = slug.replace('what-to-serve-with-', '')
  const cacheKey = `fe-pairings:${originalSlug}`
  
  try {
    // Check cache
    const cached = await cache.get<any>(cacheKey)
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    let mainDish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
      .bind(slugWithoutPrefix)
      .first() as RawDish | null
    
    if (!mainDish && originalSlug !== slugWithoutPrefix) {
      mainDish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
        .bind(originalSlug)
        .first() as RawDish | null
    }
    
    if (!mainDish) {
      return c.json({ error: 'Main dish not found' }, 404)
    }
    
    const result = await safeQuery(
      DB.prepare(`
        SELECT 
          d.*,
          p.match_score,
          p.order_position,
          r.ingredients,
          r.instructions,
          r.prep_time,
          r.cook_time,
          r.servings,
          r.difficulty
        FROM pairings p
        JOIN dishes d ON p.side_dish_id = d.id
        LEFT JOIN recipes r ON d.id = r.dish_id
        WHERE p.main_dish_id = ?
        ORDER BY p.order_position ASC
        LIMIT 15
      `).bind(mainDish.id)
    )
    
    if (!result.success) {
      throw new Error('Failed to fetch pairings')
    }
    
    // Update view count asynchronously
    const updateViewCount = async () => {
      const existingPopular = await DB.prepare('SELECT id FROM popular_dishes WHERE dish_id = ?')
        .bind(mainDish.id)
        .first()
      
      if (existingPopular) {
        await DB.prepare(`
          UPDATE popular_dishes SET 
            view_count = view_count + 1,
            last_viewed = CURRENT_TIMESTAMP
          WHERE dish_id = ?
        `).bind(mainDish.id).run()
      } else {
        await DB.prepare(`
          INSERT INTO popular_dishes (dish_id, view_count, last_viewed)
          VALUES (?, 1, CURRENT_TIMESTAMP)
        `).bind(mainDish.id).run()
      }
    }
    updateViewCount().catch(console.error)
    
    const response = {
      mainDish: transformDish(mainDish),
      sideDishes: result.results.map(p => {
        const sideDish = transformDish({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          image_url: p.image_url,
          cuisine: p.cuisine,
          dish_type: p.dish_type,
          dietary_tags: p.dietary_tags || '[]'
        } as RawDish)
        
        sideDish.matchScore = p.match_score
        sideDish.orderPosition = p.order_position
        
        if (p.ingredients) {
          sideDish.recipe = {
            ingredients: safeJsonParse(p.ingredients, []),
            instructions: safeJsonParse(p.instructions, []),
            prep_time: p.prep_time,
            cook_time: p.cook_time,
            servings: p.servings,
            difficulty: p.difficulty
          }
        }
        
        return sideDish
      })
    }
    
    // Cache for 1 hour
    await cache.set(cacheKey, response, 3600)
    
    c.header('X-Cache', 'MISS')
    return c.json(response)
  } catch (error) {
    console.error('Pairings error:', error)
    return c.json({ error: 'Failed to fetch pairings' }, 500)
  }
})

// Get categories (frontend compatible)
app.get('/categories', async (c) => {
  const { DB } = c.env
  const cache = getCacheService(c)
  const cacheKey = 'categories'
  
  try {
    // Check cache
    const cached = await cache.get<string[]>(cacheKey)
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    const result = await safeQuery<{ category: string }>(
      DB.prepare(`
        SELECT DISTINCT dish_type as category FROM dishes 
        WHERE dish_type IS NOT NULL 
        ORDER BY dish_type
      `)
    )
    
    if (!result.success) {
      throw new Error('Failed to fetch categories')
    }
    
    const categories = result.results.map(r => r.category)
    
    // Cache for 1 hour
    await cache.set(cacheKey, categories, 3600)
    
    c.header('X-Cache', 'MISS')
    return c.json(categories)
  } catch (error) {
    return c.json({ error: 'Failed to fetch categories' }, 500)
  }
})

// Search dishes (frontend compatible)
app.get('/search', async (c) => {
  const { DB } = c.env
  const cache = getCacheService(c)
  const { q, page = '1', limit = '20' } = c.req.query()
  
  const searchQuery = sanitizeInput(q as string)
  
  if (!searchQuery || searchQuery.length < 2) {
    return c.json({ error: 'Query must be at least 2 characters' }, 400)
  }
  
  const pagination = validatePagination(page as string, limit as string)
  const cacheKey = `fe-search:${searchQuery}:${pagination.page}:${pagination.limit}`
  
  try {
    // Check cache
    const cached = await cache.get<any>(cacheKey)
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    const searchPattern = `%${searchQuery}%`
    const result = await safeQuery<RawDish>(
      DB.prepare(`
        SELECT * FROM dishes 
        WHERE name LIKE ? OR description LIKE ?
        ORDER BY 
          CASE 
            WHEN name LIKE ? THEN 1
            WHEN name LIKE ? THEN 2
            ELSE 3
          END,
          name ASC
        LIMIT ? OFFSET ?
      `).bind(
        searchPattern,
        searchPattern,
        searchQuery,
        searchPattern,
        pagination.limit,
        pagination.offset
      )
    )
    
    if (!result.success) {
      throw new Error('Search query failed')
    }
    
    const response = {
      dishes: result.results.map(transformDish),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: result.results.length
      }
    }
    
    // Cache for 5 minutes
    await cache.set(cacheKey, response, 300)
    
    c.header('X-Cache', 'MISS')
    return c.json(response)
  } catch (error) {
    return c.json({ error: 'Search failed' }, 500)
  }
})

// Get all recipes (API endpoint for frontend)
app.get('/api/recipes', async (c) => {
  const { DB } = c.env
  const cache = getCacheService(c)
  const { limit = '10' } = c.req.query()
  
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string) || 10))
  const cacheKey = `recipes:${limitNum}`
  
  try {
    // Check cache
    const cached = await cache.get<Recipe[]>(cacheKey)
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    // For now, return sample recipes based on existing dishes
    const result = await safeQuery<RawDish>(
      DB.prepare(`
        SELECT * FROM dishes 
        WHERE slug IN ('15-bean-soup', 'blt-sandwich', 'charcuterie-board', 'grilled-cheese', 'baked-potato', 'chicken-noodle-soup')
        LIMIT ?
      `).bind(limitNum)
    )
    
    if (!result.success) {
      throw new Error('Failed to fetch recipes')
    }
    
    // Transform dishes into recipe format
    const recipes = result.results.map(dish => ({
      id: dish.id,
      slug: dish.slug,
      title: `${dish.name} Recipe`,
      description: dish.description || `Learn how to make delicious ${dish.name}`,
      image_url: dish.image_url,
      prep_time: 15,
      cook_time: 30,
      servings: 4,
      difficulty: 'medium' as RecipeDifficulty,
      ingredients: [
        'Main ingredient 1',
        'Main ingredient 2', 
        'Seasoning',
        'Additional ingredients as needed'
      ],
      instructions: [
        'Prepare your ingredients',
        'Follow the cooking method',
        'Season to taste',
        'Serve and enjoy'
      ]
    }))
    
    // Cache for 1 hour
    await cache.set(cacheKey, recipes, 3600)
    
    c.header('X-Cache', 'MISS')
    return c.json(recipes)
  } catch (error) {
    return c.json({ error: 'Failed to fetch recipes' }, 500)
  }
})

// Get featured recipes (API endpoint for frontend)
app.get('/api/recipes/featured', async (c) => {
  const { DB } = c.env
  const cache = getCacheService(c)
  const cacheKey = 'featured-recipes'
  
  try {
    // Check cache
    const cached = await cache.get<Recipe[]>(cacheKey)
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    // Get featured dishes and transform to recipes
    const result = await safeQuery<RawDish>(
      DB.prepare(`
        SELECT * FROM dishes 
        WHERE slug IN ('15-bean-soup', 'blt-sandwich', 'charcuterie-board')
        LIMIT 3
      `)
    )
    
    if (!result.success) {
      throw new Error('Failed to fetch featured recipes')
    }
    
    const featuredRecipes = result.results.map(dish => ({
      id: dish.id,
      slug: dish.slug,
      title: `Featured: ${dish.name} Recipe`,
      description: dish.description || `Our featured recipe for ${dish.name}`,
      image_url: dish.image_url,
      prep_time: 20,
      cook_time: 45,
      servings: 6,
      difficulty: 'easy' as RecipeDifficulty,
      ingredients: [
        'Premium ingredients',
        'Special seasonings',
        'Fresh herbs',
        'Quality base ingredients'
      ],
      instructions: [
        'Start with quality ingredients',
        'Follow our special technique',
        'Add signature seasonings',
        'Present beautifully'
      ]
    }))
    
    // Cache for 2 hours
    await cache.set(cacheKey, featuredRecipes, 7200)
    
    c.header('X-Cache', 'MISS')
    return c.json(featuredRecipes)
  } catch (error) {
    return c.json({ error: 'Failed to fetch featured recipes' }, 500)
  }
})


// Handle frontend's what-to-serve-with URLs - serve a server-rendered page
app.all('*', async (c, next) => {
  if (c.req.path.startsWith('/what-to-serve-with-') && c.req.method === 'GET') {
    const { DB } = c.env
    const dishIdentifier = c.req.path.replace('/what-to-serve-with-', '')
    let slug = sanitizeSlug(dishIdentifier)
    
    try {
      // Try multiple slug variations to handle different formats
      let dish = null as RawDish | null
      
      // Try exact slug first
      dish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
        .bind(slug)
        .first() as RawDish | null
        
      // If not found, try without "a-" prefix if it exists
      if (!dish && slug.startsWith('a-')) {
        const slugWithoutA = slug.substring(2)
        dish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
          .bind(slugWithoutA)
          .first() as RawDish | null
      }
      
      // If not found, try with "what-to-serve-with-" prefix
      if (!dish) {
        const slugWithPrefix = `what-to-serve-with-${slug}`
        dish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
          .bind(slugWithPrefix)
          .first() as RawDish | null
      }
      
      // If still not found, try to find by partial match
      if (!dish) {
        // Remove common articles and try to find similar dishes
        const cleanSlug = slug.replace(/^(a|an|the)-/, '')
        dish = await DB.prepare('SELECT * FROM dishes WHERE slug LIKE ?')
          .bind(`%${cleanSlug}%`)
          .first() as RawDish | null
      }
      
      if (!dish) {
        // Try to find a similar dish and suggest it
        const searchTerm = slug.replace(/-/g, ' ').replace(/^(a|an|the) /, '')
        const similarDish = await DB.prepare(
          'SELECT slug, name FROM dishes WHERE name LIKE ? LIMIT 1'
        ).bind(`%${searchTerm}%`).first() as {slug: string, name: string} | null
        
        if (similarDish) {
          // Redirect to the correct URL
          return c.redirect(`/what-to-serve-with-${similarDish.slug}`, 301)
        }
        
        return c.notFound()
      }
      
      // If we found the dish with a different slug variation, redirect to canonical URL
      if (dish.slug !== slug) {
        return c.redirect(`/what-to-serve-with-${dish.slug}`, 301)
      }
      
      // Get the pairings
      const result = await safeQuery(
        DB.prepare(`
          SELECT 
            d.*,
            p.match_score,
            p.order_position
          FROM pairings p
          JOIN dishes d ON p.side_dish_id = d.id
          WHERE p.main_dish_id = ?
          ORDER BY p.order_position ASC
          LIMIT 15
        `).bind(dish.id)
      )
      
      if (!result.success) {
        throw new Error('Failed to fetch pairings')
      }
      
      // Parse dietary tags and keywords
      const dietaryTags = safeJsonParse(dish.dietary_tags, [])
      const keywords = safeJsonParse(dish.keywords, [])
      
      // Generate a simple server-rendered page with proper HTML escaping
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>What to Serve with ${escapeHtml(dish.name)} - PairDish</title>
    <meta name="description" content="${escapeHtml(dish.seo_description || `Discover the perfect side dishes and pairings for ${dish.name}. Expert-curated recommendations for a complete meal.`)}">
    <link rel="stylesheet" href="/assets/index-v8ikjrLU.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="min-h-screen bg-gradient-to-br from-cream via-white to-primary-50">
      <!-- Header -->
      <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-primary-100">
        <div class="container-custom">
          <div class="flex items-center justify-between py-4">
            <a href="/" class="flex items-center space-x-2 group">
              <div class="p-2 bg-primary-500 rounded-full group-hover:bg-primary-600 transition-colors">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                </svg>
              </div>
              <span class="text-2xl font-display font-bold text-primary-800">PairDish</span>
            </a>
            <nav class="flex items-center space-x-6">
              <a href="/" class="text-gray-700 hover:text-primary-600 transition-colors">Home</a>
              <a href="/search" class="text-gray-700 hover:text-primary-600 transition-colors">Browse</a>
            </nav>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container-custom py-8">
        <div class="max-w-6xl mx-auto">
          <!-- Dish Header -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div class="md:flex">
              ${dish.image_url ? `
              <div class="md:w-2/5">
                <img src="${escapeHtml(dish.image_url)}" alt="${escapeHtml(dish.name)}" class="w-full h-full object-cover">
              </div>
              ` : ''}
              <div class="p-8 ${dish.image_url ? 'md:w-3/5' : ''}">
                <h1 class="text-4xl font-display font-bold text-gray-800 mb-4">What to Serve with ${escapeHtml(dish.name)}</h1>
                ${dish.description ? `<p class="text-lg text-gray-600 mb-6">${escapeHtml(dish.description)}</p>` : ''}
                <div class="flex flex-wrap gap-2 mb-6">
                  ${dish.dish_type ? `<span class="badge-category bg-primary-100 text-primary-800">${escapeHtml(dish.dish_type)}</span>` : ''}
                  ${dish.cuisine ? `<span class="badge-category bg-secondary-100 text-secondary-800">${escapeHtml(dish.cuisine)}</span>` : ''}
                  ${dietaryTags.map((tag: string) => `<span class="badge-category bg-gray-100 text-gray-700">${escapeHtml(tag)}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- Pairings -->
          <div>
            <h2 class="text-2xl font-display font-semibold text-gray-800 mb-6">Perfect Pairings</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${result.results.map(pairing => {
                const pairingTags = safeJsonParse(pairing.dietary_tags, [])
                return `
                <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  ${pairing.image_url ? `
                  <div class="h-48 overflow-hidden">
                    <img src="${escapeHtml(pairing.image_url)}" alt="${escapeHtml(pairing.name)}" class="w-full h-full object-cover">
                  </div>
                  ` : ''}
                  <div class="p-4">
                    <h3 class="text-lg font-display font-semibold text-gray-800 mb-2">${escapeHtml(pairing.name)}</h3>
                    ${pairing.description ? `<p class="text-sm text-gray-600 mb-3">${escapeHtml(pairing.description)}</p>` : ''}
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-gray-500">${escapeHtml(pairing.dish_type || 'Side Dish')}</span>
                      ${pairing.match_score ? `<span class="text-xs text-primary-600 font-semibold">${pairing.match_score}% Match</span>` : ''}
                    </div>
                  </div>
                </div>
                `
              }).join('')}
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-gray-800 text-white mt-16 py-8">
        <div class="container-custom text-center">
          <p>&copy; 2024 PairDish. All rights reserved.</p>
        </div>
      </footer>
    </div>
</body>
</html>
      `
      
      return c.html(html)
    } catch (error) {
      console.error('What-to-serve-with error:', error)
      return c.notFound()
    }
  }
  await next()
})

// Serve static assets and frontend
app.get('*', async (c) => {
  try {
    // Try to serve the requested path from assets
    const response = await c.env.ASSETS.fetch(c.req.raw)
    
    // If the response is OK, return it
    if (response.ok) {
      return response
    }
    
    // If not found and it's not an API route, serve index.html for client-side routing
    if (!c.req.path.startsWith('/api')) {
      const indexResponse = await c.env.ASSETS.fetch(new Request(new URL('/index.html', c.req.url)))
      if (indexResponse.ok) {
        return new Response(indexResponse.body, {
          headers: {
            'content-type': 'text/html; charset=utf-8',
          },
        })
      }
    }
    
    // If still not found, return 404
    return c.notFound()
  } catch (error) {
    console.error('Asset serving error:', error)
    return c.notFound()
  }
})

// TEMPORARY: Populate test data endpoint (REMOVE IN PRODUCTION)
app.get('/api/populate-test-data-emergency', async (c) => {
  const { DB } = c.env
  
  try {
    // Clear existing pairings
    await DB.prepare('DELETE FROM pairings').run()
    
    // Add side dishes if they don't exist
    const sideDishes = [
      { name: 'Cornbread', slug: 'cornbread', description: 'Sweet and crumbly cornbread', dish_type: 'side' },
      { name: 'Garden Salad', slug: 'garden-salad', description: 'Fresh mixed greens with vegetables', dish_type: 'side' },
      { name: 'Garlic Bread', slug: 'garlic-bread', description: 'Crispy garlic bread', dish_type: 'side' },
      { name: 'Caesar Salad', slug: 'caesar-salad', description: 'Classic Caesar salad', dish_type: 'side' },
      { name: 'French Fries', slug: 'french-fries', description: 'Golden crispy fries', dish_type: 'side' },
      { name: 'Coleslaw', slug: 'coleslaw', description: 'Creamy cabbage slaw', dish_type: 'side' },
      { name: 'Mashed Potatoes', slug: 'mashed-potatoes', description: 'Creamy mashed potatoes', dish_type: 'side' },
      { name: 'Rice Pilaf', slug: 'rice-pilaf', description: 'Fluffy seasoned rice', dish_type: 'side' },
      { name: 'Roasted Vegetables', slug: 'roasted-vegetables', description: 'Seasonal roasted veggies', dish_type: 'side' },
      { name: 'Biscuits', slug: 'biscuits', description: 'Fluffy buttermilk biscuits', dish_type: 'side' },
      { name: 'Mac and Cheese', slug: 'mac-and-cheese', description: 'Creamy mac and cheese', dish_type: 'side' },
      { name: 'Green Beans', slug: 'green-beans', description: 'Seasoned green beans', dish_type: 'side' },
      { name: 'Potato Salad', slug: 'potato-salad', description: 'Classic potato salad', dish_type: 'side' },
      { name: 'Dinner Rolls', slug: 'dinner-rolls', description: 'Soft dinner rolls', dish_type: 'side' },
      { name: 'Steamed Broccoli', slug: 'steamed-broccoli', description: 'Healthy steamed broccoli', dish_type: 'side' }
    ]
    
    // Insert side dishes
    for (const dish of sideDishes) {
      await DB.prepare(
        'INSERT OR IGNORE INTO dishes (name, slug, description, dish_type, cuisine, dietary_tags) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(
        dish.name,
        dish.slug,
        dish.description,
        dish.dish_type,
        'American',
        '["vegetarian"]'
      ).run()
    }
    
    // Get all side dish IDs
    const sideDishResults = await DB.prepare('SELECT id, slug FROM dishes WHERE dish_type = "side"').all()
    const sideDishMap = new Map(sideDishResults.results.map((d: any) => [d.slug, d.id]))
    
    // Define pairings for each main dish
    const pairings = [
      // 15 Bean Soup (ID: 1)
      { main: 1, sides: ['cornbread', 'garden-salad', 'garlic-bread', 'caesar-salad', 'dinner-rolls'] },
      // Baked Potato Bar (ID: 3)
      { main: 3, sides: ['garden-salad', 'caesar-salad', 'coleslaw', 'garlic-bread', 'steamed-broccoli'] },
      // BLT Sandwich (ID: 4)
      { main: 4, sides: ['french-fries', 'coleslaw', 'potato-salad', 'garden-salad', 'mac-and-cheese'] },
      // Breakfast Casserole (ID: 5)
      { main: 5, sides: ['biscuits', 'garden-salad', 'roasted-vegetables', 'dinner-rolls', 'caesar-salad'] },
      // Casserole (ID: 6)
      { main: 6, sides: ['garden-salad', 'garlic-bread', 'green-beans', 'dinner-rolls', 'caesar-salad'] },
      // Charcuterie Board Dinner (ID: 8)
      { main: 8, sides: ['garlic-bread', 'caesar-salad', 'roasted-vegetables', 'dinner-rolls', 'garden-salad'] },
      // Cheese Souffle (ID: 10)
      { main: 10, sides: ['garden-salad', 'roasted-vegetables', 'caesar-salad', 'green-beans', 'steamed-broccoli'] }
    ]
    
    // Insert pairings
    for (const pairing of pairings) {
      let position = 1
      for (const sideDishSlug of pairing.sides) {
        const sideDishId = sideDishMap.get(sideDishSlug)
        if (sideDishId) {
          await DB.prepare(
            'INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES (?, ?, ?, ?, ?)'
          ).bind(
            pairing.main,
            sideDishId,
            90 - (position * 5), // Score from 90 down to 70
            `Perfect pairing for a complete meal`,
            position
          ).run()
          position++
        }
      }
      
      // Add more side dishes to reach 15 per main dish
      const additionalSides = Array.from(sideDishMap.entries())
        .filter(([slug]) => !pairing.sides.includes(slug))
        .slice(0, 15 - pairing.sides.length)
      
      for (const [slug, id] of additionalSides) {
        await DB.prepare(
          'INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES (?, ?, ?, ?, ?)'
        ).bind(
          pairing.main,
          id,
          65 - (position * 2), // Lower scores for additional pairings
          `Good alternative pairing option`,
          position
        ).run()
        position++
      }
    }
    
    return c.json({ 
      success: true, 
      message: 'Test data populated successfully',
      sideDishesAdded: sideDishes.length,
      pairingsCreated: pairings.length * 15
    })
    
  } catch (error: any) {
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500)
  }
})

// Temporary test import endpoint (REMOVE IN PRODUCTION)
app.post('/api/import-csv-test', async (c) => {
  const { DB } = c.env
  
  try {
    // Get CSV content from request
    const body = await c.req.json()
    const { csvContent } = body
    
    if (!csvContent) {
      return c.json({ error: 'CSV content is required' }, 400)
    }
    
    console.log('Parsing CSV data...')
    const csvRows = parseCSV(csvContent)
    console.log(`Found ${csvRows.length} rows to import`)
    
    // Track unique dishes to avoid duplicates
    const uniqueSideDishes = new Map<string, number>()
    const mainDishIds = new Map<string, number>()
    
    let totalPairings = 0
    let recipesGenerated = 0
    
    // Process each row
    for (const row of csvRows) {
      console.log(`Processing: ${row.mainDish}`)
      
      // Create main dish
      const mainSlug = row.mainDish.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const mainResult = await DB.prepare(`
        INSERT INTO dishes (name, slug, description, cuisine, dish_type, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET name = excluded.name
        RETURNING id
      `).bind(
        row.mainDish,
        mainSlug,
        `Delicious ${row.mainDish} - a classic dish that pairs well with many sides`,
        'American',
        'main',
        `/images/${mainSlug}.jpg`
      ).first()
      
      const mainDishId = mainResult?.id as number
      if (!mainDishId) {
        console.error(`Failed to create main dish: ${row.mainDish}`)
        continue
      }
      
      mainDishIds.set(row.mainDish, mainDishId)
      
      // Generate recipe for main dish
      const mainRecipe = generateRecipe(row.mainDish, 'main')
      if (mainRecipe) {
        // Check if recipe exists
        const existingRecipe = await DB.prepare(
          'SELECT id FROM recipes WHERE dish_id = ?'
        ).bind(mainDishId).first()
        
        if (existingRecipe) {
          // Update existing recipe
          await DB.prepare(`
            UPDATE recipes SET 
              ingredients = ?,
              instructions = ?,
              prep_time = ?,
              cook_time = ?,
              servings = ?,
              difficulty = ?
            WHERE dish_id = ?
          `).bind(
            JSON.stringify(mainRecipe.ingredients),
            JSON.stringify(mainRecipe.instructions),
            mainRecipe.prep_time,
            mainRecipe.cook_time,
            mainRecipe.servings,
            mainRecipe.difficulty,
            mainDishId
          ).run()
        } else {
          // Insert new recipe
          await DB.prepare(`
            INSERT INTO recipes (dish_id, ingredients, instructions, prep_time, cook_time, servings, difficulty)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).bind(
            mainDishId,
            JSON.stringify(mainRecipe.ingredients),
            JSON.stringify(mainRecipe.instructions),
            mainRecipe.prep_time,
            mainRecipe.cook_time,
            mainRecipe.servings,
            mainRecipe.difficulty
          ).run()
        }
        recipesGenerated++
      }
      
      // Process side dishes
      for (let i = 0; i < row.sideDishes.length; i++) {
        const sideDish = row.sideDishes[i]
        if (!sideDish) continue
        
        let sideDishId = uniqueSideDishes.get(sideDish)
        
        // Create side dish if it doesn't exist
        if (!sideDishId) {
          const sideSlug = sideDish.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          const sideResult = await DB.prepare(`
            INSERT INTO dishes (name, slug, description, cuisine, dish_type, image_url)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(slug) DO UPDATE SET name = excluded.name
            RETURNING id
          `).bind(
            sideDish,
            sideSlug,
            `Fresh and tasty ${sideDish} - perfect as a side dish`,
            'American',
            'side',
            `/images/${sideSlug}.jpg`
          ).first()
          
          sideDishId = sideResult?.id as number
          if (sideDishId) {
            uniqueSideDishes.set(sideDish, sideDishId)
            
            // Generate recipe for side dish
            const sideRecipe = generateRecipe(sideDish, 'side')
            if (sideRecipe) {
              // Check if recipe exists
              const existingRecipe = await DB.prepare(
                'SELECT id FROM recipes WHERE dish_id = ?'
              ).bind(sideDishId).first()
              
              if (existingRecipe) {
                // Update existing recipe
                await DB.prepare(`
                  UPDATE recipes SET 
                    ingredients = ?,
                    instructions = ?,
                    prep_time = ?,
                    cook_time = ?,
                    servings = ?,
                    difficulty = ?
                  WHERE dish_id = ?
                `).bind(
                  JSON.stringify(sideRecipe.ingredients),
                  JSON.stringify(sideRecipe.instructions),
                  sideRecipe.prep_time,
                  sideRecipe.cook_time,
                  sideRecipe.servings,
                  sideRecipe.difficulty,
                  sideDishId
                ).run()
              } else {
                // Insert new recipe
                await DB.prepare(`
                  INSERT INTO recipes (dish_id, ingredients, instructions, prep_time, cook_time, servings, difficulty)
                  VALUES (?, ?, ?, ?, ?, ?, ?)
                `).bind(
                  sideDishId,
                  JSON.stringify(sideRecipe.ingredients),
                  JSON.stringify(sideRecipe.instructions),
                  sideRecipe.prep_time,
                  sideRecipe.cook_time,
                  sideRecipe.servings,
                  sideRecipe.difficulty
                ).run()
              }
              recipesGenerated++
            }
          }
        }
        
        // Create pairing
        if (sideDishId) {
          const matchScore = 95 - (i * 3) // Higher score for earlier items
          await DB.prepare(`
            INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(main_dish_id, side_dish_id) DO UPDATE SET
              match_score = excluded.match_score,
              pairing_reason = excluded.pairing_reason
          `).bind(
            mainDishId,
            sideDishId,
            matchScore,
            `${sideDish} complements ${row.mainDish} perfectly`
          ).run()
          totalPairings++
        }
      }
    }
    
    console.log('Import completed successfully!')
    console.log(`Main dishes: ${mainDishIds.size}`)
    console.log(`Unique side dishes: ${uniqueSideDishes.size}`)
    console.log(`Total pairings: ${totalPairings}`)
    console.log(`Recipes generated: ${recipesGenerated}`)
    
    return c.json({
      success: true,
      message: 'CSV data imported successfully',
      stats: {
        mainDishes: mainDishIds.size,
        uniqueSideDishes: uniqueSideDishes.size,
        totalPairings,
        recipesGenerated
      }
    })
    
  } catch (error: any) {
    console.error('Import error:', error)
    return c.json({ 
      error: 'Failed to import CSV data',
      details: error.message 
    }, 500)
  }
})

// CSV Import endpoint for admin use
app.post('/api/import-csv', requireAdmin, async (c) => {
  const { DB } = c.env
  
  try {
    // Get CSV content from request
    const body = await c.req.json()
    const { csvContent } = body
    
    if (!csvContent) {
      return c.json({ error: 'CSV content is required' }, 400)
    }
    
    console.log('Parsing CSV data...')
    const csvRows = parseCSV(csvContent)
    console.log(`Found ${csvRows.length} rows to import`)
    
    // Track unique dishes to avoid duplicates
    const uniqueSideDishes = new Map<string, number>()
    const mainDishIds = new Map<string, number>()
    
    let totalPairings = 0
    let recipesGenerated = 0
    
    // Process each row
    for (const row of csvRows) {
      console.log(`Processing: ${row.mainDish}`)
      
      // Create main dish
      const mainSlug = row.mainDish.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const mainResult = await DB.prepare(`
        INSERT INTO dishes (name, slug, description, cuisine, dish_type, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET name = excluded.name
        RETURNING id
      `).bind(
        row.mainDish,
        mainSlug,
        `Delicious ${row.mainDish} - a classic dish that pairs well with many sides`,
        'American',
        'main',
        `/images/${mainSlug}.jpg`
      ).first()
      
      const mainDishId = mainResult?.id as number
      if (!mainDishId) {
        console.error(`Failed to create main dish: ${row.mainDish}`)
        continue
      }
      
      mainDishIds.set(row.mainDish, mainDishId)
      
      // Generate recipe for main dish
      const mainRecipe = generateRecipe(row.mainDish, 'main')
      if (mainRecipe) {
        // Check if recipe exists
        const existingRecipe = await DB.prepare(
          'SELECT id FROM recipes WHERE dish_id = ?'
        ).bind(mainDishId).first()
        
        if (existingRecipe) {
          // Update existing recipe
          await DB.prepare(`
            UPDATE recipes SET 
              ingredients = ?,
              instructions = ?,
              prep_time = ?,
              cook_time = ?,
              servings = ?,
              difficulty = ?
            WHERE dish_id = ?
          `).bind(
            JSON.stringify(mainRecipe.ingredients),
            JSON.stringify(mainRecipe.instructions),
            mainRecipe.prep_time,
            mainRecipe.cook_time,
            mainRecipe.servings,
            mainRecipe.difficulty,
            mainDishId
          ).run()
        } else {
          // Insert new recipe
          await DB.prepare(`
            INSERT INTO recipes (dish_id, ingredients, instructions, prep_time, cook_time, servings, difficulty)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).bind(
            mainDishId,
            JSON.stringify(mainRecipe.ingredients),
            JSON.stringify(mainRecipe.instructions),
            mainRecipe.prep_time,
            mainRecipe.cook_time,
            mainRecipe.servings,
            mainRecipe.difficulty
          ).run()
        }
        recipesGenerated++
      }
      
      // Process side dishes
      for (let i = 0; i < row.sideDishes.length; i++) {
        const sideDish = row.sideDishes[i]
        if (!sideDish) continue
        
        let sideDishId = uniqueSideDishes.get(sideDish)
        
        // Create side dish if it doesn't exist
        if (!sideDishId) {
          const sideSlug = sideDish.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          const sideResult = await DB.prepare(`
            INSERT INTO dishes (name, slug, description, cuisine, dish_type, image_url)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(slug) DO UPDATE SET name = excluded.name
            RETURNING id
          `).bind(
            sideDish,
            sideSlug,
            `Fresh and tasty ${sideDish} - perfect as a side dish`,
            'American',
            'side',
            `/images/${sideSlug}.jpg`
          ).first()
          
          sideDishId = sideResult?.id as number
          if (sideDishId) {
            uniqueSideDishes.set(sideDish, sideDishId)
            
            // Generate recipe for side dish
            const sideRecipe = generateRecipe(sideDish, 'side')
            if (sideRecipe) {
              // Check if recipe exists
              const existingRecipe = await DB.prepare(
                'SELECT id FROM recipes WHERE dish_id = ?'
              ).bind(sideDishId).first()
              
              if (existingRecipe) {
                // Update existing recipe
                await DB.prepare(`
                  UPDATE recipes SET 
                    ingredients = ?,
                    instructions = ?,
                    prep_time = ?,
                    cook_time = ?,
                    servings = ?,
                    difficulty = ?
                  WHERE dish_id = ?
                `).bind(
                  JSON.stringify(sideRecipe.ingredients),
                  JSON.stringify(sideRecipe.instructions),
                  sideRecipe.prep_time,
                  sideRecipe.cook_time,
                  sideRecipe.servings,
                  sideRecipe.difficulty,
                  sideDishId
                ).run()
              } else {
                // Insert new recipe
                await DB.prepare(`
                  INSERT INTO recipes (dish_id, ingredients, instructions, prep_time, cook_time, servings, difficulty)
                  VALUES (?, ?, ?, ?, ?, ?, ?)
                `).bind(
                  sideDishId,
                  JSON.stringify(sideRecipe.ingredients),
                  JSON.stringify(sideRecipe.instructions),
                  sideRecipe.prep_time,
                  sideRecipe.cook_time,
                  sideRecipe.servings,
                  sideRecipe.difficulty
                ).run()
              }
              recipesGenerated++
            }
          }
        }
        
        // Create pairing
        if (sideDishId) {
          const matchScore = 95 - (i * 3) // Higher score for earlier items
          await DB.prepare(`
            INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(main_dish_id, side_dish_id) DO UPDATE SET
              match_score = excluded.match_score,
              pairing_reason = excluded.pairing_reason
          `).bind(
            mainDishId,
            sideDishId,
            matchScore,
            `${sideDish} complements ${row.mainDish} perfectly`
          ).run()
          totalPairings++
        }
      }
    }
    
    console.log('Import completed successfully!')
    console.log(`Main dishes: ${mainDishIds.size}`)
    console.log(`Unique side dishes: ${uniqueSideDishes.size}`)
    console.log(`Total pairings: ${totalPairings}`)
    console.log(`Recipes generated: ${recipesGenerated}`)
    
    return c.json({
      success: true,
      message: 'CSV data imported successfully',
      stats: {
        mainDishes: mainDishIds.size,
        uniqueSideDishes: uniqueSideDishes.size,
        totalPairings,
        recipesGenerated
      }
    })
    
  } catch (error: any) {
    console.error('Import error:', error)
    return c.json({ 
      error: 'Failed to import CSV data',
      details: error.message 
    }, 500)
  }
})

// Simple dishes array endpoint for React frontend compatibility
app.get('/api/dishes-array', async (c) => {
  const { DB } = c.env
  const { limit = '8' } = c.req.query()
  
  try {
    const result = await DB.prepare(`
      SELECT * FROM dishes 
      WHERE dish_type = 'main'
      ORDER BY name ASC 
      LIMIT ?
    `).bind(parseInt(limit)).all()
    
    if (result.results) {
      // Return plain array of dishes
      return c.json(result.results.map(dish => ({
        id: dish.id,
        name: dish.name,
        slug: dish.slug,
        description: dish.description,
        image_url: dish.image_url,
        imageUrl: dish.image_url, // Include both formats
        cuisine: dish.cuisine,
        dish_type: dish.dish_type,
        category: dish.dish_type, // Include both formats
        dietary_tags: dish.dietary_tags ? JSON.parse(dish.dietary_tags as string) : [],
        dietaryTags: dish.dietary_tags ? JSON.parse(dish.dietary_tags as string) : []
      })))
    }
    
    return c.json([])
  } catch (error) {
    console.error('Error fetching dishes array:', error)
    return c.json([])
  }
})

// Apply not found handler
app.notFound(notFoundHandler)

export default app