
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import SidebarLayout from "./components/layout/SidebarLayout";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import History from "./pages/History";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import NotImplemented from "./pages/NotImplemented";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <SidebarLayout>
              <Dashboard />
            </SidebarLayout>
          } />
          <Route path="/add" element={
            <SidebarLayout>
              <AddExpense />
            </SidebarLayout>
          } />
          <Route path="/history" element={
            <SidebarLayout>
              <History />
            </SidebarLayout>
          } />
          <Route path="/insights" element={
            <SidebarLayout>
              <Insights />
            </SidebarLayout>
          } />
          <Route path="/calendar" element={
            <SidebarLayout>
              <NotImplemented feature="Calendar view" />
            </SidebarLayout>
          } />
          <Route path="/goals" element={
            <SidebarLayout>
              <NotImplemented feature="Goals & Progress tracking" />
            </SidebarLayout>
          } />
          <Route path="/shared" element={
            <SidebarLayout>
              <NotImplemented feature="Shared Wallet" />
            </SidebarLayout>
          } />
          <Route path="/export" element={
            <SidebarLayout>
              <NotImplemented feature="Export & Reports" />
            </SidebarLayout>
          } />
          <Route path="/settings" element={
            <SidebarLayout>
              <Settings />
            </SidebarLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
