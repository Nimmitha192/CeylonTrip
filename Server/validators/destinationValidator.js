const validateDestination = (req, res, next) => {
  const {
    name,
    description,
    shortDescription,
    province,
    district,
    location,
    category,
    estimatedDailyCost,
  } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) errors.push('Destination name is required');
  if (!description) errors.push('Description is required');
  if (!shortDescription) errors.push('Short description is required');
  if (!province) errors.push('Province is required');
  if (!district) errors.push('District is required');
  if (!location || location.latitude === undefined || location.longitude === undefined) {
    errors.push('Geographic location coordinates (latitude and longitude) are required');
  }
  if (!category) errors.push('Category is required');
  if (estimatedDailyCost === undefined || estimatedDailyCost < 0) {
    errors.push('Estimated daily cost must be a positive number in LKR');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Destination validation failed',
      errors,
    });
  }

  next();
};

module.exports = { validateDestination };
