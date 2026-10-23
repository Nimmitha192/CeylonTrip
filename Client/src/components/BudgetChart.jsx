import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';
import {
  Hotel,
  Car,
  Utensils,
  Ticket,
  Compass,
  Wallet,
} from 'lucide-react';

const COLORS = [
  '#059669', // Accommodation - Emerald
  '#0284c7', // Transportation - Ocean Blue
  '#f59e0b', // Food - Amber
  '#8b5cf6', // Entrance Fees - Purple
  '#ec4899', // Activities - Pink
  '#64748b', // Miscellaneous - Slate
];

export default function BudgetChart({ budget }) {
  if (!budget) return null;

  const data = [
    { name: 'Accommodation', value: budget.accommodation || 0, icon: Hotel, color: COLORS[0] },
    { name: 'Transportation', value: budget.transportation || 0, icon: Car, color: COLORS[1] },
    { name: 'Food & Dining', value: budget.food || 0, icon: Utensils, color: COLORS[2] },
    { name: 'Entrance Fees', value: budget.entranceFees || 0, icon: Ticket, color: COLORS[3] },
    { name: 'Activities', value: budget.activities || 0, icon: Compass, color: COLORS[4] },
    { name: 'Miscellaneous', value: budget.miscellaneous || 0, icon: Wallet, color: COLORS[5] },
  ].filter((item) => item.value > 0);

  const total = budget.total || data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const current = payload[0].payload;
      const percent = ((current.value / total) * 100).toFixed(1);
      return (
        <div className="bg-emerald-50 text-slate-900 p-3 rounded-xl shadow-xl border border-emerald-200 text-xs sm:text-sm">
          <p className="font-bold">{current.name}</p>
          <p className="text-emerald-700 font-extrabold text-sm mt-0.5 sm:text-base">
            {formatCurrency(current.value)}
          </p>
          <p className="text-slate-400 text-xs mt-0.5 sm:text-sm">{percent}% of estimated trip</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">
            Estimated Budget Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 sm:text-sm">
            Real-time projection based on local Sri Lankan travel rates
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
            Total Estimated Cost
          </span>
          <span className="text-xl font-display font-extrabold text-emerald-700">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Doughnut Chart */}
        <div className="lg:col-span-5 h-64 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Total Budget
            </span>
            <span className="text-sm font-extrabold text-slate-800 sm:text-base">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Progress Bars & Item Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {data.map((item, idx) => {
            const Icon = item.icon;
            const percent = ((item.value / total) * 100).toFixed(0);

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between text-xs mb-1.5 sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{percent}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                <div className="text-xs font-bold text-slate-800 text-right sm:text-sm">
                  {formatCurrency(item.value)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
