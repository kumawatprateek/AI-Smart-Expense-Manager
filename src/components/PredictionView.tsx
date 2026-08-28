import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, RefreshCw, Loader2, ArrowRight, BarChart2 } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { ComparisonBarChart } from './Charts';

export const PredictionView: React.FC = () => {
  const { financialSummary, formatCurrency, currencySymbol, categories } = useExpense();

  const [isLoading, setIsLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<{
    predictedNextMonthTotal: number;
    confidenceRange: { min: number; max: number };
    categoryPredictions: { category: string; predictedAmount: number; trend: 'up' | 'down' | 'stable'; reason: string }[];
    riskFactors: string[];
    recommendedBuffer: number;
  } | null>(null);

  const fetchPrediction = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          financialSummary,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPredictionData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  const chartData = [
    { label: 'Jun (Actual)', income: 35000, expense: 17300 },
    { label: 'Jul (Actual)', income: 35000, expense: 20080 },
    { label: 'Aug (Current)', income: 43500, expense: financialSummary.currentMonthExpense || 23149 },
    {
      label: 'Sep (Forecast)',
      income: 45000,
      expense: predictionData ? predictionData.predictedNextMonthTotal : 24200,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              AI Expense Forecast & Prediction
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-400/20">
              Gemini ML Model
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Statistical moving average combined with LLM behavioral analysis to forecast next month's outflow
          </p>
        </div>
        <button
          onClick={fetchPrediction}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>Re-compute Forecast</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-sky-400" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Running 3-Month Moving Average & Predictive Regressions...
          </p>
          <p className="text-xs text-slate-400 max-w-sm">
            Synthesizing category variance, inflation seasonality, and recurring bill schedules.
          </p>
        </div>
      ) : predictionData ? (
        <>
          {/* Top Prediction Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                Forecasted Next Month Total (September)
              </span>
              <div className="text-3xl font-extrabold mt-1">
                {formatCurrency(predictionData.predictedNextMonthTotal)}
              </div>
              <span className="text-xs opacity-80 mt-1 block">
                Confidence Band: {formatCurrency(predictionData.confidenceRange.min)} – {formatCurrency(predictionData.confidenceRange.max)}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Recommended Contingency Buffer
              </span>
              <div className="text-3xl font-bold text-amber-500 mt-1">
                {formatCurrency(predictionData.recommendedBuffer || 2500)}
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                Safety margin for unexpected discretionary spikes
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Projected Net Savings
              </span>
              <div className="text-3xl font-bold text-emerald-500 mt-1">
                {formatCurrency(45000 - predictionData.predictedNextMonthTotal)}
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                Assuming steady monthly baseline income
              </span>
            </div>
          </div>

          {/* Historical vs Forecast Chart */}
          <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  HISTORICAL TRAJECTORY VS PREDICTED OUTFLOW
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Actuals compared with September predictive horizon
                </p>
              </div>
            </div>

            <ComparisonBarChart
              data={chartData}
              formatValue={(v) => `${currencySymbol}${v.toLocaleString()}`}
              height={220}
            />
          </div>

          {/* Category Breakdown Predictions */}
          <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
              PREDICTED SPENDING BY CATEGORY
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {predictionData.categoryPredictions.map((catPred, idx) => {
                const matchedCat = categories.find(
                  (c) => c.title.toLowerCase() === catPred.category.toLowerCase()
                );
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{matchedCat?.icon || '📦'}</span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {catPred.category}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          catPred.trend === 'up'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : catPred.trend === 'down'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        {catPred.trend === 'up' ? '↗ Increasing' : catPred.trend === 'down' ? '↘ Decreasing' : '→ Stable'}
                      </span>
                    </div>

                    <div className="text-base font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(catPred.predictedAmount)}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {catPred.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Risk Drivers and Buffer Advice */}
          {predictionData.riskFactors && predictionData.riskFactors.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-500/10 backdrop-blur-xl border border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Identified Volatility & Risk Drivers</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-900 dark:text-amber-200 list-disc list-inside">
                {predictionData.riskFactors.map((risk, i) => (
                  <li key={i} className="leading-relaxed">{risk}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};
