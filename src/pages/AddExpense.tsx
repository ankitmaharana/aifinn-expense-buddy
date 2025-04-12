
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Camera, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      toast.error("Please enter an amount and select a category");
      return;
    }
    
    setIsSaving(true);
    
    // Simulate saving to database
    setTimeout(() => {
      const newExpense = {
        id: uuidv4(),
        amount: parseFloat(amount),
        category,
        description,
        date: format(date, "yyyy-MM-dd"),
        createdAt: new Date().toISOString(),
      };
      
      console.log("New expense:", newExpense);
      
      toast.success("Expense added successfully");
      setIsSaving(false);
      navigate("/");
    }, 800);
  };
  
  const handleVoiceInput = () => {
    // Simulate voice recognition
    toast.info("Voice input feature coming soon!");
  };
  
  const handleScanReceipt = () => {
    // Simulate receipt scanning
    toast.info("Receipt scanning feature coming soon!");
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Add New Expense"
        description="Record your spending to keep track of your finances"
      />

      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-base">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
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

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Expense"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
