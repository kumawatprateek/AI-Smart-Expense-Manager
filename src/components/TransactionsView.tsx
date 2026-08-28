import React, { useState, useMemo } from 'react';
import {
  Plus,
  Sparkles,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  ShieldAlert,
  ArrowUpDown,
  Calendar,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { Transaction, TransactionType } from '../types';

interface TransactionsViewProps {
  onOpenAddModal: () => void;
  onOpenNaturalLanguage: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  onOpenAddModal,
  onOpenNaturalLanguage,
}) => {
  const { transactions, categories, deleteTransaction, updateTransaction, formatCurrency, currencySymbol } = useExpense();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');
  const [selectedTxForAnomaly, setSelectedTxForAnomaly] = useState<Transaction | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        if (selectedType !== 'All' && t.type !== selectedType) return false;
        if (selectedCategory !== 'All' && t.categoryId !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const cat = categories.find((c) => c.id === t.categoryId);
          const catTitle = cat?.title.toLowerCase() || '';
          return t.note.toLowerCase().includes(q) || catTitle.includes(q) || t.amount.toString().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'amount_desc') return b.amount - a.amount;
        if (sortBy === 'amount_asc') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, selectedType, selectedCategory, searchQuery, sortBy, categories]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Type', 'Category', 'Note', 'Amount', 'Is Unusual'];
    const rows = filteredTransactions.map((t) => {
      const cat = categories.find((c) => c.id === t.categoryId);
      return [
        t.id,
        t.date,
        t.type,
        `"${cat?.title || 'Unknown'}"`,
        `"${t.note.replace(/"/g, '""')}"`,
        t.amount,
        t.isUnusual ? 'Yes' : 'No',
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Transaction Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View, filter, edit, and export your complete financial records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNaturalLanguage}
            className="px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-400/20 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
            <span>AI Fast Entry</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by note, category or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-800/60 backdrop-blur-md text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-800/60 backdrop-blur-md text-xs text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-slate-900 text-white">All Types (Income & Expense)</option>
            <option value="Expense" className="bg-slate-900 text-white">Expenses Only (-)</option>
            <option value="Income" className="bg-slate-900 text-white">Income Only (+)</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-800/60 backdrop-blur-md text-xs text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-slate-900 text-white">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                {c.icon} {c.title} ({c.type})
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-800/60 backdrop-blur-md text-xs text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer"
          >
            <option value="date_desc" className="bg-slate-900 text-white">Date: Newest First</option>
            <option value="date_asc" className="bg-slate-900 text-white">Date: Oldest First</option>
            <option value="amount_desc" className="bg-slate-900 text-white">Amount: Highest First</option>
            <option value="amount_asc" className="bg-slate-900 text-white">Amount: Lowest First</option>
          </select>
        </div>

        {/* Toolbar summary */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400">
          <span>Showing {filteredTransactions.length} of {transactions.length} total records</span>
          <button
            onClick={handleExportCSV}
            className="text-sky-600 dark:text-sky-400 hover:text-sky-500 flex items-center gap-1 font-medium cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/20 dark:bg-slate-800/40 border-b border-white/10 dark:border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Transaction Note</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status / Alert</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 dark:divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No transactions match your search filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const cat = categories.find((c) => c.id === tx.categoryId);
                  return (
                    <tr key={tx.id} className="hover:bg-white/30 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl shrink-0">{cat?.icon || '📦'}</span>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">{tx.note}</span>
                            {tx.isRecurringGenerated && (
                              <span className="text-[10px] text-sky-400 font-medium">🔁 Recurring payment</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {cat?.title || 'Other'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            tx.type === 'Income'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                              : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {tx.isUnusual ? (
                          <button
                            type="button"
                            onClick={() => setSelectedTxForAnomaly(tx)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            <ShieldAlert className="w-3 h-3 text-amber-500" />
                            Unusual ⓘ
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">Regular</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold whitespace-nowrap">
                        <span
                          className={
                            tx.type === 'Income'
                              ? 'text-emerald-600 dark:text-emerald-400 text-sm'
                              : 'text-slate-900 dark:text-white text-sm'
                          }
                        >
                          {tx.type === 'Income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingTx(tx)}
                            title="Edit transaction"
                            className="p-1 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-white/10 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            title="Delete transaction"
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unusual Expense Anomaly Detail Modal */}
      {selectedTxForAnomaly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-6 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-sm text-white">Unusual Transaction Detected</h3>
              </div>
              <button onClick={() => setSelectedTxForAnomaly(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-2">
              <div className="flex justify-between font-semibold text-white">
                <span>{selectedTxForAnomaly.note}</span>
                <span>{formatCurrency(selectedTxForAnomaly.amount)}</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {selectedTxForAnomaly.unusualReason || 'This transaction significantly exceeds your historical baseline for this category.'}
              </p>
            </div>
            <button
              onClick={() => setSelectedTxForAnomaly(null)}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-6 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Edit Transaction</h3>
              <button onClick={() => setEditingTx(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Note</label>
                <input
                  type="text"
                  value={editingTx.note}
                  onChange={(e) => setEditingTx({ ...editingTx, note: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Amount ({currencySymbol})</label>
                  <input
                    type="number"
                    value={editingTx.amount}
                    onChange={(e) => setEditingTx({ ...editingTx, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingTx.date}
                    onChange={(e) => setEditingTx({ ...editingTx, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={editingTx.categoryId}
                  onChange={(e) => setEditingTx({ ...editingTx, categoryId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  {categories.filter((c) => c.type === editingTx.type).map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                      {c.icon} {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTx(null)}
                className="px-3.5 py-1.5 rounded-xl border border-white/15 text-xs text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateTransaction(editingTx.id, editingTx);
                  setEditingTx(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]"
              >
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
