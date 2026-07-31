import { cn } from "@/lib/utils";
import { Meter, StatusTag, ULabel, VisualShell } from "./VisualShell";

const METRICS = [
  { name: "Resolution time", baseline: "14m", target: "8m", current: "9.2m", pct: 0.82, status: "on track" },
  { name: "First response", baseline: "14m", target: "8m", current: "7.8m", pct: 1, status: "on track" },
  { name: "Re-escalation rate", baseline: "6.1%", target: "3%", current: "3.4%", pct: 0.86, status: "watch" },
];

const MILESTONES = [
  { name: "Routing rules live", status: "Done", tone: "ok" as const },
  { name: "Pilot in 2 teams", status: "On track", tone: "ok" as const },
  { name: "Validation gate", status: "At risk", tone: "warn" as const },
];

const trend = [34, 40, 38, 48, 56, 62, 60, 71, 78];

export function MonitorVisual() {
  return (
    <VisualShell
      title="Implementation health"
      meta="Week 8 of 12"
      footnote="Outcome tracking, not task management: metrics are compared against the original decision, and drift surfaces before it becomes a surprise."
    >
      {/* metrics */}
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {METRICS.map((m) => (
          <div key={m.name} className="border border-line bg-paper/50 p-3">
            <div className="flex items-center justify-between gap-2">
              <ULabel>{m.name}</ULabel>
              {m.status === "on track" ? (
                <StatusTag tone="ok">On track</StatusTag>
              ) : (
                <StatusTag tone="warn">Watch</StatusTag>
              )}
            </div>
            <div className="mt-2 flex items-end justify-between font-mono">
              <span className="text-[15px] font-bold text-ink">{m.current}</span>
              <span className="text-[9px] text-faint">target {m.target}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between font-mono text-[8.5px] text-faint">
              <span>baseline {m.baseline}</span>
              <span>{Math.round(m.pct * 100)}%</span>
            </div>
            <Meter value={m.pct} tone={m.status === "on track" ? "accent" : "default"} className="mt-1" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-line pt-4 sm:grid-cols-2">
        {/* milestones + adoption */}
        <div>
          <ULabel className="mb-2">Milestone health</ULabel>
          <ul className="space-y-1.5">
            {MILESTONES.map((m) => (
              <li key={m.name} className="flex items-center justify-between gap-3">
                <span className="text-[11.5px] text-ink">{m.name}</span>
                <StatusTag tone={m.tone}>{m.status}</StatusTag>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <ULabel>Adoption trend</ULabel>
              <span className="font-mono text-[9px] font-bold text-ok">+129%</span>
            </div>
            <Sparkline values={trend} className="mt-1.5" />
          </div>
        </div>

        {/* assumptions + risk */}
        <div>
          <ULabel className="mb-2">Open assumptions</ULabel>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2 text-[11px] text-ink">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-warn" />
              Escalation volume holds
            </li>
            <li className="flex items-center gap-2 text-[11px] text-ink">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-deep" />
              Exception complexity &lt; 18%
            </li>
          </ul>
          <div className="mt-4 border border-line bg-paper/50 p-3">
            <div className="flex items-center justify-between">
              <ULabel>Intervention risk</ULabel>
              <StatusTag tone="warn">Low-medium</StatusTag>
            </div>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted">
              Drift signal: re-escalation up slightly. No action needed below 3.5%.
            </p>
          </div>
        </div>
      </div>
    </VisualShell>
  );
}

function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${26 - ((v - min) / (max - min)) * 22}`)
    .join(" ");
  return (
    <div className={cn("flex h-8 items-end", className)} aria-hidden="true">
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-8 w-full">
        <polyline
          points={pts}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          className="text-ok"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle
          cx="100"
          cy={pts.split(" ").at(-1)?.split(",")[1]}
          r="2.5"
          fill="currentColor"
          className="text-ok"
        />
      </svg>
    </div>
  );
}
