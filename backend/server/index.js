
require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');

const connectDB = require('./src/config/db');
const { initSocket } = require('./src/socket');

const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const orderRoutes = require('./src/routes/orders');
const chatRoutes = require('./src/routes/chat');
const adminRoutes = require('./src/routes/admin');
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  if (err.code === 11000) {
    const field =
      Object.keys(err.keyPattern || {})[0] || 'field';

    return res.status(409).json({
      message: `${field} already exists.`
    });
  }

  console.error(err.stack || err);

  res.status(err.status || 500).json({
    message: err.message || 'Server error'
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    initSocket(server);

    server.listen(PORT, () => {
      console.log(`StudentMarket server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
