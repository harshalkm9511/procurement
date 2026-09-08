import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { FileSpreadsheet, Download, FileText, Sparkles, CheckCircle2, Loader2, Printer } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { suppliers, rfqs, spendData, forecasts } = useProcurement();
  const [selectedReport, setSelectedReport] = useState<string>('summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(true);

  const reportTypes = [
    { id: 'summary', name: 'Executive Procurement Summary', desc: 'Comprehensive overview of quarterly spend, active suppliers & RFQs.' },
    { id: 'risk', name: 'Supplier Risk Audit Report', desc: 'Detailed breakdown of high-risk suppliers, solvency indices & SLA compliance.' },
    { id: 'spend', name: 'Category & Vendor Spend Analysis', desc: '12-month spend breakdown across direct materials, logistics & electronics.' },
    { id: 'savings', name: 'AI Identified Savings Report', desc: 'Cost optimization recommendations & consolidation opportunities.' },
    { id: 'forecast', name: 'Commodity Price Forecast Report', desc: '30/60/90-day price trend analysis for Steel, Copper & Aluminum.' }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setReportReady(false);
    setTimeout(() => {
      setIsGenerating(false);
      setReportReady(true);
    }, 900);
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (selectedReport === 'risk') {
      csvContent += 'Supplier Name,Category,Risk Score,Risk Level,Spend,Financial Risk\n';
      suppliers.forEach(s => {
        csvContent += `"${s.name}","${s.category}",${s.riskScore},${s.riskLevel},${s.spend},${s.financialRiskScore}\n`;
      });
    } else {
      csvContent += 'Month,Direct Materials,Logistics,Electronics,MRO,Packaging,Total Spend,Savings Opportunity\n';
      spendData.forEach(d => {
        csvContent += `"${d.month}",${d.directMaterials},${d.logistics},${d.electronics},${d.mro},${d.packaging},${d.totalSpend},${d.savingsOpportunity}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ProcureAI_${selectedReport}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    alert(`Downloading ProcureAI ${selectedReport.toUpperCase()} Report (PDF Format)...`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-indigo-400" />
            Executive Reports & Export Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate enterprise audit reports, export CSV data & export PDF summaries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Grid: Report Selector & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Report Templates Selection */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white mb-2">Select Report Template:</h3>
          <div className="space-y-2">
            {reportTypes.map(r => {
              const isSelected = r.id === selectedReport;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80'
                  }`}
                >
                  <h4 className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {r.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{r.desc}</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleGenerate}
            className="w-full mt-4 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-cyan-400" />}
            <span>Generate Selected Report</span>
          </button>
        </div>

        {/* Live Report Preview Window */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 lg:col-span-2">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block">Report Document Preview</span>
              <h3 className="text-lg font-bold text-white mt-1">
                {reportTypes.find(r => r.id === selectedReport)?.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Dataset
            </div>
          </div>

          {/* Report Body */}
          {isGenerating ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Compiling report parameters & verifying figures...</p>
            </div>
          ) : (
            <div className="space-y-6 text-xs text-slate-300">
              
              {/* Document Summary Header */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Generated On</span>
                  <span className="font-semibold text-slate-200">2026-08-17</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Scope</span>
                  <span className="font-semibold text-slate-200">Global Enterprise</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Total Spend</span>
                  <span className="font-extrabold text-cyan-300">$1.24M</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Active Suppliers</span>
                  <span className="font-semibold text-slate-200">128 Vendors</span>
                </div>
              </div>

              {/* Report Sample Content Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-200 text-sm">Key Analytical Data Table</h4>
                <div className="border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Period / Entity</th>
                        <th className="p-3">Primary Category</th>
                        <th className="p-3">Amount / Metric</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr>
                        <td className="p-3 font-semibold text-slate-100">Direct Materials</td>
                        <td className="p-3 text-slate-400">Raw Metals & Alloys</td>
                        <td className="p-3 font-bold text-cyan-300">$670,000</td>
                        <td className="p-3 text-right text-emerald-400 font-semibold">Active</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-100">Electronic Components</td>
                        <td className="p-3 text-slate-400">Sensors & Microcontrollers</td>
                        <td className="p-3 font-bold text-cyan-300">$315,000</td>
                        <td className="p-3 text-right text-amber-400 font-semibold">Price Spike Alert</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-100">Logistics & Freight</td>
                        <td className="p-3 text-slate-400">4PL Global Logistics</td>
                        <td className="p-3 font-bold text-cyan-300">$182,000</td>
                        <td className="p-3 text-right text-emerald-400 font-semibold">Compliant</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-200">
                <p className="font-semibold mb-1">Executive Conclusion:</p>
                <p className="text-[11px] leading-relaxed text-cyan-200/80">
                  Procurement operations remain within target budget bounds with a 94% quality SLA compliance. Implementation of the recommended supplier consolidation plan is projected to recover $184K in direct margin over the next 12 months.
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
