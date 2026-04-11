import { Router } from 'express';
import dishesRouter from './dishes';
import sideDishesRouter from './sideDishes';
import searchRouter from './search';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'PairDish API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/dishes', dishesRouter);
router.use('/side-dishes', sideDishesRouter);
router.use('/search', searchRouter);

export default router;