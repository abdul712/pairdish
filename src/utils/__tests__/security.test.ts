import { describe, it, expect } from 'vitest'
import {
  sanitizeInput,
  escapeHtml,
  sanitizeForHtml,
  sanitizeUrl,
  sanitizeStringArray,
  validatePagination,
  sanitizeErrorMessage
} from '../security'

describe('Security Utilities', () => {
  describe('sanitizeInput', () => {
    it('should sanitize SQL injection attempts', () => {
      expect(sanitizeInput("'; DROP TABLE users; --")).toBe(' DROP TABLE users ')
      expect(sanitizeInput("admin' OR '1'='1")).toBe("admin' OR '1'='1")
    })

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world')
    })

    it('should limit string length', () => {
      const longString = 'a'.repeat(300)
      expect(sanitizeInput(longString, 100)).toHaveLength(100)
    })

    it('should handle null and undefined', () => {
      expect(sanitizeInput(null)).toBe('')
      expect(sanitizeInput(undefined)).toBe('')
    })
  })

  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      expect(escapeHtml('<script>alert("XSS")</script>')).toBe(
        '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
      )
      expect(escapeHtml("it's & it's")).toBe("it&#039;s &amp; it&#039;s")
    })

    it('should handle null and undefined', () => {
      expect(escapeHtml(null)).toBe('')
      expect(escapeHtml(undefined)).toBe('')
    })
  })

  describe('sanitizeForHtml', () => {
    it('should sanitize and escape content', () => {
      const input = '  <script>alert("XSS")</script>  '
      expect(sanitizeForHtml(input)).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;')
    })

    it('should respect max length', () => {
      const longString = '<b>' + 'a'.repeat(100) + '</b>'
      const result = sanitizeForHtml(longString, 50)
      expect(result).toHaveLength(62) // 50 chars + escaped < and >
      expect(result).toContain('&lt;b&gt;')
    })
  })

  describe('sanitizeUrl', () => {
    it('should allow valid HTTP/HTTPS URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com/')
      expect(sanitizeUrl('http://localhost:3000')).toBe('http://localhost:3000/')
    })

    it('should reject invalid protocols', () => {
      expect(sanitizeUrl('javascript:alert("XSS")')).toBe('')
      expect(sanitizeUrl('file:///etc/passwd')).toBe('')
      expect(sanitizeUrl('ftp://example.com')).toBe('')
    })

    it('should handle invalid URLs', () => {
      expect(sanitizeUrl('not a url')).toBe('')
      expect(sanitizeUrl('')).toBe('')
      expect(sanitizeUrl(null)).toBe('')
    })
  })

  describe('sanitizeStringArray', () => {
    it('should sanitize array items', () => {
      const input = ['  tag1  ', 'tag2', "'; DROP TABLE;", '']
      const result = sanitizeStringArray(input)
      expect(result).toEqual(['tag1', 'tag2', ' DROP TABLE'])
    })

    it('should limit array size', () => {
      const input = Array(100).fill('tag')
      const result = sanitizeStringArray(input, 10)
      expect(result).toHaveLength(10)
    })

    it('should limit item length', () => {
      const input = ['a'.repeat(100)]
      const result = sanitizeStringArray(input, 10, 20)
      expect(result[0]).toHaveLength(20)
    })

    it('should handle invalid input', () => {
      expect(sanitizeStringArray(null)).toEqual([])
      expect(sanitizeStringArray(undefined)).toEqual([])
    })
  })

  describe('validatePagination', () => {
    it('should validate pagination parameters', () => {
      expect(validatePagination('2', '50')).toEqual({
        page: 2,
        limit: 50,
        offset: 50
      })
    })

    it('should apply defaults', () => {
      expect(validatePagination(undefined, undefined)).toEqual({
        page: 1,
        limit: 20,
        offset: 0
      })
    })

    it('should enforce limits', () => {
      expect(validatePagination('0', '200')).toEqual({
        page: 1,
        limit: 100,
        offset: 0
      })
    })

    it('should handle invalid input', () => {
      expect(validatePagination('abc', 'xyz')).toEqual({
        page: 1,
        limit: 20,
        offset: 0
      })
    })
  })

  describe('sanitizeErrorMessage', () => {
    it('should return detailed error in development', () => {
      const error = new Error('Database connection failed')
      expect(sanitizeErrorMessage(error, true)).toBe('Database connection failed')
    })

    it('should return generic error in production', () => {
      const error = new Error('Database connection failed')
      expect(sanitizeErrorMessage(error, false)).toBe(
        'An error occurred while processing your request'
      )
    })

    it('should handle non-Error objects', () => {
      expect(sanitizeErrorMessage('string error', true)).toBe(
        'An error occurred while processing your request'
      )
      expect(sanitizeErrorMessage({ message: 'object error' }, false)).toBe(
        'An error occurred while processing your request'
      )
    })
  })
})