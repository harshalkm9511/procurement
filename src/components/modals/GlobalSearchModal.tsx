import React, { useState, useEffect } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Search, Building2, FileText, ShoppingBag, Sparkles, X, ChevronRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    suppliers,
    rfqs,
    inventory,
    recommendations,
    setActivePage
  } = useProcurement();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filterQuery = query.toLowerCase().trim();

  const matchedSuppliers = filterQuery
    ? suppliers.filter(
        s => s.name.toLowerCase().includes(filterQuery) || s.category.toLowerCase().includes(filterQuery)
      ).slice(0, 4)
    : suppliers.slice(0, 3);

  const matchedRFQs = filterQuery
    ? rfqs.filter(
        r => r.id.toLowerCase().includes(filterQuery) || r.product.toLowerCase().includes(filterQuery)
      ).slice(0, 4)
    : rfqs.slice(0, 3);

  const matchedInventory = filterQuery
    ? inventory.filter(
        i => i.product.toLowerCase().includes(filterQuery) || i.sku.toLowerCase().includes(filterQuery)
      ).slice(0, 4)
    : inventory.slice(0, 3);

  const matchedRecs = filterQuery
    ? recommendations.filter(
        rec => rec.title.toLowerCase().includes(filterQuery) || rec.description.toLowerCase().includes(filterQuery)
      ).slice(0, 3)
    : recommendations.slice(0, 2);

  const handleSelect = (page: string, params?: { supplierId?: string; rfqId?: string }) => {
    setIsSearchOpen(false);
    setQuery('');
    setActivePage(page, params);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden glass-panel border border-slate-700/80 rounded-2xl shadow-2xl">
        
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900/90">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search suppliers, RFQs, inventory, recommendations... (Type 'steel', 'risk', 'RFQ-2026')"
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Suppliers */}
          {matchedSuppliers.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                Suppliers ({matchedSuppliers.length})
              </div>
              <div className="space-y-1.5">
                {matchedSuppliers.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect('suppliers', { supplierId: s.id })}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors text-left group"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-200 group-hover:text-cyan-300">
                        {s.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {s.category} • Risk Score: {s.riskScore}/100 ({s.riskLevel})
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RFQs */}
          {matchedRFQs.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                RFQs ({matchedRFQs.length})
              </div>
              <div className="space-y-1.5">
                {matchedRFQs.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect('rfqs', { rfqId: r.id })}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors text-left group"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-200 group-hover:text-cyan-300">
                        {r.id}: {r.product}
                      </div>
                      <div className="text-xs text-slate-400">
                        Target: ${r.targetPrice} • Status: {r.status} • Deadline: {r.deadline}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inventory */}
          {matchedInventory.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                Inventory Items
              </div>
              <div className="space-y-1.5">
                {matchedInventory.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect('inventory')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors text-left group"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-200 group-hover:text-cyan-300">
                        {item.product} ({item.sku})
                      </div>
                      <div className="text-xs text-slate-400">
                        Stock: {item.currentStock.toLocaleString()} {item.unit} • Daily Demand: {item.dailyDemand}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {matchedRecs.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                AI Recommendations
              </div>
              <div className="space-y-1.5">
                {matchedRecs.map(rec => (
                  <button
                    key={rec.id}
                    onClick={() => handleSelect('recommendations')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors text-left group"
                  >
                    <div>
                      <div className="text-sm font-medium text-cyan-200 group-hover:text-cyan-300 flex items-center gap-2">
                        {rec.title}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
                          {rec.confidencePercent}% AI Confidence
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1">
                        {rec.description}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between px-4">
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">ESC</kbd> to close</span>
          <span>ProcureAI Global Search Index</span>
        </div>

      </div>
    </div>
  );
};
