import axios from 'axios';
import { config } from '../config';
import { IStock, IStockHistory } from '../types';

const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

type datetypes = 'daily'| 'monthly' |'weekly';
export class StockService {
  private apiKey: string;

  constructor() {
    this.apiKey = config.apiKeys.financialModelingPrep || '';
    if (!this.apiKey) {
      console.warn('Financial Modeling Prep API key not configured');
    }
  }

  async getStockQuote(symbol: string): Promise<IStock> {
    try {
      const quoteResponse = await axios.get(`${FMP_BASE_URL}/quote/${symbol}`, {
        params: { apikey: this.apiKey }
      });


      const quoteData = quoteResponse.data[0];

      if (!quoteData) {
        throw new Error('Invalid stock symbol or API limit reached');
      }

      return {
        symbol: quoteData.symbol,
        name: quoteData.name,
        price: quoteData.price,
        change: quoteData.change,
        changePercent: quoteData.changesPercentage,
        volume: quoteData.volume,
        high: quoteData.dayHigh,
        low: quoteData.dayLow,
        prevclose: quoteData.previousClose,
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
      let limit = 365; // Default to 365 days
      switch (period) {
        case 'daily':
          limit = 30; // Last 30 days for daily view
          break;
        case 'weekly':
          limit = 90; // Last 90 days for weekly view (approx 13 weeks)
          break;
        case 'monthly':
          limit = 365; // Last 365 days for monthly view (approx 12 months)
          break;
        default:
          limit = 365;
      }

      const response = await axios.get(`${FMP_BASE_URL}/historical-price-full/${symbol}`, {
        params: {
          apikey: this.apiKey,
          timeseries: limit, // Use the calculated limit
          serietype: 'line'
        }
      });

      const historicalData = response.data.historical;
      // console.log("FMP Historical Data:", historicalData); // Add this line for debugging

      if (!historicalData) {
        throw new Error('Invalid response format or no historical data available');
      }

      return historicalData.map((data: any) => ({
        date: data.date,
        close: data.close,
      })).sort((a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error('Error fetching stock history:', error);
      throw new Error('Failed to fetch stock history');
    }
  }

}