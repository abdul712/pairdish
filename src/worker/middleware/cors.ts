import { cors } from 'hono/cors'

/**
 * Get CORS configuration based on environment
 */
export function getCorsConfig(isDevelopment: boolean = false) {
  const allowedOrigins = isDevelopment
    ? ['http://localhost:3000', 'http://localhost:3001']
    : ['https://www.pairdish.com', 'https://pairdish.com']
  
  return cors({
    origin: allowedOrigins,
    allowMethods: ['GET', 'POST', 'OPTIONS'], // Removed unnecessary DELETE, PATCH
    allowHeaders: ['Content-Type', 'X-API-Key'],
    credentials: false, // Only enable if truly needed
    maxAge: 3600 // Cache preflight requests for 1 hour
  })
}