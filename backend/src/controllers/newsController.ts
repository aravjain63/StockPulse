import { Request, Response } from 'express';
import { NewsService } from '../services/newsService';
import { AIService } from '../services/aiservices';

const newsService = new NewsService();
const aiService = new AIService();

export const getNewsForStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symbol } = req.params;
    const { date } = req.query;
    
    if (!symbol) {
      res.status(400).json({ message: 'Stock symbol is required' });
      return;
    }

    const news = await newsService.getNewsForStock(symbol.toUpperCase(), date as string);
    res.json(news);
  } catch (error) {
    console.error('GetNewsForStock error:', error);
    res.status(500).json({ message: 'Failed to fetch news articles' });
  }
};

export const getTopBusinessNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const news = await newsService.getTopBusinessNews();
    res.json(news);
  } catch (error) {
    console.error('GetTopBusinessNews error:', error);
    res.status(500).json({ message: 'Failed to fetch top business news' });
  }
};

export const analyzeNewsForStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symbol } = req.params;
    const { date } = req.query;
    
    if (!symbol) {
      res.status(400).json({ message: 'Stock symbol is required' });
      return;
    }

    // First, get the news articles
    const articles = await newsService.getNewsForStock(symbol.toUpperCase(), date as string);
    
    if (articles.length === 0) {
      res.status(404).json({ message: 'No news articles found for this stock' });
      return;
    }

    // Then, analyze them with AI
    const analysis = await aiService.analyzeNewsArticles(articles, symbol.toUpperCase());
    
    res.json({
      articles,
      analysis
    });
  } catch (error) {
    console.error('AnalyzeNewsForStock error:', error);
    res.status(500).json({ message: 'Failed to analyze news articles' });
  }
};