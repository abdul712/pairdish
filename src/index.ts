import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

type Bindings = {
  DB: D1Database
  DOMAIN: string
  CACHE: KVNamespace
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

// Get categories endpoint (required by frontend)
app.get('/categories', async (c) => {
  const { DB } = c.env
  
  try {
    const { results } = await DB.prepare(`
      SELECT DISTINCT dish_type as category
      FROM dishes 
      WHERE dish_type IS NOT NULL AND dish_type != ''
      ORDER BY dish_type ASC
    `).all()
    
    return c.json(results.map(r => r.category))
  } catch (error) {
    return c.json([])
  }
})

// Home route
app.get('/', (c) => {
  return c.json({
    name: 'PairDish API',
    version: '1.0.0',
    endpoints: {
      'GET /': 'API information',
      'POST /api/import-dishes': 'Import dish pairings',
      'GET /api/dishes': 'List all dishes',
      'GET /dishes': 'List all dishes (frontend)',
      'GET /api/dishes/:slug': 'Get dish by slug',
      'GET /dishes/:slug': 'Get dish by slug (frontend)',
      'GET /dishes/popular': 'Get popular dishes',
      'GET /dishes/:slug/pairings': 'Get pairings for a dish',
      'GET /api/pairings/:slug': 'Get pairings for a dish (legacy)',
      'GET /search': 'Search dishes',
      'GET /categories': 'Get dish categories'
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
      // Start transaction-like operation
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

// Helper function to transform dish data to frontend format
function transformDish(dish) {
  return {
    id: dish.id,
    slug: dish.slug,
    name: dish.name,
    description: dish.description || '',
    category: dish.dish_type || '',
    cuisine: dish.cuisine || '',
    imageUrl: dish.image_url || '',
    pairings: [] // Will be populated separately when needed
  }
}

// Get all dishes
app.get('/api/dishes', async (c) => {
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
    
    return c.json(results.map(transformDish))
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch dishes'
    }, 500)
  }
})

// Get all dishes (frontend expects /dishes endpoint)
app.get('/dishes', async (c) => {
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
    
    return c.json(results.map(transformDish))
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch dishes'
    }, 500)
  }
})

// Get dish by slug
app.get('/api/dishes/:slug', async (c) => {
  const { DB } = c.env
  const slug = c.req.param('slug')
  
  try {
    const dish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
      .bind(slug)
      .first()
    
    if (!dish) {
      return c.json({
        success: false,
        error: 'Dish not found'
      }, 404)
    }
    
    // Get recipe if exists
    const recipe = await DB.prepare('SELECT * FROM recipes WHERE dish_id = ?')
      .bind(dish.id)
      .first()
    
    return c.json({
      success: true,
      data: {
        ...transformDish(dish),
        recipe: recipe || null
      }
    })
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch dish'
    }, 500)
  }
})

// Get dish by slug (frontend expects /dishes/:slug endpoint)
app.get('/dishes/:slug', async (c) => {
  const { DB } = c.env
  const slug = c.req.param('slug')
  
  try {
    const dish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
      .bind(slug)
      .first()
    
    if (!dish) {
      return c.notFound()
    }
    
    // Get pairings count for this dish
    const { count } = await DB.prepare(`
      SELECT COUNT(*) as count FROM pairings WHERE main_dish_id = ?
    `).bind(dish.id).first()
    
    const transformedDish = transformDish(dish)
    transformedDish.pairings = []; // Empty array, actual pairings loaded separately
    
    return c.json(transformedDish)
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch dish'
    }, 500)
  }
})

