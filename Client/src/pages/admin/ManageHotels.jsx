import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Hotel, Plus, Trash2, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ManageHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('Sigiriya');
  const [tier, setTier] = useState('Moderate');
  const [pricePerNight, setPricePerNight] = useState(22000);
  const { addToast } = useToast();

  const fetchHotels = async () => {
    try {
      const res = await adminService.getHotels();
      setHotels(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminService.createHotel({
        name,
        destination,
        tier,
        pricePerNight: Number(pricePerNight),
      });
      addToast('Hotel added successfully', 'success');
      setName('');
      fetchHotels();
    } catch (err) {
      addToast(err.message || 'Error adding hotel', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel record?')) return;
    try {
      await adminService.deleteHotel(id);
      addToast('Hotel removed', 'success');
      setHotels(hotels.filter((h) => h._id !== id));
    } catch (err) {
      addToast('Error removing hotel', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          Manage Hotel Accommodations
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Curate budget, moderate, and luxury hotels associated with destinations.
        </p>
      </div>

      <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700 block">Hotel Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jetwing Lighthouse"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 block">Nightly Rate (LKR)</label>
          <input
            type="number"
            min="0"
            required
            value={pricePerNight}
            onChange={(e) => setPricePerNight(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Hotel
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b">
            <tr>
              <th className="px-6 py-3.5">Hotel</th>
              <th className="px-6 py-3.5">Destination</th>
              <th className="px-6 py-3.5">Tier</th>
              <th className="px-6 py-3.5">Rate / Night</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {hotels.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-400">
                  No hotels recorded.
                </td>
              </tr>
            ) : (
              hotels.map((h) => (
                <tr key={h._id} className="hover:bg-slate-50">
                  <td className="px-6 py-3.5 font-bold text-slate-800">{h.name}</td>
                  <td className="px-6 py-3.5 text-slate-600">{h.destination}</td>
                  <td className="px-6 py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                      {h.tier}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-bold text-emerald-700">
                    {formatCurrency(h.pricePerNight)}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(h._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
