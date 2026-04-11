import { Router } from 'express';
import { MockDishController } from '../controllers/mockDishController';
import { validatePagination, validateSlug, validateSearchQuery } from '../middleware/validation';

const router = Router();

// GET /api/dishes - Get all dishes with pagination
router.get('/', validatePagination, MockDishController.getDishes);

// GET /api/dishes/popular - Get popular dishes
router.get('/popular', MockDishController.getPopularDishes);

// GET /api/dishes/:slug - Get specific dish by slug
router.get('/:slug', validateSlug, MockDishController.getDish);

// GET /api/dishes/:slug/pairings - Get pairings for a specific dish
router.get('/:slug/pairings', validateSlug, MockDishController.getDishPairings);

export default router;