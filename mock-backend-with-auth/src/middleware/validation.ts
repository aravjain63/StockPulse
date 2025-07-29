import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Validation schemas
export const signUpSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim()
});

export const signInSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const createWatchlistSchema = z.object({
  name: z.string().min(1, 'Watchlist name is required').trim(),
  stocks: z.array(z.string().trim().toUpperCase()).optional().default([])
});

export const addStockSchema = z.object({
  symbol: z.string().min(1, 'Stock symbol is required').trim().toUpperCase()
});

// Generic validation middleware
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((err) => {
          errors[err.path.join('.')] = err.message;
        });
        res.status(400).json({ 
          message: 'Validation failed', 
          errors 
        });
      } else {
        res.status(400).json({ message: 'Invalid request data' });
      }
    }
  };
};