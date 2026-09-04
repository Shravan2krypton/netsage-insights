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
import { SeverityBadge, ScoreRing, ConfigViewer, StatusPill } from "@/components/netsage/primitives";
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
  const [activeTab, setActiveTab] = useState<"findings" | "frameworks" | "controls" | "raw">("findings");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Find the matching demo config
  const demoConfig = Object.values(DEMO_CONFIGS).find((c) => c.deviceName === deviceName);

  if (!demoConfig) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <AppNavbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md rounded-2xl border border-border/80 bg-card p-8 shadow-soft">
            <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-sans text-xl font-bold text-foreground">Device Not Found</h2>
            <p className="mt-2 text-xs text-muted-foreground">
              The requested network device configuration "{deviceName}" is not loaded in the active session.
            </p>
            <button
              onClick={() => navigate({ to: "/results" })}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
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
    analysis.securityScore >= 80 ? "Low Risk" : analysis.securityScore >= 60 ? "Medium Risk" : "High Risk";
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <AppNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/results" })}
            className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-card px-3 py-1.5 font-mono text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Fleet Results</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-98"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Device Report</span>
          </button>
        </div>

        {/* Device Hero Header */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 p-6 shadow-soft sm:p-8 backdrop-blur-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-inner">
                <Server className="h-7 w-7" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {analysis.deviceName}
                  </h1>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-primary">
                    {analysis.detection.vendorLabel}
                  </span>
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${riskColor}`}>
                    {riskLevel}
                  </span>
                </div>

                <p className="font-mono text-xs text-muted-foreground">
                  Source: <span className="text-foreground">{analysis.fileName}</span> • Detection Confidence:{" "}
                  <span className="font-semibold text-foreground">{analysis.detection.confidence}%</span> • Audited:{" "}
                  {new Date(analysis.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Score Ring Gauge */}
            <div className="flex items-center gap-6 rounded-xl border border-border/80 bg-background/50 p-4">
              <ScoreRing score={analysis.complianceScore} label="Compliance" size={100} />
              <div className="space-y-1 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-pass" />
                  <span className="text-muted-foreground">Passed:</span>
                  <span className="font-bold text-foreground">
                    {analysis.normalized.controls.filter((c) => c.status === "valid").length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-crit" />
                  <span className="text-muted-foreground">Failed:</span>
                  <span className="font-bold text-foreground">
                    {analysis.normalized.controls.filter((c) => c.status === "failed").length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-warn" />
                  <span className="text-muted-foreground">Review:</span>
                  <span className="font-bold text-foreground">
                    {analysis.normalized.controls.filter((c) => c.status === "review").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-border/80 pb-3">
          <button
            onClick={() => setActiveTab("findings")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-semibold transition-colors ${
              activeTab === "findings"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Security Findings ({analysis.findings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("frameworks")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-semibold transition-colors ${
              activeTab === "frameworks"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Framework Compliance ({analysis.compliance.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("controls")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-semibold transition-colors ${
              activeTab === "controls"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Normalized Model ({analysis.normalized.controls.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("raw")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-semibold transition-colors ${
              activeTab === "raw"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
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
                className="rounded-xl border border-border/80 bg-card/90 p-6 shadow-soft transition-all hover:border-primary/40"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <SeverityBadge severity={finding.severity} />
                    <span className="font-mono text-xs font-bold text-muted-foreground">{finding.id}</span>
                    <h3 className="font-sans text-base font-bold text-foreground">{finding.control}</h3>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {finding.frameworkRefs.map((ref, idx) => (
                      <span
                        key={idx}
                        className="rounded border border-border/80 bg-muted/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground mb-4">{finding.description}</p>

                {/* Evidence */}
                <div className="mb-4 rounded-lg border border-border/60 bg-code/80 p-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-code-muted block mb-1">
                    Configuration Evidence
                  </span>
                  <code className="font-mono text-xs text-code-warn">{finding.affectedConfig}</code>
                </div>

                {/* Remediation Diff */}
                <div className="border-t border-border/60 pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-sans text-xs font-bold text-foreground">
                      <Wrench className="h-3.5 w-3.5 text-primary" />
                      <span>Recommended Hardening Remediation</span>
                    </div>

                    <button
                      onClick={() => handleCopySnippet(finding.remediation.after, finding.id)}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
                    >
                      {copiedId === finding.id ? <Check className="h-3 w-3 text-pass" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedId === finding.id ? "Copied" : "Copy Fix"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <div>
                      <div className="mb-1 text-[11px] font-semibold text-crit">Before (Non-Compliant)</div>
                      <pre className="max-h-40 overflow-auto rounded-lg border border-crit/30 bg-crit/5 p-3 font-mono text-xs text-crit leading-relaxed">
                        {finding.remediation.before}
                      </pre>
                    </div>

                    <div>
                      <div className="mb-1 text-[11px] font-semibold text-pass">After (Compliant)</div>
                      <pre className="max-h-40 overflow-auto rounded-lg border border-pass/30 bg-pass/5 p-3 font-mono text-xs text-pass leading-relaxed">
                        {finding.remediation.after}
                      </pre>
                    </div>
                  </div>

                  <p className="mt-2 text-[11px] text-muted-foreground italic">
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
                className="rounded-xl border border-border/80 bg-card/80 p-6 shadow-soft backdrop-blur-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-sans text-base font-bold text-foreground">{comp.framework}</h3>
                    <p className="text-xs text-muted-foreground">Standardized audit baseline</p>
                  </div>
                  <span
                    className={`font-mono text-2xl font-extrabold ${
                      comp.percentage >= 80 ? "text-pass" : comp.percentage >= 60 ? "text-warn-strong" : "text-crit"
                    }`}
                  >
                    {comp.percentage}%
                  </span>
                </div>

                <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      comp.percentage >= 80 ? "bg-pass" : comp.percentage >= 60 ? "bg-warn" : "bg-crit"
                    }`}
                    style={{ width: `${comp.percentage}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-3 text-center font-mono text-xs">
                  <div className="rounded-lg border border-pass/20 bg-pass/5 p-2">
                    <span className="text-[10px] text-muted-foreground block">Passed</span>
                    <span className="font-bold text-pass">{comp.passed}</span>
                  </div>
                  <div className="rounded-lg border border-crit/20 bg-crit/5 p-2">
                    <span className="text-[10px] text-muted-foreground block">Failed</span>
                    <span className="font-bold text-crit">{comp.failed}</span>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/40 p-2">
                    <span className="text-[10px] text-muted-foreground block">N/A</span>
                    <span className="font-bold text-muted-foreground">{comp.notApplicable}</span>
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
                className="flex flex-col justify-between rounded-xl border border-border/80 bg-card/80 p-5 shadow-soft"
              >
                <div>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="font-sans text-sm font-bold text-foreground">{control.label}</span>
                    <StatusPill status={control.status} />
                  </div>
                  <div className="rounded border border-border/60 bg-muted/50 px-2 py-1 font-mono text-xs font-semibold text-foreground mb-2">
                    {control.value}
                  </div>
                  {control.evidence && (
                    <code className="block truncate rounded border border-border/40 bg-code px-2 py-0.5 font-mono text-[11px] text-code-warn mb-2">
                      {control.evidence}
                    </code>
                  )}
                </div>

                <p className="mt-2 border-t border-border/60 pt-2 text-[11px] italic text-muted-foreground">
                  {control.aiNote}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Raw Syntax Viewer */}
        {activeTab === "raw" && (
          <div className="animate-in fade-in-50">
            <ConfigViewer content={analysis.raw} title={`${analysis.fileName} (${analysis.detection.vendorLabel})`} />
          </div>
        )}
      </main>
    </div>
  );
}