/**
 * Cache service for KV namespace operations
 */
export class CacheService {
  constructor(private cache: KVNamespace) {}
  
  /**
   * Get cached value
   * @param key - Cache key
   * @returns Cached value or null
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.cache.get(key, 'json')
      return cached as T | null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }
  
  /**
   * Set cache value
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in seconds (default: 1 hour)
   */
  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    try {
      await this.cache.put(key, JSON.stringify(value), {
        expirationTtl: ttl
      })
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }
  
  /**
   * Delete cached value
   * @param key - Cache key
   */
  async delete(key: string): Promise<void> {
    try {
      await this.cache.delete(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }
  
  /**
   * Clear cache by pattern
   * @param pattern - Key pattern to match
   */
  async clearPattern(pattern: string): Promise<void> {
    try {
      const list = await this.cache.list({ prefix: pattern })
      const deletePromises = list.keys.map(key => this.cache.delete(key.name))
      await Promise.all(deletePromises)
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  }
}