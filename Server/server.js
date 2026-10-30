const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ==========================================
// Environment Configuration
// ==========================================

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ==========================================
// Middleware
// ==========================================

app.use(cors({
  origin: process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Models
// ==========================================

require('./models/Destination');
require('./models/Category');

// ==========================================
// Routes
// ==========================================

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const tripRoutes = require('./routes/tripRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

// ==========================================
// API Routes
// ==========================================

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// ==========================================
// Health Check Route
// ==========================================

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CeylonTrip API is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==========================================
// MongoDB Connection
// ==========================================

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI environment variable is missing');
    }

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log('MongoDB connected successfully');

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// ==========================================
// Start Server
// ==========================================

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();