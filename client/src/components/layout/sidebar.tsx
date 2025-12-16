import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  PieChart, 
  Brain, 
  CloudUpload, 
  Monitor, 
  Plug, 
  Gauge, 
  ClipboardCheck, 
  Landmark, 
  Leaf,
  X,
  DollarSign,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navigationItems = [
  { path: "/", label: "State Overview", icon: BarChart3 },
  { path: "/scheme-analytics", label: "Scheme Analytics", icon: PieChart },
  { path: "/ai-risk-prediction", label: "AI Risk Prediction", icon: Brain },
  { path: "/data-upload", label: "Data Upload (AI)", icon: CloudUpload, special: true },
  { path: "/real-time-monitoring", label: "Real-Time Monitoring", icon: Monitor },
  { path: "/dli-indicators", label: "DLI Indicators", icon: Gauge },
  { path: "/intervention-tracker", label: "Intervention Tracker", icon: ClipboardCheck },
  { path: "/human-resources", label: "Human Resources", icon: Users },
  { path: "/sales-dashboard", label: "Sales Dashboard", icon: DollarSign },
];

export default function Sidebar({ collapsed = false, mobileOpen = false, onMobileClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onMobileClose}
        />
      )}
      
      <aside 
        className={cn(
          "fixed md:relative h-full z-50 bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out",
          collapsed ? "sidebar-collapsed" : "sidebar-expanded",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/5/fifty/Seal_of_Andhra_Pradesh.svg/150px-Seal_of_Andhra_Pradesh.svg.png" 
              alt="Andhra Pradesh Government Logo" 
              className="w-12 h-12 object-contain"
            />
            {!collapsed && (
              <div className="sidebar-text">
                <h1 className="text-lg font-bold text-primary">EduPredict AP</h1>
                <p className="text-xs text-muted-foreground">Govt of AP</p>
              </div>
            )}
          </div>
          <button 
            className="text-muted-foreground hover:text-primary p-2 rounded-md hover:bg-muted md:hidden"
            onClick={onMobileClose}
            data-testid="button-close-sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    "nav-link flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer",
                    isActive && "active",
                    item.special && "bg-accent/10 border-2 border-accent"
                  )}
                  onClick={() => onMobileClose?.()}
                  data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    item.special && "text-accent"
                  )} />
                  {!collapsed && (
                    <span className={cn(
                      "sidebar-text",
                      item.special && "font-semibold text-accent"
                    )}>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
        
        {/* Sidebar Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="sidebar-text text-xs text-muted-foreground">
              <p>Last Updated:</p>
              <p className="font-semibold text-foreground">Dec 15, 2024</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
