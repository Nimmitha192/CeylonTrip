import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  MapPin,
  ArrowRight,
  Palmtree,
  Mountain,
  Landmark,
  PawPrint,
} from 'lucide-react';
import { destinationService } from '../services/destinationService';
import DestinationCard from './DestinationCard';
import RatingStars from './RatingStars';
import { DestinationSkeleton } from './SkeletonLoader';

export function HomeDiscovery() {
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destinationError, setDestinationError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);


  useEffect(() => {
    let active = true;
    const fetchData = async () => {
        const [destRes, catRes] = await Promise.allSettled([
          destinationService.getDestinations({ limit: 6, sortBy: 'popularity_desc' }),
          destinationService.getCategories(),
        ]);
        if (!active) return;
        if (destRes.status === 'fulfilled' && Array.isArray(destRes.value.data)) {
          setPopularDestinations(destRes.value.data);
        } else {
          setDestinationError(true);
        }
        if (catRes.status === 'fulfilled' && Array.isArray(catRes.value.data)) {
          setCategories(catRes.value.data);
        } else {
          setCategoryError(true);
        }
        setLoading(false);
    };
    fetchData();
    return () => { active = false; };
  }, []);

  const categoryIcons = {
    'Cultural Heritage': Landmark,
    'Beaches & Coastal': Palmtree,
    'Hill Country & Tea': Mountain,
    'Wildlife & Safari': PawPrint,
    'Nature & Adventure': Compass,
    'Urban & Modern': MapPin,
  };

  return (<div className="space-y-20">
      {/* 2. Popular Destinations Section */}
      <section className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 mb-10 md:flex-row md:items-end">
          <div>
            <span className="block mb-1 text-xs font-bold tracking-wider uppercase text-emerald-700">
              Handpicked Gems
            </span>
            <h2 className="font-extrabold font-display text-slate-900 text-2xl sm:text-3xl">
              Popular Destinations
            </h2>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Top-rated highlights chosen by thousands of travelers across Sri Lanka.
            </p>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition sm:text-base"
          >
            View All Destinations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <DestinationSkeleton key={i} />
            ))}
          </div>
        ) : popularDestinations.length === 0 ? (
          <p role="status" className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 sm:text-base">
            {destinationError ? 'Unable to load destinations right now. Please try again later.' : 'New destinations are coming soon.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularDestinations.map((destination) => (
              <DestinationCard key={destination._id} destination={destination} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Explore by Category */}
      <section className="py-16 bg-slate-100/70">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <span className="block mb-1 text-xs font-bold tracking-wider uppercase text-emerald-700">
              Diverse Landscapes
            </span>
            <h2 className="font-extrabold font-display text-slate-900 text-2xl sm:text-3xl">
              Explore by Category
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              From golden coasts and misty tea gardens to historic UNESCO heritage shrines.
            </p>
          </div>

          {loading && <p role="status" className="text-center text-sm text-slate-500 sm:text-base">Loading categories...</p>}
          {!loading && categories.length === 0 && (
            <p role="status" className="text-center text-sm text-slate-600 sm:text-base">
              {categoryError ? 'Unable to load categories right now. Please try again later.' : 'New categories are coming soon.'}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.name] || Compass;
              return (
                <Link
                  key={cat._id || cat.name}
                  to={`/destinations?category=${encodeURIComponent(cat.name)}`}
                  className="flex flex-col items-center p-5 text-center transition-all duration-300 bg-white border group rounded-2xl border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 mb-3 transition duration-300 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-slate-900">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold transition text-slate-800 group-hover:text-emerald-700 text-sm sm:text-base">
                    {cat.name}
                  </h3>
                  <span className="mt-1 text-xs text-slate-400 sm:text-sm">
                    {cat.destinationCount != null ? `${cat.destinationCount} Places` : 'Explore Places'}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

</div>);
}

export function HomeExtras() {
 return (<div className="space-y-20 pb-20">
      {/* 6. User Reviews & Testimonials */}
      <section className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <span className="block mb-1 text-xs font-bold tracking-wider uppercase text-emerald-700">
            Traveler Voices
          </span>
          <h2 className="font-extrabold font-display text-slate-900 text-2xl sm:text-3xl">
            What Travelers Say
          </h2>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Real feedback from tourists exploring Sri Lanka using CeylonTrips.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col justify-between p-6 space-y-4 bg-white border rounded-2xl border-slate-200 shadow-sm">
            <div className="space-y-3">
              <RatingStars rating={5} />
              <p className="text-xs italic leading-relaxed text-slate-600 sm:text-sm">
                “Climbing Sigiriya and taking the train to Ella was completely seamless thanks to CeylonTrips. The budget estimator was spot on with actual costs in Sri Lankan Rupees!”
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Elena"
                className="object-cover w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">Elena Rostova</h4>
                <p className="text-xs text-slate-400 sm:text-sm">Solo Explorer from Germany</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 space-y-4 bg-white border rounded-2xl border-slate-200 shadow-sm">
            <div className="space-y-3">
              <RatingStars rating={5} />
              <p className="text-xs italic leading-relaxed text-slate-600 sm:text-sm">
                “The route optimizer saved us at least 10 hours of driving! Instead of zigzagging across the island, our 7-day trip flowed naturally from Colombo to Kandy, Nuwara Eliya, Yala, and Mirissa.”
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="David"
                className="object-cover w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">David & Sarah</h4>
                <p className="text-xs text-slate-400 sm:text-sm">Couples Trip from Australia</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 space-y-4 bg-white border rounded-2xl border-slate-200 shadow-sm">
            <div className="space-y-3">
              <RatingStars rating={5} />
              <p className="text-xs italic leading-relaxed text-slate-600 sm:text-sm">
                “The interactive Leaflet map combined with the morning/afternoon activity breakdown makes this the best travel planner for Sri Lanka I have ever used.”
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="Kasun"
                className="object-cover w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">Kasun Jayawardena</h4>
                <p className="text-xs text-slate-400 sm:text-sm">Local Tourist from Colombo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-center justify-between gap-8 p-10 overflow-hidden text-slate-900 shadow-2xl rounded-3xl bg-emerald-50 border border-emerald-200 sm:p-14 sm:flex-row">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">
              Start Your Journey
            </span>
            <h2 className="font-extrabold text-slate-900 font-display text-2xl sm:text-3xl">
              Ready to Explore Sri Lanka?
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Create your customized itinerary with budget estimates, day-by-day activities, and interactive GPS navigation in seconds.
            </p>
          </div>

          <div className="relative z-10">
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-extrabold transition duration-200 bg-white shadow-lg rounded-xl text-emerald-900 hover:bg-slate-100 hover:shadow-xl hover:scale-105 shrink-0"
            >
              <Sparkles className="w-5 h-5 text-emerald-700" />
              Plan My Trip Now
            </Link>
          </div>
        </div>
      </section>
</div>);
}
