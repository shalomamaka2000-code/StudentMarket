const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['groceries', 'fragrances', 'mens-shirts', 'womens-dresses', 'home-decoration', 'beauty'],
    },
    image: { type: String },
    stock: { type: Number, default: 0 },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isHidden: { type: Boolean, default: false }, // admin can hide suspected scams
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);