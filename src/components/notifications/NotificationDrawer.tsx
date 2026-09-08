import React from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Bell, X, ShieldAlert, FileText, TrendingUp, Boxes, DollarSign, Check } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, setActivePage } = useProcurement();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'RISK':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'QUOTE':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'PRICE':
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
      case 'INVENTORY':
        return <Boxes className="w-4 h-4 text-indigo-400" />;
      case 'SAVINGS':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleNotificationClick = (targetPage?: string, targetId?: string, notifId?: string) => {
    if (notifId) markNotificationAsRead(notifId);
    if (targetPage) {
      onClose();
      if (targetPage === 'risk') setActivePage('risk', { supplierId: targetId });
      else if (targetPage === 'quotations') setActivePage('quotations', { rfqId: targetId });
      else if (targetPage === 'forecast') setActivePage('forecast', { material: targetId });
      else if (targetPage === 'inventory') setActivePage('inventory');
      else if (targetPage === 'recommendations') setActivePage('recommendations');
      else setActivePage(targetPage);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Notifications</h3>
                <p className="text-xs text-slate-400">
                  {unreadCount > 0 ? `${unreadCount} unread intelligence alerts` : 'All alerts read'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar */}
          {unreadCount > 0 && (
            <div className="px-5 py-2.5 bg-slate-950/30 border-b border-slate-800/60 flex justify-end">
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all as read
              </button>
            </div>
          )}

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No notifications available.
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n.targetPage, n.targetId, n.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                    n.isRead
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-70 hover:opacity-100 hover:bg-slate-800/50'
                      : 'bg-slate-900 border-cyan-500/30 shadow-lg shadow-cyan-500/5 hover:border-cyan-500/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-2">
                        {n.description}
                      </p>
                      {n.targetPage && (
                        <span className="text-[10px] font-medium text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          View details &rarr;
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
