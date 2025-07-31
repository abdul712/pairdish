const API_BASE = import.meta.env.VITE_API_URL || ''

export interface Dish {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
  imageUrl?: string // backward compatibility
  cuisine?: string
  dish_type: string
  category?: string // backward compatibility
  dietaryTags?: string[]
  keywords?: string[]
  created_at?: string
  updated_at?: string
}

export interface Recipe {
  id: number
  title: string
  slug: string
  description: string
  image_url: string
  cuisine?: string
  difficulty: 'easy' | 'medium' | 'hard'
  prep_time: number
  cook_time: number
  servings: number
}

export interface Pairing extends Dish {
  matchScore: number
  pairingReason?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface DishResponse {
  success: boolean
  dishes?: Dish[]
  dish?: Dish
  error?: string
}

export interface PairingResponse {
  success: boolean
  dish: Dish
  pairings: Pairing[]
}

export interface SearchResponse {
  success: boolean
  results: Dish[]
  query: string
}

class ApiService {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  async getDishes(limit: number = 20, offset: number = 0): Promise<DishResponse> {
    return this.fetchWithErrorHandling<DishResponse>(
      `${API_BASE}/api/dishes?limit=${limit}&offset=${offset}`
    )
  }

  async getDishById(id: string): Promise<DishResponse> {
    return this.fetchWithErrorHandling<DishResponse>(
      `${API_BASE}/api/dishes/${id}`
    )
  }

  async getDishPairings(id: string): Promise<PairingResponse> {
    return this.fetchWithErrorHandling<PairingResponse>(
      `${API_BASE}/api/dishes/${id}/pairings`
    )
  }

  async getFeaturedRecipes(): Promise<Recipe[]> {
    return this.fetchWithErrorHandling<Recipe[]>(
      `${API_BASE}/api/recipes/featured`
    )
  }

  async searchDishes(query: string): Promise<SearchResponse> {
    return this.fetchWithErrorHandling<SearchResponse>(
      `${API_BASE}/api/search?q=${encodeURIComponent(query)}`
    )
  }
}

export const api = new ApiService()