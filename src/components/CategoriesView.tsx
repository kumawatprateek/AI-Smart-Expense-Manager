import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Check, X, Layers, Power } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { Category, TransactionType } from '../types';

export const CategoriesView: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, transactions, formatCurrency } = useExpense();

  const [activeTab, setActiveTab] = useState<TransactionType>('Expense');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TransactionType>('Expense');
  const [icon, setIcon] = useState('🍔');
  const [color, setColor] = useState('#EF4444');

  const emojiOptions = [
    '🍔', '🛒', '🚗', '⚡', '🎬', '💊', '🏠', '✈️', '💼', '📈', '💻', '🎁', '🎓', '👗', '☕', '🏋️', '📚', '🍕', '🎉', '💰'
  ];

  const colorOptions = [
    '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#6366F1', '#14B8A6', '#64748B', '#84CC16'
  ];

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setTitle('');
    setType(activeTab);
    setIcon(activeTab === 'Expense' ? '🍔' : '💼');
    setColor(activeTab === 'Expense' ? '#EF4444' : '#10B981');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setTitle(cat.title);
    setType(cat.type);
    setIcon(cat.icon);
    setColor(cat.color);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        title: title.trim(),
        type,
        icon,
        color,
      });
    } else {
      addCategory({
        title: title.trim(),
        type,
        icon,
        color,
        isActive: true,
      });
    }

    setIsModalOpen(false);
  };

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Category Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Organize and customize spending and income classification
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Category</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1.5 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-2xl max-w-xs shadow-xs">
        <button
          onClick={() => setActiveTab('Expense')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'Expense'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Expenses ({categories.filter((c) => c.type === 'Expense').length})
        </button>
        <button
          onClick={() => setActiveTab('Income')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'Income'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Income ({categories.filter((c) => c.type === 'Income').length})
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map((cat) => {
          const categoryTxs = transactions.filter((t) => t.categoryId === cat.id);
          const totalSpent = categoryTxs.reduce((sum, t) => sum + t.amount, 0);

          return (
            <div
              key={cat.id}
              className={`p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border transition-all ${
                cat.isActive
                  ? 'border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-sky-400/40'
                  : 'border-dashed border-white/20 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-xs"
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                  {cat.icon}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateCategory(cat.id, { isActive: !cat.isActive })}
                    title={cat.isActive ? 'Active (click to disable)' : 'Inactive (click to enable)'}
                    className={`p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      cat.isActive ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                  {cat.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>{categoryTxs.length} transaction{categoryTxs.length !== 1 ? 's' : ''}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {formatCurrency(totalSpent)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900/85 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-6 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('Expense')}
                  className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    type === 'Expense' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('Income')}
                  className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    type === 'Income' ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Income
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Category Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Groceries, Gym, Freelance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-slate-300 mb-1.5 font-medium">Choose Emoji Icon</label>
                <div className="grid grid-cols-10 gap-1.5 p-2 bg-white/5 rounded-xl border border-white/10">
                  {emojiOptions.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setIcon(em)}
                      className={`h-8 text-base rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        icon === em ? 'bg-sky-500/30 border border-sky-400 text-white shadow' : 'hover:bg-white/10'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-slate-300 mb-1.5 font-medium">Choose Color Accent</label>
                <div className="flex items-center gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                        color === c ? 'scale-125 ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-900' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
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
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
