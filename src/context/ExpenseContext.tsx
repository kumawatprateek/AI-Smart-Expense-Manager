import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Category,
  Transaction,
  Budget,
  RecurringTransaction,
  SavingsGoal,
  SmartNotification,
  Achievement,
  SavingChallenge,
  FinancialSummaryData,
  TransactionType,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_RECURRING,
  INITIAL_GOALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_SAVING_CHALLENGE,
} from '../data/seedData';

interface ExpenseContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  token: string | null;
  setToken: (token: string | null) => void;
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  recurring: RecurringTransaction[];
  goals: SavingsGoal[];
  notifications: SmartNotification[];
  achievements: Achievement[];
  savingChallenge: SavingChallenge;
  currencySymbol: string;
  setCurrency: (code: string, symbol: string) => void;
  formatCurrency: (amount: number) => string;
  financialSummary: FinancialSummaryData;

  // Category Actions
  addCategory: (category: Omit<Category, 'id' | 'userId' | 'createdDate'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Transaction Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'userId' | 'createdDate'>) => Transaction;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  detectUnusualExpense: (amount: number, categoryId: string) => { isUnusual: boolean; reason?: string };

  // Budget Actions
  addBudget: (budget: Omit<Budget, 'id' | 'userId' | 'createdDate'>) => Budget;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  // Recurring Actions
  addRecurring: (rec: Omit<RecurringTransaction, 'id' | 'userId'>) => RecurringTransaction;
  updateRecurring: (id: string, updates: Partial<RecurringTransaction>) => void;
  deleteRecurring: (id: string) => void;
  markRecurringPaid: (id: string) => void;
  skipRecurring: (id: string) => void;

  // Goal Actions
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'userId' | 'createdDate' | 'status'>) => SavingsGoal;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  addGoalSavings: (id: string, amount: number) => void;

  // Notification Actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notif: Omit<SmartNotification, 'id' | 'userId' | 'timestamp' | 'isRead'>) => void;

  // Challenge Actions
  toggleChallengeDay: (dayNumber: number) => void;
  resetChallenge: (dailyLimit?: number) => void;

  // Utility Actions
  resetToDefaultData: () => void;
  clearAllData: () => void;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
}

const STORAGE_KEYS = {
  USER: 'ai_expense_current_user_v3',
  TOKEN: 'ai_expense_current_token_v3',
};

const getUserStorageKey = (userId: string, key: string) => `ai_expense_user_${userId}_${key}_v3`;

