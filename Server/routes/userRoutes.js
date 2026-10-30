const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserFavorites,
  addFavorite,
  removeFavorite,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

router.route('/favorites')
  .get(getUserFavorites);

router.route('/favorites/:destinationId')
  .post(addFavorite)
  .delete(removeFavorite);

module.exports = router;
