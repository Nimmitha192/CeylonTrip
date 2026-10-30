const Destination = require('../models/Destination');
const { getWeatherForDestination } = require('../services/weatherService');

// @desc    Get destinations with search, filter, sorting, and pagination
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res, next) => {
  try {
    const {
      search,
      category,
      province,
      minCost,
      maxCost,
      minRating,
      activity,
      bestMonth,
      sortBy,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Keyword text search (name, tags, description)
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(search.trim(), 'i')] } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Province filter
    if (province && province !== 'All') {
      query.province = province;
    }

    // Budget range filter
    if (minCost || maxCost) {
      query.estimatedDailyCost = {};
      if (minCost) query.estimatedDailyCost.$gte = Number(minCost);
      if (maxCost) query.estimatedDailyCost.$lte = Number(maxCost);
    }

    // Rating filter
    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    // Activity filter
    if (activity && activity !== 'All') {
      query['activities.name'] = { $regex: activity, $options: 'i' };
    }

    // Best season / month filter
    if (bestMonth && bestMonth !== 'All') {
      query.bestMonths = { $in: [new RegExp(`^${bestMonth}$`, 'i')] };
    }

    // Sorting
    let sortOption = { popularityScore: -1 }; // default: most popular
    if (sortBy === 'rating_desc') sortOption = { averageRating: -1 };
    else if (sortBy === 'cost_asc') sortOption = { estimatedDailyCost: 1 };
    else if (sortBy === 'cost_desc') sortOption = { estimatedDailyCost: -1 };
    else if (sortBy === 'name_asc') sortOption = { name: 1 };

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Destination.countDocuments(query);
    const destinations = await Destination.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: destinations.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
      data: destinations,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single destination by ID or slug with integrated weather
// @route   GET /api/destinations/:idOrSlug
// @access  Public
const getDestination = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    let destination;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      destination = await Destination.findById(idOrSlug);
    } else {
      destination = await Destination.findOne({ slug: idOrSlug });
    }

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    // Enrich with weather data
    const weather = await getWeatherForDestination(destination);

    res.json({
      success: true,
      data: {
        ...destination.toObject(),
        weather,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new destination (Admin only)
// @route   POST /api/destinations
// @access  Private/Admin
const createDestination = async (req, res, next) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: destination,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update destination (Admin only)
// @route   PUT /api/destinations/:id
// @access  Private/Admin
const updateDestination = async (req, res, next) => {
  try {
    let destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Destination updated successfully',
      data: destination,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete destination (Admin only)
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    await destination.deleteOne();

    res.json({
      success: true,
      message: 'Destination deleted successfully',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
};
