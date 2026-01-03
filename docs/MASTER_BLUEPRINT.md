# Master Blueprint: Astro + WordPress + Cloudflare Workers

> **The Definitive AI-Ready Guide for Building High-Performance, Ad-Monetized Web Applications**
> *Version 1.0 | Generic Template for Future Projects*
> 
> **Feed this document to any AI agent to automatically scaffold and deploy a complete, production-ready website.**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Project Structure](#4-project-structure)
5. [Initial Project Setup](#5-initial-project-setup)
6. [Configuration Files](#6-configuration-files)
7. [WordPress Backend Setup](#7-wordpress-backend-setup)
8. [WordPress Integration (Headless CMS)](#8-wordpress-integration-headless-cms)
9. [Ad Monetization Setup](#9-ad-monetization-setup)
10. [Interactive Components](#10-interactive-components)
11. [SEO Implementation](#11-seo-implementation)
12. [Deployment Guide](#12-deployment-guide)
13. [Common Issues & Fixes](#13-common-issues--fixes)
14. [Development Guidelines](#14-development-guidelines)
15. [Variable Reference](#15-variable-reference)
16. [Replication Checklist](#16-replication-checklist)

---

## 1. Executive Summary

This blueprint defines a **production-ready architecture** for building content sites with:
- **Frontend**: Astro 5.x (SSR/SSG) with React 19 for interactive components
- **Backend**: WordPress as a headless CMS (GraphQL API)
- **Hosting**: Cloudflare Workers (Edge deployment)
- **Monetization**: Grow.me/Journey ads, Google AdSense, or any ad network
- **Styling**: Tailwind CSS 4.x

### Core Principles

| Principle | Implementation |
|-----------|----------------|
| **Speed First** | Edge deployment, SSR, intelligent caching |
| **Premium Design** | Dark themes, glassmorphism, micro-animations |
| **Type Safety** | TypeScript everywhere |
| **Edge-Native** | No Node.js runtime in production |
| **SEO Optimized** | Structured data, meta tags, semantic HTML |
| **Ad-Ready** | Built-in ad slot components and configurations |

---

## 2. Technology Stack

### Core Frameworks

| Technology | Version | Purpose |
|------------|---------|---------|
| **Astro** | 5.x | Web framework (SSR/SSG, file-based routing) |
| **React** | 19.x | Interactive islands (quizzes, tools, forms) |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first styling |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **Cloudflare Workers** | Edge hosting (global, sub-50ms TTFB) |
| **Cloudflare KV** | Edge caching for API responses |
| **WordPress + WPGraphQL** | Headless CMS backend |
| **Coolify** (Optional) | Self-hosted WordPress on VPS |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Wrangler** | Cloudflare CLI for dev/deploy |
| **npm** | Package management |
| **Vite** | Build tool (via Astro) |

---

## 3. Architecture Overview

```
                                    ┌─────────────────────────────────────┐
                                    │           User's Browser            │
                                    └──────────────────┬──────────────────┘
                                                       │
                                                       ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              CLOUDFLARE NETWORK (CDN + Edge)                         │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│   ┌────────────────────────────┐         ┌────────────────────────────┐             │
│   │     yourdomain.com         │         │   wp.yourdomain.com        │             │
│   │   (Cloudflare Worker)      │         │   (Proxied to Origin)      │             │
│   │                            │         │                            │             │
│   │  ┌──────────────────────┐  │         │  Routes to WordPress       │             │
│   │  │    Astro SSR App     │  │         │  backend server            │             │
│   │  │  • React Islands     │  │◄───────►│                            │             │
│   │  │  • Static Assets     │  │ GraphQL │                            │             │
│   │  │  • Ad Components     │  │         │                            │             │
│   │  └──────────────────────┘  │         └────────────────────────────┘             │
│   │                            │                      │                              │
│   │  ┌──────────────────────┐  │                      │                              │
│   │  │  Cloudflare KV       │  │                      ▼                              │
│   │  │  (Cache Layer)       │  │         ┌────────────────────────────┐             │
│   │  └──────────────────────┘  │         │    WordPress Server        │             │
│   └────────────────────────────┘         │    (Coolify/VPS)           │             │
│                                          │  • WPGraphQL Plugin        │             │
│                                          │  • Media Library           │             │
│                                          │  • Content Management      │             │
│                                          └────────────────────────────┘             │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Domain Strategy

| Domain | Role | Points To |
|--------|------|-----------|
| `yourdomain.com` | **Frontend** | Cloudflare Worker |
| `www.yourdomain.com` | **Alias** | Cloudflare Worker (redirect/alias) |
| `wp.yourdomain.com` | **Backend** | WordPress server (A record, proxied) |

---

## 4. Project Structure

```
project-root/
├── .env                          # Local environment variables
├── .env.example                  # Environment template (commit this)
├── astro.config.mjs              # Astro configuration
├── wrangler.toml                 # Cloudflare Worker configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
│
├── docs/                         # Project documentation
│   ├── MASTER_BLUEPRINT.md       # This file
│   └── [other-docs].md
│
├── public/                       # Static assets
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/
│
└── src/
    ├── components/
    │   ├── ads/                  # Ad slot components
    │   │   ├── AdSlot.astro
    │   │   ├── AdSlot.tsx
    │   │   └── index.ts
    │   │
    │   ├── layouts/              # Page layouts
    │   │   ├── BaseLayout.astro  # Main layout (includes ads scripts)
    │   │   ├── ContentLayout.astro
    │   │   └── ToolLayout.astro
    │   │
    │   ├── ui/                   # Reusable UI components
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   └── index.ts
    │   │
    │   └── tools/                # Interactive components (React islands)
    │       └── [ToolName].tsx
    │
    ├── data/                     # Static data (quiz questions, etc.)
    │   └── [data-files].ts
    │
    ├── lib/                      # Utilities and API clients
    │   ├── utils.ts              # General utilities
    │   ├── share-utils.ts        # Social sharing helpers
    │   │
    │   └── wordpress/            # WordPress integration
    │       ├── index.ts          # Main exports
    │       ├── api.ts            # High-level API
    │       ├── client.ts         # GraphQL client
    │       ├── queries.ts        # GraphQL queries
    │       ├── types.ts          # TypeScript types
    │       ├── utils.ts          # WP-specific utilities
    │       └── config.ts         # Configuration
    │
    ├── pages/                    # File-based routing
    │   ├── index.astro           # Homepage
    │   ├── about.astro
    │   ├── ads.txt.ts            # Dynamic ads.txt endpoint
    │   │
    │   ├── blog/                 # Blog pages (from WordPress)
    │   │   ├── index.astro
    │   │   └── [slug].astro
    │   │
    │   └── tools/                # Interactive tools/quizzes
    │       ├── index.astro
    │       └── [tool-name].astro
    │
    └── styles/
        └── global.css            # Global styles (Tailwind imports)
```

---

## 5. Initial Project Setup

### Step 1: Create Astro Project

```bash
# Create new Astro project
npm create astro@latest my-project
# Select: Empty project, TypeScript: Strict

cd my-project
```

### Step 2: Install Dependencies

```bash
# Core integrations
npx astro add react
npx astro add cloudflare

# Tailwind CSS 4
npm install tailwindcss @tailwindcss/vite

# Additional UI dependencies
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-progress
npm install class-variance-authority clsx tailwind-merge

# Dev dependencies
npm install -D wrangler
```

### Step 3: Configure Tailwind

Create/update `src/styles/global.css`:

```css
@import "tailwindcss";

/* Custom CSS Variables */
:root {
  --color-primary: #8b5cf6;
  --color-primary-hover: #7c3aed;
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f1f5f9;
  --color-text-muted: #94a3b8;
}

/* Global Styles */
html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
```

---

## 6. Configuration Files

### `astro.config.mjs`

```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // CRITICAL: Must be 'server' for Cloudflare Workers SSR
  output: 'server',
  
  // Your production domain
  site: 'https://yourdomain.com',
  
  // Cloudflare adapter
  adapter: cloudflare({
    platformProxy: { enabled: true }, // Simulates CF environment locally
    imageService: 'cloudflare',
  }),
  
  integrations: [react()],
  
  vite: {
    plugins: [tailwindcss()],
    ssr: { external: ['node:async_hooks'] },
    resolve: {
      // Required for React 19 on Cloudflare Workers
      alias: process.env.NODE_ENV === 'production' ? {
        'react-dom/server': 'react-dom/server.edge'
      } : {},
      // Prevent duplicate React instances
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  }
});
```

### `wrangler.toml`

```toml
# Worker name (used for workers.dev subdomain)
name = "your-project-name"

# Entry point (Astro generates this)
main = "./dist/_worker.js/index.js"

# Compatibility settings
compatibility_date = "2024-12-01"
compatibility_flags = ["nodejs_compat"]  # Required for many npm packages

# Static assets configuration
[assets]
directory = "./dist"
binding = "ASSETS"

# Primary domain routes
[[routes]]
pattern = "yourdomain.com"
custom_domain = true
zone_name = "yourdomain.com"

[[routes]]
pattern = "www.yourdomain.com"
custom_domain = true
zone_name = "yourdomain.com"

# Environment variables
[vars]
ENVIRONMENT = "production"
WORDPRESS_GRAPHQL_URL = "https://wp.yourdomain.com/graphql"

# Optional: KV namespace for caching
# Create with: wrangler kv:namespace create "CACHE"
# [[kv_namespaces]]
# binding = "CACHE"
# id = "your-kv-namespace-id"
```

### `package.json` (Scripts)

```json
{
  "name": "your-project",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "wrangler dev",
    "deploy": "wrangler deploy",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^12.x",
    "@astrojs/react": "^4.x",
    "@tailwindcss/vite": "^4.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "astro": "^5.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "tailwindcss": "^4.x"
  },
  "devDependencies": {
    "wrangler": "^4.x"
  }
}
```

### `.env.example`

```bash
# Cloudflare Credentials
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_ACCOUNT_ID=your_account_id

# WordPress Configuration
WORDPRESS_GRAPHQL_URL=https://wp.yourdomain.com/graphql

# Ad Configuration
AD_SITE_UUID=your-site-uuid
AD_FAVES_SITE_ID=your-base64-encoded-site-id

# Environment
NODE_ENV=development
```

---

## 7. WordPress Backend Setup

### Hosting Options

| Option | Best For | Notes |
|--------|----------|-------|
| **Coolify** | Self-hosted, cost-effective | VPS required (e.g., Hetzner) |
| **WP Engine** | Managed, enterprise | Premium pricing |
| **Cloudways** | Managed VPS | Good balance |
| **WordPress.com** | Simple sites | Limited GraphQL support |

### Required WordPress Setup

1. **Install WordPress** on your hosting platform

2. **Install Required Plugins**:
   - **WPGraphQL** (Required) - Provides GraphQL API
   - **WPGraphQL for ACF** (Optional) - Custom Fields support
   - **Yoast SEO + WPGraphQL SEO** (Optional) - SEO metadata

3. **Configure WordPress Domain**:
   ```
   # In wp-config.php or via admin panel
   WP_HOME=https://wp.yourdomain.com
   WP_SITEURL=https://wp.yourdomain.com
   ```

4. **Cloudflare DNS Configuration**:
   ```
   Type: A
   Name: wp
   Content: <Your-Server-IP>
   Proxy: ON (Orange Cloud)
   ```

5. **SSL Configuration**:
   - Set Cloudflare SSL mode to **Full** (not Full Strict)
   - This allows Cloudflare to handle SSL termination

### Verify GraphQL Endpoint

```bash
# Test the endpoint
curl -X POST https://wp.yourdomain.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ generalSettings { title } }"}'
```

---

## 8. WordPress Integration (Headless CMS)

### WordPress API Client

Create `src/lib/wordpress/client.ts`:

```typescript
/**
 * WordPress GraphQL Client
 * Handles fetching with caching for Cloudflare Workers
 */

import { CACHE_TTL, FEATURES } from './config';

// In-memory cache for local dev
const memoryCache = new Map<string, { data: unknown; expires: number }>();

interface FetchOptions {
  ttl?: number;
  skipCache?: boolean;
}

export async function wpFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: FetchOptions = {},
  kvStore?: KVNamespace
): Promise<T> {
  const { ttl = CACHE_TTL.DEFAULT, skipCache = false } = options;
  
  // Generate cache key
  const cacheKey = `wp:${hashString(query + JSON.stringify(variables))}`;
  
  // Try cache first (if enabled)
  if (!skipCache && FEATURES.USE_CACHE) {
    const cached = await getCached<T>(cacheKey, kvStore);
    if (cached) return cached;
  }
  
  // Fetch from WordPress
  const endpoint = import.meta.env.WORDPRESS_GRAPHQL_URL || 
                   'https://wp.yourdomain.com/graphql';
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  
  if (!response.ok) {
    throw new Error(`GraphQL Error: ${response.status}`);
  }
  
  const json = await response.json();
  
  if (json.errors) {
    console.error('GraphQL Errors:', json.errors);
    throw new Error(json.errors[0]?.message || 'GraphQL Error');
  }
  
  // Cache the result
  if (FEATURES.USE_CACHE) {
    await setCache(cacheKey, json.data, ttl, kvStore);
  }
  
  return json.data as T;
}

// Helper functions
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

async function getCached<T>(
  key: string, 
  kv?: KVNamespace
): Promise<T | null> {
  // Try KV first (edge cache)
  if (kv) {
    const cached = await kv.get(key, 'json');
    if (cached) return cached as T;
  }
  
  // Fallback to memory cache
  const entry = memoryCache.get(key);
  if (entry && entry.expires > Date.now()) {
    return entry.data as T;
  }
  
  return null;
}

async function setCache(
  key: string,
  data: unknown,
  ttl: number,
  kv?: KVNamespace
): Promise<void> {
  // Store in KV
  if (kv) {
    await kv.put(key, JSON.stringify(data), { expirationTtl: ttl });
  }
  
  // Also store in memory
  memoryCache.set(key, {
    data,
    expires: Date.now() + (ttl * 1000),
  });
}
```

### WordPress API Service

Create `src/lib/wordpress/api.ts`:

```typescript
/**
 * WordPress API Service
 * High-level methods for fetching content
 */

import { wpFetch } from './client';
import { QUERIES } from './queries';
import type { WPPost, WPPage, WPCategory } from './types';

export class WordPressAPI {
  private kv?: KVNamespace;
  
  constructor(kvStore?: KVNamespace) {
    this.kv = kvStore;
  }
  
  async getPosts(options: {
    first?: number;
    after?: string;
    categorySlug?: string;
  } = {}): Promise<{
    posts: WPPost[];
    hasNextPage: boolean;
    endCursor: string | null;
  }> {
    const { first = 10, after, categorySlug } = options;
    
    const data = await wpFetch<{ posts: { nodes: WPPost[]; pageInfo: any } }>(
      QUERIES.POSTS,
      { first, after, categorySlug },
      { ttl: 300 },
      this.kv
    );
    
    return {
      posts: data.posts.nodes,
      hasNextPage: data.posts.pageInfo.hasNextPage,
      endCursor: data.posts.pageInfo.endCursor,
    };
  }
  
  async getPostBySlug(slug: string): Promise<WPPost | null> {
    const data = await wpFetch<{ post: WPPost | null }>(
      QUERIES.POST_BY_SLUG,
      { slug },
      { ttl: 600 },
      this.kv
    );
    
    return data.post;
  }
  
  async getRecentPosts(count: number = 5): Promise<WPPost[]> {
    const { posts } = await this.getPosts({ first: count });
    return posts;
  }
}

// Default instance for simple usage
export const wpAPI = new WordPressAPI();

// Factory for instances with KV
export function createWordPressAPI(kv?: KVNamespace): WordPressAPI {
  return new WordPressAPI(kv);
}
```

### GraphQL Queries

Create `src/lib/wordpress/queries.ts`:

```typescript
/**
 * WordPress GraphQL Queries
 */

export const QUERIES = {
  POSTS: `
    query GetPosts($first: Int!, $after: String, $categorySlug: String) {
      posts(
        first: $first
        after: $after
        where: { categoryName: $categorySlug, status: PUBLISH }
      ) {
        nodes {
          id
          databaseId
          slug
          title
          excerpt
          date
          modified
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `,
  
  POST_BY_SLUG: `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        databaseId
        slug
        title
        content
        excerpt
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        author {
          node {
            name
            description
            avatar {
              url
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        seo {
          title
          metaDesc
          opengraphImage {
            sourceUrl
          }
        }
      }
    }
  `,
};
```

---

## 9. Ad Monetization Setup

### Supported Ad Networks

| Network | Implementation | Best For |
|---------|---------------|----------|
| **Grow.me/Journey** | Script + slot injection | Publishers, high RPM |
| **Google AdSense** | Script + responsive ads | General sites |
| **Mediavine** | Requires traffic minimum | Premium publishers |
| **Ezoic** | AI-based placement | Traffic optimization |

### Base Layout with Ad Scripts

Create `src/components/layouts/BaseLayout.astro`:

```astro
---
/**
 * Base Layout
 * Includes ad monetization scripts and global structure
 */

import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

const { 
  title, 
  description, 
  keywords = [], 
  ogImage = '/images/og-default.png',
  canonical
} = Astro.props;

const siteUrl = import.meta.env.SITE || 'https://yourdomain.com';
const canonicalUrl = canonical || new URL(Astro.url.pathname, siteUrl).href;

// Ad configuration - REPLACE WITH YOUR VALUES
const AD_SITE_UUID = 'your-site-uuid-here';
const AD_FAVES_SITE_ID = 'your-base64-encoded-site-id-here';
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Primary Meta Tags -->
    <title>{title} | YourSiteName</title>
    <meta name="title" content={`${title} | YourSiteName`} />
    <meta name="description" content={description} />
    {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
    <link rel="canonical" href={canonicalUrl} />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:title" content={`${title} | YourSiteName`} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={`${siteUrl}${ogImage}`} />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={canonicalUrl} />
    <meta name="twitter:title" content={`${title} | YourSiteName`} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    
    <!-- ============================================= -->
    <!-- AD MONETIZATION SCRIPTS                       -->
    <!-- ============================================= -->
    
    <!-- Option 1: Grow.me/Journey Ads -->
    <script data-grow-initializer="">
      !(function(){window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));var e=document.createElement("script");(e.type="text/javascript"),(e.src="https://faves.grow.me/main.js"),(e.defer=!0),e.setAttribute("data-grow-faves-site-id","{AD_FAVES_SITE_ID}");var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();
    </script>
    
    <script 
      type="text/javascript" 
      async 
      fetchpriority="high"
      data-noptimize="1" 
      data-cfasync="false" 
      src={`//scripts.scriptwrapper.com/tags/${AD_SITE_UUID}.js`}
    ></script>
    
    <!-- Option 2: Google AdSense (alternative) -->
    <!--
    <script 
      async 
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
      crossorigin="anonymous"
    ></script>
    -->
    
  </head>
  
  <!-- IMPORTANT: grow-content-body class required for ad targeting -->
  <body class="grow-content-body">
    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-container">
        <a href="/" class="nav-logo">YourSiteName</a>
        <ul class="nav-links">
          <li><a href="/tools" class="nav-link">Tools</a></li>
          <li><a href="/blog" class="nav-link">Blog</a></li>
          <li><a href="/about" class="nav-link">About</a></li>
        </ul>
      </div>
    </nav>

    <!-- IMPORTANT: grow-content-main class required for ad targeting -->
    <main class="grow-content-main">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <!-- Footer content -->
      </div>
      <div class="footer-bottom">
        <p>&copy; {new Date().getFullYear()} YourSiteName. All rights reserved.</p>
      </div>
    </footer>
  </body>
</html>
```

### Ad Slot Component (Astro)

Create `src/components/ads/AdSlot.astro`:

```astro
---
/**
 * AdSlot Component
 * Using official Grow.me/Journey markup
 */

interface Props {
  type?: 'sidebar' | 'banner' | 'rectangle' | 'leaderboard' | 'in-content';
  position?: 'top' | 'middle' | 'bottom' | 'left' | 'right';
  className?: string;
  sticky?: boolean;
  slotId?: string;
}

const { 
  type = 'rectangle', 
  position = 'middle',
  className = '',
  sticky = false,
  slotId = `ad-${type}-${position}`
} = Astro.props;

const sizeConfig = {
  sidebar: { width: '300px', minHeight: '600px' },
  banner: { width: '100%', minHeight: '90px' },
  rectangle: { width: '300px', minHeight: '250px' },
  leaderboard: { width: '100%', minHeight: '90px' },
  'in-content': { width: '100%', minHeight: '280px' }
};

const config = sizeConfig[type];
const slotType = type === 'sidebar' ? 'sidebar' : 'content';
---

<div 
  id={slotId}
  class:list={[
    'ad-slot',
    `ad-slot--${type}`,
    { 'ad-slot--sticky': sticky },
    'grow-content-main',
    className
  ]}
  style={`min-height: ${config.minHeight}; width: ${config.width};`}
>
  <!-- Journey/Mediavine Ad Slot - Official markup -->
  <div class="mv-ad-wrapper">
    <div 
      class="mv_slot_target" 
      data-slot={slotType}
      data-placement={`${slotId}`}
    ></div>
  </div>
  
  <div class="ad-slot-label">Advertisement</div>
</div>

<style>
  .ad-slot {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    overflow: hidden;
    margin: 1rem 0;
  }
  
  .ad-slot--sidebar.ad-slot--sticky {
    position: sticky;
    top: 100px;
  }
  
  .mv-ad-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
  
  .ad-slot-label {
    padding: 0.25rem 0.5rem;
    text-align: center;
    color: #666;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.6;
  }
  
  /* Hide sidebar ads on mobile */
  @media (max-width: 1023px) {
    .ad-slot--sidebar {
      display: none;
    }
  }
</style>
```

### Ad Slot Component (React)

Create `src/components/ads/AdSlot.tsx`:

```tsx
/**
 * React Ad Slot Component
 * For use in interactive components
 */

import React from 'react';

type AdType = 'sidebar' | 'banner' | 'rectangle' | 'leaderboard' | 'in-content';
type AdPosition = 'top' | 'middle' | 'bottom' | 'left' | 'right';

interface AdSlotProps {
  type?: AdType;
  position?: AdPosition;
  className?: string;
  showLabel?: boolean;
}

const sizeConfig: Record<AdType, { minHeight: string; width: string }> = {
  sidebar: { width: '300px', minHeight: '600px' },
  banner: { width: '100%', minHeight: '90px' },
  rectangle: { width: '300px', minHeight: '250px' },
  leaderboard: { width: '100%', minHeight: '90px' },
  'in-content': { width: '100%', minHeight: '280px' }
};

export function AdSlot({
  type = 'rectangle',
  position = 'middle',
  className = '',
  showLabel = true
}: AdSlotProps) {
  const config = sizeConfig[type];
  const slotId = `ad-react-${type}-${position}`;
  const slotType = type === 'sidebar' ? 'sidebar' : 'content';

  return (
    <div
      id={slotId}
      className={`ad-slot-container grow-content-main ${className}`}
      style={{ minHeight: config.minHeight }}
    >
      <div className="mv-ad-wrapper">
        <div 
          className="mv_slot_target"
          data-slot={slotType}
          data-placement={slotId}
        />
      </div>
      {showLabel && (
        <div className="ad-slot-label">Advertisement</div>
      )}
    </div>
  );
}

// Convenience component for in-content ads
export function InContentAd({ className = '' }: { className?: string }) {
  return <AdSlot type="in-content" position="middle" className={className} />;
}

export default AdSlot;
```

### Dynamic ads.txt Endpoint

Create `src/pages/ads.txt.ts`:

```typescript
/**
 * Dynamic ads.txt Endpoint
 * Fetches from ad provider to stay in sync
 */

import type { APIRoute } from 'astro';

// REPLACE WITH YOUR AD PROVIDER'S UUID
const AD_SITE_UUID = 'your-site-uuid-here';

export const GET: APIRoute = async () => {
  try {
    // Fetch from Journey/Mediavine
    const response = await fetch(
      `https://adstxt.journeymv.com/sites/${AD_SITE_UUID}/ads.txt`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ads.txt: ${response.status}`);
    }
    
    const content = await response.text();

    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Failed to fetch ads.txt:', error);
    
    // Return empty ads.txt on error
    return new Response('', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
```

### Layout with Sidebar Ads

Create `src/components/layouts/ContentLayout.astro`:

```astro
---
/**
 * Content Layout with Sidebar Ads
 * For blog posts, tools, and content pages
 */

import BaseLayout from './BaseLayout.astro';
import AdSlot from '../ads/AdSlot.astro';

interface Props {
  title: string;
  description: string;
  showSidebarAds?: boolean;
}

const { title, description, showSidebarAds = true } = Astro.props;
---

<BaseLayout title={title} description={description}>
  <div class="page-wrapper">
    <!-- Left Sidebar Ad (Desktop Only) -->
    {showSidebarAds && (
      <aside class="sidebar sidebar--left">
        <div class="sidebar-sticky">
          <AdSlot type="sidebar" position="left" sticky={true} />
        </div>
      </aside>
    )}
    
    <!-- Main Content -->
    <div class="main-content">
      <slot />
    </div>
    
    <!-- Right Sidebar Ad (Desktop Only) -->
    {showSidebarAds && (
      <aside class="sidebar sidebar--right">
        <div class="sidebar-sticky">
          <AdSlot type="sidebar" position="right" sticky={true} />
        </div>
      </aside>
    )}
  </div>
</BaseLayout>

<style>
  .page-wrapper {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .sidebar {
    display: none;
    flex-shrink: 0;
    width: 300px;
  }
  
  .sidebar-sticky {
    position: sticky;
    top: 100px;
  }
  
  .main-content {
    flex: 1;
    max-width: 800px;
    min-width: 0;
  }
  
  /* Show sidebars on screens 1024px+ */
  @media (min-width: 1024px) {
    .sidebar {
      display: block;
    }
  }
</style>
```

---

## 10. Interactive Components

### Component Architecture

Interactive tools/quizzes use React "islands" mounted in Astro pages:

```astro
---
// src/pages/tools/my-tool.astro
import ContentLayout from '../../components/layouts/ContentLayout.astro';
import MyTool from '../../components/tools/MyTool.tsx';
---

<ContentLayout title="My Tool" description="Description of my tool">
  <div class="container">
    <h1>My Interactive Tool</h1>
    
    <!-- React island with client-side hydration -->
    <MyTool client:load />
  </div>
</ContentLayout>
```

### Sample Tool Component

```tsx
// src/components/tools/MyTool.tsx
import React, { useState } from 'react';
import { InContentAd } from '../ads/AdSlot';

export default function MyTool() {
  const [result, setResult] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const handleSubmit = () => {
    // Process and show result
    setResult('Your result here');
  };

  return (
    <div className="tool-container">
      {!result ? (
        <div className="tool-form">
          {/* Tool inputs/questions */}
          <button onClick={handleSubmit}>
            Get Result
          </button>
          
          {/* Show ad mid-flow on mobile */}
          {step > 0 && step % 5 === 0 && (
            <div className="lg:hidden my-6">
              <InContentAd />
            </div>
          )}
        </div>
      ) : (
        <div className="tool-results">
          <h2>Your Result</h2>
          <p>{result}</p>
          
          {/* In-content ad in results */}
          <div className="my-6">
            <InContentAd />
          </div>
          
          {/* Social sharing */}
          <div className="share-buttons">
            {/* Add sharing buttons */}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 11. SEO Implementation

### Essential Meta Tags

Every page must include:

```astro
---
// In your layout or page
const seoData = {
  title: "Page Title",
  description: "Compelling 150-160 character description",
  keywords: ["keyword1", "keyword2"],
  ogImage: "/images/og-image.png",
  canonical: "https://yourdomain.com/page"
};
---

<head>
  <title>{seoData.title}</title>
  <meta name="description" content={seoData.description} />
  <meta name="keywords" content={seoData.keywords.join(', ')} />
  <link rel="canonical" href={seoData.canonical} />
  
  <!-- Open Graph -->
  <meta property="og:title" content={seoData.title} />
  <meta property="og:description" content={seoData.description} />
  <meta property="og:image" content={seoData.ogImage} />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={seoData.title} />
</head>
```

### Structured Data (Schema.org)

Add to relevant pages:

```astro
<!-- Article Schema -->
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "author": {
    "@type": "Organization",
    "name": "YourSiteName"
  },
  "publisher": {
    "@type": "Organization",
    "name": "YourSiteName"
  },
  "datePublished": publishDate,
  "dateModified": modifiedDate
})} />

<!-- Tool/Application Schema -->
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": toolName,
  "description": toolDescription,
  "applicationCategory": "Utility"
})} />
```

### robots.txt

Create `public/robots.txt`:

```
User-agent: *
Allow: /

# Sitemap
Sitemap: https://yourdomain.com/sitemap.xml

# Block admin/private areas (if any)
Disallow: /api/
```

---

## 12. Deployment Guide

### Prerequisites

1. **Cloudflare Account** with Workers enabled
2. **Wrangler CLI** installed: `npm install -D wrangler`
3. **API Token** with permissions:
   - `Zone:DNS:Edit`
   - `Zone:Zone:Read`
   - `Account:Workers Scripts:Edit`

### Login to Cloudflare

```bash
npx wrangler login
```

### First-Time Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Check the build output**:
   ```
   dist/
   ├── _worker.js/        # Worker bundle
   │   └── index.js       # Entry point
   └── [static assets]    # CSS, JS, images
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   # or: npx wrangler deploy
   ```

4. **Configure Custom Domain** (first time):
   - Worker should claim the domain automatically via `wrangler.toml`
   - If not, add routes manually in Cloudflare dashboard

### DNS Configuration

For custom domains to work:

1. **Remove any existing A/CNAME records** for `yourdomain.com` and `www`
2. Let the Worker claim these via deployment
3. For `wp.yourdomain.com`:
   ```
   Type: A
   Name: wp
   Content: <WordPress-Server-IP>
   Proxy: ON
   ```

### Deployment Commands

```bash
# Development
npm run dev           # Local dev server (Astro)
npm run preview       # Local Worker simulation (Wrangler)

# Production
npm run build         # Build for production
npm run deploy        # Deploy to Cloudflare Workers
```

---

## 13. Common Issues & Fixes

### Build/Deploy Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `crypto is not defined` | Missing compat flag | Add `nodejs_compat` to `wrangler.toml` |
| `react-dom/server` error | React 19 SSR | Add alias in `astro.config.mjs` |
| `Invalid hook call` | Duplicate React | Add `dedupe: ['react', 'react-dom']` |
| Assets 404 | Wrong assets path | Verify `[assets]` in `wrangler.toml` |

### WordPress Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| GraphQL 404 | Plugin not active | Install/activate WPGraphQL |
| SSL errors on `wp.` | Wrong SSL mode | Set Cloudflare to "Full" (not Strict) |
| HTTP 526 | Self-signed cert | Enable Cloudflare proxy (orange cloud) |
| Too many redirects | Mixed SSL settings | Check WP_HOME matches https:// |

### Ad Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Ads not showing | Site not approved | Check ad network dashboard |
| Sidebar empty on mobile | CSS hiding them | Use in-content ads for mobile |
| Script blocked | Optimizer interference | Add `data-noptimize="1"` |
| ads.txt error | Dynamic fetch failing | Check UUID and endpoint |

---

## 14. Development Guidelines

### Code Standards

#### Do ✅
- Use TypeScript for all logic
- Use Astro components for static content
- Use React islands for interactivity
- Use Tailwind for styling
- Add SEO tags to every page
- Include `client:load` for above-fold React
- Use `client:visible` for below-fold React

#### Don't ❌
- Use `any` type
- Leave console.logs in production
- Use CSS-in-JS libraries
- Import Node.js modules in client code
- Suggest Vercel/Netlify tooling
- Create multiple React roots

### Design Standards

Apply "premium" aesthetics:

```css
/* Use slate, not pure black */
background: theme('colors.slate.900');

/* Subtle gradients */
background: linear-gradient(to bottom, theme('colors.slate.800'), theme('colors.slate.900'));

/* Glassmorphism */
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);

/* Always add hover states */
transition: all 0.2s ease;

/* Subtle animations */
animation: fadeIn 0.3s ease;
```

---

## 15. Variable Reference

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CLOUDFLARE_API_TOKEN` | Deploy auth | `abc123...` |
| `CLOUDFLARE_ACCOUNT_ID` | Account identifier | `abc123...` |
| `WORDPRESS_GRAPHQL_URL` | WP API endpoint | `https://wp.domain.com/graphql` |
| `AD_SITE_UUID` | Ad network site ID | `cd1147c1-3ea2-...` |
| `AD_FAVES_SITE_ID` | Base64 site ID | `U2l0ZTpjZDEx...` |

### Configuration Constants

| Constant | File | Purpose |
|----------|------|---------|
| `output: 'server'` | astro.config.mjs | Enable SSR |
| `nodejs_compat` | wrangler.toml | Node.js polyfills |
| `main = "./dist/_worker.js/index.js"` | wrangler.toml | Worker entry |
| `directory = "./dist"` | wrangler.toml | Static assets |

---

## 16. Replication Checklist

When starting a new project with this stack:

### Initial Setup
- [ ] Create Astro project with TypeScript
- [ ] Install dependencies (react, cloudflare, tailwind)
- [ ] Copy and customize `astro.config.mjs`
- [ ] Copy and customize `wrangler.toml`
- [ ] Create `.env` with credentials
- [ ] Set up global styles

### WordPress Backend
- [ ] Deploy WordPress (Coolify/hosting)
- [ ] Install WPGraphQL plugin
- [ ] Configure `wp.` subdomain in DNS
- [ ] Set `WP_HOME` and `WP_SITEURL`
- [ ] Test GraphQL endpoint
- [ ] Set Cloudflare SSL to "Full"

### Frontend Development
- [ ] Create BaseLayout with ad scripts
- [ ] Create AdSlot components (Astro + React)
- [ ] Create ContentLayout with sidebars
- [ ] Implement WordPress API client
- [ ] Create blog pages
- [ ] Create tool/quiz pages
- [ ] Add SEO meta tags
- [ ] Add structured data

### Ad Monetization
- [ ] Apply for ad network (Grow.me, AdSense)
- [ ] Get Site UUID and Faves Site ID
- [ ] Add scripts to BaseLayout
- [ ] Create `ads.txt.ts` endpoint
- [ ] Add ad slots to layouts
- [ ] Test on production domain

### Deployment
- [ ] Login with `wrangler login`
- [ ] Configure DNS (remove old records)
- [ ] Run `npm run build`
- [ ] Run `npm run deploy`
- [ ] Verify custom domain works
- [ ] Verify GraphQL fetching works
- [ ] Verify ads are loading
- [ ] Test mobile/desktop responsive ads

---

## Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-03 | Initial comprehensive blueprint |

---

**End of Master Blueprint**

> *This document is designed to be fed directly to an AI agent for autonomous project scaffolding. All configurations, code samples, and guidelines represent production-ready patterns tested on live sites.*
