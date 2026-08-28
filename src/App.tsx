import React, { useState, useEffect } from 'react';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import { Navbar } from './components/Navbar';
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
import { AddTransactionModal } from './components/AddTransactionModal';
import { NaturalLanguageInputModal } from './components/NaturalLanguageInputModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Menu, Sparkles } from 'lucide-react';
import { TransactionType } from './types';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialType, setAddModalInitialType] = useState<TransactionType>('Expense');
  const [isNlModalOpen, setIsNlModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Dark Mode (Default to true for luminous Frosted Glass effect)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme_mode');
    if (saved) return saved === 'dark';
    return true; // Default dark for Frosted Glass aesthetic
  });

  useEffect(() => {
    localStorage.setItem('theme_mode', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleOpenAddModal = (type: TransactionType = 'Expense') => {
    setAddModalInitialType(type);
    setIsAddModalOpen(true);
  };

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
    <div className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Navbar */}
      <Navbar
        onOpenNaturalLanguage={() => setIsNlModalOpen(true)}
        onOpenAddTransaction={() => handleOpenAddModal('Expense')}
        onToggleNotifications={() => setIsNotificationOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onNavigateToSettings={() => setActiveTab('settings')}
        onNavigateToAiChat={() => setActiveTab('ai-chat')}
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
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {/* Mobile hamburger header bar */}
          <div className="md:hidden flex items-center justify-between pb-4 mb-3 border-b border-white/10 dark:border-white/10">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/40 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs"
            >
              <Menu className="w-4 h-4 text-sky-400" />
              <span>Menu</span>
            </button>
            <span className="text-xs font-bold capitalize text-slate-400 tracking-wider uppercase">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          {renderContent()}
        </main>
      </div>

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
