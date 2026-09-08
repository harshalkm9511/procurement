import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import type { RFQ } from '../../types/procurement';
import { FileText, Plus, Search, Calendar, DollarSign, Users, ChevronRight, X, Sparkles, CheckCircle2 } from 'lucide-react';

export const RFQsView: React.FC = () => {
  const { rfqs, suppliers, createRFQ, setActivePage, setSelectedRFQId } = useProcurement();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [product, setProduct] = useState('');
  const [category, setCategory] = useState('Raw Materials & Metals');
  const [quantity, setQuantity] = useState(5000);
  const [unit, setUnit] = useState('units');
  const [targetPrice, setTargetPrice] = useState(100);
  const [deadline, setDeadline] = useState('2026-09-15');
  const [deliveryDate, setDeliveryDate] = useState('2026-10-01');
  const [description, setDescription] = useState('');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>(['sup-001', 'sup-004']);

  const filteredRFQs = rfqs.filter(r =>
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    createRFQ({
      title: product,
      product,
      category,
      quantity,
      unit,
      targetPrice,
      deadline,
      invitedSuppliersCount: selectedSuppliers.length,
      deliveryDate,
      description,
      invitedSupplierIds: selectedSuppliers
    });

    setIsModalOpen(false);
    // Reset form
    setProduct('');
    setDescription('');
  };

  const toggleSupplierSelect = (id: string) => {
    setSelectedSuppliers(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">OPEN</span>;
      case 'IN_EVALUATION':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">EVALUATING</span>;
      case 'AWARDED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">AWARDED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">CLOSED</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-indigo-400" />
            Request for Quotation (RFQ) Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch strategic RFQs, track vendor quote submissions & initiate automated AI evaluations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Create New RFQ</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search RFQs by ID, product, or category..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* RFQ Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">RFQ ID</th>
                <th className="p-4">Product / Item</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Target Price</th>
                <th className="p-4">Deadline</th>
                <th className="p-4">Invited</th>
                <th className="p-4">Responses</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRFQs.map(r => (
                <tr
                  key={r.id}
                  onClick={() => {
                    setSelectedRFQId(r.id);
                    setActivePage('quotations', { rfqId: r.id });
                  }}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="p-4 font-mono font-bold text-cyan-300">{r.id}</td>
                  <td className="p-4 font-semibold text-slate-100">
                    <span className="block truncate max-w-[200px]">{r.product}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{r.category}</span>
                  </td>
                  <td className="p-4 font-medium text-slate-200">{r.quantity.toLocaleString()} {r.unit}</td>
                  <td className="p-4 font-bold text-slate-100">${r.targetPrice}</td>
                  <td className="p-4 text-slate-400">{r.deadline}</td>
                  <td className="p-4 font-medium text-slate-300">{r.invitedSuppliersCount} vendors</td>
                  <td className="p-4 font-semibold text-cyan-400">{r.responseCount} quotes</td>
                  <td className="p-4">{getStatusBadge(r.status)}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRFQId(r.id);
                        setActivePage('quotations', { rfqId: r.id });
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold transition-colors flex items-center gap-1 ml-auto"
                    >
                      Compare Quotes <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create RFQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl glass-panel border border-slate-700/80 rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyan-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create New RFQ</h3>
                  <p className="text-xs text-slate-400">Dispatch quotation request to approved vendors</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name / Title</label>
                <input
                  type="text"
                  required
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  placeholder="e.g. Industrial Steel Components (316L)"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Raw Materials & Metals">Raw Materials & Metals</option>
                    <option value="Electronic Components">Electronic Components</option>
                    <option value="Hydraulics & Pumps">Hydraulics & Pumps</option>
                    <option value="Precision Machining">Precision Machining</option>
                    <option value="Packaging & Logistics">Packaging & Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity & Unit</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={quantity}
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="w-2/3 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                      className="w-1/3 px-2 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Price ($)</label>
                  <input
                    type="number"
                    required
                    value={targetPrice}
                    onChange={e => setTargetPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bidding Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Required Delivery</label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Specifications & Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide technical specs, tolerances, ISO certifications required..."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Supplier Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Vendors to Invite ({selectedSuppliers.length} selected)
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-slate-900 border border-slate-800 rounded-xl">
                  {suppliers.map(s => {
                    const isSelected = selectedSuppliers.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleSupplierSelect(s.id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                          isSelected ? 'bg-blue-950/60 border border-blue-500/40 text-cyan-200' : 'hover:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="font-medium">{s.name} ({s.category})</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20"
                >
                  Dispatch RFQ
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
