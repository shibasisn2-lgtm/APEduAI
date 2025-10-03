import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SchemeAnalytics() {
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Government Scheme Analytics
        </h2>
        <p className="text-muted-foreground">
          Comprehensive analysis of government scheme coverage and effectiveness
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Scheme Coverage Cards */}
        <Card className="stat-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Mid-Day Meal</h3>
            <p className="text-3xl font-bold text-primary mb-2">94%</p>
            <Progress value={94} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">1,250,000 beneficiaries</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-2">JBAR Uniforms</h3>
            <p className="text-3xl font-bold text-accent mb-2">87%</p>
            <Progress value={87} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">980,000 beneficiaries</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-2">PM POSHAN</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">91%</p>
            <Progress value={91} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">1,150,000 beneficiaries</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-2">KGBV</h3>
            <p className="text-3xl font-bold text-amber-600 mb-2">76%</p>
            <Progress value={76} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">45,000 beneficiaries</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* District-wise Coverage */}
        <Card>
          <CardHeader>
            <CardTitle>District-wise Scheme Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Krishna</span>
                <span className="text-sm text-muted-foreground">98%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Chittoor</span>
                <span className="text-sm text-muted-foreground">96%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Guntur</span>
                <span className="text-sm text-muted-foreground">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Visakhapatnam</span>
                <span className="text-sm text-muted-foreground">92%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheme Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Scheme Impact on Dropout Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-400">Positive Impact</h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Districts with 90%+ scheme coverage show 35% lower dropout rates
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-400">Correlation</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Strong correlation between Mid-Day Meal coverage and attendance rates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
