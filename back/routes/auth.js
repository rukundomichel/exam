const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`[auth] login attempt username=${username} ip=${req.ip}`);
  if (!username || !password) {
    console.log('[auth] login failed: missing credentials');
    return res.status(400).json({ error: 'username and password required' });
  }
  const user = await User.findOne({ username });
  if (!user) {
    console.log('[auth] login failed: user not found', username);
    return res.status(401).json({ error: 'invalid credentials' });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    console.log('[auth] login failed: incorrect password for', username);
    return res.status(401).json({ error: 'invalid credentials' });
  }

  req.session.userId = user._id;
  console.log('[auth] login success for', username, 'sessionId=', req.sessionID);
  res.json({ message: 'logged in', user: { id: user._id, username: user.username, role: user.role } });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ message: 'logged out' }));
});

// GET current user
router.get('/me', async (req, res) => {
  if (!req.session?.userId) return res.status(401).json({ error: 'not authenticated' });
  const user = await User.findById(req.session.userId).lean();
  if (!user) return res.status(401).json({ error: 'user not found' });
  res.json({ userId: user._id, username: user.username, role: user.role });
});

// POST /api/auth/reset-password  (logged-in user)
router.post('/reset-password', async (req, res) => {
  if (!req.session?.userId) return res.status(401).json({ error: 'authentication required' });
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ error: 'newPassword required' });
  // basic strong password check
  if (!/(?=^.{8,}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).*/.test(newPassword)) return res.status(400).json({ error: 'password not strong enough' });
  const user = await User.findById(req.session.userId);
  if (!user) return res.status(404).json({ error: 'user not found' });
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'password updated' });
});

module.exports = router;
