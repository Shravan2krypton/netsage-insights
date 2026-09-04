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
} from "lucide-react";
import { useState } from "react";
import { AppNavbar } from "@/components/netsage/navbar";
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
  const fortinetAnalysis = analyzeConfig(DEMO_CONFIGS.fortinet.content, "fortinet", "NIST SP 800-53");
  const juniperAnalysis = analyzeConfig(DEMO_CONFIGS.juniper.content, "juniper", "STIG");
  const paloaltoAnalysis = analyzeConfig(DEMO_CONFIGS.paloalto.content, "paloalto", "ISO 27001");

  const allAnalyses = [ciscoAnalysis, fortinetAnalysis, juniperAnalysis, paloaltoAnalysis];
  const allFindings = allAnalyses.flatMap((a) =>
    a.findings.map((f) => ({
      ...f,
      deviceName: a.deviceName,
      vendor: a.detection.vendorLabel,
    }))
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
      selectedFramework === "all" || f.frameworkRefs.some((r) => r.toLowerCase().includes(selectedFramework.toLowerCase()));
    const matchesSearch =
      searchQuery === "" ||
      f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.control.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.affectedConfig.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSeverity && matchesFramework && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <AppNavbar currentPath="/results" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 font-mono text-xs font-semibold text-primary mb-2">
              <Shield className="h-3.5 w-3.5" />
              <span>Audit Findings & Remediation</span>
            </div>
            <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Compliance Results & Security Findings
            </h1>
            <p className="text-sm text-muted-foreground">
              Deterministic violations detected across CIS, NIST SP 800-53, DoD STIG, and ISO 27001 baselines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleExportPDF(ciscoAnalysis)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-98"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Executive PDF</span>
            </button>
          </div>
        </div>

        {/* Severity Metrics Summary Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <button
            onClick={() => setSelectedSeverity("all")}
            className={`rounded-xl border p-4 text-left transition-all ${
              selectedSeverity === "all"
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border/80 bg-card/80 hover:border-primary/40"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Total Findings</span>
              <AlertTriangle className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 font-sans text-3xl font-extrabold text-foreground">{allFindings.length}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Across 4 audited devices</p>
          </button>

          <button
            onClick={() => setSelectedSeverity("critical")}
            className={`rounded-xl border p-4 text-left transition-all ${
              selectedSeverity === "critical"
                ? "border-crit bg-crit/15 shadow-sm"
                : "border-crit/30 bg-crit/5 hover:border-crit/60"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-crit">
              <span>Critical Risk</span>
              <XCircle className="h-4 w-4 text-crit" />
            </div>
            <p className="mt-2 font-sans text-3xl font-extrabold text-crit">
              {allFindings.filter((f) => f.severity === "critical").length}
            </p>
            <p className="mt-1 text-[11px] text-crit/80">Immediate patch required</p>
          </button>

          <button
            onClick={() => setSelectedSeverity("high")}
            className={`rounded-xl border p-4 text-left transition-all ${
              selectedSeverity === "high"
                ? "border-warn bg-warn/20 shadow-sm"
                : "border-warn/30 bg-warn/5 hover:border-warn/60"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-warn-strong">
              <span>High Severity</span>
              <AlertTriangle className="h-4 w-4 text-warn-strong" />
            </div>
            <p className="mt-2 font-sans text-3xl font-extrabold text-warn-strong">
              {allFindings.filter((f) => f.severity === "high").length}
            </p>
            <p className="mt-1 text-[11px] text-warn-strong/80">Significant policy gaps</p>
          </button>

          <button
            onClick={() => setSelectedSeverity("medium")}
            className={`rounded-xl border p-4 text-left transition-all ${
              selectedSeverity === "medium"
                ? "border-accent-cyan bg-accent-cyan/15 shadow-sm"
                : "border-accent-cyan/30 bg-accent-cyan/5 hover:border-accent-cyan/60"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-accent-cyan">
              <span>Medium / Low</span>
              <AlertTriangle className="h-4 w-4 text-accent-cyan" />
            </div>
            <p className="mt-2 font-sans text-3xl font-extrabold text-accent-cyan">
              {allFindings.filter((f) => f.severity === "medium" || f.severity === "low").length}
            </p>
            <p className="mt-1 text-[11px] text-accent-cyan/80">Recommended hardening</p>
          </button>
        </div>

        {/* Device Fleet Cards */}
        <div className="mb-8 rounded-xl border border-border/80 bg-card/80 p-6 shadow-soft backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-sans text-base font-bold text-foreground">Device Assessment Fleet</h2>
              <p className="text-xs text-muted-foreground">Select a device to inspect detailed configuration parameters</p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">4 Active Devices</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {allAnalyses.map((analysis) => (
              <button
                key={analysis.id}
                onClick={() => handleViewDevice(analysis.deviceName)}
                className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-background/50 p-4 text-left transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground">
                      <Server className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                        {analysis.deviceName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{analysis.detection.vendorLabel}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-3">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Compliance Score</span>
                    <span
                      className={`font-mono text-base font-bold ${
                        analysis.complianceScore >= 80
                          ? "text-pass"
                          : analysis.complianceScore >= 60
                            ? "text-warn-strong"
                            : "text-crit"
                      }`}
                    >
                      {analysis.complianceScore}%
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-mono text-xs text-primary group-hover:translate-x-0.5 transition-transform">
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
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search findings by ID, control, or syntax keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-card py-2 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="rounded-lg border border-border/80 bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
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
        <div className="overflow-hidden rounded-xl border border-border/80 bg-card/80 shadow-soft backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
            <h2 className="font-sans text-base font-bold text-foreground">Security Findings Catalog</h2>
            <span className="font-mono text-xs text-muted-foreground">
              Showing {filteredFindings.length} of {allFindings.length} findings
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-3 font-semibold">Finding / Control</th>
                  <th className="px-4 py-3 font-semibold">Severity</th>
                  <th className="px-4 py-3 font-semibold">Device</th>
                  <th className="px-4 py-3 font-semibold">Affected Configuration</th>
                  <th className="px-4 py-3 font-semibold">Frameworks</th>
                  <th className="px-6 py-3 font-semibold text-right">Remediation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredFindings.map((finding) => (
                  <tr key={`${finding.deviceName}-${finding.id}`} className="transition-colors hover:bg-muted/40">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-foreground">{finding.control}</p>
                        <span className="font-mono text-[11px] text-muted-foreground">{finding.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <SeverityBadge severity={finding.severity} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Server className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs">{finding.deviceName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <code className="block max-w-xs truncate rounded border border-border/60 bg-code px-2 py-1 font-mono text-[11px] text-code-warn">
                        {finding.affectedConfig}
                      </code>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {finding.frameworkRefs.map((ref, idx) => (
                          <span
                            key={idx}
                            className="rounded border border-border/80 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setActiveRemediation(finding)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
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
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border/80 bg-card p-6 shadow-2xl">
              <div className="mb-4 flex items-start justify-between border-b border-border/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={activeRemediation.severity} />
                    <span className="font-mono text-xs text-muted-foreground">{activeRemediation.id}</span>
                  </div>
                  <h3 className="mt-1 font-sans text-lg font-bold text-foreground">
                    {activeRemediation.control}
                  </h3>
                  <p className="text-xs text-muted-foreground">{activeRemediation.description}</p>
                </div>
                <button
                  onClick={() => setActiveRemediation(null)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground font-mono"
                >
                  ✕
                </button>
              </div>

              {/* Before / After Diff */}
              <div className="space-y-4">
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-crit">
                    <span>Non-Compliant Configuration (Before)</span>
                  </div>
                  <pre className="rounded-lg border border-crit/30 bg-crit/5 p-3 font-mono text-xs text-crit leading-relaxed overflow-x-auto">
                    {activeRemediation.remediation.before}
                  </pre>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-pass">
                    <span>Recommended Hardening Fix (After)</span>
                    <button
                      onClick={() =>
                        handleCopySnippet(activeRemediation.remediation.after, activeRemediation.id)
                      }
                      className="flex items-center gap-1 text-[11px] text-primary hover:underline font-mono"
                    >
                      {copiedId === activeRemediation.id ? (
                        <Check className="h-3 w-3 text-pass" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedId === activeRemediation.id ? "Copied" : "Copy Remediation"}</span>
                    </button>
                  </div>
                  <pre className="rounded-lg border border-pass/30 bg-pass/5 p-3 font-mono text-xs text-pass leading-relaxed overflow-x-auto">
                    {activeRemediation.remediation.after}
                  </pre>
                </div>

                <div className="rounded-lg border border-border/80 bg-muted/40 p-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Explanation: </span>
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