# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PairDish is a serverless web application for food pairing suggestions, built on Cloudflare Workers. It consists of:
- **Backend API**: Hono framework on Cloudflare Workers with D1 database
- **Frontend**: Vanilla JavaScript with server-side HTML rendering
- **Static Assets**: Served via Cloudflare's ASSETS binding

## Essential Commands

### Development
```bash
npm install        # Install dependencies
npm run dev        # Start local development server (runs wrangler dev)
```

### Building & Deployment
```bash
npm run build      # Type-check only (no actual build needed for Workers)
npm run deploy     # Deploy to Cloudflare Workers (auto-deploy enabled via GitHub)
```

### Testing & Quality
```bash
npm run test       # Run tests with Vitest
npm run test:ui    # Run tests with UI
npm run lint       # ESLint on src/**/*.ts
npm run type-check # TypeScript type checking
npm run check-all  # Run type-check, lint, and tests
```

### Type Generation
```bash
npm run cf-typegen # Generate TypeScript types from Worker configuration
```

## Architecture

### Backend Structure (`/src`)
- **`index.ts`**: Main API entry point with all route definitions
- **Database**: Cloudflare D1 (SQLite) with tables for `dishes`, `pairings`, `recipes`, and `popular_dishes`
- **Caching**: Cloudflare KV namespace for API response caching
- **Security**: Input sanitization, CORS, API key middleware for admin routes

### Frontend (`/public`)
- **`index.html`**: Single-page vanilla JavaScript application
- **API Integration**: Direct fetch calls to backend endpoints
- **Styling**: Tailwind CSS with custom design system

### Key API Endpoints
- `GET /api/dishes?limit=N` - List dishes (returns `{success: true, dishes: [...]}`)
- `GET /api/dishes/:id` - Get dish details
- `GET /api/dishes/:id/pairings` - Get pairing suggestions
- `GET /api/recipes/featured` - Get 3 featured recipes
- `GET /search?q=query` - Search dishes (min 2 chars)

### Database Schema
- **dishes**: Main dish information with slug-based URLs
- **pairings**: Many-to-many relationships with match scores
- **recipes**: Detailed recipe data linked to dishes
- **popular_dishes**: View tracking for popularity sorting

### Deployment Configuration
- **Worker Name**: `pairdish`
- **Database**: D1 binding as `DB`
- **Cache**: KV namespace binding as `CACHE`
- **Assets**: Static files from `/public` directory
- **Auto-deploy**: Enabled via GitHub integration

## Important Implementation Details

1. **API Response Format**: The `/api/dishes` endpoint returns data wrapped in `{success: true, dishes: [...]}`, not just the array.

2. **URL Structure**: Dish detail pages use the pattern `/what-to-serve-with-{dish-slug}`

3. **Frontend Loading**: The homepage loads Popular Dishes and Featured Recipes via JavaScript after page load, showing "Loading..." initially.

4. **Recipe Generation**: The `/api/recipes/featured` endpoint transforms dish data into recipe format on the fly (no separate recipe entries in DB currently).

5. **Search Requirements**: Search queries require minimum 2 characters, returning 400 error for shorter queries.

6. **Static Export**: The project uses vanilla JavaScript instead of a framework to avoid build complexities with Cloudflare Workers.

## Known Issues
- Featured Recipes page routing (`/recipe/featured`) returns 404
- Initial content loading shows delay (3-5 seconds)
- Search results return raw JSON instead of formatted UI