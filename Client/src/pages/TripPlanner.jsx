import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Heart,
  Car,
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Compass,
  Cpu,
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useToast } from '../context/ToastContext';
import {
  STARTING_LOCATIONS,
  DURATION_OPTIONS,
  BUDGET_TIERS,
  TRAVEL_GROUPS,
  INTEREST_OPTIONS,
  TRANSPORT_OPTIONS,
} from '../utils/constants';

export default function TripPlanner() {
  const { tripInputs, setTripInputs, generatePersonalizedTrip } = useTrip();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('');

  // Step validation
  const handleNext = () => {
    if (currentStep === 5 && tripInputs.interests.length === 0) {
      addToast('Please select at least one interest to personalize your trip', 'info');
      return;
    }
    setCurrentStep((prev) => Math.min(7, prev + 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleInterestToggle = (id) => {
    setTripInputs((prev) => {
      const exists = prev.interests.includes(id);
      const newInterests = exists
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id];
      return { ...prev, interests: newInterests };
    });
  };

  const handleGenerate = async () => {
    setLoading(true);

    const steps = [
      'Scanning Sri Lanka destination database...',
      'Filtering unsuitable locations based on budget & duration...',
      'Calculating MCDA composite scores (Interest 30%, Budget 20%, Distance 20%)...',
      'Solving Traveling Salesperson Problem (TSP) with Haversine distance matrix...',
      'Sequencing destinations to eliminate backtracking...',
      'Assigning morning, afternoon, and evening experiences...',
      'Finalizing itemized Sri Lankan Rupee budget breakdown...',
    ];

    let stepIndex = 0;
    setLoadingStepText(steps[0]);

    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setLoadingStepText(steps[stepIndex]);
      }
    }, 650);

    try {
      await generatePersonalizedTrip();
      clearInterval(interval);
      navigate('/itinerary');
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Wizard Progress Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Smart Recommendation Wizard
        </div>
        <h1 className="font-display font-extrabold text-slate-900 text-3xl sm:text-4xl lg:text-5xl">
          Personalized Trip Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Provide your travel preferences below. Our algorithm will formulate an optimized, day-by-day Sri Lankan itinerary for you.
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2 px-2 sm:text-sm">
          <span>Step {currentStep} of 7</span>
          <span className="text-emerald-700">
            {currentStep === 1 && 'Duration'}
            {currentStep === 2 && 'Departure Hub'}
            {currentStep === 3 && 'Budget Tier'}
            {currentStep === 4 && 'Travel Group'}
            {currentStep === 5 && 'Interests'}
            {currentStep === 6 && 'Transit Mode'}
            {currentStep === 7 && 'Review & Generate'}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Steps Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-card min-h-105 flex flex-col justify-between">
        {/* STEP 1: DURATION */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-slate-900 flex items-center gap-2 text-2xl sm:text-3xl">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Step 1: How many days will you travel?
              </h2>
              <p className="text-xs text-slate-500 mt-1 sm:text-sm">
                Select from recommended standard Sri Lankan tour lengths or enter a custom duration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => setTripInputs({ ...tripInputs, duration: opt.days })}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                    tripInputs.duration === opt.days
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-400/20'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-2xl text-slate-900">
                      {opt.days} Days
                    </span>
                    {tripInputs.duration === opt.days && (
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 sm:text-sm">{opt.label.split('(')[1]?.replace(')', '') || 'Custom circuit'}</p>
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700 sm:text-sm">Or custom days (1-30):</label>
              <input
                type="number"
                min="1"
                max="30"
                value={tripInputs.duration}
                onChange={(e) =>
                  setTripInputs({
                    ...tripInputs,
                    duration: Math.max(1, Math.min(30, parseInt(e.target.value) || 1)),
                  })
                }
                className="w-24 px-3 py-2 rounded-xl border border-emerald-500 text-xs font-bold text-center focus:ring-2 focus:ring-emerald-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* STEP 2: STARTING LOCATION */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-slate-900 flex items-center gap-2 text-2xl sm:text-3xl">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Step 2: Where will your journey begin?
              </h2>
              <p className="text-xs text-slate-500 mt-1 sm:text-sm">
                The route optimizer will compute Haversine transit distances starting from this origin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {STARTING_LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() =>
                    setTripInputs({
                      ...tripInputs,
                      startingLocation: {
                        name: loc.name,
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                      },
                    })
                  }
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                    tripInputs.startingLocation?.name === loc.name
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-400/20'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{loc.name}</h3>
                    {tripInputs.startingLocation?.name === loc.name && (
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 sm:text-sm">{loc.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: BUDGET */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-slate-900 flex items-center gap-2 text-2xl sm:text-3xl">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Step 3: What is your preferred budget tier?
              </h2>
              <p className="text-xs text-slate-500 mt-1 sm:text-sm">
                Helps match accommodations, dining, and daily activity costs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BUDGET_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setTripInputs({ ...tripInputs, budgetTier: tier.id })}
                  className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    tripInputs.budgetTier === tier.id
                      ? `${tier.color} shadow-sm ring-2 ring-emerald-400/20 border-2`
                      : 'border-slate-200 hover:border-emerald-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">{tier.title}</h3>
                      {tripInputs.budgetTier === tier.id && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-emerald-700 block mb-2 sm:text-sm">{tier.costRange}</span>
                    <p className="text-xs text-slate-600 leading-relaxed sm:text-sm">{tier.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 block mb-1 sm:text-sm">
                Optional: Enter exact total trip budget in LKR (Leave blank for automatic calculation)
              </label>
              <input
                type="number"
                placeholder="e.g. 150000"
                value={tripInputs.customBudget || ''}
                onChange={(e) => setTripInputs({ ...tripInputs, customBudget: e.target.value })}
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-emerald-500 text-xs focus:ring-2 focus:ring-emerald-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* STEP 4: GROUP TYPE */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-slate-900 flex items-center gap-2 text-2xl sm:text-3xl">
                <Users className="w-5 h-5 text-emerald-600" />
                Step 4: Who are you traveling with?
              </h2>
              <p className="text-xs text-slate-500 mt-1 sm:text-sm">
                Influences pace, vehicle sizing, and room allocations.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {TRAVEL_GROUPS.map((grp) => (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => setTripInputs({ ...tripInputs, travelType: grp.id })}
                  className={`p-4 rounded-2xl border text-center transition-all duration-200 ${
                    tripInputs.travelType === grp.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm ring-2 ring-emerald-400/20'
                      : 'border-slate-200 hover:border-emerald-300 bg-white'
                  }`}
                >
                  <h3 className="font-bold text-slate-800 mb-1 text-sm sm:text-base">{grp.label}</h3>
                  <span className="text-xs text-slate-400 sm:text-sm">Customized pace</span>
                </button>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <label className="text-xs font-bold text-slate-700 sm:text-sm">Number of travelers:</label>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setTripInputs({
                      ...tripInputs,
                      travelersCount: Math.max(1, (tripInputs.travelersCount || 1) - 1),
                    })
                  }
                  className="px-3 py-1.5 hover:bg-slate-100 font-bold text-slate-600"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-slate-800 sm:text-sm">
                  {tripInputs.travelersCount || 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setTripInputs({
                      ...tripInputs,
                      travelersCount: (tripInputs.travelersCount || 1) + 1,
                    })
                  }
                  className="px-3 py-1.5 hover:bg-slate-100 font-bold text-slate-600"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: INTERESTS (Multi-Select) */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-slate-900 flex items-center gap-2 text-2xl sm:text-3xl">
                <Heart className="w-5 h-5 text-emerald-600" />
                Step 5: What experiences excite you?
              </h2>
              <p className="text-xs text-slate-500 mt-1 sm:text-sm">
                Select multiple interests. This carries a 30% weight in the destination recommendation score.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {INTEREST_OPTIONS.map((item) => {
                const selected = tripInputs.interests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleInterestToggle(item.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
                      selected
                        ? 'border-emerald-500 bg-emerald-600 text-white shadow-sm'
                        : 'border-slate-200 hover:border-emerald-300 bg-white text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold sm:text-sm">{item.label}</span>
                    {selected && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 sm:text-sm">
              Selected: {tripInputs.interests.join(', ') || 'None'}
            </p>
          </div>
        )}

        {/* STEP 6: TRANSPORTATION */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-slate-900 flex items-center gap-2 text-2xl sm:text-3xl">
                <Car className="w-5 h-5 text-emerald-600" />
                Step 6: Preferred mode of transport?
              </h2>
              <p className="text-xs text-slate-500 mt-1 sm:text-sm">
                Calculates daily travel speeds and accurate transit budget rates across Sri Lankan routes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {TRANSPORT_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTripInputs({ ...tripInputs, transportation: t.id })}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                    tripInputs.transportation === t.id
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm ring-2 ring-emerald-400/20'
                      : 'border-slate-200 hover:border-emerald-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t.label}</h3>
                    {tripInputs.transportation === t.id && (
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 sm:text-sm">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: REVIEW & GENERATE */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-slate-900 flex items-center gap-2 text-2xl sm:text-3xl">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Step 7: Ready to generate your itinerary!
              </h2>
              <p className="text-xs text-slate-500 mt-1 sm:text-sm">
                Review your parameters before running the MCDA recommendation & route optimization engine.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 uppercase font-bold text-xs block">Duration</span>
                <strong className="text-slate-800 text-sm sm:text-base">{tripInputs.duration} Days</strong>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-xs block">Departure Location</span>
                <strong className="text-slate-800 text-sm sm:text-base">{tripInputs.startingLocation?.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-xs block">Budget Preference</span>
                <strong className="text-slate-800 text-sm sm:text-base">{tripInputs.budgetTier} Tier</strong>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-xs block">Travel Group</span>
                <strong className="text-slate-800 text-sm sm:text-base">
                  {tripInputs.travelType} ({tripInputs.travelersCount} Person)
                </strong>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-xs block">Transportation</span>
                <strong className="text-slate-800 text-sm sm:text-base">{tripInputs.transportation}</strong>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-xs block">Interests ({tripInputs.interests.length})</span>
                <strong className="text-slate-800 text-sm sm:text-base">{tripInputs.interests.join(', ')}</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3 sm:text-sm">
              <Cpu className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                Our recommendation engine uses <strong>Multi-Criteria Decision Analysis (MCDA)</strong> and <strong>TSP nearest-neighbor route ordering</strong> to maximize your experience while minimizing wasted transit time.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Controls Navigation */}
        <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1 || loading}
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-30 sm:text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition sm:text-sm"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleGenerate}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 sm:text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Generate My Trip
            </button>
          )}
        </div>
      </div>

      {/* Generating Modal Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-slate-100/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-5 shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-ocean-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 animate-pulse">
              <Compass className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-extrabold text-slate-900 text-sm sm:text-base">
                Generating Your Itinerary
              </h3>
              <p className="text-xs text-emerald-700 font-semibold min-h-[2.5rem] flex items-center justify-center sm:text-sm">
                {loadingStepText}
              </p>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full animate-pulse w-full" />
            </div>

            <p className="text-xs text-slate-400 sm:text-sm">
              Applying Multi-Criteria Decision Analysis & TSP route heuristics...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
