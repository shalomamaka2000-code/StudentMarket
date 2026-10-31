require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const User = require('./src/models/User');

const products = [
  {
    title: 'Premium Long-Grain Rice — 5kg',
    description: 'A staple pantry essential for student meals and shared apartments.',
    price: 12500,
    category: 'groceries',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    stock: 25,
  },
  {
    title: 'Instant Noodles — Pack of 10',
    description: 'Quick and convenient noodles for busy school days.',
    price: 6500,
    category: 'groceries',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    stock: 40,
  },
  {
    title: 'Chocolate Body Fragrance',
    description: 'A warm everyday fragrance suitable for casual wear.',
    price: 8500,
    category: 'fragrances',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80',
    stock: 15,
  },
  {
    title: 'Classic Cotton T-Shirt',
    description: 'A comfortable cotton T-shirt for everyday campus wear.',
    price: 7500,
    category: 'mens-shirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    stock: 20,
  },
  {
    title: 'Casual Women’s Dress',
    description: 'A versatile casual dress for classes and outings.',
    price: 18000,
    category: 'womens-dresses',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    stock: 12,
  },
  {
    title: 'Rechargeable Study Lamp',
    description: 'A compact study lamp for reading during evening study sessions.',
    price: 14500,
    category: 'home-decoration',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    stock: 18,
  },
  {
    title: 'Decorative Cushion Cover',
    description: 'A simple decorative cushion cover for a hostel room.',
    price: 4500,
    category: 'home-decoration',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    stock: 22,
  },
  {
    title: 'Gentle Facial Cleanser',
    description: 'An everyday facial cleanser for a simple skincare routine.',
    price: 6800,
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80',
    stock: 16,
  },
  {
    title: 'Moisturizing Body Lotion',
    description: 'A daily body moisturizer for personal skincare.',
    price: 5200,
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80',
    stock: 20,
  },
  {
    title: 'Fresh Apples — 1kg',
    description: 'Fresh apples for snacks and quick breakfasts.',
    price: 4500,
    category: 'groceries',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    stock: 10,
  },
];

async function seedProducts() {
  try {
    const mongoUri = process.env.MONGO_URI_ATLAS || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI_ATLAS or MONGO_URI is missing from .env');
    }

    await mongoose.connect(mongoUri);

    console.log('MongoDB connected');
    console.log('Database:', mongoose.connection.name);
    console.log('Products collection:', Product.collection.name);

    // Find an actual vendor account
  // Inspect existing users first
const users = await User.find({})
  .select('name email role')
  .lean();

console.log('Users found:', users);

// Find a vendor account (case-insensitive)
const vendor = users.find(
  user => String(user.role || '').toLowerCase() === 'vendor'
);

if (!vendor) {
  throw new Error(
    'No vendor account found. Check the Users found output above.'
  );
}

let inserted = 0;
let updated = 0;
    for (const product of products) {
      const result = await Product.updateOne(
  { title: product.title, vendor: vendor._id },
  {
    $set: {
      ...product,
      vendor: vendor._id,
      isHidden: false,
    },
  },
  { upsert: true }
);
      if (result.upsertedCount > 0) {
        inserted++;
      } else if (result.modifiedCount > 0) {
        updated++;
      }
    }

    console.log(`Products inserted: ${inserted}`);
    console.log(`Products updated: ${updated}`);
    console.log(`Vendor: ${vendor.name || vendor.email}`);
  } catch (error) {
    console.error('Product seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();