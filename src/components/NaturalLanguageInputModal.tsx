import React, { useState } from 'react';
import { Sparkles, X, Check, ArrowRight, Loader2, Calendar, Tag, DollarSign, FileText } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

interface NaturalLanguageInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const NaturalLanguageInputModal: React.FC<NaturalLanguageInputModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { categories, addTransaction, formatCurrency, currencySymbol } = useExpense();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState<{
    date: string;
    amount: number;
    category: string;
    type: 'Expense' | 'Income';
    note: string;
    confidence: number;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategory, setEditedCategory] = useState('');
  const [editedAmount, setEditedAmount] = useState<number | ''>('');
  const [editedNote, setEditedNote] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [editedType, setEditedType] = useState<'Expense' | 'Income'>('Expense');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const examplePrompts = [
    'Yesterday I spent 450 on dinner with friends',
    'Received 35,000 monthly salary today',
    'Paid 799 for fiber internet bill',
    'Spent 1200 on grocery shopping at supermarket',
    'Uber cab ride to office for 280 yesterday',
  ];

  const handleParse = async (customPrompt?: string) => {
    const textToParse = customPrompt || inputText;
    if (!textToParse.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    setParsedResult(null);
    setIsEditing(false);

    try {
      const res = await fetch('/api/ai/parse-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToParse,
          referenceDate: new Date().toISOString().split('T')[0],
          categories: categories.map((c) => ({ id: c.id, title: c.title })),
        }),
      });

      if (!res.ok) throw new Error('AI parser failed');
      const data = await res.json();

      setParsedResult(data);
      setEditedCategory(data.category);
      setEditedAmount(data.amount);
      setEditedNote(data.note);
      setEditedDate(data.date);
      setEditedType(data.type);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not parse expense automatically. Please try a simpler phrase.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSave = () => {
    if (!parsedResult && !isEditing) return;

    const finalCatName = isEditing ? editedCategory : parsedResult!.category;
    const finalAmount = Number(isEditing ? editedAmount : parsedResult!.amount);
    const finalNote = isEditing ? editedNote : parsedResult!.note;
    const finalDate = isEditing ? editedDate : parsedResult!.date;
    const finalType = isEditing ? editedType : parsedResult!.type;

    // Match category ID
    let matchedCat = categories.find(
      (c) => c.title.toLowerCase() === finalCatName.toLowerCase() && c.type === finalType
    );

    if (!matchedCat) {
      matchedCat = categories.find((c) => c.type === finalType) || categories[0];
    }

    addTransaction({
      categoryId: matchedCat.id,
      amount: finalAmount,
      note: finalNote,
      type: finalType,
      date: finalDate,
    });

    setInputText('');
    setParsedResult(null);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="natural-language-modal"
        className="w-full max-w-lg bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 overflow-hidden text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-400/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Natural Language Expense Entry</h3>
              <p className="text-xs text-slate-400">Ask AI to parse and record any transaction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Describe your expense or income in plain words
            </label>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder='e.g., "Yesterday I spent ₹350 on dinner with friends"'
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleParse();
                  }
                }}
              />
              <button
                id="btn-ai-parse-submit"
                onClick={() => handleParse()}
                disabled={isLoading || !inputText.trim()}
                className="absolute bottom-3 right-3 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                    Parse with AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Examples */}
          {!parsedResult && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Quick Sample Prompts
              </span>
              <div className="flex flex-wrap gap-1.5">
                {examplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputText(prompt);
                      handleParse(prompt);
                    }}
                    className="text-xs text-left px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-sky-400/40 transition-colors cursor-pointer"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Parsed Result Card */}
          {parsedResult && !isEditing && (
            <div className="p-4 rounded-xl border border-sky-400/25 bg-sky-500/10 space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  AI Extracted Details
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {Math.round((parsedResult.confidence || 0.95) * 100)}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">Type & Category</span>
                  <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                    <span className={parsedResult.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'}>
                      {parsedResult.type}
                    </span>
                    • {parsedResult.category}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">Amount</span>
                  <span className="font-bold text-white text-sm mt-0.5">
                    {currencySymbol}{parsedResult.amount.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">Date</span>
                  <span className="font-medium text-slate-200 mt-0.5">
                    {parsedResult.date}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">Note</span>
                  <span className="font-medium text-slate-200 truncate block mt-0.5">
                    {parsedResult.note}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 rounded-lg border border-white/15 text-xs font-medium text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Edit Details
                </button>
                <button
                  id="btn-confirm-ai-transaction"
                  type="button"
                  onClick={handleConfirmSave}
                  className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  Confirm & Save
                </button>
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <div className="p-4 rounded-xl border border-white/15 bg-white/5 space-y-3">
              <span className="text-xs font-semibold text-slate-200 block">Edit Transaction Details</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Type</label>
                  <select
                    value={editedType}
                    onChange={(e) => setEditedType(e.target.value as 'Expense' | 'Income')}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/15 bg-slate-800 text-xs text-white"
                  >
                    <option value="Expense" className="bg-slate-900">Expense</option>
                    <option value="Income" className="bg-slate-900">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Category</label>
                  <select
                    value={editedCategory}
                    onChange={(e) => setEditedCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/15 bg-slate-800 text-xs text-white"
                  >
                    {categories
                      .filter((c) => c.type === editedType)
                      .map((c) => (
                        <option key={c.id} value={c.title} className="bg-slate-900">
                          {c.icon} {c.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Amount ({currencySymbol})</label>
                  <input
                    type="number"
                    value={editedAmount}
                    onChange={(e) => setEditedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/15 bg-white/5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={editedDate}
                    onChange={(e) => setEditedDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-white/15 bg-white/5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Note</label>
                <input
                  type="text"
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-white/15 bg-white/5 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg border border-white/15 text-xs font-medium text-slate-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel Edit
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(56,189,248,0.3)] cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
