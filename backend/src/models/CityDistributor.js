import { getPool } from '../config/db.js';
import crypto from 'crypto';

/**
 * Generate a unique referral code for city distributor.
 */
function generateReferralCode(prefix = 'CD') {
  return `${prefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

/**
 * Create a city distributor profile.
 */
export async function createCityDistributor(userId, data) {
  const pool = getPool();
  const referralCode = data.referral_code || generateReferralCode('CD');
  const [result] = await pool.execute(
    `INSERT INTO city_distributors (user_id, city_name, address, bank_account, ifsc_code, pan_number, referral_code)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, data.city_name, data.address || null, data.bank_account || null, data.ifsc_code || null, data.pan_number || null, referralCode]
  );
  return { id: result.insertId, user_id: userId, referral_code: referralCode };
}

/**
 * Find city distributor by user ID.
 */
export async function findCityDistributorByUserId(userId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT cd.*, u.name, u.email, u.phone, u.mobile, u.profile_image, u.status 
     FROM city_distributors cd 
     JOIN users u ON cd.user_id = u.id 
     WHERE cd.user_id = ?`,
    [userId]
  );
  return rows[0] || null;
}

/**
 * Find city distributor by referral code.
 */
export async function findCityDistributorByReferralCode(code) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT cd.*, u.name, u.email 
     FROM city_distributors cd 
     JOIN users u ON cd.user_id = u.id 
     WHERE cd.referral_code = ?`,
    [code]
  );
  return rows[0] || null;
}

/**
 * Find all city distributors.
 */
export async function findAllCityDistributors(limit = 50, offset = 0) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT cd.*, u.name, u.email, u.phone, u.status, u.profile_image
     FROM city_distributors cd 
     JOIN users u ON cd.user_id = u.id 
     ORDER BY cd.created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`
  );
  return rows;
}

/**
 * Count all city distributors.
 */
export async function countCityDistributors() {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM city_distributors');
  return rows[0].count;
}

/**
 * Update city distributor profile.
 */
export async function updateCityDistributor(userId, updates) {
  const pool = getPool();
  const allowed = ['city_name', 'address', 'bank_account', 'ifsc_code', 'pan_number'];
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
  await pool.execute(`UPDATE city_distributors SET ${fields.join(', ')} WHERE user_id = ?`, values);
}

/**
 * Get network under a city distributor (all gyms, trainers, customers).
 */
export async function getCityDistributorNetwork(cityDistId) {
  const pool = getPool();
  
  // Get gyms under this city dist
  const [gyms] = await pool.execute(
    `SELECT gd.*, u.name, u.email, u.status 
     FROM gym_distributors gd 
     JOIN users u ON gd.user_id = u.id 
     WHERE gd.city_distributor_id = ?
     ORDER BY gd.created_at DESC`,
    [cityDistId]
  );

  // Get trainers under those gyms
  const gymIds = gyms.map(g => g.id);
  let trainers = [];
  if (gymIds.length > 0) {
    const [trainerRows] = await pool.query(
      `SELECT t.*, u.name, u.email, u.status, gd.facility_name as gym_name
       FROM trainers t 
       JOIN users u ON t.user_id = u.id 
       LEFT JOIN gym_distributors gd ON t.gym_distributor_id = gd.id
       WHERE t.gym_distributor_id IN (${gymIds.map(() => '?').join(',')})
       ORDER BY t.created_at DESC`,
      gymIds
    );
    trainers = trainerRows;
  }

  // Get customers under those trainers
  const trainerIds = trainers.map(t => t.id);
  let customers = [];
  if (trainerIds.length > 0) {
    const [custRows] = await pool.query(
      `SELECT c.*, u.name, u.email, u.status
       FROM customers c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.trainer_id IN (${trainerIds.map(() => '?').join(',')})
       ORDER BY c.created_at DESC`,
      trainerIds
    );
    customers = custRows;
  }

  return { gyms, trainers, customers };
}

/**
 * Get dashboard stats for a city distributor.
 */
export async function getCityDistributorDashboardStats(cityDistId, userId) {
  const pool = getPool();

  // Gym count
  const [gymCount] = await pool.execute(
    'SELECT COUNT(*) as count FROM gym_distributors WHERE city_distributor_id = ?', [cityDistId]
  );

  // Get gym IDs for further queries
  const [gymRows] = await pool.execute(
    'SELECT id FROM gym_distributors WHERE city_distributor_id = ?', [cityDistId]
  );
  const gymIds = gymRows.map(g => g.id);

  let trainerCount = 0;
  let customerCount = 0;
  let orderCount = 0;
  let revenue = 0;

  if (gymIds.length > 0) {
    const placeholders = gymIds.map(() => '?').join(',');
    
    const [tc] = await pool.query(
      `SELECT COUNT(*) as count FROM trainers WHERE gym_distributor_id IN (${placeholders})`, gymIds
    );
    trainerCount = tc[0].count;

    // Get trainer IDs
    const [trainerRows] = await pool.query(
      `SELECT id FROM trainers WHERE gym_distributor_id IN (${placeholders})`, gymIds
    );
    const trainerIds = trainerRows.map(t => t.id);

    if (trainerIds.length > 0) {
      const tPlaceholders = trainerIds.map(() => '?').join(',');
      const [cc] = await pool.query(
        `SELECT COUNT(*) as count FROM customers WHERE trainer_id IN (${tPlaceholders})`, trainerIds
      );
      customerCount = cc[0].count;
    }
  }

  // Orders and revenue through city_distributor_id on orders
  const [orderStats] = await pool.execute(
    `SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue 
     FROM orders WHERE city_distributor_id = ?`, [cityDistId]
  );
  orderCount = orderStats[0].count;
  revenue = orderStats[0].revenue;

  // Commissions
  const [commStats] = await pool.execute(
    `SELECT COALESCE(SUM(amount), 0) as total_commission 
     FROM commissions WHERE user_id = ?`, [userId]
  );

  return {
    gyms: gymCount[0].count,
    trainers: trainerCount,
    customers: customerCount,
    orders: orderCount,
    revenue: Number(revenue),
    commission: Number(commStats[0].total_commission)
  };
}

/**
 * Update sales total.
 */
export async function updateCityDistributorSales(id, amount) {
  const pool = getPool();
  await pool.execute(
    'UPDATE city_distributors SET sales_total = sales_total + ? WHERE id = ?',
    [amount, id]
  );
}
