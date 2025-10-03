import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  University, 
  TrendingDown, 
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import DropoutTrendChart from "@/components/charts/dropout-trend-chart";

export default function Dashboard() {
  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/statistics"],
  });

  const { data: districtAnalysis, isLoading: districtLoading } = useQuery({
    queryKey: ["/api/district-analysis"],
  });

  const { data: schemes } = useQuery({
    queryKey: ["/api/schemes"],
  });

  if (statsLoading || districtLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <div className="h-8 bg-muted rounded w-1/2 mb-2" />
          <div className="h-4 bg-muted rounded w-1/3" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Andhra Pradesh Education Snapshot
        </h2>
        <p className="text-muted-foreground">
          Real-time insights into state education performance and dropout prevention
        </p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                <ArrowUp className="w-3 h-3 mr-1" />
                +2.1%
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Primary Enrolment Rate</h3>
            <p className="text-3xl font-bold text-foreground" data-testid="text-primary-enrollment">
              {statistics?.primaryEnrollment || 96.4}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">from last year</p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <University className="w-6 h-6 text-accent" />
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                <ArrowUp className="w-3 h-3 mr-1" />
                +1.8%
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Secondary Enrolment Rate</h3>
            <p className="text-3xl font-bold text-foreground" data-testid="text-secondary-enrollment">
              {statistics?.secondaryEnrollment || 89.7}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">from last year</p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-green-600" />
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                <ArrowDown className="w-3 h-3 mr-1" />
                -1.3%
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">State Dropout Rate</h3>
            <p className="text-3xl font-bold text-foreground" data-testid="text-dropout-rate">
              {statistics?.dropoutRate || 4.2}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">from last year</p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                <ArrowDown className="w-3 h-3 mr-1" />
                -0.9%
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">At-Risk Students</h3>
            <p className="text-3xl font-bold text-foreground" data-testid="text-at-risk-students">
              {statistics?.atRiskPercentage || 8.7}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">from last year</p>
          </CardContent>
        </Card>
      </div>
      
      {/* District-wise Analysis Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">District-wise Dropout Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">District</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total Students</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">At-Risk Students</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Risk Percentage</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {districtAnalysis?.map((analysis, index) => (
                  <tr 
                    key={analysis.district.id} 
                    className="hover:bg-muted/30 transition-colors"
                    data-testid={`row-district-${index}`}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {analysis.district.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {analysis.totalStudents.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {analysis.atRiskStudents.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {analysis.riskPercentage}%
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        className={
                          analysis.riskLevel === "High" ? "risk-high" :
                          analysis.riskLevel === "Medium" ? "risk-medium" : "risk-low"
                        }
                        data-testid={`badge-risk-${analysis.riskLevel.toLowerCase()}`}
                      >
                        {analysis.riskLevel}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dropout Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>5-Year Dropout Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <DropoutTrendChart />
          </CardContent>
        </Card>
        
        {/* Scheme Coverage */}
        <Card>
          <CardHeader>
            <CardTitle>Government Scheme Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mid-Day Meal */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">Mid-Day Meal</h4>
                  <span className="text-2xl font-bold text-primary" data-testid="text-mid-day-meal-coverage">94%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "94%" }} />
                </div>
                <p className="text-xs text-muted-foreground">High coverage in: Krishna, Nellore, Chittoor</p>
              </div>
              
              {/* JBAR Uniforms */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">JBAR Uniforms</h4>
                  <span className="text-2xl font-bold text-accent" data-testid="text-jbar-uniforms-coverage">87%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: "87%" }} />
                </div>
                <p className="text-xs text-muted-foreground">High coverage in: Guntur, Visakhapatnam</p>
              </div>
              
              {/* PM POSHAN */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">PM POSHAN</h4>
                  <span className="text-2xl font-bold text-green-600" data-testid="text-pm-poshan-coverage">91%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "91%" }} />
                </div>
                <p className="text-xs text-muted-foreground">High coverage in: East Godavari, West Godavari</p>
              </div>
              
              {/* KGBV */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">KGBV</h4>
                  <span className="text-2xl font-bold text-amber-600" data-testid="text-kgbv-coverage">76%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: "76%" }} />
                </div>
                <p className="text-xs text-muted-foreground">High coverage in: Anantapur, Kurnool</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
