import { getPool } from '../config/db.js';

/**
 * Get the active commission rate for a given role and product category.
 * Falls back to the wildcard '*' category if no specific category rule is found.
 */
export async function getRuleByRoleAndCategory(role, category = '*') {
  const pool = getPool();

  // Try exact category match first
  if (category && category !== '*') {
    const [rows] = await pool.execute(
      `SELECT * FROM commission_rules WHERE role = ? AND product_category = ? AND active = TRUE LIMIT 1`,
      [role, category]
    );
    if (rows.length > 0) return rows[0];
  }

  // Fallback to wildcard
  const [rows] = await pool.execute(
    `SELECT * FROM commission_rules WHERE role = ? AND product_category = '*' AND active = TRUE LIMIT 1`,
    [role]
  );
  return rows[0] || null;
}

/**
 * Get all active commission rules.
 */
export async function getActiveRules() {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT * FROM commission_rules WHERE active = TRUE ORDER BY role, product_category'
  );
  return rows;
}

/**
 * Get all commission rules (admin view — includes inactive).
 */
export async function getAllRules() {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT * FROM commission_rules ORDER BY role, product_category, active DESC'
  );
  return rows;
}

/**
 * Create a new commission rule.
 */
export async function createRule(role, commissionPercent, productCategory = '*') {
  const pool = getPool();
  const [result] = await pool.execute(
    `INSERT INTO commission_rules (role, commission_percent, product_category, active)
     VALUES (?, ?, ?, TRUE)`,
    [role, commissionPercent, productCategory]
  );
  return { id: result.insertId, role, commission_percent: commissionPercent, product_category: productCategory, active: true };
}

/**
 * Update an existing commission rule.
 */
export async function updateRule(id, updates) {
  const pool = getPool();
  const allowed = ['commission_percent', 'product_category', 'active'];
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (allowed.includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return null;

  values.push(id);
  await pool.execute(
    `UPDATE commission_rules SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  // Return updated rule
  const [rows] = await pool.execute('SELECT * FROM commission_rules WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Deactivate a commission rule (soft delete).
 */
export async function deactivateRule(id) {
  const pool = getPool();
  await pool.execute('UPDATE commission_rules SET active = FALSE WHERE id = ?', [id]);
}

/**
 * Find a rule by ID.
 */
export async function findRuleById(id) {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT * FROM commission_rules WHERE id = ?', [id]);
  return rows[0] || null;
}
