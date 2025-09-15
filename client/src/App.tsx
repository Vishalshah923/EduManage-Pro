import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import FeeManagement from "@/pages/FeeManagement";
import HostelPage from "@/pages/Hostel";
import Library from "@/pages/Library";
import Exams from "@/pages/Exams";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      {children}
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      )} />
      <Route path="/students" component={() => (
        <ProtectedRoute>
          <Students />
        </ProtectedRoute>
      )} />
      <Route path="/fees" component={() => (
        <ProtectedRoute>
          <FeeManagement />
        </ProtectedRoute>
      )} />
      <Route path="/hostel" component={() => (
        <ProtectedRoute>
          <HostelPage />
        </ProtectedRoute>
      )} />
      <Route path="/library" component={() => (
        <ProtectedRoute>
          <Library />
        </ProtectedRoute>
      )} />
      <Route path="/exams" component={() => (
        <ProtectedRoute>
          <Exams />
        </ProtectedRoute>
      )} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
