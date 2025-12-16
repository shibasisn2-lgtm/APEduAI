import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Briefcase,
  HeartPulse,
  Rocket,
  ShieldCheck,
  Target,
  Globe,
  MessageSquare,
  CalendarClock,
  Sparkles,
  Trophy,
} from "lucide-react";

const peopleMetrics = [
  {
    label: "Active Employees",
    value: "1,284",
    change: "+42 this quarter",
    icon: Users,
    accent: "bg-primary/10 text-primary",
  },
  {
    label: "Open Roles",
    value: "18",
    change: "6 in Engineering",
    icon: Briefcase,
    accent: "bg-accent/10 text-accent",
  },
  {
    label: "Retention Rate",
    value: "94.6%",
    change: "Goal: 95%",
    icon: ShieldCheck,
    accent: "bg-green-500/10 text-green-600",
  },
  {
    label: "eNPS",
    value: "71",
    change: "Top quartile",
    icon: HeartPulse,
    accent: "bg-amber-500/10 text-amber-600",
  },
];

const openRoles = [
  {
    title: "HR Business Partner",
    team: "People Operations",
    location: "Vijayawada · Hybrid",
    type: "Full-time",
    salary: "₹18 - 22 LPA",
    tags: ["Stakeholder mgmt.", "Policy rollout", "Data-led decisions"],
  },
  {
    title: "Technical Recruiter",
    team: "Talent Acquisition",
    location: "Remote (India)",
    type: "Contract-to-hire",
    salary: "₹14 - 17 LPA",
    tags: ["Eng hiring", "Sourcing", "ATS"],
  },
  {
    title: "People Analytics Lead",
    team: "People Insights",
    location: "Hyderabad · Onsite",
    type: "Full-time",
    salary: "₹24 - 28 LPA",
    tags: ["Dashboards", "Workforce planning", "SQL / Sheets"],
  },
];

const programs = [
  {
    title: "Onboarding in 30-60-90",
    description:
      "Role clarity, buddy program, and first delivery milestones across the first quarter.",
    icon: Rocket,
  },
  {
    title: "Manager Essentials",
    description:
      "Monthly cohorts on feedback, performance coaching, and inclusive leadership.",
    icon: Target,
  },
  {
    title: "Wellness & Care",
    description:
      "Telehealth coverage, recharge days, and year-round mental wellness sessions.",
    icon: HeartPulse,
  },
];

const cultureHighlights = [
  {
    title: "People Pulse",
    items: [
      { label: "Learning hours / FTE", value: "14.2 hrs", progress: 72 },
      { label: "Internal mobility", value: "19% promoted", progress: 64 },
      { label: "Mentorship matches", value: "132 active", progress: 48 },
    ],
  },
  {
    title: "Upcoming moments",
    items: [
      { label: "Women in Tech circle", date: "Feb 12 · 4:00 PM", icon: Globe },
      { label: "Quarterly awards", date: "Feb 20 · 5:30 PM", icon: Trophy },
      { label: "Hiring day", date: "Mar 03 · 11:00 AM", icon: CalendarClock },
    ],
  },
];

const policies = [
  {
    title: "Flexible-first",
    description: "Hybrid cadence with quarterly in-person team connect weeks.",
  },
  {
    title: "Career frameworks",
    description: "Transparent leveling, bands, and growth tracks by function.",
  },
  {
    title: "Inclusive hiring",
    description: "Structured interviews, diverse panels, and bias guardrails.",
  },
  {
    title: "Safe workplace",
    description: "POSH compliance, ombud channels, and anonymous reporting.",
  },
];

