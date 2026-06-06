import { getPool } from '../config/db.js';

// Commission percentages by role
const COMMISSION_RATES = {
  TRAINER_OR_RETAILER: 10,    // 10%
  GYM_OR_AREA_DISTRIBUTOR: 5, // 5%
  CITY_DISTRIBUTOR: 3,        // 3%
};

/**
 * Calculate and create commission entries for an order.
 * @param {number} orderId 
 * @param {number} orderTotal 
 * @param {object} hierarchy - { trainer_id, gym_distributor_id, city_distributor_id }
 */
export async function createCommissionsForOrder(orderId, orderTotal, hierarchy) {
  const pool = getPool();
  const commissions = [];

  // Trainer commission
  if (hierarchy.trainer_id) {
    const [trainerRows] = await pool.execute(
      'SELECT user_id FROM trainers WHERE id = ?', [hierarchy.trainer_id]
    );
    if (trainerRows.length > 0) {
      const rate = COMMISSION_RATES.TRAINER_OR_RETAILER;
      const amount = (orderTotal * rate) / 100;
      await pool.execute(
        `INSERT INTO commissions (order_id, user_id, role, amount, percentage) VALUES (?, ?, ?, ?, ?)`,
        [orderId, trainerRows[0].user_id, 'TRAINER_OR_RETAILER', amount, rate]
      );
      commissions.push({ role: 'TRAINER_OR_RETAILER', amount, rate });
    }
  }

  // Gym distributor commission
  if (hierarchy.gym_distributor_id) {
    const [gymRows] = await pool.execute(
      'SELECT user_id FROM gym_distributors WHERE id = ?', [hierarchy.gym_distributor_id]
    );
    if (gymRows.length > 0) {
      const rate = COMMISSION_RATES.GYM_OR_AREA_DISTRIBUTOR;
      const amount = (orderTotal * rate) / 100;
      await pool.execute(
        `INSERT INTO commissions (order_id, user_id, role, amount, percentage) VALUES (?, ?, ?, ?, ?)`,
        [orderId, gymRows[0].user_id, 'GYM_OR_AREA_DISTRIBUTOR', amount, rate]
      );
      commissions.push({ role: 'GYM_OR_AREA_DISTRIBUTOR', amount, rate });
    }
  }

  // City distributor commission
  if (hierarchy.city_distributor_id) {
    const [cdRows] = await pool.execute(
      'SELECT user_id FROM city_distributors WHERE id = ?', [hierarchy.city_distributor_id]
    );
    if (cdRows.length > 0) {
      const rate = COMMISSION_RATES.CITY_DISTRIBUTOR;
      const amount = (orderTotal * rate) / 100;
      await pool.execute(
        `INSERT INTO commissions (order_id, user_id, role, amount, percentage) VALUES (?, ?, ?, ?, ?)`,
        [orderId, cdRows[0].user_id, 'CITY_DISTRIBUTOR', amount, rate]
      );
      commissions.push({ role: 'CITY_DISTRIBUTOR', amount, rate });
    }
  }

  return commissions;
}

/**
 * Find commissions by user ID.
 */
export async function findCommissionsByUserId(userId, limit = 50, offset = 0) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT c.*, o.total as order_total, o.created_at as order_date
     FROM commissions c 
     JOIN orders o ON c.order_id = o.id
     WHERE c.user_id = ?
     ORDER BY c.created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
    [userId]
  );
  return rows;
}

/**
 * Find commissions by order ID.
 */
export async function findCommissionsByOrderId(orderId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT c.*, u.name, u.email
     FROM commissions c 
     JOIN users u ON c.user_id = u.id
     WHERE c.order_id = ?`,
    [orderId]
  );
  return rows;
}

/**
 * Get commission summary for a user.
 */
export async function getCommissionSummary(userId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT 
       COALESCE(SUM(amount), 0) as total_earned,
       COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending,
       COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as paid,
       COUNT(*) as total_transactions
     FROM commissions WHERE user_id = ?`,
    [userId]
  );
  return rows[0];
}

/**
 * Mark commission as paid.
 */
export async function markCommissionPaid(commissionId) {
  const pool = getPool();
  await pool.execute(
    `UPDATE commissions SET status = 'paid', paid_at = NOW() WHERE id = ?`,
    [commissionId]
  );
}

/**
 * Get all commission breakdown (admin view).
 */
export async function getAllCommissionBreakdown(limit = 50, offset = 0) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT c.*, u.name, u.email, u.role as user_role, o.total as order_total
     FROM commissions c 
     JOIN users u ON c.user_id = u.id
     JOIN orders o ON c.order_id = o.id
     ORDER BY c.created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`
  );

  const [summary] = await pool.execute(
    `SELECT 
       COALESCE(SUM(amount), 0) as total_paid_out,
       COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as total_pending
     FROM commissions`
  );

  return { commissions: rows, summary: summary[0] };
}
