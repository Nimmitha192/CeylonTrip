import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  MapPin,
  FolderTree,
  Activity,
  Hotel,
  MessageSquare,
  Luggage,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  Compass,
  PlusCircle,
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Destinations', path: '/admin/destinations', icon: MapPin },
    { label: 'Add Destination', path: '/admin/destinations/new', icon: PlusCircle },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Activities', path: '/admin/activities', icon: Activity },
    { label: 'Hotels', path: '/admin/hotels', icon: Hotel },
    { label: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { label: 'Trips', path: '/admin/trips', icon: Luggage },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 md:flex-row">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between p-4 text-slate-900 md:hidden bg-emerald-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">Admin Console</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar navigation */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white text-slate-700 border-r border-slate-200 flex-shrink-0 flex flex-col justify-between p-4 sticky top-0 md:h-screen z-40`}
      >
        <div>
          {/* Logo & Platform Info */}
          <div className="items-center hidden gap-3 px-3 py-4 mb-4 border-b md:flex border-slate-100">
            <div className="flex items-center justify-center w-10 h-10 text-white shadow-md rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold leading-tight text-slate-900 text-2xl sm:text-3xl">CeylonTrips</h2>
              <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                Admin Console
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-400 hover:text-emerald-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Exit */}
        <div className="pt-4 mt-6 space-y-2 border-t border-slate-100">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition text-slate-400 hover:text-emerald-800 sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Public Site
          </Link>
          <div className="flex items-center justify-between px-3 py-2 bg-slate-100 rounded-xl">
            <div className="pr-2 truncate">
              <p className="text-xs font-bold text-slate-900 truncate sm:text-sm">{user?.name}</p>
              <p className="text-xs text-emerald-700 uppercase font-bold">Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-emerald-100 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Admin Content Viewport */}
      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
        <main className="flex-1 w-full p-6 mx-auto sm:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

