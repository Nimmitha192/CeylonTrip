/**
 * ============================================================================
 * LankaTrip Planner - Itinerary Generation & Route Optimization Service
 * ============================================================================
 *
 * Implements:
 * 1. Nearest-Neighbor Route Optimization (TSP heuristic) using Haversine distance
 * 2. Day-by-Day Activity Scheduling (Morning, Afternoon, Evening)
 * 3. Categorized Budget Calculator (Accommodation, Transport, Food, Activities, Fees)
 * ============================================================================
 */

const { calculateHaversineDistance } = require('./recommendationService');

/**
 * Optimize route order using Greedy Nearest-Neighbor Traveling Salesperson Heuristic
 * @param {Object} startLocation { name, latitude, longitude }
 * @param {Array} destinationObjects Array of destination Mongoose documents
 * @returns {Array} Ordered destinations minimizing total travel distance
 */
const optimizeRouteOrder = (startLocation, destinationObjects) => {
  if (!destinationObjects || destinationObjects.length <= 1) {
    return destinationObjects;
  }

  const unvisited = [...destinationObjects];
  const orderedRoute = [];

  let currentLocation = {
    latitude: startLocation.latitude || 6.9271,
    longitude: startLocation.longitude || 79.8612,
  };

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dest = unvisited[i];
      const dist = calculateHaversineDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        dest.location.latitude,
        dest.location.longitude
      );

      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    const [chosen] = unvisited.splice(nearestIndex, 1);
    orderedRoute.push(chosen);
    currentLocation = {
      latitude: chosen.location.latitude,
      longitude: chosen.location.longitude,
    };
  }

  return orderedRoute;
};

/**
 * Estimate travel time in human-readable hours based on distance in km and transport type
 */
const estimateTravelTime = (distanceKm, transportMode = 'Private Car') => {
  if (distanceKm <= 5) return '15 - 30 mins local transfer';

  // Average speeds on Sri Lankan roads/terrain (km/h)
  const speeds = {
    'Private Car': 45,
    'Rental Vehicle': 40,
    'Public Transport': 30,
    Train: 35,
    Bus: 30,
  };

  const avgSpeed = speeds[transportMode] || 40;
  const hours = distanceKm / avgSpeed;

  if (hours < 1) {
    return `${Math.round(hours * 60)} mins`;
  }
  const fullHours = Math.floor(hours);
  const remainingMins = Math.round((hours - fullHours) * 60);
  return remainingMins > 0 ? `${fullHours} hr ${remainingMins} mins` : `${fullHours} hours`;
};

/**
 * Calculate comprehensive itemized budget in LKR
 */
const calculateTripBudget = ({
  duration,
  travelersCount = 1,
  budgetTier = 'Moderate',
  customBudget,
  transportation = 'Private Car',
  destinations,
}) => {
  // Base daily rates per person based on tier
  const tierRates = {
    Budget: {
      hotelPerRoom: 7500,
      foodPerDay: 4000,
      miscPerDay: 2000,
    },
    Moderate: {
      hotelPerRoom: 22000,
      foodPerDay: 8000,
      miscPerDay: 4000,
    },
    Luxury: {
      hotelPerRoom: 65000,
      foodPerDay: 18000,
      miscPerDay: 9000,
    },
  };

  const rates = tierRates[budgetTier] || tierRates.Moderate;

  // Rooms needed (assuming 2 people per room)
  const roomsCount = Math.ceil(travelersCount / 2);
  const totalAccommodation = rates.hotelPerRoom * roomsCount * duration;
  const totalFood = rates.foodPerDay * travelersCount * duration;
  const totalMisc = rates.miscPerDay * travelersCount * duration;

  // Transport costs based on vehicle / transit type
  const transportDailyRate = {
    'Public Transport': 3000 * travelersCount,
    Train: 4000 * travelersCount,
    Bus: 2500 * travelersCount,
    'Private Car': 15000, // Fixed car + driver daily cost
    'Rental Vehicle': 12000, // Self-drive rental daily cost
  };
  const totalTransport = (transportDailyRate[transportation] || 15000) * duration;

  // Entrance fees & activities calculated from selected destinations
  let totalEntrance = 0;
  let totalActivities = 0;

  destinations.forEach((dest) => {
    // Entrance fee (foreign tourist rate assumed as standard platform default)
    const fee = (dest.entranceFee && dest.entranceFee.foreign) ? dest.entranceFee.foreign : 0;
    totalEntrance += fee * travelersCount;

    // Sum average activities costs
    if (dest.activities && dest.activities.length > 0) {
      dest.activities.slice(0, 2).forEach((act) => {
        totalActivities += (act.estimatedCost || 0) * travelersCount;
      });
    }
  });

  const total =
    totalAccommodation +
    totalTransport +
    totalFood +
    totalEntrance +
    totalActivities +
    totalMisc;

  return {
    accommodation: totalAccommodation,
    transportation: totalTransport,
    food: totalFood,
    entranceFees: totalEntrance,
    activities: totalActivities,
    miscellaneous: totalMisc,
    total: customBudget || total,
  };
};

