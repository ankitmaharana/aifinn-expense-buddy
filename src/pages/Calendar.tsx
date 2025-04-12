
import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, subMonths, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_EXPENSES, formatCurrency, getCategoryEmoji } from "@/lib/expense-utils";

interface DayExpensesProps {
  date: Date;
  expenses: typeof MOCK_EXPENSES;
}

const DayExpenses = ({ date, expenses }: DayExpensesProps) => {
  const dayExpenses = expenses.filter((expense) => 
    isSameDay(new Date(expense.date), date)
  );
  
  const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return (
    <div className="p-1">
      <span className="block text-center font-medium">
        {format(date, "d")}
      </span>
      {dayExpenses.length > 0 && (
        <div className="mt-1 text-center text-xs font-medium text-expense-amber">
          {formatCurrency(totalAmount, "INR")}
        </div>
      )}
    </div>
  );
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get all dates for the current month
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  
  // Get day of week of the first day (0 = Sunday, 1 = Monday, etc.)
  const startDay = firstDayOfMonth.getDay();
  
  // Calculate days from previous month to display
  const daysFromPreviousMonth = startDay === 0 ? 0 : startDay;
  
  // Get expenses for the selected date
  const selectedDateExpenses = selectedDate 
    ? MOCK_EXPENSES.filter(expense => 
        isSameDay(new Date(expense.date), selectedDate)
      )
    : [];
  
  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };
  
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Expense Calendar"
        description="View your expenses organized by date"
      />
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h2 className="text-xl font-semibold">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
            <div className="py-2">Sun</div>
            <div className="py-2">Mon</div>
            <div className="py-2">Tue</div>
            <div className="py-2">Wed</div>
            <div className="py-2">Thu</div>
            <div className="py-2">Fri</div>
            <div className="py-2">Sat</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the start of month */}
            {Array.from({ length: daysFromPreviousMonth }).map((_, index) => (
              <div key={`empty-start-${index}`} className="h-20 border rounded-md bg-muted/20"></div>
            ))}
            
            {/* Days of the month */}
            {daysInMonth.map((day) => (
              <button
                key={format(day, "yyyy-MM-dd")}
                onClick={() => handleDayClick(day)}
                className="h-20 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <DayExpenses date={day} expenses={MOCK_EXPENSES} />
              </button>
            ))}
            
            {/* Empty cells to complete the grid if needed */}
            {Array.from({ length: (7 - ((daysFromPreviousMonth + daysInMonth.length) % 7)) % 7 }).map((_, index) => (
              <div key={`empty-end-${index}`} className="h-20 border rounded-md bg-muted/20"></div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, "MMMM d, yyyy")}
            </DialogTitle>
            <DialogDescription>
              Expenses for this day
            </DialogDescription>
          </DialogHeader>
          
          {selectedDateExpenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedDateExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{getCategoryEmoji(expense.category)}</span>
                        {expense.category}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(expense.amount, "INR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              <CalendarIcon className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>No expenses for this day</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
