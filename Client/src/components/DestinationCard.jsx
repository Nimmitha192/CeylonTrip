import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Clock, DollarSign, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDuration } from '../utils/formatters';
import RatingStars from './RatingStars';

export default function DestinationCard({ destination }) {
  const { isAuthenticated, isFavorite, toggleFavorite } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const favorited = isFavorite(destination._id);

  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      addToast('Please login to save favorite destinations', 'info');
      navigate('/login');
      return;
    }

    try {
      const nowFav = await toggleFavorite(destination._id);
      addToast(
        nowFav ? `Saved ${destination.name} to favorites` : `Removed ${destination.name} from favorites`,
        'success'
      );
    } catch (err) {
      addToast(err.message || 'Error updating favorites', 'error');
    }
  };

  const imageSrc =
    destination.images && destination.images.length > 0
      ? destination.images[0]
      : 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card hover:border-emerald-300 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Thumbnail */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

        {/* Favorite button */}
        <button
          onClick={handleHeartClick}
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-slate-700 hover:text-rose-600 transition shadow-sm"
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 ${
              favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Province Pill */}
        <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-800 tracking-wide uppercase flex items-center gap-1 shadow-sm">
          <MapPin className="w-3 h-3 text-emerald-600" />
          {destination.province}
        </div>

        {/* Category Badge & Duration */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs sm:text-sm">
          <span className="font-semibold bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg">
            {destination.category}
          </span>
          <span className="flex items-center gap-1 font-medium bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <Clock className="w-3 h-3 text-amber-400" />
            {formatDuration(destination.recommendedDuration)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <RatingStars rating={destination.averageRating} size="w-3.5 h-3.5" />
              <span className="text-xs font-bold text-slate-800 sm:text-sm">
                {destination.averageRating?.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 sm:text-sm">
                ({destination.reviewCount || 0})
              </span>
            </div>
            {destination.popularityScore >= 90 && (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 sm:text-sm">
                ★ Top Rated
              </span>
            )}
          </div>

          {/* Title */}
          <Link
            to={`/destinations/${destination.slug || destination._id}`}
            className="block"
          >
            <h3 className="font-display font-bold text-slate-900 group-hover:text-emerald-700 transition text-sm sm:text-base">
              {destination.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed sm:text-sm">
            {destination.shortDescription}
          </p>

          {/* Tags */}
          {destination.tags && destination.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {destination.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md sm:text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer info: cost & CTA */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="block text-xs uppercase font-bold tracking-wider text-slate-400">
              Est. Daily Cost
            </span>
            <span className="text-sm font-bold text-emerald-700 sm:text-base">
              {formatCurrency(destination.estimatedDailyCost)}
            </span>
          </div>

          <Link
            to={`/destinations/${destination.slug || destination._id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 group-hover:text-emerald-700 transition sm:text-sm"
          >
            Explore
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