/**
 * Generate full day-by-day itinerary
 */
const generateItineraryPlan = ({
  duration,
  startLocation,
  budgetTier = 'Moderate',
  travelType = 'Solo',
  travelersCount = 1,
  transportation = 'Private Car',
  selectedDestinations = [],
  customBudget,
}) => {
  // 1. Optimize destination order to minimize travel distance
  const orderedDestinations = optimizeRouteOrder(startLocation, selectedDestinations);

  let currentCoord = {
    latitude: startLocation.latitude || 6.9271,
    longitude: startLocation.longitude || 79.8612,
  };

  const itinerary = [];
  let cumulativeDistance = 0;

  // Allocate destinations across available days
  // If duration > destinations.length, spend multiple days at major destinations
  for (let day = 1; day <= duration; day++) {
    // Map day to an ordered destination
    const destIndex = Math.min(
      Math.floor(((day - 1) / duration) * orderedDestinations.length),
      orderedDestinations.length - 1
    );
    const dest = orderedDestinations[destIndex];

    const distFromPrev = calculateHaversineDistance(
      currentCoord.latitude,
      currentCoord.longitude,
      dest.location.latitude,
      dest.location.longitude
    );

    cumulativeDistance += distFromPrev;
    currentCoord = {
      latitude: dest.location.latitude,
      longitude: dest.location.longitude,
    };

    const isFirstDayAtDest =
      day === 1 ||
      itinerary[day - 2]?.destination?.name !== dest.name;

    // Pick morning, afternoon, evening activities
    const acts = dest.activities || [];
    const morningAct = acts[0] || {
      name: `Explore ${dest.name} Highlights`,
      description: `Morning walking tour around the primary viewpoints and heritage spots of ${dest.name}.`,
      duration: '2.5 hours',
    };
    const afternoonAct = acts[1] || {
      name: 'Local Artisan & Culture Experience',
      description: `Engage with traditional crafts, scenic trails, and scenic viewpoints.`,
      duration: '2 hours',
    };
    const eveningAct = acts[2] || {
      name: 'Sunset Vistas & Authentic Cuisine',
      description: `Relax with sunset landscapes and a fresh Sri Lankan culinary feast.`,
      duration: '2 hours',
    };

    itinerary.push({
      day,
      title: isFirstDayAtDest
        ? `Day ${day}: Arrival & Exploration of ${dest.name}`
        : `Day ${day}: Hidden Wonders & Immersion in ${dest.name}`,
      destination: {
        name: dest.name,
        slug: dest.slug,
        province: dest.province,
        category: dest.category,
        image: dest.images && dest.images.length > 0 ? dest.images[0] : '',
        latitude: dest.location.latitude,
        longitude: dest.location.longitude,
      },
      morningActivity: morningAct,
      afternoonActivity: afternoonAct,
      eveningActivity: eveningAct,
      accommodation: {
        name: `${dest.name} ${budgetTier} Eco-Resort`,
        tier: budgetTier,
        estimatedCost:
          budgetTier === 'Luxury' ? 65000 : budgetTier === 'Budget' ? 7500 : 22000,
      },
      travelFromPrevious: {
        distanceKm: distFromPrev,
        duration: estimateTravelTime(distFromPrev, transportation),
        mode: transportation,
      },
      dailyCost: Math.round(dest.estimatedDailyCost * (budgetTier === 'Luxury' ? 1.8 : budgetTier === 'Budget' ? 0.7 : 1.0)),
      tips: [
        `Carry adequate hydration and sunscreen for ${dest.name}`,
        'Modest attire covering shoulders and knees is mandatory at sacred shrines',
      ],
    });
  }

  // Calculate budget
  const estimatedCost = calculateTripBudget({
    duration,
    travelersCount,
    budgetTier,
    customBudget,
    transportation,
    destinations: orderedDestinations,
  });

  return {
    orderedDestinations,
    itinerary,
    totalDistance: cumulativeDistance,
    estimatedCost,
  };
};

module.exports = {
  optimizeRouteOrder,
  estimateTravelTime,
  calculateTripBudget,
  generateItineraryPlan,
};
