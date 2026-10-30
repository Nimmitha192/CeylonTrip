const User = require('../models/User');
const Destination = require('../models/Destination');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile & preferences
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, profileImage, preferences, password } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name;
    if (profileImage) user.profileImage = profileImage;
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences,
      };
    }
    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        preferences: updatedUser.preferences,
        favorites: updatedUser.favorites,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's favorites
// @route   GET /api/users/favorites
// @access  Private
const getUserFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({
      success: true,
      count: user.favorites.length,
      data: user.favorites,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add destination to favorites
// @route   POST /api/users/favorites/:destinationId
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const { destinationId } = req.params;

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    const user = await User.findById(req.user._id);

    const isFavorited = user.favorites.some(
      (id) => id.toString() === destinationId
    );

    if (!isFavorited) {
      user.favorites.push(destinationId);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Destination added to favorites',
      data: user.favorites,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove destination from favorites
// @route   DELETE /api/users/favorites/:destinationId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const { destinationId } = req.params;

    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== destinationId
    );
    await user.save();

    res.json({
      success: true,
      message: 'Destination removed from favorites',
      data: user.favorites,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserFavorites,
  addFavorite,
  removeFavorite,
};
