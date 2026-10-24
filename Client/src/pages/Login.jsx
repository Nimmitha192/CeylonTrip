import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, Sparkles, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      addToast('Welcome back to CeylonTrips!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      addToast(err.message || 'Login failed. Please verify your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@lankatrip.com');
      setPassword('Admin@12345');
    } else {
      setEmail('tourist@lankatrip.com');
      setPassword('Tourist@12345');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30 mb-2">
            <Compass className="w-7 h-7" />
          </Link>
          <h2 className="font-display font-extrabold text-slate-900 text-2xl sm:text-3xl">
            Sign in to Your Account
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Access your saved itineraries, trip recommendations, and favorites
          </p>
        </div>

        {/* Demo Account Quick-Fill */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
            ⚡ Quick Demo Accounts (One-Click)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 transition shadow-xs sm:text-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Admin Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('tourist')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 transition shadow-xs sm:text-sm"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              Tourist Demo
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block sm:text-sm">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-500 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 block sm:text-sm">Password</label>
              <span className="text-xs text-slate-400 sm:text-sm">Min 6 characters</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-500 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 sm:text-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 sm:text-sm">
          Don’t have an account yet?{' '}
          <Link to="/register" className="font-bold text-emerald-700 hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
