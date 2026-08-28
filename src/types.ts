export type TransactionType = 'Expense' | 'Income';

export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
  currencySymbol: string;
  monthlyIncomeTarget?: number;
  savingsRateTarget?: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  userId: string;
  title: string;
  type: TransactionType;
  icon: string;
  color: string;
  isActive: boolean;
  isDefault?: boolean;
  createdDate: string;
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  date: string; // YYYY-MM-DD
  amount: number;
  note: string;
  type: TransactionType;
  createdDate: string;
  updatedDate?: string;
  isRecurringGenerated?: boolean;
  isUnusual?: boolean;
  unusualReason?: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  startDate?: string;
  endDate?: string;
  monthYear?: string;
  createdDate: string;
}

export type RecurringFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
export type FrequencyType = RecurringFrequency;

export interface RecurringTransaction {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  note: string;
  frequency: RecurringFrequency;
  startDate?: string;
  nextDueDate: string;
  isActive: boolean;
  autoRecord: boolean;
  lastProcessedDate?: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD
  icon: string;
  color?: string;
  createdDate?: string;
  status: 'In Progress' | 'Completed' | 'Paused';
}

export interface AISavingsAdvice {
  monthlySavingsRequired: number;
  feasibilityAssessment: string;
  categoryCuts: {
    category: string;
    currentSpend?: number;
    suggestedCut: number;
    reason: string;
  }[];
  tips: string[];
}

export type AlertType = 'budget_warning' | 'budget_exceeded' | 'unusual_expense' | 'recurring_due' | 'high_spending' | 'goal_reached' | 'streak_milestone';

export interface SmartNotification {
  id: string;
  userId: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  relatedId?: string;
  actionUrl?: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'tip' | 'success' | 'trend';
  category?: string;
  amount?: number;
  percentageChange?: number;
  actionPrompt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  badgeIcon?: string;
  badgeColor?: string;
  category: 'saving' | 'budget' | 'consistency' | 'milestone';
  targetValue: number;
  currentValue: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'assistant';
  text: string;
  timestamp: string;
  structuredData?: {
    type?: 'breakdown' | 'savings_plan' | 'prediction' | 'advice';
    items?: { label: string; value: string | number; change?: string }[];
  };
}

export type ChatMessage = AIChatMessage;

export interface SavingChallenge {
  id: string;
  title: string;
  description: string;
  dailySpendingLimit: number;
  totalDays: number;
  startDate: string;
  daysProgress: { dayNumber: number; date: string; spent: number; success: boolean }[];
  status: 'active' | 'completed' | 'failed';
}

export interface FinancialSummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
  currentMonthName: string;
  currentMonthIncome: number;
  currentMonthExpense: number;
  previousMonthExpense: number;
  categoryExpenses: { [categoryTitle: string]: number };
  categoryBudgets: { [categoryTitle: string]: { budget: number; spent: number; pct: number } };
  recurringTotal: number;
  goals: { title: string; target: number; saved: number; deadline: string }[];
  topExpenses: { note: string; amount: number; category: string; date: string }[];
  recentUnusual: { note: string; amount: number; category: string; average: number }[];
}