// Get pairings for a dish
app.get('/api/pairings/:slug', async (c) => {
  const { DB, CACHE } = c.env
  const slug = c.req.param('slug')
  const cacheKey = `pairings:${slug}`
  
  try {
    // Check cache first
    const cached = await CACHE.get(cacheKey, 'json')
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    // Get main dish
    const mainDish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
      .bind(slug)
      .first()
    
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
          dietary_tags: JSON.parse(mainDish.dietary_tags || '[]'),
          keywords: JSON.parse(mainDish.keywords || '[]')
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
          try {
            sideDish.dietary_tags = JSON.parse(p.dietary_tags || '[]')
          } catch (e) {
            console.error('Error parsing dietary_tags:', e)
          }
          
          // Add recipe if exists
          if (p.ingredients) {
            try {
              sideDish.recipe = {
                ingredients: JSON.parse(p.ingredients),
                instructions: JSON.parse(p.instructions),
                prep_time: p.prep_time,
                cook_time: p.cook_time,
                servings: p.servings,
                difficulty: p.difficulty
              }
            } catch (e) {
              console.error('Error parsing recipe:', e)
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

// Get popular dishes endpoint (required by frontend)
app.get('/dishes/popular', async (c) => {
  const { DB } = c.env
  const { limit = '10' } = c.req.query()
  
  try {
    const { results } = await DB.prepare(`
      SELECT d.*, COALESCE(p.view_count, 0) as views
      FROM dishes d
      LEFT JOIN popular_dishes p ON d.id = p.dish_id
      ORDER BY COALESCE(p.view_count, 0) DESC, d.name ASC
      LIMIT ?
    `).bind(parseInt(limit)).all()
    
    return c.json(results.map(transformDish))
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch popular dishes'
    }, 500)
  }
})

// Get dish pairings (frontend expects /dishes/:slug/pairings)
app.get('/dishes/:slug/pairings', async (c) => {
  const { DB, CACHE } = c.env
  const slug = c.req.param('slug')
  const cacheKey = `pairings:${slug}`
  
  try {
    // Check cache first
    const cached = await CACHE.get(cacheKey, 'json')
    if (cached) {
      c.header('X-Cache', 'HIT')
      return c.json(cached)
    }
    
    // Get main dish
    const mainDish = await DB.prepare('SELECT * FROM dishes WHERE slug = ?')
      .bind(slug)
      .first()
    
    if (!mainDish) {
      return c.notFound()
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
    
    // Transform pairings to expected format
    const transformedPairings = pairings.map(p => ({
      id: p.id,
      dish: mainDish.name,
      pairingDish: p.name,
      pairingType: 'side', // Default to 'side' for now
      description: p.description || '',
      popularity: p.match_score,
      recipe: p.ingredients ? {
        id: `recipe-${p.id}`,
        slug: p.slug,
        title: p.name,
        description: p.description || '',
        imageUrl: p.image_url || '',
        ingredients: JSON.parse(p.ingredients || '[]'),
        instructions: JSON.parse(p.instructions || '[]'),
        prepTime: p.prep_time,
        cookTime: p.cook_time,
        servings: p.servings,
        difficulty: p.difficulty
      } : null
    }))
    
    const response = transformedPairings
    
    // Cache for 1 hour
    await CACHE.put(cacheKey, JSON.stringify(response), {
      expirationTtl: 3600
    })
    
    c.header('X-Cache', 'MISS')
    return c.json(response)
  } catch (error) {
    console.error('Pairings error:', error)
    return c.json({
      success: false,
      error: 'Failed to fetch pairings'
    }, 500)
  }
})

// Search dishes
app.get('/api/search', async (c) => {
  const { DB } = c.env
  const { q } = c.req.query()
  
  if (!q || q.length < 2) {
    return c.json({
      success: false,
      error: 'Query must be at least 2 characters'
    }, 400)
  }
  
  try {
    const { results } = await DB.prepare(`
      SELECT * FROM dishes 
      WHERE name LIKE ? OR description LIKE ?
      LIMIT 20
    `).bind(`%${q}%`, `%${q}%`).all()
    
    return c.json({
      dishes: results.map(transformDish),
      recipes: [], // Empty for now
      totalResults: results.length,
      page: 1,
      totalPages: 1
    })
  } catch (error) {
    return c.json({
      success: false,
      error: 'Search failed'
    }, 500)
  }
})

// Search dishes (frontend expects /search endpoint)
app.get('/search', async (c) => {
  const { DB } = c.env
  const { q, page = '1', limit = '20' } = c.req.query()
  
  if (!q || q.length < 2) {
    return c.json({
      dishes: [],
      recipes: [],
      totalResults: 0,
      page: parseInt(page),
      totalPages: 0
    })
  }
  
  try {
    const { results } = await DB.prepare(`
      SELECT * FROM dishes 
      WHERE name LIKE ? OR description LIKE ?
      LIMIT ?
    `).bind(`%${q}%`, `%${q}%`, parseInt(limit)).all()
    
    return c.json({
      dishes: results.map(transformDish),
      recipes: [], // Empty for now
      totalResults: results.length,
      page: parseInt(page),
      totalPages: Math.ceil(results.length / parseInt(limit))
    })
  } catch (error) {
    return c.json({
      dishes: [],
      recipes: [],
      totalResults: 0,
      page: parseInt(page),
      totalPages: 0
    })
  }
})

export default app
