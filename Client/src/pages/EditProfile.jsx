import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Image, Save, ArrowLeft, Heart, Lock } from 'lucide-react';
import { TRAVEL_GROUPS, BUDGET_TIERS, INTEREST_OPTIONS } from '../utils/constants';

export default function EditProfile() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [travelType, setTravelType] = useState(user?.preferences?.travelType || 'Solo');
  const [budgetTier, setBudgetTier] = useState(user?.preferences?.budgetTier || 'Moderate');
  const [interests, setInterests] = useState(user?.preferences?.interests || []);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInterestToggle = (id) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name,
        profileImage,
        preferences: {
          travelType,
          budgetTier,
          interests,
        },
      };
      if (password.trim().length >= 6) {
        updateData.password = password;
      }

      await updateProfile(updateData);
      addToast('Profile updated successfully!', 'success');
      navigate('/profile');
    } catch (err) {
      addToast(err.message || 'Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition mb-1 sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
          <h1 className="font-display font-extrabold text-slate-900 text-3xl sm:text-4xl lg:text-5xl">
            Edit Profile & Preferences
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-slate-900 border-b pb-2 text-sm sm:text-base">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block sm:text-sm">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-500 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block sm:text-sm">Profile Image URL</label>
              <input
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-500 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block sm:text-sm">
              Change Password (Leave blank to keep current)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-500 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:text-sm"
            />
          </div>
        </div>

        {/* Travel Preferences */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-display font-bold text-slate-900 border-b pb-2 text-sm sm:text-base">
            Travel Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block sm:text-sm">Default Travel Group</label>
              <select
                value={travelType}
                onChange={(e) => setTravelType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-emerald-500 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 sm:text-sm"
              >
                {TRAVEL_GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block sm:text-sm">Default Budget Tier</label>
              <select
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-emerald-500 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 sm:text-sm"
              >
                {BUDGET_TIERS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-700 block sm:text-sm">Your Favorite Travel Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((item) => {
                const selected = interests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleInterestToggle(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            to="/profile"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition sm:text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50 sm:text-sm"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
