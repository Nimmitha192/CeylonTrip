import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import {
  Users,
  MapPin,
  Luggage,
  MessageSquare,
  Star,
  Award,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const PIE_COLORS = ['#059669', '#0284c7', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching admin statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading system analytics...</p>
      </div>
    );
  }

  const summary = stats?.summary || {};
  const charts = stats?.charts || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
            System Administration
          </span>
          <h1 className="font-display font-extrabold text-3xl text-slate-900">
            Analytics & Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Overview of users, destinations, algorithmic trips, and traveler reviews.
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

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Users</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display font-extrabold text-2xl text-slate-900 block">
            {summary.totalUsers || 0}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Active accounts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Destinations</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display font-extrabold text-2xl text-slate-900 block">
            {summary.totalDestinations || 0}
          </span>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Indexed attractions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Trips Created</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Luggage className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display font-extrabold text-2xl text-slate-900 block">
            {summary.totalTrips || 0}
          </span>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Optimized itineraries</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Avg Platform Rating</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display font-extrabold text-2xl text-slate-900 block">
            {summary.overallAvgRating || 4.8} ★
          </span>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 block">
            {summary.totalReviews || 0} total reviews
          </span>
        </div>
      </div>

      {/* Featured Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Most Popular Destination
            </span>
            <h3 className="font-display font-extrabold text-xl text-slate-900 mt-1">
              {summary.mostPopularDestination?.name || 'Sigiriya'}
            </h3>
            <span className="text-xs font-semibold text-emerald-700 block mt-1">
              Score: {summary.mostPopularDestination?.popularityScore || 98} / 100
            </span>
          </div>
          {summary.mostPopularDestination?.images?.[0] && (
            <img
              src={summary.mostPopularDestination.images[0]}
              alt="Popular destination"
              className="w-20 h-20 rounded-2xl object-cover border"
            />
          )}
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Most Reviewed Destination
            </span>
            <h3 className="font-display font-extrabold text-xl text-slate-900 mt-1">
              {summary.mostReviewedDestination?.name || 'Yala'}
            </h3>
            <span className="text-xs font-semibold text-blue-700 block mt-1">
              {summary.mostReviewedDestination?.reviewCount || 380} verified reviews
            </span>
          </div>
          {summary.mostReviewedDestination?.images?.[0] && (
            <img
              src={summary.mostReviewedDestination.images[0]}
              alt="Reviewed destination"
              className="w-20 h-20 rounded-2xl object-cover border"
            />
          )}
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly User & Trip Trends Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Monthly User Growth & Trips Formulated
              </h3>
              <p className="text-xs text-slate-500">Platform utilization over the past 6 months</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthlyTrends || []}>
                <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="users" name="New Users" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="trips" name="Generated Trips" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Doughnut */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Category Distribution
              </h3>
              <p className="text-xs text-slate-500">Destinations across landscape types</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.categoryDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="category"
                >
                  {(charts.categoryDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
