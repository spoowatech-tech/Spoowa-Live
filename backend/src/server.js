import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { apiRouter } from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';
import { testConnection } from './config/db.js';
import { getServerConfig } from './config/index.js';

const app = express();
const config = getServerConfig();
const PORT = config.port;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api', apiRouter);

// Global error handler
app.use(errorHandler);

// Start server
async function start() {
  // Test database connection
  const connected = await testConnection();
  if (!connected) {
    console.error('⚠️  Server starting without database. Some features will not work.');
    console.error('   Run: node src/config/setupDb.js  to set up the database.');
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 SPOOWA API server running on http://localhost:${PORT}`);
    console.log(`   Environment: ${config.nodeEnv}`);
    console.log(`   Database: ${config.dbHost}:${config.dbPort}/${config.dbName}`);
    console.log(`\n📋 API Endpoints:`);
    console.log(`   Health:     GET  /api/health`);
    console.log(`   Auth:       POST /api/auth/register, /api/auth/login`);
    console.log(`   Products:   GET  /api/products, /api/products/:id`);
    console.log(`   Cart:       GET/POST/PUT/DELETE /api/cart`);
    console.log(`   Orders:     POST/GET /api/orders`);
    console.log(`   Addresses:  GET/POST/DELETE /api/addresses`);
    console.log(`   Coupons:    POST /api/coupons/apply`);
    console.log(`   Newsletter: POST /api/newsletter/subscribe\n`);
  });
}

start();
