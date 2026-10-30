import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, Sparkles } from 'lucide-react';
import { userService } from '../services/adminService';
import DestinationCard from '../components/DestinationCard';
import { DestinationSkeleton } from '../components/SkeletonLoader';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await userService.getFavorites();
      setFavorites(res.data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="px-4 py-10 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 pb-6 border-b sm:flex-row sm:items-center border-slate-100">
        <div>
          <span className="block mb-1 text-xs font-bold tracking-wider uppercase text-rose-600">
            Saved Attractions
          </span>
          <h1 className="font-extrabold font-display text-slate-900 text-3xl sm:text-4xl lg:text-5xl">
            My Favorite Destinations
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Places you loved and saved for your next Sri Lankan escape.
          </p>
        </div>

        <Link
          to="/planner"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition self-start sm:self-auto sm:text-sm"
        >
          <Sparkles className="w-4 h-4" />
          Plan Trip with Favorites
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <DestinationSkeleton key={i} />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="p-8 py-20 space-y-4 text-center bg-white border rounded-3xl border-slate-200">
          <Heart className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="font-bold font-display text-slate-800 text-sm sm:text-base">No Favorites Saved Yet</h3>
          <p className="max-w-sm mx-auto text-xs text-slate-500 sm:text-sm">
            Browse our directory of Sri Lankan destinations and click the heart icon on places you would love to visit.
          </p>
          <Link
            to="/destinations"
            className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md sm:text-sm"
          >
            Explore Destinations
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((dest) => (
            <DestinationCard key={dest._id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
}
