import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import {
  LayoutDashboard,
  Building2,
  FileText,
  GitCompare,
  ShoppingBag,
  Boxes,
  BarChart3,
  Sparkles,
  ShieldAlert,
  TrendingUp,
  Bot,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { activePage, setActivePage, rfqs, notifications } = useProcurement();

  const openRFQsCount = rfqs.filter(r => r.status === 'OPEN' || r.status === 'IN_EVALUATION').length;
  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const procurementItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'suppliers', label: 'Suppliers', icon: Building2 },
    { id: 'rfqs', label: 'RFQs', icon: FileText, badge: openRFQsCount > 0 ? `${openRFQsCount}` : undefined },
    { id: 'quotations', label: 'Quotations', icon: GitCompare },
    { id: 'orders', label: 'Purchase Orders', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'spend', label: 'Spend Analytics', icon: BarChart3 }
  ];

  const intelligenceItems: NavItem[] = [
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles },
    { id: 'risk', label: 'Supplier Risk', icon: ShieldAlert, badge: 'Alerts', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
    { id: 'forecast', label: 'Price Forecast', icon: TrendingUp },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'Live', badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' }
  ];

  const managementItems: NavItem[] = [
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderNavSection = (title: string, items: typeof procurementItems) => (
    <div className="mb-6">
      {!collapsed && (
        <h4 className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
          {title}
        </h4>
      )}
      <div className="space-y-1">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-lg shadow-cyan-400/50" />
              )}
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              
              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${item.badgeColor || 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-slate-950/90 backdrop-blur-xl border-r border-slate-800/80 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-1.5">
                Procure<span className="text-cyan-400">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                Predict. Optimize. Procure Smarter.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {renderNavSection('Procurement', procurementItems)}
        {renderNavSection('Intelligence', intelligenceItems)}
        {renderNavSection('Management', managementItems)}
      </div>

      {/* Footer Profile Mini Card */}
     
    </aside>
  );
};
