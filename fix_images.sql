-- Fix images for each dish with proper unique photos
UPDATE dishes SET image_url = CASE
    -- Main dishes
    WHEN slug = '15-bean-soup' THEN 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop'
    WHEN slug = 'a-baked-potato' THEN 'https://images.unsplash.com/photo-1630431341973-02e1b662ec35?w=800&h=600&fit=crop'
    WHEN slug = 'a-baked-potato-bar' THEN 'https://images.unsplash.com/photo-1552332386-cbbba637bdb0?w=800&h=600&fit=crop'
    WHEN slug = 'a-blt' THEN 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=800&h=600&fit=crop'
    WHEN slug = 'a-breakfast-casserole' THEN 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'
    WHEN slug = 'a-casserole' THEN 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&h=600&fit=crop'
    WHEN slug = 'a-charcuterie-board' THEN 'https://images.unsplash.com/photo-1625937712159-8305340ddfc0?w=800&h=600&fit=crop'
    WHEN slug = 'a-charcuterie-board-for-dinner' THEN 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop'
    WHEN slug = 'a-cheese-ball' THEN 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&h=600&fit=crop'
    WHEN slug = 'a-cheese-board' THEN 'https://images.unsplash.com/photo-1553792562-8e7ec7befa61?w=800&h=600&fit=crop'
    -- Default food image
    ELSE 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'
END
WHERE id <= 10;

-- Check the updates
SELECT id, name, slug, image_url FROM dishes ORDER BY id LIMIT 10;