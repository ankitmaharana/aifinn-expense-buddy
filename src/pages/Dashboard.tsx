
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Lightbulb, 
  PlusCircle, 
  ReceiptText 
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  MOCK_USER,
  MOCK_EXPENSES,
  formatCurrency,
  getRandomAITip,
  getExpensesByCategory,
  getTotalSpent,
  getWeeklyAverage,
  getTopCategories,
  EXPENSE_CATEGORIES,
  getCategoryEmoji,
} from "@/lib/expense-utils";

export default function Dashboard() {
  const [user] = useState(MOCK_USER);
  const [expenses] = useState(MOCK_EXPENSES);
  const [dailyTip, setDailyTip] = useState("");

  useEffect(() => {
    setDailyTip(getRandomAITip());
  }, []);

  const totalSpent = getTotalSpent(expenses);
  const weeklyAverage = getWeeklyAverage(expenses);
  const topCategories = getTopCategories(expenses);
  
  const categorySpending = getExpensesByCategory(expenses);
  const pieData = Object.entries(categorySpending).map(([name, value]) => ({ name, value }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title={`Hello, ${user.name}`}
        description="Here's an overview of your expenses this month"
        action={
          <div className="flex space-x-3">
            <Button asChild>
              <Link to="/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/history">
                <ReceiptText className="mr-2 h-4 w-4" />
                View History
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="stat-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium text-muted-foreground">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium text-muted-foreground">Weekly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(weeklyAverage)}</div>
            <p className="text-xs text-muted-foreground mt-1">Based on this month</p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium text-muted-foreground">Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              {topCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <span className="expense-icon">{getCategoryEmoji(category)}</span>
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="expense-card h-full">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                      label={({name}) => `${name} ${getCategoryEmoji(name)}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="expense-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 text-expense-amber mr-2" />
                Daily Saving Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 italic mb-4">{dailyTip}</p>
              <Link 
                to="/insights" 
                className="flex items-center text-primary text-sm hover:underline"
              >
                See more insights
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Card className="expense-card">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.slice(0, 3).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <span className="expense-icon mr-3 p-2 rounded-full bg-gray-100">
                      {getCategoryEmoji(expense.category)}
                    </span>
                    <div>
                      <h3 className="font-medium">{expense.description}</h3>
                      <p className="text-sm text-gray-500">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="font-semibold">{formatCurrency(expense.amount)}</span>
                </div>
              ))}
              <Link 
                to="/history" 
                className="flex items-center justify-center w-full py-2 text-primary text-sm hover:underline"
              >
                View all transactions
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
