import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Target, Sparkles, CheckCircle2, DollarSign, Calendar, ArrowRight, X, Loader2, Zap } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { SavingsGoal, AISavingsAdvice } from '../types';

export const SavingsGoalsView: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, addGoalSavings, financialSummary, formatCurrency, currencySymbol } = useExpense();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState<number | ''>('');

  // AI Savings Plan states
  const [isAiPlanModalOpen, setIsAiPlanModalOpen] = useState(false);
  const [aiSelectedGoal, setAiSelectedGoal] = useState<SavingsGoal | null>(null);
  const [aiAdvice, setAiAdvice] = useState<AISavingsAdvice | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // New Goal Form states
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState<number | ''>('');
  const [initialSaved, setInitialSaved] = useState<number | ''>('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('💻');

  const goalIcons = ['💻', '🚗', '🏖️', '🏠', '📱', '💍', '🎓', '🏥', '🛡️', '🛵', '🚲', '💰'];

  const handleOpenAdd = () => {
    setTitle('');
    setTargetAmount('');
    setInitialSaved('');
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    setDeadline(sixMonthsLater.toISOString().split('T')[0]);
    setIcon('💻');
    setIsModalOpen(true);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount || typeof targetAmount !== 'number' || targetAmount <= 0) return;

    addGoal({
      title: title.trim(),
      targetAmount,
      currentAmount: Number(initialSaved) || 0,
      deadline,
      icon,
    });

    setIsModalOpen(false);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalForDeposit || !depositAmount || typeof depositAmount !== 'number' || depositAmount <= 0) return;

    addGoalSavings(selectedGoalForDeposit.id, depositAmount);
    setIsDepositModalOpen(false);
    setDepositAmount('');
    setSelectedGoalForDeposit(null);
  };

  const handleGenerateAiPlan = async (goal: SavingsGoal) => {
    setAiSelectedGoal(goal);
    setIsAiPlanModalOpen(true);
    setIsGeneratingPlan(true);
    setAiAdvice(null);

    try {
      const res = await fetch('/api/ai/savings-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalTitle: goal.title,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          deadline: goal.deadline,
          financialSummary,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiAdvice(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Smart Savings Goals
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set financial targets and generate AI-driven monthly allocation roadmaps
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Goals Target</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalTarget)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{goals.length} target goals tracked</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Accumulated</span>
          <div className="text-xl font-bold text-sky-500 mt-1">
            {formatCurrency(totalSaved)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {totalTarget > 0 ? `${Math.round((totalSaved / totalTarget) * 100)}% overall completion` : '0%'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completed Goals</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {goals.filter((g) => g.status === 'Completed' || g.currentAmount >= g.targetAmount).length} Goals Reached
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Milestone celebrations logged</span>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isCompleted = goal.status === 'Completed' || pct >= 100;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div
              key={goal.id}
              className={`p-5 rounded-2xl backdrop-blur-xl border transition-all ${
                isCompleted
                  ? 'border-emerald-500/30 bg-emerald-500/10'
                  : 'bg-white/40 dark:bg-slate-900/50 border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-sky-400/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-2xl shadow-xs">
                    {goal.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{goal.title}</h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" /> Target: {goal.deadline}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">
                    Saved: <strong className="text-sky-500">{formatCurrency(goal.currentAmount)}</strong>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Target: {formatCurrency(goal.targetAmount)} ({pct}%)
                  </span>
                </div>

                <div className="w-full bg-white/10 dark:bg-slate-800/80 h-3 rounded-full overflow-hidden border border-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-emerald-400' : 'bg-sky-500 shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>{isCompleted ? '🎉 Target achieved!' : `Remaining: ${formatCurrency(remaining)}`}</span>
                  <span>{isCompleted ? '100%' : `${pct}% completed`}</span>
                </div>
              </div>

              {/* Actions Toolbar */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGoalForDeposit(goal);
                    setIsDepositModalOpen(true);
                  }}
                  className="flex-1 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  Add Savings
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateAiPlan(goal)}
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sky-400 border border-white/15 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  AI Plan
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Savings / Deposit Modal */}
      {isDepositModalOpen && selectedGoalForDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-6 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">
                Add Funds to "{selectedGoalForDeposit.title}"
              </h3>
              <button onClick={() => setIsDepositModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Contribution Amount ({currencySymbol}) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  autoFocus
                  placeholder="e.g. 5000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white text-base font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-white/15 text-slate-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.3)] cursor-pointer"
                >
                  Deposit Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Savings Plan Modal */}
      {isAiPlanModalOpen && aiSelectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900/85 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-6 space-y-4 max-h-[90vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-sky-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-base text-white">
                  AI Savings Roadmap: {aiSelectedGoal.title}
                </h3>
              </div>
              <button onClick={() => setIsAiPlanModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {isGeneratingPlan ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
                <p className="text-xs font-medium">Analyzing income, commitments and expense cuts with Gemini AI...</p>
              </div>
            ) : aiAdvice ? (
              <div className="space-y-4 text-xs">
                {/* Top Monthly Target */}
                <div className="p-4 rounded-xl bg-sky-500 text-slate-950 font-medium shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                  <span className="text-[11px] uppercase tracking-wider font-bold opacity-80 block">
                    Recommended Monthly Savings Target
                  </span>
                  <div className="text-2xl font-extrabold mt-0.5">
                    {formatCurrency(aiAdvice.monthlySavingsRequired)} / month
                  </div>
                  <p className="text-[11px] opacity-80 mt-1">
                    Will reach {formatCurrency(aiSelectedGoal.targetAmount)} target on schedule by {aiSelectedGoal.deadline}.
                  </p>
                </div>

                {/* Feasibility Assessment */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-white block mb-1">
                    Feasibility Assessment
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {aiAdvice.feasibilityAssessment}
                  </p>
                </div>

                {/* Category Cuts Suggestions */}
                <div>
                  <span className="font-bold text-white block mb-2">
                    Suggested Monthly Reductions by Category
                  </span>
                  <div className="space-y-2">
                    {aiAdvice.categoryCuts.map((cut, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-white block">{cut.category}</span>
                          <span className="text-[11px] text-slate-400">{cut.reason}</span>
                        </div>
                        <div className="text-right shrink-0 pl-3">
                          <span className="text-xs font-bold text-emerald-400">
                            Cut {formatCurrency(cut.suggestedCut)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Tips */}
                {aiAdvice.tips && aiAdvice.tips.length > 0 && (
                  <div>
                    <span className="font-bold text-white block mb-1.5">
                      Tactical Action Steps
                    </span>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      {aiAdvice.tips.map((tip, i) => (
                        <li key={i} className="leading-relaxed">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAiPlanModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-[0_0_12px_rgba(56,189,248,0.3)] cursor-pointer"
              >
                Close Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900/85 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-6 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Create Savings Goal</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Goal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MacBook Pro, Vacation, Emergency Fund"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Target Amount ({currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 80000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Initial Saved ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={initialSaved}
                    onChange={(e) => setInitialSaved(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Target Deadline Date</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Choose Goal Icon</label>
                <div className="grid grid-cols-6 gap-2 p-2 bg-white/5 border border-white/10 rounded-xl">
                  {goalIcons.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`h-9 text-lg rounded-lg flex items-center justify-center cursor-pointer ${
                        icon === ic ? 'bg-sky-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(56,189,248,0.4)]' : 'hover:bg-white/10 text-white'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

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
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
