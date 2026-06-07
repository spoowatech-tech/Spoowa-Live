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
 * Handles:
 *   - Trainer referral: trainer → gym → city
 *   - Gym referral (direct): no trainer, gym → city
 *   - City referral (direct): no trainer, no gym, just city
 * Returns { trainer_id, gym_distributor_id, city_distributor_id }
 */
export async function resolveOrderHierarchy(customerUserId) {
  const pool = getPool();

  // First check referral mapping to know the referrer's role
  const [refMap] = await pool.execute(
    'SELECT referrer_id, referrer_role FROM referral_mappings WHERE user_id = ?',
    [customerUserId]
  );

  if (refMap.length === 0) {
    return { trainer_id: null, gym_distributor_id: null, city_distributor_id: null };
  }

  const { referrer_id, referrer_role } = refMap[0];

  // Case 1: Referred by a TRAINER
  if (referrer_role === 'TRAINER_OR_RETAILER') {
    const [custRows] = await pool.execute('SELECT trainer_id FROM customers WHERE user_id = ?', [customerUserId]);
    const trainerId = custRows[0]?.trainer_id || null;

    let gymDistributorId = null;
    let cityDistributorId = null;

    if (trainerId) {
      const [trainerRows] = await pool.execute('SELECT gym_distributor_id FROM trainers WHERE id = ?', [trainerId]);
      gymDistributorId = trainerRows[0]?.gym_distributor_id || null;

      if (gymDistributorId) {
        const [gymRows] = await pool.execute('SELECT city_distributor_id FROM gym_distributors WHERE id = ?', [gymDistributorId]);
        cityDistributorId = gymRows[0]?.city_distributor_id || null;
      }
    }

    return { trainer_id: trainerId, gym_distributor_id: gymDistributorId, city_distributor_id: cityDistributorId };
  }

  // Case 2: Referred by a GYM (direct — skip trainer)
  if (referrer_role === 'GYM_OR_AREA_DISTRIBUTOR') {
    const [gdRows] = await pool.execute('SELECT id, city_distributor_id FROM gym_distributors WHERE user_id = ?', [referrer_id]);
    const gymDistributorId = gdRows[0]?.id || null;
    const cityDistributorId = gdRows[0]?.city_distributor_id || null;

    return { trainer_id: null, gym_distributor_id: gymDistributorId, city_distributor_id: cityDistributorId };
  }

  // Case 3: Referred by a CITY DISTRIBUTOR (direct — skip trainer & gym)
  if (referrer_role === 'CITY_DISTRIBUTOR') {
    const [cdRows] = await pool.execute('SELECT id FROM city_distributors WHERE user_id = ?', [referrer_id]);
    const cityDistributorId = cdRows[0]?.id || null;

    return { trainer_id: null, gym_distributor_id: null, city_distributor_id: cityDistributorId };
  }

  return { trainer_id: null, gym_distributor_id: null, city_distributor_id: null };
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
