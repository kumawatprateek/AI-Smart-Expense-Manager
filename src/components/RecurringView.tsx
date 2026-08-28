import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, CheckCircle2, RefreshCw, Clock, ArrowRight, X, AlertCircle } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { RecurringTransaction, FrequencyType } from '../types';

export const RecurringView: React.FC = () => {
  const { recurring, categories, addRecurring, updateRecurring, deleteRecurring, markRecurringPaid, skipRecurring, formatCurrency, currencySymbol } = useExpense();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecurringTransaction | null>(null);

  // Form states
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [amount, setAmount] = useState<number | ''>('');
  const [note, setNote] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('Monthly');
  const [nextDueDate, setNextDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [autoRecord, setAutoRecord] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setCategoryId(categories.find((c) => c.type === 'Expense')?.id || categories[0]?.id || '');
    setAmount('');
    setNote('');
    setFrequency('Monthly');
    setNextDueDate(new Date().toISOString().split('T')[0]);
    setAutoRecord(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: RecurringTransaction) => {
    setEditingItem(item);
    setCategoryId(item.categoryId);
    setAmount(item.amount);
    setNote(item.note);
    setFrequency(item.frequency);
    setNextDueDate(item.nextDueDate);
    setAutoRecord(item.autoRecord);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || typeof amount !== 'number' || amount <= 0 || !note.trim()) return;

    if (editingItem) {
      updateRecurring(editingItem.id, {
        categoryId,
        amount,
        note: note.trim(),
        frequency,
        nextDueDate,
        autoRecord,
      });
    } else {
      addRecurring({
        categoryId,
        amount,
        note: note.trim(),
        frequency,
        nextDueDate,
        autoRecord,
        isActive: true,
      });
    }

    setIsModalOpen(false);
  };

  const totalMonthlyCommitment = recurring
    .filter((r) => r.isActive)
    .reduce((sum, r) => {
      if (r.frequency === 'Monthly') return sum + r.amount;
      if (r.frequency === 'Weekly') return sum + r.amount * 4;
      if (r.frequency === 'Daily') return sum + r.amount * 30;
      if (r.frequency === 'Yearly') return sum + r.amount / 12;
      return sum + r.amount;
    }, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Recurring Payments & Subscriptions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track fixed expenses, rent, EMI, utilities, and upcoming bill reminders
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Recurring Bill</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monthly Committed Bills</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalMonthlyCommitment)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{recurring.filter((r) => r.isActive).length} active subscriptions</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Due Next 7 Days</span>
          <div className="text-xl font-bold text-sky-500 mt-1">
            {formatCurrency(
              recurring
                .filter((r) => {
                  const due = new Date(r.nextDueDate).getTime();
                  const now = new Date().getTime();
                  const diffDays = (due - now) / (1000 * 3600 * 24);
                  return diffDays >= -1 && diffDays <= 7;
                })
                .reduce((s, r) => s + r.amount, 0)
            )}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Upcoming prompt required</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Smart Auto-Record</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {recurring.filter((r) => r.autoRecord && r.isActive).length} Auto-Logged
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Automated financial ledger</span>
        </div>
      </div>

      {/* List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recurring.map((item) => {
          const cat = categories.find((c) => c.id === item.categoryId);

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border transition-all ${
                item.isActive
                  ? 'border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-sky-400/40'
                  : 'border-dashed border-white/20 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${cat?.color || '#38bdf8'}20`, color: cat?.color || '#38bdf8' }}
                  >
                    {cat?.icon || '🔁'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.note}</h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                        {item.frequency}
                      </span>
                      • {cat?.title || 'General'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteRecurring(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">Next Due Date</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    {item.nextDueDate}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">Bill Amount</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-base">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => markRecurringPaid(item.id)}
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(74,222,128,0.3)] transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark as Paid
                </button>
                <button
                  type="button"
                  onClick={() => skipRecurring(item.id)}
                  className="px-3 py-2 rounded-xl border border-white/15 text-slate-300 text-xs font-medium hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Skip
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900/85 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-6 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">
                {editingItem ? 'Edit Recurring Payment' : 'Create Recurring Schedule'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Bill Title / Note *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix, Gym Membership, House Rent"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Amount ({currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    {categories
                      .filter((c) => c.type === 'Expense')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as FrequencyType)}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Next Due Date</label>
                  <input
                    type="date"
                    required
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRecord}
                  onChange={(e) => setAutoRecord(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-sky-400"
                />
                <span className="text-slate-300 font-medium">
                  Auto-record to ledger when due
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-white/15 text-slate-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.3)] cursor-pointer"
                >
                  {editingItem ? 'Save Schedule' : 'Create Recurring'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
