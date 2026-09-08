import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { ShoppingBag, Search, CheckCircle2, Clock, Truck, XCircle, Plus, FileText } from 'lucide-react';

export const PurchaseOrdersView: React.FC = () => {
  const { purchaseOrders, setActivePage } = useProcurement();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = purchaseOrders.filter(po =>
    po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1 w-max"><Truck className="w-3 h-3" /> IN TRANSIT</span>;
      case 'FULFILLED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3" /> FULFILLED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-max"><XCircle className="w-3 h-3" /> CANCELLED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> ISSUED</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-cyan-400" />
            Purchase Orders (POs) Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track active purchase order fulfillments, shipment logistics & invoice approvals.
          </p>
        </div>

        <button
          onClick={() => setActivePage('quotations')}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Award PO from RFQ</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search POs by ID, supplier, or product..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* PO Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">PO Number</th>
                <th className="p-4">Vendor / Supplier</th>
                <th className="p-4">Product</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Issue Date</th>
                <th className="p-4">Est. Delivery</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map(po => (
                <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-cyan-300">{po.id}</td>
                  <td className="p-4 font-semibold text-slate-100">{po.supplierName}</td>
                  <td className="p-4 font-medium text-slate-200">{po.product}</td>
                  <td className="p-4 text-slate-300">{po.quantity.toLocaleString()} {po.unit}</td>
                  <td className="p-4 font-extrabold text-cyan-300">${po.totalAmount.toLocaleString()}</td>
                  <td className="p-4 text-slate-400">{po.issueDate}</td>
                  <td className="p-4 font-medium text-slate-200">{po.expectedDeliveryDate}</td>
                  <td className="p-4">{getStatusBadge(po.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
