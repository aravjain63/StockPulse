
import { IStock, IStockHistory } from '../types';

const mockStockQuoteData: IStock = {
    symbol: "AAPL",
    name: "Apple Inc",
    price: 214.4,
    change: 1.92,
    changePercent: 0.9036,
    volume: 46404072,
    high: 214,
    low: 212,
    prevclose: 212
};


const mockStockHistoryData: IStockHistory[] = [
    {
        date: "2024-09-30",
        high: 233.09
    },
    {
        date: "2024-10-31",
        high: 237.49
    },
    {
        date: "2024-11-29",
        high: 237.81
    },
    {
        date: "2024-12-31",
        high: 260.1
    },
    {
        date: "2025-01-31",
        high: 249.1
    },
    {
        date: "2025-02-28",
        high: 250
    },
    {
        date: "2025-03-31",
        high: 244.0272
    },
    {
        date: "2025-04-30",
        high: 225.19
    },
    {
        date: "2025-05-30",
        high: 214.56
    },
    {
        date: "2025-06-30",
        high: 207.39
    },
    {
        date: "2025-07-22",
        high: 216.23
    }
];

type datetypes = 'daily'| 'monthly' |'weekly';
export class StockService {
  constructor() {}

  async getStockQuote(symbol: string): Promise<IStock> {
    return Promise.resolve(mockStockQuoteData);
  }

  async getMultipleStockQuotes(symbols: string[]): Promise<IStock[]> {
    return Promise.resolve([mockStockQuoteData]);
  }
  async getStockHistory(symbol: string, period: datetypes='daily'): Promise<IStockHistory[]> {
    return Promise.resolve(mockStockHistoryData);
  }

}
