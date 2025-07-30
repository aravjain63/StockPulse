# StockPulse

**Discover Why Your Stocks Move**

StockPulse is a full-stack application for tracking stock performance and market news with AI-powered insights. The project includes an Express/Node backend with MongoDB and a React + TypeScript frontend built with Vite and Tailwind.

## Features

- **Real-time Stock Tracking** – monitor current prices and get instant updates on your watchlist
- **Historical Data Analysis** – interactive charts to dive into trends
- **AI-Powered News Summaries** – Gemini-driven summaries of news articles
- **Custom Watchlists** – manage personalized watchlists for your favorite stocks
- **Secure Authentication** – JWT-based auth and protected API routes

## Technology

- **Backend**: Node.js, Express, TypeScript, MongoDB, Zod
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui

## Getting Started

Clone the repo and install dependencies in both `backend` and `frontend`:

```bash
npm install  # inside backend
npm install  # inside frontend
```

### Environment Variables

Create `.env` files for backend and frontend with the following keys:

```
PORT=5000
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<jwt secret>
ALPHA_VANTAGE_API_KEY=<alpha vantage api key>
NEWS_API_KEY=<newsapi key>
GEMINI_API_KEY=<gemini api key>
```

Frontend `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ALPHA_VANTAGE_API_KEY=<alpha vantage api key>
```

### Development

Start the backend and frontend in separate terminals:

```bash
# Backend
npm run dev

# Frontend
npm run dev
```

The frontend will be served at `http://localhost:8080` and connect to the API on port 5000.

## Postman Collection

A Postman collection is included as `StockPulse.postman_collection.json` for testing the API endpoints.

---

Enjoy exploring the market with StockPulse!
