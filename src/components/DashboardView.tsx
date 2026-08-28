import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Sparkles,
  ArrowRight,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Target,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { DoughnutChart, ComparisonBarChart } from './Charts';
import { AIInsight } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenNaturalLanguage: () => void;
  onOpenAddTransaction: (type?: 'Expense' | 'Income') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNaturalLanguage,
  onOpenAddTransaction,
}) => {
  const {
    financialSummary,
    currencySymbol,
    formatCurrency,
    categories,
    transactions,
    recurring,
    goals,
    budgets,
    markRecurringPaid,
    skipRecurring,
  } = useExpense();

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [nlInputText, setNlInputText] = useState('');

  // Fetch or generate AI Spending Insights
  const fetchAiInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summaryData: financialSummary,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiInsights(data.insights || []);
      }
    } catch (e) {
      console.error('Error fetching insights:', e);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchAiInsights();
  }, []);

  // Category chart dataset
  const categoryChartData = Object.entries(financialSummary.categoryExpenses)
    .filter(([_, val]) => Number(val) > 0)
    .map(([catTitle, val]) => {
      const cat = categories.find((c) => c.title === catTitle);
      return {
        label: catTitle,
        value: val,
        color: cat?.color || '#6366F1',
      };
    });

  // Comparison multi-month chart dataset
  const comparisonData = [
    { label: 'May', income: 35000, expense: 15100 },
    { label: 'Jun', income: 35000, expense: 17300 },
    { label: 'Jul', income: 35000, expense: 20080 },
    {
      label: 'Aug',
      income: financialSummary.currentMonthIncome || 43500,
      expense: financialSummary.currentMonthExpense || 23149,
    },
  ];

  // Upcoming recurring items
  const upcomingBills = recurring
    .filter((r) => r.isActive)
    .slice(0, 4);

  // Active top savings goal
  const featuredGoal = goals.length > 0 ? goals[0] : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Top 4 Summary Cards (As in Script #6 & #25) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-sky-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Income
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(financialSummary.totalIncome)}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span>+12.4% vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Expense */}
        <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-rose-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Expense
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(financialSummary.totalExpense)}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Current month: {formatCurrency(financialSummary.currentMonthExpense)}</span>
            </div>
          </div>
        </div>

        {/* Net Balance */}
        <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-sky-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Net Balance
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-400/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-2xl font-bold ${financialSummary.balance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-500'}`}>
              {formatCurrency(financialSummary.balance)}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-sky-600 dark:text-sky-400 font-medium">
              <span>Income − Expense</span>
            </div>
          </div>
        </div>

        {/* Savings Rate % */}
        <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-cyan-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Savings Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-xs">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {Math.max(0, financialSummary.savingsRate)}%
            </span>
            <div className="w-full bg-slate-200/60 dark:bg-slate-800/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-400 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                style={{ width: `${Math.min(100, Math.max(0, financialSummary.savingsRate))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Quick Natural Language Prompt Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/70 dark:bg-slate-900/70 backdrop-blur-xl border border-sky-400/30 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-40 h-40 rounded-full bg-sky-500/15 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 backdrop-blur-md flex items-center justify-center text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Natural Language Expense Assistant</h4>
              <p className="text-xs text-sky-200/90">
                Type or paste naturally, e.g. <span className="italic text-sky-100 font-medium">"Yesterday I spent ₹350 on dinner with friends"</span>
              </p>
            </div>
          </div>
          <button
            onClick={onOpenNaturalLanguage}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_16px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Ask AI to Add Expense
          </button>
        </div>
      </div>

      {/* 🤖 AI Smart Spending Insights Section (As in Section 14 & 25) */}
      <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-400/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
              🤖 AI SMART SPENDING INSIGHTS
            </h3>
          </div>
          <button
            onClick={fetchAiInsights}
            disabled={isLoadingInsights}
            className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-500 flex items-center gap-1 font-medium cursor-pointer"
          >
            {isLoadingInsights ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Refresh Insights
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {aiInsights.length === 0 ? (
            <div className="col-span-3 p-4 text-center text-xs text-slate-400">
              Generating spending insights...
            </div>
          ) : (
            aiInsights.map((insight, idx) => (
              <div
                key={insight.id || idx}
                className={`p-3.5 rounded-xl border backdrop-blur-md transition-all ${
                  insight.type === 'warning'
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-900 dark:text-rose-200'
                    : insight.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-200'
                    : 'bg-sky-500/10 border-sky-400/20 text-sky-900 dark:text-sky-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs mb-1">
                  {insight.type === 'warning' ? '⚠ ' : insight.type === 'success' ? '💰 ' : '💡 '}
                  {insight.title}
                </div>
                <p className="text-xs opacity-90 leading-relaxed font-normal">
                  {insight.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Charts Grid: Income vs Expense & Category Doughnut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Multi-Month Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">INCOME VS EXPENSE TREND</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Multi-month comparative spending velocity</p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium flex items-center gap-0.5"
            >
              Full Report <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <ComparisonBarChart
            data={comparisonData}
            formatValue={(v) => `${currencySymbol}${v.toLocaleString()}`}
            height={210}
          />
        </div>

        {/* Expense by Category Doughnut */}
        <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">EXPENSE BY CATEGORY</h3>
            <button
              onClick={() => onNavigate('categories')}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              Manage
            </button>
          </div>

          <div className="my-auto py-2">
            <DoughnutChart
              data={categoryChartData}
              totalLabel="Spent"
              totalValue={formatCurrency(financialSummary.currentMonthExpense)}
              size={180}
            />
          </div>

          <div className="space-y-1.5 pt-3 border-t border-white/10 dark:border-white/10 text-xs">
            {categoryChartData.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{item.label}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Row: Budget Status & Upcoming Payments & Savings Goal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Budget Status */}
        <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">BUDGET STATUS</h3>
            <button
              onClick={() => onNavigate('budgets')}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {budgets.slice(0, 3).map((b) => {
              const cat = categories.find((c) => c.id === b.categoryId);
              const title = cat?.title || 'Category';
              const spent = financialSummary.categoryExpenses[title] || 0;
              const pct = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
              const isOver = pct > 100;
              const isWarning = pct >= 80 && pct <= 100;

              return (
                <div key={b.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <span>{cat?.icon || '📁'}</span>
                      {title}
                      {isOver && <span className="text-[10px] text-rose-500 font-bold ml-1">🚨 Exceeded</span>}
                      {isWarning && <span className="text-[10px] text-amber-500 font-bold ml-1">⚠ 80%+</span>}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatCurrency(spent)} / {formatCurrency(b.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/60 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Payments (Section 10) */}
        <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">UPCOMING PAYMENTS</h3>
            <button
              onClick={() => onNavigate('recurring')}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              Schedule
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingBills.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming recurring bills</p>
            ) : (
              upcomingBills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/30 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-white/5 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-slate-900 dark:text-white block truncate">
                      {bill.note}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Due: {bill.nextDueDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(bill.amount)}
                    </span>
                    <button
                      onClick={() => markRecurringPaid(bill.id)}
                      title="Mark as Paid"
                      className="p-1 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/30"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Featured Savings Goal */}
        <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">SAVINGS GOAL</h3>
            <button
              onClick={() => onNavigate('goals')}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              All Goals
            </button>
          </div>

          {featuredGoal ? (
            <div className="space-y-3 my-auto">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{featuredGoal.icon}</span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{featuredGoal.title}</span>
                    <span className="text-[10px] text-slate-400">Target by {featuredGoal.deadline}</span>
                  </div>
                </div>
                <span className="font-bold text-sky-600 dark:text-sky-400 text-sm">
                  {Math.round((featuredGoal.currentAmount / featuredGoal.targetAmount) * 100)}%
                </span>
              </div>

              <div>
                <div className="w-full bg-slate-200/60 dark:bg-slate-800/80 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-400 to-cyan-400 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.round((featuredGoal.currentAmount / featuredGoal.targetAmount) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>Saved: {formatCurrency(featuredGoal.currentAmount)}</span>
                  <span>Target: {formatCurrency(featuredGoal.targetAmount)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No active goals</p>
          )}

          <button
            onClick={() => onNavigate('goals')}
            className="w-full mt-3 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-400/20 text-xs font-semibold backdrop-blur-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Savings Plan
          </button>
        </div>
      </div>

      {/* Recent Transactions Table with Anomaly Detection Highlight */}
      <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">RECENT TRANSACTIONS</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live ledger with automated anomaly detection</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAddTransaction('Expense')}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-[0_0_12px_rgba(56,189,248,0.3)] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Add
            </button>
            <button
              onClick={() => onNavigate('transactions')}
              className="px-3 py-1.5 rounded-xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white/40 dark:hover:bg-slate-800/70"
            >
              View All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 dark:border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Category & Note</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 dark:divide-white/5">
              {transactions.slice(0, 6).map((tx) => {
                const cat = categories.find((c) => c.id === tx.categoryId);
                return (
                  <tr key={tx.id} className="hover:bg-white/30 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{cat?.icon || '📦'}</span>
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white block">{tx.note}</span>
                          <span className="text-[11px] text-slate-400">{cat?.title || 'General'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{tx.date}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          tx.type === 'Income'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                            : 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-white/10'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3">
                      {tx.isUnusual ? (
                        <span
                          title={tx.unusualReason || 'Unusual transaction detected'}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[10px] font-bold cursor-help"
                        >
                          <ShieldAlert className="w-3 h-3 text-amber-500" />
                          Unusual
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Normal</span>
                      )}
                    </td>
                    <td className="py-3 pr-2 text-right font-bold">
                      <span className={tx.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}>
                        {tx.type === 'Income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
