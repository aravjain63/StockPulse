import { Request, Response } from 'express';
import { StockService } from '../services/stockService';

const stockService = new StockService();

export const getStockQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      res.status(400).json({ message: 'Stock symbol is required' });
      return;
    }

    const stock = await stockService.getStockQuote(symbol.toUpperCase());
    res.json(stock);
  } catch (error) {
    console.error('GetStockQuote error:', error);
    res.status(500).json({ message: 'Failed to fetch stock quote' });
  }
};

export const getMultipleStockQuotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symbols } = req.body;
    
    if (!symbols || !Array.isArray(symbols)) {
      res.status(400).json({ message: 'Symbols array is required' });
      return;
    }

    const stocks = await stockService.getMultipleStockQuotes(symbols);
    res.json(stocks);
  } catch (error) {
    console.error('GetMultipleStockQuotes error:', error);
    res.status(500).json({ message: 'Failed to fetch stock quotes' });
  }
};

export const getStockHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symbol } = req.params;
    const { period } = req.query;
    
    if (!symbol) {
      res.status(400).json({ message: 'Stock symbol is required' });
      return;
    }

    const validPeriods = ['daily', 'weekly', 'monthly'];
    const selectedPeriod = validPeriods.includes(period as string) ? period as 'daily' | 'weekly' | 'monthly' : 'daily';

    const history = await stockService.getStockHistory(symbol.toUpperCase(), selectedPeriod);
    res.json(history);
  } catch (error) {
    console.error('GetStockHistory error:', error);
    res.status(500).json({ message: 'Failed to fetch stock history' });
  }
};

export const searchStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    
    if (!query) {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }

    // This is a simplified search - in a real app, you'd want to use a proper stock search API
    // For now, we'll just return the query as a symbol if it looks like one
    const symbol = (query as string).toUpperCase();
    
    try {
      const stock = await stockService.getStockQuote(symbol);
      res.json([stock]);
    } catch (error) {
      res.json([]);
    }
  } catch (error) {
    console.error('SearchStocks error:', error);
    res.status(500).json({ message: 'Failed to search stocks' });
  }
};