import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Bell,
  Sun,
  Moon,
  DollarSign,
  User as UserIcon,
  Zap,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

interface NavbarProps {
  onOpenNaturalLanguage: () => void;
  onOpenAddTransaction: () => void;
  onToggleNotifications: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigateToSettings: () => void;
  onNavigateToAiChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNaturalLanguage,
  onOpenAddTransaction,
  onToggleNotifications,
  darkMode,
  onToggleDarkMode,
  onNavigateToSettings,
  onNavigateToAiChat,
}) => {
  const { user, currencySymbol, setCurrency, notifications } = useExpense();
  const unreadAlerts = notifications.filter((n) => !n.isRead).length;

  const currencies = [
    { code: 'INR', symbol: '₹', label: 'INR (₹)' },
    { code: 'USD', symbol: '$', label: 'USD ($)' },
    { code: 'EUR', symbol: '€', label: 'EUR (€)' },
    { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/60 dark:border-white/10 bg-white/50 dark:bg-slate-900/60 backdrop-blur-xl transition-colors shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-cyan-500 to-indigo-500 flex items-center justify-center text-white shadow-[0_0_18px_rgba(56,189,248,0.45)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                AI Smart Expense
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 border border-sky-400/30 text-sky-700 dark:text-sky-300">
                PRO AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal hidden sm:block">
              Intelligent Personal Financial Assistant
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Natural Language AI Entry */}
          <button
            id="btn-nlp-header"
            onClick={onOpenNaturalLanguage}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-400/30 dark:border-sky-400/30 text-xs font-semibold backdrop-blur-md shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
            <span className="hidden sm:inline">Ask AI Entry</span>
          </button>

          {/* Quick Add Manual Transaction */}
          <button
            id="btn-add-tx-header"
            onClick={onOpenAddTransaction}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>

          {/* Currency Switcher */}
          <div className="relative">
            <select
              value={user.currency}
              onChange={(e) => {
                const sel = currencies.find((c) => c.code === e.target.value);
                if (sel) setCurrency(sel.code, sel.symbol);
              }}
              className="appearance-none pl-2.5 pr-6 py-1.5 rounded-xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-800/60 backdrop-blur-md text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
              ▼
            </span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-white/30 dark:bg-slate-800/50 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Bell */}
          <button
            id="btn-notification-bell"
            onClick={onToggleNotifications}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-white/30 dark:bg-slate-800/50 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                {unreadAlerts > 9 ? '9+' : unreadAlerts}
              </span>
            )}
          </button>

          {/* User Avatar Button */}
          <button
            onClick={onNavigateToSettings}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-white/30 dark:bg-slate-800/50 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 text-white text-xs font-semibold flex items-center justify-center shadow-xs">
              {user.name.charAt(0)}
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 hidden md:inline max-w-[90px] truncate">
              {user.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
