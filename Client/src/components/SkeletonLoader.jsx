import React from 'react';

export function DestinationSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-soft animate-pulse flex flex-col h-100">
      <div className="h-56 bg-slate-200 w-full" />
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-6 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-4/5" />
        </div>
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="h-5 bg-slate-200 rounded w-1/4" />
          <div className="h-5 bg-slate-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function ItinerarySkeleton() {
  return (
    <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
      <div className="h-36 bg-slate-200 rounded-2xl w-full" />
      <div className="h-96 bg-slate-200 rounded-2xl w-full" />
      <div className="space-y-4">
        <div className="h-32 bg-slate-200 rounded-2xl w-full" />
        <div className="h-32 bg-slate-200 rounded-2xl w-full" />
        <div className="h-32 bg-slate-200 rounded-2xl w-full" />
      </div>
    </div>
  );
}
