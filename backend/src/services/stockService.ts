import axios from 'axios';
import { config } from '../config';
import { IStock, IStockHistory } from '../types';

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

type datetypes = 'daily'| 'monthly' |'weekly'|'yearly';
export class StockService {
  private apiKey: string;

  constructor() {
    this.apiKey = config.apiKeys.alphaVantage || '';
    if (!this.apiKey) {
      console.warn('Alpha Vantage API key not configured');
    }
  }

  async getStockQuote(symbol: string): Promise<IStock> {
    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: this.apiKey
        }
      });

      const data = response.data['Global Quote'];
      
      if (!data) {
        throw new Error('Invalid stock symbol or API limit reached');
      }

      return {
        symbol: data['01. symbol'],
        name: data['01. symbol'], // Alpha Vantage doesn't provide company name in this endpoint
        price: parseFloat(data['05. price']),
        change: parseFloat(data['09. change']),
        changePercent: parseFloat(data['10. change percent'].replace('%', '')),
        volume: parseInt(data['06. volume']),
        high: parseInt(data['03. high']),
        low: parseInt(data['04. low']),
        prevclose:parseInt(data['08. previous close']),
      };
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      throw new Error('Failed to fetch stock data');
    }
  }

  async getMultipleStockQuotes(symbols: string[]): Promise<IStock[]> {
    const promises = symbols.map(symbol => this.getStockQuote(symbol));
    
    try {
      const results = await Promise.allSettled(promises);
      return results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<IStock>).value);
    } catch (error) {
      console.error('Error fetching multiple stock quotes:', error);
      throw new Error('Failed to fetch stock data');
    }
  }
  async getStockHistory(symbol: string, period: datetypes='daily'): Promise<IStockHistory[]> {
    try {
      const functionMap = {
        daily: 'TIME_SERIES_DAILY',
        weekly: 'TIME_SERIES_WEEKLY',
        monthly: 'TIME_SERIES_MONTHLY',
        yearly: 'TIME_SERIES_YEARLY'
      };

      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: functionMap[period],
          symbol: symbol,
          apikey: this.apiKey
        }
      });

      const timeSeriesKey = Object.keys(response.data).find(key => 
        key.includes('Time Series')
      );

      if (!timeSeriesKey) {
        throw new Error('Invalid response format');
      }

      const timeSeries = response.data[timeSeriesKey];
      
      return Object.entries(timeSeries).map(([date, data]: [string, any]) => ({
        date,
        open: parseFloat(data['1. open']),
        high: parseFloat(data['2. high']),
        low: parseFloat(data['3. low']),
        close: parseFloat(data['4. close']),
        volume: parseInt(data['5. volume'])
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error('Error fetching stock history:', error);
      throw new Error('Failed to fetch stock history');
    }
  }
}