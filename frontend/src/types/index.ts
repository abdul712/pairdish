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
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Dish {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  cuisine?: string;
  imageUrl?: string;
  pairings: Pairing[];
}

export interface Pairing {
  id: string;
  dish: string;
  pairingDish: string;
  pairingType: 'side' | 'sauce' | 'beverage' | 'dessert';
  description?: string;
  recipe?: Recipe;
  popularity?: number;
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