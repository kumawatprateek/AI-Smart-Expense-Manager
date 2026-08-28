import { User, Category, Transaction, Budget, RecurringTransaction, SavingsGoal, SmartNotification, Achievement, SavingChallenge } from '../types';

export const INITIAL_USER: User = {
  id: 'user_default',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  currency: 'INR',
  currencySymbol: '₹',
  monthlyIncomeTarget: 45000,
  savingsRateTarget: 40,
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const INITIAL_CATEGORIES: Category[] = [
  // Expense Categories
  { id: 'cat_food', userId: 'user_default', title: 'Food', type: 'Expense', icon: '🍔', color: '#EF4444', isActive: true, isDefault: true, createdDate: '2026-01-01' },
  { id: 'cat_shopping', userId: 'user_default', title: 'Shopping', type: 'Expense', icon: '🛍️', color: '#EC4899', isActive: true, isDefault: true, createdDate: '2026-01-01' },
  { id: 'cat_travel', userId: 'user_default', title: 'Travel', type: 'Expense', icon: '✈️', color: '#3B82F6', isActive: true, isDefault: true, createdDate: '2026-01-01' },
  { id: 'cat_transport', userId: 'user_default', title: 'Transport', type: 'Expense', icon: '🚗', color: '#F59E0B', isActive: true, isDefault: true, createdDate: '2026-01-01' },
  { id: 'cat_bills', userId: 'user_default', title: 'Bills', type: 'Expense', icon: '💡', color: '#8B5CF6', isActive: true, isDefault: true, createdDate: '2026-01-01' },
  { id: 'cat_entertainment', userId: 'user_default', title: 'Entertainment', type: 'Expense', icon: '🎬', color: '#6366F1', isActive: true, isDefault: true, createdDate: '2026-01-01' },
  { id: 'cat_health', userId: 'user_default', title: 'Health', type: 'Expense', icon: '🏥', color: '#10B981', isActive: true, isDefault: true, createdDate: '2026-01-01' },
  { id: 'cat_education', userId: 'user_default', title: 'Education', type: 'Expense', icon: '📚', color: '#14B8A6', isActive: true, isDefault: true, createdDate: '2026-01-01' },
  { id: 'cat_groceries', userId: 'user_default', title: 'Groceries', type: 'Expense', icon: '🛒', color: '#84CC16', isActive: true, isDefault: true, createdDate: '2026-01-01' },
  { id: 'cat_other_exp', userId: 'user_default', title: 'Other', type: 'Expense', icon: '📦', color: '#6B7280', isActive: true, isDefault: true, createdDate: '2026-01-01' },

  // Income Categories
  { id: 'cat_salary', userId: 'user_default', title: 'Salary', type: 'Income', icon: '💰', color: '#10B981', isActive: true, isDefault: true, createdDate: '2026-01-01' },
  { id: 'cat_freelance', userId: 'user_default', title: 'Freelance', type: 'Income', icon: '💻', color: '#3B82F6', isActive: true, isDefault: true, createdDate: '2026-01-01' },
  { id: 'cat_business', userId: 'user_default', title: 'Business', type: 'Income', icon: '🏢', color: '#8B5CF6', isActive: true, isDefault: true, createdDate: '2026-01-01' },
  { id: 'cat_investment', userId: 'user_default', title: 'Investment', type: 'Income', icon: '📈', color: '#F59E0B', isActive: true, isDefault: true, createdDate: '2026-01-01' },
  { id: 'cat_bonus', userId: 'user_default', title: 'Bonus', type: 'Income', icon: '🎁', color: '#EC4899', isActive: true, isDefault: true, createdDate: '2026-01-01' },
  { id: 'cat_other_inc', userId: 'user_default', title: 'Other Income', type: 'Income', icon: '💵', color: '#6B7280', isActive: true, isDefault: true, createdDate: '2026-01-01' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // August 2026 (Current Month)
  { id: 'tx_1', userId: 'user_default', categoryId: 'cat_salary', date: '2026-08-01', amount: 35000, note: 'Monthly Salary Credit', type: 'Income', createdDate: '2026-08-01' },
  { id: 'tx_2', userId: 'user_default', categoryId: 'cat_bills', date: '2026-08-02', amount: 12000, note: 'Apartment Monthly Rent', type: 'Expense', createdDate: '2026-08-02', isRecurringGenerated: true },
  { id: 'tx_3', userId: 'user_default', categoryId: 'cat_groceries', date: '2026-08-03', amount: 1850, note: 'Weekly Supermarket Haul', type: 'Expense', createdDate: '2026-08-03' },
  { id: 'tx_4', userId: 'user_default', categoryId: 'cat_food', date: '2026-08-05', amount: 450, note: 'Dinner with friends at Bistro', type: 'Expense', createdDate: '2026-08-05' },
  { id: 'tx_5', userId: 'user_default', categoryId: 'cat_transport', date: '2026-08-07', amount: 320, note: 'Cab ride to client office', type: 'Expense', createdDate: '2026-08-07' },
  { id: 'tx_6', userId: 'user_default', categoryId: 'cat_freelance', date: '2026-08-10', amount: 8500, note: 'UI Design Consultation Milestone', type: 'Income', createdDate: '2026-08-10' },
  { id: 'tx_7', userId: 'user_default', categoryId: 'cat_shopping', date: '2026-08-12', amount: 2400, note: 'New Running Shoes & Activewear', type: 'Expense', createdDate: '2026-08-12' },
  { id: 'tx_8', userId: 'user_default', categoryId: 'cat_entertainment', date: '2026-08-14', amount: 649, note: 'Netflix & Spotify Family bundle', type: 'Expense', createdDate: '2026-08-14', isRecurringGenerated: true },
  { id: 'tx_9', userId: 'user_default', categoryId: 'cat_food', date: '2026-08-16', amount: 620, note: 'Weekend Sushi Platter delivery', type: 'Expense', createdDate: '2026-08-16' },
  { id: 'tx_10', userId: 'user_default', categoryId: 'cat_bills', date: '2026-08-18', amount: 1450, note: 'Electricity & Air Conditioning bill', type: 'Expense', createdDate: '2026-08-18' },
  { id: 'tx_11', userId: 'user_default', categoryId: 'cat_travel', date: '2026-08-20', amount: 2100, note: 'Weekend roadtrip expressway toll & fuel', type: 'Expense', createdDate: '2026-08-20' },
  { id: 'tx_12', userId: 'user_default', categoryId: 'cat_health', date: '2026-08-22', amount: 850, note: 'Vitamins & prescription refill', type: 'Expense', createdDate: '2026-08-22' },
  { id: 'tx_13', userId: 'user_default', categoryId: 'cat_shopping', date: '2026-08-25', amount: 15000, note: 'Luxury Watch & Designer Jacket purchase', type: 'Expense', createdDate: '2026-08-25', isUnusual: true, unusualReason: 'Transaction amount (₹15,000) is 7.8x higher than your average shopping expense (₹1,920).' },
  { id: 'tx_14', userId: 'user_default', categoryId: 'cat_food', date: '2026-08-27', amount: 350, note: 'Cafe Latte and croissant breakfast', type: 'Expense', createdDate: '2026-08-27' },
  { id: 'tx_15', userId: 'user_default', categoryId: 'cat_food', date: '2026-08-28', amount: 280, note: 'Quick lunch thali', type: 'Expense', createdDate: '2026-08-28' },

  // July 2026 (Previous Month)
  { id: 'tx_j1', userId: 'user_default', categoryId: 'cat_salary', date: '2026-07-01', amount: 35000, note: 'Monthly Salary', type: 'Income', createdDate: '2026-07-01' },
  { id: 'tx_j2', userId: 'user_default', categoryId: 'cat_bills', date: '2026-07-02', amount: 12000, note: 'Monthly Rent', type: 'Expense', createdDate: '2026-07-02' },
  { id: 'tx_j3', userId: 'user_default', categoryId: 'cat_food', date: '2026-07-06', amount: 3780, note: 'July Dining & Food Aggregator orders', type: 'Expense', createdDate: '2026-07-06' },
  { id: 'tx_j4', userId: 'user_default', categoryId: 'cat_shopping', date: '2026-07-15', amount: 1850, note: 'Summer apparel', type: 'Expense', createdDate: '2026-07-15' },
  { id: 'tx_j5', userId: 'user_default', categoryId: 'cat_travel', date: '2026-07-22', amount: 2450, note: 'Train tickets & transit', type: 'Expense', createdDate: '2026-07-22' },

  // June 2026
  { id: 'tx_m1', userId: 'user_default', categoryId: 'cat_salary', date: '2026-06-01', amount: 35000, note: 'Monthly Salary', type: 'Income', createdDate: '2026-06-01' },
  { id: 'tx_m2', userId: 'user_default', categoryId: 'cat_bills', date: '2026-06-02', amount: 12000, note: 'Monthly Rent', type: 'Expense', createdDate: '2026-06-02' },
  { id: 'tx_m3', userId: 'user_default', categoryId: 'cat_food', date: '2026-06-10', amount: 3200, note: 'Groceries and Meals', type: 'Expense', createdDate: '2026-06-10' },
  { id: 'tx_m4', userId: 'user_default', categoryId: 'cat_shopping', date: '2026-06-20', amount: 2100, note: 'Home essentials', type: 'Expense', createdDate: '2026-06-20' },

  // May 2026
  { id: 'tx_my1', userId: 'user_default', categoryId: 'cat_salary', date: '2026-05-01', amount: 35000, note: 'Monthly Salary', type: 'Income', createdDate: '2026-05-01' },
  { id: 'tx_my2', userId: 'user_default', categoryId: 'cat_bills', date: '2026-05-02', amount: 12000, note: 'Monthly Rent', type: 'Expense', createdDate: '2026-05-02' },
  { id: 'tx_my3', userId: 'user_default', categoryId: 'cat_food', date: '2026-05-15', amount: 3100, note: 'Dining and Supermarket', type: 'Expense', createdDate: '2026-05-15' },
];

export const INITIAL_BUDGETS: Budget[] = [
  { id: 'bg_1', userId: 'user_default', categoryId: 'cat_food', amount: 5000, startDate: '2026-08-01', endDate: '2026-08-31', createdDate: '2026-08-01' },
  { id: 'bg_2', userId: 'user_default', categoryId: 'cat_shopping', amount: 4000, startDate: '2026-08-01', endDate: '2026-08-31', createdDate: '2026-08-01' },
  { id: 'bg_3', userId: 'user_default', categoryId: 'cat_travel', amount: 3000, startDate: '2026-08-01', endDate: '2026-08-31', createdDate: '2026-08-01' },
  { id: 'bg_4', userId: 'user_default', categoryId: 'cat_bills', amount: 15000, startDate: '2026-08-01', endDate: '2026-08-31', createdDate: '2026-08-01' },
  { id: 'bg_5', userId: 'user_default', categoryId: 'cat_entertainment', amount: 1500, startDate: '2026-08-01', endDate: '2026-08-31', createdDate: '2026-08-01' },
];

export const INITIAL_RECURRING: RecurringTransaction[] = [
  { id: 'rec_1', userId: 'user_default', categoryId: 'cat_bills', amount: 12000, note: 'Apartment Rent', frequency: 'Monthly', startDate: '2026-01-01', nextDueDate: '2026-09-01', isActive: true, autoRecord: true, lastProcessedDate: '2026-08-02' },
  { id: 'rec_2', userId: 'user_default', categoryId: 'cat_bills', amount: 799, note: 'Airtel Highspeed Fiber Internet', frequency: 'Monthly', startDate: '2026-01-28', nextDueDate: '2026-08-28', isActive: true, autoRecord: false },
  { id: 'rec_3', userId: 'user_default', categoryId: 'cat_entertainment', amount: 649, note: 'Netflix & Spotify Premium Subscription', frequency: 'Monthly', startDate: '2026-01-30', nextDueDate: '2026-08-30', isActive: true, autoRecord: true, lastProcessedDate: '2026-07-30' },
  { id: 'rec_4', userId: 'user_default', categoryId: 'cat_health', amount: 1500, note: 'Gold Gym Monthly Membership', frequency: 'Monthly', startDate: '2026-02-05', nextDueDate: '2026-09-05', isActive: true, autoRecord: false },
];

export const INITIAL_GOALS: SavingsGoal[] = [
  { id: 'goal_1', userId: 'user_default', title: 'New MacBook Pro M3', targetAmount: 80000, currentAmount: 32000, deadline: '2027-06-30', icon: '💻', color: '#3B82F6', createdDate: '2026-03-01', status: 'In Progress' },
  { id: 'goal_2', userId: 'user_default', title: 'Emergency Rain-Day Fund', targetAmount: 150000, currentAmount: 95000, deadline: '2027-12-31', icon: '🛡️', color: '#10B981', createdDate: '2026-01-10', status: 'In Progress' },
  { id: 'goal_3', userId: 'user_default', title: 'Tokyo Autumn Vacation', targetAmount: 120000, currentAmount: 48000, deadline: '2027-09-15', icon: '✈️', color: '#EC4899', createdDate: '2026-04-15', status: 'In Progress' },
];

export const INITIAL_NOTIFICATIONS: SmartNotification[] = [
  { id: 'notif_1', userId: 'user_default', type: 'budget_warning', title: 'Food Budget Alert', message: 'You have used 84% of your Food budget (₹4,200 / ₹5,000).', timestamp: '2026-08-28T09:15:00.000Z', isRead: false },
  { id: 'notif_2', userId: 'user_default', type: 'budget_exceeded', title: 'Shopping Budget Exceeded', message: '🚨 Shopping budget exceeded! You spent ₹17,400 against your limit of ₹4,000.', timestamp: '2026-08-25T14:30:00.000Z', isRead: false },
  { id: 'notif_3', userId: 'user_default', type: 'unusual_expense', title: 'Unusual Transaction Detected', message: '⚠ ₹15,000 Shopping transaction is 7.8x higher than your category baseline.', timestamp: '2026-08-25T14:35:00.000Z', isRead: false },
  { id: 'notif_4', userId: 'user_default', type: 'recurring_due', title: 'Internet Bill Due Today', message: '🔔 Fiber Internet bill (₹799) is due today. Tap to mark as paid.', timestamp: '2026-08-28T07:00:00.000Z', isRead: false },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_1', title: 'First ₹10,000 Saved', description: 'Accumulated your first ₹10,000 in personal savings balance', icon: '💰', badgeColor: '#10B981', category: 'saving', targetValue: 10000, currentValue: 16500, isUnlocked: true, unlockedAt: '2026-04-10' },
  { id: 'ach_2', title: 'Budget Master', description: 'Maintain all category spending strictly under budget limits for a full month', icon: '🎯', badgeColor: '#3B82F6', category: 'budget', targetValue: 1, currentValue: 0, isUnlocked: false },
  { id: 'ach_3', title: '7-Day Saving Streak', description: 'Log transactions or maintain low daily spend for 7 consecutive days', icon: '🔥', badgeColor: '#F59E0B', category: 'consistency', targetValue: 7, currentValue: 7, isUnlocked: true, unlockedAt: '2026-08-20' },
  { id: 'ach_4', title: 'Zero-Spend Hero', description: 'Record a complete day with zero discretionary expense', icon: '🛡️', badgeColor: '#8B5CF6', category: 'saving', targetValue: 1, currentValue: 1, isUnlocked: true, unlockedAt: '2026-08-11' },
  { id: 'ach_5', title: '30 Transactions Milestone', description: 'Record 30 total expense or income transactions', icon: '📝', badgeColor: '#EC4899', category: 'milestone', targetValue: 30, currentValue: 22, isUnlocked: false },
  { id: 'ach_6', title: 'AI Assistant Partner', description: 'Ask 5 questions to your financial AI assistant', icon: '🤖', badgeColor: '#6366F1', category: 'milestone', targetValue: 5, currentValue: 3, isUnlocked: false },
];

export const INITIAL_SAVING_CHALLENGE: SavingChallenge = {
  id: 'chal_1',
  title: '7-Day Budget Discipline Challenge',
  description: 'Spend less than ₹400/day on discretionary items for 7 days in a row.',
  dailySpendingLimit: 400,
  totalDays: 7,
  startDate: '2026-08-22',
  daysProgress: [
    { dayNumber: 1, date: '2026-08-22', spent: 320, success: true },
    { dayNumber: 2, date: '2026-08-23', spent: 250, success: true },
    { dayNumber: 3, date: '2026-08-24', spent: 180, success: true },
    { dayNumber: 4, date: '2026-08-25', spent: 15000, success: false },
    { dayNumber: 5, date: '2026-08-26', spent: 290, success: true },
    { dayNumber: 6, date: '2026-08-27', spent: 350, success: true },
    { dayNumber: 7, date: '2026-08-28', spent: 280, success: true },
  ],
  status: 'active',
};
