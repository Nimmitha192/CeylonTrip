const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

// System statistics
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Trip management
router.get('/trips', getAllTrips);

// Review moderation
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/status', updateReviewStatus);

// Hotel catalog management
router.route('/hotels')
  .get(getHotels)
  .post(createHotel);
router.route('/hotels/:id')
  .put(updateHotel)
  .delete(deleteHotel);

// Activity catalog management
router.route('/activities')
  .get(getActivities)
  .post(createActivity);
router.route('/activities/:id')
  .put(updateActivity)
  .delete(deleteActivity);

module.exports = router;
