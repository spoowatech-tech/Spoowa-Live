import { Router } from 'express';
import { getProducts } from '../controllers/products.js';
import { postGreeting } from '../controllers/greeting.js';

export const apiRouter = Router();

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Products
apiRouter.get('/products', getProducts);

// Greeting (replaces TanStack createServerFn)
apiRouter.post('/greeting', postGreeting);
