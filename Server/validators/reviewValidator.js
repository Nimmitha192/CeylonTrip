const validateReview = (req, res, next) => {
  const { rating, comment } = req.body;
  const errors = [];

  if (!rating || rating < 1 || rating > 5) {
    errors.push('Rating must be an integer between 1 and 5');
  }

  if (!comment || comment.trim().length === 0) {
    errors.push('Review comment cannot be empty');
  } else if (comment.length > 1000) {
    errors.push('Review comment cannot exceed 1000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Review validation failed',
      errors,
    });
  }

  next();
};

module.exports = { validateReview };
