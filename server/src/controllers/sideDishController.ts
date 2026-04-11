import { Request, Response } from 'express';
import { SideDishModel } from '../models/SideDish';
import { ApiResponse, PaginatedResponse } from '@shared/types';

export class SideDishController {
  // GET /api/side-dishes
  static async getSideDishes(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      const { sideDishes, total } = await SideDishModel.findAll(page, limit);
      
      const response: PaginatedResponse<any> = {
        success: true,
        data: sideDishes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching side dishes:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // GET /api/side-dishes/:slug
  static async getSideDish(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const sideDish = await SideDishModel.findBySlug(slug);

      if (!sideDish) {
        return res.status(404).json({
          success: false,
          error: 'Side dish not found'
        });
      }
      
      const response: ApiResponse<any> = {
        success: true,
        data: sideDish
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching side dish:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}