import { Request, Response } from 'express';
import { MainDishModel } from '../models/MainDish';
import { DishPairingModel } from '../models/DishPairing';
import { ApiResponse, PaginatedResponse } from '@shared/types';

export class DishController {
  // GET /api/dishes
  static async getDishes(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      const { dishes, total } = await MainDishModel.findAll(page, limit);
      
      const response: PaginatedResponse<any> = {
        success: true,
        data: dishes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
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
      const dishes = await MainDishModel.findPopular(limit);
      
      const response: ApiResponse<any[]> = {
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
      const dish = await MainDishModel.findBySlug(slug);

      if (!dish) {
        return res.status(404).json({
          success: false,
          error: 'Dish not found'
        });
      }

      // Increment view count for popularity tracking
      await MainDishModel.incrementViewCount(dish.id);
      
      const response: ApiResponse<any> = {
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
      
      // Verify the dish exists
      const dish = await MainDishModel.findBySlug(slug);
      if (!dish) {
        return res.status(404).json({
          success: false,
          error: 'Dish not found'
        });
      }

      const pairings = await DishPairingModel.findByMainDishSlug(slug);
      
      const response: ApiResponse<any[]> = {
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

      const { dishes, total } = await MainDishModel.search(query.trim(), page, limit);
      
      const response: PaginatedResponse<any> = {
        success: true,
        data: dishes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
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