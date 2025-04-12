
import React, { useState } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MOCK_EXPENSES,
  formatCurrency,
  formatDate,
  getCategoryEmoji,
  EXPENSE_CATEGORIES,
  Expense
} from "@/lib/expense-utils";

type SortDirection = "asc" | "desc";
type SortField = "date" | "amount" | "category";

export default function History() {
  const [expenses, setExpenses] = useState([...MOCK_EXPENSES]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter((expense) => {
      // Search filter
      const matchesSearch = searchQuery
        ? expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(expense.category);
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort logic
      if (sortField === "date") {
        return sortDirection === "desc"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === "amount") {
        return sortDirection === "desc" ? b.amount - a.amount : a.amount - b.amount;
      } else if (sortField === "category") {
        return sortDirection === "desc"
          ? b.category.localeCompare(a.category)
          : a.category.localeCompare(b.category);
      }
      return 0;
    });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Expense History"
        description="View and filter your past expenses"
      />

      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
            <CardTitle>All Expenses</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500" />
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full md:w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {EXPENSE_CATEGORIES.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category.name}
                      checked={selectedCategories.includes(category.name)}
                      onCheckedChange={() => handleCategoryToggle(category.name)}
                    >
                      <span className="mr-2">{category.emoji}</span>
                      {category.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="flex items-center p-0 h-auto font-medium"
                      onClick={() => toggleSort("category")}
                    >
                      Category
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="flex items-center p-0 h-auto font-medium"
                      onClick={() => toggleSort("date")}
                    >
                      Date
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      className="flex items-center p-0 h-auto font-medium ml-auto"
                      onClick={() => toggleSort("amount")}
                    >
                      Amount
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No expenses found. Adjust your filters or add new expenses.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {expense.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">{getCategoryEmoji(expense.category)}</span>
                          {expense.category}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(expense.date)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
