import { getPool } from '../config/db.js';

/**
 * Create a customer profile.
 */
export async function createCustomer(userId, data = {}) {
  const pool = getPool();
  const [result] = await pool.execute(
    `INSERT INTO customers (user_id, trainer_id, address)
     VALUES (?, ?, ?)`,
    [userId, data.trainer_id || null, data.address || null]
  );
  return { id: result.insertId, user_id: userId };
}

/**
 * Find customer by user ID.
 */
export async function findCustomerByUserId(userId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT c.*, u.name, u.email, u.phone, u.mobile, u.profile_image, u.status,
            t.referral_code as trainer_referral_code, tu.name as trainer_name
     FROM customers c 
     JOIN users u ON c.user_id = u.id 
     LEFT JOIN trainers t ON c.trainer_id = t.id
     LEFT JOIN users tu ON t.user_id = tu.id
     WHERE c.user_id = ?`,
    [userId]
  );
  return rows[0] || null;
}

/**
 * Find all customers.
 */
export async function findAllCustomers(limit = 50, offset = 0) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT c.*, u.name, u.email, u.phone, u.status
     FROM customers c 
     JOIN users u ON c.user_id = u.id 
     ORDER BY c.created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`
  );
  return rows;
}

/**
 * Count all customers.
 */
export async function countCustomers() {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM customers');
  return rows[0].count;
}

/**
 * Find customers by trainer.
 */
export async function findCustomersByTrainer(trainerId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT c.*, u.name, u.email, u.phone, u.status 
     FROM customers c 
     JOIN users u ON c.user_id = u.id 
     WHERE c.trainer_id = ?
     ORDER BY c.created_at DESC`,
    [trainerId]
  );
  return rows;
}

/**
 * Update customer profile.
 */
export async function updateCustomer(userId, updates) {
  const pool = getPool();
  const allowed = ['address', 'trainer_id'];
  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(updates)) {
    if (allowed.includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }
  if (fields.length === 0) return;
  values.push(userId);
  await pool.execute(`UPDATE customers SET ${fields.join(', ')} WHERE user_id = ?`, values);
}

/**
 * Increment customer order stats.
 */
export async function incrementCustomerOrderStats(userId, orderTotal) {
  const pool = getPool();
  await pool.execute(
    'UPDATE customers SET total_orders = total_orders + 1, sales_total = sales_total + ? WHERE user_id = ?',
    [orderTotal, userId]
  );
}

/**
 * Get customer account data.
 */
export async function getCustomerAccountData(userId) {
  const pool = getPool();
  
  const customer = await findCustomerByUserId(userId);
  
  // Recent orders
  const [orders] = await pool.execute(
    `SELECT id, subtotal, total, status, created_at 
     FROM orders WHERE user_id = ? 
     ORDER BY created_at DESC LIMIT 10`,
    [userId]
  );

  // Saved addresses
  const [addresses] = await pool.execute(
    `SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC`,
    [userId]
  );

  // Referral info
  const [referral] = await pool.execute(
    `SELECT rm.*, u.name as referrer_name 
     FROM referral_mappings rm 
     LEFT JOIN users u ON rm.referrer_id = u.id 
     WHERE rm.user_id = ?`,
    [userId]
  );

  return {
    profile: customer,
    orders,
    addresses,
    referral: referral[0] || null,
    total_orders: customer?.total_orders || 0,
    total_spent: customer?.sales_total || 0
  };
}
