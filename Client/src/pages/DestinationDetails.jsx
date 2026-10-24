import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Star,
  Compass,
  Calendar,
  Ticket,
  Car,
  Train,
  Bus,
  CheckCircle2,
  Share2,
  Sparkles,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';
import { destinationService } from '../services/destinationService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate, formatDuration } from '../utils/formatters';
import RatingStars from '../components/RatingStars';
import WeatherWidget from '../components/WeatherWidget';
import InteractiveMap from '../components/InteractiveMap';

export default function DestinationDetails() {
  const { idOrSlug } = useParams();
  const { user, isAuthenticated, isFavorite, toggleFavorite } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Review submission form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchDestinationData = async () => {
    try {
      const res = await destinationService.getDestination(idOrSlug);
      setDestination(res.data);

      if (res.data?._id) {
        const revRes = await reviewService.getDestinationReviews(res.data._id);
        setReviews(revRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching destination details:', err);
      addToast('Failed to load destination details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinationData();
    window.scrollTo(0, 0);
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500 sm:text-base">Loading Sri Lankan destination details...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <h2 className="font-bold text-slate-800 text-2xl sm:text-3xl">Destination Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 sm:text-base">The requested attraction could not be found or has been moved.</p>
        <Link to="/destinations" className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm sm:text-base">
          Browse All Destinations
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(destination._id);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      addToast('Please log in to save favorites', 'info');
      navigate('/login');
      return;
    }
    try {
      const nowFav = await toggleFavorite(destination._id);
      addToast(nowFav ? `Saved ${destination.name} to favorites` : `Removed from favorites`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Destination link copied to clipboard!', 'success');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please login to post a review', 'info');
      navigate('/login');
      return;
    }

    setIsSubmittingReview(true);
    try {
      await reviewService.createReview(destination._id, { rating, comment });
      addToast('Your review has been submitted successfully!', 'success');
      setComment('');
      setRating(5);
      fetchDestinationData(); // Refresh reviews and average rating
    } catch (err) {
      addToast(err.message || 'Error submitting review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/destinations"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Destinations
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
            onClick={handleFavoriteClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition shadow-sm ${
              favorited
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            {favorited ? 'Favorited' : 'Save Favorite'}
          </button>
        </div>
      </div>

      {/* Hero Gallery Section */}
      <div className="space-y-4">
        <div className="relative h-105 sm:h-125 rounded-3xl overflow-hidden shadow-card border border-slate-200">
          <img
            src={destination.images?.[activeImageIdx] || destination.images?.[0]}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Title Header Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-600 font-bold text-xs sm:text-sm">
                {destination.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md font-semibold text-xs flex items-center gap-1 sm:text-sm">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {destination.district}, {destination.province} Province
              </span>
            </div>
            <h1 className="font-display font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl">
              {destination.name}
            </h1>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {destination.images && destination.images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {destination.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                  activeImageIdx === idx ? 'border-emerald-500 ring-2 ring-emerald-400/30 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${destination.name} preview ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Details + Sidebar Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Overview, Activities, Map, Reviews */}
        <div className="lg:col-span-8 space-y-10">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-soft">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                Average Rating
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-extrabold text-slate-800 text-base">
                  {destination.averageRating?.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 sm:text-sm">({destination.reviewCount})</span>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                Est. Daily Cost
              </span>
              <span className="font-extrabold text-emerald-700 text-base mt-0.5 block">
                {formatCurrency(destination.estimatedDailyCost)}
              </span>
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                Duration
              </span>
              <span className="font-extrabold text-slate-800 text-base mt-0.5 block">
                {formatDuration(destination.recommendedDuration)}
              </span>
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                Difficulty
              </span>
              <span className="font-extrabold text-slate-800 text-base mt-0.5 block">
                {destination.difficulty}
              </span>
            </div>
          </div>

          {/* About / Description */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <h2 className="font-display font-bold text-slate-900 text-2xl sm:text-3xl">
              About {destination.name}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed sm:text-base">
              {destination.description}
            </p>

            {/* Tags */}
            {destination.tags && destination.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                {destination.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 sm:text-sm"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Activities */}
          {destination.activities && destination.activities.length > 0 && (
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-soft space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-slate-900 text-2xl sm:text-3xl">
                  Featured Activities & Highlights
                </h2>
                <span className="text-xs text-slate-400 sm:text-sm">
                  {destination.activities.length} curated experiences
                </span>
              </div>

              <div className="space-y-3">
                {destination.activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h3 className="font-bold text-slate-800 text-sm sm:text-base">{act.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 pl-6 leading-relaxed sm:text-sm">
                        {act.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pl-6 sm:pl-0 shrink-0 text-xs sm:text-sm">
                      {act.duration && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {act.duration}
                        </span>
                      )}
                      <span className="font-bold text-emerald-700">
                        {act.estimatedCost ? formatCurrency(act.estimatedCost) : 'Free'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Destination Map */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <h2 className="font-display font-bold text-slate-900 flex items-center gap-2 text-2xl sm:text-3xl">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Location & Geography
            </h2>
            <InteractiveMap destinations={[destination]} height="23.75rem" />
          </div>

          {/* Reviews & Ratings Section */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-soft space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display font-bold text-slate-900 text-2xl sm:text-3xl">
                  Traveler Reviews & Ratings
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 sm:text-sm">
                  Verified feedback from international and local visitors
                </p>
              </div>
              <div className="flex items-center gap-2">
                <RatingStars rating={destination.averageRating} size="w-5 h-5" />
                <span className="font-extrabold text-slate-800 text-lg">
                  {destination.averageRating?.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Submit Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Share Your Experience at {destination.name}
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block sm:text-sm">Your Rating</label>
                <RatingStars
                  rating={rating}
                  interactive={true}
                  size="w-6 h-6"
                  onChange={(val) => setRating(val)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block sm:text-sm">Your Review</label>
                <textarea
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What was the highlight? Any advice on best times to visit or entrance tips?"
                  required
                  className="w-full p-3 rounded-xl border border-emerald-500 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 sm:text-sm"
              >
                {isSubmittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>

            {/* Review List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6 sm:text-sm">
                  No reviews submitted yet for {destination.name}. Be the first to review!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={rev.user?.name}
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                        <div>
                          <span className="font-bold text-xs text-slate-800 block sm:text-sm">
                            {rev.user?.name || 'Verified Traveler'}
                          </span>
                          <span className="text-xs text-slate-400 sm:text-sm">
                            {formatDate(rev.createdAt)}
                          </span>
                        </div>
                      </div>
                      <RatingStars rating={rev.rating} size="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-10 sm:text-sm">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Practical Travel Details, Weather, Nearby */}
        <div className="lg:col-span-4 space-y-6">
          {/* Weather Widget */}
          <WeatherWidget weather={destination.weather} locationName={destination.name} />

          {/* Practical Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">
              Visitor Information
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Opening Hours</span>
                <span className="font-bold text-slate-800">
                  {destination.openingTime} - {destination.closingTime}
                </span>
              </div>

              <div className="flex items-start justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Local Ticket</span>
                <span className="font-bold text-slate-800">
                  {destination.entranceFee?.local ? formatCurrency(destination.entranceFee.local) : 'Free / Standard'}
                </span>
              </div>

              <div className="flex items-start justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Foreign Ticket</span>
                <span className="font-bold text-emerald-700">
                  {destination.entranceFee?.foreign ? formatCurrency(destination.entranceFee.foreign) : 'Free'}
                </span>
              </div>

              <div className="flex items-start justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Best Season</span>
                <span className="font-bold text-slate-800">
                  {destination.bestMonths?.slice(0, 3).join(', ')}...
                </span>
              </div>
            </div>

            {/* Transportation Details */}
            <div className="pt-2">
              <h4 className="font-bold text-slate-800 mb-2 text-sm sm:text-base">Getting There</h4>
              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 sm:text-sm">
                <div className="flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-emerald-600" />
                  <span>From Colombo: {destination.transportationInfo?.driveTimeFromColombo || '3-4 hours'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Train className="w-3.5 h-3.5 text-ocean-600" />
                  <span>
                    Train Access: {destination.transportationInfo?.trainAvailable ? 'Available (Recommended)' : 'Direct train not available'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bus className="w-3.5 h-3.5 text-amber-600" />
                  <span>Bus Routes: Available</span>
                </div>
              </div>
            </div>

            {/* Plan trip CTA */}
            <Link
              to="/planner"
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition sm:text-sm"
            >
              <Sparkles className="w-4 h-4" />
              Include In My Trip Plan
            </Link>
          </div>

          {/* Nearby Destinations */}
          {destination.nearbyDestinations && destination.nearbyDestinations.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3">
              <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">
                Nearby Attractions
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                {destination.nearbyDestinations.map((near, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="font-medium text-slate-700">{near.name}</span>
                    <span className="font-bold text-emerald-700">{near.distanceKm} km away</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
