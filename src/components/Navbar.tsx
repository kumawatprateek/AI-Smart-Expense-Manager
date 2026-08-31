import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Bell,
  Sun,
  Moon,
  Laptop,
  LogIn,
  LogOut,
  ChevronDown,
  Settings,
  Coins,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

export type ThemeMode = 'light' | 'dark' | 'system';

interface NavbarProps {
  onOpenNaturalLanguage: () => void;
  onOpenAddTransaction: () => void;
  onToggleNotifications: () => void;
  themeMode: ThemeMode;
  onSetThemeMode: (mode: ThemeMode) => void;
  onNavigateToSettings: () => void;
  onNavigateToAiChat: () => void;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNaturalLanguage,
  onOpenAddTransaction,
  onToggleNotifications,
  themeMode,
  onSetThemeMode,
  onNavigateToSettings,
  onOpenAuthModal,
  onLogout,
}) => {
  const { user, setCurrency, notifications, logoutUser } = useExpense();
  const unreadAlerts = notifications.filter((n) => !n.isRead).length;

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const currencies = [
    { code: 'INR', symbol: '₹', label: 'INR (₹)' },
    { code: 'USD', symbol: '$', label: 'USD ($)' },
    { code: 'EUR', symbol: '€', label: 'EUR (€)' },
    { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070d1e] transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer shrink-0 min-w-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#002970] text-[#00BAF2] border border-[#00BAF2]/30 flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#00BAF2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-extrabold text-[#002970] dark:text-white text-sm sm:text-lg tracking-tight truncate">
                Expense<span className="text-[#00BAF2]">AI</span>
              </span>
              <span className="px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-black bg-[#00BAF2]/15 text-[#007b9e] dark:text-[#00BAF2] border border-[#00BAF2]/20 shrink-0">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden md:block leading-none">
              Smart Ledger & Intelligence
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Natural Language AI Entry - Tablet & Desktop */}
          <button
            id="btn-nlp-header"
            onClick={onOpenNaturalLanguage}
            title="Ask AI to record an expense via speech or text"
            className="hidden md:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#00BAF2]/10 hover:bg-[#00BAF2]/20 text-[#002970] dark:text-[#00BAF2] border border-[#00BAF2]/30 text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>AI Entry</span>
          </button>

          {/* Quick Add Manual Transaction - Tablet & Desktop */}
          <button
            id="btn-add-tx-header"
            onClick={onOpenAddTransaction}
            title="Add a manual transaction"
            className="hidden sm:flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-[#002970] dark:bg-[#00BAF2] text-white dark:text-[#001A4D] font-bold text-xs shadow-xs hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add</span>
          </button>

          {/* Currency Switcher - Desktop only */}
          <div className="relative hidden lg:block">
            <select
              value={user.currency}
              onChange={(e) => {
                const sel = currencies.find((c) => c.code === e.target.value);
                if (sel) setCurrency(sel.code, sel.symbol);
              }}
              className="appearance-none pl-2.5 pr-6 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold focus:outline-none cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-400">
              ▼
            </span>
          </div>

          {/* 3-Way Theme Switcher (Light / Dark / System) */}
          <div className="relative">
            <button
              onClick={() => {
                setIsThemeMenuOpen(!isThemeMenuOpen);
                setIsUserMenuOpen(false);
              }}
              title={`Theme: ${themeMode.toUpperCase()} (Click to change)`}
              className="flex items-center gap-1 p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              {themeMode === 'light' && <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />}
              {themeMode === 'dark' && <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00BAF2]" />}
              {themeMode === 'system' && <Laptop className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-300" />}
              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400" />
            </button>

            {isThemeMenuOpen && (
              <div
                className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-700 shadow-lg py-1 z-50 animate-fadeIn text-xs"
                onClick={() => setIsThemeMenuOpen(false)}
              >
                <button
                  onClick={() => onSetThemeMode('light')}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    themeMode === 'light'
                      ? 'text-[#002970] dark:text-[#00BAF2] font-bold bg-[#00BAF2]/10'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light Mode</span>
                </button>
                <button
                  onClick={() => onSetThemeMode('dark')}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    themeMode === 'dark'
                      ? 'text-[#002970] dark:text-[#00BAF2] font-bold bg-[#00BAF2]/10'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-[#00BAF2]" />
                  <span>Dark Mode</span>
                </button>
                <button
                  onClick={() => onSetThemeMode('system')}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    themeMode === 'system'
                      ? 'text-[#002970] dark:text-[#00BAF2] font-bold bg-[#00BAF2]/10'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5 text-slate-500" />
                  <span>System Default</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            id="btn-notification-bell"
            onClick={onToggleNotifications}
            title="Spending notifications and alerts"
            className="relative p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-500 text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadAlerts > 9 ? '9+' : unreadAlerts}
              </span>
            )}
          </button>

          {/* User Profile & Actions Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsThemeMenuOpen(false);
              }}
              title="User profile & options"
              className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#002970] text-[#00BAF2] text-xs font-bold flex items-center justify-center shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[80px] truncate leading-tight">
                  {user.name}
                </span>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                  Active
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-1.5 w-48 sm:w-56 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-700 shadow-xl py-1.5 z-50 animate-fadeIn text-xs"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>

                <button
                  onClick={onNavigateToSettings}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile & Settings</span>
                </button>

                {/* Mobile Currency Selection */}
                <div className="lg:hidden px-3 py-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                    <Coins className="w-3 h-3" /> Currency
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCurrency(c.code, c.symbol)}
                        className={`px-2 py-1 rounded text-[11px] font-bold transition-all text-center ${
                          user.currency === c.code
                            ? 'bg-[#00BAF2] text-[#001A4D]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {c.symbol} {c.code}
                      </button>
                    ))}
                  </div>
                </div>

                {onOpenAuthModal && (
                  <button
                    onClick={onOpenAuthModal}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors border-t border-slate-100 dark:border-slate-800 mt-1"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#00BAF2]" />
                    <span>Switch / Login Account</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    else logoutUser();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


