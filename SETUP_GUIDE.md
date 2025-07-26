# PairDish Complete Setup Guide

## Quick Start

To get PairDish running locally, you need to:
1. Set up the Cloudflare Worker backend
2. Set up the Next.js frontend
3. Import some initial data

## Backend Setup (Cloudflare Worker)

### 1. Install Dependencies
```bash
cd pairdish
npm install
```

### 2. Database Setup
The D1 database has already been created. To set up the schema locally:

```bash
# Apply schema to local database
npx wrangler d1 execute pairdish-db --local --file=./schema.sql

# To apply to remote database (when ready for production)
npx wrangler d1 execute pairdish-db --remote --file=./schema.sql
```

### 3. Start the Worker Locally
```bash
npm run dev
```

The Worker will be available at `http://localhost:8787`

## Frontend Setup (Next.js)

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8787" > .env.local
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" >> .env.local
```

### 4. Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Data Import

### Option 1: Manual Import via API
You can manually import dish data using the API:

```bash
curl -X POST http://localhost:8787/api/import-dishes \
  -H "Content-Type: application/json" \
  -d '{
    "main_dish": {
      "name": "Chicken Biryani",
      "slug": "chicken-biryani",
      "description": "Aromatic rice dish with spiced chicken",
      "dish_type": "main",
      "cuisine": "Indian",
      "seo_title": "What to Serve with Chicken Biryani - 15 Best Side Dishes",
      "seo_description": "Discover the perfect side dishes for chicken biryani",
      "keywords": ["chicken biryani sides", "what to serve with biryani"]
    },
    "side_dishes": [
      {
        "name": "Cucumber Raita",
        "slug": "cucumber-raita",
        "description": "Cooling yogurt side dish with cucumber",
        "dish_type": "side",
        "cuisine": "Indian",
        "recipe": {
          "ingredients": ["1 cup yogurt", "1 cucumber, diced", "Salt to taste"],
          "instructions": ["Mix yogurt and cucumber", "Add salt", "Chill and serve"],
          "prep_time": 10,
          "cook_time": 0,
          "servings": 4,
          "difficulty": "easy"
        }
      },
      {
        "name": "Garlic Naan",
        "slug": "garlic-naan",
        "description": "Soft flatbread with garlic",
        "dish_type": "side",
        "cuisine": "Indian"
      }
    ]
  }'
```

### Option 2: Python Scraper with Apify
If you have an Apify subscription:

```bash
cd scraper

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your Apify token
# Then run the scraper
python simple_scraper.py
```

## Testing the Setup

### 1. Test the API
```bash
# Get all dishes
curl http://localhost:8787/api/dishes

# Get pairings for a dish
curl http://localhost:8787/api/pairings/chicken-biryani

# Search dishes
curl "http://localhost:8787/api/search?q=chicken"
```

### 2. Test the Frontend
- Open http://localhost:3000
- Try searching for dishes
- Navigate to `/what-to-serve-with/chicken-biryani`

## Production Deployment

### Deploy the Worker
```bash
# From the pairdish directory
npm run deploy
```

Note the deployed URL (e.g., `https://pairdish.your-account.workers.dev`)

### Update Frontend for Production
```bash
# Update frontend/.env.local
NEXT_PUBLIC_API_URL=https://pairdish.your-account.workers.dev
NEXT_PUBLIC_SITE_URL=https://www.pairdish.com

# Build and deploy to your hosting platform
cd frontend
npm run build
```

## Common Issues

### CORS Errors
Make sure the Worker's CORS configuration includes your frontend URL:
```typescript
app.use('/*', cors({
  origin: ['http://localhost:3000', 'https://www.pairdish.com'],
  // ...
}))
```

### Database Not Found
If you get database errors, make sure the database ID in `wrangler.jsonc` matches your created database.

### Caching Issues
The Worker uses KV storage for caching. Clear cache by:
- Waiting for TTL to expire (1 hour)
- Or manually delete from KV namespace in Cloudflare dashboard

## Next Steps

1. Import more dish data
2. Customize the frontend design
3. Add more features (user accounts, favorites, etc.)
4. Set up proper domain and SSL
5. Implement sitemap generation for SEO