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
      description: "Upload Cisco, Fortinet, Juniper, or Palo Alto configs for automated compliance analysis",
      icon: UploadCloud,
      badge: "Fast Scan",
      onClick: () => navigate({ to: "/audit" }),
      gradient: "from-blue-50 via-blue-100/50 to-transparent",
      iconColor: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "View Security Findings",
      description: "Inspect multi-framework violation evidence and interactive before/after remediation diffs",
      icon: AlertTriangle,
      badge: "8 Critical",
      onClick: () => navigate({ to: "/results" }),
      gradient: "from-amber-50 via-amber-100/50 to-transparent",
      iconColor: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      title: "AI Configuration Pipeline",
      description: "Explore real-time NLP semantic interpretation and normalized security model mapping",
      icon: Brain,
      badge: "NLP Engine",
      onClick: () => navigate({ to: "/analysis" }),
      gradient: "from-purple-50 via-purple-100/50 to-transparent",
      iconColor: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      title: "Adaptive Learning Hub",
      description: "Validate unknown vendor syntax commands and expand the NetSage Knowledge Base",
      icon: Zap,
      badge: "3 Pending",
      onClick: () => navigate({ to: "/learning" }),
      gradient: "from-emerald-50 via-emerald-100/50 to-transparent",
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
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
    <div className="min-h-screen bg-background text-foreground selection:bg-blue-100 selection:text-blue-900 relative">
      <PageBackground variant="dashboard" />
      <AppNavbar currentPath="/" />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
        {/* Executive Hero Banner */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Network Security & Compliance Overview
              </h1>
              <p className="max-w-2xl text-sm text-slate-600">
                Real-time multi-vendor configuration assessment, deterministic rule evaluation, and adaptive AI semantic interpretation across your enterprise fleet.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate({ to: "/reports" })}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-98"
              >
                <BarChart3 className="h-4 w-4 text-slate-500" />
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
              <h2 className="text-lg font-bold tracking-tight text-slate-900">Operational Workflows</h2>
              <p className="text-xs text-slate-600">Direct access to core compliance & assessment pipelines</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={action.onClick}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                  <div className="relative z-10 mb-4 flex items-start justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${action.iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
                      {action.badge}
                    </span>
                  </div>

                  <div className="relative z-10 space-y-1.5">
                    <h3 className="font-sans text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-600">{action.description}</p>
                  </div>

                  <div className="relative z-10 mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600">
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
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Recent Device Assessments</h2>
                  <p className="text-xs text-slate-600">Latest configuration audit results</p>
                </div>
                <Link
                  to="/results"
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  <span>View all results</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-mono text-xs uppercase tracking-wider text-slate-600">
                      <th className="px-6 py-3 font-semibold">Device</th>
                      <th className="px-4 py-3 font-semibold">Vendor / OS</th>
                      <th className="px-4 py-3 font-semibold">Framework</th>
                      <th className="px-4 py-3 font-semibold">Score</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {recentAudits.map((item) => (
                      <tr
                        key={item.device}
                        onClick={() => navigate({ to: `/device/${item.device}` })}
                        className="group cursor-pointer transition-colors hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700">
                              <Server className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {item.device}
                              </p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.time}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-medium text-slate-700">{item.vendor}</td>
                        <td className="px-4 py-4">
                          <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600">
                            {item.framework}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono text-xs font-bold ${
                                item.score >= 80 ? "text-emerald-600" : item.score >= 60 ? "text-amber-600" : "text-red-600"
                              }`}
                            >
                              {item.score}%
                            </span>
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className={`h-full rounded-full ${
                                  item.score >= 80 ? "bg-emerald-500" : item.score >= 60 ? "bg-amber-500" : "bg-red-500"
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
                          <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-blue-600 group-hover:underline">
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
            <div className="relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-200 bg-purple-50 text-purple-600">
                  <Brain className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-100 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-purple-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                  Self-Learning
                </span>
              </div>

              <h3 className="font-sans text-base font-bold text-slate-900">Adaptive Intelligence Active</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                When encountering unfamiliar proprietary commands, NetSage uses NLP to propose semantic mappings for administrator validation.
              </p>

              <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Knowledge Base:</span>
                  <span className="font-semibold text-slate-900">47 Verified Rules</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Pending Human Review:</span>
                  <span className="font-semibold text-amber-600">3 New Mappings</span>
                </div>
              </div>

              <button
                onClick={() => navigate({ to: "/learning" })}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-100 border border-purple-200 py-2.5 text-xs font-semibold text-purple-600 transition-colors hover:bg-purple-200 active:scale-98"
              >
                <span>Review Pending Mappings</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Architecture Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                <Layers className="h-4 w-4 text-blue-600" />
                <span>Multi-Vendor Architecture</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Normalized data model abstracts syntax across Cisco IOS, FortiOS, Junos OS, and PAN-OS into standard compliance primitives.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

