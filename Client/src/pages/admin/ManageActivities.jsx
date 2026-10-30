import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Activity, Plus, Trash2, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ManageActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Adventure');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(2500);
  const { addToast } = useToast();

  const fetchActivities = async () => {
    try {
      const res = await adminService.getActivities();
      setActivities(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminService.createActivity({ name, category, description, cost: Number(cost) });
      addToast('Activity created successfully', 'success');
      setName('');
      setDescription('');
      fetchActivities();
    } catch (err) {
      addToast(err.message || 'Error creating activity', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await adminService.deleteActivity(id);
      addToast('Activity removed', 'success');
      setActivities(activities.filter((a) => a._id !== id));
    } catch (err) {
      addToast('Error removing activity', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          Manage Activities Catalog
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Curate tourism activities, estimated ticket costs, and durations.
        </p>
      </div>

      <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700 block">Activity Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Scuba Diving at Pigeon Island"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 block">Cost (LKR)</label>
          <input
            type="number"
            min="0"
            required
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b">
            <tr>
              <th className="px-6 py-3.5">Activity</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Cost</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activities.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-slate-400">
                  No independent activities logged.
                </td>
              </tr>
            ) : (
              activities.map((act) => (
                <tr key={act._id} className="hover:bg-slate-50">
                  <td className="px-6 py-3.5 font-bold text-slate-800">{act.name}</td>
                  <td className="px-6 py-3.5 text-slate-500">{act.category}</td>
                  <td className="px-6 py-3.5 font-bold text-emerald-700">{formatCurrency(act.cost)}</td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(act._id)}
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
