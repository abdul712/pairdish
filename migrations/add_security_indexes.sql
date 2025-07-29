-- Add missing indexes for performance and security
-- These indexes improve query performance and help prevent timing attacks

-- Index for slug lookups (frequently used)
CREATE INDEX IF NOT EXISTS idx_dishes_slug ON dishes(slug);

-- Index for dish type filtering
CREATE INDEX IF NOT EXISTS idx_dishes_type ON dishes(dish_type);

-- Composite index for search queries
CREATE INDEX IF NOT EXISTS idx_dishes_search ON dishes(name, description);

-- Index for pairing lookups by main dish
CREATE INDEX IF NOT EXISTS idx_pairings_main ON pairings(main_dish_id);

-- Index for reverse pairing lookups
CREATE INDEX IF NOT EXISTS idx_pairings_side ON pairings(side_dish_id);

-- Index for recipe lookups
CREATE INDEX IF NOT EXISTS idx_recipes_dish ON recipes(dish_id);

-- Index for popular dishes
CREATE INDEX IF NOT EXISTS idx_popular_dish ON popular_dishes(dish_id);

-- Index for view count sorting
CREATE INDEX IF NOT EXISTS idx_popular_views ON popular_dishes(view_count DESC);