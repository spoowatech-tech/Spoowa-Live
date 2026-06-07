import { findAllProducts, findProductById, findBestsellers, createProduct as createProductModel, updateProduct as updateProductModel, deleteProduct as deleteProductModel, findAllProductsAdmin } from '../models/Product.js';

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

/**
 * GET /api/products/admin/all
 * Super Admin: List all products including inactive.
 */
export async function getAllProductsAdmin(req, res) {
  const { page = 1, limit = 100 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const result = await findAllProductsAdmin(Number(limit), offset);
  res.json(result);
}

/**
 * POST /api/products
 * Super Admin: Create a new product.
 */
export async function createProduct(req, res) {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Product name and price are required.' });
  }
  const product = await createProductModel(req.body);
  res.status(201).json({ message: 'Product created successfully.', product });
}

/**
 * PUT /api/products/:id
 * Super Admin: Update a product.
 */
export async function updateProductAdmin(req, res) {
  const existing = await findProductById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  const product = await updateProductModel(req.params.id, req.body);
  res.json({ message: 'Product updated successfully.', product });
}

/**
 * DELETE /api/products/:id
 * Super Admin: Soft-delete a product.
 */
export async function deleteProductAdmin(req, res) {
  await deleteProductModel(req.params.id);
  res.json({ message: 'Product deactivated successfully.' });
}

