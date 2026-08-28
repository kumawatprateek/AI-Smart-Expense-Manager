import React from 'react';
import {
  Sparkles,
  Shield,
  ArrowRight,
  TrendingUp,
  PieChart,
  Brain,
  Target,
  Trophy,
  CheckCircle2,
  Lock,
  Zap,
  Users,
  Layers,
  BarChart3,
  Flame,
  ChevronRight,
  UserPlus,
  LogIn,
  KeyRound,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

interface LandingViewProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onExploreDemo: (role?: 'admin' | 'user') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onOpenAuth,
  onExploreDemo,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500/30 selection:text-sky-200 relative overflow-hidden font-sans">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Website Navigation Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/70 border-b border-white/10 px-4 sm:px-8 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                Expense <span className="text-sky-400">AI</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Smart Financial Intelligence
              </span>
            </div>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-sky-400 transition-colors">
              Features
            </a>
            <a href="#ai-capabilities" className="hover:text-sky-400 transition-colors">
              AI Intelligence
            </a>
            <a href="#security" className="hover:text-sky-400 transition-colors">
              Data Privacy
            </a>
            <a href="#demo" className="hover:text-sky-400 transition-colors">
              Live Demo
            </a>
          </nav>

          {/* Action Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-400" />
              <span>Log In</span>
            </button>

            <button
              onClick={() => onOpenAuth('register')}
              className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        {/* Release Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-User Isolated Finance Platform • Gemini AI 3.7</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none max-w-4xl mx-auto">
          Smart AI Expense Tracking,{' '}
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
            Private to Every User.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Log expenses effortlessly with natural language voice prompts, receive real-time overspending alerts, and forecast future monthly savings with 100% private user-scoped ledgers.
        </p>

        {/* Primary Call to Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <button
            onClick={() => onOpenAuth('register')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-sky-500/30 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Your Account Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenAuth('login')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/15 text-slate-200 font-bold text-sm backdrop-blur-md transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-sky-400" />
            <span>Sign In to Existing ID</span>
          </button>
        </div>

        {/* Quick Demo Fill Pill */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>Or explore instantly:</span>
          <button
            onClick={() => onExploreDemo('user')}
            className="text-sky-400 hover:text-sky-300 font-bold underline underline-offset-4 cursor-pointer"
          >
            Demo User Workspace
          </button>
          <span>•</span>
          <button
            onClick={() => onExploreDemo('admin')}
            className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4 cursor-pointer"
          >
            Super Admin Portal
          </button>
        </div>

        {/* Live App Mock Preview Showcase */}
        <div className="mt-12 sm:mt-16 p-2 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 text-left border border-white/5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-400 ml-2">
                  Expense AI Dashboard • User Segregated Workspace
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Isolated Owner Data</span>
              </div>
            </div>

            {/* Mock stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Monthly Income</span>
                <div className="text-xl font-black text-emerald-400 mt-1">₹45,000</div>
                <span className="text-[10px] text-slate-400">Target Budget Linked</span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase">August Expenses</span>
                <div className="text-xl font-black text-rose-400 mt-1">₹22,469</div>
                <span className="text-[10px] text-amber-400 font-semibold">50% of Income Used</span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Discipline Streak</span>
                <div className="text-xl font-black text-amber-400 mt-1 flex items-center gap-1.5">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <span>14 Days</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">3 Badges Earned</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Precision, Privacy & Financial Growth
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Every feature is built to give you effortless insights into your money while keeping your records strictly isolated to your own account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-sky-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Natural Language AI Entry</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Type or speak phrases like "Paid ₹450 for lunch with team" — Gemini AI automatically detects the amount, category, date, and note.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Owner-Isolated Data Storage</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Never see other users' transactions. Every registered ID receives a private partition for categories, transactions, budgets, and goals.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-amber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Predictive Cashflow Forecasts</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Dynamic statistical analysis and Gemini AI models project your end-of-month spending, category inflation, and upcoming savings rate.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Savings Goals & Milestones</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Create customizable goals with deadline countdowns, target milestones, and deposit tracking with confetti celebrations upon completion.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-rose-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">30-Day Money Challenge</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Gamified discipline engine with daily spending caps, streak counters, badges, and achievement multipliers to make saving fun.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Super Admin Control Center</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Dedicated admin portal with live user directories, account management, audit security trails, and AI resilience monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action footer banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center border-t border-white/10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 border border-white/15 backdrop-blur-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Take Command of Your Financial Future?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Join thousands tracking their expenses with AI intelligence and private data segregation.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
            >
              Sign Up Now • Free Account
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Log In to Existing Workspace
            </button>
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Expense AI. Built with Gemini AI & Frosted Glass Intelligence.</p>
        </footer>
      </section>
    </div>
  );
};
