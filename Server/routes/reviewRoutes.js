const express = require('express');
const router = express.Router();
const {
  updateReview,
  deleteReview,
  getUserReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { validateReview } = require('../validators/reviewValidator');

router.get('/user', protect, getUserReviews);

router.route('/:id')
  .put(protect, validateReview, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
