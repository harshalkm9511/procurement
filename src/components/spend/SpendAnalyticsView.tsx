import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, Calendar, PieChart as PieIcon, ArrowDownRight, Sparkles } from 'lucide-react';

export const SpendAnalyticsView: React.FC = () => {
  const { spendData, suppliers } = useProcurement();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '3M' | '12M'>('12M');

  // Filter spend data according to timeframe selection
  const filteredSpendData = React.useMemo(() => {
    if (timeRange === '7D') return spendData.slice(-1);
    if (timeRange === '30D') return spendData.slice(-2);
    if (timeRange === '3M') return spendData.slice(-3);
    return spendData;
  }, [spendData, timeRange]);

  // Category breakdown calculation
  const categoryData = [
    { name: 'Direct Materials', value: 670000, color: '#3b82f6' },
    { name: 'Electronics', value: 315000, color: '#06b6d4' },
    { name: 'Logistics & Freight', value: 182000, color: '#6366f1' },
    { name: 'MRO & Utilities', value: 71000, color: '#f59e0b' },
    { name: 'Packaging', value: 52000, color: '#10b981' }
  ];

  // Top suppliers spend
  const topSupplierSpend = suppliers
    .slice()
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 6)
    .map(s => ({
      name: s.name.length > 15 ? `${s.name.substring(0, 15)}...` : s.name,
      spend: s.spend
    }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Procurement Spend Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyze historical spend distribution, maverick spending & AI cost optimization vectors.
          </p>
        </div>

        {/* Timeframe Toggle Buttons */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <Calendar className="w-4 h-4 text-slate-500 ml-2 mr-1" />
          {(['7D', '30D', '3M', '12M'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                timeRange === range
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {range === '7D' ? '7 Days' : range === '30D' ? '30 Days' : range === '3M' ? '3 Months' : '12 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Spend Trend Area Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Monthly Spend & Savings Opportunity ($)
            </h3>
            <p className="text-xs text-slate-400">Total spend baseline vs AI identified savings headroom</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Total YTD Spend:</span>
            <p className="text-lg font-extrabold text-cyan-300">$12.87M</p>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredSpendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val: any) => [`$${val?.toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="totalSpend" name="Total Spend ($)" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#spendGradient)" />
              <Area type="monotone" dataKey="savingsOpportunity" name="Potential AI Savings ($)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#savingsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Category Breakdown (Pie) & Top Suppliers (Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown Donut */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              Category-Wise Spending
            </h3>
            <span className="text-xs text-slate-400">Current Month</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [`$${val?.toLocaleString()}`, 'Spend']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
            {categoryData.map(cat => (
              <div key={cat.name} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-300 truncate">{cat.name}:</span>
                <span className="font-semibold text-white">${(cat.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Suppliers Spend Bar */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Top Supplier Spend Concentration
            </h3>
            <span className="text-xs text-slate-400">Top 6 Vendors</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSupplierSpend} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={v => `$${v / 1000}k`} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [`$${val?.toLocaleString()}`, 'Spend']}
                />
                <Bar dataKey="spend" fill="#06b6d4" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>AI Insight: Top 5 suppliers represent 42% of total procurement spend. Supplier consolidation could potentially reduce annual spending by $184K.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
