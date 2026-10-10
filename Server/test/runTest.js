/**
 * LankaTrip Planner - Automated Backend Test Suite
 * Validates recommendation algorithms, route optimization, and budget calculation.
 */

const assert = require('assert');
const {
  calculateHaversineDistance,
  calculateInterestMatch,
  calculateBudgetCompatibility,
  calculateDistanceEfficiency,
  scoreDestination,
  recommendDestinations,
} = require('../services/recommendationService');
const {
  optimizeRouteOrder,
  calculateTripBudget,
  generateItineraryPlan,
} = require('../services/itineraryService');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  \x1b[32m✔\x1b[0m ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  \x1b[31m✖\x1b[0m ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

console.log('\n======================================================');
console.log('  LANKATRIP PLANNER - BACKEND AUTOMATED TEST SUITE');
console.log('======================================================\n');

// 1. Haversine Distance Tests
console.log('\x1b[36m[Group 1: Geographic Calculations & Haversine Distance]\x1b[0m');
runTest('Should accurately calculate distance between Colombo and Kandy (~95-115 km)', () => {
  // Colombo (6.9271, 79.8612) to Kandy (7.2906, 80.6337)
  const dist = calculateHaversineDistance(6.9271, 79.8612, 7.2906, 80.6337);
  assert.ok(dist >= 85 && dist <= 120, `Expected ~95-115km, got ${dist}km`);
});

runTest('Should return 0 for identical coordinates', () => {
  const dist = calculateHaversineDistance(6.9271, 79.8612, 6.9271, 79.8612);
  assert.strictEqual(dist, 0);
});

// 2. Interest Match Scoring Tests
console.log('\n\x1b[36m[Group 2: Recommendation Scoring - Interest Matching]\x1b[0m');
runTest('Should score high (>= 80) when user interests align with destination tags', () => {
  const destination = {
    name: 'Mirissa',
    category: 'Beaches & Coastal',
    tags: ['Beaches', 'Surfing', 'Wildlife', 'Photography'],
    activities: [{ name: 'Blue Whale Watching' }, { name: 'Surfing' }],
  };
  const score = calculateInterestMatch(['Beaches', 'Surfing'], destination);
  assert.ok(score >= 80, `Expected >= 80, got ${score}`);
});

runTest('Should return baseline score when user has no specified interests', () => {
  const destination = { tags: ['Hiking'] };
  const score = calculateInterestMatch([], destination);
  assert.strictEqual(score, 80);
});

// 3. Budget Compatibility Scoring Tests
console.log('\n\x1b[36m[Group 3: Recommendation Scoring - Budget Compatibility]\x1b[0m');
runTest('Should give perfect 100 score for destination well-aligned with Moderate tier', () => {
  const score = calculateBudgetCompatibility('Moderate', null, 25000);
  assert.strictEqual(score, 100);
});

runTest('Should return reasonable score even for budget variance', () => {
  const score = calculateBudgetCompatibility('Budget', null, 30000);
  assert.ok(score >= 40 && score <= 80);
});

// 4. MCDA Composite Scoring
console.log('\n\x1b[36m[Group 4: Multi-Criteria Decision Analysis (MCDA)]\x1b[0m');
runTest('Should produce normalized composite score between 0 and 100', () => {
  const dest = {
    name: 'Sigiriya',
    category: 'Cultural Heritage',
    province: 'Central',
    estimatedDailyCost: 22000,
    recommendedDuration: 1,
    popularityScore: 98,
    averageRating: 4.9,
    location: { latitude: 7.957, longitude: 80.7603 },
    tags: ['Culture', 'History', 'Hiking'],
    activities: [{ name: 'Climb Lion Rock' }],
  };

  const result = scoreDestination(dest, {
    duration: 3,
    startingLocation: { latitude: 6.9271, longitude: 79.8612 },
    budgetTier: 'Moderate',
    interests: ['Culture', 'History'],
  });

  assert.ok(result.score >= 0 && result.score <= 100, `Score out of bounds: ${result.score}`);
  assert.ok(result.breakdown.interestMatch > 0);
  assert.ok(result.breakdown.budgetCompatibility > 0);
  assert.ok(result.breakdown.distanceEfficiency > 0);
});

// 5. Route Optimization (Nearest Neighbor TSP)
console.log('\n\x1b[36m[Group 5: Route Optimization (Nearest Neighbor Heuristic)]\x1b[0m');
runTest('Should order destinations sequentially from departure point rather than zigzagging', () => {
  const start = { name: 'Colombo', latitude: 6.9271, longitude: 79.8612 };
  const dests = [
    { name: 'Galle', location: { latitude: 6.0328, longitude: 80.217 } },
    { name: 'Kandy', location: { latitude: 7.2906, longitude: 80.6337 } },
    { name: 'Mirissa', location: { latitude: 5.9483, longitude: 80.4578 } },
  ];

  const ordered = optimizeRouteOrder(start, dests);
  assert.strictEqual(ordered.length, 3);
  // Galle is closer to Colombo than Mirissa, Mirissa is adjacent to Galle
  const galleIndex = ordered.findIndex((d) => d.name === 'Galle');
  const mirissaIndex = ordered.findIndex((d) => d.name === 'Mirissa');
  assert.ok(Math.abs(galleIndex - mirissaIndex) === 1, 'Galle and Mirissa should be adjacent in route');
});

// 6. Budget Calculator Tests
console.log('\n\x1b[36m[Group 6: Itemized Budget Calculations]\x1b[0m');
runTest('Should accurately calculate itemized and total budget for 5 days', () => {
  const budget = calculateTripBudget({
    duration: 5,
    travelersCount: 2,
    budgetTier: 'Moderate',
    transportation: 'Private Car',
    destinations: [
      { entranceFee: { foreign: 5000 }, activities: [{ estimatedCost: 3000 }] },
      { entranceFee: { foreign: 2000 }, activities: [{ estimatedCost: 1500 }] },
    ],
  });

  assert.ok(budget.accommodation > 0, 'Accommodation should be calculated');
  assert.ok(budget.transportation > 0, 'Transportation should be calculated');
  assert.ok(budget.food > 0, 'Food should be calculated');
  assert.ok(budget.total === budget.accommodation + budget.transportation + budget.food + budget.entranceFees + budget.activities + budget.miscellaneous);
});

// Summary
console.log('\n======================================================');
console.log(`  TEST RESULTS: ${passedTests}/${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('======================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
