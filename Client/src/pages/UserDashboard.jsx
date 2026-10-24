import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';
import { reviewService } from '../services/reviewService';
import {
  Luggage,
  Heart,
  MessageSquare,
  Sparkles,
  MapPin,
  Calendar,
  Compass,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function UserDashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [tripRes, revRes] = await Promise.all([
          tripService.getMyTrips(),
          reviewService.getUserReviews(),
        ]);
        setTrips(tripRes.data || []);
        setReviewsCount(revRes.count || 0);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-emerald-50 border border-emerald-200 text-slate-900 p-8 sm:p-10 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 text-xs font-semibold sm:text-sm">
              Traveler Profile
            </div>
            <h1 className="font-display font-extrabold text-slate-900 text-3xl sm:text-4xl lg:text-5xl">
              Ayubowan, {user?.name}!
            </h1>
            <p className="text-xs text-slate-600 sm:text-sm">
              {user?.preferences?.travelType || 'Solo'} Traveler • {user?.preferences?.budgetTier || 'Moderate'} Budget
            </p>
          </div>
        </div>

        <Link
          to="/planner"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition shrink-0 sm:text-sm"
        >
          <Sparkles className="w-4 h-4" />
          Create New Itinerary
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/my-trips"
          className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft hover:shadow-card hover:border-emerald-300 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Trips</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition">
              <Luggage className="w-5 h-5" />
            </div>
          </div>
          <span className="font-display font-extrabold text-3xl text-slate-900 block">
            {trips.length}
          </span>
          <span className="text-xs text-slate-400 mt-1 block sm:text-sm">View and manage itineraries</span>
        </Link>

        <Link
          to="/favorites"
          className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft hover:shadow-card hover:border-rose-300 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Favorite Spots</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <span className="font-display font-extrabold text-3xl text-slate-900 block">
            {user?.favorites?.length || 0}
          </span>
          <span className="text-xs text-slate-400 mt-1 block sm:text-sm">Saved Sri Lankan destinations</span>
        </Link>

        <Link
          to="/reviews"
          className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft hover:shadow-card hover:border-amber-300 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reviews Written</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <span className="font-display font-extrabold text-3xl text-slate-900 block">
            {reviewsCount}
          </span>
          <span className="text-xs text-slate-400 mt-1 block sm:text-sm">Feedback shared with travelers</span>
        </Link>
      </div>

      {/* Recent Trips */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-slate-900 text-2xl sm:text-3xl">
            Recent Travel Itineraries
          </h2>
          <Link
            to="/my-trips"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 sm:text-sm"
          >
            View All Trips
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 py-6 sm:text-sm">Loading trips...</p>
        ) : trips.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
            <Compass className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">No saved trips yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto sm:text-sm">
              Ready for an unforgettable Sri Lankan vacation? Let our algorithm generate your personalized trip plan.
            </p>
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm"
            >
              <Sparkles className="w-4 h-4" />
              Build My First Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.slice(0, 3).map((trip) => (
              <div
                key={trip._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-soft p-5 flex flex-col justify-between space-y-4 hover:shadow-card transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 sm:text-sm">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <Clock className="w-3.5 h-3.5" />
                      {trip.duration} Days
                    </span>
                    <span>{formatDate(trip.createdAt)}</span>
                  </div>
                  <h3 className="font-display font-bold text-slate-900 leading-snug line-clamp-2 text-sm sm:text-base">
                    {trip.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 sm:text-sm">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Starts: {trip.startingLocation?.name}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-emerald-700 sm:text-base">
                    {formatCurrency(trip.estimatedCost?.total)}
                  </span>
                  <Link
                    to={`/trips/${trip._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-700 transition sm:text-sm"
                  >
                    View Plan
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
