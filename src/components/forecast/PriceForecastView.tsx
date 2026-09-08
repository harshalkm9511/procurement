import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import {
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Calendar,
  Layers,
  CheckCircle2,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const PriceForecastView: React.FC = () => {
  const { forecasts, selectedMaterial, setSelectedMaterial, generatePurchasePlanAI } = useProcurement();

  const currentForecast = forecasts[selectedMaterial] || forecasts['Steel'];

  // Combine historical and forecast points into one chart array
  const combinedChartData = React.useMemo(() => {
    const historical = currentForecast.historicalData.map(d => ({
      date: d.date,
      historicalPrice: d.price,
      predictedPrice: null as number | null,
      confidenceBand: null as number[] | null
    }));

    const forecast = currentForecast.forecastData.map(d => ({
      date: d.date,
      historicalPrice: null as number | null,
      predictedPrice: d.predictedPrice,
      confidenceBand: [d.lowerBound || d.predictedPrice! * 0.95, d.upperBound || d.predictedPrice! * 1.05]
    }));

    // Bridge the last historical point with first forecast point
    if (historical.length > 0 && forecast.length > 0) {
      forecast[0].historicalPrice = historical[historical.length - 1].historicalPrice ?? null;
    }

    return [...historical, ...forecast];
  }, [currentForecast]);

  const materials = ['Steel', 'Copper', 'Aluminum', 'Electronic Components', 'Plastic'] as const;

  const isPositive = currentForecast.expectedChangePercent > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            AI Commodity Price Predictive Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Machine learning forecast models predicting 30/60/90-day spot price trajectories with confidence intervals.
          </p>
        </div>

        <button
          onClick={() => generatePurchasePlanAI(currentForecast.material)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
        >
          <Zap className="w-4 h-4 text-cyan-200" />
          <span>Create Purchase Plan</span>
        </button>
      </div>

      {/* Material Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
        {materials.map(mat => (
          <button
            key={mat}
            onClick={() => setSelectedMaterial(mat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedMaterial === mat
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {mat}
          </button>
        ))}
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Current Price</span>
          <h3 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            {currentForecast.currentPrice} <span className="text-xs font-normal text-slate-400">{currentForecast.unit}</span>
          </h3>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">30-Day Forecast</span>
          <h3 className="text-2xl font-extrabold text-cyan-300 tracking-tight mt-1">
            {currentForecast.forecast30Day} <span className="text-xs font-normal text-slate-400">{currentForecast.unit}</span>
          </h3>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Expected Change</span>
          <div className="flex items-center gap-1 mt-1">
            <span className={`text-2xl font-extrabold tracking-tight ${isPositive ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isPositive ? `+${currentForecast.expectedChangePercent}%` : `${currentForecast.expectedChangePercent}%`}
            </span>
            {isPositive ? <ArrowUpRight className="w-5 h-5 text-rose-400" /> : <ArrowDownRight className="w-5 h-5 text-emerald-400" />}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">AI Model Confidence</span>
          <h3 className="text-2xl font-extrabold text-emerald-400 tracking-tight mt-1">
            {currentForecast.confidencePercent}%
          </h3>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              {currentForecast.material} Price Trend & 30-Day Prediction Curve
            </h3>
            <p className="text-xs text-slate-400">Historical spot rates vs AI model prediction interval</p>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combinedChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="confidenceBand" name="95% Confidence Band" stroke="none" fill="#06b6d4" fillOpacity={0.15} />
              <Line type="monotone" dataKey="historicalPrice" name="Historical Spot Price" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="predictedPrice" name="AI Predicted Trajectory" stroke="#06b6d4" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Procurement Strategy Recommendation Box */}
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/40 electric-glow space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Strategic Buying Recommendation</h4>
            <p className="text-xs text-cyan-400">Automated sourcing timing vector</p>
          </div>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          "{currentForecast.aiRecommendation}"
        </p>

        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Grounded in 12-month global commodity data
          </span>

          <div className="flex gap-3">
            <button
              onClick={() => generatePurchasePlanAI(currentForecast.material)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20"
            >
              Execute Purchase Plan
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
