import { getPool } from '../config/db.js';

/**
 * Create a referral mapping.
 */
export async function createReferralMapping(userId, referrerId, referrerRole, referralCode) {
  const pool = getPool();
  const [result] = await pool.execute(
    `INSERT INTO referral_mappings (user_id, referrer_id, referrer_role, referral_code_used)
     VALUES (?, ?, ?, ?)`,
    [userId, referrerId, referrerRole, referralCode]
  );
  return { id: result.insertId };
}

/**
 * Find referral mapping by user ID.
 */
export async function findReferralByUserId(userId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT rm.*, u.name as referrer_name, u.email as referrer_email, u.role as referrer_user_role
     FROM referral_mappings rm 
     JOIN users u ON rm.referrer_id = u.id 
     WHERE rm.user_id = ?`,
    [userId]
  );
  return rows[0] || null;
}

/**
 * Find all referrals made by a referrer.
 */
export async function findReferralsByReferrer(referrerId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT rm.*, u.name, u.email, u.role 
     FROM referral_mappings rm 
     JOIN users u ON rm.user_id = u.id 
     WHERE rm.referrer_id = ?
     ORDER BY rm.created_at DESC`,
    [referrerId]
  );
  return rows;
}

/**
 * Validate a referral code — checks across all role tables.
 * Returns { valid, referrer_id, referrer_role, referrer_name }
 */
export async function validateReferralCode(code) {
  const pool = getPool();

  // Check city distributor codes
  const [cd] = await pool.execute(
    `SELECT cd.user_id as referrer_id, u.name as referrer_name, 'CITY_DISTRIBUTOR' as referrer_role
     FROM city_distributors cd JOIN users u ON cd.user_id = u.id
     WHERE cd.referral_code = ?`,
    [code]
  );
  if (cd.length > 0) return { valid: true, ...cd[0] };

  // Check gym distributor codes
  const [gd] = await pool.execute(
    `SELECT gd.user_id as referrer_id, u.name as referrer_name, 'GYM_OR_AREA_DISTRIBUTOR' as referrer_role
     FROM gym_distributors gd JOIN users u ON gd.user_id = u.id
     WHERE gd.referral_code = ?`,
    [code]
  );
  if (gd.length > 0) return { valid: true, ...gd[0] };

  // Check trainer codes
  const [tr] = await pool.execute(
    `SELECT t.user_id as referrer_id, u.name as referrer_name, 'TRAINER_OR_RETAILER' as referrer_role
     FROM trainers t JOIN users u ON t.user_id = u.id
     WHERE t.referral_code = ?`,
    [code]
  );
  if (tr.length > 0) return { valid: true, ...tr[0] };

  return { valid: false };
}

/**
 * Resolve the full referral hierarchy for an order.
 * Given a customer's user_id, resolve: trainer → gym → city distributor.
 * Returns { trainer_id, gym_distributor_id, city_distributor_id }
 */
export async function resolveOrderHierarchy(customerUserId) {
  const pool = getPool();

  // Get customer's trainer
  const [custRows] = await pool.execute(
    'SELECT trainer_id FROM customers WHERE user_id = ?',
    [customerUserId]
  );

  if (custRows.length === 0 || !custRows[0].trainer_id) {
    return { trainer_id: null, gym_distributor_id: null, city_distributor_id: null };
  }

  const trainerId = custRows[0].trainer_id;

  // Get trainer's gym distributor
  const [trainerRows] = await pool.execute(
    'SELECT gym_distributor_id FROM trainers WHERE id = ?',
    [trainerId]
  );

  const gymDistributorId = trainerRows[0]?.gym_distributor_id || null;

  // Get gym's city distributor
  let cityDistributorId = null;
  if (gymDistributorId) {
    const [gymRows] = await pool.execute(
      'SELECT city_distributor_id FROM gym_distributors WHERE id = ?',
      [gymDistributorId]
    );
    cityDistributorId = gymRows[0]?.city_distributor_id || null;
  }

  return { trainer_id: trainerId, gym_distributor_id: gymDistributorId, city_distributor_id: cityDistributorId };
}

/**
 * Count referrals by referrer.
 */
export async function countReferralsByReferrer(referrerId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM referral_mappings WHERE referrer_id = ?',
    [referrerId]
  );
  return rows[0].count;
}
