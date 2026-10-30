require('dotenv').config();
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Destination = require('../models/Destination');
const { recommendDestinations } = require('../services/recommendationService');
const { generateItineraryPlan } = require('../services/itineraryService');

async function verifyAll() {
  console.log('[E2E Verification] Connecting to database...');
  await connectDB();

  console.log('[E2E Verification] Checking destinations count...');
  const count = await Destination.countDocuments();
  console.log(`[E2E Verification] Total Sri Lankan destinations in database: ${count}`);
  if (count < 20) {
    throw new Error(`Expected at least 20 destinations, found ${count}`);
  }

  console.log('[E2E Verification] Checking default admin and tourist accounts...');
  const admin = await User.findOne({ email: 'admin@lankatrip.com' }).select('+password');
  if (!admin || admin.role !== 'admin') {
    throw new Error('Admin account not found or has incorrect role');
  }
  const isMatch = await admin.matchPassword('Admin@12345');
  if (!isMatch) {
    throw new Error('Admin password hash verification failed');
  }
  console.log('✔ Admin account verified');

  const tourist = await User.findOne({ email: 'tourist@lankatrip.com' });
  if (!tourist) {
    throw new Error('Tourist demo account not found');
  }
  console.log('✔ Tourist account verified');

  console.log('[E2E Verification] Testing Recommendation Engine & Route Optimization (5-day tour from Colombo)...');
  const allDestinations = await Destination.find({});
  const recs = recommendDestinations(allDestinations, {
    duration: 5,
    startingLocation: { name: 'Colombo', latitude: 6.9271, longitude: 79.8612 },
    budgetTier: 'Moderate',
    travelType: 'Couple',
    interests: ['Culture', 'Nature', 'Beaches'],
  });
  console.log(`✔ Recommendation Engine produced ${recs.length} top scored destinations:`);
  recs.forEach((r, idx) => {
    console.log(`   ${idx + 1}. ${r.destination.name} (Score: ${r.score}/100)`);
  });

  const itinerary = generateItineraryPlan({
    duration: 5,
    startLocation: { name: 'Colombo', latitude: 6.9271, longitude: 79.8612 },
    budgetTier: 'Moderate',
    travelType: 'Couple',
    travelersCount: 2,
    transportation: 'Private Car',
    selectedDestinations: recs.map((r) => r.destination),
  });

  console.log(`✔ Route Optimizer ordered sequence: ${itinerary.orderedDestinations.map((d) => d.name).join(' -> ')}`);
  console.log(`✔ Total Distance: ~${itinerary.totalDistance} km`);
  console.log(`✔ Total Budget: LKR ${itinerary.estimatedCost.total.toLocaleString()}`);
  console.log(`✔ Generated ${itinerary.itinerary.length} daily schedules with morning, afternoon, evening activities.`);

  console.log('\n======================================================');
  console.log('  ALL END-TO-END SYSTEM CHECKS PASSED SUCCESSFULLY!  ');
  console.log('======================================================\n');

  await disconnectDB();
  process.exit(0);
}

verifyAll().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
