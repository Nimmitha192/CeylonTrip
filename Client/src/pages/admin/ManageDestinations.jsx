import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { destinationService } from '../../services/destinationService';
import { useToast } from '../../context/ToastContext';
import {
  MapPin,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  Star,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ManageDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await destinationService.getDestinations({
        search,
        limit: 50,
      });
      setDestinations(res.data || []);
    } catch (err) {
      addToast('Error fetching destinations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      await destinationService.deleteDestination(id);
      addToast(`Deleted ${name} successfully`, 'success');
      setDestinations(destinations.filter((d) => d._id !== id));
    } catch (err) {
      addToast(err.message || 'Failed to delete destination', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            Destination Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage Sri Lankan attractions, entrance fees, and geographic coordinates.
          </p>
        </div>

        <Link
          to="/admin/destinations/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Add Destination
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by destination name, province, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Destination</th>
                <th className="px-6 py-3.5">Province</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Daily Spend</th>
                <th className="px-6 py-3.5">Rating / Reviews</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">
                    Loading destinations...
                  </td>
                </tr>
              ) : destinations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">
                    No destinations found matching "{search}".
                  </td>
                </tr>
              ) : (
                destinations.map((dest) => (
                  <tr key={dest._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={dest.images?.[0] || 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=100&q=80'}
                          alt={dest.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <strong className="font-bold text-slate-900 block text-xs">
                            {dest.name}
                          </strong>
                          <span className="text-[10px] text-slate-400">
                            {dest.location?.latitude.toFixed(3)}, {dest.location?.longitude.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-700">
                      {dest.province}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {dest.category}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-bold text-slate-800">
                      {formatCurrency(dest.estimatedDailyCost)}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{dest.averageRating?.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({dest.reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/destinations/${dest.slug || dest._id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/destinations/${dest._id}/edit`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(dest._id, dest.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
