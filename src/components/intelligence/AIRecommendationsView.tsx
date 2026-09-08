import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import type { RecommendationCategory, PriorityLevel } from '../../types/procurement';
import { Sparkles, DollarSign, ShieldAlert, TrendingUp, Boxes, Building2, FileCheck, Filter, ArrowRight } from 'lucide-react';

export const AIRecommendationsView: React.FC = () => {
  const { recommendations, setActivePage } = useProcurement();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const filteredRecs = recommendations.filter(rec => {
    const matchesCat = categoryFilter === 'ALL' || rec.category === categoryFilter;
    const matchesPrio = priorityFilter === 'ALL' || rec.priority === priorityFilter;
    return matchesCat && matchesPrio;
  });

  const getCategoryIcon = (cat: RecommendationCategory) => {
    switch (cat) {
      case 'COST_SAVING':
        return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case 'RISK':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'PRICE':
        return <TrendingUp className="w-5 h-5 text-amber-400" />;
      case 'INVENTORY':
        return <Boxes className="w-5 h-5 text-indigo-400" />;
      case 'SUPPLIER':
        return <Building2 className="w-5 h-5 text-cyan-400" />;
      case 'CONTRACT':
        return <FileCheck className="w-5 h-5 text-blue-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleActionClick = (actionType: string, targetId?: string) => {
    switch (actionType) {
      case 'NAVIGATE_SUPPLIER':
        setActivePage('suppliers', { supplierId: targetId });
        break;
      case 'CREATE_RFQ':
        setActivePage('rfqs');
        break;
      case 'EVALUATE_QUOTE':
        setActivePage('quotations', { rfqId: targetId });
        break;
      case 'REORDER_INVENTORY':
        setActivePage('inventory');
        break;
      case 'PURCHASE_PLAN':
        setActivePage('forecast', { material: targetId });
        break;
      default:
        setActivePage('dashboard');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
            AI Decision Recommendations Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Prioritized cost optimization, risk mitigation, price hedging & inventory vector recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-cyan-300 font-semibold px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
          <span>Active Recommendations: <strong>{recommendations.length}</strong></span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Category Filter */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-2" />
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1 rounded-xl font-semibold transition-all ${
              categoryFilter === 'ALL' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Categories
          </button>
          {(['COST_SAVING', 'RISK', 'PRICE', 'INVENTORY', 'SUPPLIER', 'CONTRACT'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl font-semibold transition-all ${
                categoryFilter === cat ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs">
          <button
            onClick={() => setPriorityFilter('ALL')}
            className={`px-3 py-1 rounded-xl font-semibold transition-all ${
              priorityFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Priorities
          </button>
          <button
            onClick={() => setPriorityFilter('HIGH')}
            className={`px-3 py-1 rounded-xl font-semibold transition-all ${
              priorityFilter === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High Priority
          </button>
          <button
            onClick={() => setPriorityFilter('MEDIUM')}
            className={`px-3 py-1 rounded-xl font-semibold transition-all ${
              priorityFilter === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Medium Priority
          </button>
        </div>
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecs.map(rec => (
          <div
            key={rec.id}
            className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 ${
              rec.priority === 'HIGH'
                ? 'border-rose-500/30 shadow-lg shadow-rose-500/5'
                : rec.priority === 'MEDIUM'
                ? 'border-amber-500/30 shadow-lg shadow-amber-500/5'
                : 'border-slate-800'
            }`}
          >
            <div className="space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {getCategoryIcon(rec.category)}
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {rec.category.replace('_', ' ')}
                  </span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  rec.priority === 'HIGH'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : rec.priority === 'MEDIUM'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {rec.priority} PRIORITY
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white leading-snug">
                {rec.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {rec.description}
              </p>
            </div>

            {/* Bottom Impact & Action */}
            <div className="pt-4 mt-6 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Potential Impact:</span>
                <span className="font-bold text-emerald-400">{rec.potentialImpact}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">AI Confidence:</span>
                <span className="font-bold text-cyan-300">{rec.confidencePercent}%</span>
              </div>

              <button
                onClick={() => handleActionClick(rec.actionType, rec.targetId)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 group"
              >
                <span>{rec.recommendedAction}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
