import { getPool } from '../config/db.js';
import crypto from 'crypto';

function generateReferralCode(prefix = 'TR') {
  return `${prefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

/**
 * Create a trainer profile.
 */
export async function createTrainer(userId, data) {
  const pool = getPool();
  const referralCode = data.referral_code || generateReferralCode('TR');
  const [result] = await pool.execute(
    `INSERT INTO trainers (user_id, gym_distributor_id, trainer_type, certification_name, certificate_number, certificate_document, is_verified, bank_details, referral_code)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      data.gym_distributor_id || null,
      data.trainer_type || 'gym_trainer',
      data.certification_name || null,
      data.certificate_number || null,
      data.certificate_document || null,
      data.is_verified || false,
      data.bank_details || null,
      referralCode
    ]
  );
  return { id: result.insertId, user_id: userId, referral_code: referralCode };
}

/**
 * Find trainer by user ID.
 */
export async function findTrainerByUserId(userId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT t.*, u.name, u.email, u.phone, u.mobile, u.profile_image, u.status,
            gd.facility_name as gym_name, gdu.name as gym_distributor_name
     FROM trainers t 
     JOIN users u ON t.user_id = u.id 
     LEFT JOIN gym_distributors gd ON t.gym_distributor_id = gd.id
     LEFT JOIN users gdu ON gd.user_id = gdu.id
     WHERE t.user_id = ?`,
    [userId]
  );
  return rows[0] || null;
}

/**
 * Find trainer by referral code.
 */
export async function findTrainerByReferralCode(code) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT t.*, u.name, u.email 
     FROM trainers t 
     JOIN users u ON t.user_id = u.id 
     WHERE t.referral_code = ?`,
    [code]
  );
  return rows[0] || null;
}

/**
 * Find all trainers.
 */
export async function findAllTrainers(limit = 50, offset = 0) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT t.*, u.name, u.email, u.phone, u.status, u.profile_image,
            gd.facility_name as gym_name
     FROM trainers t 
     JOIN users u ON t.user_id = u.id 
     LEFT JOIN gym_distributors gd ON t.gym_distributor_id = gd.id
     ORDER BY t.created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`
  );
  return rows;
}

/**
 * Count all trainers.
 */
export async function countTrainers() {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM trainers');
  return rows[0].count;
}

/**
 * Find trainers by gym distributor.
 */
export async function findTrainersByGymDistributor(gymDistId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT t.*, u.name, u.email, u.status 
     FROM trainers t 
     JOIN users u ON t.user_id = u.id 
     WHERE t.gym_distributor_id = ?
     ORDER BY t.created_at DESC`,
    [gymDistId]
  );
  return rows;
}

/**
 * Update trainer profile.
 */
export async function updateTrainer(userId, updates) {
  const pool = getPool();
  const allowed = ['trainer_type', 'certification_name', 'certificate_number', 'certificate_document', 'is_verified', 'bank_details'];
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
  await pool.execute(`UPDATE trainers SET ${fields.join(', ')} WHERE user_id = ?`, values);
}

/**
 * Get dashboard stats for a trainer.
 */
export async function getTrainerDashboardStats(trainerId, userId) {
  const pool = getPool();

  // Customer count
  const [custCount] = await pool.execute(
    'SELECT COUNT(*) as count FROM customers WHERE trainer_id = ?', [trainerId]
  );

  // Orders through trainer_id
  const [orderStats] = await pool.execute(
    `SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue 
     FROM orders WHERE trainer_id = ?`, [trainerId]
  );

  // Commissions
  const [commStats] = await pool.execute(
    `SELECT COALESCE(SUM(amount), 0) as total_commission,
            COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_commission,
            COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as paid_commission
     FROM commissions WHERE user_id = ?`, [userId]
  );

  // Top customers
  const [topCustomers] = await pool.execute(
    `SELECT c.*, u.name, u.email, c.total_orders, c.sales_total
     FROM customers c 
     JOIN users u ON c.user_id = u.id 
     WHERE c.trainer_id = ?
     ORDER BY c.sales_total DESC LIMIT 5`, [trainerId]
  );

  // Referral code
  const [trainerData] = await pool.execute(
    'SELECT referral_code FROM trainers WHERE id = ?', [trainerId]
  );

  return {
    customers: custCount[0].count,
    orders: orderStats[0].count,
    revenue: Number(orderStats[0].revenue),
    total_commission: Number(commStats[0].total_commission),
    pending_commission: Number(commStats[0].pending_commission),
    paid_commission: Number(commStats[0].paid_commission),
    top_customers: topCustomers,
    referral_code: trainerData[0]?.referral_code || null
  };
}

/**
 * Update sales total.
 */
export async function updateTrainerSales(id, amount) {
  const pool = getPool();
  await pool.execute(
    'UPDATE trainers SET sales_total = sales_total + ? WHERE id = ?',
    [amount, id]
  );
}
