import { Router } from 'express';
import { MockDishController } from '../controllers/mockDishController';
import { validateSearchQuery, validatePagination } from '../middleware/validation';

const router = Router();

// GET /api/search - Search dishes
router.get('/', validateSearchQuery, validatePagination, MockDishController.searchDishes);

export default router;