import { cn } from "@/lib/utils";
import type { ControlStatus, Severity } from "@/lib/netsage/engine";
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "ai" | "pass" | "warn" | "crit";
  icon?: ReactNode;
}) {
  const tones: Record<string, string> = {
    default: "border-border bg-card",
    ai: "border-ai/30 bg-ai/5",
    pass: "border-pass/30 bg-pass/5",
    warn: "border-warn/30 bg-warn/5",
    crit: "border-crit/30 bg-crit/5",
  };
  return (
    <div className={cn("rounded-xl border p-4 shadow-soft transition-shadow hover:shadow-md", tones[tone])}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const map: Record<Severity, string> = {
    critical: "bg-crit/10 text-crit border-crit/30",
    high: "bg-warn/15 text-warn-strong border-warn/40",
    medium: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30",
    low: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold capitalize", map[severity])}>
      {severity}
    </span>
  );
}

export function StatusPill({ status }: { status: ControlStatus }) {
  const map: Record<ControlStatus, { cls: string; text: string }> = {
    valid: { cls: "bg-pass/10 text-pass border-pass/30", text: "✓ Valid" },
    review: { cls: "bg-warn/15 text-warn-strong border-warn/40", text: "⚠ Needs Review" },
    failed: { cls: "bg-crit/10 text-crit border-crit/30", text: "✕ Failed" },
  };
  const s = map[status];
  return <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold", s.cls)}>{s.text}</span>;
}

export function ScoreRing({ score, label, size = 132 }: { score: number; label?: string; size?: number }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const color = score >= 80 ? "var(--pass)" : score >= 60 ? "var(--warn)" : "var(--crit)";
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={10} className="stroke-muted" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={10}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * score) / 100}
          style={{ transition: "stroke-dashoffset 900ms ease" }}
        />
      </svg>
      <div className="-mt-[calc(50%+6px)] mb-[calc(50%-22px)] text-center">
        <div className="text-2xl font-bold text-foreground">{score}</div>
        {label ? <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div> : null}
      </div>
    </div>
  );
}

const TOKEN_RULES: { re: RegExp; cls: string }[] = [
  { re: /(^|\n)(\s*[!#].*)/g, cls: "text-muted-foreground italic" },
];

export function ConfigViewer({ content, title }: { content: string; title?: string }) {
  const lines = content.split("\n");
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-code shadow-soft">
      {title ? (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="font-mono text-xs text-code-muted">{title}</span>
          <span className="text-[10px] uppercase tracking-widest text-code-muted">read-only</span>
        </div>
      ) : null}
      <pre className="max-h-[460px] overflow-auto p-4 text-[12.5px] leading-relaxed">
        <code className="font-mono">
          {lines.map((line, i) => (
            <div key={i} className="flex gap-4">
              <span className="w-8 shrink-0 select-none text-right text-code-muted">{i + 1}</span>
              <span className={highlightClass(line)}>{highlight(line)}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

function highlightClass(line: string) {
  if (/^\s*[!#]/.test(line)) return "text-code-muted italic";
  if (/telnet|permit ip any any|password|public|http server|disable/i.test(line)) return "text-code-warn";
  if (/^\s*(hostname|set hostname|host-name|config |interface|line |system|firewall)/i.test(line))
    return "text-code-key";
  return "text-code-fg";
}

function highlight(line: string) {
  void TOKEN_RULES;
  return line === "" ? " " : line;
}
