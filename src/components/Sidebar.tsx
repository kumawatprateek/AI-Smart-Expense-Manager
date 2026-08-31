import React, { useEffect } from 'react';
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
  X,
} from 'lucide-react';

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
  // Prevent background scroll on mobile when sidebar is open
  useEffect(() => {
    if (isOpenMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpenMobile]);

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
      label: 'AI Assistant',
      icon: <Bot className="w-4 h-4 text-sky-500" />,
      badge: 'AI',
    },
    {
      id: 'prediction',
      label: 'Expense Forecast',
      icon: <TrendingUp className="w-4 h-4 text-[#00BAF2]" />,
      badge: 'ML',
    },
    {
      id: 'gamification',
      label: 'Discipline & Badges',
      icon: <Trophy className="w-4 h-4 text-amber-500" />,
    },
    { id: 'settings', label: 'Settings & Profile', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop with Blur Effect and Smooth Fade Transition */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-all duration-300 md:hidden ${
          isOpenMobile
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      {/* Sidebar Container with Smooth Slide-in Transform */}
      <aside
        id="app-sidebar"
        className={`fixed md:sticky top-0 md:top-16 left-0 z-50 md:z-30 h-screen md:h-[calc(100vh-4rem)] w-72 sm:w-80 md:w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b142c] shadow-2xl md:shadow-none transition-transform duration-300 ease-out md:translate-x-0 overflow-y-auto flex flex-col justify-between p-4 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-1">
          {/* Mobile Drawer Header with Close Button */}
          <div className="md:hidden flex items-center justify-between pb-3.5 mb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#002970] text-[#00BAF2] border border-[#00BAF2]/30 flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-[#00BAF2]" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-[#002970] dark:text-white tracking-tight">
                  Expense<span className="text-[#00BAF2]">AI</span>
                </span>
                <span className="block text-[9px] uppercase font-bold text-slate-400">
                  Navigation
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <span className="hidden md:block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 px-3 py-1.5">
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#002970] dark:bg-[#00BAF2] text-white dark:text-[#001A4D] font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white dark:text-[#001A4D]' : ''}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#001A4D]'
                        : 'bg-[#00BAF2]/10 border border-[#00BAF2]/30 text-[#008db8] dark:text-[#00BAF2]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Paytm-styled Intelligence Badge at Sidebar Bottom */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 mt-4 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#00BAF2] text-[#002970] flex items-center justify-center font-bold">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="font-bold text-xs text-[#002970] dark:text-[#00BAF2]">
              AI Financial Core
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Automated spending insights, voice entry, and private ledger segregation.
          </p>
        </div>
      </aside>
    </>
  );
};

