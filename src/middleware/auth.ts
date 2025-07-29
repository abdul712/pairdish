import { Context, Next } from 'hono'

/**
 * Middleware to validate API key for protected endpoints
 */
export async function apiKeyMiddleware(c: Context, next: Next) {
  const apiKey = c.req.header('X-API-Key')
  const validApiKey = c.env.ADMIN_API_KEY
  
  if (!apiKey || !validApiKey || apiKey !== validApiKey) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  await next()
}

/**
 * Middleware to check if request is from admin
 * Can be extended to support more sophisticated auth methods
 */
export async function requireAdmin(c: Context, next: Next) {
  // For now, we're using API key authentication
  // In the future, this could be extended to support JWT, OAuth, etc.
  return apiKeyMiddleware(c, next)
}