const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { requireLogin } = require('../middleware/auth');
const router = express.Router();

// Helper: simple strong password check
function isStrongPassword(pw) {
  // min 8 chars, uppercase, lowercase, number, special
  return /(?=^.{8,}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).*/.test(pw);
}

// Create user (admin or mechanic)
router.post('/', requireLogin, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    if (!isStrongPassword(password)) return res.status(400).json({ error: 'password is not strong enough' });
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'username already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash: hash, role: role || 'mechanic' });
    await user.save();
    res.status(201).json({ id: user._id, username: user.username, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Register the very first admin without requiring login. This is allowed only when there are no users yet.
router.post('/register-first', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    if (!isStrongPassword(password)) return res.status(400).json({ error: 'password is not strong enough' });

    const count = await User.countDocuments();
    if (count > 0) return res.status(403).json({ error: 'initial registration not allowed: users already exist' });

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'username already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash: hash, role: 'admin' });
    await user.save();
    res.status(201).json({ id: user._id, username: user.username, role: user.role, message: 'initial admin created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Public registration for buyers/mechanics (anyone can register as a regular user)
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    if (!isStrongPassword(password)) return res.status(400).json({ error: 'password is not strong enough' });

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'username already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash: hash, role: 'mechanic' });
    await user.save();
    res.status(201).json({ id: user._id, username: user.username, role: user.role, message: 'user created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
