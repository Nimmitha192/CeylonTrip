import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Calendar,
  MapPin,
  Car,
  Printer,
  Share2,
  ArrowLeft,
  Sun,
  Sunset,
  Moon,
  Hotel,
  Trash2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { printItinerary, shareTripUrl } from '../utils/exportUtils';
import InteractiveMap from '../components/InteractiveMap';
import BudgetChart from '../components/BudgetChart';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await tripService.getTripById(id);
        setTrip(res.data);
      } catch (err) {
        addToast(err.message || 'Error loading trip details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500 sm:text-sm">Loading saved trip...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-3">
        <h2 className="font-bold text-slate-800 text-2xl sm:text-3xl">Trip Not Found</h2>
        <p className="text-xs text-slate-500 sm:text-sm">This itinerary may have been removed or you lack authorization.</p>
        <Link to="/my-trips" className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm">
          Return to My Trips
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (shareTripUrl(trip._id)) {
      addToast('Trip link copied to clipboard!', 'success');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await tripService.deleteTrip(trip._id);
      addToast('Trip deleted successfully', 'success');
      navigate('/my-trips');
    } catch (err) {
      addToast('Error deleting trip', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/my-trips"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Trips
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm sm:text-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          <button
            onClick={printItinerary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm sm:text-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition shadow-sm"
            title="Delete Trip"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Header Summary */}
      <div className="rounded-3xl bg-emerald-50 text-slate-900 p-6 sm:p-10 shadow-card space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
          {trip.duration} Days Sri Lanka Tour
        </div>
        <h1 className="font-display font-extrabold text-slate-900 text-3xl sm:text-4xl lg:text-5xl">
          {trip.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1 sm:text-sm">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-emerald-700" />
            Origin: {trip.startingLocation?.name}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Car className="w-4 h-4 text-amber-700" />
            Transit: {trip.transportation}
          </span>
          <span>•</span>
          <span>Total Distance: ~{trip.totalDistance} km</span>
          <span>•</span>
          <span className="text-emerald-700 font-bold">
            Total Budget: {formatCurrency(trip.estimatedCost?.total)}
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-3">
        <h2 className="font-display font-bold text-slate-900 flex items-center gap-2 text-2xl sm:text-3xl">
          <MapPin className="w-5 h-5 text-emerald-600" />
          Route Map
        </h2>
        <InteractiveMap
          destinations={trip.itinerary.map((d) => ({
            ...d.destination,
            latitude: d.destination?.latitude,
            longitude: d.destination?.longitude,
          }))}
          startLocation={trip.startingLocation}
          showRoute={true}
          height="28.125rem"
        />
      </div>

      {/* Timeline Days */}
      <div className="space-y-6">
        <h2 className="font-display font-bold text-slate-900 text-2xl sm:text-3xl">
          Day-by-Day Schedule
        </h2>

        <div className="space-y-6">
          {trip.itinerary.map((day) => (
            <div
              key={day.day}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                    {day.day}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">
                      {day.title}
                    </h3>
                    <span className="text-xs text-emerald-700 font-semibold sm:text-sm">
                      {day.destination?.name} ({day.destination?.province} Province)
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg sm:text-sm">
                  Est: {formatCurrency(day.dailyCost)}
                </span>
              </div>

              {/* Activities */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1.5 text-xs sm:text-sm">
                  <span className="font-bold text-amber-700 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5" /> Morning
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">{day.morningActivity?.name}</h4>
                  <p className="text-slate-600">{day.morningActivity?.description}</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5 text-xs sm:text-sm">
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <Sunset className="w-3.5 h-3.5" /> Afternoon
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">{day.afternoonActivity?.name}</h4>
                  <p className="text-slate-600">{day.afternoonActivity?.description}</p>
                </div>

                <div className="p-4 rounded-xl bg-ocean-50/50 border border-ocean-100 space-y-1.5 text-xs sm:text-sm">
                  <span className="font-bold text-ocean-700 flex items-center gap-1">
                    <Moon className="w-3.5 h-3.5" /> Evening
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">{day.eveningActivity?.name}</h4>
                  <p className="text-slate-600">{day.eveningActivity?.description}</p>
                </div>
              </div>

              {day.accommodation && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-emerald-600" />
                    <span>Stay: <strong>{day.accommodation.name}</strong> ({day.accommodation.tier})</span>
                  </div>
                  <span className="font-bold text-emerald-700">
                    {formatCurrency(day.accommodation.estimatedCost)} / night
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Budget Breakdown */}
      <BudgetChart budget={trip.estimatedCost} />
    </div>
  );
}
