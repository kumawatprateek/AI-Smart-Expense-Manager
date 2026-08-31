import React, { useState, useEffect } from 'react';
import {
  User,
  DollarSign,
  RotateCcw,
  Trash2,
  Download,
  Check,
  ShieldCheck,
  Sun,
  Moon,
  Laptop,
  Palette,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { ThemeMode } from './Navbar';

export const SettingsView: React.FC = () => {
  const {
    user,
    setUser,
    currencySymbol,
    setCurrency,
    resetToDefaultData,
    clearAllData,
    transactions,
    categories,
    budgets,
    goals,
    recurring,
  } = useExpense();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [monthlyIncomeTarget, setMonthlyIncomeTarget] = useState<number | ''>(user.monthlyIncomeTarget || 45000);
  const [savingsRateTarget, setSavingsRateTarget] = useState<number | ''>(user.savingsRateTarget || 40);
  const [isSaved, setIsSaved] = useState(false);

  // Theme Mode
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('app_theme_mode') as ThemeMode) || 'system';
  });

  const handleChangeTheme = (mode: ThemeMode) => {
    setCurrentTheme(mode);
    localStorage.setItem('app_theme_mode', mode);

    let isDark = false;
    if (mode === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = mode === 'dark';
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const currencies = [
    { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
    { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
    { code: 'EUR', symbol: '€', label: 'Euro (€)' },
    { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      email,
      monthlyIncomeTarget: Number(monthlyIncomeTarget) || 45000,
      savingsRateTarget: Number(savingsRateTarget) || 40,
    }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Full data backup export
  const handleExportJSON = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      user,
      categories,
      transactions,
      budgets,
      goals,
      recurring,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `ai_expense_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-[#002970] dark:text-white tracking-tight">
          User Settings & Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your personal profile, theme mode, financial targets, and ledger records
        </p>
      </div>

      {/* Theme Selection Card (Light, Dark, Default) */}
      <div className="p-4 sm:p-6 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#00BAF2]/15 text-[#008db8] dark:text-[#00BAF2] flex items-center justify-center font-bold">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
              App Appearance & Theme Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your preferred appearance mode or match your device system settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => handleChangeTheme('light')}
            className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
              currentTheme === 'light'
                ? 'border-[#00BAF2] bg-[#00BAF2]/10 text-[#002970] dark:text-white font-extrabold shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold">Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => handleChangeTheme('dark')}
            className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
              currentTheme === 'dark'
                ? 'border-[#00BAF2] bg-[#00BAF2]/10 text-[#002970] dark:text-white font-extrabold shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Moon className="w-5 h-5 text-[#00BAF2]" />
            <span className="text-xs font-bold">Dark Mode</span>
          </button>

          <button
            type="button"
            onClick={() => handleChangeTheme('system')}
            className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
              currentTheme === 'system'
                ? 'border-[#00BAF2] bg-[#00BAF2]/10 text-[#002970] dark:text-white font-extrabold shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Laptop className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <span className="text-xs font-bold">System Default</span>
          </button>
        </div>
      </div>

      {/* Profile Form Card */}
      <div className="p-4 sm:p-6 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#002970]/10 dark:bg-[#00BAF2]/15 text-[#002970] dark:text-[#00BAF2] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Personal Profile</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Account identity and financial objectives</p>
            </div>
          </div>
          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00BAF2]"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00BAF2]"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Monthly Target Income ({currencySymbol})
              </label>
              <input
                type="number"
                step="any"
                value={monthlyIncomeTarget}
                onChange={(e) => setMonthlyIncomeTarget(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#00BAF2]"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Target Savings Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={savingsRateTarget}
                onChange={(e) => setSavingsRateTarget(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#00BAF2]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#002970] dark:bg-[#00BAF2] text-white dark:text-[#001A4D] font-black shadow-xs hover:opacity-95 transition-all cursor-pointer text-xs"
            >
              Save Profile Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Currency Selection Card */}
      <div className="p-4 sm:p-6 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Currency Preference</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">All ledger amounts and reports format in this currency</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          {currencies.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCurrency(c.code, c.symbol)}
              className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                user.currency === c.code
                  ? 'border-[#00BAF2] bg-[#00BAF2]/10 text-[#002970] dark:text-[#00BAF2] font-black shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="text-lg font-black">{c.symbol}</div>
              <div className="text-xs mt-0.5">{c.code}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="p-4 sm:p-6 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Data Backup & Recovery</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Export your complete financial records or restore default sample data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#00BAF2]" />
            <span>Download JSON Backup</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all categories, transactions and budgets to default sample data?')) {
                resetToDefaultData();
              }
            }}
            className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-500" />
            <span>Reset Demo Seed Data</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all transactions and budgets? This cannot be undone.')) {
                clearAllData();
              }
            }}
            className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Clear All Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
