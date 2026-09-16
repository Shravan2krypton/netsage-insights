import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain,
  CheckCircle2,
  AlertCircle,
  Shield,
  Code2,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Layers,
  Cpu,
  Lock,
  Network,
  Activity,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { AppNavbar } from "@/components/netsage/navbar";
import { PageBackground } from "@/components/netsage/PageBackground";
import { ConfigViewer, StatusPill } from "@/components/netsage/primitives";
import { DEMO_CONFIGS } from "../lib/netsage/demo-configs";
import { analyzeConfig } from "../lib/netsage/engine";

export const Route = createFileRoute("/analysis")({
  component: Analysis,
});

function Analysis() {
  const [selectedVendor, setSelectedVendor] = useState<keyof typeof DEMO_CONFIGS>("cisco");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const config = DEMO_CONFIGS[selectedVendor];
  const analysis = analyzeConfig(config.content, selectedVendor, "CIS");

  const configSnippet = `interface GigabitEthernet0/1
 description LAN-CORE-UPLINK
 ip address 10.10.10.1 255.255.255.0
 no shutdown
 ip access-group 101 in
 no ip redirects
 ip verify unicast source reachable-via rx`;

  const aiInterpretations = [
    {
      configLine: "interface GigabitEthernet0/1",
      detectedConstruct: "Physical Interface Binding",
      securityMeaning: "Defines core L3 physical boundary and initializes IP subsystem",
      confidence: 98,
      normalizedParameter: "Interface: GigabitEthernet0/1, Subnet: 10.10.10.1/24",
      relatedControl: "Network Interface Management",
      status: "valid" as const,
      category: "network",
    },
    {
      configLine: "ip access-group 101 in",
      detectedConstruct: "Inbound ACL Association",
      securityMeaning:
        "Attaches access control list 101 to filter ingress traffic at interface perimeter",
      confidence: 95,
      normalizedParameter: "Ingress Filter: ACL-101 (Active)",
      relatedControl: "Access Control Lists (ACL)",
      status: "review" as const,
      category: "access",
    },
    {
      configLine: "no ip redirects",
      detectedConstruct: "ICMP Redirect Suppression",
      securityMeaning:
        "Disables router ICMP redirect transmission to mitigate MITM traffic hijacking",
      confidence: 94,
      normalizedParameter: "ICMP Redirects: Disabled",
      relatedControl: "ICMP Message Security",
      status: "valid" as const,
      category: "security",
    },
    {
      configLine: "ip verify unicast source reachable-via rx",
      detectedConstruct: "Strict Unicast RPF Check",
      securityMeaning:
        "Enforces strict Reverse Path Forwarding to drop spoofed IP source addresses",
      confidence: 92,
      normalizedParameter: "uRPF: Strict Mode Active",
      relatedControl: "Anti-Spoofing Protections",
      status: "valid" as const,
      category: "security",
    },
  ];

  const pipelineStages = [
    {
      step: "01",
      title: "Raw Syntax",
      desc: "Vendor syntax parser",
      icon: Code2,
      color: "border-[var(--primary)]/40 bg-[var(--primary)]/10 text-[var(--primary)]",
    },
    {
      step: "02",
      title: "NLP Interpretation",
      desc: "Semantic extraction",
      icon: Brain,
      color: "border-[var(--ai)]/40 bg-[var(--ai)]/10 text-[var(--ai)]",
    },
    {
      step: "03",
      title: "Normalized Model",
      desc: "Universal abstraction",
      icon: Shield,
      color: "border-[var(--pass)]/40 bg-[var(--pass)]/10 text-[var(--pass)]",
    },
    {
      step: "04",
      title: "Rule Audit",
      desc: "Deterministic policy",
      icon: CheckCircle2,
      color: "border-[var(--warn)]/40 bg-[var(--warn)]/10 text-[var(--warn-strong)]",
    },
  ];

  const filteredControls =
    activeCategory === "all"
      ? analysis.normalized.controls
      : analysis.normalized.controls.filter((c) => {
          if (activeCategory === "valid") return c.status === "valid";
          if (activeCategory === "issues") return c.status !== "valid";
          return true;
        });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] flex flex-col relative z-0">
      <PageBackground variant="analysis" />
      <AppNavbar currentPath="/analysis" />

      {/* Cyber Grid Subheader - Full Width */}
      <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--background)] relative overflow-hidden">
        <div className="cyber-grid absolute inset-0 opacity-15 pointer-events-none" />
        <div className="px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--ai)]/10 text-[var(--ai)] border border-[var(--ai)]/20">
                  <Brain className="w-3.5 h-3.5 animate-pulse" />
                  <span>Semantic AI Engine</span>
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Model: NetSage-NLP v4.2
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gradient">
                AI Configuration Analysis
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl">
                Deep inspection of proprietary syntax, semantic normalization, and deterministic
                security control extraction.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">
                  AI Confidence
                </div>
                <div className="text-xl font-bold font-mono text-[var(--pass)]">95%</div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">
                  Controls Extracted
                </div>
                <div className="text-xl font-bold font-mono text-[var(--primary)]">
                  {analysis.normalized.controls.length}
                </div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">
                  Pipeline Stages
                </div>
                <div className="text-xl font-bold font-mono text-[var(--foreground)]">4</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">

        {/* Key Differentiator Showcase Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-[var(--ai)]/30 bg-gradient-to-r from-[var(--ai)]/20 via-[var(--surface-elevated)] to-[var(--pass)]/20 p-6 sm:p-7 shadow-lg">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--ai)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--ai)]/10 border border-[var(--ai)]/30 flex items-center justify-center shrink-0 shadow-inner">
                <Brain className="h-6 w-6 text-[var(--ai)] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[var(--foreground)]">
                    AI Interprets. Humans Validate. Deterministic Rules Decide.
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase bg-[var(--ai)]/20 text-[var(--ai)] border border-[var(--ai)]/30">
                    Live Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1.5 max-w-3xl leading-relaxed">
                  NetSage avoids black-box decision making. Machine learning is restricted strictly
                  to semantic parameter mapping, while audit pass/fail decisions remain 100%
                  verifiable and compliant with industry standards.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--pass)]" />
                    <span>
                      <strong className="text-[var(--pass)]">100%</strong> Deterministic
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Layers className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>
                      <strong className="text-[var(--accent)]">4</strong> Vendors
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Cpu className="h-3.5 w-3.5 text-[var(--ai)]" />
                    <span>Zero-Shot Learning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Selector */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[var(--muted-foreground)]">Device Preset:</span>
          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value as keyof typeof DEMO_CONFIGS)}
            className="rounded-lg border border-[var(--primary)]/30 bg-[var(--surface)] px-3 py-1.5 font-mono text-xs font-semibold text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="cisco">Cisco IOS (Router-01)</option>
            <option value="fortinet">Fortinet FortiOS (Edge-02)</option>
            <option value="juniper">Juniper Junos (MX-03)</option>
            <option value="paloalto">Palo Alto PAN-OS (PA850-04)</option>
          </select>
        </div>

        {/* AI Processing Pipeline Visualizer */}
        <div className="rounded-xl border border-[var(--border)]/80 bg-[var(--surface)]/80 p-6 shadow-soft backdrop-blur-md">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[var(--primary)]" />
              <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                Automated Processing Pipeline
              </h3>
            </div>
            <span className="font-mono text-[11px] text-[var(--muted-foreground)]">
              4 Active Stages
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pipelineStages.map((stg, i) => {
              const Icon = stg.icon;
              return (
                <div
                  key={stg.step}
                  className="relative flex flex-col justify-between rounded-xl border border-[var(--border)]/80 bg-[var(--background)]/50 p-4 transition-all hover:border-[var(--primary)]/40 hover:bg-[var(--surface)]"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border ${stg.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[var(--muted-foreground)]">
                      {stg.step}
                    </span>
                  </div>

                  <div>
                    <p className="font-sans text-sm font-bold text-[var(--foreground)]">
                      {stg.title}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">{stg.desc}</p>
                  </div>

                  {i < pipelineStages.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)]">
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Split-View: Configuration Snippet vs AI Interpretation */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Configuration Snippet */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-[var(--primary)]" />
                <h3 className="font-sans text-sm font-bold text-[var(--foreground)]">
                  Inspected Syntax Block
                </h3>
              </div>
              <span className="font-mono text-xs text-[var(--muted-foreground)]">
                {config.deviceName}
              </span>
            </div>

            <ConfigViewer
              content={configSnippet}
              title={`${config.fileName} (L3 Interface snippet)`}
            />
          </div>

          {/* AI Interpretations */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-[var(--ai)]" />
                <h3 className="font-sans text-sm font-bold text-[var(--foreground)]">
                  Semantic Extraction & Confidence
                </h3>
              </div>
              <span className="font-mono text-xs text-[var(--pass)] font-semibold">
                95% Avg Confidence
              </span>
            </div>

            <div className="space-y-3 max-h-[510px] overflow-auto pr-1">
              {aiInterpretations.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-[var(--border)]/80 bg-[var(--surface)]/90 p-4 shadow-soft transition-all hover:border-[var(--ai)]/40"
                >
                  <div className="mb-2.5 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-[var(--warn)]" />
                      <span className="font-sans text-sm font-bold text-[var(--foreground)]">
                        {item.detectedConstruct}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded border border-[var(--border)]/80 bg-[var(--muted)]/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-[var(--foreground)]">
                        <span>{item.confidence}%</span>
                      </div>
                      <StatusPill status={item.status} />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="rounded-lg border border-[var(--border)]/60 bg-[var(--code)]/80 p-2 font-mono text-[var(--code-key)]">
                      <code>{item.configLine}</code>
                    </div>

                    <div className="grid grid-cols-1 gap-1 text-[var(--muted-foreground)] sm:grid-cols-2">
                      <div>
                        <span className="font-semibold text-[var(--foreground)]">
                          Security Meaning:{" "}
                        </span>
                        <span>{item.securityMeaning}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--foreground)]">
                          Normalized Model:{" "}
                        </span>
                        <span className="font-mono text-[var(--primary)]">
                          {item.normalizedParameter}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Normalized Security Model */}
        <div className="rounded-xl border border-[var(--border)]/80 bg-[var(--surface)]/80 p-6 shadow-soft backdrop-blur-md">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)]/80 pb-4">
            <div>
              <h3 className="font-sans text-base font-bold text-[var(--foreground)]">
                Normalized Universal Security Model
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Standardized cross-vendor control representations extracted from configuration
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveCategory("all")}
                className={`rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors ${
                  activeCategory === "all"
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border border-[var(--border)]/80 bg-[var(--surface)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                All ({analysis.normalized.controls.length})
              </button>
              <button
                onClick={() => setActiveCategory("valid")}
                className={`rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors ${
                  activeCategory === "valid"
                    ? "bg-[var(--pass)] text-[var(--primary-foreground)]"
                    : "border border-[var(--border)]/80 bg-[var(--surface)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                Passed
              </button>
              <button
                onClick={() => setActiveCategory("issues")}
                className={`rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors ${
                  activeCategory === "issues"
                    ? "bg-[var(--warn-strong)] text-[var(--primary-foreground)]"
                    : "border border-[var(--border)]/80 bg-[var(--surface)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                Issues / Review
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredControls.map((control) => (
              <div
                key={control.key}
                className="flex flex-col justify-between rounded-xl border border-[var(--border)]/80 bg-[var(--background)]/50 p-4 transition-all hover:border-[var(--primary)]/30 hover:bg-[var(--surface)]"
              >
                <div>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="font-sans text-sm font-bold text-[var(--foreground)]">
                      {control.label}
                    </span>
                    <StatusPill status={control.status} />
                  </div>
                  <div className="rounded border border-[var(--border)]/60 bg-[var(--muted)]/40 px-2 py-1 font-mono text-xs font-semibold text-[var(--foreground)] mb-2">
                    {control.value}
                  </div>
                </div>

                <div className="mt-2 border-t border-[var(--border)]/60 pt-2 text-[11px] italic text-[var(--muted-foreground)]">
                  {control.aiNote}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
