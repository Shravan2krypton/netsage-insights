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
      securityMeaning: "Attaches access control list 101 to filter ingress traffic at interface perimeter",
      confidence: 95,
      normalizedParameter: "Ingress Filter: ACL-101 (Active)",
      relatedControl: "Access Control Lists (ACL)",
      status: "review" as const,
      category: "access",
    },
    {
      configLine: "no ip redirects",
      detectedConstruct: "ICMP Redirect Suppression",
      securityMeaning: "Disables router ICMP redirect transmission to mitigate MITM traffic hijacking",
      confidence: 94,
      normalizedParameter: "ICMP Redirects: Disabled",
      relatedControl: "ICMP Message Security",
      status: "valid" as const,
      category: "security",
    },
    {
      configLine: "ip verify unicast source reachable-via rx",
      detectedConstruct: "Strict Unicast RPF Check",
      securityMeaning: "Enforces strict Reverse Path Forwarding to drop spoofed IP source addresses",
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
      color: "border-primary/40 bg-primary/10 text-primary",
    },
    {
      step: "02",
      title: "NLP Interpretation",
      desc: "Semantic extraction",
      icon: Brain,
      color: "border-ai/40 bg-ai/10 text-ai",
    },
    {
      step: "03",
      title: "Normalized Model",
      desc: "Universal abstraction",
      icon: Shield,
      color: "border-pass/40 bg-pass/10 text-pass",
    },
    {
      step: "04",
      title: "Rule Audit",
      desc: "Deterministic policy",
      icon: CheckCircle2,
      color: "border-warn/40 bg-warn/10 text-warn-strong",
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <AppNavbar currentPath="/analysis" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-ai/30 bg-ai/10 px-3 py-0.5 font-mono text-xs font-semibold text-ai mb-2">
              <Brain className="h-3.5 w-3.5" />
              <span>Semantic AI Engine</span>
            </div>
            <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              AI Configuration Analysis
            </h1>
            <p className="text-sm text-muted-foreground">
              Deep inspection of proprietary syntax, semantic normalization, and deterministic security control extraction.
            </p>
          </div>

          {/* Vendor Selector */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">Device Preset:</span>
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value as any)}
              className="rounded-lg border border-border/80 bg-card px-3 py-1.5 font-mono text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
            >
              <option value="cisco">Cisco IOS (Router-01)</option>
              <option value="fortinet">Fortinet FortiOS (Edge-02)</option>
              <option value="juniper">Juniper Junos (MX-03)</option>
              <option value="paloalto">Palo Alto PAN-OS (PA850-04)</option>
            </select>
          </div>
        </div>

        {/* AI Philosophy Banner */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-ai/30 bg-gradient-to-r from-ai/15 via-card to-card p-6 shadow-soft sm:p-7 backdrop-blur-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-ai/40 bg-ai/20 text-ai shadow-inner">
                <Brain className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-base font-bold text-foreground sm:text-lg">
                  AI Interprets. Humans Validate. Deterministic Rules Decide.
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  NetSage avoids black-box decision making. Machine learning is restricted strictly to semantic parameter mapping, while audit pass/fail decisions remain 100% verifiable and compliant with industry standards.
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full border border-pass/30 bg-pass/10 px-3 py-1 font-mono text-xs font-semibold text-pass">
              ✓ Deterministic Decision Core
            </span>
          </div>
        </div>

        {/* AI Processing Pipeline Visualizer */}
        <div className="mb-8 rounded-xl border border-border/80 bg-card/80 p-6 shadow-soft backdrop-blur-md">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-foreground">
                Automated Processing Pipeline
              </h3>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">4 Active Stages</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pipelineStages.map((stg, i) => {
              const Icon = stg.icon;
              return (
                <div
                  key={stg.step}
                  className="relative flex flex-col justify-between rounded-xl border border-border/80 bg-background/50 p-4 transition-all hover:border-primary/40 hover:bg-card"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${stg.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-muted-foreground">{stg.step}</span>
                  </div>

                  <div>
                    <p className="font-sans text-sm font-bold text-foreground">{stg.title}</p>
                    <p className="text-xs text-muted-foreground">{stg.desc}</p>
                  </div>

                  {i < pipelineStages.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
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
                <Code2 className="h-4 w-4 text-primary" />
                <h3 className="font-sans text-sm font-bold text-foreground">Inspected Syntax Block</h3>
              </div>
              <span className="font-mono text-xs text-muted-foreground">{config.deviceName}</span>
            </div>

            <ConfigViewer content={configSnippet} title={`${config.fileName} (L3 Interface snippet)`} />
          </div>

          {/* AI Interpretations */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-ai" />
                <h3 className="font-sans text-sm font-bold text-foreground">Semantic Extraction & Confidence</h3>
              </div>
              <span className="font-mono text-xs text-pass font-semibold">95% Avg Confidence</span>
            </div>

            <div className="space-y-3 max-h-[510px] overflow-auto pr-1">
              {aiInterpretations.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border/80 bg-card/90 p-4 shadow-soft transition-all hover:border-ai/40"
                >
                  <div className="mb-2.5 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-warn" />
                      <span className="font-sans text-sm font-bold text-foreground">{item.detectedConstruct}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded border border-border/80 bg-muted/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                        <span>{item.confidence}%</span>
                      </div>
                      <StatusPill status={item.status} />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="rounded-lg border border-border/60 bg-code/80 p-2 font-mono text-code-key">
                      <code>{item.configLine}</code>
                    </div>

                    <div className="grid grid-cols-1 gap-1 text-muted-foreground sm:grid-cols-2">
                      <div>
                        <span className="font-semibold text-foreground">Security Meaning: </span>
                        <span>{item.securityMeaning}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">Normalized Model: </span>
                        <span className="font-mono text-primary">{item.normalizedParameter}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Normalized Security Model */}
        <div className="rounded-xl border border-border/80 bg-card/80 p-6 shadow-soft backdrop-blur-md">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-4">
            <div>
              <h3 className="font-sans text-base font-bold text-foreground">Normalized Universal Security Model</h3>
              <p className="text-xs text-muted-foreground">Standardized cross-vendor control representations extracted from configuration</p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveCategory("all")}
                className={`rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors ${
                  activeCategory === "all"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border/80 bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                All ({analysis.normalized.controls.length})
              </button>
              <button
                onClick={() => setActiveCategory("valid")}
                className={`rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors ${
                  activeCategory === "valid"
                    ? "bg-pass text-primary-foreground"
                    : "border border-border/80 bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                Passed
              </button>
              <button
                onClick={() => setActiveCategory("issues")}
                className={`rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors ${
                  activeCategory === "issues"
                    ? "bg-warn-strong text-primary-foreground"
                    : "border border-border/80 bg-card text-muted-foreground hover:bg-muted"
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
                className="flex flex-col justify-between rounded-xl border border-border/80 bg-background/50 p-4 transition-all hover:border-primary/30 hover:bg-card"
              >
                <div>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="font-sans text-sm font-bold text-foreground">{control.label}</span>
                    <StatusPill status={control.status} />
                  </div>
                  <div className="rounded border border-border/60 bg-muted/40 px-2 py-1 font-mono text-xs font-semibold text-foreground mb-2">
                    {control.value}
                  </div>
                </div>

                <div className="mt-2 border-t border-border/60 pt-2 text-[11px] italic text-muted-foreground">
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