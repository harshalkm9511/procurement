import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Boxes, Sparkles, AlertTriangle, CheckCircle2, RefreshCw, ShoppingBag, Clock } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory, generateReorderRecommendationAI, setActivePage } = useProcurement();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = Array.from(new Set(inventory.map(i => i.category)));

  const filteredInventory = selectedCategory === 'ALL'
    ? inventory
    : inventory.filter(i => i.category === selectedCategory);

  const criticalItem = inventory.find(i => i.status === 'CRITICAL') || inventory[0];

  if (!criticalItem) {
    return <div className="glass-panel rounded-3xl border border-slate-800 p-8 text-sm text-slate-400">No inventory items are available for this workspace.</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3" /> CRITICAL</span>;
      case 'LOW_STOCK':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3" /> LOW STOCK</span>;
      case 'OVERSTOCKED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1 w-max">OVERSTOCKED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3" /> HEALTHY</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-cyan-400" />
            Inventory Intelligence & Demand Prediction
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time burn-rate tracking, safety stock buffer monitoring & automated replenishment workflows.
          </p>
        </div>

        <button
          onClick={() => generateReorderRecommendationAI(criticalItem.id)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Generate Reorder Recommendation</span>
        </button>
      </div>

      {/* AI Critical Stock Prediction Alert Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-rose-500/40 glow-rose space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 uppercase tracking-wider">
                AI Stockout Warning
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {criticalItem.product} ({criticalItem.sku})
              </h3>
            </div>
          </div>

          <button
            onClick={() => generateReorderRecommendationAI(criticalItem.id)}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-lg transition-all"
          >
            Trigger Replenishment RFQ
          </button>
        </div>

        <p className="text-xs text-rose-200/90 leading-relaxed font-medium">
          "Current stock: <strong>{criticalItem.currentStock.toLocaleString()} {criticalItem.unit}</strong> | Daily demand: <strong>{criticalItem.dailyDemand} {criticalItem.unit}/day</strong> | Lead time: <strong>{criticalItem.leadTimeDays} days</strong>. AI Predicts: Inventory may reach critical level in approximately <strong>{criticalItem.criticalDaysLeft} days</strong>."
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          All Categories ({inventory.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Inventory Data Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Product Name / SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Daily Demand</th>
                <th className="p-4">Reorder Point</th>
                <th className="p-4">Lead Time</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInventory.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-100">
                    <span className="block truncate">{item.product}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-normal">{item.sku}</span>
                  </td>
                  <td className="p-4 text-slate-300">{item.category}</td>
                  <td className="p-4 font-extrabold text-slate-100">{item.currentStock.toLocaleString()} {item.unit}</td>
                  <td className="p-4 font-medium text-slate-300">{item.dailyDemand} / day</td>
                  <td className="p-4 font-semibold text-cyan-300">{item.reorderPoint.toLocaleString()} {item.unit}</td>
                  <td className="p-4 text-slate-400">{item.leadTimeDays} Days</td>
                  <td className="p-4">{getStatusBadge(item.status)}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => generateReorderRecommendationAI(item.id)}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold transition-colors flex items-center gap-1 ml-auto"
                    >
                      <RefreshCw className="w-3 h-3" /> Reorder RFQ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
