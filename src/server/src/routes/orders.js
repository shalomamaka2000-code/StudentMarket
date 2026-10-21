const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const router = express.Router();

// POST /api/orders — customer places order
router.post('/', protect, authorize('customer'), async (req, res) => {
  const { items, deliveryAddress } = req.body;

  // Build server-trusted items (never trust client prices)
  const builtItems = [];
  let total = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || product.isHidden) {
      return res.status(400).json({ message: `Product ${item.product} unavailable` });
    }
    builtItems.push({
      product: product._id,
      title: product.title,
      price: product.price,
      quantity: item.quantity,
      vendor: product.vendor,
    });
    total += product.price * item.quantity;
  }

  if (
  !Number.isInteger(items.quantity) ||
  items.quantity < 1
) {
  return res.status(400).json({
    message: 'Each item must have a valid quantity of at least 1.',
  });
}

  const order = await Order.create({
    customer: req.user._id,
    items: builtItems,
    total: total + 2500,
    deliveryAddress,
    trackingId: `HM-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  });

  res.status(201).json(order);
});

// GET /api/orders/my — customer's own orders
router.get('/my', protect, authorize('customer'), async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort('-createdAt');
  res.json(orders);
});

// GET /api/orders/track/:trackingId — public tracking
router.get('/track/:trackingId', async (req, res) => {
  const order = await Order.findOne({ trackingId: req.params.trackingId }).select(
    'status trackingId items.title items.quantity createdAt'
  );
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// PATCH /api/orders/:id/status — vendor updates own-item orders; admin any
router.patch('/:id/status', protect, authorize('vendor', 'admin'), async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (req.user.role === 'vendor') {
    const ownsItem = order.items.some(
      (i) => i.vendor.toString() === req.user._id.toString()
    );
    if (!ownsItem) {
      return res.status(403).json({ message: 'You can only update orders containing your products' });
    }
  }

  order.status = status;
  await order.save();
  res.json(order);
});

// GET /api/orders/vendor — vendor sees orders with their items
router.get('/vendor', protect, authorize('vendor'), async (req, res) => {
  const orders = await Order.find({ 'items.vendor': req.user._id }).sort('-createdAt');
  res.json(orders);
});

// GET /api/orders — admin sees all
router.get('/', protect, authorize('admin'), async (req, res) => {
  const orders = await Order.find().populate('customer', 'name email').sort('-createdAt');
  res.json(orders);
});

module.exports = router;