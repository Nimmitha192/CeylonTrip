const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating between 1 and 5 is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment cannot be empty'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved', // Auto-approved for fast UX, admin can moderate
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate review by user on same destination
reviewSchema.index(
    { user: 1, destination: 1 }, 
    { unique: true }
);

// Static method to calculate average rating of destination
reviewSchema.statics.calculateAverageRating = async function (destinationId) {
  const stats = await this.aggregate([
    {
      $match: {
        destination: new mongoose.Types.ObjectId(destinationId),
        status: 'approved',
      },
    },
    {
      $group: {
        _id: '$destination',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  try {
    const Destination = mongoose.model('Destination');
    if (stats.length > 0) {
      await Destination.findByIdAndUpdate(destinationId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        reviewCount: stats[0].reviewCount,
      });
    } else {
      await Destination.findByIdAndUpdate(destinationId, {
        averageRating: 4.5,
        reviewCount: 0,
      });
    }
  } catch (err) {
    console.error('Error calculating average rating:', err);
  }
};

// Call calculateAverageRating after save
reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.destination);
});

// Call calculateAverageRating after delete
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.destination);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
