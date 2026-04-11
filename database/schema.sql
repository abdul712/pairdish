-- PairDish Database Schema
-- PostgreSQL Database Schema for Coolify Deployment

-- Create database (run this separately if needed)
-- CREATE DATABASE pairdish;

-- Main dishes table (5000+ records)
CREATE TABLE main_dishes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    cuisine_type VARCHAR(100),
    seo_title VARCHAR(255),
    meta_description VARCHAR(320),
    featured_image VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Side dishes table (unique suggestions)
CREATE TABLE side_dishes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    cuisine_type VARCHAR(100),
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pairing relationships table (75000+ records)
CREATE TABLE dish_pairings (
    id SERIAL PRIMARY KEY,
    main_dish_id INTEGER NOT NULL REFERENCES main_dishes(id) ON DELETE CASCADE,
    side_dish_id INTEGER NOT NULL REFERENCES side_dishes(id) ON DELETE CASCADE,
    pairing_reason TEXT,
    match_score INTEGER DEFAULT 85 CHECK (match_score >= 0 AND match_score <= 100),
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(main_dish_id, side_dish_id)
);

-- Popular dishes tracking (for homepage)
CREATE TABLE popular_dishes (
    dish_id INTEGER PRIMARY KEY REFERENCES main_dishes(id) ON DELETE CASCADE,
    view_count INTEGER DEFAULT 0,
    last_viewed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization

-- Main dishes indexes
CREATE INDEX idx_main_dishes_slug ON main_dishes(slug);
CREATE INDEX idx_main_dishes_cuisine ON main_dishes(cuisine_type);
CREATE INDEX idx_main_dishes_created_at ON main_dishes(created_at DESC);
CREATE INDEX idx_main_dishes_search ON main_dishes USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Side dishes indexes
CREATE INDEX idx_side_dishes_slug ON side_dishes(slug);
CREATE INDEX idx_side_dishes_cuisine ON side_dishes(cuisine_type);
CREATE INDEX idx_side_dishes_search ON side_dishes USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Dish pairings indexes
CREATE INDEX idx_dish_pairings_main_dish ON dish_pairings(main_dish_id, display_order, match_score DESC);
CREATE INDEX idx_dish_pairings_side_dish ON dish_pairings(side_dish_id);
CREATE INDEX idx_dish_pairings_match_score ON dish_pairings(match_score DESC);

-- Popular dishes indexes
CREATE INDEX idx_popular_dishes_view_count ON popular_dishes(view_count DESC);
CREATE INDEX idx_popular_dishes_last_viewed ON popular_dishes(last_viewed DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_main_dishes_updated_at 
    BEFORE UPDATE ON main_dishes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_popular_dishes_updated_at 
    BEFORE UPDATE ON popular_dishes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data insertion (for testing)
INSERT INTO main_dishes (name, slug, description, cuisine_type, seo_title, meta_description) VALUES
('Chicken Biryani', 'chicken-biryani', 'Aromatic rice dish with tender chicken pieces', 'Indian', 'What to Serve with Chicken Biryani - Perfect Side Dishes | PairDish', 'Discover 15 perfect side dishes for chicken biryani. Expert pairing suggestions with raita, naan, and more traditional accompaniments.'),
('Pasta Carbonara', 'pasta-carbonara', 'Creamy Italian pasta with eggs, cheese, and pancetta', 'Italian', 'What to Serve with Pasta Carbonara - Best Side Dishes | PairDish', 'Find the perfect side dishes for pasta carbonara. From salads to bread, discover ideal pairings for this classic Italian dish.'),
('Grilled Salmon', 'grilled-salmon', 'Perfectly grilled salmon fillet', 'American', 'What to Serve with Grilled Salmon - Delicious Sides | PairDish', 'Explore the best side dishes for grilled salmon. From vegetables to starches, find perfect pairings for this healthy fish dish.'),
('Beef Stir Fry', 'beef-stir-fry', 'Quick and flavorful beef stir fry with vegetables', 'Chinese', 'What to Serve with Beef Stir Fry - Perfect Sides | PairDish', 'Discover ideal side dishes for beef stir fry. Rice, noodles, and more perfect accompaniments for this Asian favorite.');

INSERT INTO side_dishes (name, slug, description, cuisine_type) VALUES
('Cucumber Raita', 'cucumber-raita', 'Cool yogurt-based side dish with cucumber', 'Indian'),
('Garlic Naan', 'garlic-naan', 'Soft bread with garlic and herbs', 'Indian'),
('Basmati Rice', 'basmati-rice', 'Fragrant long-grain rice', 'Indian'),
('Caesar Salad', 'caesar-salad', 'Crisp romaine lettuce with Caesar dressing', 'Italian'),
('Garlic Bread', 'garlic-bread', 'Toasted bread with garlic butter', 'Italian'),
('Steamed Broccoli', 'steamed-broccoli', 'Fresh steamed broccoli florets', 'American'),
('Roasted Asparagus', 'roasted-asparagus', 'Tender roasted asparagus spears', 'American'),
('Jasmine Rice', 'jasmine-rice', 'Fragrant Thai jasmine rice', 'Asian'),
('Egg Fried Rice', 'egg-fried-rice', 'Classic fried rice with scrambled eggs', 'Chinese'),
('Steamed Vegetables', 'steamed-vegetables', 'Mix of fresh steamed vegetables', 'Asian');

-- Sample pairings
INSERT INTO dish_pairings (main_dish_id, side_dish_id, pairing_reason, match_score, display_order) VALUES
-- Chicken Biryani pairings
(1, 1, 'Cooling yogurt raita balances the rich and spicy biryani perfectly', 95, 1),
(1, 2, 'Traditional accompaniment that complements the aromatic rice', 90, 2),
(1, 3, 'Extra basmati rice for those who want more of the base', 85, 3),

-- Pasta Carbonara pairings
(2, 4, 'Fresh salad cuts through the rich, creamy pasta', 88, 1),
(2, 5, 'Classic Italian pairing for any pasta dish', 85, 2),

-- Grilled Salmon pairings
(3, 6, 'Healthy vegetable that pairs well with fish', 87, 1),
(3, 7, 'Elegant asparagus complements the salmon beautifully', 92, 2),

-- Beef Stir Fry pairings
(4, 8, 'Perfect base for Asian stir-fry dishes', 94, 1),
(4, 9, 'Classic fried rice pairs excellently with stir fry', 89, 2),
(4, 10, 'Additional vegetables complement the stir fry', 82, 3);

-- Sample popular dishes data
INSERT INTO popular_dishes (dish_id, view_count, last_viewed) VALUES
(1, 150, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
(2, 120, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(3, 98, CURRENT_TIMESTAMP - INTERVAL '3 hours'),
(4, 87, CURRENT_TIMESTAMP - INTERVAL '4 hours');

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON DATABASE pairdish TO pairdish_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pairdish_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pairdish_user;