import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Sparkles,
  Plus,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Mic,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
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
  } = useExpense();

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

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
        color: cat?.color || '#00BAF2',
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
  const upcomingBills = recurring.filter((r) => r.isActive).slice(0, 4);

  // Active top savings goal
  const featuredGoal = goals.length > 0 ? goals[0] : null;

  return (
    <div className="space-y-3.5 sm:space-y-6 pb-16 w-full max-w-full overflow-hidden">
      {/* Top 4 Summary Cards (Mobile 2-columns with adaptive font sizing, Desktop 4-columns) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {/* Total Income */}
        <div className="p-3 sm:p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#00BAF2]/50 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Total Income
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-3">
            <div className="text-sm xs:text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate tracking-tight">
              {formatCurrency(financialSummary.totalIncome)}
            </div>
            <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-[9px] xs:text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-semibold truncate">
              <span>+12.4% vs last mo</span>
            </div>
          </div>
        </div>

        {/* Total Expense */}
        <div className="p-3 sm:p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-400/50 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Total Expense
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-3">
            <div className="text-sm xs:text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate tracking-tight">
              {formatCurrency(financialSummary.totalExpense)}
            </div>
            <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-[9px] xs:text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
              <span>This mo: {formatCurrency(financialSummary.currentMonthExpense)}</span>
            </div>
          </div>
        </div>

        {/* Net Balance */}
        <div className="p-3 sm:p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#002970]/50 dark:hover:border-[#00BAF2]/50 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Net Balance
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#002970]/10 dark:bg-[#00BAF2]/10 text-[#002970] dark:text-[#00BAF2] flex items-center justify-center shrink-0">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-3">
            <div className={`text-sm xs:text-lg sm:text-2xl font-black truncate tracking-tight ${financialSummary.balance >= 0 ? 'text-[#002970] dark:text-white' : 'text-rose-500'}`}>
              {formatCurrency(financialSummary.balance)}
            </div>
            <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-[9px] xs:text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
              <span>Income − Expense</span>
            </div>
          </div>
        </div>

        {/* Savings Rate % */}
        <div className="p-3 sm:p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#00BAF2]/50 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Savings Rate
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#00BAF2]/15 text-[#008db8] dark:text-[#00BAF2] flex items-center justify-center shrink-0">
              <PiggyBank className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-3">
            <div className="text-sm xs:text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {Math.max(0, financialSummary.savingsRate)}%
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 sm:mt-2 overflow-hidden">
              <div
                className="bg-[#00BAF2] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, financialSummary.savingsRate))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Banner (Voice & Natural Language AI) */}
      <div className="p-3 sm:p-4 rounded-xl bg-[#002970] dark:bg-[#0b1633] border border-[#00BAF2]/30 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#00BAF2] text-[#002970] flex items-center justify-center shrink-0 font-black shadow-xs">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#002970]" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5 truncate">
                <span>Natural Language Assistant</span>
                <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold bg-[#00BAF2] text-[#002970]">
                  AI
                </span>
              </h4>
              <p className="text-[10px] sm:text-xs text-sky-200/90 leading-tight mt-0.5 truncate">
                Speak or type: <span className="italic text-white font-medium">"Dinner ₹850 yesterday"</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={onOpenNaturalLanguage}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg bg-[#00BAF2] hover:bg-[#009fd0] text-[#002970] font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice / AI Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🤖 AI Smart Spending Insights Section */}
      <div className="p-3.5 sm:p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#00BAF2]/15 text-[#008db8] dark:text-[#00BAF2] flex items-center justify-center font-bold">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight">
              AI SMART SPENDING INSIGHTS
            </h3>
          </div>
          <button
            onClick={fetchAiInsights}
            disabled={isLoadingInsights}
            className="text-xs text-[#008db8] dark:text-[#00BAF2] hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            {isLoadingInsights ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {aiInsights.length === 0 ? (
            <div className="col-span-full p-3 sm:p-4 text-center text-xs text-slate-400">
              Generating smart financial insights...
            </div>
          ) : (
            aiInsights.map((insight, idx) => (
              <div
                key={insight.id || idx}
                className={`p-2.5 sm:p-3 rounded-lg border text-xs transition-all ${
                  insight.type === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/25 text-amber-900 dark:text-amber-200'
                    : insight.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-900 dark:text-emerald-200'
                    : 'bg-sky-500/10 border-sky-500/25 text-sky-900 dark:text-sky-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <span>{insight.type === 'warning' ? '⚠' : insight.type === 'success' ? '✔' : '💡'}</span>
                  <span className="truncate">{insight.title}</span>
                </div>
                <p className="opacity-90 leading-snug font-normal text-[11px] sm:text-xs">
                  {insight.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Charts Grid: Income vs Expense & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-6">
        {/* Income vs Expense Multi-Month Chart */}
        <div className="lg:col-span-2 p-3.5 sm:p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                INCOME VS EXPENSE TREND
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                Comparative multi-month cashflow velocity
              </p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs text-[#008db8] dark:text-[#00BAF2] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
            >
              Reports <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-full overflow-hidden py-1">
            <ComparisonBarChart
              data={comparisonData}
              formatValue={(v) => `${currencySymbol}${v.toLocaleString()}`}
              height={180}
            />
          </div>
        </div>

        {/* Expense by Category Doughnut */}
        <div className="p-3.5 sm:p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
              EXPENSE BY CATEGORY
            </h3>
            <button
              onClick={() => onNavigate('categories')}
              className="text-xs text-[#008db8] dark:text-[#00BAF2] hover:underline font-bold cursor-pointer"
            >
              Categories
            </button>
          </div>

          <div className="my-auto py-2 flex items-center justify-center">
            <DoughnutChart
              data={categoryChartData}
              totalLabel="Spent"
              totalValue={formatCurrency(financialSummary.currentMonthExpense)}
              size={160}
            />
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            {categoryChartData.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0 pr-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300 truncate text-[11px] sm:text-xs">{item.label}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white shrink-0 text-[11px] sm:text-xs">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Row: Budget Status, Upcoming Payments & Savings Goal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
        {/* Category Budget Status */}
        <div className="p-3.5 sm:p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
              BUDGET STATUS
            </h3>
            <button
              onClick={() => onNavigate('budgets')}
              className="text-xs text-[#008db8] dark:text-[#00BAF2] hover:underline font-bold cursor-pointer"
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
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 truncate pr-1">
                      <span>{cat?.icon || '📁'}</span>
                      <span className="truncate">{title}</span>
                      {isOver && <span className="text-[9px] sm:text-[10px] text-rose-500 font-bold ml-1">🚨 Over</span>}
                      {isWarning && <span className="text-[9px] sm:text-[10px] text-amber-500 font-bold ml-1">⚠ 80%+</span>}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 shrink-0 text-[10px] sm:text-xs">
                      {formatCurrency(spent)} / {formatCurrency(b.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="p-3.5 sm:p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
              UPCOMING PAYMENTS
            </h3>
            <button
              onClick={() => onNavigate('recurring')}
              className="text-xs text-[#008db8] dark:text-[#00BAF2] hover:underline font-bold cursor-pointer"
            >
              Schedule
            </button>
          </div>

          <div className="space-y-2">
            {upcomingBills.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming recurring bills</p>
            ) : (
              upcomingBills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-slate-900 dark:text-white block truncate text-[11px] sm:text-xs">
                      {bill.note}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Due: {bill.nextDueDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className="font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs">
                      {formatCurrency(bill.amount)}
                    </span>
                    <button
                      onClick={() => markRecurringPaid(bill.id)}
                      title="Mark as Paid"
                      className="p-1.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/30 cursor-pointer active:scale-95 transition-transform"
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
        <div className="p-3.5 sm:p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
              SAVINGS GOAL
            </h3>
            <button
              onClick={() => onNavigate('goals')}
              className="text-xs text-[#008db8] dark:text-[#00BAF2] hover:underline font-bold cursor-pointer"
            >
              All Goals
            </button>
          </div>

          {featuredGoal ? (
            <div className="space-y-2.5 sm:space-y-3 my-auto">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="text-lg sm:text-xl shrink-0">{featuredGoal.icon}</span>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white block truncate text-[11px] sm:text-xs">
                      {featuredGoal.title}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400">Target: {featuredGoal.deadline}</span>
                  </div>
                </div>
                <span className="font-black text-[#008db8] dark:text-[#00BAF2] text-xs sm:text-sm shrink-0">
                  {Math.round((featuredGoal.currentAmount / featuredGoal.targetAmount) * 100)}%
                </span>
              </div>

              <div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 sm:h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#00BAF2] h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((featuredGoal.currentAmount / featuredGoal.targetAmount) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>Saved: {formatCurrency(featuredGoal.currentAmount)}</span>
                  <span>Target: {formatCurrency(featuredGoal.targetAmount)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-4">No active goals</p>
          )}

          <button
            onClick={() => onNavigate('goals')}
            className="w-full mt-3 py-2 rounded-lg bg-[#00BAF2]/10 hover:bg-[#00BAF2]/20 text-[#002970] dark:text-[#00BAF2] border border-[#00BAF2]/20 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Savings Plan
          </button>
        </div>
      </div>

      {/* Recent Transactions: Fully Responsive with Dual Mobile Cards & Desktop Table */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
              RECENT TRANSACTIONS
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Live ledger with automated anomaly detection
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAddTransaction('Expense')}
              className="px-3 py-1.5 rounded-lg bg-[#002970] dark:bg-[#00BAF2] text-white dark:text-[#001A4D] font-bold text-xs flex items-center gap-1 shadow-xs hover:opacity-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Add
            </button>
            <button
              onClick={() => onNavigate('transactions')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              All
            </button>
          </div>
        </div>

        {/* Mobile Cards List (< sm screens) */}
        <div className="block sm:hidden space-y-2.5">
          {transactions.slice(0, 6).map((tx) => {
            const cat = categories.find((c) => c.id === tx.categoryId);
            return (
              <div
                key={tx.id}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-base shrink-0">
                    {cat?.icon || '📦'}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white block text-xs truncate">
                      {tx.note}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{cat?.title || 'General'}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                      {tx.isUnusual && (
                        <span className="text-amber-500 font-bold flex items-center gap-0.5">
                          <ShieldAlert className="w-2.5 h-2.5" /> Unusual
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-black text-xs block ${
                      tx.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {tx.type === 'Income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">
                    {tx.paymentMethod || 'UPI'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop & Tablet Table (>= sm screens) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Category & Note</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {transactions.slice(0, 6).map((tx) => {
                const cat = categories.find((c) => c.id === tx.categoryId);
                return (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{cat?.icon || '📦'}</span>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{tx.note}</span>
                          <span className="text-[11px] text-slate-400">{cat?.title || 'General'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{tx.date}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'Income'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3">
                      {tx.isUnusual ? (
                        <span
                          title={tx.unusualReason || 'Unusual transaction detected'}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[10px] font-bold"
                        >
                          <ShieldAlert className="w-3 h-3 text-amber-500" />
                          Unusual
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Normal</span>
                      )}
                    </td>
                    <td className="py-3 pr-2 text-right font-black">
                      <span
                        className={
                          tx.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                        }
                      >
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
