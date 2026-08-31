import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  ArrowRight,
  TrendingUp,
  Brain,
  Target,
  Trophy,
  CheckCircle2,
  Users,
  Flame,
  UserPlus,
  LogIn,
  Sun,
  Moon,
  Laptop,
  ChevronDown,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ThemeMode } from './Navbar';

interface LandingViewProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onExploreDemo: (initialTab?: string) => void;
  themeMode: ThemeMode;
  onSetThemeMode: (mode: ThemeMode) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onOpenAuth,
  onExploreDemo,
  themeMode,
  onSetThemeMode,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f6fb] dark:bg-[#070d1e] text-slate-900 dark:text-slate-100 transition-colors font-sans">
      {/* Top Website Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#070d1e] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#002970] text-[#00BAF2] border border-[#00BAF2]/30 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#00BAF2]" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#002970] dark:text-white flex items-center gap-1">
                Expense<span className="text-[#00BAF2]">AI</span>
              </span>
              <span className="hidden sm:block text-[9px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                Personal Finance & Intelligence
              </span>
            </div>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-[#00BAF2] transition-colors">
              Features
            </a>
            <a href="#demo" className="hover:text-[#00BAF2] transition-colors">
              Live Preview
            </a>
            <a href="#security" className="hover:text-[#00BAF2] transition-colors">
              Data Privacy
            </a>
          </nav>

          {/* Action Auth & Theme Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                title={`Theme: ${themeMode.toUpperCase()}`}
                className="flex items-center gap-1 p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer text-xs"
              >
                {themeMode === 'light' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                {themeMode === 'dark' && <Moon className="w-3.5 h-3.5 text-[#00BAF2]" />}
                {themeMode === 'system' && <Laptop className="w-3.5 h-3.5 text-slate-500" />}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isThemeMenuOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-700 shadow-lg py-1 z-50 animate-fadeIn text-xs"
                  onClick={() => setIsThemeMenuOpen(false)}
                >
                  <button
                    onClick={() => onSetThemeMode('light')}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light Mode</span>
                  </button>
                  <button
                    onClick={() => onSetThemeMode('dark')}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <Moon className="w-3.5 h-3.5 text-[#00BAF2]" />
                    <span>Dark Mode</span>
                  </button>
                  <button
                    onClick={() => onSetThemeMode('system')}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <Laptop className="w-3.5 h-3.5 text-slate-500" />
                    <span>System Default</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>Log In</span>
            </button>

            <button
              onClick={() => onOpenAuth('register')}
              className="flex items-center gap-1 px-3.5 sm:px-5 py-2 rounded-lg bg-[#002970] dark:bg-[#00BAF2] hover:opacity-95 text-xs font-black text-white dark:text-[#001A4D] shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Release Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00BAF2]/10 border border-[#00BAF2]/30 text-[#008db8] dark:text-[#00BAF2] text-xs font-black uppercase tracking-wider mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart AI Financial Assistant • Multi-User Isolated Storage</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#002970] dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Intelligent Money Management,{' '}
          <span className="text-[#00BAF2]">
            Private to Every User.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Record expenses effortlessly with speech or text, receive automated anomaly detection, manage monthly budgets, and grow your savings with 100% private, user-isolated ledgers.
        </p>

        {/* Primary Call to Action Buttons */}
        <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={() => onOpenAuth('register')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#002970] dark:bg-[#00BAF2] text-white dark:text-[#001A4D] font-black text-sm shadow-sm hover:opacity-95 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenAuth('login')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-[#0f1a36] hover:bg-slate-50 dark:hover:bg-[#152347] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-xs transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-[#00BAF2]" />
            <span>Sign In to Account</span>
          </button>
        </div>

        {/* Quick Direct Launch Options */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Instant Direct Access:</span>
          <button
            onClick={() => onExploreDemo('dashboard')}
            className="text-[#008db8] dark:text-[#00BAF2] font-bold hover:underline cursor-pointer"
          >
            Launch Dashboard
          </button>
          <span>•</span>
          <button
            onClick={() => onExploreDemo('ai-chat')}
            className="text-[#00BAF2] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Open AI Assistant Directly</span>
          </button>
        </div>

        {/* Clean Dashboard Preview Card */}
        <div id="demo" className="mt-10 sm:mt-12 rounded-2xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00BAF2]" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Expense AI Clean Dashboard
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Isolated User Storage</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b142c] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Monthly Income</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₹45,000</div>
              <span className="text-[10px] text-slate-400">Linked to personal budget</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b142c] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Monthly Expenses</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">₹22,469</div>
              <span className="text-[10px] text-[#008db8] dark:text-[#00BAF2] font-semibold">50% Savings Target</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b142c] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Discipline Streak</span>
              <div className="text-xl font-black text-amber-500 mt-0.5 flex items-center gap-1">
                <Flame className="w-4 h-4" />
                <span>14 Days</span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">3 Badges Unlocked</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#002970] dark:text-white tracking-tight">
            Comprehensive Personal Finance Features
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Clean, high-performance financial management tools with zero clutter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1 */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#00BAF2] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#00BAF2]/15 text-[#008db8] dark:text-[#00BAF2] flex items-center justify-center font-bold mb-3">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Natural Language Voice Entry
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Say or type "Paid ₹350 for groceries at store" — the AI parses the exact amount, date, payment method, and category automatically.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#00BAF2] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#002970]/10 dark:bg-[#00BAF2]/15 text-[#002970] dark:text-[#00BAF2] flex items-center justify-center font-bold mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              User-Isolated Storage
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Every registered account receives a dedicated private ledger. Your transactions, categories, and targets are never shared or mixed with other users.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#00BAF2] transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Predictive Cashflow Forecasts
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Statistical algorithms project your end-of-month spending velocity, category inflation risks, and upcoming balance trajectory.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#00BAF2] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#00BAF2]/15 text-[#008db8] dark:text-[#00BAF2] flex items-center justify-center font-bold mb-3">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Savings Goals & Milestones
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Set customized savings targets with progress meters, timeline estimates, deposit tracking, and milestone celebrations.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#00BAF2] transition-all">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold mb-3">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              30-Day Money Challenge
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Gamified discipline tracking with daily spending ceilings, logging streaks, unlocked badges, and milestone multipliers.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#00BAF2] transition-all">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold mb-3">
              <Sparkles className="w-5 h-5 text-[#00BAF2]" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Interactive Financial AI Advisor
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Ask deep questions about your spending patterns, tax planning, budgeting strategies, and get personalized mathematical financial advice in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-6 sm:p-10 rounded-2xl bg-[#002970] dark:bg-[#0b142c] border border-[#00BAF2]/30 text-white shadow-sm">
          <h2 className="text-xl sm:text-2xl font-black">
            Ready to organize your finances with precision?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-sky-100/90 max-w-lg mx-auto">
            Create your account now to start tracking your income and expenses with intelligent AI assistance.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#00BAF2] hover:bg-[#009fd0] text-[#002970] font-black text-xs sm:text-sm transition-all cursor-pointer"
            >
              Sign Up Free
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Log In to Workspace
            </button>
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Expense AI • Professional Personal Financial Management.</p>
        </footer>
      </section>
    </div>
  );
};
