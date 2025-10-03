import { Bell, Menu, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Alert } from "@shared/schema";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  onSidebarToggle?: () => void;
}

export default function Header({ onMobileMenuToggle, onSidebarToggle }: HeaderProps) {
  const { data: unreadAlerts } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/unread"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const currentTime = new Date().toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="px-4 py-4 flex items-center justify-between">
        <button 
          className="text-muted-foreground hover:text-primary p-2 rounded-md hover:bg-muted md:hidden"
          onClick={onMobileMenuToggle}
          data-testid="button-mobile-menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex-1 flex items-center justify-end space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span data-testid="text-current-time">{currentTime}</span>
          </div>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary relative"
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadAlerts && unreadAlerts.length > 0 && (
                <span 
                  className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                  data-testid="indicator-unread-alerts"
                />
              )}
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              <span data-testid="text-user-initials">AP</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
