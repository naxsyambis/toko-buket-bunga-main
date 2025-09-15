const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debug: Test basic route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Import routes
try {
  const authRoutes = require('./routes/auth');
  console.log('✓ Auth routes loaded successfully');
  app.use('/api/auth', authRoutes);
} catch (error) {
  console.error('✗ Error loading auth routes:', error.message);
}

try {
  const productRoutes = require('./routes/products');
  console.log('✓ Product routes loaded successfully');
  app.use('/api/products', productRoutes);
} catch (error) {
  console.error('✗ Error loading product routes:', error.message);
}

try {
  const orderRoutes = require('./routes/orders');
  console.log('✓ Order routes loaded successfully');
  app.use('/api/orders', orderRoutes);
} catch (error) {
  console.error('✗ Error loading order routes:', error.message);
}

try {
  const cartRoutes = require('./routes/cart');
  console.log('✓ Cart routes loaded successfully');
  app.use('/api/cart', cartRoutes);
} catch (error) {
  console.error('✗ Error loading cart routes:', error.message);
}

// === TAMBAHKAN INI ===
try {
  const dashboardRoutes = require('./routes/dashboard');
  console.log('✓ Dashboard routes loaded successfully');
  app.use('/api/dashboard', dashboardRoutes);
} catch (error) {
  console.error('✗ Error loading dashboard routes:', error.message);
}
// ======================

try {
  // Review routes tidak ada di file Anda, jadi saya hapus
  // const reviewRoutes = require('./routes/reviews');
  // console.log('✓ Review routes loaded successfully');
  // app.use('/api/reviews', reviewRoutes);
} catch (error) {
  // console.error('✗ Error loading review routes:', error.message);
}

try {
  const userRoutes = require('./routes/users');
  console.log('✓ User routes loaded successfully');
  app.use('/api/users', userRoutes);
} catch (error) {
  console.error('✗ Error loading user routes:', error.message);
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Internal server error', error: error.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n Server running on port ${PORT}`);
  console.log(` API endpoints available at http://localhost:${PORT}/api`);
});