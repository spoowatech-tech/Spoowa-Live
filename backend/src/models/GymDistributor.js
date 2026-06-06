import { getPool } from '../config/db.js';
import crypto from 'crypto';

function generateReferralCode(prefix = 'GD') {
  return `${prefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

/**
 * Create a gym distributor profile.
 */
export async function createGymDistributor(userId, data) {
  const pool = getPool();
  const referralCode = data.referral_code || generateReferralCode('GD');
  const [result] = await pool.execute(
    `INSERT INTO gym_distributors (user_id, city_distributor_id, facility_name, contact_person, address, bank_details, is_certified, certification_document, referral_code)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      data.city_distributor_id || null,
      data.facility_name,
      data.contact_person || null,
      data.address || null,
      data.bank_details || null,
      data.is_certified || false,
      data.certification_document || null,
      referralCode
    ]
  );
  return { id: result.insertId, user_id: userId, referral_code: referralCode };
}

/**
 * Find gym distributor by user ID.
 */
export async function findGymDistributorByUserId(userId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT gd.*, u.name, u.email, u.phone, u.mobile, u.profile_image, u.status,
            cd.city_name as city_distributor_city, cdu.name as city_distributor_name
     FROM gym_distributors gd 
     JOIN users u ON gd.user_id = u.id 
     LEFT JOIN city_distributors cd ON gd.city_distributor_id = cd.id
     LEFT JOIN users cdu ON cd.user_id = cdu.id
     WHERE gd.user_id = ?`,
    [userId]
  );
  return rows[0] || null;
}

/**
 * Find gym distributor by referral code.
 */
export async function findGymDistributorByReferralCode(code) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT gd.*, u.name, u.email 
     FROM gym_distributors gd 
     JOIN users u ON gd.user_id = u.id 
     WHERE gd.referral_code = ?`,
    [code]
  );
  return rows[0] || null;
}

/**
 * Find all gym distributors.
 */
export async function findAllGymDistributors(limit = 50, offset = 0) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT gd.*, u.name, u.email, u.phone, u.status, u.profile_image,
            cd.city_name, cdu.name as city_distributor_name
     FROM gym_distributors gd 
     JOIN users u ON gd.user_id = u.id 
     LEFT JOIN city_distributors cd ON gd.city_distributor_id = cd.id
     LEFT JOIN users cdu ON cd.user_id = cdu.id
     ORDER BY gd.created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`
  );
  return rows;
}

/**
 * Count all gym distributors.
 */
export async function countGymDistributors() {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM gym_distributors');
  return rows[0].count;
}

/**
 * Find gyms by city distributor.
 */
export async function findGymsByCityDistributor(cityDistId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT gd.*, u.name, u.email, u.status 
     FROM gym_distributors gd 
     JOIN users u ON gd.user_id = u.id 
     WHERE gd.city_distributor_id = ?
     ORDER BY gd.created_at DESC`,
    [cityDistId]
  );
  return rows;
}

/**
 * Update gym distributor.
 */
export async function updateGymDistributor(userId, updates) {
  const pool = getPool();
  const allowed = ['facility_name', 'contact_person', 'address', 'bank_details', 'is_certified', 'certification_document'];
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
  await pool.execute(`UPDATE gym_distributors SET ${fields.join(', ')} WHERE user_id = ?`, values);
}

/**
 * Get dashboard stats for a gym distributor.
 */
export async function getGymDistributorDashboardStats(gymDistId, userId) {
  const pool = getPool();

  // Trainer count
  const [trainerCount] = await pool.execute(
    'SELECT COUNT(*) as count FROM trainers WHERE gym_distributor_id = ?', [gymDistId]
  );

  // Get trainer IDs
  const [trainerRows] = await pool.execute(
    'SELECT id FROM trainers WHERE gym_distributor_id = ?', [gymDistId]
  );
  const trainerIds = trainerRows.map(t => t.id);

  let customerCount = 0;
  if (trainerIds.length > 0) {
    const placeholders = trainerIds.map(() => '?').join(',');
    const [cc] = await pool.query(
      `SELECT COUNT(*) as count FROM customers WHERE trainer_id IN (${placeholders})`, trainerIds
    );
    customerCount = cc[0].count;
  }

  // Orders through gym_distributor_id
  const [orderStats] = await pool.execute(
    `SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue 
     FROM orders WHERE gym_distributor_id = ?`, [gymDistId]
  );

  // Commissions
  const [commStats] = await pool.execute(
    `SELECT COALESCE(SUM(amount), 0) as total_commission 
     FROM commissions WHERE user_id = ?`, [userId]
  );

  return {
    trainers: trainerCount[0].count,
    customers: customerCount,
    orders: orderStats[0].count,
    revenue: Number(orderStats[0].revenue),
    commission: Number(commStats[0].total_commission)
  };
}

/**
 * Update sales total.
 */
export async function updateGymDistributorSales(id, amount) {
  const pool = getPool();
  await pool.execute(
    'UPDATE gym_distributors SET sales_total = sales_total + ? WHERE id = ?',
    [amount, id]
  );
}
