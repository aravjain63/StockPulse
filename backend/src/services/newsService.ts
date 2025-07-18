import axios from 'axios';
import { config } from '../config';
import { INewsArticle } from '../types';

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export class NewsService {
  private apiKey: string;

  constructor() {
    this.apiKey = config.apiKeys.newsApi || '';
    if (!this.apiKey) {
      console.warn('News API key not configured');
    }
  }

  async getNewsForStock(symbol: string, date?: string): Promise<INewsArticle[]> {
    try {
      const params: any = {
        q: `${symbol} stock OR ${symbol} company`,
        language: 'en',
        sortBy: 'relevancy',
        apiKey: this.apiKey
      };

      // If date is provided, search for that specific date
      if (date) {
        params.from = date;
        params.to = date;
      }

      const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
        params
      });

      return response.data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
        content: article.content
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch news articles');
    }
  }

  async getTopBusinessNews(): Promise<INewsArticle[]> {
    try {
      const response = await axios.get(`${NEWS_API_BASE_URL}/top-headlines`, {
        params: {
          category: 'business',
          language: 'en',
          apiKey: this.apiKey
        }
      });

      return response.data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
        content: article.content
      }));
    } catch (error) {
      console.error('Error fetching top business news:', error);
      throw new Error('Failed to fetch top business news');
    }
  }
}