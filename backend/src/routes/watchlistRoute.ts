import { Router } from 'express';
import {
  createWatchlist,
  getWatchlists,
  getWatchlistById,
  updateWatchlist,
  deleteWatchlist,
  addStockToWatchlist,
  removeStockFromWatchlist
} from '../controllers/watchlistController';
import { authenticateToken } from '../middleware/auth';
import { validate, createWatchlistSchema, addStockSchema } from '../middleware/validation';

const router = Router();

// All watchlist routes require authentication
router.use(authenticateToken);

// GET /api/watchlists
router.get('/', getWatchlists);

// POST /api/watchlists
router.post('/', validate(createWatchlistSchema), createWatchlist);

// GET /api/watchlists/:id
router.get('/:id', getWatchlistById);

// PUT /api/watchlists/:id
router.put('/:id', updateWatchlist);

// DELETE /api/watchlists/:id
router.delete('/:id', deleteWatchlist);

// POST /api/watchlists/:id/stocks
router.post('/:id/stocks', validate(addStockSchema), addStockToWatchlist);

// DELETE /api/watchlists/:id/stocks/:symbol
router.delete('/:id/stocks/:symbol', removeStockFromWatchlist);

export default router;
