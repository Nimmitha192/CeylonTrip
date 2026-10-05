const validateTripGenerate = (req, res, next) => {
  const { duration, startingLocation } = req.body;
  const errors = [];

  if (!duration || duration < 1 || duration > 30) {
    errors.push('Trip duration must be between 1 and 30 days');
  }

  if (!startingLocation || !startingLocation.name) {
    errors.push('Starting location is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Trip planner input validation failed',
      errors,
    });
  }

  next();
};

module.exports = { validateTripGenerate };
