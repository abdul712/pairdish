import { Context, Next } from 'hono'
import { sanitizeErrorMessage } from '../utils/security'

/**
 * Global error handling middleware
 */
export async function errorHandler(c: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    console.error('Error:', error)
    
    const isDevelopment = c.env.ENVIRONMENT === 'development'
    const message = sanitizeErrorMessage(error, isDevelopment)
    
    // Don't expose internal error details in production
    const response = {
      error: message,
      timestamp: new Date().toISOString(),
      ...(isDevelopment && error instanceof Error && {
        stack: error.stack,
        details: error.message
      })
    }
    
    return c.json(response, 500)
  }
}

/**
 * Not found handler
 */
export function notFoundHandler(c: Context) {
  return c.json({
    error: 'Not found',
    path: c.req.path,
    timestamp: new Date().toISOString()
  }, 404)
}