import React from 'react';
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudFog,
  Wind,
  Droplets,
  Umbrella,
  Compass,
} from 'lucide-react';

export default function WeatherWidget({ weather, locationName }) {
  if (!weather) return null;

  const getConditionIcon = (condition = '') => {
    const c = condition.toLowerCase();
    if (c.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (c.includes('mist') || c.includes('fog')) return <CloudFog className="w-8 h-8 text-slate-400" />;
    if (c.includes('cloud')) return <CloudSun className="w-8 h-8 text-amber-500" />;
    return <Sun className="w-8 h-8 text-amber-500 animate-pulse" />;
  };

  return (
    <div className="bg-gradient-to-br from-ocean-50 to-emerald-50 border border-ocean-100 rounded-2xl p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold tracking-wider uppercase text-ocean-700 block">
            Current Climate & Forecast
          </span>
          <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base">
            {locationName || 'Destination Weather'}
          </h4>
        </div>
        <div className="p-2 rounded-xl bg-white shadow-sm">
          {getConditionIcon(weather.condition)}
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-display font-extrabold text-slate-900">
          {weather.temperature}°C
        </span>
        <span className="text-sm font-semibold text-slate-600 sm:text-base">
          {weather.condition}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-ocean-200/60 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Droplets className="w-3.5 h-3.5 text-ocean-500" />
          <span>{weather.humidity}% Humid</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <Umbrella className="w-3.5 h-3.5 text-blue-500" />
          <span>{weather.rainProbability}% Rain</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <Wind className="w-3.5 h-3.5 text-slate-500" />
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>

      {weather.recommendation && (
        <p className="mt-3 text-xs text-ocean-900 bg-white/70 backdrop-blur-sm p-2.5 rounded-xl border border-ocean-100 leading-relaxed font-medium sm:text-sm">
          💡 {weather.recommendation}
        </p>
      )}
    </div>
  );
}
