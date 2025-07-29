import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import { config } from './config';

// Import routes
import authRoutes from './routes/authRoute';
import watchlistRoutes from './routes/watchlistRoute';
import stockRoutes from './routes/stockRoute';
import newsRoutes from './routes/newsRoute';

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json({ limit: '1mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/watchlists', watchlistRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/news', newsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);
  
  res.status(500).json({
    message: 'Something went wrong!',
    error: config.nodeEnv === 'development' ? error.message : undefined
  });
});

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;