# PairDish Frontend

A Next.js frontend application for PairDish - a platform to discover perfect side dishes and pairings for any meal.

## Features

- **Dynamic Routing**: App Router with dynamic routes for dishes and recipes
- **TypeScript**: Full type safety throughout the application
- **SEO Optimized**: Dynamic meta tags and structured data for all pages
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **API Integration**: Seamless integration with Cloudflare Worker backend

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── what-to-serve-with/
│   │   │   └── [dish]/         # Dynamic dish pages
│   │   ├── recipe/
│   │   │   └── [slug]/         # Dynamic recipe pages
│   │   └── search/             # Search functionality
│   ├── components/             # React components
│   ├── lib/                    # Utilities and API client
│   ├── types/                  # TypeScript types
│   └── hooks/                  # Custom React hooks
├── public/                     # Static assets
└── package.json
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=PairDish
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## API Integration

The frontend connects to the Cloudflare Worker API through the `lib/api.ts` client. All API calls are typed and handle errors gracefully.

## Deployment

This application can be deployed to Vercel, Netlify, or any platform that supports Next.js applications.

For production deployment:
1. Update the environment variables with production URLs
2. Build the application: `npm run build`
3. Deploy the `.next` folder to your hosting platform