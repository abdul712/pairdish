// Shared types between client and server

export interface MainDish {
  id: number;
  name: string;
  slug: string;
  description?: string;
  cuisine_type?: string;
  seo_title?: string;
  meta_description?: string;
  featured_image?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface SideDish {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  cuisine_type?: string;
  image_url?: string;
  created_at: Date | string;
  updated_at?: Date | string;
}

export interface DishPairing {
  id: number;
  main_dish_id: number;
  side_dish_id: number;
  pairing_reason?: string;
  match_score: number;
  display_order?: number;
  main_dish: MainDish;
  side_dish: SideDish;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}