import { D1Database, D1PreparedStatement } from '@cloudflare/workers-types'

/**
 * Database utility functions for safe operations
 */

/**
 * Execute multiple database operations in a batch
 * Provides pseudo-transaction behavior for D1
 * @param db - D1 Database instance
 * @param operations - Array of prepared statements
 * @returns Results of all operations
 */
export async function executeBatch(
  db: D1Database,
  operations: D1PreparedStatement[]
): Promise<any[]> {
  try {
    // D1 supports batch operations which execute atomically
    return await db.batch(operations)
  } catch (error) {
    console.error('Batch operation failed:', error)
    throw new Error('Database operation failed')
  }
}

/**
 * Safe database query with proper error handling
 * @param statement - Prepared statement
 * @returns Query results
 */
export async function safeQuery<T = any>(
  statement: D1PreparedStatement
): Promise<{ results: T[], success: boolean }> {
  try {
    const result = await statement.all()
    return {
      results: result.results as T[],
      success: true
    }
  } catch (error) {
    console.error('Database query failed:', error)
    return {
      results: [],
      success: false
    }
  }
}

/**
 * Create database indexes if they don't exist
 * @param db - D1 Database instance
 */
export async function createIndexes(db: D1Database): Promise<void> {
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_dishes_slug ON dishes(slug)',
    'CREATE INDEX IF NOT EXISTS idx_dishes_type ON dishes(dish_type)',
    'CREATE INDEX IF NOT EXISTS idx_pairings_main ON pairings(main_dish_id)',
    'CREATE INDEX IF NOT EXISTS idx_pairings_side ON pairings(side_dish_id)',
    'CREATE INDEX IF NOT EXISTS idx_recipes_dish ON recipes(dish_id)',
    'CREATE INDEX IF NOT EXISTS idx_popular_dish ON popular_dishes(dish_id)',
    'CREATE INDEX IF NOT EXISTS idx_dishes_search ON dishes(name, description)'
  ]
  
  for (const index of indexes) {
    try {
      await db.prepare(index).run()
    } catch (error) {
      console.error(`Failed to create index: ${index}`, error)
    }
  }
}