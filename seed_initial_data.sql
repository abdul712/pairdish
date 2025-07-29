-- Seed initial data for PairDish
-- This script populates the database with basic dishes to ensure the application works

-- Clear existing data (be careful with this in production!)
DELETE FROM pairings;
DELETE FROM recipes;
DELETE FROM popular_dishes;
DELETE FROM dishes;

-- Insert main dishes
INSERT INTO dishes (id, name, slug, description, image_url, cuisine, dish_type, dietary_tags, seo_title, seo_description, keywords) VALUES
(1, '15 Bean Soup', '15-bean-soup', 'A hearty and nutritious soup made with a blend of 15 different beans, vegetables, and savory seasonings.', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop', 'American', 'main', '["vegetarian", "high-fiber", "gluten-free"]', 'What to Serve with 15 Bean Soup - Best Side Dishes | PairDish', 'Discover the perfect side dishes to serve with 15 bean soup. From crusty bread to fresh salads, find ideal pairings for your hearty bean soup.', '["15 bean soup sides", "what to serve with bean soup", "bean soup pairings"]'),

(2, 'Baked Potato', 'baked-potato', 'Classic oven-baked potato with crispy skin and fluffy interior, perfect for loading with toppings.', 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=800&h=600&fit=crop', 'American', 'side', '["vegetarian", "gluten-free", "vegan"]', 'Baked Potato - Perfect Side Dish | PairDish', 'Learn how to make the perfect baked potato and discover what main dishes it pairs well with.', '["baked potato", "potato side dish", "loaded baked potato"]'),

(3, 'Baked Potato Bar', 'baked-potato-bar', 'A fun and interactive dining experience with baked potatoes and an array of delicious toppings.', 'https://images.unsplash.com/photo-1608219994488-cc269412b3e4?w=800&h=600&fit=crop', 'American', 'main', '["vegetarian-friendly", "customizable"]', 'What to Serve with a Baked Potato Bar - Best Accompaniments | PairDish', 'Planning a baked potato bar? Find the perfect side dishes and accompaniments to complete your potato bar spread.', '["baked potato bar ideas", "potato bar sides", "potato bar setup"]'),

(4, 'BLT Sandwich', 'blt-sandwich', 'Classic bacon, lettuce, and tomato sandwich on toasted bread with mayo.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop', 'American', 'main', '[]', 'What to Serve with BLT Sandwiches - Best Side Dishes | PairDish', 'Find the perfect sides to serve with BLT sandwiches. From chips to soups, discover ideal pairings.', '["BLT sides", "what to serve with BLT", "BLT sandwich pairings"]'),

(5, 'Breakfast Casserole', 'breakfast-casserole', 'A hearty morning casserole with eggs, cheese, and your choice of breakfast meats and vegetables.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop', 'American', 'main', '["high-protein"]', 'What to Serve with Breakfast Casserole - Best Sides | PairDish', 'Complete your breakfast spread with perfect sides for breakfast casserole. From fresh fruit to pastries.', '["breakfast casserole sides", "brunch menu ideas", "morning meal pairings"]'),

(6, 'Casserole', 'casserole', 'A comforting one-dish meal baked to perfection with layers of flavor.', 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop', 'American', 'main', '["comfort-food"]', 'What to Serve with Casserole - Perfect Side Dishes | PairDish', 'Find the ideal side dishes to complement any casserole. From salads to breads.', '["casserole sides", "casserole dinner ideas", "what goes with casserole"]'),

(7, 'Charcuterie Board', 'charcuterie-board', 'An artfully arranged selection of cured meats, cheeses, fruits, nuts, and accompaniments.', 'https://images.unsplash.com/photo-1626003573503-2e088d82c647?w=800&h=600&fit=crop', 'French', 'appetizer', '["gluten-free-options"]', 'What to Serve with a Charcuterie Board - Perfect Pairings | PairDish', 'Elevate your charcuterie board with perfect drink pairings and complementary dishes.', '["charcuterie board pairings", "charcuterie accompaniments", "cheese board ideas"]'),

(8, 'Charcuterie Board for Dinner', 'charcuterie-board-dinner', 'A substantial charcuterie spread designed as a main course with hearty portions and variety.', 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&h=600&fit=crop', 'French', 'main', '["customizable"]', 'Charcuterie Board as Dinner - What to Serve Alongside | PairDish', 'Turn your charcuterie board into a complete dinner with these perfect accompaniments.', '["dinner charcuterie", "charcuterie meal ideas", "cheese board dinner"]'),

(9, 'Cheese Board', 'cheese-board', 'A curated selection of artisanal cheeses with complementary fruits, nuts, and crackers.', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&h=600&fit=crop', 'International', 'appetizer', '["vegetarian", "gluten-free-options"]', 'What to Serve with a Cheese Board - Best Accompaniments | PairDish', 'Create the perfect cheese board experience with ideal pairings and accompaniments.', '["cheese board pairings", "cheese platter ideas", "cheese board accompaniments"]'),

(10, 'Cheese Souffle', 'cheese-souffle', 'A light and airy French classic made with eggs and cheese, baked until golden and puffy.', 'https://images.unsplash.com/photo-1626957341926-98752fc2ba90?w=800&h=600&fit=crop', 'French', 'main', '["vegetarian", "gluten-free-options"]', 'What to Serve with Cheese Souffle - Perfect Pairings | PairDish', 'Discover elegant side dishes to serve with cheese souffle for a sophisticated meal.', '["cheese souffle sides", "souffle dinner menu", "French dinner pairings"]');

-- Now add the pairings based on add_real_pairings.sql
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
-- For 15 Bean Soup (ID: 1)
(1, 7, 85, 'A charcuterie board with crackers and cheese complements hearty soup', 1),
(1, 9, 80, 'A simple cheese board provides protein to balance the beans', 2),
(1, 2, 75, 'A baked potato makes the meal more filling', 3),

-- For Baked Potato (ID: 2)
(2, 1, 85, 'Bean soup pairs wonderfully with a loaded baked potato', 1),
(2, 7, 80, 'Charcuterie provides variety of toppings for the potato', 2),
(2, 10, 75, 'Cheese souffle adds an elegant touch to simple potato', 3),

-- For Baked Potato Bar (ID: 3)
(3, 7, 90, 'Charcuterie items make great potato toppings', 1),
(3, 9, 85, 'Cheese board provides variety of cheeses for toppings', 2),
(3, 1, 80, 'Bean soup as a hearty side option', 3),
(3, 6, 75, 'Another casserole for variety at the bar', 4),

-- For BLT (ID: 4)
(4, 2, 90, 'Baked potato or potato wedges are classic with sandwiches', 1),
(4, 1, 85, 'A cup of soup with sandwich is a classic combo', 2),
(4, 7, 75, 'Small charcuterie board for a fancy lunch', 3),

-- For Breakfast Casserole (ID: 5)
(5, 2, 85, 'Hash browns or roasted potatoes complement breakfast', 1),
(5, 7, 80, 'Morning charcuterie with fruits and pastries', 2),
(5, 9, 75, 'Cheese board for a brunch spread', 3),

-- For Casserole (ID: 6) as main
(6, 2, 85, 'Baked potato as a simple side to casserole', 1),
(6, 1, 80, 'Soup as a starter before casserole', 2),
(6, 7, 75, 'Light appetizer board before hearty casserole', 3),

-- For Charcuterie Board (ID: 7) as main
(7, 1, 90, 'Soup pairs perfectly with a charcuterie spread', 1),
(7, 10, 85, 'Cheese souffle adds elegance to charcuterie dinner', 2),
(7, 2, 75, 'Small baked potatoes as a hearty addition', 3),

-- For Charcuterie Board for Dinner (ID: 8) as main
(8, 1, 90, 'Hearty soup complements an evening charcuterie', 1),
(8, 10, 85, 'Cheese souffle for an upscale dinner pairing', 2),
(8, 6, 80, 'Small portion of casserole for substantial meal', 3),

-- For Cheese Board (ID: 9) as main
(9, 1, 85, 'Bean soup provides warmth with cold cheese board', 1),
(9, 10, 90, 'Cheese souffle for the ultimate cheese experience', 2),
(9, 2, 75, 'Baked potato for a more filling meal', 3),

-- For Cheese Souffle (ID: 10) as main
(10, 7, 90, 'Charcuterie as an elegant starter before souffle', 1),
(10, 9, 85, 'Cheese board to continue the cheese theme', 2),
(10, 1, 75, 'Light soup before rich souffle', 3);

-- Update the popular dishes table
INSERT INTO popular_dishes (dish_id, view_count) VALUES
(1, 100),
(2, 95),
(3, 90),
(4, 88),
(5, 85),
(6, 82),
(7, 95),
(8, 80),
(9, 92),
(10, 78);

-- Verify the data
SELECT COUNT(*) as total_dishes FROM dishes;
SELECT COUNT(*) as total_pairings FROM pairings;