import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reviewService } from '../services/reviewService';
import { useToast } from '../context/ToastContext';
import { MessageSquare, Star, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import RatingStars from '../components/RatingStars';

export default function UserReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const { addToast } = useToast();

  const fetchReviews = async () => {
    try {
      const res = await reviewService.getUserReviews();
      setReviews(res.data || []);
    } catch (err) {
      addToast('Error loading reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewService.deleteReview(id);
      addToast('Review removed successfully', 'success');
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      addToast('Error deleting review', 'error');
    }
  };

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await reviewService.updateReview(editingId, {
        rating: editRating,
        comment: editComment,
      });
      addToast('Review updated successfully!', 'success');
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      addToast('Error updating review', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-100 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
          Traveler Feedback
        </span>
        <h1 className="font-display font-extrabold text-slate-900 text-3xl sm:text-4xl lg:text-5xl">
          My Destination Reviews
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review and manage feedback you have shared with the travel community.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base">No Reviews Written Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto sm:text-sm">
            Visited a Sri Lankan destination recently? Share your experiences, tips, and photos with other travelers!
          </p>
          <Link to="/destinations" className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm">
            Browse Destinations to Review
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4"
            >
              {editingId === rev._id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                    Editing Review for {rev.destination?.name}
                  </h4>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 sm:text-sm">Rating</label>
                    <RatingStars
                      rating={editRating}
                      interactive={true}
                      onChange={(val) => setEditRating(val)}
                    />
                  </div>
                  <textarea
                    rows="3"
                    required
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full p-3 rounded-xl border border-emerald-500 text-xs focus:ring-2 focus:ring-emerald-500 sm:text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/destinations/${rev.destination?.slug || rev.destination?._id}`}
                        className="font-display font-bold text-base text-slate-900 hover:text-emerald-700 transition"
                      >
                        {rev.destination?.name}
                      </Link>
                      <span className="text-xs text-slate-400 sm:text-sm">
                        {formatDate(rev.createdAt)}
                      </span>
                    </div>

                    <RatingStars rating={rev.rating} size="w-4 h-4" />
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl sm:text-sm">
                      {rev.comment}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    <button
                      onClick={() => startEdit(rev)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      title="Edit Review"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rev._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
