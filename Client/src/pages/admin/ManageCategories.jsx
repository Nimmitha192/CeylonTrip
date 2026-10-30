import React, { useEffect, useState } from 'react';
import { destinationService } from '../../services/destinationService';
import { adminService } from '../../services/adminService';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { FolderTree, Plus, Trash2 } from 'lucide-react';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const { addToast } = useToast();

  const fetchCategories = async () => {
    try {
      const res = await destinationService.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      addToast('Error loading categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name: newCatName, description: newCatDesc });
      addToast('Category created', 'success');
      setNewCatName('');
      setNewCatDesc('');
      fetchCategories();
    } catch (err) {
      addToast(err.message || 'Error creating category', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      addToast('Category deleted', 'success');
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      addToast('Error deleting category', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          Manage Tourism Categories
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Organize destinations by geographic and experiential themes.
        </p>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 space-y-1 w-full">
          <label className="text-xs font-semibold text-slate-700 block">Category Name</label>
          <input
            type="text"
            required
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="e.g. Scuba & Marine Life"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex-1 space-y-1 w-full">
          <label className="text-xs font-semibold text-slate-700 block">Description</label>
          <input
            type="text"
            required
            value={newCatDesc}
            onChange={(e) => setNewCatDesc(e.target.value)}
            placeholder="Brief overview of the category..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shrink-0 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </form>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-xs text-slate-400">Loading categories...</p>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{cat.name}</h3>
                  <button
                    onClick={() => handleDelete(cat._id, cat.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.description}</p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg self-start">
                {cat.destinationCount || 0} Places
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
