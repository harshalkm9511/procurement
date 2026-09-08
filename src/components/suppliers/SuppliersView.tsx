import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import type { Supplier } from '../../types/procurement';
import {
  Building2,
  Search,
  Filter,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  X,
  MapPin,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';

export const SuppliersView: React.FC = () => {
  const { suppliers, selectedSupplierId, setSelectedSupplierId, runSupplierRiskAnalysisAI, setActivePage } = useProcurement();

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [detailSupplier, setDetailSupplier] = useState<Supplier | null>(() => {
    return suppliers.find(s => s.id === selectedSupplierId) || suppliers[0] || null;
  });

  // Filter logic
  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = riskFilter === 'ALL' || s.riskLevel === riskFilter;
    const matchesCategory = categoryFilter === 'ALL' || s.category === categoryFilter;

    return matchesSearch && matchesRisk && matchesCategory;
  });

  const categories = Array.from(new Set(suppliers.map(s => s.category)));

  const handleOpenDetail = (s: Supplier) => {
    setDetailSupplier(s);
    setSelectedSupplierId(s.id);
  };

  const getRiskBadge = (level: string, score: number) => {
    if (level === 'HIGH' || score >= 75) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-max">
          <AlertTriangle className="w-3 h-3" /> HIGH ({score})
        </span>
      );
    }
    if (level === 'MEDIUM' || score >= 50) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-max">
          <AlertTriangle className="w-3 h-3" /> MEDIUM ({score})
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-max">
        <CheckCircle2 className="w-3 h-3" /> LOW ({score})
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-400" />
            Supplier Directory & Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track performance, financial stability & real-time risk scores across 20 active enterprise suppliers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            Total Vendors: <strong className="text-cyan-400">{suppliers.length}</strong>
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search suppliers by name, category, or location..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Risk Filter */}
        <div className="relative">
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
          <Filter className="w-3.5 h-3.5 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <Filter className="w-3.5 h-3.5 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Main Content Layout: Left = Supplier Table, Right = Selected Profile (if open) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table Column */}
        <div className={`glass-panel rounded-3xl border border-slate-800 overflow-hidden ${detailSupplier ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Supplier Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Annual Spend</th>
                  <th className="p-4">Performance</th>
                  <th className="p-4">Delivery Rate</th>
                  <th className="p-4">Quality Score</th>
                  <th className="p-4">Risk Level</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSuppliers.map(s => (
                  <tr
                    key={s.id}
                    onClick={() => handleOpenDetail(s)}
                    className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                      detailSupplier?.id === s.id ? 'bg-blue-950/30 border-l-4 border-cyan-400' : ''
                    }`}
                  >
                    <td className="p-4 font-semibold text-slate-100 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <div>
                        <span className="block truncate">{s.name}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{s.location}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 truncate max-w-[120px]">{s.category}</td>
                    <td className="p-4 font-bold text-cyan-300">${s.spend.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${s.performance}%` }} />
                        </div>
                        <span className="font-semibold">{s.performance}%</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-200">{s.deliveryRate}%</td>
                    <td className="p-4 font-medium text-slate-200">{s.qualityScore}%</td>
                    <td className="p-4">{getRiskBadge(s.riskLevel, s.riskScore)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(s);
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold transition-colors"
                      >
                        Profile &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Profile Drawer / Side View */}
        {detailSupplier && (
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-6 animate-in slide-in-from-right duration-200 lg:col-span-1">
            
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white leading-tight">{detailSupplier.name}</h3>
                  {getRiskBadge(detailSupplier.riskLevel, detailSupplier.riskScore)}
                </div>
                <p className="text-xs text-cyan-400 font-medium">{detailSupplier.category}</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" /> {detailSupplier.location}
                </p>
              </div>
              <button
                onClick={() => setDetailSupplier(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Run AI Risk Analysis CTA Button */}
            <button
              onClick={() => runSupplierRiskAnalysisAI(detailSupplier.id)}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span>Run AI Risk Analysis</span>
            </button>

            {/* AI Explanation Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                AI Supplier Intelligence Rationale
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "{detailSupplier.riskReason}"
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Spend</span>
                <span className="text-base font-extrabold text-cyan-300">${detailSupplier.spend.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lead Time</span>
                <span className="text-base font-extrabold text-slate-100">{detailSupplier.leadTimeDays} Days</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Delivery SLA</span>
                <span className="text-base font-extrabold text-slate-100">{detailSupplier.deliveryRate}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Defect Rate</span>
                <span className="text-base font-extrabold text-rose-400">{detailSupplier.complaintRate}%</span>
              </div>
            </div>

            {/* Performance Progress Bars */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Score Factors</h4>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Quality Score</span>
                  <span className="font-semibold text-cyan-300">{detailSupplier.qualityScore}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${detailSupplier.qualityScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Financial Risk Score</span>
                  <span className="font-semibold text-rose-400">{detailSupplier.financialRiskScore}/100</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${detailSupplier.financialRiskScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Delivery Risk Score</span>
                  <span className="font-semibold text-amber-400">{detailSupplier.deliveryRiskScore}/100</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${detailSupplier.deliveryRiskScore}%` }} />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> {detailSupplier.contactEmail}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" /> {detailSupplier.contactPhone}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Contract Expiry: {detailSupplier.contractExpiry}
              </p>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
