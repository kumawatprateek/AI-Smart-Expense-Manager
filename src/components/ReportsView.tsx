import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieIcon,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { DoughnutChart, ComparisonBarChart, SimpleTrendLine } from './Charts';

export const ReportsView: React.FC = () => {
  const { transactions, categories, formatCurrency, currencySymbol } = useExpense();

  const [dateFilter, setDateFilter] = useState<'today' | 'this_week' | 'this_month' | 'last_month' | 'last_3_months' | 'this_year'>('this_month');

  // Compute date range
  const { filteredTxs, daysInPeriod, periodLabel } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let start = new Date();
    let end = new Date();
    let label = 'This Month';
    let days = 30;

    if (dateFilter === 'today') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      label = 'Today';
      days = 1;
    } else if (dateFilter === 'this_week') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      start = new Date(now.setDate(diff));
      start.setHours(0, 0, 0, 0);
      end = new Date();
      label = 'This Week';
      days = 7;
    } else if (dateFilter === 'this_month') {
      start = new Date(currentYear, currentMonth, 1);
      end = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
      label = 'This Month (August)';
      days = new Date(currentYear, currentMonth + 1, 0).getDate();
    } else if (dateFilter === 'last_month') {
      start = new Date(currentYear, currentMonth - 1, 1);
      end = new Date(currentYear, currentMonth, 0, 23, 59, 59);
      label = 'Last Month (July)';
      days = new Date(currentYear, currentMonth, 0).getDate();
    } else if (dateFilter === 'last_3_months') {
      start = new Date(currentYear, currentMonth - 2, 1);
      end = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
      label = 'Past 3 Months';
      days = 90;
    } else if (dateFilter === 'this_year') {
      start = new Date(currentYear, 0, 1);
      end = new Date(currentYear, 11, 31, 23, 59, 59);
      label = `Year ${currentYear}`;
      days = 365;
    }

    const filtered = transactions.filter((t) => {
      const d = new Date(t.date);
      return d >= start && d <= end;
    });

    return { filteredTxs: filtered, daysInPeriod: days, periodLabel: label };
  }, [transactions, dateFilter]);

  // Aggregate computations
  const totalIncome = filteredTxs.filter((t) => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filteredTxs.filter((t) => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
  const netSavings = totalIncome - totalExpense;
  const dailyAverage = totalExpense / Math.max(1, daysInPeriod);

  // Group by day to find highest and lowest spending days
  const dailySpending: { [date: string]: number } = {};
  filteredTxs.filter((t) => t.type === 'Expense').forEach((t) => {
    dailySpending[t.date] = (dailySpending[t.date] || 0) + t.amount;
  });

  const dailyEntries = Object.entries(dailySpending);
  const highestDay = dailyEntries.length > 0 ? dailyEntries.reduce((max, curr) => (curr[1] > max[1] ? curr : max)) : null;
  const lowestDay = dailyEntries.length > 0 ? dailyEntries.reduce((min, curr) => (curr[1] < min[1] ? curr : min)) : null;

  // Category breakdown for filtered period
  const categoryBreakdown: { [catId: string]: number } = {};
  filteredTxs.filter((t) => t.type === 'Expense').forEach((t) => {
    categoryBreakdown[t.categoryId] = (categoryBreakdown[t.categoryId] || 0) + t.amount;
  });

  const doughnutData = Object.entries(categoryBreakdown).map(([catId, amount]) => {
    const cat = categories.find((c) => c.id === catId);
    return {
      label: cat?.title || 'Other',
      value: amount,
      color: cat?.color || '#6366F1',
    };
  });

  // Trend line points
  const trendData = [
    { label: 'W1', value: 3800 },
    { label: 'W2', value: 5200 },
    { label: 'W3', value: 4100 },
    { label: 'W4', value: totalExpense > 10000 ? 6200 : 2500 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Financial Reports & Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Deep dive into historical cashflow, daily velocity, and category allocations
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1 p-1 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-xl max-w-full">
          {[
            { id: 'today', label: 'Today' },
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' },
            { id: 'last_month', label: 'Last Month' },
            { id: 'last_3_months', label: 'Past 3M' },
            { id: 'this_year', label: 'This Year' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setDateFilter(item.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                dateFilter === item.id
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Period Income</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalIncome)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{periodLabel}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Period Expense</span>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {formatCurrency(totalExpense)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{filteredTxs.length} transactions</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Daily Average Spending</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(dailyAverage)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Across {daysInPeriod} days</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Net Period Savings</span>
          <div
            className={`text-xl font-bold mt-1 ${
              netSavings >= 0 ? 'text-sky-500' : 'text-rose-500'
            }`}
          >
            {formatCurrency(netSavings)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {totalIncome > 0 ? `${Math.round((netSavings / totalIncome) * 100)}% savings rate` : '0%'}
          </span>
        </div>
      </div>

      {/* Highest / Lowest Spending Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-rose-500/10 backdrop-blur-xl border border-rose-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
              Highest Spending Day
            </span>
            <div className="text-lg font-bold text-rose-900 dark:text-rose-100 mt-0.5">
              {highestDay ? `${formatCurrency(highestDay[1])}` : 'None'}
            </div>
            <span className="text-xs text-rose-600 dark:text-rose-400">
              {highestDay ? `Date: ${highestDay[0]}` : 'No expense recorded'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              Lowest Spending Day
            </span>
            <div className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mt-0.5">
              {lowestDay ? `${formatCurrency(lowestDay[1])}` : 'None'}
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400">
              {lowestDay ? `Date: ${lowestDay[0]}` : 'No expense recorded'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Category Breakdown & Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doughnut Chart */}
        <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
            CATEGORY SPENDING ALLOCATION
          </h3>
          <div className="py-2 my-auto">
            <DoughnutChart
              data={doughnutData}
              totalLabel="Spent"
              totalValue={formatCurrency(totalExpense)}
              size={190}
            />
          </div>
          <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs">
            {doughnutData.slice(0, 4).map((d, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{d.label}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(d.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Category Table */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
            EXPENSE DISTRIBUTION BY CATEGORY
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-2 pl-2">Category</th>
                  <th className="pb-2 text-right">Transactions</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2 pr-2 text-right">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {Object.entries(categoryBreakdown).map(([catId, amount]) => {
                  const cat = categories.find((c) => c.id === catId);
                  const count = filteredTxs.filter((t) => t.categoryId === catId).length;
                  const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;

                  return (
                    <tr key={catId} className="hover:bg-white/5">
                      <td className="py-2.5 pl-2">
                        <div className="flex items-center gap-2">
                          <span>{cat?.icon || '📁'}</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{cat?.title || 'Other'}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right text-slate-500 dark:text-slate-400">{count}</td>
                      <td className="py-2.5 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(amount)}</td>
                      <td className="py-2.5 pr-2 text-right">
                        <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                          {pct}%
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
    </div>
  );
};
