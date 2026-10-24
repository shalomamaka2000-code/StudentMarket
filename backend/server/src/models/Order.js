const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    deliveryFee: { type: Number, default: 2.5 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliveryAddress: {
      hostel: String,
      roomNumber: String,
      phone: String,
    },
    trackingId: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);