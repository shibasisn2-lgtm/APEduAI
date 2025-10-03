import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import SchemeAnalytics from "@/pages/scheme-analytics";
import AiRiskPrediction from "@/pages/ai-risk-prediction";
import DataUpload from "@/pages/data-upload";
import RealTimeMonitoring from "@/pages/real-time-monitoring";
import DliIndicators from "@/pages/dli-indicators";
import InterventionTracker from "@/pages/intervention-tracker";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/scheme-analytics" component={SchemeAnalytics} />
      <Route path="/ai-risk-prediction" component={AiRiskPrediction} />
      <Route path="/data-upload" component={DataUpload} />
      <Route path="/real-time-monitoring" component={RealTimeMonitoring} />
      <Route path="/dli-indicators" component={DliIndicators} />
      <Route path="/intervention-tracker" component={InterventionTracker} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar 
            collapsed={sidebarCollapsed}
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
          <main className="flex-1 overflow-y-auto">
            <Header 
              onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
              onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
              <Router />
            </div>
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
