import React, { useState } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Search, Bell, Sparkles, User as UserIcon, LogOut, ChevronDown, Cpu } from 'lucide-react';
import { NotificationDrawer } from '../notifications/NotificationDrawer';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ sidebarCollapsed }) => {
  const {
    user,
    notifications,
    setIsSearchOpen,
    setActivePage,
    logout
  } = useProcurement();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <header
        className={`fixed top-0 right-0 z-30 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300 flex items-center justify-between px-6 ${
          sidebarCollapsed ? 'left-20' : 'left-64'
        }`}
      >
        {/* Left: Global Search trigger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-slate-200 transition-all text-xs w-72 shadow-inner group"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="flex-1 text-left">Search suppliers, RFQs, inventory...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Quick AI Assistant Chip */}
          <button
            onClick={() => setActivePage('assistant')}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium hover:bg-cyan-500/20 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI Assistant</span>
          </button>
        </div>

        {/* Right: Quick Stats, Notifications & User */}
        <div className="flex items-center gap-4">
          {/* Real-time system pulse */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Risk Engine Active</span>
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-rose-500/50 animate-pulse">
                {unreadNotifs}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover ring-2 ring-blue-500/30"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</p>
                <p className="text-[10px] text-cyan-400">{user.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-panel border border-slate-800 rounded-xl shadow-2xl py-2 text-xs z-50 animate-in fade-in duration-150">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="font-semibold text-slate-200">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  <p className="text-[10px] text-cyan-400 mt-0.5">{user.organization}</p>
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setActivePage('settings');
                  }}
                  className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-blue-400" />
                  <span>User Profile & Settings</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors border-t border-slate-800/60 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
