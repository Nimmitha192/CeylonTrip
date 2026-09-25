const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  destination: {
    name: String,
    slug: String,
    province: String,
    category: String,
    image: String,
    latitude: Number,
    longitude: Number,
  },
  title: String,
  morningActivity: {
    name: String,
    description: String,
    duration: String,
  },
  afternoonActivity: {
    name: String,
    description: String,
    duration: String,
  },
  eveningActivity: {
    name: String,
    description: String,
    duration: String,
  },
  accommodation: {
    name: String,
    tier: String,
    estimatedCost: Number,
  },
  travelFromPrevious: {
    distanceKm: { type: Number, default: 0 },
    duration: { type: String, default: 'Local transit' },
    mode: { type: String, default: 'Car' },
  },
  dailyCost: { type: Number, default: 0 },
  tips: [String],
});

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Trip title is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    duration: {
      type: Number,
      required: [true, 'Duration in days is required'],
      min: [1, 'Duration must be at least 1 day'],
      max: [30, 'Duration cannot exceed 30 days'],
    },
    startingLocation: {
      name: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    budgetTier: {
      type: String,
      enum: ['Budget', 'Moderate', 'Luxury'],
      default: 'Moderate',
    },
    customBudget: {
      type: Number,
    },
    travelType: {
      type: String,
      enum: ['Solo', 'Couple', 'Family', 'Friends'],
      default: 'Solo',
    },
    travelersCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    interests: [
      {
        type: String,
      },
    ],
    transportation: {
      type: String,
      enum: [
        'Public Transport',
        'Train',
        'Bus',
        'Private Car',
        'Rental Vehicle',
      ],
      default: 'Private Car',
    },
    destinations: [
      {
        destinationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Destination',
        },
        name: String,
        latitude: Number,
        longitude: Number,
        category: String,
        image: String,
      },
    ],
    itinerary: [itineraryDaySchema],
    estimatedCost: {
      accommodation: { type: Number, default: 0 },
      transportation: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      entranceFees: { type: Number, default: 0 },
      miscellaneous: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    totalDistance: {
      type: Number,
      default: 0, // Total distance in km
    },
    status: {
      type: String,
      enum: ['draft', 'saved', 'completed'],
      default: 'saved',
    },
  },
  {
    timestamps: true,
  }
);

tripSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Trip', tripSchema);
