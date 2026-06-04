import { getPool } from '../config/db.js';

/**
 * Get all products with optional filters, sorting, and pagination.
 */
export async function findAllProducts({ type, benefit, priceMin, priceMax, size, rating, sort, page = 1, limit = 24 }) {
  const pool = getPool();
  const conditions = ['p.is_active = TRUE'];
  const params = [];

  if (type) {
    const types = Array.isArray(type) ? type : type.split(',');
    conditions.push(`p.type IN (${types.map(() => '?').join(',')})`);
    params.push(...types);
  }

  if (benefit) {
    const benefits = Array.isArray(benefit) ? benefit : benefit.split(',');
    conditions.push(`p.benefit IN (${benefits.map(() => '?').join(',')})`);
    params.push(...benefits);
  }

  if (priceMin !== undefined) {
    conditions.push('p.price >= ?');
    params.push(Number(priceMin));
  }

  if (priceMax !== undefined) {
    conditions.push('p.price <= ?');
    params.push(Number(priceMax));
  }

  if (size) {
    const sizes = Array.isArray(size) ? size : size.split(',');
    conditions.push(`EXISTS (SELECT 1 FROM product_sizes ps WHERE ps.product_id = p.id AND ps.size_label IN (${sizes.map(() => '?').join(',')}))`);
    params.push(...sizes);
  }

  if (rating) {
    conditions.push('p.rating >= ?');
    params.push(Number(rating));
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Sorting
  let orderClause = 'ORDER BY p.id DESC';
  switch (sort) {
    case 'price-low-high': orderClause = 'ORDER BY p.price ASC'; break;
    case 'price-high-low': orderClause = 'ORDER BY p.price DESC'; break;
    case 'highest-rated': orderClause = 'ORDER BY p.rating DESC'; break;
    case 'new-arrivals': orderClause = 'ORDER BY p.id DESC'; break;
    case 'best-selling': orderClause = 'ORDER BY p.reviews DESC'; break;
    default: orderClause = 'ORDER BY p.id DESC';
  }

  // Pagination
  const offset = (Number(page) - 1) * Number(limit);

  // Count total
  const [countResult] = await pool.execute(
    `SELECT COUNT(DISTINCT p.id) as total FROM products p ${whereClause}`,
    params
  );
  const total = countResult[0].total;

  // Fetch products — using pool.query instead of pool.execute for LIMIT/OFFSET compatibility
  const limitNum = Number(limit);
  const offsetNum = Number(offset);
  const [rows] = await pool.query(
    `SELECT p.* FROM products p ${whereClause} ${orderClause} LIMIT ${limitNum} OFFSET ${offsetNum}`,
    params
  );

  // Fetch sizes for all returned products
  if (rows.length > 0) {
    const productIds = rows.map(r => r.id);
    const [sizeRows] = await pool.query(
      `SELECT product_id, size_label FROM product_sizes WHERE product_id IN (${productIds.map(() => '?').join(',')})`,
      productIds
    );

    const sizeMap = {};
    for (const sr of sizeRows) {
      if (!sizeMap[sr.product_id]) sizeMap[sr.product_id] = [];
      sizeMap[sr.product_id].push(sr.size_label);
    }

    for (const row of rows) {
      row.sizes = sizeMap[row.id] || [];
    }
  }

  return { products: rows, total, page: Number(page), limit: Number(limit) };
}

/**
 * Get a single product by ID with its sizes.
 */
export async function findProductById(id) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT * FROM products WHERE id = ? AND is_active = TRUE',
    [id]
  );

  if (rows.length === 0) return null;

  const product = rows[0];

  // Get sizes
  const [sizeRows] = await pool.execute(
    'SELECT size_label FROM product_sizes WHERE product_id = ?',
    [id]
  );
  product.sizes = sizeRows.map(r => r.size_label);

  return product;
}

/**
 * Get bestseller products.
 */
export async function findBestsellers(limit = 8) {
  const pool = getPool();
  const limitNum = Number(limit);
  const [rows] = await pool.query(
    `SELECT * FROM products WHERE is_bestseller = TRUE AND is_active = TRUE ORDER BY rating DESC LIMIT ${limitNum}`
  );

  // Fetch sizes
  if (rows.length > 0) {
    const productIds = rows.map(r => r.id);
    const [sizeRows] = await pool.query(
      `SELECT product_id, size_label FROM product_sizes WHERE product_id IN (${productIds.map(() => '?').join(',')})`,
      productIds
    );

    const sizeMap = {};
    for (const sr of sizeRows) {
      if (!sizeMap[sr.product_id]) sizeMap[sr.product_id] = [];
      sizeMap[sr.product_id].push(sr.size_label);
    }

    for (const row of rows) {
      row.sizes = sizeMap[row.id] || [];
    }
  }

  return rows;
}
