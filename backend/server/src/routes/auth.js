const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, regNumber, hostel, roomNumber, role } = req.body;

  // Role whitelist — customers and vendors only via public signup.
  // Admins are seeded manually or promoted by another admin.
  const allowedRole = ['customer', 'vendor'].includes(role) ? role : 'customer';

  try {
    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, ...(regNumber ? [{ regNumber }] : [])],
    });
    if (existing) {
      const field = existing.email === email.toLowerCase() ? 'Email' : 'Registration number';
      return res.status(409).json({ message: `${field} already registered.` });
    }

    const user = await User.create({
      name,
      email,
      password,
      regNumber,
      hostel,
      roomNumber,
      role: allowedRole,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user._id),
    });
  } catch (err) {
    // Fallback: MongoDB unique index catch (race condition)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ message: `${field} already exists.` });
    }
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.isSuspended) {
      return res.status(403).json({ message: 'Account suspended. Contact admin.' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;