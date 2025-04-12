
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mic, Camera, CalendarIcon, Trash2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { EXPENSE_CATEGORIES, getCategoryEmoji } from "@/lib/expense-utils";

export default function AddExpense() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Check if we're editing an existing expense
  const expenseId = new URLSearchParams(location.search).get('id');
  const isEditing = Boolean(expenseId);
  
  // Fetch expense data if we're editing
  const { data: expenseData, isLoading: isLoadingExpense } = useQuery({
    queryKey: ['expense', expenseId],
    queryFn: async () => {
      if (!expenseId) return null;
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', expenseId)
        .single();
        
      if (error) {
        toast.error("Failed to load expense");
        throw error;
      }
      
      return data;
    },
    enabled: isEditing && !!user,
  });
  
  // Set form data if we're editing
  useEffect(() => {
    if (expenseData) {
      setAmount(String(expenseData.amount));
      setCategory(expenseData.category);
      setDescription(expenseData.description || "");
      setDate(new Date(expenseData.date));
    }
  }, [expenseData]);
  
  // Save expense mutation
  const saveExpenseMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      
      const expenseData = {
        user_id: user.id,
        amount: parseFloat(amount),
        category,
        description,
        date: format(date, "yyyy-MM-dd"),
      };
      
      if (isEditing) {
        // Update existing expense
        const { error } = await supabase
          .from('expenses')
          .update(expenseData)
          .eq('id', expenseId);
          
        if (error) throw error;
        return { action: 'updated' };
      } else {
        // Insert new expense
        const { error } = await supabase
          .from('expenses')
          .insert([expenseData]);
          
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success(`Expense ${data.action} successfully`);
      navigate("/");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save expense");
    }
  });
  
  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: async () => {
      if (!expenseId) throw new Error("No expense ID provided");
      
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("Expense deleted successfully");
      navigate("/history");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete expense");
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      toast.error("Please enter an amount and select a category");
      return;
    }
    
    saveExpenseMutation.mutate();
  };
  
  const handleDelete = () => {
    deleteExpenseMutation.mutate();
  };
  
  const handleVoiceInput = () => {
    // Simulate voice recognition
    toast.info("Voice input feature coming soon!");
  };
  
  const handleScanReceipt = () => {
    // Simulate receipt scanning
    toast.info("Receipt scanning feature coming soon!");
  };
  
  if (isLoadingExpense && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={isEditing ? "Edit Expense" : "Add New Expense"}
        description={isEditing ? "Update your expense details" : "Record your spending to keep track of your finances"}
      />

      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-base">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-7"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  step="0.01"
                  min="0.01"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      <div className="flex items-center">
                        <span className="mr-2">{cat.emoji}</span>
                        <span>{cat.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-base">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="What was this expense for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {!isEditing && (
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleVoiceInput}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Voice Input
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleScanReceipt}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Scan Receipt
                </Button>
              </div>
            )}

            <div className="flex gap-3">
              {isEditing && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={saveExpenseMutation.isPending}
              >
                {saveExpenseMutation.isPending 
                  ? "Saving..." 
                  : isEditing ? "Update Expense" : "Save Expense"
                }
              </Button>
            </div>
            
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this expense from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleteExpenseMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteExpenseMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
