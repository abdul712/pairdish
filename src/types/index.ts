export type DishType = 'main' | 'side' | 'dessert' | 'appetizer' | 'beverage'
export type RecipeDifficulty = 'easy' | 'medium' | 'hard'

export interface RawDish {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
  cuisine?: string
  dish_type: DishType
  dietary_tags?: string
  seo_title?: string
  seo_description?: string
  keywords?: string
  created_at?: string
  updated_at?: string
}

export interface TransformedDish {
  id: number
  name: string
  slug: string
  description?: string
  imageUrl?: string
  cuisine?: string
  category: DishType
  dietaryTags: string[]
  seoTitle?: string
  seoDescription?: string
  keywords: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Recipe {
  id?: number
  dish_id?: number
  ingredients: string[]
  instructions: string[]
  prep_time?: number
  cook_time?: number
  servings?: number
  difficulty?: RecipeDifficulty
  nutrition?: Record<string, any>
  source_url?: string
}

export interface Pairing {
  id: number
  main_dish_id: number
  side_dish_id: number
  created_at?: string
  description?: string
}

export interface PopularDish {
  id: number
  dish_id: number
  view_count: number
  last_viewed?: string
}

export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}