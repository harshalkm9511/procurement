import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import {
  DollarSign,
  Building2,
  FileText,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  ChevronRight,
  AlertTriangle,
  Zap
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    suppliers,
    rfqs,
    recommendations,
    setActivePage
  } = useProcurement();

  const highRiskSuppliers = suppliers.filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'MEDIUM');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Animated KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Total Spend */}
        <div
          onClick={() => setActivePage('spend')}
          className="glass-panel glass-panel-hover p-5 rounded-2xl cursor-pointer group border border-slate-800"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Spend</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">$1.24M</h3>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +8.4% vs last month
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Active baseline across 5 categories</p>
        </div>

        {/* KPI 2: Active Suppliers */}
        <div
          onClick={() => setActivePage('suppliers')}
          className="glass-panel glass-panel-hover p-5 rounded-2xl cursor-pointer group border border-slate-800"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Suppliers</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">128</h3>
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
              12 new this month
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">94% overall compliance rating</p>
        </div>

        {/* KPI 3: Open RFQs */}
        <div
          onClick={() => setActivePage('rfqs')}
          className="glass-panel glass-panel-hover p-5 rounded-2xl cursor-pointer group border border-slate-800"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open RFQs</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">24</h3>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              7 awaiting response
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Avg response cycle: 4.2 days</p>
        </div>

        {/* KPI 4: Potential Savings */}
        <div
          onClick={() => setActivePage('recommendations')}
          className="glass-panel glass-panel-hover p-5 rounded-2xl cursor-pointer group border border-cyan-500/30 electric-glow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
            Potential Savings
            </span>
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-cyan-300 tracking-tight">$184K</h3>
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 rounded-full">
              AI identified
            </span>
          </div>
          <p className="text-[11px] text-cyan-200/70 mt-2">6 actionable cost-optimization vectors</p>
        </div>

      </div>

      {/* Main Split Section: Left = AI Recommendations, Right = Supplier Risk Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: AI Recommendations */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Recommendations</h3>
                {/* <p className="text-xs text-slate-400">Automated strategic procurement opportunities</p> */}
              </div>
            </div>
            <button
              onClick={() => setActivePage('recommendations')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View all ({recommendations.length}) <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Card 1: Supplier Consolidation */}
            <div
              onClick={() => setActivePage('suppliers', { supplierId: 'sup-001' })}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all hover:bg-slate-900 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-cyan-300 group-hover:text-cyan-400 transition-colors">
                  Supplier Consolidation Opportunity
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400">
                  Priority: HIGH
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                "Consolidating 3 suppliers could reduce costs by approximately 7%."
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <span>Potential Savings: <strong className="text-emerald-400">$84,000 / yr</strong></span>
                <span className="text-cyan-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Review plan &rarr;
                </span>
              </div>
            </div>

            {/* Card 2: Price Increase Predicted */}
            <div
              onClick={() => setActivePage('forecast', { material: 'Steel' })}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all hover:bg-slate-900 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-amber-300 group-hover:text-amber-400 transition-colors">
                  Price Increase Predicted
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400">
                  Priority: MEDIUM
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                "Steel prices may increase over the next 30 days."
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <span>Forecasted Spike: <strong className="text-rose-400">+8.3% (₹78/kg)</strong></span>
                <span className="text-cyan-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  View forecast &rarr;
                </span>
              </div>
            </div>

            {/* Card 3: Quotation Award Recommendation */}
            <div
              onClick={() => setActivePage('quotations', { rfqId: 'RFQ-2026-001' })}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all hover:bg-slate-900 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-cyan-300">
                  Quotation Evaluation Ready
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
                  AI Evaluated
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                "Supplier C is recommended for RFQ-2026-001 due to superior quality and 5-day delivery."
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <span>Overall Score: <strong className="text-cyan-300">94%</strong></span>
                <span className="text-cyan-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Compare quotes &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Supplier Risk Alerts */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Supplier Risk Alerts</h3>
                {/* <p className="text-xs text-slate-400">Real-time supply chain vulnerability monitor</p> */}
              </div>
            </div>
            <button
              onClick={() => setActivePage('risk')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View risk matrix &rarr;
            </button>
          </div>

          <div className="space-y-4">
            {/* Alert 1: Global Materials Ltd */}
            <div
              onClick={() => setActivePage('risk', { supplierId: 'sup-001' })}
              className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/30 hover:border-rose-500/60 cursor-pointer transition-all hover:bg-slate-900 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-100 group-hover:text-rose-300 transition-colors flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Global Materials Ltd.
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400">
                  Risk: HIGH (82/100)
                </span>
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed mb-3">
                Financial risk detected. Delivery delays increased by 27% and credit solvency metrics deteriorated.
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <span>Category: Raw Materials & Metals</span>
                <span className="text-rose-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Inspect risk profile &rarr;
                </span>
              </div>
            </div>

            {/* Alert 2: Prime Components */}
            <div
              onClick={() => setActivePage('risk', { supplierId: 'sup-002' })}
              className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-500/60 cursor-pointer transition-all hover:bg-slate-900 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Prime Components
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400">
                  Risk: MEDIUM (58/100)
                </span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed mb-3">
                Delivery delays increasing. Regional port congestion expanding average lead times to 14 days.
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <span>Category: Electronic Components</span>
                <span className="text-amber-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Inspect risk profile &rarr;
                </span>
              </div>
            </div>

            {/* Alert 3: Shenzhen Micro Semi */}
            <div
              onClick={() => setActivePage('risk', { supplierId: 'sup-012' })}
              className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/30 hover:border-rose-500/60 cursor-pointer transition-all hover:bg-slate-900 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-100 group-hover:text-rose-300 transition-colors flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Shenzhen Micro Semi
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400">
                  Risk: HIGH (79/100)
                </span>
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed mb-3">
                Contract violations & quality complaint rate at 5.6%. Prepayment risk flagged.
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <span>Category: Electronic Components</span>
                <span className="text-rose-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Inspect risk profile &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
