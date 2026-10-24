const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const router = express.Router();

// GET /api/products — public browse
router.get('/', async (req, res) => {
  const { category } = req.query;
  const filter = { isHidden: false };
  if (category) filter.category = category;
  const products = await Product.find(filter).populate('vendor', 'name');
  res.json(products);
});

// GET /api/products/:id — public
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('vendor', 'name');
  if (!product || product.isHidden) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// POST /api/products — vendor only
router.post('/', protect, authorize('vendor'), async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, vendor: req.user._id });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id — vendor can only edit own
router.put('/:id', protect, authorize('vendor', 'admin'), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  if (req.user.role === 'vendor' && product.vendor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You can only edit your own products' });
  }

  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

// DELETE /api/products/:id — vendor own only, admin any
router.delete('/:id', protect, authorize('vendor', 'admin'), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  if (req.user.role === 'vendor' && product.vendor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You can only delete your own products' });
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

module.exports = router;