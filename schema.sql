-- PairDish Database Schema for Cloudflare D1

-- Main dishes table
CREATE TABLE IF NOT EXISTS dishes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  cuisine TEXT,
  dish_type TEXT CHECK(dish_type IN ('main', 'side', 'dessert', 'appetizer', 'beverage')),
  dietary_tags TEXT, -- JSON array: ["gluten-free", "vegetarian", "vegan", etc.]
  seo_title TEXT,
  seo_description TEXT,
  keywords TEXT, -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Recipes table (detailed recipe information)
CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dish_id INTEGER NOT NULL UNIQUE,
  ingredients TEXT NOT NULL, -- JSON array
  instructions TEXT NOT NULL, -- JSON array
  prep_time INTEGER, -- in minutes
  cook_time INTEGER, -- in minutes
  servings INTEGER,
  difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
  nutrition TEXT, -- JSON object with calories, protein, carbs, fat, etc.
  source_url TEXT,
  video_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

-- Pairings table (many-to-many relationship between dishes)
CREATE TABLE IF NOT EXISTS pairings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  main_dish_id INTEGER NOT NULL,
  side_dish_id INTEGER NOT NULL,
  match_score INTEGER DEFAULT 80 CHECK(match_score >= 0 AND match_score <= 100),
  pairing_reason TEXT,
  order_position INTEGER DEFAULT 0, -- For ordering side dishes
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (main_dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
  FOREIGN KEY (side_dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
  UNIQUE(main_dish_id, side_dish_id)
);

-- Search index for better performance
CREATE INDEX IF NOT EXISTS idx_dishes_slug ON dishes(slug);
CREATE INDEX IF NOT EXISTS idx_dishes_type ON dishes(dish_type);
CREATE INDEX IF NOT EXISTS idx_pairings_main ON pairings(main_dish_id);
CREATE INDEX IF NOT EXISTS idx_pairings_score ON pairings(match_score DESC);

-- Full text search virtual table
CREATE VIRTUAL TABLE IF NOT EXISTS dishes_fts USING fts5(
  name,
  description,
  keywords,
  content=dishes,
  content_rowid=id
);

-- Triggers to keep FTS table in sync
CREATE TRIGGER IF NOT EXISTS dishes_ai AFTER INSERT ON dishes BEGIN
  INSERT INTO dishes_fts(rowid, name, description, keywords)
  VALUES (new.id, new.name, new.description, new.keywords);
END;

CREATE TRIGGER IF NOT EXISTS dishes_ad AFTER DELETE ON dishes BEGIN
  DELETE FROM dishes_fts WHERE rowid = old.id;
END;

CREATE TRIGGER IF NOT EXISTS dishes_au AFTER UPDATE ON dishes BEGIN
  UPDATE dishes_fts SET
    name = new.name,
    description = new.description,
    keywords = new.keywords
  WHERE rowid = new.id;
END;

-- Popular dishes cache table
CREATE TABLE IF NOT EXISTS popular_dishes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dish_id INTEGER NOT NULL UNIQUE,
  view_count INTEGER DEFAULT 0,
  last_viewed DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

-- Create index for popular dishes
CREATE INDEX IF NOT EXISTS idx_popular_views ON popular_dishes(view_count DESC);