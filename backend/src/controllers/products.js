import { findAllProducts, findProductById, findBestsellers } from '../models/Product.js';

/**
 * GET /api/products
 * Supports query params: type, benefit, priceMin, priceMax, size, rating, sort, page, limit
 */
export async function getProducts(req, res) {
  const filters = {
    type: req.query.type,
    benefit: req.query.benefit,
    priceMin: req.query.priceMin,
    priceMax: req.query.priceMax,
    size: req.query.size,
    rating: req.query.rating,
    sort: req.query.sort,
    page: req.query.page || 1,
    limit: req.query.limit || 24,
  };

  const result = await findAllProducts(filters);
  res.json(result);
}

/**
 * GET /api/products/bestsellers
 */
export async function getBestsellers(req, res) {
  const limit = req.query.limit || 8;
  const products = await findBestsellers(limit);
  res.json({ products });
}

/**
 * GET /api/products/:id
 */
export async function getProductById(req, res) {
  const product = await findProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json({ product });
}
