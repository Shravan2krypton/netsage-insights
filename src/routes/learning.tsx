import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Brain,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  Lightbulb,
  BookOpen,
  TrendingUp,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Check,
  Trash2,
  Terminal,
} from "lucide-react";
import { AppNavbar } from "../components/netsage/navbar";
import { VendorBadge, StatusPill } from "../components/netsage/primitives";
import { toast } from "sonner";

export const Route = createFileRoute("/learning")({
  component: Learning,
});

interface PendingMapping {
  id: string;
  unknownCommand: string;
  aiSuggestion: string;
  confidence: number;
  vendor: string;
  timestamp: string;
}

interface KBEntry {
  id: string;
  command: string;
  interpretation: string;
  vendor: string;
  addedBy: string;
  addedDate: string;
  usageCount: number;
}

function Learning() {
  const [pendingMappings, setPendingMappings] = useState<PendingMapping[]>([
    {
      id: "LM-001",
      unknownCommand: 'set security-policy from-trust "any" to-untrust "any" action deny',
      aiSuggestion: "Inbound security policy rule denying all outbound traffic from trust to untrust zones",
      confidence: 94,
      vendor: "Fortinet FortiOS",
      timestamp: "2 hours ago",
    },
    {
      id: "LM-002",
      unknownCommand: "firewall filter PROTECT-MGMT term limit-admin then discard",
      aiSuggestion: "Administrative control-plane access rate limiting and spoof discard filter",
      confidence: 88,
      vendor: "Juniper Junos",
      timestamp: "5 hours ago",
    },
    {
      id: "LM-003",
      unknownCommand: '"application": ["ssl-with-inspection"], "action": "allow"',
      aiSuggestion: "SSL deep packet inspection rule enforcing TLS 1.3 decryption & analysis",
      confidence: 96,
      vendor: "Palo Alto PAN-OS",
      timestamp: "1 day ago",
    },
  ]);

  const [knowledgeBase, setKnowledgeBase] = useState<KBEntry[]>([
    {
      id: "KB-047",
      command: "set log syslogd setting status enable",
      interpretation: "Remote syslog server streaming configuration for real-time SIEM audit log forwarding",
      vendor: "Fortinet FortiOS",
      addedBy: "secops.lead@enterprise.net",
      addedDate: "2024-01-15",
      usageCount: 28,
    },
    {
      id: "KB-046",
      command: "system services ssh protocol-version v2",
      interpretation: "Strict SSH Version 2 cryptographic protocol enforcement, disabling deprecated v1",
      vendor: "Juniper Junos",
      addedBy: "network.admin@enterprise.net",
      addedDate: "2024-01-14",
      usageCount: 19,
    },
    {
      id: "KB-045",
      command: "service password-encryption",
      interpretation: "Global reversible password encryption for stored local credential strings (Cisco Type 7)",
      vendor: "Cisco IOS",
      addedBy: "compliance.auditor@enterprise.net",
      addedDate: "2024-01-13",
      usageCount: 34,
    },
    {
      id: "KB-044",
      command: "ntp server 10.0.0.1 prefer iburst",
      interpretation: "Authoritative NTP synchronization with burst query mode for millisecond-level drift correction",
      vendor: "Cisco IOS",
      addedBy: "admin@corp.local",
      addedDate: "2024-01-10",
      usageCount: 42,
    },
    {
      id: "KB-043",
      command: "set system login idle-timeout 10",
      interpretation: "Enforces 10-minute administrative interactive session auto-logout policy",
      vendor: "Juniper Junos",
      addedBy: "audit.bot@netsage.ai",
      addedDate: "2024-01-08",
      usageCount: 15,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendorFilter, setSelectedVendorFilter] = useState<string>("ALL");

  const handleAcceptMapping = (id: string) => {
    const mapping = pendingMappings.find((m) => m.id === id);
    if (mapping) {
      setPendingMappings((prev) => prev.filter((m) => m.id !== id));
      const newEntry: KBEntry = {
        id: `KB-${Math.floor(100 + Math.random() * 900)}`,
        command: mapping.unknownCommand,
        interpretation: mapping.aiSuggestion,
        vendor: mapping.vendor,
        addedBy: "admin.engineer@netsage.io",
        addedDate: new Date().toISOString().split("T")[0] ?? "2024-01-15",
        usageCount: 1,
      };
      setKnowledgeBase((prev) => [newEntry, ...prev]);
      toast.success(`Mapping ${mapping.id} Accepted & Ingested!`, {
        description: `Knowledge base updated. Future audits for ${mapping.vendor} will recognize this syntax.`,
        icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      });
    }
  };

  const handleRejectMapping = (id: string) => {
    const mapping = pendingMappings.find((m) => m.id === id);
    setPendingMappings((prev) => prev.filter((m) => m.id !== id));
    toast.error(`Mapping ${id} Discarded`, {
      description: `Syntax mapping rejected. Will not be added to active knowledge base.`,
      icon: <XCircle className="w-4 h-4 text-rose-400" />,
    });
  };

  const filteredKnowledgeBase = useMemo(() => {
    return knowledgeBase.filter((entry) => {
      const matchesSearch =
        entry.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.interpretation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.vendor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesVendor =
        selectedVendorFilter === "ALL" ||
        entry.vendor.toLowerCase().includes(selectedVendorFilter.toLowerCase());

      return matchesSearch && matchesVendor;
    });
  }, [knowledgeBase, searchQuery, selectedVendorFilter]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] flex flex-col">
      <AppNavbar activeRoute="learning" />

      {/* Cyber Grid Subheader */}
      <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--background)] relative overflow-hidden">
        <div className="cyber-grid absolute inset-0 opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Brain className="w-3.5 h-3.5 animate-pulse" />
                  Self-Evolving Semantics
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">Model: NetSage-NLP v4.2</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gradient">
                Adaptive Learning & KB Hub
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl">
                Review machine-learned syntax interpretations, authorize validated semantic models, and expand NetSage's autonomous multi-vendor recognition dictionary.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">KB Definitions</div>
                <div className="text-xl font-bold font-mono text-[var(--primary)]">{knowledgeBase.length + 42}</div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">Pending Review</div>
                <div className="text-xl font-bold font-mono text-amber-400">{pendingMappings.length}</div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                <div className="text-xs text-[var(--muted-foreground)] font-medium">NLP Precision</div>
                <div className="text-xl font-bold font-mono text-emerald-400">99.4%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Key Differentiator Showcase Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-[var(--surface-elevated)] to-cyan-950/20 p-6 sm:p-7 shadow-lg">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
                <Zap className="h-6 w-6 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[var(--foreground)]">
                    Autonomous Semantic Knowledge Feedback Loop
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1.5 max-w-3xl leading-relaxed">
                  When NetSage parses proprietary or vendor-specific edge case syntax, our zero-shot transformer generates a structured interpretation. Once confirmed by your security team, it is immediately compiled into the fleet-wide compliance engine.
                </p>
                
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Database className="h-3.5 w-3.5 text-emerald-400" />
                    <span><strong className="text-emerald-400">{knowledgeBase.length + 42}</strong> Total Rules Ingested</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                    <span><strong className="text-cyan-400">+14</strong> Learned This Month</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--foreground)] bg-[var(--surface)]/80 px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Cpu className="h-3.5 w-3.5 text-purple-400" />
                    <span>Zero Human Rule Authoring Needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Pending Mappings vs. Knowledge Base Catalog */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Pending Mappings (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <h2 className="text-lg font-bold text-[var(--foreground)]">Pending AI Suggestions</h2>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                {pendingMappings.length} awaiting validation
              </span>
            </div>

            {pendingMappings.length === 0 ? (
              <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-sm text-[var(--foreground)]">All Mappings Verified</h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  The AI has no pending semantic ambiguities requiring administrator confirmation.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingMappings.map((mapping) => (
                  <div
                    key={mapping.id}
                    className="p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-[var(--surface)] shadow-md hover:border-amber-500/50 transition-all space-y-4 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {mapping.id}
                        </span>
                        <VendorBadge vendor={mapping.vendor} />
                      </div>
                      <span className="text-[11px] font-mono text-[var(--muted-foreground)]">
                        {mapping.timestamp}
                      </span>
                    </div>

                    {/* Command Display */}
                    <div>
                      <div className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Terminal className="w-3 h-3 text-amber-400" />
                        Unclassified Config Syntax
                      </div>
                      <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg p-2.5 font-mono text-xs text-[var(--foreground)] overflow-x-auto selection:bg-amber-500/20">
                        <code>{mapping.unknownCommand}</code>
                      </div>
                    </div>

                    {/* AI Suggestion */}
                    <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-300">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          AI Semantic Inference
                        </div>
                        <div className="text-xs font-mono font-bold text-purple-300">
                          {mapping.confidence}% match
                        </div>
                      </div>
                      <p className="text-xs text-[var(--foreground)] leading-relaxed">
                        {mapping.aiSuggestion}
                      </p>

                      {/* Confidence Bar */}
                      <div className="w-full bg-purple-950/50 rounded-full h-1.5 overflow-hidden mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                          style={{ width: `${mapping.confidence}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <button
                        onClick={() => handleAcceptMapping(mapping.id)}
                        className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        Authorize & Add to KB
                      </button>
                      <button
                        onClick={() => handleRejectMapping(mapping.id)}
                        className="py-2 px-3 rounded-lg bg-[var(--surface-elevated)] hover:bg-rose-950/30 text-[var(--muted-foreground)] hover:text-rose-400 border border-[var(--border)] hover:border-rose-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Discard
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Knowledge Base Catalog (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  Active Knowledge Base Catalog
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Live semantic rules currently recognized across all scanning pipelines.
                </p>
              </div>
              <div className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted-foreground)]">
                {filteredKnowledgeBase.length} of {knowledgeBase.length} entries
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Filter by syntax, interpretation, or KB-ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-all font-mono"
                />
              </div>

              {/* Vendor Filters */}
              <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {["ALL", "Cisco", "Juniper", "Fortinet", "Palo Alto"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVendorFilter(v)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      selectedVendorFilter === v
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                        : "bg-[var(--surface-elevated)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* KB Cards Stream */}
            <div className="space-y-3">
              {filteredKnowledgeBase.length === 0 ? (
                <div className="p-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center text-xs text-[var(--muted-foreground)]">
                  No knowledge base entries match your search query.
                </div>
              ) : (
                filteredKnowledgeBase.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-cyan-500/40 hover:bg-[var(--surface-elevated)] transition-all space-y-2.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">
                          {entry.id}
                        </span>
                        <VendorBadge vendor={entry.vendor} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" />
                          Validated
                        </span>
                        <span className="text-[11px] font-mono text-[var(--muted-foreground)]">
                          Used {entry.usageCount}x
                        </span>
                      </div>
                    </div>

                    {/* Syntax Code block */}
                    <div className="bg-[var(--surface-elevated)] border border-[var(--border)] group-hover:border-cyan-500/30 rounded-lg p-2.5 font-mono text-xs text-[var(--foreground)]">
                      <code>{entry.command}</code>
                    </div>

                    {/* Interpretation */}
                    <p className="text-xs text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors leading-relaxed">
                      {entry.interpretation}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)] pt-1 border-t border-[var(--border)]">
                      <span>Authored by: {entry.addedBy}</span>
                      <span>Enrolled: {entry.addedDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 5-Stage Adaptive Learning Pipeline Diagram */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-elevated)]/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-[var(--foreground)]">
                NetSage 5-Stage Adaptive Learning Architecture
              </h2>
            </div>
            <span className="text-xs font-mono text-[var(--muted-foreground)] hidden sm:inline">
              Zero-Shot Transformer + HITL Ingestion
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
              {/* Step 1 */}
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10 flex flex-col items-center text-center space-y-2 relative">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-[var(--foreground)]">1. Syntax Anomaly</div>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Parser encounters unclassified vendor command or proprietary attribute.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-950/10 flex flex-col items-center text-center space-y-2 relative">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Brain className="w-5 h-5 animate-pulse" />
                </div>
                <div className="font-bold text-xs text-[var(--foreground)]">2. AI Inference</div>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Zero-shot LLM decomposes AST tokens into semantic intent with confidence score.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/10 flex flex-col items-center text-center space-y-2 relative">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-[var(--foreground)]">3. Human-In-Loop</div>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Network engineer validates or refines the proposed mapping in one click.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/10 flex flex-col items-center text-center space-y-2 relative">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Database className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-[var(--foreground)]">4. Knowledge Ingest</div>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Validated rule is cataloged into immutable vector store with cryptohash.
                </p>
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 flex flex-col items-center text-center space-y-2 relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-[var(--foreground)]">5. Auto-Recognition</div>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Subsequent multi-vendor scans execute with zero latency recognition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}