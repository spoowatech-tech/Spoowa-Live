import { subscribe as subscribeModel, findAllSubscribers } from '../models/Newsletter.js';
import { isValidEmail } from '../middleware/validate.js';

/**
 * POST /api/newsletter/subscribe
 * Body: { email }
 */
export async function subscribe(req, res) {
  const { email } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const result = await subscribeModel(email);

  if (result.subscribed) {
    res.status(201).json({ message: 'Successfully subscribed to the newsletter!', email: result.email });
  } else {
    res.json({ message: 'You are already subscribed.', email: result.email });
  }
}

/**
 * GET /api/newsletter/subscribers
 * Super Admin: List all newsletter subscribers.
 */
export async function getSubscribers(req, res) {
  const { page = 1, limit = 100 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const result = await findAllSubscribers(Number(limit), offset);
  res.json({ ...result, page: Number(page), limit: Number(limit) });
}

