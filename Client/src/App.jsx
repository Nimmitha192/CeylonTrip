import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminKayout';

// Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { useAuth } from './context/AuthContext';

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

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDestinations from './pages/admin/ManageDestinations';
import DestinationForm from './pages/admin/DestinationForm';
import ManageCategories from './pages/admin/ManageCategories';
import ManageActivities from './pages/admin/ManageActivities';
import ManageHotels from './pages/admin/ManageHotels';
import ManageReviews from './pages/admin/ManageReviews';
import ManageTrips from './pages/admin/ManageTrips';

export default function App() {
  const { isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public & User Routes in MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="destinations/:idOrSlug" element={<DestinationDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Public or Semi-Protected Planner & Itinerary */}
        <Route path="planner" element={<TripPlanner />} />
        <Route path="itinerary" element={<GeneratedItinerary />} />

        {/* Protected User Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              {isAdmin ? <Navigate to="/admin" replace /> : <UserDashboard />}
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

      {/* Admin Suite in AdminLayout */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="destinations" element={<ManageDestinations />} />
        <Route path="destinations/new" element={<DestinationForm />} />
        <Route path="destinations/:id/edit" element={<DestinationForm />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="activities" element={<ManageActivities />} />
        <Route path="hotels" element={<ManageHotels />} />
        <Route path="reviews" element={<ManageReviews />} />
        <Route path="trips" element={<ManageTrips />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
