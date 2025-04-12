
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const queryClient = useQueryClient();
  
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currency, setCurrency] = useState(profile?.currency || "INR");
  const [language, setLanguage] = useState(profile?.language || "en");
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Notification settings
  const { data: notificationSettings } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        toast.error("Failed to load notification settings");
        throw error;
      }
      
      return data;
    },
    enabled: !!user,
  });
  
  const [dailyReminder, setDailyReminder] = useState(notificationSettings?.daily_reminder || false);
  const [budgetAlerts, setBudgetAlerts] = useState(notificationSettings?.budget_alerts || true);
  
  // Set initial state from profile data when it loads
  React.useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setCurrency(profile.currency || "INR");
      setLanguage(profile.language || "en");
    }
    
    if (user) {
      setEmail(user.email || "");
    }
    
    if (notificationSettings) {
      setDailyReminder(notificationSettings.daily_reminder || false);
      setBudgetAlerts(notificationSettings.budget_alerts || true);
    }
  }, [profile, user, notificationSettings]);
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          currency,
          language,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    }
  });
  
  // Update notification settings mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          daily_reminder: dailyReminder,
          budget_alerts: budgetAlerts,
          updated_at: new Date().toISOString(),
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      toast.success("Notification settings updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update notification settings");
    }
  });
  
  const handleSaveProfile = () => {
    updateProfileMutation.mutate();
  };
  
  const handleSavePreferences = () => {
    updateNotificationsMutation.mutate();
  };
  
  const handleLogout = async () => {
    await signOut();
  };
  
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Contact support to change your email</p>
              </div>
            </div>
            <Button 
              onClick={handleSaveProfile} 
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>App Preferences</CardTitle>
            <CardDescription>Customize how the app works for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={currency} 
                  onValueChange={setCurrency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                    <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">Switch to dark color theme</p>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Daily Reminders</h3>
                <p className="text-sm text-muted-foreground">Receive reminders to track your expenses</p>
              </div>
              <Switch
                checked={dailyReminder}
                onCheckedChange={setDailyReminder}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Budget Alerts</h3>
                <p className="text-sm text-muted-foreground">Get notified when you're close to budget limits</p>
              </div>
              <Switch
                checked={budgetAlerts}
                onCheckedChange={setBudgetAlerts}
              />
            </div>
            
            <Button 
              onClick={handleSavePreferences} 
              disabled={updateNotificationsMutation.isPending}
            >
              {updateNotificationsMutation.isPending ? "Saving..." : "Save Preferences"}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Sign out from all devices</h3>
              <p className="text-sm text-muted-foreground">End all your active sessions</p>
            </div>
            <Button variant="destructive" onClick={handleLogout}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
