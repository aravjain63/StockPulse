import { Router } from 'express';
import {
  getNewsForStock,
  getTopBusinessNews,
  analyzeNewsForStock
} from '../controllers/newsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All news routes require authentication
router.use(authenticateToken);

// GET /api/news/top
router.get('/top', getTopBusinessNews);

// GET /api/news/:symbol
router.get('/:symbol', getNewsForStock);

// GET /api/news/:symbol/analyze
router.get('/:symbol/analyze', analyzeNewsForStock);

export default router;