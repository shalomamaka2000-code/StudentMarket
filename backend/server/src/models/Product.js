const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    externalSource: { type: String, default: undefined },
    externalId: { type: String, default: undefined },
    category: {
  type: String,
  required: true,
  enum: [
    // Existing StudentMarket categories
    'groceries',
    'fragrances',
    'mens-shirts',
    'womens-dresses',
    'home-decoration',
    'beauty',

    // External API categories
    'Electronics & Gadgets',
    'Fashion & Apparel',
    'Beauty & Personal Care',
    'Home & Kitchen',
    'Health & Fitness',
  ],
},
    image: { type: String },
    stock: { type: Number, default: 0 },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isHidden: { type: Boolean, default: false }, // admin can hide suspected scams
  },
  { timestamps: true }
);

productSchema.index(
  { externalSource: 1, externalId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      externalSource: { $type: 'string' },
      externalId: { $type: 'string' },
    },
  }
);

module.exports = mongoose.model('Product', productSchema);