# Multi-stage build for PairDish application

# Stage 1: Build the client
FROM node:18-alpine AS client-builder

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./
RUN npm ci --only=production

# Copy client source code
COPY client/ ./

# Build the client
RUN npm run build

# Stage 2: Build the server
FROM node:18-alpine AS server-builder

WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./
RUN npm ci

# Copy server source code and shared types
COPY server/src ./src
COPY server/tsconfig.json ./
COPY shared ../shared

# Build the server
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS production

WORKDIR /app

# Install production dependencies for server
COPY server/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built server
COPY --from=server-builder /app/server/dist ./dist
COPY --from=server-builder /app/shared ./shared

# Copy built client (for serving static files if needed)
COPY --from=client-builder /app/client/dist ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S pairdish -u 1001

# Change ownership
RUN chown -R pairdish:nodejs /app
USER pairdish

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "dist/index.js"]