import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Shield,
  FileText,
  Download,
  Calendar,
  BarChart3,
  Filter,
  Search,
  Printer,
  FileCheck2,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  X,
  Clock,
  HardDrive,
} from "lucide-react";
import { DEMO_CONFIGS } from "../lib/netsage/demo-configs";
import { analyzeConfig, type AnalysisResult } from "../lib/netsage/engine";
import { generateReport } from "../lib/netsage/pdf";
import { AppNavbar } from "../components/netsage/navbar";
import { VendorBadge, StatusPill, ScoreRing } from "../components/netsage/primitives";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  component: Reports,
});

interface AuditHistoryItem {
  id: string;
  deviceName: string;
  vendorKey: "cisco" | "fortinet" | "juniper" | "paloalto";
  framework: string;
  complianceScore: number;
  timestamp: string;
  status: "Passed" | "Failed" | "Review";
  findingsCount: number;
}

function Reports() {
  // Generate deterministic baseline analyses
  const ciscoAnalysis = useMemo(
    () => analyzeConfig(DEMO_CONFIGS.cisco.content, "cisco", "CIS"),
    []
  );
  const fortinetAnalysis = useMemo(
    () => analyzeConfig(DEMO_CONFIGS.fortinet.content, "fortinet", "NIST SP 800-53"),
    []
  );
  const juniperAnalysis = useMemo(
    () => analyzeConfig(DEMO_CONFIGS.juniper.content, "juniper", "STIG"),
    []
  );
  const paloaltoAnalysis = useMemo(
    () => analyzeConfig(DEMO_CONFIGS.paloalto.content, "paloalto", "ISO 27001"),
    []
  );

  const analysesMap: Record<string, AnalysisResult> = {
    cisco: ciscoAnalysis,
    fortinet: fortinetAnalysis,
    juniper: juniperAnalysis,
    paloalto: paloaltoAnalysis,
  };

  const allAnalyses = [ciscoAnalysis, fortinetAnalysis, juniperAnalysis, paloaltoAnalysis];

  const auditHistory: AuditHistoryItem[] = [
    {
      id: "AUD-2024-001",
      deviceName: "Cisco-Router-01",
      vendorKey: "cisco",
      framework: "CIS",
      complianceScore: ciscoAnalysis.complianceScore,
      timestamp: "2024-01-15 14:30:00 UTC",
      status: ciscoAnalysis.complianceScore >= 80 ? "Passed" : "Failed",
      findingsCount: ciscoAnalysis.findings.length,
    },
    {
      id: "AUD-2024-002",
      deviceName: "FortiGate-Edge-02",
      vendorKey: "fortinet",
      framework: "NIST SP 800-53",
      complianceScore: fortinetAnalysis.complianceScore,
      timestamp: "2024-01-15 10:15:00 UTC",
      status: fortinetAnalysis.complianceScore >= 80 ? "Passed" : "Review",
      findingsCount: fortinetAnalysis.findings.length,
    },
    {
      id: "AUD-2024-003",
      deviceName: "Juniper-MX-03",
      vendorKey: "juniper",
      framework: "STIG",
      complianceScore: juniperAnalysis.complianceScore,
      timestamp: "2024-01-14 16:45:00 UTC",
      status: juniperAnalysis.complianceScore >= 80 ? "Passed" : "Review",
      findingsCount: juniperAnalysis.findings.length,
    },
    {
      id: "AUD-2024-004",
      deviceName: "PaloAlto-PA850-04",
      vendorKey: "paloalto",
      framework: "ISO 27001",
      complianceScore: paloaltoAnalysis.complianceScore,
      timestamp: "2024-01-14 09:20:00 UTC",
      status: paloaltoAnalysis.complianceScore >= 80 ? "Passed" : "Failed",
      findingsCount: paloaltoAnalysis.findings.length,
    },
    {
      id: "AUD-2024-005",
      deviceName: "Cisco-Core-Agg-05",
      vendorKey: "cisco",
      framework: "CIS",
      complianceScore: 88,
      timestamp: "2024-01-13 11:00:00 UTC",
      status: "Passed",
      findingsCount: 2,
    },
  ];

  const frameworks = ["CIS", "NIST SP 800-53", "STIG", "ISO 27001"];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedAuditForPreview, setSelectedAuditForPreview] = useState<AuditHistoryItem | null>(null);

  const filteredAudits = useMemo(() => {
    return auditHistory.filter((audit) => {
      const matchesSearch =
        audit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        audit.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        audit.framework.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || audit.status.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [auditHistory, searchQuery, statusFilter]);

  const handleExportDevicePDF = (vendorKey: "cisco" | "fortinet" | "juniper" | "paloalto") => {
    const analysis = analysesMap[vendorKey];
    if (analysis) {
      try {
        generateReport(analysis, []);
        toast.success(`PDF Export Generated!`, {
          description: `Downloaded compliance report for ${analysis.deviceName}.`,
          icon: <Download className="w-4 h-4 text-emerald-400" />,
        });
      } catch (e) {
        toast.error("Failed to generate PDF report.");
      }
    }
  };

  const handleExportAllPDFs = () => {
    try {
      allAnalyses.forEach((analysis) => generateReport(analysis, []));
      toast.success(`Exporting Fleet Reports`, {
        description: `Generated PDF reports for all 4 audited devices.`,
        icon: <FileCheck2 className="w-4 h-4 text-cyan-400" />,
      });
    } catch (e) {
      toast.error("Bulk export failed.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] flex flex-col">
      <AppNavbar activeRoute="reports" />

      {/* Cyber Grid Header */}
      <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--background)] relative overflow-hidden">
        <div className="cyber-grid absolute inset-0 opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                  <FileText className="w-3.5 h-3.5" />
                  Executive Audit Dossier
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">Format: PDF AutoTable v4</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gradient">
                Compliance Reports Hub
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl">
                Generate, export, and inspect formal multi-vendor regulatory compliance dossiers, executive summaries, and remediation work orders.
              </p>
            </div>

            {/* Top actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4 text-[var(--muted-foreground)]" />
                Print Page
              </button>
              <button
                onClick={handleExportAllPDFs}
                className="px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] text-xs font-semibold shadow-md hover:shadow-[var(--primary)]/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export Fleet PDF Bundle
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Report Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Device-Wise */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--surface)] shadow-md hover:border-cyan-500/40 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Device Assessment Dossier</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                  Comprehensive compliance audit with executive risk score, rule-by-rule control evaluation, and before/after remediation patches.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <div className="text-[11px] font-mono text-[var(--muted-foreground)]">Select Device to Generate:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleExportDevicePDF("cisco")}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-blue-950/40 border border-[var(--border)] hover:border-blue-500/30 text-[11px] font-mono text-left truncate text-[var(--foreground)] transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>Cisco-Router</span>
                  <Download className="w-3 h-3 text-blue-400" />
                </button>
                <button
                  onClick={() => handleExportDevicePDF("paloalto")}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-amber-950/40 border border-[var(--border)] hover:border-amber-500/30 text-[11px] font-mono text-left truncate text-[var(--foreground)] transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>PaloAlto-PA</span>
                  <Download className="w-3 h-3 text-amber-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Framework-Wise */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--surface)] shadow-md hover:border-purple-500/40 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Framework Aggregate Report</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                  Cross-vendor posture aggregated by regulatory standards (CIS Benchmark, NIST SP 800-53, DISA STIG, ISO 27001).
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <div className="text-[11px] font-mono text-[var(--muted-foreground)]">Quick Export Standard:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleExportDevicePDF("fortinet")}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-purple-950/40 border border-[var(--border)] hover:border-purple-500/30 text-[11px] font-mono text-left truncate text-[var(--foreground)] transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>NIST SP 800-53</span>
                  <Download className="w-3 h-3 text-purple-400" />
                </button>
                <button
                  onClick={() => handleExportDevicePDF("juniper")}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-purple-950/40 border border-[var(--border)] hover:border-purple-500/30 text-[11px] font-mono text-left truncate text-[var(--foreground)] transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>DISA STIG</span>
                  <Download className="w-3 h-3 text-purple-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Audit Ledger */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--surface)] shadow-md hover:border-emerald-500/40 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Historical Audit Ledger</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                  Audit tracking log with SHA-256 evidence records, historical drift analysis, and remediation resolution logs.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border)]">
              <button
                onClick={handleExportAllPDFs}
                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Complete History
              </button>
            </div>
          </div>
        </div>

        {/* Framework Compliance Summary Progress */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-elevated)]/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-[var(--foreground)]">
                Fleet Framework Compliance Breakdown
              </h2>
            </div>
            <span className="text-xs font-mono text-[var(--muted-foreground)]">4 Standards Evaluated</span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {frameworks.map((framework) => {
                const frameworkAnalyses = allAnalyses.filter((a) =>
                  a.compliance.some((c) => c.framework === framework)
                );
                const avgScore =
                  frameworkAnalyses.length > 0
                    ? Math.round(
                        frameworkAnalyses.reduce((sum, a) => {
                          const comp = a.compliance.find((c) => c.framework === framework);
                          return sum + (comp?.percentage || 0);
                        }, 0) / frameworkAnalyses.length
                      )
                    : 0;

                const isGood = avgScore >= 80;
                const isMedium = avgScore >= 60;

                return (
                  <div
                    key={framework}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--foreground)]">{framework}</span>
                      <span
                        className={`text-sm font-mono font-extrabold ${
                          isGood ? "text-emerald-400" : isMedium ? "text-amber-400" : "text-rose-400"
                        }`}
                      >
                        {avgScore}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-[var(--surface)] rounded-full h-2 overflow-hidden border border-[var(--border)]">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isGood
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                            : isMedium
                            ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                            : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                        }`}
                        style={{ width: `${avgScore}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)]">
                      <span>{frameworkAnalyses.length} Devices active</span>
                      <span className={isGood ? "text-emerald-400" : "text-amber-400"}>
                        {isGood ? "Healthy" : "Attention"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Audit History Table Section */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-elevated)]/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--primary)]" />
                Audit Assessment Ledger
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Historical record of all performed network audits with one-click PDF reproduction.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Filter audits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-lg pl-8 pr-2.5 py-1 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] font-mono"
                />
              </div>

              <div className="flex items-center gap-1">
                {["ALL", "PASSED", "FAILED", "REVIEW"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                      statusFilter === st
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "bg-[var(--surface)] text-[var(--muted-foreground)] border border-[var(--border)]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-elevated)]/40 font-mono text-[var(--muted-foreground)] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Audit ID</th>
                  <th className="px-6 py-3 font-semibold">Device Hostname</th>
                  <th className="px-6 py-3 font-semibold">Framework</th>
                  <th className="px-6 py-3 font-semibold">Score</th>
                  <th className="px-6 py-3 font-semibold">Audit Status</th>
                  <th className="px-6 py-3 font-semibold">Findings</th>
                  <th className="px-6 py-3 font-semibold">Timestamp</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] font-mono">
                {filteredAudits.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-xs text-[var(--muted-foreground)]">
                      No audits match the selected query.
                    </td>
                  </tr>
                ) : (
                  filteredAudits.map((audit) => {
                    const isGood = audit.complianceScore >= 80;
                    const isMedium = audit.complianceScore >= 60;

                    return (
                      <tr
                        key={audit.id}
                        className="hover:bg-[var(--surface-elevated)]/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-cyan-400">{audit.id}</td>
                        <td className="px-6 py-4 font-semibold text-[var(--foreground)]">
                          <Link
                            to="/device/$deviceName"
                            params={{ deviceName: audit.deviceName }}
                            className="hover:text-[var(--primary)] hover:underline flex items-center gap-1.5"
                          >
                            <HardDrive className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                            {audit.deviceName}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-[var(--muted-foreground)]">{audit.framework}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`font-bold ${
                              isGood
                                ? "text-emerald-400"
                                : isMedium
                                ? "text-amber-400"
                                : "text-rose-400"
                            }`}
                          >
                            {audit.complianceScore}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              audit.status === "Passed"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : audit.status === "Failed"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {audit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[var(--foreground)]">
                          {audit.findingsCount} issues
                        </td>
                        <td className="px-6 py-4 text-[var(--muted-foreground)] text-[11px]">
                          {audit.timestamp}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedAuditForPreview(audit)}
                              className="px-2.5 py-1 rounded bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[11px] text-[var(--foreground)] hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </button>
                            <button
                              onClick={() => handleExportDevicePDF(audit.vendorKey)}
                              className="px-2.5 py-1 rounded bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/20 text-[11px] text-[var(--primary)] transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Download className="w-3 h-3" />
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device Fleet Quick Compliance Strip */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-400" />
              Active Monitored Device Fleet
            </h2>
            <span className="text-xs text-[var(--muted-foreground)]">4 Baseline Devices</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allAnalyses.map((analysis) => {
              const isGood = analysis.complianceScore >= 80;
              const isMedium = analysis.complianceScore >= 60;

              return (
                <div
                  key={analysis.id}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-3 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <VendorBadge vendor={analysis.detection.vendorLabel} />
                      <span
                        className={`text-sm font-mono font-bold ${
                          isGood ? "text-emerald-400" : isMedium ? "text-amber-400" : "text-rose-400"
                        }`}
                      >
                        {analysis.complianceScore}%
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-[var(--foreground)] truncate pt-1">
                      {analysis.deviceName}
                    </div>
                    <div className="text-[11px] text-[var(--muted-foreground)]">
                      {analysis.findings.length} security findings detected
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
                    <Link
                      to="/device/$deviceName"
                      params={{ deviceName: analysis.deviceName }}
                      className="flex-1 py-1 px-2 rounded text-center bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[11px] text-[var(--foreground)] font-semibold transition-colors"
                    >
                      Inspect
                    </Link>
                    <button
                      onClick={() => generateReport(analysis, [])}
                      className="py-1 px-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Audit Detail Preview Modal */}
      {selectedAuditForPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-[var(--primary)]" />
                <div>
                  <h3 className="font-bold text-sm text-[var(--foreground)]">
                    Audit Record: {selectedAuditForPreview.id}
                  </h3>
                  <span className="text-[11px] font-mono text-[var(--muted-foreground)]">
                    {selectedAuditForPreview.deviceName} • {selectedAuditForPreview.framework}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAuditForPreview(null)}
                className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs text-[var(--foreground)]">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
                <div>
                  <span className="text-[10px] text-[var(--muted-foreground)] uppercase">Target Device</span>
                  <div className="font-bold text-[var(--foreground)] mt-0.5">
                    {selectedAuditForPreview.deviceName}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--muted-foreground)] uppercase">Compliance Score</span>
                  <div className="font-bold text-emerald-400 mt-0.5">
                    {selectedAuditForPreview.complianceScore}% / 100
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--muted-foreground)] uppercase">Framework Standard</span>
                  <div className="font-bold text-[var(--foreground)] mt-0.5">
                    {selectedAuditForPreview.framework}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--muted-foreground)] uppercase">Execution Time</span>
                  <div className="font-bold text-[var(--foreground)] mt-0.5">
                    {selectedAuditForPreview.timestamp}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-bold text-xs text-[var(--foreground)] mb-2">Findings Summary</div>
                <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[var(--muted-foreground)]">Total Findings Flagged</span>
                    <span className="font-bold text-[var(--foreground)]">
                      {selectedAuditForPreview.findingsCount} findings
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[var(--muted-foreground)]">Cryptographic Evidence Digest</span>
                    <span className="font-mono text-cyan-400 text-[10px]">
                      sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedAuditForPreview(null)}
                className="px-4 py-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleExportDevicePDF(selectedAuditForPreview.vendorKey);
                  setSelectedAuditForPreview(null);
                }}
                className="px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}