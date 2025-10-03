import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Target, 
  Award, 
  Building2,
  FileBarChart,
  Download 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DliIndicators() {
  const { data: indicators, isLoading } = useQuery({
    queryKey: ["/api/dli-indicators"],
  });

  // Mock DLI data - in real implementation, this would come from the database
  const dliData = [
    {
      id: "dli-1",
      indicatorName: "Primary Enrollment Rate",
      currentValue: 95.8,
      targetValue: 95.0,
      unit: "percentage",
      status: "Achieved",
      reportingPeriod: "Q4 2024",
      description: "Percentage of eligible children enrolled in primary education",
      trend: "+2.3%",
    },
    {
      id: "dli-2", 
      indicatorName: "Student Retention Rate",
      currentValue: 92.4,
      targetValue: 94.0,
      unit: "percentage", 
      status: "In Progress",
      reportingPeriod: "Q4 2024",
      description: "Percentage of students continuing education without dropping out",
      trend: "+1.8%",
    },
    {
      id: "dli-3",
      indicatorName: "Learning Outcomes",
      currentValue: 88.1,
      targetValue: 85.0,
      unit: "percentage",
      status: "Achieved", 
      reportingPeriod: "Q4 2024",
      description: "Percentage of students achieving grade-level competencies",
      trend: "+4.2%",
    },
    {
      id: "dli-4",
      indicatorName: "Infrastructure Development",
      currentValue: 96.2,
      targetValue: 90.0,
      unit: "percentage",
      status: "Achieved",
      reportingPeriod: "Q4 2024", 
      description: "Percentage of schools meeting infrastructure standards",
      trend: "+3.1%",
    },
    {
      id: "dli-5",
      indicatorName: "Teacher Training Coverage",
      currentValue: 78.5,
      targetValue: 80.0,
      unit: "percentage",
      status: "At Risk",
      reportingPeriod: "Q4 2024",
      description: "Percentage of teachers receiving professional development",
      trend: "+0.8%",
    },
    {
      id: "dli-6",
      indicatorName: "Digital Learning Access",
      currentValue: 84.3,
      targetValue: 85.0,
      unit: "percentage",
      status: "In Progress",
      reportingPeriod: "Q4 2024",
      description: "Percentage of schools with digital learning infrastructure",
      trend: "+5.7%",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "achieved":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300";
      case "in progress":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300";
      case "at risk":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "achieved":
        return <Award className="w-4 h-4" />;
      case "in progress":
        return <TrendingUp className="w-4 h-4" />;
      case "at risk":
        return <Target className="w-4 h-4" />;
      default:
        return <FileBarChart className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          DLI (Disbursement Linked Indicators) Tracking
        </h2>
        <p className="text-muted-foreground">
          Performance metrics and progress visualization for key education indicators
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-green-500" />
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Achieved
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Targets Achieved</h3>
            <p className="text-3xl font-bold text-foreground" data-testid="text-targets-achieved">
              {dliData.filter(d => d.status === "Achieved").length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Out of {dliData.length} indicators</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-500" />
              </div>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                In Progress
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">In Progress</h3>
            <p className="text-3xl font-bold text-foreground" data-testid="text-in-progress">
              {dliData.filter(d => d.status === "In Progress").length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Tracking towards target</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-red-500" />
              </div>
              <Badge className="bg-red-100 text-red-800 border-red-200">
                At Risk
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">At Risk</h3>
            <p className="text-3xl font-bold text-foreground" data-testid="text-at-risk">
              {dliData.filter(d => d.status === "At Risk").length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Requires intervention</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileBarChart className="w-5 h-5 text-primary" />
              </div>
              <Badge variant="outline" className="text-primary border-primary/20">
                Overall
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Performance Score</h3>
            <p className="text-3xl font-bold text-foreground" data-testid="text-performance-score">
              89.2%
            </p>
            <p className="text-xs text-muted-foreground mt-2">Average achievement</p>
          </CardContent>
        </Card>
      </div>

      {/* DLI Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {dliData.map((indicator, index) => {
          const progressPercentage = (indicator.currentValue / indicator.targetValue) * 100;
          const isAchieved = indicator.currentValue >= indicator.targetValue;
          
          return (
            <Card key={indicator.id} className="stat-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(indicator.status)}
                    <h3 className="font-bold text-foreground">{indicator.indicatorName}</h3>
                  </div>
                  <Badge 
                    className={getStatusColor(indicator.status)}
                    data-testid={`badge-status-${index}`}
                  >
                    {indicator.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {indicator.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current</span>
                    <span className="text-lg font-bold text-foreground">
                      {indicator.currentValue}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Target</span>
                    <span className="text-sm text-muted-foreground">
                      {indicator.targetValue}%
                    </span>
                  </div>
                  
                  <Progress 
                    value={Math.min(progressPercentage, 100)} 
                    className="h-3"
                    data-testid={`progress-${index}`}
                  />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {indicator.reportingPeriod}
                    </span>
                    <span className={cn(
                      "font-semibold",
                      isAchieved ? "text-green-600" : 
                      progressPercentage > 90 ? "text-amber-600" : "text-red-600"
                    )}>
                      {isAchieved ? "✓ Target Met" : 
                       progressPercentage > 90 ? "Near Target" : "Below Target"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Trend</span>
                    <span className="text-xs font-semibold text-green-600">
                      {indicator.trend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              District-wise Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">Krishna</p>
                  <p className="text-sm text-muted-foreground">5/6 targets achieved</p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  95.2%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">Chittoor</p>
                  <p className="text-sm text-muted-foreground">5/6 targets achieved</p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  93.8%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">Guntur</p>
                  <p className="text-sm text-muted-foreground">4/6 targets achieved</p>
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                  87.5%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">Kurnool</p>
                  <p className="text-sm text-muted-foreground">3/6 targets achieved</p>
                </div>
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  78.3%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  Strong Performance
                </h4>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Infrastructure and Learning Outcomes targets exceeded by significant margins
                </p>
              </div>
              
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                  Areas for Improvement
                </h4>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Teacher training and retention rates require focused intervention
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  Strategic Focus
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Digital learning access shows promising growth trajectory
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <Button className="w-full" data-testid="button-download-report">
                <Download className="w-4 h-4 mr-2" />
                Download Detailed Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
