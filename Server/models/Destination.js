const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [250, 'Short description cannot exceed 250 characters'],
    },
    province: {
      type: String,
      required: [true, 'Province is required'],
      enum: [
        'Western',
        'Central',
        'Southern',
        'Northern',
        'Eastern',
        'North Western',
        'North Central',
        'Uva',
        'Sabaragamuwa',
      ],
    },
    district: {
      type: String,
      required: [true, 'District is required'],
    },
    location: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    estimatedDailyCost: {
      type: Number,
      required: [true, 'Estimated daily cost is required in LKR'],
      min: [0, 'Cost cannot be negative'],
    },
    recommendedDuration: {
      type: Number, // In days, e.g. 1, 2, 3
      required: [true, 'Recommended duration in days is required'],
      default: 1,
    },
    bestMonths: [
      {
        type: String,
      },
    ],
    activities: [
      {
        name: String,
        description: String,
        estimatedCost: Number,
        duration: String,
      },
    ],
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Challenging'],
      default: 'Easy',
    },
    popularityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    openingTime: {
      type: String,
      default: '07:00 AM',
    },
    closingTime: {
      type: String,
      default: '06:00 PM',
    },
    entranceFee: {
      local: { type: Number, default: 0 },
      foreign: { type: Number, default: 0 },
    },
    tags: [
      {
        type: String,
      },
    ],
    nearbyDestinations: [
      {
        name: String,
        distanceKm: Number,
      },
    ],
    transportationInfo: {
      trainAvailable: { type: Boolean, default: false },
      busAvailable: { type: Boolean, default: true },
      driveTimeFromColombo: { type: String, default: '3-4 hours' },
    },
  },
  {
    timestamps: true,
  }
);

// Slug auto-generation
destinationSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

// Indexes for high performance searches & filters
destinationSchema.index({ name: 'text', description: 'text', tags: 'text' });
destinationSchema.index({ category: 1, province: 1, estimatedDailyCost: 1, averageRating: -1 });

module.exports = mongoose.model('Destination', destinationSchema);
