import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart } from "lucide-react";

const highlights = [
  { label: "Quarter-to-date revenue", value: "₹42.8 Cr", detail: "Up 7.3% vs plan" },
  { label: "Top performing region", value: "North", detail: "124% of target" },
  { label: "New logos won", value: "18", detail: "Key wins in BFSI & Edu" },
];

export default function SalesDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Sales Performance</h2>
          <p className="text-muted-foreground">
            Snapshot of revenue momentum, wins, and pipeline quality.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Live preview
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Highlights</CardTitle>
          <CardDescription>High-level numbers your teams watch daily.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlights.map((item) => (
            <div key={item.label} className="rounded-lg border border-border p-4 bg-muted/40">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <LineChart className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-semibold text-foreground mt-2">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
