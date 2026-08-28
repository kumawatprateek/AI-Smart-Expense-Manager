import React, { useState } from 'react';
import { Trophy, Award, Flame, CheckCircle2, RotateCcw, Sparkles, Target, Star, Lock, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useExpense } from '../context/ExpenseContext';

export const GamificationView: React.FC = () => {
  const { achievements, savingChallenge, toggleChallengeDay, resetChallenge, formatCurrency, currencySymbol } = useExpense();

  const [customLimit, setCustomLimit] = useState(savingChallenge.dailySpendingLimit || 400);

  const handleTestConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const completedDaysCount = savingChallenge.daysProgress.filter((d) => d.success).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Discipline, Challenges & Badges
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-400/20 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              Level 4 Financier
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Build consistent financial habits through actionable 7-day milestones and unlockable badges
          </p>
        </div>

        <button
          onClick={handleTestConfetti}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-400/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/20 transition-all cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Celebrate Progress 🎉</span>
        </button>
      </div>

      {/* 7-Day Saving Challenge Interactive Card */}
      <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 text-white shadow-xl relative overflow-hidden dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 text-2xl shadow-inner border border-white/10">
                🔥
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Active Challenge</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{savingChallenge.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Spend under {currencySymbol}{savingChallenge.dailySpendingLimit}/day for 7 consecutive days to build lasting budget discipline.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => resetChallenge(customLimit)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-800 dark:text-white border border-white/15 text-xs font-medium flex items-center gap-1 backdrop-blur-sm transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Challenge
              </button>
            </div>
          </div>

          {/* 7-Day Interactive Progression Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-2">
            {savingChallenge.daysProgress.map((day) => (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => toggleChallengeDay(day.dayNumber)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[95px] ${
                  day.success
                    ? 'bg-emerald-500/20 border-emerald-400/50 shadow-[0_0_15px_rgba(74,222,128,0.2)] text-emerald-300'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-800 dark:text-white'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  Day {day.dayNumber}
                </span>

                <div className="my-1">
                  {day.success ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md animate-in zoom-in-50">
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                      {currencySymbol}{savingChallenge.dailySpendingLimit}
                    </div>
                  )}
                </div>

                <span className="text-[10px] font-medium opacity-90">
                  {day.success ? 'Success! 🎉' : 'Tap when kept'}
                </span>
              </button>
            ))}
          </div>

          {/* Progress summary banner */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-600 dark:text-slate-300">
            <span>
              <strong>{completedDaysCount} of 7 days completed</strong> ({Math.round((completedDaysCount / 7) * 100)}%)
            </span>
            <span className="text-sky-400 font-semibold">
              {completedDaysCount === 7 ? '🏆 Challenge Conquered!' : `${7 - completedDaysCount} days remaining`}
            </span>
          </div>
        </div>
      </div>

      {/* Achievements / Trophy Cabinet */}
      <div className="p-6 rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Achievement Trophy Cabinet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Earn badges automatically as you log expenses, stick to budgets, and reach savings goals
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-400/20 text-xs font-bold">
            {unlockedCount} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {achievements.map((ach) => {
            const pct = Math.min(100, Math.round((ach.currentValue / ach.targetValue) * 100));

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all ${
                  ach.isUnlocked
                    ? 'border-amber-400/40 bg-amber-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.1)]'
                    : 'border-white/10 bg-white/5 backdrop-blur-md opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs border ${
                      ach.isUnlocked ? 'bg-amber-500/20 border-amber-400/30 text-amber-300' : 'bg-white/5 border-white/10 grayscale'
                    }`}
                  >
                    {ach.badgeIcon}
                  </div>
                  {ach.isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-400 text-[10px] font-semibold flex items-center gap-1 border border-white/10">
                      <Lock className="w-3 h-3" /> In Progress
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{ach.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {ach.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>Progress: {ach.currentValue} / {ach.targetValue}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        ach.isUnlocked ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-sky-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
