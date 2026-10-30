const express = require('express');
const router = express.Router();
const {
  generateTrip,
  saveTrip,
  getMyTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const { validateTripGenerate } = require('../validators/tripValidator');

// Trip generation endpoint
router.post('/generate', validateTripGenerate, generateTrip);

// User saved trips
router.route('/')
  .post(protect, saveTrip)
  .get(protect, getMyTrips);

router.route('/:id')
  .get(protect, getTripById)
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

module.exports = router;
