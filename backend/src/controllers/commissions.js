import { findCommissionsByUserId, getCommissionSummary, getAllCommissionBreakdown } from '../models/Commission.js';

/**
 * GET /api/commissions
 * Get commissions for the authenticated user.
 */
export async function getMyCommissions(req, res) {
  const userId = req.user.id;
  const { page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const commissions = await findCommissionsByUserId(userId, Number(limit), offset);
  const summary = await getCommissionSummary(userId);

  res.json({
    commissions,
    summary,
    page: Number(page),
    limit: Number(limit),
  });
}

/**
 * GET /api/commissions/breakdown
 * Get all commissions breakdown (Super Admin only).
 */
export async function getCommissionBreakdown(req, res) {
  const { page = 1, limit = 50 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const result = await getAllCommissionBreakdown(Number(limit), offset);

  res.json({
    ...result,
    page: Number(page),
    limit: Number(limit),
  });
}
