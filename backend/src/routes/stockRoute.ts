import { Router } from 'express';
import {
  getStockQuote,
  getMultipleStockQuotes,
  getStockHistory,
  searchStocks
} from '../controllers/stockController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All stock routes require authentication
router.use(authenticateToken);

// GET /api/stocks/search
router.get('/search', searchStocks);

// GET /api/stocks/:symbol
router.get('/:symbol', getStockQuote);

// GET /api/stocks/:symbol/history
router.get('/:symbol/history', getStockHistory);

// POST /api/stocks/quotes
router.post('/quotes', getMultipleStockQuotes);

export default router;