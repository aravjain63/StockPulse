import { Request, Response } from 'express';
import { Watchlist } from '../models/watchlist';
import { IWatchlist } from '../types';

export const createWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, stocks = [] } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Check if watchlist with same name already exists for user
    const existingWatchlist = await Watchlist.findOne({ userId, name });
    if (existingWatchlist) {
      res.status(400).json({ message: 'Watchlist with this name already exists' });
      return;
    }

    const watchlist = new Watchlist({
      userId,
      name,
      stocks
    });

    await watchlist.save();
    res.status(201).json(watchlist);
  } catch (error) {
    console.error('CreateWatchlist error:', error);
    res.status(500).json({ message: 'Server error creating watchlist' });
  }
};
//get all watchlists of the user
export const getWatchlists = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const watchlists = await Watchlist.find({ userId }).sort({ createdAt: 'descending' });
    res.json(watchlists);
  } catch (error) {
    console.error('GetWatchlists error:', error);
    res.status(500).json({ message: 'Server error fetching watchlists' });
  }
};

export const getWatchlistById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const watchlist = await Watchlist.findOne({ _id: id, userId: userId });
    if (!watchlist) {
      res.status(404).json({ message: 'Watchlist not found' });
      return;
    }

    res.json(watchlist);
  } catch (error) {
    console.error('GetWatchlistById error:', error);
    res.status(500).json({ message: 'Server error fetching watchlist' });
  }
};

export const updateWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, stocks } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const watchlist = await Watchlist.findOne({ _id: id, userId: userId });
    if (!watchlist) {
      res.status(404).json({ message: 'Watchlist not found' });
      return;
    }

    // Update fields
    if (name) watchlist.name = name;
    if (stocks) watchlist.stocks = stocks;

    await watchlist.save();
    res.json(watchlist);
  } catch (error) {
    console.error('UpdateWatchlist error:', error);
    res.status(500).json({ message: 'Server error updating watchlist' });
  }
};

export const deleteWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const watchlist = await Watchlist.findOneAndDelete({ _id: id, userId });
    if (!watchlist) {
      res.status(404).json({ message: 'Watchlist not found' });
      return;
    }

    res.json({ message: 'Watchlist deleted successfully' });
  } catch (error) {
    console.error('DeleteWatchlist error:', error);
    res.status(500).json({ message: 'Server error deleting watchlist' });
  }
};

export const addStockToWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { symbol } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const watchlist = await Watchlist.findOne({ _id: id, userId });
    if (!watchlist) {
      res.status(404).json({ message: 'Watchlist not found' });
      return;
    }

    // Check if stock already exists in watchlist
    if (watchlist.stocks.includes(symbol)) {
      res.status(400).json({ message: 'Stock already in watchlist' });
      return;
    }

    watchlist.stocks.push(symbol);
    await watchlist.save();

    res.json(watchlist);
  } catch (error) {
    console.error('AddStockToWatchlist error:', error);
    res.status(500).json({ message: 'Server error adding stock to watchlist' });
  }
};

export const removeStockFromWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, symbol } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const watchlist = await Watchlist.findOne({ _id: id, userId });
    if (!watchlist) {
      res.status(404).json({ message: 'Watchlist not found' });
      return;
    }

    watchlist.stocks = watchlist.stocks.filter(stock => stock !== symbol.toUpperCase());
    await watchlist.save();

    res.json(watchlist);
  } catch (error) {
    console.error('RemoveStockFromWatchlist error:', error);
    res.status(500).json({ message: 'Server error removing stock from watchlist' });
  }
};