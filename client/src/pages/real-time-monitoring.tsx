import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Brain, 
  Zap,
  ExternalLink 
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@shared/schema";

export default function RealTimeMonitoring() {
  const { data: alerts, isLoading: alertsLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: unreadAlerts } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/unread"],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Mock system status data - in real implementation, this would come from monitoring APIs
  const systemStatus = [
    {
      id: "data-pipeline",
      name: "Data Pipeline",
      description: "Operational",
      status: "active",
      icon: Database,
      lastUpdated: "2 minutes ago",
    },
    {
      id: "ai-engine", 
      name: "AI Engine",
      description: "Processing",
      status: "active",
      icon: Brain,
      lastUpdated: "1 minute ago",
    },
    {
      id: "api-services",
      name: "API Services", 
      description: "All endpoints responsive",
      status: "active",
      icon: Zap,
      lastUpdated: "30 seconds ago",
    },
  ];

  const getAlertTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "critical":
        return <AlertTriangle className="w-4 h-4" />;
      case "warning":
        return <Clock className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "critical":
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      case "warning":
        return "border-amber-500 bg-amber-50 dark:bg-amber-900/20";
      default:
        return "border-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  const getAlertTextColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "critical":
        return "text-red-800 dark:text-red-300";
      case "warning":
        return "text-amber-800 dark:text-amber-300";
      default:
        return "text-blue-800 dark:text-blue-300";
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Real-Time Monitoring
        </h2>
        <p className="text-muted-foreground">
          Live data updates and alerts for immediate intervention
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Live Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                Recent Alerts
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {alertsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : alerts && alerts.length > 0 ? (
                alerts.slice(0, 10).map((alert, index) => (
                  <div 
                    key={alert.id} 
                    className={cn(
                      "p-4 rounded border-l-4",
                      getAlertTypeColor(alert.type)
                    )}
                    data-testid={`alert-${index}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getAlertTypeIcon(alert.type)}
                        <h4 className={cn("font-semibold text-sm", getAlertTextColor(alert.type))}>
                          {alert.type}: {alert.title}
                        </h4>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.description}
                    </p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-primary hover:underline"
                      data-testid={`button-view-alert-${index}`}
                    >
                      View Details <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">No recent alerts</p>
                  <p className="text-sm text-muted-foreground">System running smoothly</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((system) => {
                const Icon = system.icon;
                return (
                  <div 
                    key={system.id}
                    className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    data-testid={`system-status-${system.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{system.name}</h4>
                        <p className="text-sm text-muted-foreground">{system.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Last updated: {system.lastUpdated}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700"
                    >
                      Active
                    </Badge>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-semibold text-foreground mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" data-testid="button-refresh-data">
                  <Database className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
                <Button variant="outline" size="sm" data-testid="button-run-diagnostics">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Run Diagnostics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <Badge variant="outline" className="text-red-600 border-red-200">
                Critical
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Critical Alerts</h3>
            <p className="text-3xl font-bold text-foreground" data-testid="text-critical-alerts">
              {alerts?.filter(a => a.type.toLowerCase() === 'critical').length || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <Badge variant="outline" className="text-amber-600 border-amber-200">
                Warning
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Warning Alerts</h3>
            <p className="text-3xl font-bold text-foreground" data-testid="text-warning-alerts">
              {alerts?.filter(a => a.type.toLowerCase() === 'warning').length || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-500" />
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                Info
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Info Alerts</h3>
            <p className="text-3xl font-bold text-foreground" data-testid="text-info-alerts">
              {alerts?.filter(a => a.type.toLowerCase() === 'info').length || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200">
                Resolved
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Resolved Today</h3>
            <p className="text-3xl font-bold text-foreground" data-testid="text-resolved-alerts">
              {alerts?.filter(a => a.isRead).length || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Response time: 15 min avg</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Data Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Live Data Feed</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Real-time updates enabled</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Data Points Processed</h4>
              <p className="text-2xl font-bold text-primary" data-testid="text-data-points">
                1,247,832
              </p>
              <p className="text-xs text-muted-foreground">Last hour</p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Active Connections</h4>
              <p className="text-2xl font-bold text-accent" data-testid="text-active-connections">
                156
              </p>
              <p className="text-xs text-muted-foreground">School systems</p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Response Time</h4>
              <p className="text-2xl font-bold text-green-600" data-testid="text-response-time">
                98ms
              </p>
              <p className="text-xs text-muted-foreground">Average latency</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
