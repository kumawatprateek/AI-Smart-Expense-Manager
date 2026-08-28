import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Layers,
  PieChart,
  CalendarClock,
  BarChart3,
  Target,
  Bot,
  TrendingUp,
  Trophy,
  Settings,
  Sparkles,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { user } = useExpense();
  const isAdmin = user.role === 'admin' || user.email.toLowerCase().includes('admin');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <Layers className="w-4 h-4" /> },
    { id: 'budgets', label: 'Category Budgets', icon: <PieChart className="w-4 h-4" /> },
    { id: 'recurring', label: 'Recurring Bills', icon: <CalendarClock className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'goals', label: 'Savings Goals', icon: <Target className="w-4 h-4" /> },
    {
      id: 'ai-chat',
      label: 'AI Financial Assistant',
      icon: <Bot className="w-4 h-4 text-indigo-500" />,
      badge: 'AI',
    },
    {
      id: 'prediction',
      label: 'Expense Predictions',
      icon: <TrendingUp className="w-4 h-4 text-purple-500" />,
      badge: 'ML',
    },
    {
      id: 'gamification',
      label: 'Discipline & Badges',
      icon: <Trophy className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: <ShieldCheck className="w-4 h-4 text-amber-500" />,
      badge: isAdmin ? 'ADMIN' : 'PANEL',
      highlight: true,
    },
    { id: 'settings', label: 'Settings & Profile', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-white/60 dark:border-white/10 bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto flex flex-col justify-between p-3.5 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1.5 block">
            Navigation Menu
          </span>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-[0_0_16px_rgba(56,189,248,0.35)]'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-slate-950 font-bold' : ''}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                      isActive
                        ? 'bg-slate-950/20 text-slate-950'
                        : 'bg-sky-500/15 border border-sky-400/30 text-sky-700 dark:text-sky-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Pro AI Assistant Mini Card at Sidebar Bottom */}
        <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/40 dark:border-white/10 mt-4 space-y-2 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-xs text-sky-900 dark:text-sky-200">
              Gemini 3.7 Intelligence
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
            Categorizes notes, catches anomalies, and predicts future spending automatically.
          </p>
        </div>
      </aside>
    </>
  );
};
