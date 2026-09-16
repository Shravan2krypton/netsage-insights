import { cn } from "@/lib/utils";
import type { ControlStatus, Severity } from "@/lib/netsage/engine";
import { type ReactNode, useState } from "react";
import { Check, Copy, Server, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
  trend,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "ai" | "pass" | "warn" | "crit";
  icon?: ReactNode;
  trend?: string;
}) {
  const tones = {
    default: {
      card: "border-primary/20 bg-card/85 backdrop-blur-md hover:border-primary/50 hover:shadow-[0_4px_20px_rgba(56,189,248,0.15)]",
      iconBg: "bg-primary/15 text-primary border-primary/30",
    },
    ai: {
      card: "border-primary/20 bg-card/85 backdrop-blur-md hover:border-accent/50 hover:shadow-[0_4px_20px_rgba(251,146,60,0.15)]",
      iconBg: "bg-accent/15 text-accent border-accent/30",
    },
    pass: {
      card: "border-primary/20 bg-card/85 backdrop-blur-md hover:border-emerald-400/50 hover:shadow-[0_4px_20px_rgba(52,211,153,0.15)]",
      iconBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
    warn: {
      card: "border-accent/25 bg-card/85 backdrop-blur-md hover:border-accent/50 hover:shadow-[0_4px_20px_rgba(251,146,60,0.15)]",
      iconBg: "bg-accent/15 text-accent border-accent/30",
    },
    crit: {
      card: "border-rose-500/25 bg-card/85 backdrop-blur-md hover:border-rose-400/50 hover:shadow-[0_4px_20px_rgba(244,63,94,0.15)]",
      iconBg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    },
  };

  const selectedTone =
    (tone in tones ? tones[tone as keyof typeof tones] : tones.default) ?? tones.default;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        selectedTone.card,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {icon ? (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border",
              selectedTone.iconBg,
            )}
          >
            {icon}
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <p className="font-sans text-3xl font-extrabold tracking-tight text-foreground">{value}</p>
        {trend && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-mono text-xs font-semibold",
              trend.startsWith("+")
                ? "bg-pass/15 text-pass border border-pass/30"
                : trend.startsWith("-")
                  ? "bg-crit/15 text-crit border border-crit/30"
                  : "bg-muted text-muted-foreground border border-border",
            )}
          >
            {trend}
          </span>
        )}
      </div>

      {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const map: Record<Severity, { badge: string; dot: string; text: string }> = {
    critical: {
      badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      dot: "bg-rose-500 animate-ping",
      text: "CRITICAL",
    },
    high: {
      badge: "bg-orange-500/15 text-orange-300 border-orange-500/30",
      dot: "bg-orange-400",
      text: "HIGH",
    },
    medium: {
      badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
      dot: "bg-sky-400",
      text: "MEDIUM",
    },
    low: {
      badge: "bg-sky-500/10 text-sky-200 border-sky-500/20",
      dot: "bg-sky-400/60",
      text: "LOW",
    },
  };
  const s = map[severity] || map.low;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold tracking-wider uppercase",
        s.badge,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {severity === "critical" && (
          <span
            className={cn("absolute inline-flex h-full w-full rounded-full opacity-75", s.dot)}
          ></span>
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", s.dot)}></span>
      </span>
      {s.text}
    </span>
  );
}

export function StatusPill({ status }: { status: ControlStatus }) {
  const map: Record<ControlStatus, { cls: string; text: string }> = {
    valid: {
      cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      text: "✓ Valid",
    },
    review: {
      cls: "bg-orange-500/15 text-orange-300 border-orange-500/30",
      text: "⚠ Needs Review",
    },
    failed: {
      cls: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      text: "✕ Failed",
    },
  };
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold tracking-wide",
        s.cls,
      )}
    >
      {s.text}
    </span>
  );
}

export function ScoreRing({
  score,
  label,
  size = 132,
}: {
  score: number;
  label?: string;
  size?: number;
}) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const color = score >= 80 ? "var(--pass)" : score >= 60 ? "var(--warn)" : "var(--crit)";
  const glow =
    score >= 80
      ? "drop-shadow(0 0 10px oklch(0.6 0.17 150 / 0.4))"
      : score >= 60
        ? "drop-shadow(0 0 10px oklch(0.78 0.16 75 / 0.4))"
        : "drop-shadow(0 0 10px oklch(0.58 0.24 25 / 0.4))";

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={9}
          className="stroke-muted/60"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={9}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * score) / 100}
          style={{
            filter: glow,
            transition: "stroke-dashoffset 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>
      <div className="-mt-[calc(50%+6px)] mb-[calc(50%-22px)] text-center">
        <div className="font-sans text-2xl font-extrabold tracking-tight text-foreground">
          {score}%
        </div>
        {label ? (
          <div className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function VendorBadge({ vendor }: { vendor: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground">
      <Server className="h-3.5 w-3.5 text-primary" />
      <span>{vendor}</span>
    </div>
  );
}

export function ConfigViewer({ content, title }: { content: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const lines = content.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Configuration snippet copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-code shadow-lg">
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-crit/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-pass/70" />
          </div>
          <span className="font-mono text-xs font-medium text-code-muted">
            {title || "configuration.cfg"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded border border-border/60 bg-muted/20 px-2 py-0.5 font-mono text-[11px] text-code-muted transition-colors hover:bg-muted/30 hover:text-foreground"
          >
            {copied ? <Check className="h-3 w-3 text-pass" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          <span className="font-mono text-[10px] uppercase tracking-widest text-code-muted">
            read-only
          </span>
        </div>
      </div>
      <pre className="max-h-[460px] overflow-auto p-4 font-mono text-[12.5px] leading-relaxed">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex gap-4">
              <span className="w-8 shrink-0 select-none text-right font-mono text-code-muted">
                {i + 1}
              </span>
              <span className={highlightClass(line)}>{line === "" ? " " : line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

function highlightClass(line: string) {
  if (/^\s*[!#]/.test(line)) return "text-code-muted italic";
  if (/telnet|permit ip any any|password|public|http server|disable/i.test(line))
    return "text-code-warn font-semibold";
  if (/^\s*(hostname|set hostname|host-name|config |interface|line |system|firewall)/i.test(line))
    return "text-code-key font-medium";
  return "text-code-fg";
}
