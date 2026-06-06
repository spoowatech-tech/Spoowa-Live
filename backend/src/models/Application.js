import { getPool } from '../config/db.js';

/**
 * Create an application.
 */
export async function createApplication(data) {
  const pool = getPool();
  const [result] = await pool.execute(
    `INSERT INTO applications (application_type, name, email, mobile, address, bank_details, 
     certification_name, certificate_number, certificate_document, facility_name, contact_person, is_certified, referral_code)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.application_type,
      data.name,
      data.email,
      data.mobile,
      data.address || null,
      data.bank_details || null,
      data.certification_name || null,
      data.certificate_number || null,
      data.certificate_document || null,
      data.facility_name || null,
      data.contact_person || null,
      data.is_certified || false,
      data.referral_code || null
    ]
  );
  return { id: result.insertId, status: 'PENDING' };
}

/**
 * Find application by ID.
 */
export async function findApplicationById(id) {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT * FROM applications WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Find all applications with optional filters.
 */
export async function findAllApplications({ status, type, limit = 50, offset = 0 } = {}) {
  const pool = getPool();
  const conditions = [];
  const params = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  if (type) {
    conditions.push('application_type = ?');
    params.push(type);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  const [rows] = await pool.query(
    `SELECT * FROM applications ${whereClause} ORDER BY created_at DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
    params
  );

  const [countResult] = await pool.query(
    `SELECT COUNT(*) as count FROM applications ${whereClause}`,
    params
  );

  return { applications: rows, total: countResult[0].count };
}

/**
 * Update application status (approve/reject).
 */
export async function updateApplicationStatus(id, status, reviewedBy, reviewNotes = null, createdUserId = null) {
  const pool = getPool();
  await pool.execute(
    `UPDATE applications SET status = ?, reviewed_by = ?, reviewed_at = NOW(), review_notes = ?, created_user_id = ? WHERE id = ?`,
    [status, reviewedBy, reviewNotes, createdUserId, id]
  );
}

/**
 * Check for duplicate application.
 */
export async function findPendingApplicationByEmail(email, type) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT id FROM applications WHERE email = ? AND application_type = ? AND status = 'PENDING'`,
    [email, type]
  );
  return rows[0] || null;
}

/**
 * Count applications by status.
 */
export async function countApplicationsByStatus(status) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM applications WHERE status = ?',
    [status]
  );
  return rows[0].count;
}
