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
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  ChevronRight,
  ShieldAlert,
  Layers,
  LayoutDashboard,
} from "lucide-react";
import { AppNavbar } from "@/components/netsage/navbar";
import { StatCard, StatusPill } from "@/components/netsage/primitives";
import { PageBackground } from "@/components/netsage/PageBackground";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Start Configuration Audit",
      description:
        "Upload Cisco, Fortinet, Juniper, or Palo Alto configs for automated compliance analysis",
      icon: UploadCloud,
      badge: "Fast Scan",
      onClick: () => navigate({ to: "/audit" }),
      gradient: "from-[var(--primary)]/20 via-[var(--primary)]/5 to-transparent",
      iconColor: "text-[var(--primary)]/80 bg-[var(--primary)]/15 border-[var(--primary)]/30",
    },
    {
      title: "View Security Findings",
      description:
        "Inspect multi-framework violation evidence and interactive before/after remediation diffs",
      icon: AlertTriangle,
      badge: "8 Critical",
      onClick: () => navigate({ to: "/results" }),
      gradient: "from-[var(--accent)]/20 via-[var(--accent)]/5 to-transparent",
      iconColor: "text-[var(--accent)] bg-[var(--accent)]/15 border-[var(--accent)]/30",
    },
    {
      title: "AI Configuration Pipeline",
      description:
        "Explore real-time NLP semantic interpretation and normalized security model mapping",
      icon: Brain,
      badge: "NLP Engine",
      onClick: () => navigate({ to: "/analysis" }),
      gradient: "from-[var(--primary)]/20 via-[var(--accent)]/10 to-transparent",
      iconColor: "text-[var(--primary)]/80 bg-[var(--primary)]/15 border-[var(--primary)]/30",
    },
    {
      title: "Adaptive Learning Hub",
      description: "Validate unknown vendor syntax commands and expand the NetSage Knowledge Base",
      icon: Zap,
      badge: "3 Pending",
      onClick: () => navigate({ to: "/learning" }),
      gradient: "from-[var(--accent)]/20 via-[var(--primary)]/10 to-transparent",
      iconColor: "text-[var(--accent)] bg-[var(--accent)]/15 border-[var(--accent)]/30",
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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] flex flex-col relative z-0">
      <PageBackground variant="dashboard" />
      <AppNavbar currentPath="/" />

      {/* Cyber Grid Subheader - Full Width */}
      <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--background)] relative overflow-hidden">
        <div className="cyber-grid absolute inset-0 opacity-15 pointer-events-none" />
        <div className="px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Enterprise Dashboard</span>
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Model: NetSage-Core v2.1
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gradient">
                Network Security & Compliance Overview
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl">
                Real-time multi-vendor configuration assessment, deterministic rule evaluation,
                and adaptive AI semantic interpretation across your enterprise fleet.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">
                  Overall Compliance
                </div>
                <div className="text-xl font-bold font-mono text-[var(--primary)]">72%</div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">
                  Devices Audited
                </div>
                <div className="text-xl font-bold font-mono text-[var(--foreground)]">24</div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">
                  Critical Findings
                </div>
                <div className="text-xl font-bold font-mono text-rose-400">8</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">

        {/* Key Differentiator Showcase Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/20 via-[var(--surface-elevated)] to-[var(--accent)]/20 p-6 sm:p-7 shadow-lg">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/30 flex items-center justify-center shrink-0 shadow-inner">
                <Shield className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[var(--foreground)]">
                    Multi-Vendor Compliance Intelligence
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30">
                    Live Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1.5 max-w-3xl leading-relaxed">
                  NetSage provides unified security posture across Cisco IOS, FortiOS, Junos OS, and
                  PAN-OS with deterministic rule evaluation and AI-assisted semantic interpretation.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Server className="h-3.5 w-3.5 text-[var(--primary)]" />
                    <span>
                      <strong className="text-[var(--primary)]">24</strong> Active Devices
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Layers className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>
                      <strong className="text-[var(--accent)]">4</strong> Frameworks
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Brain className="h-3.5 w-3.5 text-[var(--ai)]" />
                    <span>AI-Enhanced Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
                Operational Workflows
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Direct access to core compliance & assessment pipelines
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={action.onClick}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/50 hover:shadow-[0_4px_20px_rgba(251,146,60,0.12)]"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <div className="relative z-10 mb-4 flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border ${action.iconColor}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--primary)]">
                      {action.badge}
                    </span>
                  </div>

                  <div className="relative z-10 space-y-1.5">
                    <h3 className="font-sans text-base font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
                      {action.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors">
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
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/85 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
                <div>
                  <h2 className="text-base font-bold text-[var(--foreground)]">
                    Recent Device Assessments
                  </h2>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Latest configuration audit results
                  </p>
                </div>
                <Link
                  to="/results"
                  className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)] transition-colors hover:text-[var(--accent)]"
                >
                  <span>View all results</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--muted)]/60 font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
                      <th className="px-6 py-3 font-semibold">Device</th>
                      <th className="px-4 py-3 font-semibold">Vendor / OS</th>
                      <th className="px-4 py-3 font-semibold">Framework</th>
                      <th className="px-4 py-3 font-semibold">Score</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]/50">
                    {recentAudits.map((item) => (
                      <tr
                        key={item.device}
                        onClick={() => navigate({ to: `/device/${item.device}` })}
                        className="group cursor-pointer transition-colors hover:bg-[var(--primary)]/10"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/15 text-[var(--primary)]">
                              <Server className="h-4 w-4 text-[var(--primary)]" />
                            </div>
                            <div>
                              <p className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                                {item.device}
                              </p>
                              <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.time}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-medium text-[var(--muted-foreground)]">
                          {item.vendor}
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded border border-[var(--primary)]/25 bg-[var(--primary)]/10 px-2 py-0.5 font-mono text-[11px] text-[var(--primary)]">
                            {item.framework}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono text-xs font-bold ${
                                item.score >= 80
                                  ? "text-emerald-400"
                                  : item.score >= 60
                                    ? "text-orange-400"
                                    : "text-rose-400"
                              }`}
                            >
                              {item.score}%
                            </span>
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full ${
                                  item.score >= 80
                                    ? "bg-emerald-400"
                                    : item.score >= 60
                                      ? "bg-orange-400"
                                      : "bg-rose-400"
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
                          <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[var(--primary)] group-hover:text-[var(--accent)] group-hover:underline">
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
            <div className="relative overflow-hidden rounded-xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--surface)] via-[var(--muted)] to-[var(--surface)] p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/15 text-[var(--accent)]">
                  <Brain className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--accent)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  Self-Learning
                </span>
              </div>

              <h3 className="font-sans text-base font-bold text-[var(--foreground)]">
                Adaptive Intelligence Active
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted-foreground)]">
                When encountering unfamiliar proprietary commands, NetSage uses NLP to propose
                semantic mappings for administrator validation.
              </p>

              <div className="mt-4 space-y-2 rounded-lg border border-[var(--primary)]/20 bg-[var(--muted)]/70 p-3 font-mono text-xs">
                <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                  <span>Knowledge Base:</span>
                  <span className="font-semibold text-[var(--foreground)]">47 Verified Rules</span>
                </div>
                <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                  <span>Pending Human Review:</span>
                  <span className="font-semibold text-[var(--accent)]">3 New Mappings</span>
                </div>
              </div>

              <button
                onClick={() => navigate({ to: "/learning" })}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)]/20 border border-[var(--accent)]/30 py-2.5 text-xs font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/30 active:scale-98"
              >
                <span>Review Pending Mappings</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Architecture Card */}
            <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--surface-elevated)]/85 backdrop-blur-md p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                <Layers className="h-4 w-4 text-[var(--accent)]" />
                <span>Multi-Vendor Architecture</span>
              </div>
              <p className="mt-2 text-xs text-[var(--muted-foreground)] leading-relaxed">
                Normalized data model abstracts syntax across Cisco IOS, FortiOS, Junos OS, and
                PAN-OS into standard compliance primitives.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
