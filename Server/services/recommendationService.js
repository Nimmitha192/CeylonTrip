/**
 * ============================================================================
 * LankaTrip Planner - Recommendation Engine (MCDA Scoring Service)
 * ============================================================================
 *
 * Implements a Multi-Criteria Decision Analysis (MCDA) scoring algorithm to rank
 * Sri Lankan destinations based on user preferences.
 *
 * Recommendation Score Formulation:
 *   Score = (interestMatch * 0.30) +
 *           (budgetCompatibility * 0.20) +
 *           (distanceEfficiency * 0.20) +
 *           (durationCompatibility * 0.10) +
 *           (popularityScore * 0.10) +
 *           (ratingScore * 0.10)
 *
 * All factors are normalized to a 0 - 100 scale.
 * ============================================================================
 */

// Haversine formula to compute great-circle distance between two GPS coordinates in km
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

/**
 * 1. Interest Match (Weight: 30%)
 * Computes overlap between user selected interests and destination tags/activities/category.
 */
const calculateInterestMatch = (userInterests = [], destination) => {
  if (!userInterests || userInterests.length === 0) {
    return 80; // Neutral baseline when user has no specific preferences
  }

  const destKeywords = [
    ...(destination.tags || []),
    destination.category || '',
    ...(destination.activities ? destination.activities.map((a) => a.name) : []),
  ].map((s) => s.toLowerCase());

  let matches = 0;
  userInterests.forEach((interest) => {
    const term = interest.toLowerCase();
    const hasMatch = destKeywords.some((kw) => kw.includes(term) || term.includes(kw));
    if (hasMatch) matches += 1;
  });

  const ratio = matches / userInterests.length;
  // Scale between 20 (no direct match) and 100 (full match)
  return Math.min(100, Math.round(20 + ratio * 80));
};

/**
 * 2. Budget Compatibility (Weight: 20%)
 * Compares user budget tier or custom daily budget with destination estimated daily cost.
 */
const calculateBudgetCompatibility = (budgetTier = 'Moderate', customBudget, destinationDailyCost = 20000) => {
  // Expected average daily spend tiers in LKR
  const tierBudgets = {
    Budget: 15000,
    Moderate: 25000,
    Luxury: 55000,
  };

  const targetDailyBudget = customBudget || tierBudgets[budgetTier] || 25000;

  // Calculate percentage variance
  const diff = Math.abs(targetDailyBudget - destinationDailyCost);
  const varianceRatio = diff / targetDailyBudget;

  if (varianceRatio <= 0.25) return 100;
  if (varianceRatio <= 0.50) return 80;
  if (varianceRatio <= 0.75) return 60;
  return 40;
};

/**
 * 3. Distance Efficiency (Weight: 20%)
 * Scores destination based on practical distance from starting origin (e.g. within Sri Lanka ~400km max).
 */
const calculateDistanceEfficiency = (startLocation, destinationLocation) => {
  if (!startLocation || !startLocation.latitude || !destinationLocation) {
    return 70;
  }

  const dist = calculateHaversineDistance(
    startLocation.latitude,
    startLocation.longitude,
    destinationLocation.latitude,
    destinationLocation.longitude
  );

  // Sri Lanka max north-south distance is ~435 km.
  // Shorter transit times from start hub get higher efficiency scores.
  if (dist <= 60) return 100;
  if (dist <= 120) return 90;
  if (dist <= 180) return 80;
  if (dist <= 260) return 65;
  if (dist <= 350) return 50;
  return 35;
};

/**
 * 4. Duration Compatibility (Weight: 10%)
 * Checks whether destination recommended duration fits the overall requested trip duration.
 */
const calculateDurationCompatibility = (tripDuration = 3, destDuration = 1) => {
  if (tripDuration <= 2 && destDuration > 2) return 40; // Too long for a short trip
  if (tripDuration >= 7 && destDuration >= 2) return 100; // Great for longer tours
  return 85;
};

/**
 * Compute total composite score for a single destination
 */
const scoreDestination = (destination, preferences) => {
  const {
    interests = [],
    budgetTier = 'Moderate',
    customBudget,
    startingLocation,
    duration = 3,
  } = preferences;

  const interestMatch = calculateInterestMatch(interests, destination);
  const budgetCompat = calculateBudgetCompatibility(
    budgetTier,
    customBudget ? customBudget / duration : null,
    destination.estimatedDailyCost
  );
  const distanceEff = calculateDistanceEfficiency(
    startingLocation,
    destination.location
  );
  const durationCompat = calculateDurationCompatibility(
    duration,
    destination.recommendedDuration
  );
  const popularity = Math.min(100, Math.max(0, destination.popularityScore || 80));
  const ratingScore = Math.min(100, Math.max(0, ((destination.averageRating || 4.5) / 5) * 100));

  // Multi-Criteria Decision Analysis (MCDA) weighted formula
  const compositeScore =
    interestMatch * 0.30 +
    budgetCompat * 0.20 +
    distanceEff * 0.20 +
    durationCompat * 0.10 +
    popularity * 0.10 +
    ratingScore * 0.10;

  return {
    destination,
    score: Math.round(compositeScore * 10) / 10,
    breakdown: {
      interestMatch,
      budgetCompatibility: budgetCompat,
      distanceEfficiency: distanceEff,
      durationCompatibility: durationCompat,
      popularityScore: popularity,
      ratingScore: Math.round(ratingScore),
    },
  };
};

/**
 * Rank and select top destinations matching duration and user preferences
 */
const recommendDestinations = (allDestinations, preferences) => {
  const { duration = 3 } = preferences;

  // Determine target number of stops:
  // Short trip (1-2 days) -> 1-2 destinations
  // 3-4 days -> 2-3 destinations
  // 5-7 days -> 3-5 destinations
  // 8-10 days -> 5-7 destinations
  // 11-14+ days -> 7-10 destinations
  let maxStops = 2;
  if (duration >= 14) maxStops = 8;
  else if (duration >= 10) maxStops = 6;
  else if (duration >= 7) maxStops = 5;
  else if (duration >= 5) maxStops = 4;
  else if (duration >= 3) maxStops = 3;

  // Calculate scores for all candidate destinations
  const scored = allDestinations.map((dest) => scoreDestination(dest, preferences));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Return top matching destinations
  return scored.slice(0, maxStops);
};

module.exports = {
  scoreDestination,
  recommendDestinations,
  calculateHaversineDistance,
  calculateInterestMatch,
  calculateBudgetCompatibility,
  calculateDistanceEfficiency,
};
