import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import {
  GitCompare,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  DollarSign,
  Clock,
  Shield,
  ThumbsUp,
  FileCheck
} from 'lucide-react';

export const QuotationComparisonView: React.FC = () => {
  const {
    rfqs,
    quotations,
    selectedRFQId,
    setSelectedRFQId,
    evaluateQuotationsAI,
    scoringWeights,
    updateScoringWeights,
    setActivePage
  } = useProcurement();

  const currentRFQ = rfqs.find(r => r.id === selectedRFQId) || rfqs[0];

  // Get quotations for current RFQ
  const currentQuotes = quotations.filter(q => q.rfqId === currentRFQ.id);

  // Find recommended supplier quote if present
  const recommendedQuote = currentQuotes.find(q => q.status === 'RECOMMENDED') || currentQuotes[2] || currentQuotes[0];

  const handleWeightChange = (key: keyof typeof scoringWeights, val: number) => {
    updateScoringWeights({
      ...scoringWeights,
      [key]: val
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header & RFQ Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <GitCompare className="w-6 h-6 text-cyan-400" />
            AI Quotation Matrix & Evaluator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Side-by-side quotation decision matrix powered by multi-criteria AI weight scoring.
          </p>
        </div>

        {/* RFQ Select Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400">Select RFQ:</label>
          <select
            value={selectedRFQId || ''}
            onChange={e => setSelectedRFQId(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
          >
            {rfqs.map(r => (
              <option key={r.id} value={r.id}>
                {r.id} - {r.product} ({r.responseCount} quotes)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RFQ Context Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">Target Specs</span>
          <p className="text-sm font-bold text-white">{currentRFQ.product}</p>
          <p className="text-slate-400 mt-0.5">{currentRFQ.description}</p>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Quantity</span>
            <span className="text-sm font-bold text-cyan-300">{currentRFQ.quantity.toLocaleString()} {currentRFQ.unit}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Unit Price</span>
            <span className="text-sm font-bold text-slate-100">${currentRFQ.targetPrice}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Deadline</span>
            <span className="text-sm font-bold text-amber-400">{currentRFQ.deadline}</span>
          </div>
        </div>
      </div>

      {/* AI Evaluation Hero Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/40 electric-glow relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Award className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                AI Recommendation Ready
              </span>
              <h3 className="text-xl font-extrabold text-white tracking-tight mt-1">
                RECOMMENDED SUPPLIER: <span className="text-cyan-300">{recommendedQuote?.supplierName || 'Supplier C (SteelWorks India)'}</span>
              </h3>
            </div>
          </div>

          <button
            onClick={() => evaluateQuotationsAI(currentRFQ.id)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>AI Evaluate Quotations</span>
          </button>
        </div>

        {/* AI Rationale Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-xs leading-relaxed text-slate-200">
          <p className="font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" /> ProcureAI Recommendation Rationale:
          </p>
          <p className="text-slate-300">
            "Supplier C is recommended despite a 3% higher price because it provides significantly better quality, faster delivery (5 days vs 14 days), stronger historical performance and lower supply-chain risk."
          </p>
        </div>

        {/* Transparent Weighted Scoring Breakdown */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Transparent AI Scoring Criteria Weights
            </h4>
            <span className="text-[11px] text-slate-400">Total Weight: 100%</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Price</span>
                <span className="font-bold text-cyan-300">{scoringWeights.price}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${scoringWeights.price}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Quality</span>
                <span className="font-bold text-emerald-400">{scoringWeights.quality}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${scoringWeights.quality}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Delivery</span>
                <span className="font-bold text-indigo-400">{scoringWeights.delivery}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${scoringWeights.delivery}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Risk</span>
                <span className="font-bold text-amber-400">{scoringWeights.risk}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${scoringWeights.risk}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Performance</span>
                <span className="font-bold text-blue-400">{scoringWeights.performance}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: `${scoringWeights.performance}%` }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Side-by-Side Quotation Matrix Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden space-y-4 p-6">
        <h3 className="text-base font-bold text-white mb-2">Supplier Quotation Comparison Matrix</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Supplier</th>
                <th className="p-4">Quoted Price</th>
                <th className="p-4">Lead Time / Delivery</th>
                <th className="p-4">Quality Rating</th>
                <th className="p-4">Payment Terms</th>
                <th className="p-4">Risk Rating</th>
                <th className="p-4">Historical SLA</th>
                <th className="p-4">Overall Score</th>
                <th className="p-4 text-right">Award Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentQuotes.map(q => {
                const isRecommended = q.status === 'RECOMMENDED' || q.overallScore >= 90;
                return (
                  <tr
                    key={q.id}
                    className={`transition-colors ${
                      isRecommended ? 'bg-cyan-950/30 border-l-4 border-cyan-400' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-4 font-bold text-slate-100 flex items-center gap-2">
                      {isRecommended && <Award className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                      <div>
                        <span>{q.supplierName}</span>
                        {isRecommended && (
                          <span className="block text-[10px] text-cyan-300 font-semibold">AI Recommended Choice</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-extrabold text-base text-slate-100">
                      {q.currency}{q.price}
                    </td>
                    <td className="p-4 font-medium text-slate-200">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {q.deliveryDays} Days
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {q.qualityRating}%
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{q.paymentTerms}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        q.riskRating === 'Low'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : q.riskRating === 'Medium'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {q.riskRating}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-200">{q.historicalPerformance}%</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isRecommended ? 'bg-cyan-400' : 'bg-blue-500'}`}
                            style={{ width: `${q.overallScore}%` }}
                          />
                        </div>
                        <span className={`font-extrabold ${isRecommended ? 'text-cyan-300 text-sm' : 'text-slate-200'}`}>
                          {q.overallScore}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          alert(`Award PO dispatched to ${q.supplierName} for ${currentRFQ.product}!`);
                          setActivePage('orders');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isRecommended
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-105'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isRecommended ? 'Award Contract' : 'Select'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
