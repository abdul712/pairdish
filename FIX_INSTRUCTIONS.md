# PairDish Fix Instructions

This document outlines the fixes for the three main issues in the PairDish application.

## Issues Fixed

1. **URL Generation**: Frontend was creating double-prefixed URLs like `/what-to-serve-with-what-to-serve-with-15-bean-soup`
2. **Database Cleanup**: Remote database had 130 dishes instead of the expected 10 sample dishes
3. **Image URLs**: Generic placeholder images replaced with proper food photos

## Changes Made

### 1. Backend Code Updates (`src/index.ts`)

- Updated `transformDish()` function to remove "what-to-serve-with-" prefix from slugs
- Updated API endpoints to handle both old (with prefix) and new (without prefix) slug formats for backward compatibility
- This ensures the frontend receives clean slugs without the prefix

### 2. Database Migration Scripts

Two SQL scripts have been created:

#### `fix_slugs_migration.sql`
- Removes "what-to-serve-with-" prefix from all dish slugs in the database
- Updates image URLs with proper Unsplash food photos
- Run this to fix the slug format in your database

#### `cleanup_database.sql`
- Removes all dishes beyond ID 10 and their related data
- Updates image URLs for the remaining dishes
- Run this to clean up excess data

### 3. Test Scripts

- `test-fixes.js` - Comprehensive test to verify all fixes are working
- `test-database-cleanup.js` - Quick test to check database state

## How to Apply the Fixes

### Step 1: Deploy the Updated Backend

The backend code has already been updated. Deploy it to Cloudflare Workers:

```bash
npm run deploy
```

### Step 2: Run Database Migrations

You'll need to run the SQL scripts on your D1 database. You can do this through:

1. **Cloudflare Dashboard**:
   - Go to your Cloudflare dashboard
   - Navigate to Workers & Pages > D1
   - Select your database
   - Go to Console tab
   - Copy and paste the SQL from `fix_slugs_migration.sql`
   - Execute the queries

2. **Wrangler CLI** (if configured):
   ```bash
   wrangler d1 execute pairdish-db --file=fix_slugs_migration.sql
   ```

### Step 3: Clean Up Database (Optional)

If you want to reduce the database to just 10 sample dishes:

```bash
wrangler d1 execute pairdish-db --file=cleanup_database.sql
```

### Step 4: Verify the Fixes

Run the test script to verify everything is working:

```bash
node test-fixes.js
```

## Expected Results

After applying these fixes:

1. URLs will be correctly formed as `/what-to-serve-with-15-bean-soup` (single prefix)
2. Database will have clean slugs without the prefix (e.g., `15-bean-soup`)
3. All dishes will have proper food images from Unsplash
4. The application will handle both old and new slug formats during the transition

## Rollback Plan

If needed, you can rollback by:

1. Redeploying the previous version of the backend
2. Running this SQL to restore prefixes:
   ```sql
   UPDATE dishes 
   SET slug = CONCAT('what-to-serve-with-', slug)
   WHERE slug NOT LIKE 'what-to-serve-with-%';
   ```

## Notes

- The backend is backward compatible - it will work with both slug formats
- Image URLs are high-quality Unsplash photos optimized for 800x600 display
- The fix maintains all existing functionality while solving the URL issue