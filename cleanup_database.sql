-- Clean up PairDish database to keep only first 10 dishes with proper images

-- First, let's see what dishes we have
SELECT id, name, slug, image_url FROM dishes ORDER BY id LIMIT 20;

-- Delete pairings for dishes beyond ID 10
DELETE FROM pairings WHERE main_dish_id > 10 OR side_dish_id > 10;

-- Delete recipes for dishes beyond ID 10
DELETE FROM recipes WHERE dish_id > 10;

-- Delete popular dishes entries for dishes beyond ID 10
DELETE FROM popular_dishes WHERE dish_id > 10;

-- Delete dishes beyond ID 10
DELETE FROM dishes WHERE id > 10;

-- Update image URLs for the remaining dishes with proper food photos
UPDATE dishes SET image_url = CASE
    -- Main dishes
    WHEN slug = 'what-to-serve-with-15-bean-soup' THEN 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop'
    WHEN slug = 'what-to-serve-with-chicken-parmesan' THEN 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&h=600&fit=crop'
    WHEN slug = 'what-to-serve-with-grilled-salmon' THEN 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop'
    WHEN slug = 'what-to-serve-with-beef-tacos' THEN 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop'
    WHEN slug = 'what-to-serve-with-vegetable-curry' THEN 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop'
    
    -- Side dishes
    WHEN slug = 'cornbread' THEN 'https://images.unsplash.com/photo-1594069785808-84fc2d8c66e3?w=800&h=600&fit=crop'
    WHEN slug = 'garlic-bread' THEN 'https://images.unsplash.com/photo-1573140401552-3fab0b24f356?w=800&h=600&fit=crop'
    WHEN slug = 'caesar-salad' THEN 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&h=600&fit=crop'
    WHEN slug = 'coleslaw' THEN 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=600&fit=crop'
    WHEN slug = 'green-salad' THEN 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop'
    WHEN slug = 'asparagus' THEN 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=800&h=600&fit=crop'
    WHEN slug = 'lemon-rice' THEN 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&h=600&fit=crop'
    WHEN slug = 'quinoa-salad' THEN 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&h=600&fit=crop'
    WHEN slug = 'spanish-rice' THEN 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop'
    WHEN slug = 'refried-beans' THEN 'https://images.unsplash.com/photo-1538308804867-38c0a04dd8e4?w=800&h=600&fit=crop'
    WHEN slug = 'guacamole' THEN 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=800&h=600&fit=crop'
    WHEN slug = 'pico-de-gallo' THEN 'https://images.unsplash.com/photo-1546094113-ddedd83662a2?w=800&h=600&fit=crop'
    WHEN slug = 'tortilla-chips' THEN 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&h=600&fit=crop'
    WHEN slug = 'basmati-rice' THEN 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&h=600&fit=crop'
    WHEN slug = 'naan-bread' THEN 'https://images.unsplash.com/photo-1628294896516-344152572ee8?w=800&h=600&fit=crop'
    WHEN slug = 'cucumber-raita' THEN 'https://images.unsplash.com/photo-1589566010196-5686e24a0272?w=800&h=600&fit=crop'
    WHEN slug = 'mango-chutney' THEN 'https://images.unsplash.com/photo-1589349146052-5ab7e96c9187?w=800&h=600&fit=crop'
    WHEN slug = 'vegetable-samosas' THEN 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop'
    
    -- Default for any other dishes
    ELSE 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop'
END
WHERE id <= 10;

-- Verify the cleanup
SELECT COUNT(*) as total_dishes FROM dishes;
SELECT id, name, slug, image_url FROM dishes ORDER BY id LIMIT 10;