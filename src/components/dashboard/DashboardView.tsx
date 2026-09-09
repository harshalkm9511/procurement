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
    spendData,
    recommendations,
    setActivePage
  } = useProcurement();

  const highRiskSuppliers = suppliers.filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'MEDIUM');
  const totalSpend = spendData.reduce((sum, record) => sum + record.totalSpend, 0);
  const potentialSavings = spendData.reduce((sum, record) => sum + record.savingsOpportunity, 0);
  const activeSupplierCount = suppliers.filter(s => s.status === 'ACTIVE').length;
  const openRfqCount = rfqs.filter(rfq => rfq.status === 'OPEN' || rfq.status === 'IN_EVALUATION').length;
  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

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
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{formatCurrency(totalSpend)}</h3>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +8.4% vs last month
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Active baseline from spend records</p>
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
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{activeSupplierCount}</h3>
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
              {suppliers.length} total
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Loaded from the supplier API</p>
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
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{openRfqCount}</h3>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              {rfqs.filter(rfq => rfq.responseCount === 0).length} awaiting response
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Loaded from the RFQ API</p>
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
            <h3 className="text-2xl font-extrabold text-cyan-300 tracking-tight">{formatCurrency(potentialSavings)}</h3>
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 rounded-full">
              AI identified
            </span>
          </div>
          <p className="text-[11px] text-cyan-200/70 mt-2">{recommendations.length} actionable recommendations</p>
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
              onClick={() => setActivePage('suppliers', { supplierId: suppliers[0]?.id })}
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
              onClick={() => setActivePage('quotations', { rfqId: rfqs[0]?.id })}
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
            {highRiskSuppliers.length === 0 ? (
              <p className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-400">
                No elevated supplier risk records are available.
              </p>
            ) : highRiskSuppliers.slice(0, 3).map((supplier) => {
              const riskClasses = supplier.riskLevel === 'HIGH'
                ? {
                    border: 'border-rose-500/30',
                    hover: 'hover:border-rose-500/60',
                    icon: 'text-rose-400',
                    title: 'group-hover:text-rose-300',
                    badge: 'bg-rose-500/20 border-rose-500/40 text-rose-400',
                    body: 'text-rose-200/90',
                  }
                : {
                    border: 'border-amber-500/30',
                    hover: 'hover:border-amber-500/60',
                    icon: 'text-amber-400',
                    title: 'group-hover:text-amber-300',
                    badge: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
                    body: 'text-amber-200/90',
                  };

              return (
                <div
                  key={supplier.id}
                  onClick={() => setActivePage('risk', { supplierId: supplier.id })}
                  className={`p-4 rounded-2xl bg-slate-900/80 border ${riskClasses.border} ${riskClasses.hover} cursor-pointer transition-all hover:bg-slate-900 group`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold text-slate-100 ${riskClasses.title} transition-colors flex items-center gap-2`}>
                      <AlertTriangle className={`w-4 h-4 ${riskClasses.icon}`} />
                      {supplier.name}
                    </span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${riskClasses.badge}`}>
                      Risk: {supplier.riskLevel} ({supplier.riskScore}/100)
                    </span>
                  </div>
                  <p className={`text-xs ${riskClasses.body} leading-relaxed mb-3`}>
                    {supplier.riskReason}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>Category: {supplier.category}</span>
                    <span className={`font-medium ${riskClasses.icon} group-hover:translate-x-1 transition-transform flex items-center gap-0.5`}>
                      Inspect risk profile &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
