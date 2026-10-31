
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI_ATLAS || process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MongoDB URI is missing from .env');
    }

    await mongoose.connect(mongoURI);
    console.log('Database name:', mongoose.connection.name);
console.log('Database host:', mongoose.connection.host);
console.log('Product collection:', mongoose.model('Product').collection.name);

    console.log('MongoDB connected successfully');
    console.log(
      'Connected database:',
      mongoose.connection.name
    );
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    throw err;
  }
};

module.exports = connectDB;