function loadUserData(userId: string, userObj?: User) {
  const isDemoOrAdmin = userId === 'user_default' || userId === 'user_admin';

  // Categories
  const savedCategories = localStorage.getItem(getUserStorageKey(userId, 'categories'));
  const userCategories: Category[] = savedCategories
    ? JSON.parse(savedCategories)
    : INITIAL_CATEGORIES.map((c) => ({ ...c, userId, id: `${c.id}_${userId}` }));

  // Transactions - ZERO default transactions for regular/new users!
  const savedTransactions = localStorage.getItem(getUserStorageKey(userId, 'transactions'));
  let userTransactions: Transaction[] = [];
  if (savedTransactions) {
    userTransactions = JSON.parse(savedTransactions);
  } else if (isDemoOrAdmin) {
    userTransactions = INITIAL_TRANSACTIONS.map((t) => ({ ...t, userId }));
  } else {
    userTransactions = [];
  }

  // Budgets
  const savedBudgets = localStorage.getItem(getUserStorageKey(userId, 'budgets'));
  let userBudgets: Budget[] = [];
  if (savedBudgets) {
    userBudgets = JSON.parse(savedBudgets);
  } else if (isDemoOrAdmin) {
    userBudgets = INITIAL_BUDGETS.map((b) => ({ ...b, userId }));
  } else {
    userBudgets = [];
  }

  // Recurring
  const savedRecurring = localStorage.getItem(getUserStorageKey(userId, 'recurring'));
  let userRecurring: RecurringTransaction[] = [];
  if (savedRecurring) {
    userRecurring = JSON.parse(savedRecurring);
  } else if (isDemoOrAdmin) {
    userRecurring = INITIAL_RECURRING.map((r) => ({ ...r, userId }));
  } else {
    userRecurring = [];
  }

  // Goals
  const savedGoals = localStorage.getItem(getUserStorageKey(userId, 'goals'));
  let userGoals: SavingsGoal[] = [];
  if (savedGoals) {
    userGoals = JSON.parse(savedGoals);
  } else if (isDemoOrAdmin) {
    userGoals = INITIAL_GOALS.map((g) => ({ ...g, userId }));
  } else {
    userGoals = [];
  }

  // Notifications
  const savedNotifications = localStorage.getItem(getUserStorageKey(userId, 'notifications'));
  let userNotifications: SmartNotification[] = [];
  if (savedNotifications) {
    userNotifications = JSON.parse(savedNotifications);
  } else if (isDemoOrAdmin) {
    userNotifications = INITIAL_NOTIFICATIONS.map((n) => ({ ...n, userId }));
  } else {
    userNotifications = [
      {
        id: `notif_welcome_${Date.now()}`,
        userId,
        type: 'streak_milestone',
        title: 'Welcome to Your Private Expense Dashboard',
        message: `Hello ${userObj?.name || 'there'}! Your personal financial ledger is ready. Log your first expense or try voice entry!`,
        timestamp: new Date().toISOString(),
        isRead: false,
      },
    ];
  }

  // Achievements
  const savedAchievements = localStorage.getItem(getUserStorageKey(userId, 'achievements'));
  const userAchievements: Achievement[] = savedAchievements
    ? JSON.parse(savedAchievements)
    : INITIAL_ACHIEVEMENTS.map((a) => ({
        ...a,
        isUnlocked: isDemoOrAdmin ? a.isUnlocked : false,
        currentValue: isDemoOrAdmin ? a.currentValue : 0,
      }));

  // Challenge
  const savedChallenge = localStorage.getItem(getUserStorageKey(userId, 'challenge'));
  const userChallenge: SavingChallenge = savedChallenge
    ? JSON.parse(savedChallenge)
    : isDemoOrAdmin
    ? INITIAL_SAVING_CHALLENGE
    : {
        id: `ch_${Date.now()}`,
        userId,
        startDate: '2026-08-01',
        dailyLimit: 1000,
        days: Array.from({ length: 30 }, (_, i) => ({
          dayNumber: i + 1,
          date: `2026-08-${String(i + 1).padStart(2, '0')}`,
          spent: 0,
          isWithinLimit: false,
          isCompleted: false,
        })),
        currentStreak: 0,
        longestStreak: 0,
        totalSaved: 0,
        status: 'active',
      };

  return {
    categories: userCategories,
    transactions: userTransactions,
    budgets: userBudgets,
    recurring: userRecurring,
    goals: userGoals,
    notifications: userNotifications,
    achievements: userAchievements,
    savingChallenge: userChallenge,
  };
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  });

  // User-scoped data states initialized for current user
  const initialData = useMemo(() => loadUserData(user.id, user), [user.id]);

  const [categories, setCategories] = useState<Category[]>(initialData.categories);
  const [transactions, setTransactions] = useState<Transaction[]>(initialData.transactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialData.budgets);
  const [recurring, setRecurring] = useState<RecurringTransaction[]>(initialData.recurring);
  const [goals, setGoals] = useState<SavingsGoal[]>(initialData.goals);
  const [notifications, setNotifications] = useState<SmartNotification[]>(initialData.notifications);
  const [achievements, setAchievements] = useState<Achievement[]>(initialData.achievements);
  const [savingChallenge, setSavingChallenge] = useState<SavingChallenge>(initialData.savingChallenge);

  // When user.id changes, load that user's isolated data
  useEffect(() => {
    const loaded = loadUserData(user.id, user);
    setCategories(loaded.categories);
    setTransactions(loaded.transactions);
    setBudgets(loaded.budgets);
    setRecurring(loaded.recurring);
    setGoals(loaded.goals);
    setNotifications(loaded.notifications);
    setAchievements(loaded.achievements);
    setSavingChallenge(loaded.savingChallenge);
  }, [user.id]);

  // Sync to user-scoped localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    else localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }, [token]);

  useEffect(() => {
    if (user.id) {
      localStorage.setItem(getUserStorageKey(user.id, 'categories'), JSON.stringify(categories));
    }
  }, [categories, user.id]);

  useEffect(() => {
    if (user.id) {
      localStorage.setItem(getUserStorageKey(user.id, 'transactions'), JSON.stringify(transactions));
    }
  }, [transactions, user.id]);

  useEffect(() => {
    if (user.id) {
      localStorage.setItem(getUserStorageKey(user.id, 'budgets'), JSON.stringify(budgets));
    }
  }, [budgets, user.id]);

  useEffect(() => {
    if (user.id) {
      localStorage.setItem(getUserStorageKey(user.id, 'recurring'), JSON.stringify(recurring));
    }
  }, [recurring, user.id]);

  useEffect(() => {
    if (user.id) {
      localStorage.setItem(getUserStorageKey(user.id, 'goals'), JSON.stringify(goals));
    }
  }, [goals, user.id]);

  useEffect(() => {
    if (user.id) {
      localStorage.setItem(getUserStorageKey(user.id, 'notifications'), JSON.stringify(notifications));
    }
  }, [notifications, user.id]);

  useEffect(() => {
    if (user.id) {
      localStorage.setItem(getUserStorageKey(user.id, 'achievements'), JSON.stringify(achievements));
    }
  }, [achievements, user.id]);

  useEffect(() => {
    if (user.id) {
      localStorage.setItem(getUserStorageKey(user.id, 'challenge'), JSON.stringify(savingChallenge));
    }
  }, [savingChallenge, user.id]);

  const currencySymbol = user.currencySymbol || '₹';

  const setCurrency = useCallback((code: string, symbol: string) => {
    setUser((prev) => ({ ...prev, currency: code, currencySymbol: symbol }));
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    const abs = Math.abs(amount);
    const formatted = abs.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return `${amount < 0 ? '-' : ''}${currencySymbol}${formatted}`;
  }, [currencySymbol]);

  // Unusual Expense Detection Algorithm
  const detectUnusualExpense = useCallback((amount: number, categoryId: string): { isUnusual: boolean; reason?: string } => {
    const categoryTxs = transactions.filter(
      (t) => t.categoryId === categoryId && t.type === 'Expense' && t.amount > 0
    );

    if (categoryTxs.length < 3) {
      // Not enough baseline history
      if (amount > 10000) {
        return {
          isUnusual: true,
          reason: `High transaction value (${currencySymbol}${amount.toLocaleString()}) compared to general spending.`,
        };
      }
      return { isUnusual: false };
    }

    const amounts = categoryTxs.map((t) => t.amount);
    const sum = amounts.reduce((a, b) => a + b, 0);
    const avg = sum / amounts.length;

    // Threshold multiplier: > 2.8x of category average
    const threshold = avg * 2.8;
    if (amount > threshold && amount - avg >= 2000) {
      const multiplier = (amount / avg).toFixed(1);
      const cat = categories.find((c) => c.id === categoryId)?.title || 'category';
      return {
        isUnusual: true,
        reason: `Transaction of ${currencySymbol}${amount.toLocaleString()} is ${multiplier}x higher than your usual ${cat} average of ${currencySymbol}${Math.round(avg).toLocaleString()}.`,
      };
    }

    return { isUnusual: false };
  }, [transactions, categories, currencySymbol]);

  // Financial summary computation
  const financialSummary: FinancialSummaryData = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let currentMonthIncome = 0;
    let currentMonthExpense = 0;
    let previousMonthExpense = 0;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const currentMonthName = now.toLocaleString('default', { month: 'long' });

    const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const prevYear = prevMonthDate.getFullYear();
    const prevMonth = prevMonthDate.getMonth();

    const categoryExpenses: { [key: string]: number } = {};

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const isThisMonth = txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth;
      const isPrevMonth = txDate.getFullYear() === prevYear && txDate.getMonth() === prevMonth;

      const cat = categories.find((c) => c.id === tx.categoryId);
      const catTitle = cat ? cat.title : 'Other';

      if (tx.type === 'Income') {
        totalIncome += tx.amount;
        if (isThisMonth) currentMonthIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
        if (isThisMonth) {
          currentMonthExpense += tx.amount;
          categoryExpenses[catTitle] = (categoryExpenses[catTitle] || 0) + tx.amount;
        }
        if (isPrevMonth) {
          previousMonthExpense += tx.amount;
        }
      }
    });

    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

    // Budget utilization
    const categoryBudgets: { [key: string]: { budget: number; spent: number; pct: number } } = {};
    budgets.forEach((bg) => {
      const cat = categories.find((c) => c.id === bg.categoryId);
      const title = cat ? cat.title : 'Category';
      const spent = categoryExpenses[title] || 0;
      const pct = bg.amount > 0 ? Math.round((spent / bg.amount) * 100) : 0;
      categoryBudgets[title] = {
        budget: bg.amount,
        spent,
        pct,
      };
    });

    const recurringTotal = recurring
      .filter((r) => r.isActive)
      .reduce((sum, r) => sum + r.amount, 0);

    const topExpenses = [...transactions]
      .filter((t) => t.type === 'Expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((t) => ({
        note: t.note,
        amount: t.amount,
        category: categories.find((c) => c.id === t.categoryId)?.title || 'Expense',
        date: t.date,
      }));

    const recentUnusual = transactions
      .filter((t) => t.isUnusual)
      .slice(0, 3)
      .map((t) => ({
        note: t.note,
        amount: t.amount,
        category: categories.find((c) => c.id === t.categoryId)?.title || 'Expense',
        average: Math.round(t.amount / 3),
      }));

    return {
      totalIncome,
      totalExpense,
      balance,
      savingsRate,
      currentMonthName,
      currentMonthIncome,
      currentMonthExpense,
      previousMonthExpense,
      categoryExpenses,
      categoryBudgets,
      recurringTotal,
      goals: goals.map((g) => ({ title: g.title, target: g.targetAmount, saved: g.currentAmount, deadline: g.deadline })),
      topExpenses,
      recentUnusual,
    };
  }, [transactions, categories, budgets, recurring, goals]);

  // Trigger confetti for achievements
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignore if confetti fails in iframe
    }
  };

  // Check achievements progression whenever transactions / goals / savings change
  const checkAchievements = useCallback(() => {
    setAchievements((prev) => {
      let changed = false;
      const updated = prev.map((ach) => {
        let currentVal = ach.currentValue;
        let isNowUnlocked = ach.isUnlocked;

        if (ach.id === 'ach_1') {
          // ₹10,000 Saved
          currentVal = Math.max(0, financialSummary.balance);
          if (currentVal >= ach.targetValue && !ach.isUnlocked) {
            isNowUnlocked = true;
            changed = true;
          }
        } else if (ach.id === 'ach_5') {
          // 30 Transactions
          currentVal = transactions.length;
          if (currentVal >= ach.targetValue && !ach.isUnlocked) {
            isNowUnlocked = true;
            changed = true;
          }
        }

        if (isNowUnlocked && !ach.isUnlocked) {
          triggerCelebration();
          // Add notification
          addNotification({
            type: 'streak_milestone',
            title: `🏆 Achievement Unlocked: ${ach.title}!`,
            message: ach.description,
          });
          return { ...ach, currentValue: currentVal, isUnlocked: true, unlockedAt: new Date().toISOString() };
        }

        return { ...ach, currentValue: currentVal };
      });

      return changed ? updated : prev;
    });
  }, [financialSummary.balance, transactions.length]);

  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  // Check and generate budget warnings
  const checkBudgetThresholds = useCallback((catId: string, addedAmount: number) => {
    const budget = budgets.find((b) => b.categoryId === catId);
    if (!budget) return;

    const cat = categories.find((c) => c.id === catId);
    const catTitle = cat?.title || 'Category';

    const currentSpent = (financialSummary.categoryExpenses[catTitle] || 0) + addedAmount;
    const usagePct = (currentSpent / budget.amount) * 100;

    if (usagePct >= 100) {
      addNotification({
        type: 'budget_exceeded',
        title: `🚨 ${catTitle} Budget Exceeded!`,
        message: `You spent ${currencySymbol}${currentSpent.toLocaleString()} exceeding your ${currencySymbol}${budget.amount.toLocaleString()} limit.`,
      });
    } else if (usagePct >= 80) {
      addNotification({
        type: 'budget_warning',
        title: `⚠ ${catTitle} Budget Warning`,
        message: `${catTitle} budget is ${Math.round(usagePct)}% used (${currencySymbol}${currentSpent.toLocaleString()} / ${currencySymbol}${budget.amount.toLocaleString()}).`,
      });
    }
  }, [budgets, categories, financialSummary.categoryExpenses, currencySymbol]);

  // Category Actions
  const addCategory = (cat: Omit<Category, 'id' | 'userId' | 'createdDate'>): Category => {
    const newCat: Category = {
      ...cat,
      id: `cat_${Date.now()}`,
      userId: user.id,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Transaction Actions
  const addTransaction = (tx: Omit<Transaction, 'id' | 'userId' | 'createdDate'>): Transaction => {
    const anomaly = tx.type === 'Expense' ? detectUnusualExpense(tx.amount, tx.categoryId) : { isUnusual: false };

    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}`,
      userId: user.id,
      createdDate: new Date().toISOString(),
      isUnusual: anomaly.isUnusual,
      unusualReason: anomaly.reason,
    };

    setTransactions((prev) => [newTx, ...prev]);

    if (anomaly.isUnusual) {
      addNotification({
        type: 'unusual_expense',
        title: '⚠ Unusual Transaction Detected',
        message: anomaly.reason || `Unusual amount recorded on ${newTx.note}`,
      });
    }

    if (tx.type === 'Expense') {
      checkBudgetThresholds(tx.categoryId, tx.amount);
    }

    return newTx;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedDate: new Date().toISOString() } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Budget Actions
  const addBudget = (budget: Omit<Budget, 'id' | 'userId' | 'createdDate'>): Budget => {
    const newBudget: Budget = {
      ...budget,
      id: `bg_${Date.now()}`,
      userId: user.id,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setBudgets((prev) => [...prev, newBudget]);
    return newBudget;
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  // Recurring Actions
  const addRecurring = (rec: Omit<RecurringTransaction, 'id' | 'userId'>): RecurringTransaction => {
    const newRec: RecurringTransaction = {
      ...rec,
      id: `rec_${Date.now()}`,
      userId: user.id,
    };
    setRecurring((prev) => [...prev, newRec]);
    return newRec;
  };

  const updateRecurring = (id: string, updates: Partial<RecurringTransaction>) => {
    setRecurring((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteRecurring = (id: string) => {
    setRecurring((prev) => prev.filter((r) => r.id !== id));
  };

  const markRecurringPaid = (id: string) => {
    const item = recurring.find((r) => r.id === id);
    if (!item) return;

    // Automatically record transaction
    addTransaction({
      categoryId: item.categoryId,
      amount: item.amount,
      note: `${item.note} (Recurring Payment)`,
      type: 'Expense',
      date: new Date().toISOString().split('T')[0],
      isRecurringGenerated: true,
    });

    // Advance next due date by frequency
    const currentDue = new Date(item.nextDueDate);
    if (item.frequency === 'Monthly') {
      currentDue.setMonth(currentDue.getMonth() + 1);
    } else if (item.frequency === 'Weekly') {
      currentDue.setDate(currentDue.getDate() + 7);
    } else if (item.frequency === 'Daily') {
      currentDue.setDate(currentDue.getDate() + 1);
    } else if (item.frequency === 'Yearly') {
      currentDue.setFullYear(currentDue.getFullYear() + 1);
    }

    const nextDueStr = currentDue.toISOString().split('T')[0];
    updateRecurring(id, {
      nextDueDate: nextDueStr,
      lastProcessedDate: new Date().toISOString().split('T')[0],
    });

    addNotification({
      type: 'recurring_due',
      title: 'Payment Recorded',
      message: `Marked "${item.note}" (${currencySymbol}${item.amount.toLocaleString()}) as paid. Next due: ${nextDueStr}.`,
    });
  };

  const skipRecurring = (id: string) => {
    const item = recurring.find((r) => r.id === id);
    if (!item) return;

    const currentDue = new Date(item.nextDueDate);
    if (item.frequency === 'Monthly') currentDue.setMonth(currentDue.getMonth() + 1);
    else if (item.frequency === 'Weekly') currentDue.setDate(currentDue.getDate() + 7);
    else if (item.frequency === 'Daily') currentDue.setDate(currentDue.getDate() + 1);
    else if (item.frequency === 'Yearly') currentDue.setFullYear(currentDue.getFullYear() + 1);

    updateRecurring(id, { nextDueDate: currentDue.toISOString().split('T')[0] });
  };

  // Savings Goals Actions
  const addGoal = (goal: Omit<SavingsGoal, 'id' | 'userId' | 'createdDate' | 'status'>): SavingsGoal => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      userId: user.id,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'In Progress',
    };
    setGoals((prev) => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const addGoalSavings = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const newTotal = g.currentAmount + amount;
        const isReached = newTotal >= g.targetAmount;
        if (isReached && g.status !== 'Completed') {
          triggerCelebration();
          addNotification({
            type: 'goal_reached',
            title: `🎉 Goal Achieved: ${g.title}!`,
            message: `Congratulations! You reached your savings target of ${currencySymbol}${g.targetAmount.toLocaleString()}!`,
          });
        }
        return {
          ...g,
          currentAmount: newTotal,
          status: isReached ? 'Completed' : g.status,
        };
      })
    );
  };

  // Notification Actions
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notif: Omit<SmartNotification, 'id' | 'userId' | 'timestamp' | 'isRead'>) => {
    const newN: SmartNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newN, ...prev]);
  };

  // Challenge Actions
  const toggleChallengeDay = (dayNumber: number) => {
    setSavingChallenge((prev) => {
      const updatedProgress = prev.daysProgress.map((d) =>
        d.dayNumber === dayNumber ? { ...d, success: !d.success } : d
      );
      const allDone = updatedProgress.every((d) => d.success);
      if (allDone) {
        triggerCelebration();
        addNotification({
          type: 'streak_milestone',
          title: '🔥 7-Day Challenge Completed!',
          message: 'Incredible discipline! You conquered the 7-day budget challenge.',
        });
      }
      return {
        ...prev,
        daysProgress: updatedProgress,
        status: allDone ? 'completed' : 'active',
      };
    });
  };

  const resetChallenge = (dailyLimit?: number) => {
    const limit = dailyLimit || savingChallenge.dailySpendingLimit || 400;
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      return {
        dayNumber: i + 1,
        date: d.toISOString().split('T')[0],
        spent: 0,
        success: false,
      };
    });

    setSavingChallenge({
      id: `chal_${Date.now()}`,
      title: '7-Day Budget Discipline Challenge',
      description: `Spend less than ${currencySymbol}${limit}/day for 7 consecutive days.`,
      dailySpendingLimit: limit,
      totalDays: 7,
      startDate: now.toISOString().split('T')[0],
      daysProgress: days,
      status: 'active',
    });
  };

  // Utility Actions
  const resetToDefaultData = () => {
    setUser(INITIAL_USER);
    setCategories(INITIAL_CATEGORIES);
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setRecurring(INITIAL_RECURRING);
    setGoals(INITIAL_GOALS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setSavingChallenge(INITIAL_SAVING_CHALLENGE);
    localStorage.clear();
  };

  const clearAllData = () => {
    setTransactions([]);
    setBudgets([]);
    setRecurring([]);
    setGoals([]);
    setNotifications([]);
  };

  const loginUser = (email: string, name?: string) => {
    const u: User = {
      id: `user_${Date.now()}`,
      name: name || email.split('@')[0].replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      currency: 'INR',
      currencySymbol: '₹',
      monthlyIncomeTarget: 45000,
      savingsRateTarget: 40,
      createdAt: new Date().toISOString(),
    };
    setUser(u);
    setTokenState(`jwt_token_${Date.now()}`);
  };

  const logoutUser = () => {
    setTokenState(null);
  };

  return (
    <ExpenseContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken: setTokenState,
        categories,
        transactions,
        budgets,
        recurring,
        goals,
        notifications,
        achievements,
        savingChallenge,
        currencySymbol,
        setCurrency,
        formatCurrency,
        financialSummary,
        addCategory,
        updateCategory,
        deleteCategory,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        detectUnusualExpense,
        addBudget,
        updateBudget,
        deleteBudget,
        addRecurring,
        updateRecurring,
        deleteRecurring,
        markRecurringPaid,
        skipRecurring,
        addGoal,
        updateGoal,
        deleteGoal,
        addGoalSavings,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        addNotification,
        toggleChallengeDay,
        resetChallenge,
        resetToDefaultData,
        clearAllData,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
