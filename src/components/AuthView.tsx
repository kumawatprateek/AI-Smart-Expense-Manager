import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Sparkles, Shield, UserCheck, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';

interface AuthViewProps {
  onSuccess?: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, initialMode = 'login' }) => {
  const { setUser, setToken } = useExpense();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  React.useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login' 
        ? { email, password }
        : { name, email, password, role };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      // Update state
      setUser(data.user);
      setToken(data.token);
      setSuccessMessage(mode === 'login' ? `Welcome back, ${data.user.name}!` : `Account created successfully! Welcome to Expense AI.`);

      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoRole: 'admin' | 'user') => {
    if (demoRole === 'admin') {
      setEmail('admin@expenseai.com');
      setPassword('admin123');
      setName('System Administrator');
      setRole('admin');
    } else {
      setEmail('kumawatprateek008@gmail.com');
      setPassword('user123');
      setName('Prateek Kumawat');
      setRole('user');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl transition-all">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-lg shadow-sky-500/25 mb-4 text-white">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {mode === 'login' 
            ? 'Sign in to access your personal AI finance dashboard'
            : 'Join Expense AI to master your money with smart intelligence'}
        </p>
      </div>

      {/* Quick Demo Pre-fill Pill Selector */}
      <div className="mb-6 p-3 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/50 dark:border-sky-800/40">
        <div className="text-xs font-semibold text-sky-700 dark:text-sky-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Quick Demo One-Click Fill:</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold text-amber-700 dark:text-amber-300 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Demo</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('user')}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-xs font-bold text-sky-700 dark:text-sky-300 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Standard User</span>
          </button>
        </div>
      </div>

      {/* Error / Success feedback banner */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Prateek Kumawat"
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. prateek@example.com"
              className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 pl-10 pr-10 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {mode === 'register' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'user'
                    ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20'
                    : 'bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-200/50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Standard User</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'admin'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                    : 'bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-200/50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Administrator</span>
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create My Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch between Login and Register */}
      <div className="mt-6 text-center pt-4 border-t border-slate-200/60 dark:border-slate-800/80">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {mode === 'login' ? "Don't have an account yet?" : 'Already have an existing account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className="font-bold text-sky-500 dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            {mode === 'login' ? 'Register Now' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};
