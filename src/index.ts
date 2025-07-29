import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

type Bindings = {
  DB: D1Database
  DOMAIN: string
  CACHE: KVNamespace
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS middleware
app.use('/*', cors({
  origin: ['http://localhost:3000', 'https://www.pairdish.com'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'X-API-Key'],
  credentials: true
}))

// Error handling middleware
app.use('*', async (c, next) => {
  try {
    await next()
  } catch (error) {
    console.error('Error:', error)
    return c.json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500)
  }
})

// Schema validation for incoming dish data
const dishSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  cuisine: z.string().optional(),
  dish_type: z.enum(['main', 'side', 'dessert', 'appetizer', 'beverage']),
  dietary_tags: z.array(z.string()).optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  keywords: z.array(z.string()).optional()
})

const recipeSchema = z.object({
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  prep_time: z.number().optional(),
  cook_time: z.number().optional(),
  servings: z.number().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  nutrition: z.record(z.any()).optional(),
  source_url: z.string().url().optional()
})

const pairingDataSchema = z.object({
  main_dish: dishSchema,
  side_dishes: z.array(dishSchema.extend({
    recipe: recipeSchema.optional()
  })),
  timestamp: z.string().optional()
})

// API info route (moved to /api)
app.get('/api', (c) => {
  return c.json({
    name: 'PairDish API',
    version: '1.0.0',
    endpoints: {
      'GET /api': 'API information',
      'POST /api/import-dishes': 'Import dish pairings',
      'GET /api/dishes': 'List all dishes',
      'GET /api/dishes/:slug': 'Get dish by slug',
      'GET /api/pairings/:slug': 'Get pairings for a dish'
    }
  })
})

