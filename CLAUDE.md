# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PairDish is a modern full-stack web application for food pairing suggestions. The project uses a client-server architecture with:
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS (in `/client` directory)
- **Backend**: Node.js + TypeScript + Express (in `/server` directory)  
- **Database**: SQLite with type-safe models (in `/database` directory)
- **Shared Types**: Common TypeScript interfaces (in `/shared` directory)
- **Containerized**: Docker setup with nginx reverse proxy

## Essential Commands

### Client Development (React Frontend)
```bash
cd client
npm install                    # Install client dependencies
npm run dev                   # Start Vite dev server (usually localhost:5174)
npm run build                 # Build for production
npm run preview               # Preview production build
npm run lint                  # ESLint + Prettier
npm run type-check            # TypeScript checking
```

### Server Development (Node.js Backend)
```bash
cd server
npm install                   # Install server dependencies  
npm start                     # Start production server
npm run dev                   # Start development server with hot reload
npm run build                 # Compile TypeScript to JavaScript
npm run test                  # Run server tests
```

### Full Stack Development
```bash
# Run both client and server concurrently
docker-compose up             # Start full stack with Docker
```

## Current Architecture

### Frontend Structure (`/client`)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and building  
- **Styling**: Tailwind CSS with custom food-themed design system
- **UI Components**: shadcn/ui component library
- **Routing**: React Router for SPA navigation
- **State Management**: React hooks (useState, useEffect)
- **API Integration**: Custom `apiService` for backend communication

### Key Frontend Files
- `src/pages/HomePage.tsx` - Main landing page with enhanced food visuals
- `src/services/api.ts` - API service for backend communication
- `src/services/imageService.ts` - Food image service with multiple API sources
- `src/components/ui/` - Reusable UI components (shadcn/ui)
- `src/index.css` - Custom CSS with food-themed gradients and animations

### Backend Structure (`/server`)
- **Framework**: Express.js with TypeScript
- **Database**: SQLite with custom models
- **Controllers**: Separation of business logic
- **Middleware**: CORS, validation, error handling
- **Routes**: RESTful API design

### Key Backend Files
- `src/index.ts` - Main server entry point
- `src/controllers/` - Request handlers for dishes, pairings, search
- `src/models/` - Database models (MainDish, SideDish, DishPairing)
- `src/routes/` - API route definitions
- `src/data/mockData.ts` - Sample data for development

### Database Schema
- **main_dishes**: Primary dishes with cuisine, description, images
- **side_dishes**: Side dish options with pairing compatibility  
- **dish_pairings**: Many-to-many relationships with match scores
- **popular_dishes**: View tracking for trending content

### API Endpoints
- `GET /api/dishes` - List main dishes with pagination
- `GET /api/dishes/:id` - Get specific dish details
- `GET /api/dishes/:id/pairings` - Get pairing suggestions for dish
- `GET /api/search?q=query` - Search dishes by name/description
- `GET /api/cuisines/:type` - Filter by cuisine type

## Visual Design System

### Color Palette (Food-Focused)
- **Primary**: Warm orange/red (#ff6b35) for appetite appeal
- **Secondary**: Warm cream (#fef7ed) for elegant backgrounds  
- **Accent**: Peach gradients for highlights
- **Typography**: Inter for body text, Playfair Display for headings

### Image Strategy
- **External APIs**: Unsplash, Foodish API for high-quality food photos
- **Fallbacks**: Custom SVG placeholders with food gradients
- **Lazy Loading**: Images load progressively for better performance
- **Responsive**: Multiple sizes for different screen densities

### UI Components
- **Cards**: Enhanced hover effects with shadows and transforms
- **Buttons**: Gradient backgrounds with smooth transitions
- **Search**: Glassmorphism effects with backdrop blur
- **Navigation**: Clean, minimal design focused on usability

## Development Workflow

1. **Frontend Changes**: Edit files in `/client/src`, Vite hot reloads automatically
2. **Backend Changes**: Edit files in `/server/src`, restart server or use nodemon
3. **Styling**: Tailwind classes in components, custom CSS in `index.css`
4. **Images**: Use `ImageService.getFoodImage()` for consistent image loading
5. **Testing**: Use Playwright for visual regression testing

## Deployment & Production

- **Frontend**: Vite builds to `/client/dist` for static hosting
- **Backend**: TypeScript compiles to `/server/dist` for Node.js
- **Docker**: Full containerization with nginx reverse proxy
- **Environment**: Separate configs for development/production

## Known Issues & Improvements

### Current Limitations
- External image APIs may have CORS issues in development
- Server build fails due to TypeScript path resolution issues
- Mobile responsiveness needs testing across more devices

### Recent Improvements  
- ✅ Enhanced visual design with food-focused color palette
- ✅ Added high-quality food images from multiple API sources
- ✅ Improved typography with Google Fonts (Inter + Playfair Display)
- ✅ Added hover animations and smooth transitions
- ✅ Implemented glassmorphism effects in hero section
- ✅ Created custom SVG placeholders for better fallbacks

## Performance Considerations

- **Image Optimization**: WebP format where possible, lazy loading
- **Bundle Splitting**: Vite automatically splits vendor chunks
- **Caching**: Service worker for offline functionality (future)
- **CDN**: External assets served from fast CDNs