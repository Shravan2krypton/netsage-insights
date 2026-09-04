import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Shield,
  FileText,
  Brain,
  Zap,
  AlertTriangle,
  Server,
  BarChart3,
  UploadCloud,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  ChevronRight,
  ShieldAlert,
  Layers,
} from "lucide-react";
import { AppNavbar } from "@/components/netsage/navbar";
import { StatCard, StatusPill } from "@/components/netsage/primitives";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Start Configuration Audit",
      description: "Upload Cisco, Fortinet, Juniper, or Palo Alto configs for automated compliance analysis",
      icon: UploadCloud,
      badge: "Fast Scan",
      onClick: () => navigate({ to: "/audit" }),
      gradient: "from-blue-500/20 via-primary/10 to-transparent",
      iconColor: "text-primary bg-primary/10 border-primary/20",
    },
    {
      title: "View Security Findings",
      description: "Inspect multi-framework violation evidence and interactive before/after remediation diffs",
      icon: AlertTriangle,
      badge: "8 Critical",
      onClick: () => navigate({ to: "/results" }),
      gradient: "from-warn/20 via-warn/10 to-transparent",
      iconColor: "text-warn-strong bg-warn/15 border-warn/30",
    },
    {
      title: "AI Configuration Pipeline",
      description: "Explore real-time NLP semantic interpretation and normalized security model mapping",
      icon: Brain,
      badge: "NLP Engine",
      onClick: () => navigate({ to: "/analysis" }),
      gradient: "from-ai/20 via-ai/10 to-transparent",
      iconColor: "text-ai bg-ai/15 border-ai/30",
    },
    {
      title: "Adaptive Learning Hub",
      description: "Validate unknown vendor syntax commands and expand the NetSage Knowledge Base",
      icon: Zap,
      badge: "3 Pending",
      onClick: () => navigate({ to: "/learning" }),
      gradient: "from-pass/20 via-pass/10 to-transparent",
      iconColor: "text-pass bg-pass/15 border-pass/30",
    },
  ];

  const stats = [
    {
      label: "Overall Compliance",
      value: "72%",
      trend: "+5.2%",
      hint: "Average across 4 standard frameworks",
      tone: "pass" as const,
      icon: <Shield className="h-5 w-5" />,
    },
    {
      label: "Devices Audited",
      value: "24",
      trend: "+3 this week",
      hint: "Multi-vendor router & firewall fleet",
      tone: "default" as const,
      icon: <Server className="h-5 w-5" />,
    },
    {
      label: "Critical Findings",
      value: "8",
      trend: "-2 resolved",
      hint: "Requires immediate remediation",
      tone: "crit" as const,
      icon: <ShieldAlert className="h-5 w-5" />,
    },
    {
      label: "High Priority Findings",
      value: "15",
      trend: "+1 new",
      hint: "CIS & NIST standard deviations",
      tone: "warn" as const,
      icon: <AlertTriangle className="h-5 w-5" />,
    },
  ];

  const recentAudits = [
    {
      device: "Cisco-Router-01",
      vendor: "Cisco IOS",
      framework: "CIS Benchmark",
      score: 68,
      status: "failed" as const,
      time: "2 hours ago",
      findings: 3,
    },
    {
      device: "FortiGate-Edge-02",
      vendor: "Fortinet FortiOS",
      framework: "NIST SP 800-53",
      score: 75,
      status: "review" as const,
      time: "5 hours ago",
      findings: 2,
    },
    {
      device: "Juniper-MX-03",
      vendor: "Juniper Junos",
      framework: "DoD STIG",
      score: 82,
      status: "valid" as const,
      time: "1 day ago",
      findings: 1,
    },
    {
      device: "PaloAlto-PA850-04",
      vendor: "Palo Alto PAN-OS",
      framework: "ISO 27001",
      score: 71,
      status: "failed" as const,
      time: "2 days ago",
      findings: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <AppNavbar currentPath="/" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Executive Hero Banner */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 p-6 shadow-soft sm:p-8">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-32 bottom-0 -mb-16 h-48 w-48 rounded-full bg-ai/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Continuous Network Compliance Engine</span>
              </div>
              <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Network Security & Compliance Overview
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Real-time multi-vendor configuration assessment, deterministic rule evaluation, and adaptive AI semantic interpretation across your enterprise fleet.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate({ to: "/audit" })}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-primary/25 active:scale-98"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Run New Audit</span>
              </button>
              <button
                onClick={() => navigate({ to: "/reports" })}
                className="flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-muted active:scale-98"
              >
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              hint={stat.hint}
              tone={stat.tone}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">Operational Workflows</h2>
              <p className="text-xs text-muted-foreground">Direct access to core compliance & assessment pipelines</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={action.onClick}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-card/70 p-5 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-md"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                  <div className="relative z-10 mb-4 flex items-start justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${action.iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-border bg-muted/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                      {action.badge}
                    </span>
                  </div>

                  <div className="relative z-10 space-y-1.5">
                    <h3 className="font-sans text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{action.description}</p>
                  </div>

                  <div className="relative z-10 mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
                    <span>Launch</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Audits Table & AI Spotlight */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Audits (2 columns) */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-border/80 bg-card/80 shadow-soft backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">Recent Device Assessments</h2>
                  <p className="text-xs text-muted-foreground">Latest configuration audit results</p>
                </div>
                <Link
                  to="/results"
                  className="flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  <span>View all results</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-6 py-3 font-semibold">Device</th>
                      <th className="px-4 py-3 font-semibold">Vendor / OS</th>
                      <th className="px-4 py-3 font-semibold">Framework</th>
                      <th className="px-4 py-3 font-semibold">Score</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {recentAudits.map((item) => (
                      <tr
                        key={item.device}
                        onClick={() => navigate({ to: `/device/${item.device}` })}
                        className="group cursor-pointer transition-colors hover:bg-muted/40"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground">
                              <Server className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {item.device}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.time}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-medium text-foreground">{item.vendor}</td>
                        <td className="px-4 py-4">
                          <span className="rounded border border-border/80 bg-muted/50 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                            {item.framework}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono text-xs font-bold ${
                                item.score >= 80 ? "text-pass" : item.score >= 60 ? "text-warn-strong" : "text-crit"
                              }`}
                            >
                              {item.score}%
                            </span>
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full ${
                                  item.score >= 80 ? "bg-pass" : item.score >= 60 ? "bg-warn" : "bg-crit"
                                }`}
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <StatusPill status={item.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-primary group-hover:underline">
                            Inspect
                            <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* AI Adaptive Learning Spotlight (1 column) */}
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-xl border border-ai/30 bg-gradient-to-br from-ai/15 via-card to-card p-6 shadow-soft backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-ai/30 bg-ai/20 text-ai">
                  <Brain className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-ai/30 bg-ai/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ai">
                  <span className="h-1.5 w-1.5 rounded-full bg-ai animate-pulse" />
                  Self-Learning
                </span>
              </div>

              <h3 className="font-sans text-base font-bold text-foreground">Adaptive Intelligence Active</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                When encountering unfamiliar proprietary commands, NetSage uses NLP to propose semantic mappings for administrator validation.
              </p>

              <div className="mt-4 space-y-2 rounded-lg border border-border/80 bg-background/60 p-3 font-mono text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Knowledge Base:</span>
                  <span className="font-semibold text-foreground">47 Verified Rules</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Pending Human Review:</span>
                  <span className="font-semibold text-warn-strong">3 New Mappings</span>
                </div>
              </div>

              <button
                onClick={() => navigate({ to: "/learning" })}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-ai/20 border border-ai/40 py-2.5 text-xs font-semibold text-ai transition-colors hover:bg-ai/30 active:scale-98"
              >
                <span>Review Pending Mappings</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Architecture Card */}
            <div className="rounded-xl border border-border/80 bg-card/70 p-5 shadow-soft backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Layers className="h-4 w-4 text-primary" />
                <span>Multi-Vendor Architecture</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Normalized data model abstracts syntax across Cisco IOS, FortiOS, Junos OS, and PAN-OS into standard compliance primitives.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

