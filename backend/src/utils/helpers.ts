import { IUserResponse } from '../types';

export const formatUserResponse = (user: any): IUserResponse => {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt
  };
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const validateStockSymbol = (symbol: string): boolean => {
  // Basic validation for stock symbols (1-5 characters, letters only)
  const symbolRegex = /^[A-Z]{1,5}$/;
  return symbolRegex.test(symbol.toUpperCase());
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  return ((current - previous) / previous) * 100;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};