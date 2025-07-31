// API Response Types
export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  image_url?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Dish {
  id: string;
  slug: string;
  name: string;
  description: string;
  dish_type: string;
  category?: string;
  cuisine?: string;
  image_url?: string;
  imageUrl?: string;
  dietary_tags?: string[];
  dietaryTags?: string[];
  keywords?: string[];
  pairings?: Pairing[];
}

export interface Pairing {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  imageUrl?: string;
  cuisine?: string;
  dish_type: string;
  category?: string;
  matchScore?: number;
  orderPosition?: number;
  dietary_tags?: string[];
  dietaryTags?: string[];
  recipe?: Recipe;
}

export interface DishPairingsResponse {
  mainDish: Dish;
  sideDishes: Pairing[];
}

export interface SearchResult {
  dishes: Dish[];
  recipes: Recipe[];
  totalResults: number;
  page: number;
  totalPages: number;
}

// SEO Types
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    title?: string;
    description?: string;
    image?: string;
  };
}