export default function HumanResources() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary text-primary-foreground p-8 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_35%)]" />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <Badge
              variant="outline"
              className="bg-white/10 text-primary-foreground border-white/20"
            >
              People · Culture · Growth
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Human Resources Hub
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/90">
              A single destination for talent, culture, and employee experience.
              Track people health, share policies, and showcase how we hire and
              grow our teams.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="lg">
                View open roles
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/40 hover:bg-white/20">
                Download HR playbook
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            {peopleMetrics.slice(0, 2).map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="rounded-xl bg-white/10 p-4 backdrop-blur text-sm shadow-lg"
                >
                  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${metric.accent}`}>
                    <Icon className="w-4 h-4" />
                    <span>{metric.label}</span>
                  </div>
                  <p className="text-2xl font-semibold mt-3">{metric.value}</p>
                  <p className="text-xs text-primary-foreground/80 mt-1">
                    {metric.change}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold">People health</h2>
            <p className="text-muted-foreground">
              Key signals on workforce stability and engagement.
            </p>
          </div>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">
            Real-time dashboards refreshed hourly
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {peopleMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="h-full border-muted shadow-sm stat-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs ${metric.accent}`}>
                      <Icon className="w-4 h-4" />
                      <span>{metric.label}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {metric.change}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-3xl font-bold text-foreground">
                    {metric.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Tracked across geographies and business units.
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle>Open roles</CardTitle>
            <CardDescription>
              Transparent roles, expectations, and where to apply.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {openRoles.map((role) => (
              <div
                key={role.title}
                className="rounded-lg border border-border/60 p-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {role.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{role.team}</p>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                    {role.type}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-3">
                  <span className="inline-flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {role.location}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    {role.salary}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {role.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Candidate pipeline</CardTitle>
            <CardDescription>
              Where applicants are across the hiring journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { stage: "Screened", value: 62, color: "bg-primary" },
              { stage: "Interviewing", value: 34, color: "bg-amber-500" },
              { stage: "Offers", value: 9, color: "bg-emerald-600" },
            ].map((item) => (
              <div key={item.stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.stage}</span>
                  <span className="text-muted-foreground">{item.value} candidates</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full`}
                    style={{ width: `${Math.min(item.value, 100)}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground flex items-start gap-2">
              <MessageSquare className="w-4 h-4 mt-0.5" />
              <span>
                Candidates receive structured interview prep and transparent timelines.
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle>Experience playbook</CardTitle>
            <CardDescription>
              How we onboard, enable, and celebrate teammates.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {programs.map((program) => {
                const Icon = program.icon;
                return (
                  <div
                    key={program.title}
                    className="rounded-lg border border-border/70 p-4 bg-muted/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-full bg-primary/10 text-primary">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">{program.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {program.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-lg border border-border/70 p-4 bg-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Onboarding momentum</p>
                  <p className="text-2xl font-semibold text-foreground">87% ready by Day 10</p>
                </div>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-3">
                {[
                  { label: "Access & tools provisioned", value: 92 },
                  { label: "Role clarity & success plan", value: 84 },
                  { label: "Buddy & manager check-ins", value: 78 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="text-muted-foreground">{item.value}%</span>
                    </div>
                    <Progress value={item.value} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Culture highlights</CardTitle>
            <CardDescription>
              Snapshot of how teams learn, connect, and celebrate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cultureHighlights.map((highlight) => (
              <div key={highlight.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">{highlight.title}</p>
                  <Badge variant="outline" className="text-xs">
                    Updated weekly
                  </Badge>
                </div>
                {highlight.items.map((item) =>
                  "progress" in item ? (
                    <div key={item.label} className="bg-muted/60 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-muted-foreground">{item.value}</span>
                      </div>
                      <Progress value={item.progress} className="mt-2 h-2" />
                    </div>
                  ) : (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-lg border border-dashed border-border/70 p-3 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-muted-foreground">{item.date}</span>
                    </div>
                  )
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Policies & resources</CardTitle>
            <CardDescription>
              Quick references for managers and employees.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {policies.map((policy) => (
              <div key={policy.title} className="p-4 rounded-lg border border-border/70 bg-muted/40">
                <p className="font-semibold text-foreground">{policy.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {policy.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-muted to-background border-dashed border-border">
          <CardHeader className="pb-4">
            <CardTitle>Recognition</CardTitle>
            <CardDescription>
              Celebrating teams who keep us moving forward.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-white/60 dark:bg-muted/60 p-4 shadow-sm">
              <div>
                <p className="text-lg font-semibold text-foreground">
                  Customer Success
                </p>
                <p className="text-sm text-muted-foreground">
                  98% CSAT · 3 months streak
                </p>
              </div>
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            <div className="rounded-lg border border-border/70 p-4 bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Peer kudos</p>
                  <p className="text-sm text-muted-foreground">
                    Share gratitude and wins across teams.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {["#sales-squad", "#eng-builders", "#design-guild"].map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="flex-1 min-w-[160px]">Submit a kudos</Button>
              <Button variant="outline" className="flex-1 min-w-[160px]">
                Schedule a team spotlight
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
