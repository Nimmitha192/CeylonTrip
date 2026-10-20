import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 rounded-full border-emerald-200 border-t-emerald-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Checking administrator privileges...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
