const User = require('../models/User');
const Destination = require('../models/Destination');
const Trip = require('../models/Trip');
const Review = require('../models/Review');
const Category = require('../models/Category');
const Hotel = require('../models/Hotel');
const Activity = require('../models/Activity');

// @desc    Get comprehensive admin analytics & statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDestinations = await Destination.countDocuments();
    const totalTrips = await Trip.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Most popular destination
    const mostPopularDestination = await Destination.findOne()
      .sort({ popularityScore: -1 })
      .select('name popularityScore images province');

    // Most reviewed destination
    const mostReviewedDestination = await Destination.findOne()
      .sort({ reviewCount: -1 })
      .select('name reviewCount averageRating images');

    // Overall average rating
    const ratingAggregate = await Destination.aggregate([
      { $group: { _id: null, avg: { $avg: '$averageRating' } } },
    ]);
    const overallAvgRating =
      ratingAggregate.length > 0
        ? Math.round(ratingAggregate[0].avg * 10) / 10
        : 4.8;

    // Destinations by category
    const categoryDistribution = await Destination.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    // Top 5 destinations by score
    const topDestinations = await Destination.find()
      .sort({ popularityScore: -1 })
      .limit(5)
      .select('name popularityScore averageRating category estimatedDailyCost');

    // Simulated / aggregated 6-month growth metrics for charts
    const monthlyTrends = [
      { month: 'Jan', users: Math.max(1, Math.round(totalUsers * 0.3)), trips: Math.max(1, Math.round(totalTrips * 0.25)) },
      { month: 'Feb', users: Math.max(1, Math.round(totalUsers * 0.45)), trips: Math.max(1, Math.round(totalTrips * 0.4)) },
      { month: 'Mar', users: Math.max(1, Math.round(totalUsers * 0.6)), trips: Math.max(1, Math.round(totalTrips * 0.55)) },
      { month: 'Apr', users: Math.max(2, Math.round(totalUsers * 0.75)), trips: Math.max(2, Math.round(totalTrips * 0.7)) },
      { month: 'May', users: Math.max(2, Math.round(totalUsers * 0.9)), trips: Math.max(2, Math.round(totalTrips * 0.85)) },
      { month: 'Jun', users: totalUsers, trips: totalTrips },
    ];

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalDestinations,
          totalTrips,
          totalReviews,
          overallAvgRating,
          mostPopularDestination,
          mostReviewedDestination,
        },
        charts: {
          monthlyTrends,
          categoryDistribution,
          topDestinations,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users with search & pagination
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: users.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting own admin account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own administrative account',
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User removed successfully',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all trips across system for admin
// @route   GET /api/admin/trips
// @access  Private/Admin
const getAllTrips = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Trip.countDocuments(query);
    const trips = await Trip.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: trips.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
      data: trips,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reviews for moderation
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('destination', 'name slug')
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

// @desc    Moderate review status (approve/reject)
// @route   PUT /api/admin/reviews/:id/status
// @access  Private/Admin
const updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review status',
      });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Trigger recalculation on destination
    await Review.calculateAverageRating(review.destination);

    res.json({
      success: true,
      message: `Review marked as ${status}`,
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Hotels management endpoints
// @route   GET /api/admin/hotels
// @access  Public / Admin
const getHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find().sort({ name: 1 });
    res.json({ success: true, data: hotels });
  } catch (err) {
    next(err);
  }
};

const createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, message: 'Hotel added', data: hotel });
  } catch (err) {
    next(err);
  }
};

const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Hotel updated', data: hotel });
  } catch (err) {
    next(err);
  }
};

const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Hotel deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc    Activities management endpoints
const getActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find().sort({ name: 1 });
    res.json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
};

const createActivity = async (req, res, next) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json({ success: true, message: 'Activity added', data: activity });
  } catch (err) {
    next(err);
  }
};

const updateActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Activity updated', data: activity });
  } catch (err) {
    next(err);
  }
};

const deleteActivity = async (req, res, next) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Activity deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllTrips,
  getAllReviews,
  updateReviewStatus,
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
};
