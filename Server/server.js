const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Models
require('./models/Destination');
require('./models/Category');

// Routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Auth routes
app.use('/api/auth', authRoutes);

// Category routes
app.use('/api/categories', categoryRoutes);

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'LankaTrip API is running',
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});