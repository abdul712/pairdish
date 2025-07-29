# Fix for 404 Not Found Error on Dish Pages

## Problem Summary
The URL `https://pairdish.mabdulrahim.workers.dev/what-to-serve-with/a-cheese-souffle` returns 404 because:
1. The database may not be properly seeded with dish data
2. The slug "a-cheese-souffle" doesn't match the expected format "cheese-souffle"
3. The route handler wasn't handling slug variations properly

## Root Cause
After investigating the codebase, I found:
- The database expects dishes with specific slugs (e.g., "cheese-souffle" not "a-cheese-souffle")
- The migration scripts show dishes should have been updated to remove "what-to-serve-with-" prefix
- But the actual data might not have been properly imported/seeded

## Solutions Implemented

### 1. Enhanced Route Handler (src/index.ts)
Updated the `/what-to-serve-with/:slug` route to:
- Try multiple slug variations (with/without "a-", with/without prefix)
- Perform partial matching for similar dishes
- Redirect to canonical URLs when found with different slug
- Provide better error handling

### 2. Debug Endpoint
Added `/api/debug/dishes` endpoint to:
- List all dishes in the database with their slugs
- Help diagnose what data actually exists
- No authentication required for debugging

### 3. Database Seeding Script
Created `seed_initial_data.sql` with:
- 10 initial dishes including "Cheese Souffle" with slug "cheese-souffle"
- Proper pairings between dishes
- Popular dishes data
- All required fields populated

### 4. Diagnostic Tool
Created `database_diagnostic.js` to:
- Check what dishes exist in the database
- Test slug variations
- Provide recommendations for fixes

## How to Fix the Issue

### Step 1: Check Current Database State
```bash
# Run the diagnostic tool
node database_diagnostic.js

# Or check via API
curl https://pairdish.mabdulrahim.workers.dev/api/debug/dishes
```

### Step 2: Seed the Database (if empty)
```bash
# Execute the seed script using Wrangler
wrangler d1 execute pairdish-db --file=seed_initial_data.sql

# Or if using a different database name
wrangler d1 execute YOUR_DB_NAME --file=seed_initial_data.sql
```

### Step 3: Deploy the Updated Code
```bash
# Deploy the updated worker with enhanced route handling
wrangler deploy
```

### Step 4: Test the URLs
After deployment, these URLs should work:
- https://pairdish.mabdulrahim.workers.dev/what-to-serve-with/cheese-souffle (canonical)
- https://pairdish.mabdulrahim.workers.dev/what-to-serve-with/a-cheese-souffle (redirects to canonical)
- https://pairdish.mabdulrahim.workers.dev/api/debug/dishes (shows all dishes)

## Expected Behavior
1. If you visit `/what-to-serve-with/a-cheese-souffle`, it will:
   - Try to find "a-cheese-souffle" → Not found
   - Try to find "cheese-souffle" → Found!
   - Redirect to `/what-to-serve-with/cheese-souffle` (301 redirect)

2. The canonical URL `/what-to-serve-with/cheese-souffle` will:
   - Find the dish in the database
   - Render the page with pairings

## Additional Notes
- The system now handles multiple slug formats gracefully
- Redirects ensure SEO-friendly canonical URLs
- The debug endpoint helps diagnose future issues
- The seed data includes realistic dishes and pairings

## Troubleshooting
If still getting 404:
1. Check if database has data: `curl https://pairdish.mabdulrahim.workers.dev/api/debug/dishes`
2. Verify the database name in wrangler.toml matches the one you're using
3. Ensure the worker is deployed with latest code: `wrangler deploy`
4. Check worker logs: `wrangler tail`