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
  USER: 'ai_expense_user_v2',
  TOKEN: 'ai_expense_token_v2',
  CATEGORIES: 'ai_expense_categories_v2',
  TRANSACTIONS: 'ai_expense_transactions_v2',
  BUDGETS: 'ai_expense_budgets_v2',
  RECURRING: 'ai_expense_recurring_v2',
  GOALS: 'ai_expense_goals_v2',
  NOTIFICATIONS: 'ai_expense_notifications_v2',
  ACHIEVEMENTS: 'ai_expense_achievements_v2',
  CHALLENGE: 'ai_expense_challenge_v2',
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN) || 'demo_active_token';
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [recurring, setRecurring] = useState<RecurringTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECURRING);
    return saved ? JSON.parse(saved) : INITIAL_RECURRING;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [notifications, setNotifications] = useState<SmartNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [savingChallenge, setSavingChallenge] = useState<SavingChallenge>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHALLENGE);
    return saved ? JSON.parse(saved) : INITIAL_SAVING_CHALLENGE;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    else localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }, [token]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(recurring));
  }, [recurring]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHALLENGE, JSON.stringify(savingChallenge));
  }, [savingChallenge]);

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
