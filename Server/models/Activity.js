const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Activity name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    duration: {
      type: String,
      default: '2-3 hours',
    },
    cost: {
      type: Number,
      default: 0, // in LKR
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Challenging'],
      default: 'Easy',
    },
    suitableFor: [
      {
        type: String,
      },
    ],
    destination: {
      type: String,
      default: 'General',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Activity', activitySchema);
