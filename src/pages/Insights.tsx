
import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Brain, Sparkles, TrendingUp } from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_AI_TIPS, formatCurrency } from "@/lib/expense-utils";

const weeklyData = [
  { name: 'Monday', amount: 35.40 },
  { name: 'Tuesday', amount: 28.60 },
  { name: 'Wednesday', amount: 42.30 },
  { name: 'Thursday', amount: 31.90 },
  { name: 'Friday', amount: 65.20 },
  { name: 'Saturday', amount: 87.50 },
  { name: 'Sunday', amount: 75.30 },
];

const categoryTrends = [
  { category: 'Food', change: 25, increasing: true },
  { category: 'Travel', change: 15, increasing: false },
  { category: 'Shopping', change: 10, increasing: true },
  { category: 'Entertainment', change: 30, increasing: true },
];

export default function Insights() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="AI Insights"
        description="Smart analysis of your spending habits"
        className="mb-6"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 text-primary mr-2" />
              AI Spending Patterns
            </CardTitle>
            <CardDescription>Weekly spending analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} tickFormatter={(value) => value.substring(0, 3)} />
                  <YAxis fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Key Observations:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your weekend spending is <span className="font-medium">45% higher</span> than weekdays</li>
                <li>Friday has the highest single-day increase in spending</li>
                <li>Monday and Tuesday are your most economical days</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 text-expense-amber mr-2" />
              Personalized Tips
            </CardTitle>
            <CardDescription>Smart suggestions to save money</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_AI_TIPS.slice(0, 3).map((tip, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 text-expense-green mr-2" />
              Monthly Category Trends
            </CardTitle>
            <CardDescription>Changes compared to last month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryTrends.map((trend, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{trend.category}</span>
                    <span className={`text-sm font-medium ${trend.increasing ? 'text-red-500' : 'text-green-500'}`}>
                      {trend.increasing ? '+' : '-'}{trend.change}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${trend.increasing ? 'bg-red-500' : 'bg-green-500'} h-2 rounded-full`}
                      style={{ width: `${Math.min(trend.change * 2, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {trend.increasing 
                      ? `Spending has increased compared to last month` 
                      : `You're spending less in this category. Great job!`}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Understanding Your Finances</CardTitle>
          <CardDescription>
            How AI helps you make better financial decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>
              Our AI analyzes your spending patterns to identify areas where you could save money and develop better financial habits. 
              The insights shown here are based on your historical expense data and common patterns observed in similar spending profiles.
            </p>
            <p className="text-muted-foreground italic">
              Note: These insights will become more personalized and accurate as you add more expenses to the system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
