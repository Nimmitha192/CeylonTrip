import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { destinationService } from '../../services/destinationService';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import { PROVINCES, CATEGORIES } from '../../utils/constants';

export default function DestinationForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    province: 'Central',
    district: '',
    category: 'Cultural Heritage',
    latitude: 7.957,
    longitude: 80.7603,
    images: '',
    estimatedDailyCost: 20000,
    recommendedDuration: 1,
    difficulty: 'Easy',
    localEntranceFee: 0,
    foreignEntranceFee: 0,
    tags: '',
    openingTime: '07:00 AM',
    closingTime: '06:00 PM',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const loadDestination = async () => {
        try {
          const res = await destinationService.getDestination(id);
          const d = res.data;
          setFormData({
            name: d.name || '',
            description: d.description || '',
            shortDescription: d.shortDescription || '',
            province: d.province || 'Central',
            district: d.district || '',
            category: d.category || 'Cultural Heritage',
            latitude: d.location?.latitude || 7.0,
            longitude: d.location?.longitude || 80.0,
            images: d.images ? d.images.join('\n') : '',
            estimatedDailyCost: d.estimatedDailyCost || 20000,
            recommendedDuration: d.recommendedDuration || 1,
            difficulty: d.difficulty || 'Easy',
            localEntranceFee: d.entranceFee?.local || 0,
            foreignEntranceFee: d.entranceFee?.foreign || 0,
            tags: d.tags ? d.tags.join(', ') : '',
            openingTime: d.openingTime || '07:00 AM',
            closingTime: d.closingTime || '06:00 PM',
          });
        } catch (err) {
          addToast('Failed to load destination data', 'error');
        }
      };
      loadDestination();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        province: formData.province,
        district: formData.district,
        category: formData.category,
        location: {
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        },
        images: formData.images
          .split('\n')
          .map((url) => url.trim())
          .filter(Boolean),
        estimatedDailyCost: Number(formData.estimatedDailyCost),
        recommendedDuration: Number(formData.recommendedDuration),
        difficulty: formData.difficulty,
        entranceFee: {
          local: Number(formData.localEntranceFee),
          foreign: Number(formData.foreignEntranceFee),
        },
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
      };

      if (isEdit) {
        await destinationService.updateDestination(id, payload);
        addToast('Destination updated successfully!', 'success');
      } else {
        await destinationService.createDestination(payload);
        addToast('Destination created successfully!', 'success');
      }
      navigate('/admin/destinations');
    } catch (err) {
      addToast(err.message || 'Error saving destination', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <Link
            to="/admin/destinations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inventory
          </Link>
          <h1 className="font-display font-extrabold text-2xl text-slate-900">
            {isEdit ? `Edit Destination: ${formData.name}` : 'Add New Sri Lankan Destination'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
        {/* Core fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Destination Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ella"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Province</label>
            <select
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p} Province
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">District</label>
            <input
              type="text"
              required
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              placeholder="e.g. Badulla"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* GPS Coordinates */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Latitude (°N)</label>
            <input
              type="number"
              step="any"
              required
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Longitude (°E)</label>
            <input
              type="number"
              step="any"
              required
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Short Description</label>
            <input
              type="text"
              required
              maxLength="250"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="1-2 sentences summarizing the destination..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Full Description</label>
            <textarea
              rows="4"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Comprehensive travel overview, history, and sights..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Image URLs (One URL per line)</label>
            <textarea
              rows="3"
              required
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Costs & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Est. Daily Spend (LKR)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.estimatedDailyCost}
              onChange={(e) => setFormData({ ...formData, estimatedDailyCost: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Recommended Duration (Days)</label>
            <input
              type="number"
              required
              min="1"
              max="7"
              value={formData.recommendedDuration}
              onChange={(e) => setFormData({ ...formData, recommendedDuration: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">Tags (Comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Culture, History, Hiking, Photography"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            to="/admin/destinations"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : isEdit ? 'Update Destination' : 'Create Destination'}
          </button>
        </div>
      </form>
    </div>
  );
}
