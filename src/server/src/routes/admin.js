const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const router = express.Router();

router.use(protect, authorize('admin'));

// GET /api/admin/users
router.get('/users', async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.json(users);
});

// PATCH /api/admin/users/:id/suspend
router.patch('/users/:id/suspend', async (req, res) => {
  const { reason } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isSuspended: true, suspensionReason: reason || 'Suspected fraudulent activity' },
    { new: true }
  ).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User suspended', user });
});

// PATCH /api/admin/users/:id/unsuspend
router.patch('/users/:id/unsuspend', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isSuspended: false, $unset: { suspensionReason: 1 } },
    { new: true }
  ).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User unsuspended', user });
});

// PATCH /api/admin/users/:id/role — promote/demote
router.patch('/users/:id/role', async (req, res) => {
  const { role } = req.body;
  if (!['customer', 'vendor', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  res.json(user);
});

// PATCH /api/admin/products/:id/hide — flag suspected scam product
router.patch('/products/:id/hide', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isHidden: true }, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product hidden from marketplace', product });
});

// PATCH /api/admin/products/:id/unhide
router.patch('/products/:id/unhide', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isHidden: false }, { new: true });
  res.json(product);
});

module.exports = router;