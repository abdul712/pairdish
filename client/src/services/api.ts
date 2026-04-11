import type { MainDish, SideDish, DishPairing, ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Main dishes
  async getMainDishes(page = 1, limit = 20): Promise<PaginatedResponse<MainDish>> {
    return this.request(`/api/dishes?page=${page}&limit=${limit}`);
  }

  async getMainDish(slug: string): Promise<ApiResponse<MainDish>> {
    return this.request(`/api/dishes/${slug}`);
  }

  async getPopularDishes(limit = 12): Promise<ApiResponse<MainDish[]>> {
    return this.request(`/api/dishes/popular?limit=${limit}`);
  }

  // Pairings
  async getDishPairings(dishSlug: string): Promise<ApiResponse<DishPairing[]>> {
    return this.request(`/api/dishes/${dishSlug}/pairings`);
  }

  // Search
  async searchDishes(query: string, page = 1, limit = 20): Promise<PaginatedResponse<MainDish>> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    return this.request(`/api/search?${params}`);
  }

  // Side dishes
  async getSideDishes(page = 1, limit = 20): Promise<PaginatedResponse<SideDish>> {
    return this.request(`/api/side-dishes?page=${page}&limit=${limit}`);
  }
}

export const apiService = new ApiService();