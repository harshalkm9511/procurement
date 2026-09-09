import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
  PieChart as PieIcon,
  Zap,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const SupplierRiskView: React.FC = () => {
  const { suppliers, selectedSupplierId, setSelectedSupplierId, runSupplierRiskAnalysisAI, setActivePage } = useProcurement();

  const activeSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];
  const [mitigationPlanActive, setMitigationPlanActive] = useState(false);

  if (!activeSupplier) {
    return <div className="glass-panel rounded-3xl border border-slate-800 p-8 text-sm text-slate-400">No suppliers are available for this workspace.</div>;
  }

  // Risk distribution statistics
  const highRiskCount = suppliers.filter(s => s.riskLevel === 'HIGH').length;
  const mediumRiskCount = suppliers.filter(s => s.riskLevel === 'MEDIUM').length;
  const lowRiskCount = suppliers.filter(s => s.riskLevel === 'LOW').length;

  const pieData = [
    { name: 'High Risk', value: highRiskCount, color: '#f43f5e' },
    { name: 'Medium Risk', value: mediumRiskCount, color: '#f59e0b' },
    { name: 'Low Risk', value: lowRiskCount, color: '#10b981' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            Supplier Risk Intelligence Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-dimensional risk monitoring, solvency warnings & AI mitigation planning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => runSupplierRiskAnalysisAI(activeSupplier.id)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs shadow-xl shadow-rose-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-rose-200 animate-pulse" />
            <span>Re-Run AI Risk Scan</span>
          </button>
        </div>
      </div>

      {/* Risk Level Metric Cards & Distribution Donut */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* High Risk Card */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">High Risk</span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{highRiskCount}</h3>
          <p className="text-[11px] text-rose-300/80 mt-1">Requires immediate mitigation</p>
        </div>

        {/* Medium Risk Card */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Medium Risk</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{mediumRiskCount}</h3>
          <p className="text-[11px] text-amber-300/80 mt-1">Lead time & port watch list</p>
        </div>

        {/* Low Risk Card */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Low Risk</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{lowRiskCount}</h3>
          <p className="text-[11px] text-emerald-300/80 mt-1">Fully compliant tier-1 SLA</p>
        </div>

        {/* Risk Distribution Pie Chart Mini */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Risk Spread</span>
            <p className="text-xs font-semibold text-slate-200 mt-1">20 Active Suppliers</p>
          </div>
          <div className="w-20 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={20} outerRadius={35} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Main Split: Left = Supplier Risk List, Right = Deep Risk Breakdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left List */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white mb-2">Select Supplier to Inspect Risk:</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {suppliers.map(s => {
              const isSelected = s.id === activeSupplier.id;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedSupplierId(s.id);
                    setMitigationPlanActive(false);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-100">{s.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      s.riskLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : s.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {s.riskScore} / 100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{s.category}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 lg:col-span-2">
          
          {/* Supplier Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-extrabold text-white">{activeSupplier.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  activeSupplier.riskLevel === 'HIGH'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 glow-rose'
                    : activeSupplier.riskLevel === 'MEDIUM'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {activeSupplier.riskLevel} RISK ({activeSupplier.riskScore} / 100)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{activeSupplier.category} • {activeSupplier.location}</p>
            </div>
          </div>

          {/* Visual Score Bars */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Simulated Risk Dimensions</h4>
            
            {/* Financial Risk */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Financial Risk</span>
                <span className="font-bold text-rose-400">{activeSupplier.financialRiskScore} / 100</span>
              </div>
              <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${activeSupplier.financialRiskScore}%` }} />
              </div>
            </div>

            {/* Delivery Risk */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Delivery Risk</span>
                <span className="font-bold text-rose-400">{activeSupplier.deliveryRiskScore} / 100</span>
              </div>
              <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${activeSupplier.deliveryRiskScore}%` }} />
              </div>
            </div>

            {/* Quality Risk */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Quality Risk</span>
                <span className="font-bold text-amber-400">{activeSupplier.qualityRiskScore} / 100</span>
              </div>
              <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${activeSupplier.qualityRiskScore}%` }} />
              </div>
            </div>

            {/* Price Stability */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Price Stability</span>
                <span className="font-bold text-blue-400">{activeSupplier.priceStabilityScore} / 100</span>
              </div>
              <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: `${activeSupplier.priceStabilityScore}%` }} />
              </div>
            </div>
          </div>

          {/* AI Risk Rationale Box */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs space-y-2">
            <h5 className="font-bold text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Why is this supplier risky?
            </h5>
            <p className="text-rose-200/90 leading-relaxed">
              "{activeSupplier.riskReason}"
            </p>
          </div>

          {/* Generate Mitigation Plan Button & Output */}
          <div>
            {!mitigationPlanActive ? (
              <button
                onClick={() => setMitigationPlanActive(true)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
              >
                <Zap className="w-4 h-4 text-cyan-200" />
                <span>Generate Mitigation Plan</span>
              </button>
            ) : (
              <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-cyan-300 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    AI Recommended Risk Mitigation Plan
                  </h5>
                  <span className="text-[10px] text-slate-400">Target: {activeSupplier.name}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-cyan-300 block mb-1">1. Activate Backup Supplier</span>
                    <p className="text-slate-400 text-[11px]">Shift 30% allocation to SteelWorks India or Apex Manufacturing immediately.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-cyan-300 block mb-1">2. Reduce Dependency</span>
                    <p className="text-slate-400 text-[11px]">Cap maximum PO value at $50k per order cycle.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-cyan-300 block mb-1">3. Increase Inspection</span>
                    <p className="text-slate-400 text-[11px]">Mandate 100% pre-shipment CMM dimension verification.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-cyan-300 block mb-1">4. Review Payment Terms</span>
                    <p className="text-slate-400 text-[11px]">Transition payment terms from Net 30 to milestone delivery acceptance.</p>
                  </div>
                </div>

                <button
                  onClick={() => setActivePage('rfqs')}
                  className="w-full py-2 text-xs font-semibold text-cyan-300 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  Create Backup RFQ Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
