import { findAllUsers, countAllUsers, findUsersByRole, countUsersByRole, findUserById, updateUserRole as updateRole, updateUserStatus } from '../models/User.js';

/**
 * GET /api/roles/users
 * Get all users (Super Admin only).
 */
export async function getAllUsers(req, res) {
  const { page = 1, limit = 50, role } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let users, total;
  if (role) {
    users = await findUsersByRole(role, Number(limit), offset);
    total = await countUsersByRole(role);
  } else {
    users = await findAllUsers(Number(limit), offset);
    total = await countAllUsers();
  }

  res.json({
    users,
    total,
    page: Number(page),
    limit: Number(limit),
  });
}

/**
 * GET /api/roles/users/:role
 * Get users by a specific role.
 */
export async function getUsersByRole(req, res) {
  const { role } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const validRoles = ['SUPER_ADMIN', 'CITY_DISTRIBUTOR', 'GYM_OR_AREA_DISTRIBUTOR', 'TRAINER_OR_RETAILER', 'CUSTOMER'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role.' });
  }

  const users = await findUsersByRole(role, Number(limit), offset);
  const total = await countUsersByRole(role);

  res.json({ users, total, page: Number(page), limit: Number(limit) });
}

/**
 * PUT /api/roles/users/:id
 * Update a user's role (Super Admin only).
 */
export async function updateUserRole(req, res) {
  const { id } = req.params;
  const { role, status } = req.body;

  const user = await findUserById(Number(id));
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (role) {
    const validRoles = ['SUPER_ADMIN', 'CITY_DISTRIBUTOR', 'GYM_OR_AREA_DISTRIBUTOR', 'TRAINER_OR_RETAILER', 'CUSTOMER'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }
    await updateRole(Number(id), role);
  }

  if (status) {
    const validStatuses = ['active', 'inactive', 'suspended', 'pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    await updateUserStatus(Number(id), status);
  }

  const updatedUser = await findUserById(Number(id));
  res.json({ message: 'User updated successfully.', user: updatedUser });
}

/**
 * GET /api/roles/profile
 * Get the authenticated user's extended profile.
 */
export async function getUserProfile(req, res) {
  const user = await findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // Fetch role-specific data
  const { getPool } = await import('../config/db.js');
  const pool = getPool();
  let roleProfile = null;

  switch (user.role) {
    case 'CITY_DISTRIBUTOR': {
      const [rows] = await pool.execute('SELECT * FROM city_distributors WHERE user_id = ?', [user.id]);
      roleProfile = rows[0] || null;
      break;
    }
    case 'GYM_OR_AREA_DISTRIBUTOR': {
      const [rows] = await pool.execute('SELECT * FROM gym_distributors WHERE user_id = ?', [user.id]);
      roleProfile = rows[0] || null;
      break;
    }
    case 'TRAINER_OR_RETAILER': {
      const [rows] = await pool.execute('SELECT * FROM trainers WHERE user_id = ?', [user.id]);
      roleProfile = rows[0] || null;
      break;
    }
    case 'CUSTOMER': {
      const [rows] = await pool.execute('SELECT * FROM customers WHERE user_id = ?', [user.id]);
      roleProfile = rows[0] || null;
      break;
    }
  }

  res.json({ user: { ...user, roleProfile } });
}
