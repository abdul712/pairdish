import { Request, Response } from 'express';
import { mockMainDishes, mockSideDishes, mockPairings } from '../data/mockData';
import type { ApiResponse, PaginatedResponse, MainDish, DishPairing } from '@shared/types';

export class MockDishController {
  // GET /api/dishes
  static async getDishes(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const dishes = mockMainDishes.slice(startIndex, endIndex);
      
      const response: PaginatedResponse<MainDish> = {
        success: true,
        data: dishes,
        pagination: {
          page,
          limit,
          total: mockMainDishes.length,
          totalPages: Math.ceil(mockMainDishes.length / limit)
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // GET /api/dishes/popular
  static async getPopularDishes(req: Request, res: Response) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 12, 50);
      const dishes = mockMainDishes.slice(0, limit);
      
      const response: ApiResponse<MainDish[]> = {
        success: true,
        data: dishes
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching popular dishes:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // GET /api/dishes/:slug
  static async getDish(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const dish = mockMainDishes.find(d => d.slug === slug);

      if (!dish) {
        return res.status(404).json({
          success: false,
          error: 'Dish not found'
        });
      }
      
      const response: ApiResponse<MainDish> = {
        success: true,
        data: dish
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching dish:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // GET /api/dishes/:slug/pairings
  static async getDishPairings(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      
      // Find the dish
      const dish = mockMainDishes.find(d => d.slug === slug);
      if (!dish) {
        return res.status(404).json({
          success: false,
          error: 'Dish not found'
        });
      }

      // Generate mock pairings for this dish
      const pairings: DishPairing[] = mockSideDishes.map((sideDish, index) => ({
        id: dish.id * 100 + index + 1,
        main_dish_id: dish.id,
        side_dish_id: sideDish.id,
        match_score: Math.floor(Math.random() * 30) + 70, // 70-100
        pairing_reason: `${sideDish.name} pairs wonderfully with ${dish.name}, creating a harmonious balance of flavors and textures.`,
        display_order: index + 1,
        main_dish: dish,
        side_dish: sideDish,
        created_at: new Date(),
        updated_at: new Date()
      }));
      
      const response: ApiResponse<DishPairing[]> = {
        success: true,
        data: pairings
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching dish pairings:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // GET /api/search
  static async searchDishes(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      
      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Search query must be at least 2 characters long'
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      // Simple mock search
      const searchTerm = query.toLowerCase().trim();
      const matchedDishes = mockMainDishes.filter(dish => 
        dish.name.toLowerCase().includes(searchTerm) ||
        dish.description?.toLowerCase().includes(searchTerm) ||
        dish.cuisine_type?.toLowerCase().includes(searchTerm)
      );

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const dishes = matchedDishes.slice(startIndex, endIndex);
      
      const response: PaginatedResponse<MainDish> = {
        success: true,
        data: dishes,
        pagination: {
          page,
          limit,
          total: matchedDishes.length,
          totalPages: Math.ceil(matchedDishes.length / limit)
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error searching dishes:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}