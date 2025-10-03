import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ClipboardList, 
  CheckCircle, 
  Users, 
  TrendingUp,
  Calendar,
  UserCheck,
  AlertCircle,
  Plus,
  FileText
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Intervention, Student } from "@shared/schema";

export default function InterventionTracker() {
  const { toast } = useToast();
  
  const { data: interventions, isLoading } = useQuery<Intervention[]>({
    queryKey: ["/api/interventions"],
  });

  const { data: students } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  // Calculate intervention statistics
  const activeInterventions = interventions?.filter(i => i.status === "In Progress")?.length || 0;
  const completedInterventions = interventions?.filter(i => i.status === "Completed")?.length || 0;
  const totalInterventions = interventions?.length || 0;
  const successRate = completedInterventions > 0 ? 
    ((interventions?.filter(i => i.status === "Completed" && i.effectiveness && parseFloat(i.effectiveness) > 70)?.length || 0) / completedInterventions * 100) : 0;

  // Calculate students helped
  const uniqueStudentsHelped = new Set(interventions?.map(i => i.studentId))?.size || 0;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300";
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getEffectivenessColor = (effectiveness: string | null) => {
    if (!effectiveness) return "text-muted-foreground";
    const value = parseFloat(effectiveness);
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getEffectivenessLabel = (effectiveness: string | null) => {
    if (!effectiveness) return "Pending";
    const value = parseFloat(effectiveness);
    if (value >= 80) return "Excellent";
    if (value >= 60) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Intervention Tracker
        </h2>
        <p className="text-muted-foreground">
          Monitor remedial actions and measure their effectiveness
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                +{Math.floor(Math.random() * 20) + 10} this week
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Active Interventions</h3>
            <p className="text-4xl font-bold text-foreground" data-testid="text-active-interventions">
              {activeInterventions}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Currently in progress</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200">
                +5% from last month
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Success Rate</h3>
            <p className="text-4xl font-bold text-foreground" data-testid="text-success-rate">
              {Math.round(successRate)}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">Effective interventions</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <Badge variant="outline" className="text-accent border-accent/20">
                This semester
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Students Helped</h3>
            <p className="text-4xl font-bold text-foreground" data-testid="text-students-helped">
              {uniqueStudentsHelped}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Unique beneficiaries</p>
          </CardContent>
        </Card>
      </div>

      {/* Intervention Types Performance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Intervention Types & Effectiveness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Intervention type analysis would be calculated from actual data */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Parental Counseling</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-lg font-bold text-green-600">85%</span>
              </div>
              <Progress value={85} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                {interventions?.filter(i => i.type === "Parental Counseling")?.length || 0} cases
              </p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Academic Support</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-lg font-bold text-green-600">92%</span>
              </div>
              <Progress value={92} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                {interventions?.filter(i => i.type === "Academic Support")?.length || 0} cases
              </p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Financial Assistance</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-lg font-bold text-green-600">78%</span>
              </div>
              <Progress value={78} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                {interventions?.filter(i => i.type === "Financial Assistance")?.length || 0} cases
              </p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Mentorship Program</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-lg font-bold text-amber-600">68%</span>
              </div>
              <Progress value={68} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                {interventions?.filter(i => i.type === "Mentorship Program")?.length || 0} cases
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Interventions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Interventions</CardTitle>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" data-testid="button-add-intervention">
                <Plus className="w-4 h-4 mr-2" />
                Add Intervention
              </Button>
              <Button variant="outline" size="sm" data-testid="button-export-interventions">
                <FileText className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground mt-2">Loading interventions...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Student</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Intervention Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Start Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Effectiveness</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {interventions?.slice(0, 10).map((intervention, index) => {
                    const student = students?.find(s => s.id === intervention.studentId);
                    return (
                      <tr 
                        key={intervention.id} 
                        className="hover:bg-muted/30 transition-colors"
                        data-testid={`row-intervention-${index}`}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {student?.name || "Unknown Student"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {student?.studentId || intervention.studentId}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {intervention.type === "Parental Counseling" && <UserCheck className="w-4 h-4 text-blue-500" />}
                            {intervention.type === "Academic Support" && <FileText className="w-4 h-4 text-green-500" />}
                            {intervention.type === "Financial Assistance" && <AlertCircle className="w-4 h-4 text-amber-500" />}
                            <span className="text-sm text-foreground">{intervention.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(intervention.startDate).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            className={getStatusColor(intervention.status)}
                            data-testid={`badge-status-${index}`}
                          >
                            {intervention.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {intervention.effectiveness ? (
                              <div>
                                <span className={`font-semibold ${getEffectivenessColor(intervention.effectiveness)}`}>
                                  {intervention.effectiveness}% 
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  {getEffectivenessLabel(intervention.effectiveness)}
                                </p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Pending</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              data-testid={`button-view-details-${index}`}
                            >
                              View Details
                            </Button>
                            {intervention.status === "In Progress" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                data-testid={`button-update-status-${index}`}
                              >
                                Update
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {!interventions?.length && !isLoading && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        No interventions found. Start by adding an intervention for at-risk students.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
