const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Associated destination is required'],
    },
    tier: {
      type: String,
      enum: ['Budget', 'Moderate', 'Luxury'],
      default: 'Moderate',
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night in LKR is required'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.0,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    },
    amenities: [
      {
        type: String,
      },
    ],
    contactPhone: {
      type: String,
      default: '+94 11 234 5678',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Hotel', hotelSchema);
