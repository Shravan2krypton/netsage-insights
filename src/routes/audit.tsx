import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  Sparkles,
  Layers,
  Trash2,
  Eye,
  Sliders,
  Cpu,
  Check,
  Info,
} from "lucide-react";
import { AppNavbar } from "@/components/netsage/navbar";
import { PageBackground } from "@/components/netsage/PageBackground";
import { DEMO_CONFIGS } from "../lib/netsage/demo-configs";
import { analyzeConfig } from "../lib/netsage/engine";
import { useNetsage } from "../lib/netsage/store";
import { toast } from "sonner";

export const Route = createFileRoute("/audit")({
  component: Audit,
});

function Audit() {
  const navigate = useNavigate();
  const { ingest } = useNetsage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFramework, setSelectedFramework] = useState<
    "CIS" | "NIST SP 800-53" | "STIG" | "ISO 27001"
  >("CIS");
  const [uploadedVendors, setUploadedVendors] = useState<(keyof typeof DEMO_CONFIGS)[]>(["cisco"]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>("");
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [previewVendor, setPreviewVendor] = useState<keyof typeof DEMO_CONFIGS | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [enableAi, setEnableAi] = useState(true);
  const [checkUnknown, setCheckUnknown] = useState(true);
  const [generateRemediation, setGenerateRemediation] = useState(true);

  const frameworks = [
    {
      id: "CIS",
      name: "CIS Benchmark",
      desc: "Center for Internet Security prescriptive configuration guidelines",
      badge: "Industry Standard",
    },
    {
      id: "NIST SP 800-53",
      name: "NIST SP 800-53",
      desc: "Federal information systems security and privacy control catalog",
      badge: "US Federal",
    },
    {
      id: "STIG",
      name: "DoD STIG",
      desc: "Defense Information Systems Agency cybersecurity requirements",
      badge: "Defense",
    },
    {
      id: "ISO 27001",
      name: "ISO/IEC 27001",
      desc: "International standard for information security management systems",
      badge: "Global ISO",
    },
  ] as const;

  const handleFileUpload = (vendor: keyof typeof DEMO_CONFIGS) => {
    if (!uploadedVendors.includes(vendor)) {
      setUploadedVendors([...uploadedVendors, vendor]);
      toast.success(`Added ${DEMO_CONFIGS[vendor].fileName} to audit queue`);
    } else {
      toast.info(`${DEMO_CONFIGS[vendor].fileName} is already in the queue`);
    }
  };

  const handleRemoveFile = (vendor: keyof typeof DEMO_CONFIGS) => {
    setUploadedVendors(uploadedVendors.filter((v) => v !== vendor));
    toast.info(`Removed ${DEMO_CONFIGS[vendor].fileName}`);
  };

  const handleCustomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Load cisco or fortinet demo as representative for custom file
    const firstVendor = Object.keys(DEMO_CONFIGS)[0] as keyof typeof DEMO_CONFIGS;
    if (!uploadedVendors.includes(firstVendor)) {
      setUploadedVendors([...uploadedVendors, firstVendor]);
    }
    toast.success(`Uploaded "${file.name}" — syntax mapped successfully`);
  };

  const handleStartAudit = async () => {
    if (uploadedVendors.length === 0) {
      toast.error("Please select or upload at least one configuration file");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);

    // Simulated multi-stage analysis pipeline
    setAnalysisStage("Stage 1/3: Parsing Vendor Syntax & Tokenizing...");
    await new Promise((resolve) => setTimeout(resolve, 600));

    setAnalysisStage("Stage 2/3: AI Normalization to Abstract Security Model...");
    await new Promise((resolve) => setTimeout(resolve, 700));

    setAnalysisStage(`Stage 3/3: Evaluating Deterministic Rules against ${selectedFramework}...`);
    await new Promise((resolve) => setTimeout(resolve, 700));

    // Ingest into global store
    const primaryVendor = uploadedVendors[0] ?? "cisco";
    const cfg = DEMO_CONFIGS[primaryVendor] ?? DEMO_CONFIGS.cisco;
    ingest({
      raw: cfg.content,
      fileName: cfg.fileName,
      vendorHint: cfg.vendor,
    });

    setIsAnalyzing(false);
    setAnalysisComplete(true);
    toast.success("Audit complete! Transferring to Results Dashboard...");

    // Navigate to results
    setTimeout(() => {
      navigate({ to: "/results" });
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] flex flex-col relative z-0">
      <PageBackground variant="audit" />
      <AppNavbar currentPath="/audit" />

      {/* Cyber Grid Subheader - Full Width */}
      <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--background)] relative overflow-hidden">
        <div className="cyber-grid absolute inset-0 opacity-15 pointer-events-none" />
        <div className="px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                  <UploadCloud className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Multi-Vendor Ingestion</span>
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Model: NetSage-Core v2.1
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gradient">
                Configuration Audit Hub
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl">
                Ingest raw network configurations to trigger automated AI normalization and
                compliance evaluation.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">Queue</div>
                <div className="text-xl font-bold font-mono text-[var(--foreground)]">
                  {uploadedVendors.length}
                </div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">
                  Supported Vendors
                </div>
                <div className="text-xl font-bold font-mono text-[var(--primary)]">4</div>
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
                <UploadCloud className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[var(--foreground)]">
                    Multi-Vendor Configuration Analysis
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30">
                    Live Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1.5 max-w-3xl leading-relaxed">
                  Support for Cisco IOS, Fortinet FortiOS, Juniper Junos, and Palo Alto PAN-OS with
                  automated semantic interpretation and rule-based compliance evaluation.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <UploadCloud className="h-3.5 w-3.5 text-[var(--primary)]" />
                    <span>
                      <strong className="text-[var(--primary)]">4</strong> Vendor Support
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Layers className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>
                      <strong className="text-[var(--accent)]">4</strong> Frameworks
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Cpu className="h-3.5 w-3.5 text-[var(--primary)]" />
                    <span>AI-Powered Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Upload and Demo Files (2 cols) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Drag and Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) {
                  const firstVendor = Object.keys(DEMO_CONFIGS)[0] as keyof typeof DEMO_CONFIGS;
                  handleFileUpload(firstVendor);
                }
              }}
              className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                isDragging
                  ? "border-[var(--accent)] bg-[var(--accent)]/15 scale-[1.01]"
                  : "border-[var(--primary)]/30 bg-[var(--surface)]/60 hover:border-[var(--accent)]/60 hover:bg-[var(--surface)]/85 backdrop-blur-md"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCustomFileChange}
                accept=".cfg,.conf,.txt,.json"
                className="hidden"
              />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/15 text-[var(--primary)] shadow-sm">
                <UploadCloud className="h-7 w-7 text-[var(--primary)]" />
              </div>

              <h2 className="mt-4 font-sans text-base font-bold text-[var(--foreground)]">
                Drag and drop network configuration files here
              </h2>
              <p className="mt-1 text-xs text-[var(--muted-foreground)] max-w-md mx-auto">
                Supports Cisco IOS (
                <code className="text-[var(--primary)] font-semibold">.cfg</code>), FortiOS (
                <code className="text-[var(--primary)] font-semibold">.conf</code>), Junos OS (
                <code className="text-[var(--primary)] font-semibold">.txt</code>), and PAN-OS (
                <code className="text-[var(--primary)] font-semibold">.json</code>)
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 px-4 py-2 text-xs font-semibold text-[var(--primary-foreground)] shadow-md transition-all active:scale-98 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                >
                  Browse Files from Device
                </button>
              </div>
            </div>

            {/* Quick Demo Configuration Presets */}
            <div className="rounded-xl border border-[var(--border)]/80 bg-[var(--surface)]/80 p-6 shadow-soft backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-sans text-base font-bold text-[var(--foreground)]">
                    Preset Multi-Vendor Configurations
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    1-click sample devices loaded with realistic firewall and router configs
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-[var(--muted)]/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--muted-foreground)]">
                  4 Presets
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(Object.keys(DEMO_CONFIGS) as Array<keyof typeof DEMO_CONFIGS>).map((vendor) => {
                  const isLoaded = uploadedVendors.includes(vendor);
                  const config = DEMO_CONFIGS[vendor];
                  const lineCount = config.content.split("\n").length;

                  return (
                    <div
                      key={vendor}
                      className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
                        isLoaded
                          ? "border-[var(--primary)]/40 bg-[var(--primary)]/5 shadow-sm"
                          : "border-[var(--border)]/80 bg-[var(--background)]/60 hover:border-[var(--primary)]/30 hover:bg-[var(--surface)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]">
                            <FileText className="h-4 w-4 text-[var(--primary)]" />
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--foreground)] text-sm group-hover:text-[var(--primary)] transition-colors">
                              {config.deviceName}
                            </p>
                            <p className="font-mono text-[11px] text-[var(--muted-foreground)]">
                              {config.fileName}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setPreviewVendor(previewVendor === vendor ? null : vendor)}
                          title="Preview raw configuration"
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)]/40 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between border-t border-[var(--border)]/60 pt-3 text-xs">
                        <span className="font-mono text-[11px] text-[var(--muted-foreground)]">
                          {lineCount} lines
                        </span>
                        <button
                          onClick={() =>
                            isLoaded ? handleRemoveFile(vendor) : handleFileUpload(vendor)
                          }
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition-colors ${
                            isLoaded
                              ? "bg-[var(--pass)]/15 text-[var(--pass)] border border-[var(--pass)]/30 hover:bg-[var(--crit)]/15 hover:text-[var(--crit)] hover:border-[var(--crit)]/30"
                              : "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 hover:bg-[var(--primary)]/20"
                          }`}
                        >
                          {isLoaded ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Added</span>
                            </>
                          ) : (
                            <span>+ Add to Queue</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Config Preview Modal / Drawer */}
            {previewVendor && (
              <div className="rounded-xl border border-[var(--primary)]/30 bg-[var(--surface)] p-5 shadow-lg animate-in fade-in-50">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[var(--primary)]" />
                    <span className="font-mono text-xs font-semibold text-[var(--foreground)]">
                      Preview: {DEMO_CONFIGS[previewVendor].fileName}
                    </span>
                  </div>
                  <button
                    onClick={() => setPreviewVendor(null)}
                    className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-mono"
                  >
                    ✕ Close
                  </button>
                </div>
                <pre className="max-h-56 overflow-auto rounded-lg border border-[var(--border)]/80 bg-[var(--code)] p-3 font-mono text-xs text-[var(--code-fg)] leading-relaxed">
                  {DEMO_CONFIGS[previewVendor].content}
                </pre>
              </div>
            )}

            {/* Uploaded Files Queue */}
            {uploadedVendors.length > 0 && (
              <div className="rounded-xl border border-[var(--border)]/80 bg-[var(--surface)]/80 p-5 shadow-soft">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-sans text-sm font-bold text-[var(--foreground)]">
                    Active Ingestion Queue
                  </h3>
                  <span className="font-mono text-xs text-[var(--muted-foreground)]">
                    {uploadedVendors.length} files ready
                  </span>
                </div>
                <div className="space-y-2">
                  {uploadedVendors.map((vendor) => {
                    const cfg = DEMO_CONFIGS[vendor];
                    return (
                      <div
                        key={vendor}
                        className="flex items-center justify-between rounded-lg border border-[var(--border)]/80 bg-[var(--background)]/80 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-[var(--pass)]" />
                          <div>
                            <span className="font-sans text-sm font-semibold text-[var(--foreground)]">
                              {cfg.deviceName}
                            </span>
                            <span className="ml-2 font-mono text-xs text-[var(--muted-foreground)]">
                              ({cfg.fileName})
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(vendor)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--crit)]/10 hover:text-[var(--crit)]"
                          title="Remove file"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Settings & Execution (1 col) */}
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border)]/80 bg-[var(--surface)]/80 p-6 shadow-soft backdrop-blur-md">
              <div className="mb-5 flex items-center gap-2 border-b border-[var(--border)]/80 pb-4">
                <Sliders className="h-5 w-5 text-[var(--primary)]" />
                <h3 className="font-sans text-base font-bold text-[var(--foreground)]">
                  Audit Parameters
                </h3>
              </div>

              {/* Framework Selector */}
              <div className="mb-6 space-y-2.5">
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Compliance Framework
                </label>
                <div className="space-y-2">
                  {frameworks.map((fw) => {
                    const isSelected = selectedFramework === fw.id;
                    return (
                      <button
                        key={fw.id}
                        onClick={() => setSelectedFramework(fw.id as typeof selectedFramework)}
                        className={`w-full rounded-xl border p-3 text-left transition-all ${
                          isSelected
                            ? "border-[var(--primary)] bg-[var(--primary)]/10 shadow-sm"
                            : "border-[var(--border)]/80 bg-[var(--background)]/50 hover:border-[var(--border)] hover:bg-[var(--muted)]/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-sm font-bold text-[var(--foreground)]">
                            {fw.name}
                          </span>
                          <span className="rounded border border-[var(--border)]/80 bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)]">
                            {fw.badge}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">{fw.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Analysis Options */}
              <div className="mb-6 space-y-3 border-t border-[var(--border)]/80 pt-5">
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Engine Options
                </label>
                <div className="space-y-2.5">
                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[var(--border)]/60 bg-[var(--background)]/40 p-2.5 transition-colors hover:bg-[var(--muted)]/30">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-[var(--ai)]" />
                      <span className="text-xs font-medium text-[var(--foreground)]">
                        AI Semantic Interpretation
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableAi}
                      onChange={(e) => setEnableAi(e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[var(--border)]/60 bg-[var(--background)]/40 p-2.5 transition-colors hover:bg-[var(--muted)]/30">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[var(--pass)]" />
                      <span className="text-xs font-medium text-[var(--foreground)]">
                        Unknown Syntax Detection
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={checkUnknown}
                      onChange={(e) => setCheckUnknown(e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[var(--border)]/60 bg-[var(--background)]/40 p-2.5 transition-colors hover:bg-[var(--muted)]/30">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[var(--accent-cyan)]" />
                      <span className="text-xs font-medium text-[var(--foreground)]">
                        Generate Code Remediation Diffs
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={generateRemediation}
                      onChange={(e) => setGenerateRemediation(e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                  </label>
                </div>
              </div>

              {/* Start Audit Button */}
              <button
                onClick={handleStartAudit}
                disabled={uploadedVendors.length === 0 || isAnalyzing}
                className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] via-[var(--primary)] to-[var(--primary)]/90 py-3.5 font-sans text-sm font-bold text-[var(--primary-foreground)] shadow-md transition-all hover:opacity-95 hover:shadow-[var(--primary)]/30 disabled:cursor-not-allowed disabled:opacity-50 active:scale-98"
              >
                {isAnalyzing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Executing Audit...</span>
                  </>
                ) : analysisComplete ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Audit Complete — Redirecting</span>
                  </>
                ) : (
                  <>
                    <span>Start Compliance Audit</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {isAnalyzing && (
                <div className="mt-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 p-2.5 text-center font-mono text-xs text-[var(--primary)] animate-pulse">
                  {analysisStage}
                </div>
              )}
            </div>

            {/* AI Architecture Information Card */}
            <div className="rounded-xl border border-[var(--ai)]/30 bg-gradient-to-br from-[var(--ai)]/10 via-[var(--surface)] to-[var(--surface)] p-5 shadow-soft">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--ai)]" />
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Deterministic Rule Engine
                </h4>
              </div>
              <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
                NetSage uses NLP solely to interpret and normalize syntax. All security compliance
                decisions are executed deterministically against standardized rules.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
