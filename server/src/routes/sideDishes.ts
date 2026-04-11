import { Router } from 'express';
import { SideDishController } from '../controllers/sideDishController';
import { validatePagination, validateSlug } from '../middleware/validation';

const router = Router();

// GET /api/side-dishes - Get all side dishes with pagination
router.get('/', validatePagination, SideDishController.getSideDishes);

// GET /api/side-dishes/:slug - Get specific side dish by slug
router.get('/:slug', validateSlug, SideDishController.getSideDish);

export default router;