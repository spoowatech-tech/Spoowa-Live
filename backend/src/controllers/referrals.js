import { validateReferralCode as validateCode, createReferralMapping, findReferralByUserId, findReferralsByReferrer, countReferralsByReferrer, resolveOrderHierarchy } from '../models/Referral.js';
import { createOrUpdateHierarchy } from '../models/NetworkHierarchy.js';
import { getPool } from '../config/db.js';

/**
 * POST /api/referrals/validate
 * Validate a referral code (public — used during onboarding).
 */
export async function validateReferralCode(req, res) {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Referral code is required.' });
  }

  const result = await validateCode(code);
  
  if (!result.valid) {
    return res.status(404).json({ error: 'Invalid referral code.', valid: false });
  }

  res.json({
    valid: true,
    referrer_name: result.referrer_name,
    referrer_role: result.referrer_role,
  });
}

/**
 * POST /api/referrals/apply
 * Apply a referral code to link a user to a referrer (authenticated).
 * Handles trainer, gym, and city distributor codes.
 * - Trainer code: links customer → trainer → gym → city (full chain)
 * - Gym code: links customer → gym → city (skips trainer)
 * - City code: links customer → city (skips trainer & gym)
 */
export async function applyReferralCode(req, res) {
  const { code } = req.body;
  const userId = req.user.id;

  if (!code) {
    return res.status(400).json({ error: 'Referral code is required.' });
  }

  // Check if user already has a referral mapping
  const existingMapping = await findReferralByUserId(userId);
  if (existingMapping) {
    return res.status(409).json({ error: 'You are already linked to a referrer.' });
  }

  const result = await validateCode(code);
  if (!result.valid) {
    return res.status(404).json({ error: 'Invalid referral code.' });
  }

  // Prevent self-referral
  if (result.referrer_id === userId) {
    return res.status(400).json({ error: 'You cannot use your own referral code.' });
  }

  // Create referral mapping
  await createReferralMapping(userId, result.referrer_id, result.referrer_role, code);

  const pool = getPool();

  // Ensure customer record exists for the user
  const [existingCust] = await pool.execute('SELECT id FROM customers WHERE user_id = ?', [userId]);
  let customerId;
  if (existingCust.length > 0) {
    customerId = existingCust[0].id;
  } else {
    const [cr] = await pool.execute('INSERT INTO customers (user_id) VALUES (?)', [userId]);
    customerId = cr.insertId;
  }

  // Link based on referrer role
  if (result.referrer_role === 'TRAINER_OR_RETAILER') {
    // Trainer code: link customer to this trainer
    const [trainer] = await pool.execute('SELECT id, gym_distributor_id FROM trainers WHERE user_id = ?', [result.referrer_id]);
    if (trainer.length > 0) {
      await pool.execute('UPDATE customers SET trainer_id = ? WHERE user_id = ?', [trainer[0].id, userId]);
    }
  } else if (result.referrer_role === 'GYM_OR_AREA_DISTRIBUTOR') {
    // Gym code: skip trainer, link customer directly via gym
    // No trainer_id set on customer — commission goes to gym directly
    // Nothing to update on customer's trainer_id
  } else if (result.referrer_role === 'CITY_DISTRIBUTOR') {
    // City code: commission goes directly to city distributor
    // No trainer or gym linkage needed
  }

  // Populate network_hierarchy for commission resolution
  try {
    const hierarchy = await resolveOrderHierarchy(userId);
    await createOrUpdateHierarchy(customerId, {
      trainer_id: hierarchy.trainer_id || null,
      area_distributor_id: hierarchy.gym_distributor_id || null,
      gym_id: hierarchy.gym_distributor_id || null,
      city_distributor_id: hierarchy.city_distributor_id || null,
    });
  } catch (err) {
    console.error('[NetworkHierarchy] Error populating hierarchy:', err.message);
  }

  res.json({
    message: 'Referral code applied successfully!',
    referrer_name: result.referrer_name,
    referrer_role: result.referrer_role,
  });
}

/**
 * GET /api/referrals/my-info
 * Get referral info for the authenticated user.
 */
export async function getReferralInfo(req, res) {
  const userId = req.user.id;
  const role = req.user.role;
  const pool = getPool();

  // Get the user's own referral code
  let myReferralCode = null;
  switch (role) {
    case 'CITY_DISTRIBUTOR': {
      const [rows] = await pool.execute('SELECT referral_code FROM city_distributors WHERE user_id = ?', [userId]);
      myReferralCode = rows[0]?.referral_code || null;
      break;
    }
    case 'GYM_OR_AREA_DISTRIBUTOR': {
      const [rows] = await pool.execute('SELECT referral_code FROM gym_distributors WHERE user_id = ?', [userId]);
      myReferralCode = rows[0]?.referral_code || null;
      break;
    }
    case 'TRAINER_OR_RETAILER': {
      const [rows] = await pool.execute('SELECT referral_code FROM trainers WHERE user_id = ?', [userId]);
      myReferralCode = rows[0]?.referral_code || null;
      break;
    }
  }

  // Who referred me?
  const myReferral = await findReferralByUserId(userId);

  // Who I referred
  const myReferrals = await findReferralsByReferrer(userId);
  const referralCount = await countReferralsByReferrer(userId);

  res.json({
    my_referral_code: myReferralCode,
    referred_by: myReferral,
    my_referrals: myReferrals,
    total_referrals: referralCount,
  });
}
