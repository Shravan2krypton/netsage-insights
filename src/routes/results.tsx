import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  Filter,
  Server,
  ChevronRight,
  Search,
  Wrench,
  Copy,
  Check,
  Eye,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { AppNavbar } from "@/components/netsage/navbar";
import { PageBackground } from "@/components/netsage/PageBackground";
import { SeverityBadge, ScoreRing } from "@/components/netsage/primitives";
import { DEMO_CONFIGS } from "../lib/netsage/demo-configs";
import { analyzeConfig, type Finding } from "../lib/netsage/engine";
import { generateReport } from "../lib/netsage/pdf";
import { toast } from "sonner";

export const Route = createFileRoute("/results")({
  component: Results,
});

function Results() {
  const navigate = useNavigate();
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFramework, setSelectedFramework] = useState<string>("all");
  const [activeRemediation, setActiveRemediation] = useState<Finding | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Analyze all demo configs
  const ciscoAnalysis = analyzeConfig(DEMO_CONFIGS.cisco.content, "cisco", "CIS");
  const fortinetAnalysis = analyzeConfig(
    DEMO_CONFIGS.fortinet.content,
    "fortinet",
    "NIST SP 800-53",
  );
  const juniperAnalysis = analyzeConfig(DEMO_CONFIGS.juniper.content, "juniper", "STIG");
  const paloaltoAnalysis = analyzeConfig(DEMO_CONFIGS.paloalto.content, "paloalto", "ISO 27001");

  const allAnalyses = [ciscoAnalysis, fortinetAnalysis, juniperAnalysis, paloaltoAnalysis];
  const allFindings = allAnalyses.flatMap((a) =>
    a.findings.map((f) => ({
      ...f,
      deviceName: a.deviceName,
      vendor: a.detection.vendorLabel,
    })),
  );

  const handleViewDevice = (deviceName: string) => {
    navigate({ to: `/device/${deviceName}` });
  };

  const handleExportPDF = (analysis: typeof ciscoAnalysis) => {
    generateReport(analysis, []);
    toast.success(`Generated PDF assessment for ${analysis.deviceName}`);
  };

  const handleCopySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Remediation syntax copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFindings = allFindings.filter((f) => {
    const matchesSeverity = selectedSeverity === "all" || f.severity === selectedSeverity;
    const matchesFramework =
      selectedFramework === "all" ||
      f.frameworkRefs.some((r) => r.toLowerCase().includes(selectedFramework.toLowerCase()));
    const matchesSearch =
      searchQuery === "" ||
      f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.control.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.affectedConfig.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSeverity && matchesFramework && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] flex flex-col relative z-0">
      <PageBackground variant="results" />
      <AppNavbar currentPath="/results" />

      {/* Cyber Grid Subheader - Full Width */}
      <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--background)] relative overflow-hidden">
        <div className="cyber-grid absolute inset-0 opacity-15 pointer-events-none" />
        <div className="px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                  <Shield className="w-3.5 h-3.5" />
                  <AlertTriangle className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Audit Findings & Remediation</span>
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Model: NetSage-Core v2.1
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gradient">
                Compliance Results & Security Findings
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl">
                Deterministic violations detected across CIS, NIST SP 800-53, DoD STIG, and ISO
                27001 baselines.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">
                  Total Findings
                </div>
                <div className="text-xl font-bold font-mono text-[var(--foreground)]">
                  {allFindings.length}
                </div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">
                  Critical Issues
                </div>
                <div className="text-xl font-bold font-mono text-rose-400">
                  {allFindings.filter((f) => f.severity === "critical").length}
                </div>
              </div>
              <button
                onClick={() => handleExportPDF(ciscoAnalysis)}
                className="px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] text-xs font-semibold shadow-md hover:shadow-[var(--primary)]/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
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
                    Deterministic Security Analysis
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30">
                    Live Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1.5 max-w-3xl leading-relaxed">
                  Comprehensive violation detection with before/after remediation diffs, PDF export
                  capabilities, and multi-framework compliance tracking across your entire network
                  fleet.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Server className="h-3.5 w-3.5 text-[var(--primary)]" />
                    <span>
                      <strong className="text-[var(--primary)]">4</strong> Devices
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Layers className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>
                      <strong className="text-[var(--accent)]">4</strong> Frameworks
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Wrench className="h-3.5 w-3.5 text-[var(--pass)]" />
                    <span>Auto-Remediation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Severity Metrics Summary Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <button
            onClick={() => setSelectedSeverity("all")}
            className={`rounded-xl border p-4 text-left transition-all ${
              selectedSeverity === "all"
                ? "border-[var(--primary)] bg-[var(--primary)]/20 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                : "border-[var(--primary)]/20 bg-[var(--surface)]/80 backdrop-blur-md hover:border-[var(--primary)]/40"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
              <span>Total Findings</span>
              <AlertTriangle className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <p className="mt-2 font-sans text-3xl font-extrabold text-[var(--foreground)]">
              {allFindings.length}
            </p>
            <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
              Across 4 audited devices
            </p>
          </button>

          <button
            onClick={() => setSelectedSeverity("critical")}
            className={`rounded-xl border p-4 text-left transition-all ${
              selectedSeverity === "critical"
                ? "border-rose-500 bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                : "border-rose-500/20 bg-[var(--surface)]/80 backdrop-blur-md hover:border-rose-400/40"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-rose-300">
              <span>Critical Risk</span>
              <XCircle className="h-4 w-4 text-rose-400" />
            </div>
            <p className="mt-2 font-sans text-3xl font-extrabold text-rose-400">
              {allFindings.filter((f) => f.severity === "critical").length}
            </p>
            <p className="mt-1 text-[11px] text-rose-300/60">Immediate patch required</p>
          </button>

          <button
            onClick={() => setSelectedSeverity("high")}
            className={`rounded-xl border p-4 text-left transition-all ${
              selectedSeverity === "high"
                ? "border-[var(--accent)] bg-[var(--accent)]/20 shadow-[0_0_15px_rgba(251,146,60,0.2)]"
                : "border-[var(--accent)]/20 bg-[var(--surface)]/80 backdrop-blur-md hover:border-[var(--accent)]/40"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              <span>High Severity</span>
              <AlertTriangle className="h-4 w-4 text-[var(--accent)]" />
            </div>
            <p className="mt-2 font-sans text-3xl font-extrabold text-[var(--accent)]">
              {allFindings.filter((f) => f.severity === "high").length}
            </p>
            <p className="mt-1 text-[11px] text-[var(--accent)]/60">Significant policy gaps</p>
          </button>

          <button
            onClick={() => setSelectedSeverity("medium")}
            className={`rounded-xl border p-4 text-left transition-all ${
              selectedSeverity === "medium"
                ? "border-[var(--primary)] bg-[var(--primary)]/20 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                : "border-[var(--primary)]/20 bg-[var(--surface)]/80 backdrop-blur-md hover:border-[var(--primary)]/40"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
              <span>Medium / Low</span>
              <AlertTriangle className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <p className="mt-2 font-sans text-3xl font-extrabold text-[var(--primary)]">
              {allFindings.filter((f) => f.severity === "medium" || f.severity === "low").length}
            </p>
            <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">Recommended hardening</p>
          </button>
        </div>

        {/* Device Fleet Cards */}
        <div className="mb-8 rounded-xl border border-[var(--border)]/80 bg-[var(--surface)]/80 p-6 shadow-soft backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-sans text-base font-bold text-[var(--foreground)]">
                Device Assessment Fleet
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Select a device to inspect detailed configuration parameters
              </p>
            </div>
            <span className="font-mono text-xs text-[var(--muted-foreground)]">
              4 Active Devices
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {allAnalyses.map((analysis) => (
              <button
                key={analysis.id}
                onClick={() => handleViewDevice(analysis.deviceName)}
                className="group relative flex flex-col justify-between rounded-xl border border-[var(--border)]/80 bg-[var(--background)]/50 p-4 text-left transition-all hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:bg-[var(--surface)] hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]">
                      <Server className="h-4 w-4 text-[var(--primary)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--foreground)] text-sm group-hover:text-[var(--primary)] transition-colors">
                        {analysis.deviceName}
                      </p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">
                        {analysis.detection.vendorLabel}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--border)]/60 pt-3">
                  <div>
                    <span className="text-[11px] text-[var(--muted-foreground)] block">
                      Compliance Score
                    </span>
                    <span
                      className={`font-mono text-base font-bold ${
                        analysis.complianceScore >= 80
                          ? "text-[var(--pass)]"
                          : analysis.complianceScore >= 60
                            ? "text-[var(--warn-strong)]"
                            : "text-[var(--crit)]"
                      }`}
                    >
                      {analysis.complianceScore}%
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-mono text-xs text-[var(--primary)] group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search findings by ID, control, or syntax keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)]/80 bg-[var(--surface)] py-2 pl-9 pr-4 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[var(--muted-foreground)]" />
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="rounded-lg border border-[var(--border)]/80 bg-[var(--surface)] px-3 py-1.5 font-mono text-xs text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
            >
              <option value="all">All Frameworks</option>
              <option value="CIS">CIS Benchmark</option>
              <option value="NIST">NIST SP 800-53</option>
              <option value="STIG">DoD STIG</option>
              <option value="ISO">ISO 27001</option>
            </select>
          </div>
        </div>

        {/* Security Findings Table */}
        <div className="overflow-hidden rounded-xl border border-[var(--border)]/80 bg-[var(--surface)]/80 shadow-soft backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-[var(--border)]/80 px-6 py-4">
            <h2 className="font-sans text-base font-bold text-[var(--foreground)]">
              Security Findings Catalog
            </h2>
            <span className="font-mono text-xs text-[var(--muted-foreground)]">
              Showing {filteredFindings.length} of {allFindings.length} findings
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]/60 bg-[var(--muted)]/40 font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
                  <th className="px-6 py-3 font-semibold">Finding / Control</th>
                  <th className="px-4 py-3 font-semibold">Severity</th>
                  <th className="px-4 py-3 font-semibold">Device</th>
                  <th className="px-4 py-3 font-semibold">Affected Configuration</th>
                  <th className="px-4 py-3 font-semibold">Frameworks</th>
                  <th className="px-6 py-3 font-semibold text-right">Remediation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/60">
                {filteredFindings.map((finding) => (
                  <tr
                    key={`${finding.deviceName}-${finding.id}`}
                    className="transition-colors hover:bg-[var(--muted)]/40"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{finding.control}</p>
                        <span className="font-mono text-[11px] text-[var(--muted-foreground)]">
                          {finding.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <SeverityBadge severity={finding.severity} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                        <Server className="h-3.5 w-3.5 text-[var(--primary)]" />
                        <span className="text-xs">{finding.deviceName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <code className="block max-w-xs truncate rounded border border-[var(--border)]/60 bg-[var(--code)] px-2 py-1 font-mono text-[11px] text-[var(--code-warn)]">
                        {finding.affectedConfig}
                      </code>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {finding.frameworkRefs.map((ref, idx) => (
                          <span
                            key={idx}
                            className="rounded border border-[var(--border)]/80 bg-[var(--muted)]/60 px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)]"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setActiveRemediation(finding)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-2.5 py-1 font-mono text-xs font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/20"
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        <span>View Fix</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Remediation Diff Modal */}
        {activeRemediation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-50">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border)]/80 bg-[var(--surface)] p-6 shadow-2xl">
              <div className="mb-4 flex items-start justify-between border-b border-[var(--border)]/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={activeRemediation.severity} />
                    <span className="font-mono text-xs text-[var(--muted-foreground)]">
                      {activeRemediation.id}
                    </span>
                  </div>
                  <h3 className="mt-1 font-sans text-lg font-bold text-[var(--foreground)]">
                    {activeRemediation.control}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {activeRemediation.description}
                  </p>
                </div>
                <button
                  onClick={() => setActiveRemediation(null)}
                  className="rounded-lg p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] font-mono"
                >
                  ✕
                </button>
              </div>

              {/* Before / After Diff */}
              <div className="space-y-4">
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-[var(--crit)]">
                    <span>Non-Compliant Configuration (Before)</span>
                  </div>
                  <pre className="rounded-lg border border-[var(--crit)]/30 bg-[var(--crit)]/5 p-3 font-mono text-xs text-[var(--crit)] leading-relaxed overflow-x-auto">
                    {activeRemediation.remediation.before}
                  </pre>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-[var(--pass)]">
                    <span>Recommended Hardening Fix (After)</span>
                    <button
                      onClick={() =>
                        handleCopySnippet(activeRemediation.remediation.after, activeRemediation.id)
                      }
                      className="flex items-center gap-1 text-[11px] text-[var(--primary)] hover:underline font-mono"
                    >
                      {copiedId === activeRemediation.id ? (
                        <Check className="h-3 w-3 text-[var(--pass)]" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>
                        {copiedId === activeRemediation.id ? "Copied" : "Copy Remediation"}
                      </span>
                    </button>
                  </div>
                  <pre className="rounded-lg border border-[var(--pass)]/30 bg-[var(--pass)]/5 p-3 font-mono text-xs text-[var(--pass)] leading-relaxed overflow-x-auto">
                    {activeRemediation.remediation.after}
                  </pre>
                </div>

                <div className="rounded-lg border border-[var(--border)]/80 bg-[var(--muted)]/40 p-3 text-xs text-[var(--muted-foreground)]">
                  <span className="font-semibold text-[var(--foreground)]">Explanation: </span>
                  {activeRemediation.remediation.explanation}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-border/80 pt-4">
                <button
                  onClick={() => setActiveRemediation(null)}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
