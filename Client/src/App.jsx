
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from './layouts/MainLayout';

// Guard
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Homepage';
import Destinations from './pages/Destinations';
import DestinationDetails from './pages/DestinationDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Authenticated Pages
import UserDashboard from './pages/UserDashboard';
import TripPlanner from './pages/TripPlanner';
import GeneratedItinerary from './pages/GeneratedItinerary';
import MyTrips from './pages/MyTrips';
import TripDetails from './pages/TripDetails';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import UserReviews from './pages/UserReviews';

export default function App() {
  return (
    <Routes>
      {/* Public & User Routes */}
      <Route path="/" element={<MainLayout />}>

        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="destinations" element={<Destinations />} />
        <Route
          path="destinations/:idOrSlug"
          element={<DestinationDetails />}
        />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Planner & Itinerary */}
        <Route path="planner" element={<TripPlanner />} />
        <Route
          path="itinerary"
          element={<GeneratedItinerary />}
        />

        {/* Protected User Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="my-trips"
          element={
            <ProtectedRoute>
              <MyTrips />
            </ProtectedRoute>
          }
        />

        <Route
          path="trips/:id"
          element={
            <ProtectedRoute>
              <TripDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="reviews"
          element={
            <ProtectedRoute>
              <UserReviews />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* 404 Fallback */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
