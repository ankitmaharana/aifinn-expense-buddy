
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/lib/auth-context";
import ProtectedRoute from "./components/ProtectedRoute";
import SidebarLayout from "./components/layout/SidebarLayout";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import History from "./pages/History";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import Calendar from "./pages/Calendar";
import NotImplemented from "./pages/NotImplemented";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth/*" element={<Auth />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <SidebarLayout>
                  <Dashboard />
                </SidebarLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/add" element={
              <ProtectedRoute>
                <SidebarLayout>
                  <AddExpense />
                </SidebarLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/history" element={
              <ProtectedRoute>
                <SidebarLayout>
                  <History />
                </SidebarLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/insights" element={
              <ProtectedRoute>
                <SidebarLayout>
                  <Insights />
                </SidebarLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/calendar" element={
              <ProtectedRoute>
                <SidebarLayout>
                  <Calendar />
                </SidebarLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/goals" element={
              <ProtectedRoute>
                <SidebarLayout>
                  <NotImplemented feature="Goals & Progress tracking" />
                </SidebarLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/shared" element={
              <ProtectedRoute>
                <SidebarLayout>
                  <NotImplemented feature="Shared Wallet" />
                </SidebarLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/export" element={
              <ProtectedRoute>
                <SidebarLayout>
                  <NotImplemented feature="Export & Reports" />
                </SidebarLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <SidebarLayout>
                  <Settings />
                </SidebarLayout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
