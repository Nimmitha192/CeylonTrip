require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Category = require('../models/Category');
const Hotel = require('../models/Hotel');
const Review = require('../models/Review');
const Trip = require('../models/Trip');
const { categories, destinations, hotels } = require('./seedData');

const seedData = async () => {
  try {
    console.log('[Seeder] Cleaning existing database collections...');
    await Promise.all([
      User.deleteMany(),
      Destination.deleteMany(),
      Category.deleteMany(),
      Hotel.deleteMany(),
      Review.deleteMany(),
      Trip.deleteMany(),
    ]);

    console.log('[Seeder] Creating admin & demo tourist accounts...');
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@12345';
    const adminUser = await User.create({
      name: 'System Administrator',
      email: process.env.ADMIN_DEFAULT_EMAIL || 'admin@lankatrip.com',
      password: adminPassword,
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      preferences: {
        travelType: 'Family',
        budgetTier: 'Luxury',
        interests: ['Culture', 'Wildlife', 'History', 'Photography'],
      },
    });

    const touristUser = await User.create({
      name: 'Ananya Perera',
      email: 'tourist@lankatrip.com',
      password: 'Tourist@12345',
      role: 'user',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      preferences: {
        travelType: 'Couple',
        budgetTier: 'Moderate',
        interests: ['Beaches', 'Hiking', 'Nature', 'Food'],
      },
    });

    console.log('[Seeder] Inserting categories...');
    const createdCategories = await Category.insertMany(categories);

    console.log('[Seeder] Inserting Sri Lankan destinations...');
    const createdDestinations = await Destination.insertMany(destinations);

    console.log('[Seeder] Inserting hotels...');
    await Hotel.insertMany(hotels);

    // Update category counts
    for (const cat of createdCategories) {
      const count = await Destination.countDocuments({ category: cat.name });
      cat.destinationCount = count;
      await cat.save();
    }

    // Add initial reviews
    console.log('[Seeder] Adding authentic destination reviews...');
    const sigiriya = createdDestinations.find((d) => d.slug === 'sigiriya');
    const ella = createdDestinations.find((d) => d.slug === 'ella');
    const galle = createdDestinations.find((d) => d.slug === 'galle-fort');

    if (sigiriya && touristUser) {
      await Review.create({
        user: touristUser._id,
        destination: sigiriya._id,
        rating: 5,
        comment: 'Climbing Sigiriya at sunrise was truly an unforgettable life experience. The engineering of the ancient water gardens and frescoes is unbelievable!',
        status: 'approved',
      });
    }

    if (ella && touristUser) {
      await Review.create({
        user: touristUser._id,
        destination: ella._id,
        rating: 5,
        comment: 'Nine Arch Bridge and Little Adam’s Peak were magical! The blue train ride from Kandy into Ella was the highlight of our entire trip to Sri Lanka.',
        status: 'approved',
      });
    }

    // Add initial favorite for touristUser
    if (ella && sigiriya) {
      touristUser.favorites = [ella._id, sigiriya._id];
      await touristUser.save();
    }

    // Add sample trip for touristUser
    if (touristUser && ella && sigiriya && galle) {
      await Trip.create({
        user: touristUser._id,
        title: 'Classic Sri Lanka Heritage & Highlands',
        duration: 3,
        startingLocation: {
          name: 'Colombo',
          latitude: 6.9271,
          longitude: 79.8612,
        },
        budgetTier: 'Moderate',
        travelType: 'Couple',
        travelersCount: 2,
        interests: ['Culture', 'Hiking', 'Nature', 'Tea'],
        transportation: 'Private Car',
        destinations: [
          {
            destinationId: sigiriya._id,
            name: sigiriya.name,
            latitude: sigiriya.location.latitude,
            longitude: sigiriya.location.longitude,
            category: sigiriya.category,
            image: sigiriya.images[0],
          },
          {
            destinationId: ella._id,
            name: ella.name,
            latitude: ella.location.latitude,
            longitude: ella.location.longitude,
            category: ella.category,
            image: ella.images[0],
          },
          {
            destinationId: galle._id,
            name: galle.name,
            latitude: galle.location.latitude,
            longitude: galle.location.longitude,
            category: galle.category,
            image: galle.images[0],
          },
        ],
        itinerary: [
          {
            day: 1,
            destination: {
              name: 'Sigiriya',
              slug: 'sigiriya',
              province: 'Central',
              category: 'Cultural Heritage',
              image: sigiriya.images[0],
              latitude: 7.957,
              longitude: 80.7603,
            },
            title: 'Royal Wonder of the Ancient Rock',
            morningActivity: {
              name: 'Climb Lion Rock Fortress',
              description: 'Ascend the 1,200 steps past ancient frescoes to the palace ruins.',
              duration: '3 hours',
            },
            afternoonActivity: {
              name: 'Village Catamaran Safari',
              description: 'Boat ride on tranquil rural lakes with water lilies.',
              duration: '2 hours',
            },
            eveningActivity: {
              name: 'Pidurangala Sunset Viewpoint',
              description: 'Relax overlooking the dramatic silhouette of Sigiriya Rock.',
              duration: '2 hours',
            },
            accommodation: {
              name: 'Sigiriya Village Resort',
              tier: 'Moderate',
              estimatedCost: 22000,
            },
            travelFromPrevious: {
              distanceKm: 165,
              duration: '3.5 hours',
              mode: 'Private Car',
            },
            dailyCost: 35000,
            tips: ['Start early to beat the midday sun', 'Wear comfortable footwear'],
          },
          {
            day: 2,
            destination: {
              name: 'Ella',
              slug: 'ella',
              province: 'Uva',
              category: 'Hill Country & Tea',
              image: ella.images[0],
              latitude: 6.8667,
              longitude: 81.0466,
            },
            title: 'Misty Mountains & Colonial Bridges',
            morningActivity: {
              name: 'Nine Arch Bridge Walk',
              description: 'Photograph the morning blue train rumblling across the viaduct.',
              duration: '2 hours',
            },
            afternoonActivity: {
              name: 'Little Adam’s Peak Summit',
              description: 'Easy scenic climb offering views across Ella Gap.',
              duration: '2 hours',
            },
            eveningActivity: {
              name: 'Cafe Chill Dining',
              description: 'Unwind with organic local tea and woodfired delicacies.',
              duration: '2 hours',
            },
            accommodation: {
              name: 'Ella Mountain View Resort',
              tier: 'Moderate',
              estimatedCost: 18000,
            },
            travelFromPrevious: {
              distanceKm: 135,
              duration: '3.5 hours',
              mode: 'Scenic Drive',
            },
            dailyCost: 28000,
            tips: ['Check train timetable before heading to Nine Arch Bridge'],
          },
          {
            day: 3,
            destination: {
              name: 'Galle Fort',
              slug: 'galle-fort',
              province: 'Southern',
              category: 'Cultural Heritage',
              image: galle.images[0],
              latitude: 6.0328,
              longitude: 80.217,
            },
            title: 'Colonial Maritime Splendor & Coastal Sunset',
            morningActivity: {
              name: 'Dutch Ramparts & Lighthouse Stroll',
              description: 'Walk the seawall fortress overlooking the Indian ocean.',
              duration: '2.5 hours',
            },
            afternoonActivity: {
              name: 'Artisan Boutique Exploration',
              description: 'Browse local gems, spice shops, and handmade lace.',
              duration: '2 hours',
            },
            eveningActivity: {
              name: 'Sunset Seafood Dinner',
              description: 'Fresh seafood meal under romantic colonial veranda lights.',
              duration: '2 hours',
            },
            accommodation: {
              name: 'Fort Heritage Villa',
              tier: 'Moderate',
              estimatedCost: 20000,
            },
            travelFromPrevious: {
              distanceKm: 185,
              duration: '3.5 hours',
              mode: 'Private Car',
            },
            dailyCost: 32000,
            tips: ['The fortress ramparts offer the best sunset views in Sri Lanka'],
          },
        ],
        estimatedCost: {
          accommodation: 60000,
          transportation: 45000,
          food: 25000,
          activities: 18000,
          entranceFees: 12000,
          miscellaneous: 8000,
          total: 168000,
        },
        totalDistance: 485,
        status: 'saved',
      });
    }

    console.log('[Seeder] Database successfully seeded with full realistic dataset!');
  } catch (err) {
    console.error(`[Seeder] Error: ${err.message}`);
    throw err;
  }
};

const destroyData = async () => {
  try {
    console.log('[Seeder] Destroying all database records...');
    await Promise.all([
      User.deleteMany(),
      Destination.deleteMany(),
      Category.deleteMany(),
      Hotel.deleteMany(),
      Review.deleteMany(),
      Trip.deleteMany(),
    ]);
    console.log('[Seeder] All database records deleted.');
  } catch (err) {
    console.error(`[Seeder] Error destroying data: ${err.message}`);
    throw err;
  }
};

// Automatic seed if database has 0 destinations
const seedDataIfNeeded = async () => {
  const destCount = await Destination.countDocuments();
  if (destCount === 0) {
    console.log('[Seeder] Zero destinations found. Running automatic seed...');
    await seedData();
  }
};

// Direct script invocation handling
if (require.main === module) {
  const run = async () => {
    const { connectDB, disconnectDB } = require('../config/db');
    await connectDB();
    if (process.argv[2] === '-d') {
      await destroyData();
    } else {
      await seedData();
    }
    await disconnectDB();
    process.exit();
  };
  run();
}

module.exports = { seedData, destroyData, seedDataIfNeeded };
