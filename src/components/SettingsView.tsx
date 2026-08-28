import React, { useState } from 'react';
import { User, DollarSign, Target, RotateCcw, Trash2, Download, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

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
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          User Settings & Financial Targets
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your personal profile, baseline targets, currency preference, and ledger data
        </p>
      </div>

      {/* Profile Form Card */}
      <div className="p-6 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Personal Profile</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your profile details and financial objectives</p>
            </div>
          </div>
          {isSaved && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> Changes saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Monthly Target Income ({currencySymbol})
              </label>
              <input
                type="number"
                step="any"
                value={monthlyIncomeTarget}
                onChange={(e) => setMonthlyIncomeTarget(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-slate-900 dark:text-white font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Target Savings Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={savingsRateTarget}
                onChange={(e) => setSavingsRateTarget(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-slate-900 dark:text-white font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
            >
              Save Profile Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Currency Selection Card */}
      <div className="p-6 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Currency Preference</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">All ledger amounts and reports format in this currency</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {currencies.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCurrency(c.code, c.symbol)}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                user.currency === c.code
                  ? 'border-sky-400 bg-sky-500/15 text-sky-400 font-bold shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                  : 'border-white/10 hover:border-white/20 bg-white/5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="text-lg font-black">{c.symbol}</div>
              <div className="text-xs mt-0.5">{c.code}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="p-6 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Data Backup & Recovery</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Export your complete financial records or restore default sample data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Download JSON Backup</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all categories, transactions and budgets to default sample data?')) {
                resetToDefaultData();
              }
            }}
            className="p-3.5 rounded-xl border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Reset Demo Seed Data</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all transactions and budgets? This cannot be undone.')) {
                clearAllData();
              }
            }}
            className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Clear All Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
