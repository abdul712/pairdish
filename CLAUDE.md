# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PairingPlates is a culinary tool web application for discovering food flavor pairings, built with Astro and React. The app uses Tailwind CSS for styling and is deployed on Cloudflare Workers.

## Development Commands

- `npm run dev` - Start development server (localhost:4321)
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Preview build using Wrangler (Cloudflare Workers)
- `npm run deploy` - Deploy to Cloudflare Workers

## Architecture

### Tech Stack
- **Framework**: Astro 5+ with SSR output
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 (latest)
- **Deployment**: Cloudflare Workers with adapter
- **Domain**: pairingplates.com

### Key Configuration Notes
- SSR mode enabled for Cloudflare Workers
- React 19 requires `react-dom/server.edge` alias in production
- Duplicate React instances prevented via `vite.resolve.dedupe`
- Tailwind CSS integrated via Vite plugin (@tailwindcss/vite)
- TypeScript uses strict config extending "astro/tsconfigs/strict"

### Project Structure

```
src/
├── components/
│   ├── layouts/BaseLayout.astro    # Main page layout
│   ├── tools/FlavorPairingFinder.tsx # Core React component
│   └── ui/                         # UI components (empty, ready for shadcn/ui)
├── data/
│   └── flavor-profiles.ts          # Flavor pairing database
├── lib/
│   └── utils.ts                   # Utility functions (cn, formatting, etc.)
├── pages/
│   ├── index.astro               # Homepage
│   └── tools/                    # Tool pages
└── styles/
    └── global.css               # Global styles
```

### Core Components

**FlavorPairingFinder** (`src/components/tools/FlavorPairingFinder.tsx`):
- Main interactive React component for flavor pairing discovery
- Uses comprehensive flavor profile database with 40+ ingredients
- Features search, category filtering, and pairing calculations
- Built with hooks for state management and memoization

**Flavor Profiles Database** (`src/data/flavor-profiles.ts`):
- Comprehensive ingredient database with categories, flavor notes, aromatic profiles
- Includes best/unexpected pairings, cuisine affinities, seasonality
- Helper functions for searching, matching, and calculating compatibility scores
- TypeScript interfaces for type safety

### Utility Functions (`src/lib/utils.ts`)
- `cn()` - Combines classes using clsx + tailwind-merge
- `formatPercentage()`, `formatFraction()` - Number formatting
- `debounce()` - Search input optimization
- `getMatchQuality()` - Pairing score interpretation

### Styling Approach
- Tailwind CSS v4 with modern configuration
- Uses Radix UI components (@radix-ui/react-*)
- Class variance authority (cva) for component variants
- Editorial luxury aesthetic with warm, appetizing design

## Development Notes

### Cloudflare Workers Specifics
- Uses `@astrojs/cloudflare` adapter
- Platform proxy enabled for development
- Cloudflare image service integration
- Node.js compatibility flag enabled

### React 19 Compatibility
- Edge runtime requirements for Cloudflare Workers
- Vite SSR external configuration for `node:async_hooks`
- Optimized dependencies include React packages

### Component Patterns
- React components use TypeScript with proper interfaces
- Astro components for layouts and pages
- Utility-first CSS with component composition
- Inline SVG icons to avoid external dependencies