import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  MapPin,
  Car,
  Clock,
  Save,
  Share2,
  Printer,
  RotateCcw,
  Hotel,
  Sun,
  Sunset,
  Moon,
  ChevronDown,
  ChevronUp,
  Cpu,
  Trash2,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { tripService } from '../services/tripService';
import { formatCurrency, formatDuration } from '../utils/formatters';
import { printItinerary } from '../utils/exportUtils';
import InteractiveMap from '../components/InteractiveMap';
import BudgetChart from '../components/BudgetChart';

export default function GeneratedItinerary() {
  const { generatedTrip, setGeneratedTrip } = useTrip();
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [showAlgorithmDetails, setShowAlgorithmDetails] = useState(false);

  if (!generatedTrip) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4 space-y-4">
        <Sparkles className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="font-bold text-slate-800 text-2xl sm:text-3xl">No Generated Itinerary Found</h2>
        <p className="text-xs text-slate-500 sm:text-sm">
          Please run the Trip Planner wizard to formulate your personalized Sri Lankan travel itinerary.
        </p>
        <Link
          to="/planner"
          className="inline-block px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md sm:text-sm"
        >
          Launch Trip Planner
        </Link>
      </div>
    );
  }

  const handleSaveTrip = async () => {
    if (!isAuthenticated) {
      addToast('Please log in or register to save this itinerary to your account', 'info');
      navigate('/login');
      return;
    }

    setSaving(true);
    try {
      const res = await tripService.saveTrip(generatedTrip);
      addToast('Trip saved successfully to your profile!', 'success');
      navigate(`/trips/${res.data._id}`);
    } catch (err) {
      addToast(err.message || 'Error saving trip', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveDestination = (destName) => {
    const updatedItinerary = generatedTrip.itinerary.filter(
      (day) => day.destination.name !== destName
    );
    if (updatedItinerary.length === 0) {
      addToast('Cannot remove all destinations from itinerary', 'error');
      return;
    }
    const updatedTrip = {
      ...generatedTrip,
      itinerary: updatedItinerary.map((day, idx) => ({ ...day, day: idx + 1 })),
      duration: updatedItinerary.length,
    };
    setGeneratedTrip(updatedTrip);
    addToast(`Removed ${destName} from itinerary`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Itinerary Header Banner */}
      <div className="rounded-3xl bg-emerald-50 text-slate-900 p-6 sm:p-10 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            Optimized Itinerary Plan
          </div>
          <h1 className="font-display font-extrabold text-slate-900 text-3xl sm:text-4xl lg:text-5xl">
            {generatedTrip.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1 sm:text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-emerald-700" />
              {generatedTrip.duration} Days
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-emerald-700" />
              Departure: {generatedTrip.startingLocation?.name}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Car className="w-4 h-4 text-amber-700" />
              Transit: {generatedTrip.transportation}
            </span>
            <span>•</span>
            <span>Total Dist: ~{generatedTrip.totalDistance} km</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={printItinerary}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs sm:text-sm"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>

          <button
            type="button"
            onClick={() => navigate('/planner')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs sm:text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Regenerate
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleSaveTrip}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 sm:text-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save This Trip'}
          </button>
        </div>
      </div>

      {/* Algorithm Transparency Toggle */}
      {generatedTrip.recommendationBreakdown && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft space-y-4">
          <button
            onClick={() => setShowAlgorithmDetails(!showAlgorithmDetails)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Recommendation Engine Score Transparency (MCDA Evaluation)
                </h3>
                <p className="text-xs text-slate-500 sm:text-sm">
                  See how Multi-Criteria Decision Analysis scored each candidate destination
                </p>
              </div>
            </div>
            {showAlgorithmDetails ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {showAlgorithmDetails && (
            <div className="pt-4 border-t border-slate-100 overflow-x-auto">
              <table className="w-full text-xs text-left sm:text-sm">
                <thead className="text-xs uppercase font-bold text-slate-400 border-b">
                  <tr>
                    <th className="py-2">Destination</th>
                    <th className="py-2">Composite Score</th>
                    <th className="py-2">Interest (30%)</th>
                    <th className="py-2">Budget (20%)</th>
                    <th className="py-2">Distance (20%)</th>
                    <th className="py-2">Duration (10%)</th>
                    <th className="py-2">Rating (10%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {generatedTrip.recommendationBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold text-slate-800">{item.destinationName}</td>
                      <td className="py-2.5 font-extrabold text-emerald-700">{item.score} / 100</td>
                      <td className="py-2.5 text-slate-600">{item.factors?.interestMatch}%</td>
                      <td className="py-2.5 text-slate-600">{item.factors?.budgetCompatibility}%</td>
                      <td className="py-2.5 text-slate-600">{item.factors?.distanceEfficiency}%</td>
                      <td className="py-2.5 text-slate-600">{item.factors?.durationCompatibility}%</td>
                      <td className="py-2.5 text-slate-600">{item.factors?.ratingScore}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Interactive Leaflet Route Map */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-slate-900 flex items-center gap-2 text-2xl sm:text-3xl">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Optimized Geographic Travel Route
          </h2>
          <span className="text-xs font-semibold text-slate-500 sm:text-sm">
            Dotted line illustrates sequential transit path
          </span>
        </div>
        <InteractiveMap
          destinations={generatedTrip.itinerary.map((day) => ({
            ...day.destination,
            name: day.destination.name,
            latitude: day.destination.latitude,
            longitude: day.destination.longitude,
          }))}
          startLocation={generatedTrip.startingLocation}
          showRoute={true}
          height="28.125rem"
        />
      </div>

      {/* Day-by-Day Timeline */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
            Timeline Schedule
          </span>
          <h2 className="font-display font-extrabold text-slate-900 text-2xl sm:text-3xl">
            Day-by-Day Itinerary
          </h2>
        </div>

        <div className="space-y-6">
          {generatedTrip.itinerary.map((day) => (
            <div
              key={day.day}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6 relative hover:border-emerald-300 transition"
            >
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-display font-extrabold shadow-md shrink-0">
                    <span className="text-xs tracking-wider uppercase leading-tight font-medium">Day</span>
                    <span className="text-lg leading-none">{day.day}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-700 block sm:text-sm">
                      {day.destination?.name} • {day.destination?.province} Province
                    </span>
                    <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">
                      {day.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center text-xs sm:text-sm">
                  <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
                    Est. Daily Spend: {formatCurrency(day.dailyCost)}
                  </span>
                  <button
                    onClick={() => handleRemoveDestination(day.destination.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove destination from plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Transit badge from previous stop */}
              {day.travelFromPrevious?.distanceKm > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600 sm:text-sm">
                  <span className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-emerald-600" />
                    Travel from previous stop: ~{day.travelFromPrevious.distanceKm} km
                  </span>
                  <span className="font-semibold text-slate-800">
                    Est. Duration: {day.travelFromPrevious.duration}
                  </span>
                </div>
              )}

              {/* Morning, Afternoon, Evening Activity Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Morning */}
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 sm:text-sm">
                    <Sun className="w-4 h-4" />
                    Morning (08:30 - 12:00)
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                    {day.morningActivity?.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed sm:text-sm">
                    {day.morningActivity?.description}
                  </p>
                  <span className="text-xs text-slate-400 block pt-1 sm:text-sm">
                    Duration: {day.morningActivity?.duration || '2.5 hrs'}
                  </span>
                </div>

                {/* Afternoon */}
                <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 sm:text-sm">
                    <Sunset className="w-4 h-4" />
                    Afternoon (13:30 - 16:30)
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                    {day.afternoonActivity?.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed sm:text-sm">
                    {day.afternoonActivity?.description}
                  </p>
                  <span className="text-xs text-slate-400 block pt-1 sm:text-sm">
                    Duration: {day.afternoonActivity?.duration || '2 hrs'}
                  </span>
                </div>

                {/* Evening */}
                <div className="p-4 rounded-2xl bg-ocean-50/40 border border-ocean-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-ocean-700 sm:text-sm">
                    <Moon className="w-4 h-4" />
                    Evening (17:30 - 20:30)
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                    {day.eveningActivity?.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed sm:text-sm">
                    {day.eveningActivity?.description}
                  </p>
                  <span className="text-xs text-slate-400 block pt-1 sm:text-sm">
                    Duration: {day.eveningActivity?.duration || '2 hrs'}
                  </span>
                </div>
              </div>

              {/* Accommodation Suggestion */}
              {day.accommodation && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center">
                      <Hotel className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400 block">
                        Recommended Stay ({day.accommodation.tier} Tier)
                      </span>
                      <strong className="text-slate-800 font-bold text-sm sm:text-base">
                        {day.accommodation.name}
                      </strong>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700">
                    ~{formatCurrency(day.accommodation.estimatedCost)} / night
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Budget Breakdown Chart Component */}
      <BudgetChart budget={generatedTrip.estimatedCost} />
    </div>
  );
}
