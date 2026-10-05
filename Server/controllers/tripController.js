const Trip = require('../models/Trip');
const Destination = require('../models/Destination');
const { recommendDestinations } = require('../services/recommendationService');
const { generateItineraryPlan } = require('../services/itineraryService');

// Known coordinates for common Sri Lankan starting locations
const START_LOCATIONS_MAP = {
  Colombo: { name: 'Colombo', latitude: 6.9271, longitude: 79.8612 },
  'Bandaranaike International Airport': {
    name: 'Bandaranaike International Airport',
    latitude: 7.1808,
    longitude: 79.8841,
  },
  Kandy: { name: 'Kandy', latitude: 7.2906, longitude: 80.6337 },
  Galle: { name: 'Galle', latitude: 6.0328, longitude: 80.217 },
  Ella: { name: 'Ella', latitude: 6.8667, longitude: 81.0466 },
};

// @desc    Generate personalized trip recommendations and optimized itinerary
// @route   POST /api/trips/generate
// @access  Public (or Private)
const generateTrip = async (req, res, next) => {
  try {
    const {
      duration = 3,
      startingLocation,
      budgetTier = 'Moderate',
      customBudget,
      travelType = 'Solo',
      travelersCount = 1,
      interests = [],
      transportation = 'Private Car',
    } = req.body;

    // Resolve starting coordinate
    let resolvedStart = {
      name: startingLocation?.name || 'Colombo',
      latitude: startingLocation?.latitude || 6.9271,
      longitude: startingLocation?.longitude || 79.8612,
    };

    if (
      typeof startingLocation === 'string' &&
      START_LOCATIONS_MAP[startingLocation]
    ) {
      resolvedStart = START_LOCATIONS_MAP[startingLocation];
    } else if (
      startingLocation?.name &&
      START_LOCATIONS_MAP[startingLocation.name] &&
      !startingLocation.latitude
    ) {
      resolvedStart = START_LOCATIONS_MAP[startingLocation.name];
    }

    // 1. Fetch all available destinations from MongoDB
    const allDestinations = await Destination.find({});
    if (allDestinations.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'No destination records found in database to generate recommendations',
      });
    }

    // 2. Execute Recommendation Engine MCDA scoring
    const scoredRecommendations = recommendDestinations(allDestinations, {
      duration: Number(duration),
      startingLocation: resolvedStart,
      budgetTier,
      customBudget: customBudget ? Number(customBudget) : null,
      travelType,
      interests,
    });

    const candidateDestinations = scoredRecommendations.map((item) => item.destination);

    // 3. Execute Route Optimization and Itinerary Generation
    const itineraryResult = generateItineraryPlan({
      duration: Number(duration),
      startLocation: resolvedStart,
      budgetTier,
      travelType,
      travelersCount: Number(travelersCount),
      transportation,
      selectedDestinations: candidateDestinations,
      customBudget: customBudget ? Number(customBudget) : null,
    });

    // Construct trip title
    const primaryStops = itineraryResult.orderedDestinations
      .slice(0, 3)
      .map((d) => d.name)
      .join(' & ');
    const title = `${duration}-Day Sri Lanka Tour: ${primaryStops}`;

    const generatedTripData = {
      title,
      duration: Number(duration),
      startingLocation: resolvedStart,
      budgetTier,
      customBudget: customBudget ? Number(customBudget) : null,
      travelType,
      travelersCount: Number(travelersCount),
      interests,
      transportation,
      destinations: itineraryResult.orderedDestinations.map((d) => ({
        destinationId: d._id,
        name: d.name,
        latitude: d.location.latitude,
        longitude: d.location.longitude,
        category: d.category,
        image: d.images && d.images.length > 0 ? d.images[0] : '',
      })),
      itinerary: itineraryResult.itinerary,
      estimatedCost: itineraryResult.estimatedCost,
      totalDistance: itineraryResult.totalDistance,
      status: 'draft',
      recommendationBreakdown: scoredRecommendations.map((item) => ({
        destinationName: item.destination.name,
        score: item.score,
        factors: item.breakdown,
      })),
    };

    res.json({
      success: true,
      message: 'Personalized trip itinerary successfully generated',
      data: generatedTripData,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Save a trip to authenticated user account
// @route   POST /api/trips
// @access  Private
const saveTrip = async (req, res, next) => {
  try {
    const tripData = {
      ...req.body,
      user: req.user._id,
      status: 'saved',
    };

    const trip = await Trip.create(tripData);

    res.status(201).json({
      success: true,
      message: 'Trip saved successfully to your account',
      data: trip,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all trips belonging to authenticated user
// @route   GET /api/trips
// @access  Private
const getMyTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('user', 'name email');
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    // Ensure only the owner or an admin can access
    if (
      trip.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this trip',
      });
    }

    res.json({
      success: true,
      data: trip,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update an existing trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res, next) => {
  try {
    let trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    if (
      trip.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this trip',
      });
    }

    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Trip updated successfully',
      data: trip,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    if (
      trip.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this trip',
      });
    }

    await trip.deleteOne();

    res.json({
      success: true,
      message: 'Trip deleted successfully',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateTrip,
  saveTrip,
  getMyTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};
