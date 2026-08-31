import React, { useState, useEffect } from 'react';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import { Navbar, ThemeMode } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { CategoriesView } from './components/CategoriesView';
import { BudgetsView } from './components/BudgetsView';
import { RecurringView } from './components/RecurringView';
import { ReportsView } from './components/ReportsView';
import { SavingsGoalsView } from './components/SavingsGoalsView';
import { AIChatView } from './components/AIChatView';
import { PredictionView } from './components/PredictionView';
import { GamificationView } from './components/GamificationView';
import { SettingsView } from './components/SettingsView';
import { AuthView } from './components/AuthView';
import { LandingView } from './components/LandingView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { NaturalLanguageInputModal } from './components/NaturalLanguageInputModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Menu, X, LayoutDashboard, Receipt, Plus, Sparkles } from 'lucide-react';
import { TransactionType } from './types';
import { INITIAL_USER } from './data/seedData';

// Helper to sanitize tab from hash/query
const sanitizeTab = (raw: string): string => {
  const clean = raw.toLowerCase().replace(/^[#/]+/, '').replace(/^tab=/, '').trim();
  if (clean === 'ai' || clean === 'assistant' || clean === 'chat' || clean === 'ai-chat' || clean === 'aichat') {
    return 'ai-chat';
  }
  const validTabs = [
    'dashboard',
    'transactions',
    'categories',
    'budgets',
    'recurring',
    'reports',
    'goals',
    'ai-chat',
    'prediction',
    'gamification',
    'settings',
  ];
  return validTabs.includes(clean) ? clean : 'dashboard';
};

const MainLayout: React.FC = () => {
  const { token, user, setUser, setToken, logoutUser } = useExpense();
  
  // Read initial activeTab from URL hash or query param (e.g. #ai-chat, #ai, ?tab=ai-chat)
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = new URLSearchParams(window.location.search);
      const tabParam = search.get('tab');
      if (tabParam) return sanitizeTab(tabParam);
      if (hash) return sanitizeTab(hash);
    }
    return 'dashboard';
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialType, setAddModalInitialType] = useState<TransactionType>('Expense');
  const [isNlModalOpen, setIsNlModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Synchronize hash with activeTab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentHash = window.location.hash.replace(/^#/, '');
      if (currentHash !== activeTab) {
        window.history.replaceState(null, '', `#${activeTab}`);
      }
    }
  }, [activeTab]);

  // Listen to browser back/forward and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const newTab = sanitizeTab(window.location.hash);
      setActiveTab(newTab);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 3-Way Theme Mode: 'light' | 'dark' | 'system'
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('app_theme_mode') as ThemeMode;
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    return 'system';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen to OS Dark Mode changes in real-time
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute effective dark state
  const isDark = themeMode === 'system' ? systemPrefersDark : themeMode === 'dark';

  useEffect(() => {
    localStorage.setItem('app_theme_mode', themeMode);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode, isDark]);

  const handleOpenAddModal = (type: TransactionType = 'Expense') => {
    setAddModalInitialType(type);
    setIsAddModalOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleExploreDemo = (initialTab: string = 'dashboard') => {
    setUser(INITIAL_USER);
    setToken('demo_user_jwt_token');
    const target = sanitizeTab(initialTab);
    setActiveTab(target);
    window.history.replaceState(null, '', `#${target}`);
  };

  // If not authenticated, display the Website Landing Page with Login and Sign Up buttons!
  if (!token) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] dark:bg-[#070d1e] text-slate-900 dark:text-slate-100 transition-colors selection:bg-[#00BAF2]/30">
        <LandingView
          onOpenAuth={handleOpenAuth}
          onExploreDemo={handleExploreDemo}
          themeMode={themeMode}
          onSetThemeMode={setThemeMode}
        />

        {/* Authentication Modal */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
            <div className="relative w-full max-w-md">
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute right-3 top-3 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <AuthView
                initialMode={authMode}
                onSuccess={() => {
                  setIsAuthModalOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenNaturalLanguage={() => setIsNlModalOpen(true)}
            onOpenAddTransaction={(t) => handleOpenAddModal(t || 'Expense')}
          />
        );
      case 'transactions':
        return (
          <TransactionsView
            onOpenAddModal={() => handleOpenAddModal('Expense')}
            onOpenNaturalLanguage={() => setIsNlModalOpen(true)}
          />
        );
      case 'categories':
        return <CategoriesView />;
      case 'budgets':
        return <BudgetsView />;
      case 'recurring':
        return <RecurringView />;
      case 'reports':
        return <ReportsView />;
      case 'goals':
        return <SavingsGoalsView />;
      case 'ai-chat':
        return <AIChatView />;
      case 'prediction':
        return <PredictionView />;
      case 'gamification':
        return <GamificationView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenNaturalLanguage={() => setIsNlModalOpen(true)}
            onOpenAddTransaction={(t) => handleOpenAddModal(t || 'Expense')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f4f6fb] dark:bg-[#070d1e] text-slate-900 dark:text-slate-100 transition-colors selection:bg-[#00BAF2]/30">
      {/* Top Navbar */}
      <Navbar
        onOpenNaturalLanguage={() => setIsNlModalOpen(true)}
        onOpenAddTransaction={() => handleOpenAddModal('Expense')}
        onToggleNotifications={() => setIsNotificationOpen(true)}
        themeMode={themeMode}
        onSetThemeMode={setThemeMode}
        onNavigateToSettings={() => setActiveTab('settings')}
        onNavigateToAiChat={() => setActiveTab('ai-chat')}
        onOpenAuthModal={() => handleOpenAuth('login')}
        onLogout={logoutUser}
      />

      {/* Main App Container */}
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
          {/* Mobile hamburger header bar */}
          <div className="md:hidden flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0f1a36] border border-slate-200 dark:border-slate-800 text-xs font-bold text-[#002970] dark:text-[#00BAF2] shadow-xs cursor-pointer active:scale-95 transition-transform"
            >
              <Menu className="w-4 h-4" />
              <span>All Tabs</span>
            </button>
            <span className="text-xs font-extrabold capitalize text-slate-700 dark:text-slate-200 tracking-wide uppercase">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Fixed for quick touch access on phones) */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#070d1e]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg safe-bottom"
      >
        <button
          onClick={() => {
            setActiveTab('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-[#002970] dark:text-[#00BAF2] font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] leading-none">Home</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('transactions');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'transactions'
              ? 'text-[#002970] dark:text-[#00BAF2] font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span className="text-[10px] leading-none">Ledger</span>
        </button>

        {/* Central Floating Quick Action (Add / AI) */}
        <button
          onClick={() => handleOpenAddModal('Expense')}
          className="w-11 h-11 -mt-5 rounded-full bg-gradient-to-tr from-[#002970] to-[#00BAF2] text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#070d1e] active:scale-90 transition-transform cursor-pointer"
          aria-label="Add Transaction"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={() => {
            setActiveTab('ai-chat');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'ai-chat'
              ? 'text-[#002970] dark:text-[#00BAF2] font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] leading-none">AI Advisor</span>
        </button>

        <button
          onClick={() => {
            setIsMobileSidebarOpen(true);
          }}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px] leading-none">More</span>
        </button>
      </nav>

      {/* Authentication / Account Switch Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute right-3 top-3 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <AuthView
              initialMode={authMode}
              onSuccess={() => {
                setIsAuthModalOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialType={addModalInitialType}
      />

      {/* Natural Language Input Modal */}
      <NaturalLanguageInputModal
        isOpen={isNlModalOpen}
        onClose={() => setIsNlModalOpen(false)}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ExpenseProvider>
      <MainLayout />
    </ExpenseProvider>
  );
}
