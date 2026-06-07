import { createContactMessage, findAllContactMessages, markMessageAsRead, countUnreadMessages } from '../models/ContactMessage.js';
import { isValidEmail } from '../middleware/validate.js';

/**
 * POST /api/contact
 * Public endpoint to submit a contact message.
 */
export async function submitContact(req, res) {
  const { name, email, subject, message } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const result = await createContactMessage({ name: name.trim(), email: email.trim(), subject: subject?.trim() || null, message: message.trim() });
  res.status(201).json({ message: 'Your message has been sent successfully!', contact: result });
}

/**
 * GET /api/contact
 * Super Admin: List all contact messages.
 */
export async function getContactMessages(req, res) {
  const { page = 1, limit = 50 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const result = await findAllContactMessages(Number(limit), offset);
  const unread = await countUnreadMessages();
  res.json({ ...result, unread, page: Number(page), limit: Number(limit) });
}

/**
 * PUT /api/contact/:id/read
 * Super Admin: Mark a contact message as read.
 */
export async function markAsRead(req, res) {
  const { id } = req.params;
  await markMessageAsRead(Number(id));
  res.json({ message: 'Message marked as read.' });
}
