import React, { useState } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle, AlertOctagon, CheckCircle2, DollarSign, X } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { Budget } from '../types';

export const BudgetsView: React.FC = () => {
  const { budgets, categories, addBudget, updateBudget, deleteBudget, financialSummary, formatCurrency, currencySymbol } = useExpense();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [monthYear, setMonthYear] = useState(new Date().toISOString().substring(0, 7));

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpentInBudgetedCats = budgets.reduce((sum, b) => {
    const cat = categories.find((c) => c.id === b.categoryId);
    const catTitle = cat?.title || '';
    return sum + (financialSummary.categoryExpenses[catTitle] || 0);
  }, 0);

  const handleOpenAdd = () => {
    setEditingBudget(null);
    const availableExpenseCats = categories.filter((c) => c.type === 'Expense' && !budgets.some((b) => b.categoryId === c.id));
    setCategoryId(availableExpenseCats.length > 0 ? availableExpenseCats[0].id : categories[0]?.id || '');
    setAmount('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setCategoryId(budget.categoryId);
    setAmount(budget.amount);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || typeof amount !== 'number' || amount <= 0 || !categoryId) return;

    if (editingBudget) {
      updateBudget(editingBudget.id, {
        categoryId,
        amount,
        monthYear,
      });
    } else {
      addBudget({
        categoryId,
        amount,
        monthYear,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Category Budgets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set monthly limits per category and receive automated threshold alerts
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Set Category Budget</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Monthly Budget</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalBudgeted)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{budgets.length} active category budgets</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Spent in Budgets</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalSpentInBudgetedCats)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {totalBudgeted > 0 ? `${Math.round((totalSpentInBudgetedCats / totalBudgeted) * 100)}% overall utilization` : '0%'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Remaining Cushion</span>
          <div
            className={`text-xl font-bold mt-1 ${
              totalBudgeted - totalSpentInBudgetedCats >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
            }`}
          >
            {formatCurrency(totalBudgeted - totalSpentInBudgetedCats)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Until monthly reset</span>
        </div>
      </div>

      {/* Budgets List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((b) => {
          const cat = categories.find((c) => c.id === b.categoryId);
          const catTitle = cat?.title || 'Category';
          const spent = financialSummary.categoryExpenses[catTitle] || 0;
          const pct = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
          const isOver = pct > 100;
          const isWarning = pct >= 80 && pct <= 100;
          const remaining = b.amount - spent;

          return (
            <div
              key={b.id}
              className={`p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border transition-all dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] ${
                isOver
                  ? 'border-rose-500/50 bg-rose-500/5'
                  : isWarning
                  ? 'border-amber-500/50 bg-amber-500/5'
                  : 'border-white/60 dark:border-white/10 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl backdrop-blur-md"
                    style={{ backgroundColor: `${cat?.color || '#38bdf8'}25`, color: cat?.color || '#38bdf8' }}
                  >
                    {cat?.icon || '📁'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{catTitle}</h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Limit: {formatCurrency(b.amount)} / month
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-white/10 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteBudget(b.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={isOver ? 'text-rose-500 dark:text-rose-400' : isWarning ? 'text-amber-500 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}>
                    Spent: {formatCurrency(spent)} ({pct}%)
                  </span>
                  <span className={remaining < 0 ? 'text-rose-500 dark:text-rose-400 font-bold' : 'text-slate-500 dark:text-slate-400'}>
                    {remaining < 0 ? `Over by ${formatCurrency(Math.abs(remaining))}` : `Remaining: ${formatCurrency(remaining)}`}
                  </span>
                </div>

                <div className="w-full bg-white/20 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-sky-400'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>

              {/* Status Note */}
              <div className="mt-3 pt-3 border-t border-white/10 dark:border-white/10 flex items-center justify-between text-xs">
                {isOver ? (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5" /> Budget exceeded! Consider reducing spending.
                  </span>
                ) : isWarning ? (
                  <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> 80%+ consumed. Caution advised.
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Within healthy threshold.
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Set / Edit Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-6 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">
                {editingBudget ? 'Update Budget Limit' : 'Set Category Monthly Budget'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Category *</label>
                <select
                  disabled={!!editingBudget}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  {categories
                    .filter((c) => c.type === 'Expense')
                    .map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.icon} {c.title}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  Monthly Spending Limit ({currencySymbol}) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-white/15 text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                >
                  {editingBudget ? 'Update Budget' : 'Save Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
