import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Heart, Compass, Edit3, Sparkles } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
            Account Management
          </span>
          <h1 className="font-display font-extrabold text-slate-900 text-3xl sm:text-4xl lg:text-5xl">
            User Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View your personal travel profile and travel preferences.
          </p>
        </div>

        <Link
          to="/profile/edit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition sm:text-sm"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* User Card */}
        <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft text-center space-y-4">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt={user?.name}
            className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-emerald-100 shadow-md"
          />
          <div>
            <h2 className="font-display font-bold text-slate-900 text-2xl sm:text-3xl">{user?.name}</h2>
            <p className="text-xs text-slate-500 sm:text-sm">{user?.email}</p>
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            Role: {user?.role}
          </span>
        </div>

        {/* Preferences Details */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="font-display font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
              <Compass className="w-5 h-5 text-emerald-600" />
              Default Travel Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-xs block">Traveler Group</span>
                <strong className="text-slate-800 text-sm sm:text-base">{user?.preferences?.travelType || 'Solo'}</strong>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-xs block">Budget Tier</span>
                <strong className="text-slate-800 text-sm sm:text-base">{user?.preferences?.budgetTier || 'Moderate'}</strong>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 block mb-2 sm:text-sm">Saved Interests</span>
              <div className="flex flex-wrap gap-2">
                {user?.preferences?.interests?.length > 0 ? (
                  user.preferences.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 sm:text-sm"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic sm:text-sm">No preferred interests configured yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
