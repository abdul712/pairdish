/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitize string input to prevent SQL injection and XSS
 * @param input - Raw input string
 * @param maxLength - Maximum allowed length (default: 255)
 * @returns Sanitized string
 */
export function sanitizeInput(input: string | undefined | null, maxLength: number = 255): string {
  if (!input) return ''
  
  // Trim whitespace and limit length
  let sanitized = input.trim().substring(0, maxLength)
  
  // Remove any potential SQL injection attempts
  // This is a defense in depth measure - we still use parameterized queries
  // Only remove SQL comment sequences (--) and single quotes/semicolons, not single hyphens
  sanitized = sanitized.replace(/[';\-]{2,}/g, '').replace(/'/g, '')
  
  return sanitized
}

/**
 * Sanitize URL slug - more permissive than general input sanitization
 * @param slug - Raw slug string
 * @param maxLength - Maximum allowed length (default: 255)
 * @returns Sanitized slug string
 */
export function sanitizeSlug(slug: string | undefined | null, maxLength: number = 255): string {
  if (!slug) return ''
  
  // Trim whitespace and limit length
  let sanitized = slug.trim().substring(0, maxLength)
  
  // For slugs, we only need to remove dangerous SQL patterns, but keep hyphens
  // Only remove SQL comment sequences (--) and single quotes/semicolons
  sanitized = sanitized.replace(/\-{2,}/g, '').replace(/[';\(\)\[\]]/g, '')
  
  return sanitized
}

/**
 * Escape HTML entities to prevent XSS
 * @param unsafe - Raw HTML string
 * @returns HTML-escaped string
 */
export function escapeHtml(unsafe: string | undefined | null): string {
  if (!unsafe) return ''
  
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Sanitize and escape content for HTML templates
 * @param content - Raw content
 * @param maxLength - Maximum allowed length
 * @returns Sanitized and escaped string
 */
export function sanitizeForHtml(content: string | undefined | null, maxLength: number = 1000): string {
  return escapeHtml(sanitizeInput(content, maxLength))
}

/**
 * Validate and sanitize URL
 * @param url - Raw URL string
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return ''
  
  try {
    const urlObj = new URL(url)
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return ''
    }
    return urlObj.toString()
  } catch {
    return ''
  }
}

/**
 * Sanitize array of strings (e.g., tags, keywords)
 * @param arr - Array of strings
 * @param maxItems - Maximum number of items allowed
 * @param maxItemLength - Maximum length per item
 * @returns Sanitized array
 */
export function sanitizeStringArray(
  arr: string[] | undefined | null,
  maxItems: number = 50,
  maxItemLength: number = 50
): string[] {
  if (!arr || !Array.isArray(arr)) return []
  
  return arr
    .slice(0, maxItems)
    .map(item => sanitizeInput(item, maxItemLength))
    .filter(item => item.length > 0)
}

/**
 * Generate a secure random API key
 * @returns A random API key string
 */
export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const keyLength = 32
  let key = ''
  
  const randomValues = crypto.getRandomValues(new Uint8Array(keyLength))
  
  for (let i = 0; i < keyLength; i++) {
    key += chars[randomValues[i] % chars.length]
  }
  
  return key
}

/**
 * Validate pagination parameters
 * @param page - Page number
 * @param limit - Items per page
 * @returns Validated pagination params
 */
export function validatePagination(page: string | undefined, limit: string | undefined): {
  page: number
  limit: number
  offset: number
} {
  const pageNum = Math.max(1, parseInt(page || '1') || 1)
  const limitNum = Math.min(100, Math.max(1, parseInt(limit || '20') || 20))
  const offset = (pageNum - 1) * limitNum
  
  return { page: pageNum, limit: limitNum, offset }
}

/**
 * Sanitize error messages to avoid leaking sensitive information
 * @param error - Error object
 * @param isDevelopment - Whether in development mode
 * @returns Safe error message
 */
export function sanitizeErrorMessage(error: unknown, isDevelopment: boolean = false): string {
  if (isDevelopment && error instanceof Error) {
    return error.message
  }
  
  // In production, return generic error messages
  return 'An error occurred while processing your request'
}