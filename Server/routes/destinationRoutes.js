const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinationController');
const {
  getDestinationReviews,
  createReview,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateDestination } = require('../validators/destinationValidator');
const { validateReview } = require('../validators/reviewValidator');

// Nested reviews on destination
router.route('/:destinationId/reviews')
  .get(getDestinationReviews)
  .post(protect, validateReview, createReview);

router.route('/')
  .get(getDestinations)
  .post(protect, authorize('admin'), validateDestination, createDestination);

router.route('/:idOrSlug')
  .get(getDestination);

router.route('/:id')
  .put(protect, authorize('admin'), updateDestination)
  .delete(protect, authorize('admin'), deleteDestination);

module.exports = router;
