import React, { useState, useEffect } from 'react';
import { Plus, X, Sparkles, AlertTriangle, Check, Loader2, RefreshCw } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { TransactionType } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: TransactionType;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  initialType = 'Expense',
}) => {
  const { categories, addTransaction, detectUnusualExpense, currencySymbol } = useExpense();

  const [type, setType] = useState<TransactionType>(initialType);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // AI Auto-categorization states
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    category: string;
    type: TransactionType;
    confidence: number;
    reason?: string;
  } | null>(null);

  // Unusual expense preview
  const [anomalyWarning, setAnomalyWarning] = useState<{ isUnusual: boolean; reason?: string }>({ isUnusual: false });

  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  // Set default category on open or type change
  useEffect(() => {
    const available = categories.filter((c) => c.type === type && c.isActive);
    if (available.length > 0 && (!categoryId || !available.some((c) => c.id === categoryId))) {
      setCategoryId(available[0].id);
    }
  }, [type, categories]);

  // Check for unusual expense on amount change
  useEffect(() => {
    if (type === 'Expense' && amount && typeof amount === 'number' && categoryId) {
      const check = detectUnusualExpense(amount, categoryId);
      setAnomalyWarning(check);
    } else {
      setAnomalyWarning({ isUnusual: false });
    }
  }, [amount, categoryId, type, detectUnusualExpense]);

  if (!isOpen) return null;

  // Trigger AI auto-categorization when note has at least 3 characters
  const handleTriggerAiCategorize = async () => {
    if (!note.trim()) return;
    setIsAiSuggesting(true);

    try {
      const res = await fetch('/api/ai/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note,
          amount: amount || undefined,
          type,
          categories: categories.map((c) => ({ id: c.id, title: c.title })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiSuggestion(data);
      }
    } catch (e) {
      console.error('AI categorization error', e);
    } finally {
      setIsAiSuggesting(false);
    }
  };

  const applyAiSuggestion = () => {
    if (!aiSuggestion) return;
    if (aiSuggestion.type) setType(aiSuggestion.type);

    const matched = categories.find(
      (c) => c.title.toLowerCase() === aiSuggestion.category.toLowerCase()
    );
    if (matched) {
      setCategoryId(matched.id);
    }
    setAiSuggestion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || typeof amount !== 'number' || amount <= 0) return;
    if (!categoryId) return;

    addTransaction({
      categoryId,
      amount,
      note: note.trim() || (type === 'Income' ? 'General Income' : 'General Expense'),
      type,
      date,
    });

    // Reset form
    setAmount('');
    setNote('');
    setAiSuggestion(null);
    onClose();
  };

  const filteredCategories = categories.filter((c) => c.type === type && c.isActive);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="add-transaction-modal"
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 overflow-hidden text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-400/20 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-base">Add New Transaction</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
            <button
              type="button"
              onClick={() => setType('Expense')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                type === 'Expense'
                  ? 'bg-rose-500/90 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => setType('Income')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                type === 'Income'
                  ? 'bg-emerald-500/90 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Amount ({currencySymbol}) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                {currencySymbol}
              </span>
              <input
                id="input-transaction-amount"
                type="number"
                step="any"
                required
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white font-bold text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Note Input with AI Categorize Trigger */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">
                Note / Description
              </label>
              <button
                type="button"
                onClick={handleTriggerAiCategorize}
                disabled={isAiSuggesting || !note.trim()}
                className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium disabled:opacity-40 cursor-pointer"
              >
                {isAiSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Auto-Categorize
              </button>
            </div>
            <input
              id="input-transaction-note"
              type="text"
              placeholder="e.g., Dinner with friends, Swiggy order, Monthly salary"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => {
                if (note.trim().length > 3 && !aiSuggestion) {
                  handleTriggerAiCategorize();
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
            />
          </div>

          {/* AI Suggestion Card */}
          {aiSuggestion && (
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-400/25 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  AI Suggestion 🤖
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-200 font-medium">
                  {Math.round((aiSuggestion.confidence || 0.9) * 100)}% Confidence
                </span>
              </div>
              <p className="text-xs text-slate-200">
                Suggested Category: <strong className="text-white">{aiSuggestion.category}</strong> ({aiSuggestion.type})
              </p>
              {aiSuggestion.reason && (
                <p className="text-[11px] text-slate-400 italic">
                  "{aiSuggestion.reason}"
                </p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={applyAiSuggestion}
                  className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(56,189,248,0.3)] cursor-pointer"
                >
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  Apply Suggestion
                </button>
                <button
                  type="button"
                  onClick={() => setAiSuggestion(null)}
                  className="px-2 py-1 rounded border border-white/15 text-xs text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  Ignore
                </button>
              </div>
            </div>
          )}

          {/* Category Select */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Category *
            </label>
            <select
              id="select-transaction-category"
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
            >
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.icon} {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Date *
            </label>
            <input
              id="input-transaction-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Unusual Warning Alert Preview */}
          {anomalyWarning.isUnusual && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Unusual Expense Warning</span>
                <span className="text-[11px] opacity-90">{anomalyWarning.reason}</span>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/15 text-slate-300 text-xs font-medium hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-save-transaction"
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
