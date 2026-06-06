import { getAllRules, createRule, updateRule, deactivateRule, findRuleById } from '../models/CommissionRule.js';

/**
 * GET /api/commission-rules
 * List all commission rules (Super Admin only).
 */
export async function getCommissionRules(req, res) {
  const rules = await getAllRules();
  res.json({ rules });
}

/**
 * POST /api/commission-rules
 * Create a new commission rule (Super Admin only).
 */
export async function createCommissionRule(req, res) {
  const { role, commission_percent, product_category } = req.body;

  if (!role || commission_percent === undefined) {
    return res.status(400).json({ error: 'Role and commission_percent are required.' });
  }

  const validRoles = ['CITY_DISTRIBUTOR', 'GYM_OR_AREA_DISTRIBUTOR', 'TRAINER_OR_RETAILER'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
  }

  const percent = Number(commission_percent);
  if (isNaN(percent) || percent < 0 || percent > 100) {
    return res.status(400).json({ error: 'Commission percent must be between 0 and 100.' });
  }

  try {
    const rule = await createRule(role, percent, product_category || '*');
    res.status(201).json({ message: 'Commission rule created.', rule });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A rule for this role and category already exists.' });
    }
    throw err;
  }
}

/**
 * PUT /api/commission-rules/:id
 * Update a commission rule (Super Admin only).
 */
export async function updateCommissionRule(req, res) {
  const { id } = req.params;
  const { commission_percent, product_category, active } = req.body;

  const existing = await findRuleById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Commission rule not found.' });
  }

  const updates = {};
  if (commission_percent !== undefined) {
    const percent = Number(commission_percent);
    if (isNaN(percent) || percent < 0 || percent > 100) {
      return res.status(400).json({ error: 'Commission percent must be between 0 and 100.' });
    }
    updates.commission_percent = percent;
  }
  if (product_category !== undefined) {
    updates.product_category = product_category;
  }
  if (active !== undefined) {
    updates.active = active;
  }

  const updatedRule = await updateRule(id, updates);
  res.json({ message: 'Commission rule updated.', rule: updatedRule });
}

/**
 * DELETE /api/commission-rules/:id
 * Deactivate a commission rule (Super Admin only).
 */
export async function deleteCommissionRule(req, res) {
  const { id } = req.params;

  const existing = await findRuleById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Commission rule not found.' });
  }

  await deactivateRule(id);
  res.json({ message: 'Commission rule deactivated.' });
}
