import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import RatingStars from '../../components/RatingStars';

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchReviews = async () => {
    try {
      const res = await adminService.getReviews();
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await adminService.updateReviewStatus(id, status);
      addToast(`Review marked as ${status}`, 'success');
      setReviews(reviews.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      addToast('Error updating status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          Review Moderation
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Moderate community reviews, ratings, and destination feedback.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b">
              <tr>
                <th className="px-6 py-3.5">Destination</th>
                <th className="px-6 py-3.5">Reviewer</th>
                <th className="px-6 py-3.5">Rating</th>
                <th className="px-6 py-3.5">Comment</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">
                    No reviews awaiting moderation.
                  </td>
                </tr>
              ) : (
                reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-slate-50">
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      {rev.destination?.name || 'Destination'}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {rev.user?.name || 'User'}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 max-w-xs truncate">
                      {rev.comment}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          rev.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rev.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStatusChange(rev._id, 'approved')}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                          title="Approve Review"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(rev._id, 'rejected')}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="Reject Review"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
