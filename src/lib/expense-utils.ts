
export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export const EXPENSE_CATEGORIES = [
  { name: "Food", emoji: "🍔", color: "expense-amber" },
  { name: "Travel", emoji: "🚕", color: "expense-blue" },
  { name: "Shopping", emoji: "🛍️", color: "expense-red" },
  { name: "Bills", emoji: "📱", color: "expense-purple" },
  { name: "Entertainment", emoji: "🎬", color: "expense-green" },
  { name: "Health", emoji: "💊", color: "expense-red" },
  { name: "Education", emoji: "📚", color: "expense-blue" },
  { name: "Gift", emoji: "🎁", color: "expense-purple" },
  { name: "Other", emoji: "💰", color: "expense-green" },
];

export function getCategoryEmoji(categoryName: string): string {
  const category = EXPENSE_CATEGORIES.find((c) => c.name === categoryName);
  return category?.emoji || "💰";
}

export function getCategoryColor(categoryName: string): string {
  const category = EXPENSE_CATEGORIES.find((c) => c.name === categoryName);
  return category?.color || "expense-blue";
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// Mock data for our app until we integrate with Supabase
export const MOCK_USER = {
  id: "user-1",
  name: "Alex Johnson",
  email: "alex@example.com",
  currency: "USD",
  avatar: "",
};

export const MOCK_EXPENSES: Expense[] = [
  {
    id: "exp-1",
    amount: 25.50,
    category: "Food",
    description: "Lunch at Taco Bell",
    date: "2025-04-12",
    createdAt: "2025-04-12T12:34:56Z",
  },
  {
    id: "exp-2",
    amount: 35.00,
    category: "Travel",
    description: "Uber to work",
    date: "2025-04-11",
    createdAt: "2025-04-11T09:15:00Z",
  },
  {
    id: "exp-3",
    amount: 120.75,
    category: "Shopping",
    description: "New shoes",
    date: "2025-04-10",
    createdAt: "2025-04-10T16:20:00Z",
  },
  {
    id: "exp-4",
    amount: 45.99,
    category: "Bills",
    description: "Internet bill",
    date: "2025-04-09",
    createdAt: "2025-04-09T11:05:00Z",
  },
  {
    id: "exp-5",
    amount: 18.50,
    category: "Entertainment",
    description: "Movie tickets",
    date: "2025-04-08",
    createdAt: "2025-04-08T19:45:00Z",
  },
  {
    id: "exp-6",
    amount: 35.00,
    category: "Health",
    description: "Pharmacy",
    date: "2025-04-07",
    createdAt: "2025-04-07T15:30:00Z",
  },
  {
    id: "exp-7",
    amount: 200.00,
    category: "Education",
    description: "Online course",
    date: "2025-04-06",
    createdAt: "2025-04-06T14:20:00Z",
  },
];

export const MOCK_AI_TIPS = [
  "Try bringing lunch from home 2 days this week to save on food expenses.",
  "Your weekend spending is 30% higher than weekdays. Set a weekend budget.",
  "Consider using public transport twice a week instead of ride-sharing.",
  "You've spent 25% more on dining this month compared to last month.",
  "Setting up automatic transfers to savings could help you reach your goal faster.",
];

export function getRandomAITip(): string {
  return MOCK_AI_TIPS[Math.floor(Math.random() * MOCK_AI_TIPS.length)];
}

export function getExpensesByCategory(expenses: Expense[]): Record<string, number> {
  return expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);
}

export function getTotalSpent(expenses: Expense[]): number {
  return expenses.reduce((acc, expense) => acc + expense.amount, 0);
}

export function getWeeklyAverage(expenses: Expense[], days = 30): number {
  return (getTotalSpent(expenses) / days) * 7;
}

export function getTopCategories(expenses: Expense[], limit = 3): string[] {
  const categoriesSpend = getExpensesByCategory(expenses);
  return Object.entries(categoriesSpend)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category]) => category);
}
