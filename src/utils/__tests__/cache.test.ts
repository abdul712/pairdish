import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CacheService } from '../cache'

// Mock KVNamespace
const createMockKVNamespace = () => ({
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  list: vi.fn()
})

describe('CacheService', () => {
  let mockKV: ReturnType<typeof createMockKVNamespace>
  let cacheService: CacheService

  beforeEach(() => {
    mockKV = createMockKVNamespace()
    cacheService = new CacheService(mockKV as any)
  })

  describe('get', () => {
    it('should retrieve cached value', async () => {
      const mockData = { id: 1, name: 'Test' }
      mockKV.get.mockResolvedValue(mockData)

      const result = await cacheService.get('test-key')
      
      expect(mockKV.get).toHaveBeenCalledWith('test-key', 'json')
      expect(result).toEqual(mockData)
    })

    it('should return null on error', async () => {
      mockKV.get.mockRejectedValue(new Error('KV error'))

      const result = await cacheService.get('test-key')
      
      expect(result).toBeNull()
    })

    it('should return null for non-existent key', async () => {
      mockKV.get.mockResolvedValue(null)

      const result = await cacheService.get('non-existent')
      
      expect(result).toBeNull()
    })
  })

  describe('set', () => {
    it('should cache value with default TTL', async () => {
      const data = { id: 1, name: 'Test' }
      
      await cacheService.set('test-key', data)
      
      expect(mockKV.put).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(data),
        { expirationTtl: 3600 }
      )
    })

    it('should cache value with custom TTL', async () => {
      const data = { id: 1, name: 'Test' }
      
      await cacheService.set('test-key', data, 7200)
      
      expect(mockKV.put).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(data),
        { expirationTtl: 7200 }
      )
    })

    it('should handle errors gracefully', async () => {
      mockKV.put.mockRejectedValue(new Error('KV error'))
      
      // Should not throw
      await expect(cacheService.set('test-key', {})).resolves.toBeUndefined()
    })
  })

  describe('delete', () => {
    it('should delete cached value', async () => {
      await cacheService.delete('test-key')
      
      expect(mockKV.delete).toHaveBeenCalledWith('test-key')
    })

    it('should handle errors gracefully', async () => {
      mockKV.delete.mockRejectedValue(new Error('KV error'))
      
      // Should not throw
      await expect(cacheService.delete('test-key')).resolves.toBeUndefined()
    })
  })

  describe('clearPattern', () => {
    it('should clear all keys matching pattern', async () => {
      mockKV.list.mockResolvedValue({
        keys: [
          { name: 'dishes:1' },
          { name: 'dishes:2' },
          { name: 'dishes:3' }
        ]
      })

      await cacheService.clearPattern('dishes:')
      
      expect(mockKV.list).toHaveBeenCalledWith({ prefix: 'dishes:' })
      expect(mockKV.delete).toHaveBeenCalledTimes(3)
      expect(mockKV.delete).toHaveBeenCalledWith('dishes:1')
      expect(mockKV.delete).toHaveBeenCalledWith('dishes:2')
      expect(mockKV.delete).toHaveBeenCalledWith('dishes:3')
    })

    it('should handle empty results', async () => {
      mockKV.list.mockResolvedValue({ keys: [] })

      await cacheService.clearPattern('nonexistent:')
      
      expect(mockKV.delete).not.toHaveBeenCalled()
    })

    it('should handle errors gracefully', async () => {
      mockKV.list.mockRejectedValue(new Error('KV error'))
      
      // Should not throw
      await expect(cacheService.clearPattern('test:')).resolves.toBeUndefined()
    })
  })
})