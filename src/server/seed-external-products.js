
require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const User = require('./src/models/User');

const API_URL =
  'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json';

const EXTERNAL_SOURCE = 'free-ecommerce-products-api';

async function seedExternalProducts() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from your .env file.');
    }

    // Prices from the external API are in USD cents.
    // Convert them to NGN for StudentMarket.
    const exchangeRate = Number(process.env.USD_TO_NGN_RATE);

    if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
      throw new Error(
        'Set a valid USD_TO_NGN_RATE in your server/.env file.'
      );
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const vendor = await User.findOne({ role: 'vendor' })
      .sort({ createdAt: 1 });

    if (!vendor) {
      throw new Error(
        'No vendor account found. Register a vendor account first.'
      );
    }

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Product API failed: ${response.status}`);
    }

    const externalProducts = await response.json();

    if (!Array.isArray(externalProducts)) {
      throw new Error('The API response is not a product array.');
    }

    let inserted = 0;
    let updated = 0;

    for (const item of externalProducts) {
      const productData = {
        title: item.name,
        description: item.description || '',
        price: Math.round(
          ((Number(item.priceCents) / 100) * exchangeRate) * 100
        ) / 100,
        category: item.category,
        image: item.image || '',
        stock: 20,
        vendor: vendor._id,
        isHidden: false,
        externalSource: EXTERNAL_SOURCE,
        externalId: String(item.id),
      };

      if (
        !productData.title ||
        !Number.isFinite(productData.price) ||
        productData.price < 0 ||
        !productData.category
      ) {
        console.warn(`Skipping invalid product: ${item.id}`);
        continue;
      }

      const result = await Product.updateOne(
        {
          externalSource: EXTERNAL_SOURCE,
          externalId: String(item.id),
          vendor: vendor._id,
        },
        {
          $set: productData,
        },
        { upsert: true, runValidators: true }
      );

      if (result.upsertedCount > 0) {
        inserted++;
      } else if (result.modifiedCount > 0) {
        updated++;
      }
    }

    console.log(`Import complete.`);
    console.log(`New products: ${inserted}`);
    console.log(`Updated products: ${updated}`);
    console.log(`Products received: ${externalProducts.length}`);
  } catch (error) {
    console.error('Product import failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedExternalProducts();
