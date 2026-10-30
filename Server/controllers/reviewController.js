const Review = require('../models/Review');
const Destination = require('../models/Destination');

// @desc    Get reviews for a destination
// @route   GET /api/destinations/:destinationId/reviews
// @access  Public
const getDestinationReviews = async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    const reviews = await Review.find({
      destination: destinationId,
      status: 'approved',
    })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add review for a destination
// @route   POST /api/destinations/:destinationId/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    const { rating, comment } = req.body;

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    // Check if user already reviewed this destination
    const existingReview = await Review.findOne({
      user: req.user._id,
      destination: destinationId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this destination. You may edit your existing review.',
        errors: ['Duplicate review not allowed'],
      });
    }

    const review = await Review.create({
      user: req.user._id,
      destination: destinationId,
      rating: Number(rating),
      comment,
      status: 'approved',
    });

    await review.populate('user', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Make sure review belongs to user or user is admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review',
      });
    }

    const { rating, comment } = req.body;
    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = comment;

    await review.save();
    await review.populate('user', 'name profileImage');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reviews by logged-in user
// @route   GET /api/reviews/user
// @access  Private
const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('destination', 'name slug images province')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDestinationReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
};
