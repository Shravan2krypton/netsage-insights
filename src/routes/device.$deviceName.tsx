import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Shield,
  Server,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Clock,
  TrendingUp,
  Wrench,
  Download,
  Copy,
  Check,
  FileCode,
  ShieldCheck,
  Cpu,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { AppNavbar } from "@/components/netsage/navbar";
import { PageBackground } from "@/components/netsage/PageBackground";
import {
  SeverityBadge,
  ScoreRing,
  ConfigViewer,
  StatusPill,
} from "@/components/netsage/primitives";
import { DEMO_CONFIGS } from "../lib/netsage/demo-configs";
import { analyzeConfig } from "../lib/netsage/engine";
import { generateReport } from "../lib/netsage/pdf";
import { toast } from "sonner";

export const Route = createFileRoute("/device/$deviceName")({
  component: DeviceDetail,
});

function DeviceDetail() {
  const { deviceName } = Route.useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"findings" | "frameworks" | "controls" | "raw">(
    "findings",
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Find the matching demo config
  const demoConfig = Object.values(DEMO_CONFIGS).find((c) => c.deviceName === deviceName);

  if (!demoConfig) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
        <AppNavbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md rounded-2xl border border-[var(--border)]/80 bg-[var(--card)] p-8 shadow-soft">
            <Server className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4" />
            <h2 className="font-sans text-xl font-bold text-[var(--foreground)]">
              Device Not Found
            </h2>
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              The requested network device configuration "{deviceName}" is not loaded in the active
              session.
            </p>
            <button
              onClick={() => navigate({ to: "/results" })}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Results</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const analysis = analyzeConfig(demoConfig.content, demoConfig.vendor, "CIS");

  const riskLevel =
    analysis.securityScore >= 80
      ? "Low Risk"
      : analysis.securityScore >= 60
        ? "Medium Risk"
        : "High Risk";
  const riskColor =
    analysis.securityScore >= 80
      ? "text-pass bg-pass/15 border-pass/30"
      : analysis.securityScore >= 60
        ? "text-warn-strong bg-warn/15 border-warn/30"
        : "text-crit bg-crit/15 border-crit/30";

  const handleExportPDF = () => {
    generateReport(analysis, []);
    toast.success(`Generated PDF assessment for ${analysis.deviceName}`);
  };

  const handleCopySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Remediation syntax copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] flex flex-col relative z-0">
      <PageBackground variant="results" />
      <AppNavbar />

      {/* Cyber Grid Subheader - Full Width */}
      <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--background)] relative overflow-hidden">
        <div className="cyber-grid absolute inset-0 opacity-15 pointer-events-none" />
        <div className="px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                  <Server className="w-3.5 h-3.5" />
                  <span>Device Inspector</span>
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Model: NetSage-Core v2.1
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gradient">
                {analysis.deviceName}
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl">
                Detailed configuration analysis, security findings, and compliance assessment for
                this network device.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">
                  Compliance Score
                </div>
                <div className="text-xl font-bold font-mono text-[var(--primary)]">
                  {analysis.complianceScore}%
                </div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">Findings</div>
                <div className="text-xl font-bold font-mono text-[var(--foreground)]">
                  {analysis.findings.length}
                </div>
              </div>
              <button
                onClick={handleExportPDF}
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
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/results" })}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)]/80 bg-[var(--card)] px-3 py-1.5 font-mono text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Fleet Results</span>
          </button>
        </div>

        {/* Device Hero Header */}
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)]/80 bg-gradient-to-r from-[var(--card)] via-[var(--card)] to-[var(--primary)]/5 p-6 shadow-soft sm:p-8 backdrop-blur-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] shadow-inner">
                <Server className="h-7 w-7" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-sans text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
                    {analysis.deviceName}
                  </h1>
                  <span className="rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--primary)]">
                    {analysis.detection.vendorLabel}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${riskColor}`}
                  >
                    {riskLevel}
                  </span>
                </div>

                <p className="font-mono text-xs text-[var(--muted-foreground)]">
                  Source: <span className="text-[var(--foreground)]">{analysis.fileName}</span> •
                  Detection Confidence:{" "}
                  <span className="font-semibold text-[var(--foreground)]">
                    {analysis.detection.confidence}%
                  </span>{" "}
                  • Audited: {new Date(analysis.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Score Ring Gauge */}
            <div className="flex items-center gap-6 rounded-xl border border-[var(--border)]/80 bg-[var(--background)]/50 p-4">
              <ScoreRing score={analysis.complianceScore} label="Compliance" size={100} />
              <div className="space-y-1 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--pass)]" />
                  <span className="text-[var(--muted-foreground)]">Passed:</span>
                  <span className="font-bold text-[var(--foreground)]">
                    {analysis.normalized.controls.filter((c) => c.status === "valid").length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--crit)]" />
                  <span className="text-[var(--muted-foreground)]">Failed:</span>
                  <span className="font-bold text-[var(--foreground)]">
                    {analysis.normalized.controls.filter((c) => c.status === "failed").length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--warn)]" />
                  <span className="text-[var(--muted-foreground)]">Review:</span>
                  <span className="font-bold text-[var(--foreground)]">
                    {analysis.normalized.controls.filter((c) => c.status === "review").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)]/80 pb-3">
          <button
            onClick={() => setActiveTab("findings")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-semibold transition-colors ${
              activeTab === "findings"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                : "border border-[var(--border)]/80 bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Security Findings ({analysis.findings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("frameworks")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-semibold transition-colors ${
              activeTab === "frameworks"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                : "border border-[var(--border)]/80 bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Framework Compliance ({analysis.compliance.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("controls")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-semibold transition-colors ${
              activeTab === "controls"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                : "border border-[var(--border)]/80 bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Normalized Model ({analysis.normalized.controls.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("raw")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-semibold transition-colors ${
              activeTab === "raw"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                : "border border-[var(--border)]/80 bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Raw Syntax Inspector</span>
          </button>
        </div>

        {/* Tab 1: Security Findings */}
        {activeTab === "findings" && (
          <div className="space-y-4 animate-in fade-in-50">
            {analysis.findings.map((finding) => (
              <div
                key={finding.id}
                className="rounded-xl border border-[var(--border)]/80 bg-[var(--card)]/90 p-6 shadow-soft transition-all hover:border-[var(--primary)]/40"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <SeverityBadge severity={finding.severity} />
                    <span className="font-mono text-xs font-bold text-[var(--muted-foreground)]">
                      {finding.id}
                    </span>
                    <h3 className="font-sans text-base font-bold text-[var(--foreground)]">
                      {finding.control}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {finding.frameworkRefs.map((ref, idx) => (
                      <span
                        key={idx}
                        className="rounded border border-[var(--border)]/80 bg-[var(--muted)]/50 px-2 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)]"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-[var(--muted-foreground)] mb-4">
                  {finding.description}
                </p>

                {/* Evidence */}
                <div className="mb-4 rounded-lg border border-[var(--border)]/60 bg-[var(--code)]/80 p-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--code-muted)] block mb-1">
                    Configuration Evidence
                  </span>
                  <code className="font-mono text-xs text-[var(--code-warn)]">
                    {finding.affectedConfig}
                  </code>
                </div>

                {/* Remediation Diff */}
                <div className="border-t border-[var(--border)]/60 pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-sans text-xs font-bold text-[var(--foreground)]">
                      <Wrench className="h-3.5 w-3.5 text-[var(--primary)]" />
                      <span>Recommended Hardening Remediation</span>
                    </div>

                    <button
                      onClick={() => handleCopySnippet(finding.remediation.after, finding.id)}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--primary)] hover:underline"
                    >
                      {copiedId === finding.id ? (
                        <Check className="h-3 w-3 text-[var(--pass)]" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedId === finding.id ? "Copied" : "Copy Fix"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <div>
                      <div className="mb-1 text-[11px] font-semibold text-[var(--crit)]">
                        Before (Non-Compliant)
                      </div>
                      <pre className="max-h-40 overflow-auto rounded-lg border border-[var(--crit)]/30 bg-[var(--crit)]/5 p-3 font-mono text-xs text-[var(--crit)] leading-relaxed">
                        {finding.remediation.before}
                      </pre>
                    </div>

                    <div>
                      <div className="mb-1 text-[11px] font-semibold text-[var(--pass)]">
                        After (Compliant)
                      </div>
                      <pre className="max-h-40 overflow-auto rounded-lg border border-[var(--pass)]/30 bg-[var(--pass)]/5 p-3 font-mono text-xs text-[var(--pass)] leading-relaxed">
                        {finding.remediation.after}
                      </pre>
                    </div>
                  </div>

                  <p className="mt-2 text-[11px] text-[var(--muted-foreground)] italic">
                    {finding.remediation.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Frameworks Breakdown */}
        {activeTab === "frameworks" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-in fade-in-50">
            {analysis.compliance.map((comp) => (
              <div
                key={comp.framework}
                className="rounded-xl border border-[var(--border)]/80 bg-[var(--card)]/80 p-6 shadow-soft backdrop-blur-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-sans text-base font-bold text-[var(--foreground)]">
                      {comp.framework}
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Standardized audit baseline
                    </p>
                  </div>
                  <span
                    className={`font-mono text-2xl font-extrabold ${
                      comp.percentage >= 80
                        ? "text-[var(--pass)]"
                        : comp.percentage >= 60
                          ? "text-[var(--warn-strong)]"
                          : "text-[var(--crit)]"
                    }`}
                  >
                    {comp.percentage}%
                  </span>
                </div>

                <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      comp.percentage >= 80
                        ? "bg-[var(--pass)]"
                        : comp.percentage >= 60
                          ? "bg-[var(--warn)]"
                          : "bg-[var(--crit)]"
                    }`}
                    style={{ width: `${comp.percentage}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-[var(--border)]/60 pt-3 text-center font-mono text-xs">
                  <div className="rounded-lg border border-[var(--pass)]/20 bg-[var(--pass)]/5 p-2">
                    <span className="text-[10px] text-[var(--muted-foreground)] block">Passed</span>
                    <span className="font-bold text-[var(--pass)]">{comp.passed}</span>
                  </div>
                  <div className="rounded-lg border border-[var(--crit)]/20 bg-[var(--crit)]/5 p-2">
                    <span className="text-[10px] text-[var(--muted-foreground)] block">Failed</span>
                    <span className="font-bold text-[var(--crit)]">{comp.failed}</span>
                  </div>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 p-2">
                    <span className="text-[10px] text-[var(--muted-foreground)] block">N/A</span>
                    <span className="font-bold text-[var(--muted-foreground)]">
                      {comp.notApplicable}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Normalized Controls */}
        {activeTab === "controls" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in-50">
            {analysis.normalized.controls.map((control) => (
              <div
                key={control.key}
                className="flex flex-col justify-between rounded-xl border border-[var(--border)]/80 bg-[var(--card)]/80 p-5 shadow-soft"
              >
                <div>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="font-sans text-sm font-bold text-[var(--foreground)]">
                      {control.label}
                    </span>
                    <StatusPill status={control.status} />
                  </div>
                  <div className="rounded border border-[var(--border)]/60 bg-[var(--muted)]/50 px-2 py-1 font-mono text-xs font-semibold text-[var(--foreground)] mb-2">
                    {control.value}
                  </div>
                  {control.evidence && (
                    <code className="block truncate rounded border border-[var(--border)]/40 bg-[var(--code)] px-2 py-0.5 font-mono text-[11px] text-[var(--code-warn)] mb-2">
                      {control.evidence}
                    </code>
                  )}
                </div>

                <p className="mt-2 border-t border-[var(--border)]/60 pt-2 text-[11px] italic text-[var(--muted-foreground)]">
                  {control.aiNote}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Raw Syntax Viewer */}
        {activeTab === "raw" && (
          <div className="animate-in fade-in-50">
            <ConfigViewer
              content={analysis.raw}
              title={`${analysis.fileName} (${analysis.detection.vendorLabel})`}
            />
          </div>
        )}
      </main>
    </div>
  );
}
