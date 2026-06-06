import { getPool } from '../config/db.js';

/**
 * Create or update a network hierarchy record for a customer.
 * Upserts so each customer has exactly one hierarchy entry.
 */
export async function createOrUpdateHierarchy(customerId, hierarchy) {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO network_hierarchy (customer_id, trainer_id, area_distributor_id, gym_id, city_distributor_id)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       trainer_id = VALUES(trainer_id),
       area_distributor_id = VALUES(area_distributor_id),
       gym_id = VALUES(gym_id),
       city_distributor_id = VALUES(city_distributor_id)`,
    [
      customerId,
      hierarchy.trainer_id || null,
      hierarchy.area_distributor_id || null,
      hierarchy.gym_id || null,
      hierarchy.city_distributor_id || null,
    ]
  );
}

/**
 * Find the hierarchy record for a customer.
 */
export async function findHierarchyByCustomerId(customerId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT nh.*,
            tu.name as trainer_name,
            gu.name as gym_name, gd.facility_name,
            cu.name as city_distributor_name, cd.city_name
     FROM network_hierarchy nh
     LEFT JOIN trainers t ON nh.trainer_id = t.id
     LEFT JOIN users tu ON t.user_id = tu.id
     LEFT JOIN gym_distributors gd ON nh.area_distributor_id = gd.id
     LEFT JOIN users gu ON gd.user_id = gu.id
     LEFT JOIN city_distributors cd ON nh.city_distributor_id = cd.id
     LEFT JOIN users cu ON cd.user_id = cu.id
     WHERE nh.customer_id = ?`,
    [customerId]
  );
  return rows[0] || null;
}

/**
 * Find all hierarchy records for a trainer (all their customers).
 */
export async function findHierarchyByTrainer(trainerId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT nh.*, u.name as customer_name, u.email as customer_email
     FROM network_hierarchy nh
     JOIN customers c ON nh.customer_id = c.id
     JOIN users u ON c.user_id = u.id
     WHERE nh.trainer_id = ?
     ORDER BY nh.created_at DESC`,
    [trainerId]
  );
  return rows;
}

/**
 * Find all hierarchy records under a city distributor.
 */
export async function findHierarchyByCityDistributor(cdId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT nh.*, 
            u.name as customer_name,
            tu.name as trainer_name,
            gu.name as gym_name
     FROM network_hierarchy nh
     JOIN customers c ON nh.customer_id = c.id
     JOIN users u ON c.user_id = u.id
     LEFT JOIN trainers t ON nh.trainer_id = t.id
     LEFT JOIN users tu ON t.user_id = tu.id
     LEFT JOIN gym_distributors gd ON nh.area_distributor_id = gd.id
     LEFT JOIN users gu ON gd.user_id = gu.id
     WHERE nh.city_distributor_id = ?
     ORDER BY nh.created_at DESC`,
    [cdId]
  );
  return rows;
}

/**
 * Find all hierarchy records under a gym distributor.
 */
export async function findHierarchyByGymDistributor(gdId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT nh.*, 
            u.name as customer_name,
            tu.name as trainer_name
     FROM network_hierarchy nh
     JOIN customers c ON nh.customer_id = c.id
     JOIN users u ON c.user_id = u.id
     LEFT JOIN trainers t ON nh.trainer_id = t.id
     LEFT JOIN users tu ON t.user_id = tu.id
     WHERE nh.area_distributor_id = ?
     ORDER BY nh.created_at DESC`,
    [gdId]
  );
  return rows;
}

/**
 * Count total hierarchy records (for analytics).
 */
export async function countHierarchyRecords() {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM network_hierarchy');
  return rows[0].count;
}
