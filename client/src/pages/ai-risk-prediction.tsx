import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { File, AlertTriangle } from "lucide-react";
import RiskDistributionChart from "@/components/charts/risk-distribution-chart";
import type { Student } from "@shared/schema";

export default function AiRiskPrediction() {
  const { data: highRiskStudents, isLoading } = useQuery<Student[]>({
    queryKey: ["/api/students/high-risk"],
  });

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          AI Risk Prediction Dashboard
        </h2>
        <p className="text-muted-foreground">
          Machine learning-powered student dropout risk assessment and intervention planning
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart />
          </CardContent>
        </Card>

        {/* Top Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Risk Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">Low Attendance</span>
                  <span className="text-sm font-semibold text-red-600">38%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: "38%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">Poor Performance</span>
                  <span className="text-sm font-semibold text-amber-600">28%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: "28%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">Economic Factors</span>
                  <span className="text-sm font-semibold text-amber-600">22%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: "22%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">Family Issues</span>
                  <span className="text-sm font-semibold text-green-600">12%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "12%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Performance */}
        <Card>
          <CardHeader>
            <CardTitle>AI Model Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Prediction Accuracy</p>
                <p className="text-3xl font-bold text-primary" data-testid="text-model-accuracy">94.7%</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Precision</p>
                  <p className="text-xl font-bold text-foreground">92.3%</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Recall</p>
                  <p className="text-xl font-bold text-foreground">96.1%</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Last updated: Dec 15, 2024
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High-Risk Students Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-amber-500 mr-2" />
              High-Risk Students Requiring Immediate Attention
            </CardTitle>
            <Button variant="outline" size="sm" data-testid="button-export-list">
              <File className="w-4 h-4 mr-2" />
              Export List
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground mt-2">Loading high-risk students...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Student ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">District</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Risk Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Primary Factor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {highRiskStudents?.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-muted/30 transition-colors"
                      data-testid={`row-high-risk-student-${index}`}
                    >
                      <td className="px-6 py-4 text-muted-foreground">{student.studentId}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{student.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {/* District name would come from relation */}
                        District Name
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-muted rounded-full h-2 max-w-[100px]">
                            <div 
                              className="bg-red-600 h-2 rounded-full" 
                              style={{ width: `${student.riskScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-red-600">
                            {student.riskScore}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {student.primaryRiskFactor}
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                        >
                          View Actions
                        </Button>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Fallback rows if no data */}
                  {!highRiskStudents?.length && !isLoading && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        No high-risk students found
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
