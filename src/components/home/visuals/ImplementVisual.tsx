import { cn } from "@/lib/utils";
import { StatusTag, ULabel, VisualShell } from "./VisualShell";

interface Phase {
  index: string;
  name: string;
  owner: string;
  duration: string;
  metric: string;
  done?: boolean;
}

const PHASES: Phase[] = [
  { index: "P1", name: "Baseline and metrics setup", owner: "Ops lead", duration: "2 wks", metric: "Baseline locked", done: true },
  { index: "P2", name: "Routing rules and workflow build", owner: "Internal team / Partner", duration: "4 wks", metric: "Build complete" },
  { index: "P3", name: "Pilot and validation gate", owner: "Ops + Compass", duration: "3 wks", metric: "Gate: 8-min first response" },
  { index: "P4", name: "Scale and handover", owner: "Operations", duration: "ongoing", metric: "Adoption > 80%" },
];

const DEPENDENCIES = ["Ticketing API", "CRM sync", "Approval flow", "Reporting access"];

export function ImplementVisual() {
  return (
    <VisualShell
      title="Implementation Blueprint"
      meta="P0 · draft for review"
      footnote="Compass does not implement. Your team or a partner you select executes the plan while Compass preserves the rationale, requirements, and validation criteria."
    >
      {/* execution selector */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <ULabel>Who executes</ULabel>
          <span className="font-mono text-[9px] text-faint">independent of the decision</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {["Internal team", "Selected partner"].map((opt, i) => (
            <div
              key={opt}
              className={cn(
                "border px-3 py-2 text-[12px] font-medium",
                i === 0
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-surface text-muted"
              )}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>

      {/* phases */}
      <div className="mb-4">
        <ULabel className="mb-2">Phases</ULabel>
        <ul className="divide-y divide-line/70">
          {PHASES.map((p) => (
            <li key={p.index} className="flex items-center gap-3 py-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[9px] font-bold text-muted">
                {p.index}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-[12.5px] font-medium text-ink">{p.name}</span>
                  {p.done && <StatusTag tone="ok">Done</StatusTag>}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted">
                  <span>{p.owner}</span>
                  <span aria-hidden="true" className="text-faint">·</span>
                  <span className="font-mono">{p.duration}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-line pt-4 sm:grid-cols-2">
        <div>
          <ULabel className="mb-2">Dependencies</ULabel>
          <div className="flex flex-wrap gap-1.5">
            {DEPENDENCIES.map((d) => (
              <span key={d} className="border border-line bg-paper px-2 py-1 text-[10px] font-medium text-muted">
                {d}
              </span>
            ))}
          </div>
        </div>
        <div>
          <ULabel className="mb-2">Success metrics</ULabel>
          <ul className="space-y-1 text-[11px] text-ink">
            <li className="flex items-center gap-2"><Dot ok /> Resolution time −25–40%</li>
            <li className="flex items-center gap-2"><Dot /> First response &lt; 8 min</li>
            <li className="flex items-center gap-2"><Dot /> Re-escalation &lt; 3%</li>
          </ul>
        </div>
      </div>
    </VisualShell>
  );
}

function Dot({ ok = false }: { ok?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("h-1.5 w-1.5 shrink-0 rounded-full", ok ? "bg-ok" : "bg-accent-deep")}
    />
  );
}
