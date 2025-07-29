-- Query to check existing dishes in the database
-- Run this first to see what dishes are in IDs 6-10

SELECT id, name, slug, dish_type, cuisine 
FROM dishes 
WHERE id BETWEEN 1 AND 10
ORDER BY id;

-- Count total dishes
SELECT COUNT(*) as total_dishes FROM dishes;

-- Check if there are any existing pairings
SELECT COUNT(*) as existing_pairings FROM pairings;