// Import dishes endpoint (for scraper)
app.post('/api/import-dishes', 
  zValidator('json', pairingDataSchema),
  async (c) => {
    const data = c.req.valid('json')
    const { DB } = c.env
    
    try {
      // TODO: Refactor to use D1 batch operations for true atomicity
      // Current implementation lacks proper transaction rollback on failures
      // For full safety, this endpoint should be refactored to:
      // 1. Collect all operations in a batch array
      // 2. Execute batch operations atomically with DB.batch()
      // 3. Break down this 200+ line function into smaller functions
      const operations = []
      
      // 1. Check if main dish exists
      const mainDish = data.main_dish
      const existingMain = await DB.prepare('SELECT id FROM dishes WHERE slug = ?')
        .bind(mainDish.slug)
        .first()
      
      if (existingMain) {
        // Update existing dish
        await DB.prepare(`
          UPDATE dishes SET 
            name = ?, description = ?, image_url = ?, cuisine = ?, 
            dish_type = ?, dietary_tags = ?, seo_title = ?, 
            seo_description = ?, keywords = ?, updated_at = CURRENT_TIMESTAMP
          WHERE slug = ?
        `).bind(
          mainDish.name,
          mainDish.description || '',
          mainDish.image_url || '',
          mainDish.cuisine || '',
          mainDish.dish_type,
          JSON.stringify(mainDish.dietary_tags || []),
          mainDish.seo_title || '',
          mainDish.seo_description || '',
          JSON.stringify(mainDish.keywords || []),
          mainDish.slug
        ).run()
      } else {
        // Insert new dish
        await DB.prepare(`
          INSERT INTO dishes (name, slug, description, image_url, cuisine, dish_type, dietary_tags, seo_title, seo_description, keywords)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        ).run()
      }
      
      // Get main dish ID
      const mainDishResult = await DB.prepare('SELECT id FROM dishes WHERE slug = ?')
        .bind(mainDish.slug)
        .first()
      
      if (!mainDishResult) {
        throw new Error('Failed to create main dish')
      }
      
      const mainDishId = mainDishResult.id
      
      // 2. Insert side dishes and create pairings
      let position = 1
      for (const sideDish of data.side_dishes) {
        // Check if side dish exists
        const existingSide = await DB.prepare('SELECT id FROM dishes WHERE slug = ?')
          .bind(sideDish.slug)
          .first()
        
        if (existingSide) {
          // Update existing side dish
          await DB.prepare(`
            UPDATE dishes SET 
              name = ?, description = ?, image_url = ?, cuisine = ?, 
              dish_type = ?, dietary_tags = ?, updated_at = CURRENT_TIMESTAMP
            WHERE slug = ?
          `).bind(
            sideDish.name,
            sideDish.description || '',
            sideDish.image_url || '',
            sideDish.cuisine || '',
            sideDish.dish_type || 'side',
            JSON.stringify(sideDish.dietary_tags || []),
            sideDish.slug
          ).run()
        } else {
          // Insert new side dish
          await DB.prepare(`
            INSERT INTO dishes (name, slug, description, image_url, cuisine, dish_type, dietary_tags)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).bind(
            sideDish.name,
            sideDish.slug,
            sideDish.description || '',
            sideDish.image_url || '',
            sideDish.cuisine || '',
            sideDish.dish_type || 'side',
            JSON.stringify(sideDish.dietary_tags || [])
          ).run()
        }
        
        // Get side dish ID
        const sideDishResult = await DB.prepare('SELECT id FROM dishes WHERE slug = ?')
          .bind(sideDish.slug)
          .first()
        
        if (sideDishResult) {
          const sideDishId = sideDishResult.id
          
          // Check if pairing exists
          const existingPairing = await DB.prepare(`
            SELECT id FROM pairings WHERE main_dish_id = ? AND side_dish_id = ?
          `).bind(mainDishId, sideDishId).first()
          
          if (existingPairing) {
            // Update existing pairing
            await DB.prepare(`
              UPDATE pairings SET 
                match_score = ?, order_position = ?
              WHERE main_dish_id = ? AND side_dish_id = ?
            `).bind(
              95 - (position * 2), // Simple scoring based on position
              position,
              mainDishId,
              sideDishId
            ).run()
          } else {
            // Create new pairing
            await DB.prepare(`
              INSERT INTO pairings (main_dish_id, side_dish_id, match_score, order_position)
              VALUES (?, ?, ?, ?)
            `).bind(
              mainDishId,
              sideDishId,
              95 - (position * 2), // Simple scoring based on position
              position
            ).run()
          }
          
          // Insert recipe if provided
          if (sideDish.recipe) {
            // Check if recipe exists
            const existingRecipe = await DB.prepare('SELECT id FROM recipes WHERE dish_id = ?')
              .bind(sideDishId)
              .first()
            
            if (existingRecipe) {
              // Update existing recipe
              await DB.prepare(`
                UPDATE recipes SET 
                  ingredients = ?, instructions = ?, prep_time = ?, 
                  cook_time = ?, servings = ?, difficulty = ?, 
                  nutrition = ?, source_url = ?
                WHERE dish_id = ?
              `).bind(
                JSON.stringify(sideDish.recipe.ingredients),
                JSON.stringify(sideDish.recipe.instructions),
                sideDish.recipe.prep_time || 0,
                sideDish.recipe.cook_time || 0,
                sideDish.recipe.servings || 4,
                sideDish.recipe.difficulty || 'medium',
                JSON.stringify(sideDish.recipe.nutrition || {}),
                sideDish.recipe.source_url || '',
                sideDishId
              ).run()
            } else {
              // Insert new recipe
              await DB.prepare(`
                INSERT INTO recipes (dish_id, ingredients, instructions, prep_time, cook_time, servings, difficulty, nutrition, source_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
              ).run()
            }
          }
          
          position++
        }
      }
      
      return c.json({
        success: true,
        message: `Successfully imported ${mainDish.name} with ${data.side_dishes.length} side dishes`,
        main_dish_id: mainDishId
      })
      
    } catch (error) {
      console.error('Import error:', error)
      return c.json({
        success: false,
        error: 'Failed to import dishes',
        details: error.message
      }, 500)
    }
  }
)

// Get all dishes (API format)
app.get('/api/dishes', (c) => handleGetAllDishes(c, true))

// Get dish by slug (API format)
app.get('/api/dishes/:slug', (c) => handleGetDishBySlug(c, true))

// Handle frontend's what-to-serve-with URLs - serve the React app
app.get('/what-to-serve-with/:slug', async (c) => {
  try {
    // For client-side routing, serve the index.html
    const indexResponse = await c.env.ASSETS.fetch(new Request(new URL('/index.html', c.req.url)))
    if (indexResponse.ok) {
      return new Response(indexResponse.body, {
        headers: {
          'content-type': 'text/html; charset=utf-8',
        },
      })
    }
    return c.notFound()
  } catch (error) {
    console.error('Error serving index.html:', error)
    return c.notFound()
  }
})

// Get pairings for a dish
app.get('/api/pairings/:slug', async (c) => {
  const { DB, CACHE } = c.env
  let slug = c.req.param('slug')
  
  // Handle both old format (with prefix) and new format (without prefix)
  // This ensures backward compatibility during migration
  const originalSlug = slug
  const slugWithoutPrefix = slug.replace('what-to-serve-with-', '')
  
  const cacheKey = `pairings:${originalSlug}`
  
  try {
    // Check cache first
    const cached = await CACHE.get(cacheKey, 'json')
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    // Get main dish - try both with and without prefix for backward compatibility
    let mainDish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
      .bind(slugWithoutPrefix)
      .first()
    
    // If not found, try with the original slug (might have prefix)
    if (!mainDish && originalSlug !== slugWithoutPrefix) {
      mainDish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
        .bind(originalSlug)
        .first()
    }
    
    if (!mainDish) {
      return c.json({
        success: false,
        error: 'Main dish not found'
      }, 404)
    }
    
    // Get pairings
    const { results: pairings } = await DB.prepare(`
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
    `).bind(mainDish.id).all()
    
    // Update view count
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
    
    const response = {
      success: true,
      data: {
        main_dish: {
          ...mainDish,
          dietary_tags: safeJsonParse(mainDish.dietary_tags, []),
          keywords: safeJsonParse(mainDish.keywords, [])
        },
        side_dishes: pairings.map(p => {
          const sideDish = {
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            image_url: p.image_url,
            cuisine: p.cuisine,
            dish_type: p.dish_type,
            match_score: p.match_score,
            order_position: p.order_position,
            dietary_tags: []
          }
          
          // Safely parse dietary tags
          sideDish.dietary_tags = safeJsonParse(p.dietary_tags, [])
          
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
    await CACHE.put(cacheKey, JSON.stringify(response), {
      expirationTtl: 3600
    })
    
    c.header('X-Cache', 'MISS')
    return c.json(response)
  } catch (error) {
    console.error('Pairings error:', error)
    console.error('Error stack:', error.stack)
    console.error('Error message:', error.message)
    return c.json({
      success: false,
      error: 'Failed to fetch pairings',
      details: error.message || 'Unknown error'
    }, 500)
  }
})

// Search dishes (API format)
app.get('/api/search', (c) => handleSearch(c, true))

// Safe JSON parsing with fallback values
function safeJsonParse(jsonString: string, fallback: any = null) {
  try {
    return JSON.parse(jsonString || 'null') ?? fallback;
  } catch (error) {
    console.error('JSON parsing error:', error);
    return fallback;
  }
}

// Data transformation function for frontend compatibility
function transformDish(dish: any) {
  if (!dish) return dish;
  
  // Remove "what-to-serve-with-" prefix from slug if it exists
  let cleanSlug = dish.slug;
  if (cleanSlug && cleanSlug.startsWith('what-to-serve-with-')) {
    cleanSlug = cleanSlug.replace('what-to-serve-with-', '');
  }
  
  return {
    ...dish,
    slug: cleanSlug,
    imageUrl: dish.image_url,
    category: dish.dish_type,
    dietaryTags: safeJsonParse(dish.dietary_tags, []),
    keywords: safeJsonParse(dish.keywords, [])
  };
}

// Shared handler functions to eliminate code duplication

// TODO: Performance Optimizations Needed:
// 1. Add database indexes: CREATE INDEX idx_dishes_slug ON dishes(slug);
// 2. Add database indexes: CREATE INDEX idx_dishes_type ON dishes(dish_type);
// 3. Add database indexes: CREATE INDEX idx_pairings_main ON pairings(main_dish_id);
// 4. Add database indexes: CREATE INDEX idx_pairings_side ON pairings(side_dish_id);
// 5. Implement caching for all endpoints (currently only pairings uses cache)
// 6. Consider using batch queries to reduce N+1 problems in import endpoint

async function handleGetAllDishes(c: any, apiResponse = false) {
  const { DB } = c.env
  const { type, limit = '50', offset = '0' } = c.req.query()
  
  try {
    let query = 'SELECT * FROM dishes'
    const params = []
    
    if (type) {
      query += ' WHERE dish_type = ?'
      params.push(type)
    }
    
    query += ' ORDER BY name ASC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))
    
    const { results } = await DB.prepare(query).bind(...params).all()
    
    if (apiResponse) {
      return c.json({
        success: true,
        data: results,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      })
    } else {
      return c.json(results.map(transformDish))
    }
  } catch (error) {
    const errorMsg = 'Failed to fetch dishes'
    if (apiResponse) {
      return c.json({ success: false, error: errorMsg }, 500)
    } else {
      return c.json({ error: errorMsg }, 500)
    }
  }
}

async function handleGetDishBySlug(c: any, apiResponse = false) {
  const { DB } = c.env
  let slug = c.req.param('slug')
  
  // Handle both old format (with prefix) and new format (without prefix)
  const originalSlug = slug
  const slugWithoutPrefix = slug.replace('what-to-serve-with-', '')
  
  try {
    // Try without prefix first
    let dish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
      .bind(slugWithoutPrefix)
      .first()
    
    // If not found, try with the original slug (might have prefix)
    if (!dish && originalSlug !== slugWithoutPrefix) {
      dish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
        .bind(originalSlug)
        .first()
    }
    
    if (!dish) {
      const errorMsg = 'Dish not found'
      if (apiResponse) {
        return c.json({ success: false, error: errorMsg }, 404)
      } else {
        return c.json({ error: errorMsg }, 404)
      }
    }
    
    // Get recipe if exists
    const recipe = await DB.prepare('SELECT * FROM recipes WHERE dish_id = ?')
      .bind(dish.id)
      .first()
    
    if (apiResponse) {
      return c.json({
        success: true,
        data: {
          ...dish,
          recipe: recipe || null
        }
      })
    } else {
      const transformedDish = transformDish(dish)
      return c.json({
        ...transformedDish,
        recipe: recipe || null
      })
    }
  } catch (error) {
    const errorMsg = 'Failed to fetch dish'
    if (apiResponse) {
      return c.json({ success: false, error: errorMsg }, 500)
    } else {
      return c.json({ error: errorMsg }, 500)
    }
  }
}

async function handleSearch(c: any, apiResponse = false) {
  const { DB } = c.env
  const { q, page = '1', limit = '20' } = c.req.query()
  
  if (!q || q.length < 2) {
    const errorMsg = 'Query must be at least 2 characters'
    if (apiResponse) {
      return c.json({ success: false, error: errorMsg }, 400)
    } else {
      return c.json({ error: errorMsg }, 400)
    }
  }
  
  try {
    const offset = apiResponse ? 0 : (parseInt(page) - 1) * parseInt(limit)
    const searchLimit = apiResponse ? 20 : parseInt(limit)
    
    const { results } = await DB.prepare(`
      SELECT * FROM dishes 
      WHERE name LIKE ? OR description LIKE ?
      LIMIT ? ${apiResponse ? '' : 'OFFSET ?'}
    `).bind(`%${q}%`, `%${q}%`, searchLimit, ...(apiResponse ? [] : [offset])).all()
    
    if (apiResponse) {
      return c.json({
        success: true,
        data: results
      })
    } else {
      return c.json({
        dishes: results.map(transformDish),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: results.length
        }
      })
    }
  } catch (error) {
    const errorMsg = 'Search failed'
    if (apiResponse) {
      return c.json({ success: false, error: errorMsg }, 500)
    } else {
      return c.json({ error: errorMsg }, 500)
    }
  }
}

// Frontend-compatible endpoints (without /api prefix)

// Get all dishes (frontend compatible)
app.get('/dishes', (c) => handleGetAllDishes(c, false))

// Get popular dishes (frontend compatible) - MUST come before /dishes/:slug
app.get('/dishes/popular', async (c) => {
  const { DB } = c.env
  const { limit = '10' } = c.req.query()
  
  try {
    const { results } = await DB.prepare(`
      SELECT d.* FROM dishes d
      JOIN popular_dishes pd ON d.id = pd.dish_id
      ORDER BY pd.view_count DESC, pd.last_viewed DESC
      LIMIT ?
    `).bind(parseInt(limit)).all()
    
    return c.json(results.map(transformDish))
  } catch (error) {
    return c.json({ error: 'Failed to fetch popular dishes' }, 500)
  }
})

// Get dish by slug (frontend compatible)
app.get('/dishes/:slug', (c) => handleGetDishBySlug(c, false))

// Get dish pairings (frontend compatible)
app.get('/dishes/:slug/pairings', async (c) => {
  const { DB, CACHE } = c.env
  let slug = c.req.param('slug')
  
  // Handle both old format (with prefix) and new format (without prefix)
  const originalSlug = slug
  const slugWithoutPrefix = slug.replace('what-to-serve-with-', '')
  
  const cacheKey = `pairings:${originalSlug}`
  
  try {
    // Check cache first
    const cached = await CACHE.get(cacheKey, 'json')
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    // Get main dish - try both with and without prefix for backward compatibility
    let mainDish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
      .bind(slugWithoutPrefix)
      .first()
    
    // If not found, try with the original slug (might have prefix)
    if (!mainDish && originalSlug !== slugWithoutPrefix) {
      mainDish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
        .bind(originalSlug)
        .first()
    }
    
    if (!mainDish) {
      return c.json({ error: 'Main dish not found' }, 404)
    }
    
    // Get pairings
    const { results: pairings } = await DB.prepare(`
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
    `).bind(mainDish.id).all()
    
    // Update view count
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
    
    const response = {
      mainDish: transformDish(mainDish),
      sideDishes: pairings.map(p => {
        const sideDish = transformDish({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          image_url: p.image_url,
          cuisine: p.cuisine,
          dish_type: p.dish_type,
          dietary_tags: p.dietary_tags || '[]'
        })
        
        sideDish.matchScore = p.match_score
        sideDish.orderPosition = p.order_position
        
        // Add recipe if exists
        if (p.ingredients) {
          sideDish.recipe = {
            ingredients: safeJsonParse(p.ingredients, []),
            instructions: safeJsonParse(p.instructions, []),
            prepTime: p.prep_time,
            cookTime: p.cook_time,
            servings: p.servings,
            difficulty: p.difficulty
          }
        }
        
        return sideDish
      })
    }
    
    // Cache for 1 hour
    await CACHE.put(cacheKey, JSON.stringify(response), {
      expirationTtl: 3600
    })
    
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
  
  try {
    const { results } = await DB.prepare(`
      SELECT DISTINCT dish_type as category FROM dishes 
      WHERE dish_type IS NOT NULL 
      ORDER BY dish_type
    `).all()
    
    return c.json(results.map(r => r.category))
  } catch (error) {
    return c.json({ error: 'Failed to fetch categories' }, 500)
  }
})

// Search dishes (frontend compatible)
app.get('/search', (c) => handleSearch(c, false))

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

export default app
