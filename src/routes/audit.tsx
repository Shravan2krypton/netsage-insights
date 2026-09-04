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

  const [selectedFramework, setSelectedFramework] = useState<"CIS" | "NIST SP 800-53" | "STIG" | "ISO 27001">("CIS");
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
    const firstVendor = (Object.keys(DEMO_CONFIGS)[0] as keyof typeof DEMO_CONFIGS);
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <AppNavbar currentPath="/audit" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 font-mono text-xs font-semibold text-primary mb-2">
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Multi-Vendor Ingestion</span>
            </div>
            <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Configuration Audit Hub
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingest raw network configurations to trigger automated AI normalization and compliance evaluation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-border/80 bg-card px-3 py-1.5 font-mono text-xs font-medium text-muted-foreground">
              Queue: <span className="font-bold text-foreground">{uploadedVendors.length} files</span>
            </span>
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
                  ? "border-primary bg-primary/10 scale-[1.01]"
                  : "border-border/90 bg-card/60 hover:border-primary/50 hover:bg-card/90"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCustomFileChange}
                accept=".cfg,.conf,.txt,.json"
                className="hidden"
              />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-inner">
                <UploadCloud className="h-7 w-7" />
              </div>

              <h2 className="mt-4 font-sans text-base font-bold text-foreground">
                Drag and drop network configuration files here
              </h2>
              <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
                Supports Cisco IOS (<code className="text-foreground">.cfg</code>), FortiOS (<code className="text-foreground">.conf</code>), Junos OS (<code className="text-foreground">.txt</code>), and PAN-OS (<code className="text-foreground">.json</code>)
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-98"
                >
                  Browse Files from Device
                </button>
              </div>
            </div>

            {/* Quick Demo Configuration Presets */}
            <div className="rounded-xl border border-border/80 bg-card/80 p-6 shadow-soft backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-sans text-base font-bold text-foreground">Preset Multi-Vendor Configurations</h3>
                  <p className="text-xs text-muted-foreground">1-click sample devices loaded with realistic firewall and router configs</p>
                </div>
                <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground">
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
                          ? "border-primary/40 bg-primary/5 shadow-sm"
                          : "border-border/80 bg-background/60 hover:border-primary/30 hover:bg-card"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                              {config.deviceName}
                            </p>
                            <p className="font-mono text-[11px] text-muted-foreground">{config.fileName}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => setPreviewVendor(previewVendor === vendor ? null : vendor)}
                          title="Preview raw configuration"
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                        <span className="font-mono text-[11px] text-muted-foreground">{lineCount} lines</span>
                        <button
                          onClick={() => (isLoaded ? handleRemoveFile(vendor) : handleFileUpload(vendor))}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition-colors ${
                            isLoaded
                              ? "bg-pass/15 text-pass border border-pass/30 hover:bg-crit/15 hover:text-crit hover:border-crit/30"
                              : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
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
              <div className="rounded-xl border border-primary/30 bg-card p-5 shadow-lg animate-in fade-in-50">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-mono text-xs font-semibold text-foreground">
                      Preview: {DEMO_CONFIGS[previewVendor].fileName}
                    </span>
                  </div>
                  <button
                    onClick={() => setPreviewVendor(null)}
                    className="text-xs text-muted-foreground hover:text-foreground font-mono"
                  >
                    ✕ Close
                  </button>
                </div>
                <pre className="max-h-56 overflow-auto rounded-lg border border-border/80 bg-code p-3 font-mono text-xs text-code-fg leading-relaxed">
                  {DEMO_CONFIGS[previewVendor].content}
                </pre>
              </div>
            )}

            {/* Uploaded Files Queue */}
            {uploadedVendors.length > 0 && (
              <div className="rounded-xl border border-border/80 bg-card/80 p-5 shadow-soft">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-sans text-sm font-bold text-foreground">Active Ingestion Queue</h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {uploadedVendors.length} files ready
                  </span>
                </div>
                <div className="space-y-2">
                  {uploadedVendors.map((vendor) => {
                    const cfg = DEMO_CONFIGS[vendor];
                    return (
                      <div
                        key={vendor}
                        className="flex items-center justify-between rounded-lg border border-border/80 bg-background/80 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-pass" />
                          <div>
                            <span className="font-sans text-sm font-semibold text-foreground">
                              {cfg.deviceName}
                            </span>
                            <span className="ml-2 font-mono text-xs text-muted-foreground">({cfg.fileName})</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(vendor)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-crit/10 hover:text-crit"
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
            <div className="rounded-xl border border-border/80 bg-card/80 p-6 shadow-soft backdrop-blur-md">
              <div className="mb-5 flex items-center gap-2 border-b border-border/80 pb-4">
                <Sliders className="h-5 w-5 text-primary" />
                <h3 className="font-sans text-base font-bold text-foreground">Audit Parameters</h3>
              </div>

              {/* Framework Selector */}
              <div className="mb-6 space-y-2.5">
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Compliance Framework
                </label>
                <div className="space-y-2">
                  {frameworks.map((fw) => {
                    const isSelected = selectedFramework === fw.id;
                    return (
                      <button
                        key={fw.id}
                        onClick={() => setSelectedFramework(fw.id as any)}
                        className={`w-full rounded-xl border p-3 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border/80 bg-background/50 hover:border-border hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-sm font-bold text-foreground">{fw.name}</span>
                          <span className="rounded border border-border/80 bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                            {fw.badge}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">{fw.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Analysis Options */}
              <div className="mb-6 space-y-3 border-t border-border/80 pt-5">
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Engine Options
                </label>
                <div className="space-y-2.5">
                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border/60 bg-background/40 p-2.5 transition-colors hover:bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-ai" />
                      <span className="text-xs font-medium text-foreground">AI Semantic Interpretation</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableAi}
                      onChange={(e) => setEnableAi(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border/60 bg-background/40 p-2.5 transition-colors hover:bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-pass" />
                      <span className="text-xs font-medium text-foreground">Unknown Syntax Detection</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={checkUnknown}
                      onChange={(e) => setCheckUnknown(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border/60 bg-background/40 p-2.5 transition-colors hover:bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-accent-cyan" />
                      <span className="text-xs font-medium text-foreground">Generate Code Remediation Diffs</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={generateRemediation}
                      onChange={(e) => setGenerateRemediation(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                  </label>
                </div>
              </div>

              {/* Start Audit Button */}
              <button
                onClick={handleStartAudit}
                disabled={uploadedVendors.length === 0 || isAnalyzing}
                className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-primary to-primary/90 py-3.5 font-sans text-sm font-bold text-primary-foreground shadow-md transition-all hover:opacity-95 hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-50 active:scale-98"
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
                <div className="mt-3 rounded-lg border border-primary/30 bg-primary/10 p-2.5 text-center font-mono text-xs text-primary animate-pulse">
                  {analysisStage}
                </div>
              )}
            </div>

            {/* AI Architecture Information Card */}
            <div className="rounded-xl border border-ai/30 bg-gradient-to-br from-ai/10 via-card to-card p-5 shadow-soft">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ai" />
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground">
                  Deterministic Rule Engine
                </h4>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                NetSage uses NLP solely to interpret and normalize syntax. All security compliance decisions are executed deterministically against standardized rules.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}