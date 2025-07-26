import axios from 'axios';
import { Dish, Recipe, SearchResult, Pairing } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const pairDishAPI = {
  // Dish endpoints
  async getDish(slug: string): Promise<Dish> {
    const { data } = await api.get(`/dishes/${slug}`);
    return data;
  },

  async getAllDishes(): Promise<Dish[]> {
    const { data } = await api.get('/dishes');
    return data;
  },

  async getDishPairings(slug: string): Promise<Pairing[]> {
    const { data } = await api.get(`/dishes/${slug}/pairings`);
    return data;
  },

  // Recipe endpoints
  async getRecipe(slug: string): Promise<Recipe> {
    const { data } = await api.get(`/recipes/${slug}`);
    return data;
  },

  async getAllRecipes(): Promise<Recipe[]> {
    const { data } = await api.get('/recipes');
    return data;
  },

  // Search endpoint
  async search(query: string, page = 1, limit = 20): Promise<SearchResult> {
    const { data } = await api.get('/search', {
      params: { q: query, page, limit },
    });
    return data;
  },

  // Popular dishes
  async getPopularDishes(limit = 10): Promise<Dish[]> {
    const { data } = await api.get('/dishes/popular', {
      params: { limit },
    });
    return data;
  },

  // Categories
  async getCategories(): Promise<string[]> {
    const { data } = await api.get('/categories');
    return data;
  },
};

export default pairDishAPI;