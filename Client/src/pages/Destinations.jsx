import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Compass,
  DollarSign,
  Star,
  Calendar,
  X,
  Map as MapIcon,
  Grid,
  RotateCcw,
} from 'lucide-react';
import { destinationService } from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';
import InteractiveMap from '../components/InteractiveMap';
import { DestinationSkeleton } from '../components/SkeletonLoader';
import { PROVINCES, CATEGORIES } from '../utils/constants';

const MONTHS = [
  'All',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 12 });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  // Filters state initialized from URL query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [province, setProvince] = useState(searchParams.get('province') || 'All');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [maxCost, setMaxCost] = useState(searchParams.get('maxCost') || '');
  const [bestMonth, setBestMonth] = useState(searchParams.get('bestMonth') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'popularity_desc');

  const fetchDestinations = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        sortBy,
      };
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (province !== 'All') params.province = province;
      if (minRating) params.minRating = minRating;
      if (maxCost) params.maxCost = maxCost;
      if (bestMonth !== 'All') params.bestMonth = bestMonth;

      const res = await destinationService.getDestinations(params);
      setDestinations(res.data || []);
      setPagination(res.pagination || { total: 0, page: 1, pages: 1 });
    } catch (err) {
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations(1);
  }, [category, province, minRating, maxCost, bestMonth, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDestinations(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setProvince('All');
    setMinRating('');
    setMaxCost('');
    setBestMonth('All');
    setSortBy('popularity_desc');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
            Sri Lanka Tourism Directory
          </span>
          <h1 className="font-display font-extrabold text-slate-900 text-3xl sm:text-4xl lg:text-5xl">
            Explore Destinations
          </h1>
          <p className="text-sm text-slate-500 mt-1 sm:text-base">
            Discover iconic attractions, hidden nature reserves, and coastal paradises across all 9 provinces.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              viewMode === 'grid'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-4 h-4" />
            Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              viewMode === 'map'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Interactive Map
          </button>
        </div>
      </div>

      {/* Search Bar & Sorting */}
      <div className="flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by destination name, tags (e.g., beaches, tea, hiking)..."
            className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-white border border-emerald-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-soft sm:text-base"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition sm:text-sm"
          >
            Search
          </button>
        </form>

        {/* Sort selector */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort destinations"
          className="px-4 py-3.5 rounded-2xl bg-white border border-emerald-500 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-soft sm:text-sm"
        >
          <option value="popularity_desc">Sort: Most Popular</option>
          <option value="rating_desc">Sort: Highest Rated</option>
          <option value="cost_asc">Sort: Lowest Daily Cost</option>
          <option value="cost_desc">Sort: Highest Daily Cost</option>
          <option value="name_asc">Sort: Name (A-Z)</option>
        </select>
      </div>

      {/* Filters below search, followed by full-width results */}
      <div className="space-y-8">
        <section
          aria-labelledby="destination-filters-heading"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft"
        >
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-5 flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 id="destination-filters-heading" className="font-display font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
              <Filter className="w-4 h-4 text-emerald-600" />
              Filter Results
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 sm:text-sm"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block sm:text-sm">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-emerald-500 text-xs text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Province Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block sm:text-sm">Province</label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-emerald-500 text-xs text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:text-sm"
            >
              <option value="All">All 9 Provinces</option>
              {PROVINCES.map((prov) => (
                <option key={prov} value={prov}>
                  {prov} Province
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block sm:text-sm">Minimum Rating</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['', '4.0', '4.5', '4.8'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setMinRating(r)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                    minRating === r
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r ? `${r}+★` : 'Any'}
                </button>
              ))}
            </div>
          </div>

          {/* Best Month to Visit */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block sm:text-sm">Best Season</label>
            <select
              value={bestMonth}
              onChange={(e) => setBestMonth(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-emerald-500 text-xs text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:text-sm"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'Any Month' : m}
                </option>
              ))}
            </select>
          </div>

          {/* Max Cost Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 sm:text-sm">
              <span>Max Daily Cost</span>
              <span className="text-emerald-700">
                {maxCost ? `LKR ${Number(maxCost).toLocaleString()}` : 'No Limit'}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="50000"
              step="5000"
              value={maxCost || 50000}
              onChange={(e) => setMaxCost(e.target.value === '50000' ? '' : e.target.value)}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </section>

        {/* Content Area */}
        <div className="space-y-6">
          {/* Active Results Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 sm:text-sm">
            <span>
              Showing <strong className="text-slate-800">{destinations.length}</strong> of{' '}
              <strong className="text-slate-800">{pagination.total}</strong> Sri Lankan destinations
            </span>
          </div>

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="space-y-4">
              <InteractiveMap destinations={destinations} height="34.375rem" />
              <p className="text-xs text-slate-500 italic sm:text-sm">
                * Click markers on the map to see destination details, costs, and photos.
              </p>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <DestinationSkeleton key={i} />
                  ))}
                </div>
              ) : destinations.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
                  <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base">
                    No destinations match your filters
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto sm:text-sm">
                    Try broadening your search keywords or clearing your province/budget filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destinations.map((dest) => (
                    <DestinationCard key={dest._id} destination={dest} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {[...Array(pagination.pages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchDestinations(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                      pagination.page === pageNum
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
