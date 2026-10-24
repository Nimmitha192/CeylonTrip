import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { useToast } from '../context/ToastContext';
import {
  Luggage,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchTrips = async () => {
    try {
      const res = await tripService.getMyTrips();
      setTrips(res.data || []);
    } catch (err) {
      addToast('Error loading your saved trips', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDeleteTrip = async (e, tripId, tripTitle) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${tripTitle}"?`)) return;

    try {
      await tripService.deleteTrip(tripId);
      addToast('Trip deleted successfully', 'success');
      setTrips(trips.filter((t) => t._id !== tripId));
    } catch (err) {
      addToast('Error deleting trip', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
            My Travel Portfolio
          </span>
          <h1 className="font-display font-extrabold text-slate-900 text-3xl sm:text-4xl lg:text-5xl">
            Saved Trips & Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access and review your custom Sri Lankan journeys anytime.
          </p>
        </div>

        <Link
          to="/planner"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition self-start sm:self-auto sm:text-sm"
        >
          <Sparkles className="w-4 h-4" />
          Plan New Trip
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <Luggage className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base">No Saved Trips Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto sm:text-sm">
            You have not saved any trip plans yet. Use our recommendation wizard to create your first itinerary!
          </p>
          <Link
            to="/planner"
            className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md sm:text-sm"
          >
            Launch Planner
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="bg-white rounded-3xl border border-slate-200 shadow-soft hover:shadow-card hover:border-emerald-300 transition-all duration-300 p-6 flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 sm:text-sm">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {trip.duration} Days Tour
                  </span>
                  <span>Created {formatDate(trip.createdAt)}</span>
                </div>

                <Link to={`/trips/${trip._id}`} className="block">
                  <h3 className="font-display font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-2 text-sm sm:text-base">
                    {trip.title}
                  </h3>
                </Link>

                <div className="space-y-1.5 text-xs text-slate-500 pt-1 sm:text-sm">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Departure: {trip.startingLocation?.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Stops: {trip.destinations?.map((d) => d.name).join(' → ')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block">Est. Cost</span>
                  <span className="font-extrabold text-sm text-slate-900 sm:text-base">
                    {formatCurrency(trip.estimatedCost?.total)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDeleteTrip(e, trip._id, trip.title)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/trips/${trip._id}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition sm:text-sm"
                  >
                    View Plan
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
