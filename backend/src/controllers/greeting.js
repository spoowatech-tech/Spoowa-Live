import { getServerConfig } from '../config/index.js';

export function postGreeting(req, res) {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string.' });
  }

  const config = getServerConfig();
  res.json({
    greeting: `Hello, ${name}!`,
    mode: config.nodeEnv,
  });
}
