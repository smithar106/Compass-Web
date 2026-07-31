import { cn } from "@/lib/utils";
import { Meter, StatusTag, ULabel, VisualShell } from "./VisualShell";

interface PathRow {
  name: string;
  status: string;
  tone: "recommended" | "ok" | "warn" | "muted";
  evidence: number;
  impact: string;
  effort: number;
}

const PATHS: PathRow[] = [
  { name: "Hybrid workflow redesign + deterministic routing", status: "Recommended", tone: "recommended", evidence: 0.82, impact: "25–40%", effort: 2 },
  { name: "Process redesign only", status: "Viable", tone: "ok", evidence: 0.58, impact: "10–18%", effort: 1 },
  { name: "Deterministic software routing", status: "Compared", tone: "muted", evidence: 0.5, impact: "15–25%", effort: 2 },
  { name: "AI agent", status: "Rejected", tone: "warn", evidence: 0.31, impact: "not supported", effort: 3 },
  { name: "Human work (status quo)", status: "Rejected", tone: "warn", evidence: 0.9, impact: "0%", effort: 0 },
  { name: "No action", status: "Rejected", tone: "warn", evidence: 0.0, impact: "0%", effort: 0 },
];

export function DecideVisual() {
  return (
    <VisualShell
      title="Intervention comparison"
      meta="6 paths evaluated"
      footnote="Ranked by evidence strength, expected impact, effort, readiness, and confidence. Same inputs and scoring version produce the same ranking."
    >
      <ul className="divide-y divide-line/70">
        {PATHS.map((p) => (
          <li key={p.name} className="flex items-center gap-4 py-2.5 first:pt-0 last:pb-0">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "truncate text-[12.5px] font-medium",
                    p.tone === "warn" ? "text-muted" : "text-ink"
                  )}
                >
                  {p.name}
                </span>
                <StatusTag tone={p.tone}>{p.status}</StatusTag>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between font-mono text-[9px] text-faint">
                    <span>Evidence</span>
                    <span>{Math.round(p.evidence * 100)}%</span>
                  </div>
                  <Meter value={p.evidence} tone={p.tone === "recommended" ? "accent" : "default"} />
                </div>
                <div className="w-[86px] shrink-0">
                  <div className="flex items-center justify-between font-mono text-[9px] text-faint">
                    <span>Impact</span>
                    <span className="text-ink">{p.impact}</span>
                  </div>
                </div>
                <div className="hidden w-[74px] shrink-0 sm:block">
                  <div className="mb-0.5 flex items-center justify-between font-mono text-[9px] text-faint">
                    <span>Effort</span>
                  </div>
                  <div className="flex items-center gap-0.5" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1.5 w-3 rounded-full",
                          i < p.effort ? "bg-ink/70" : "bg-line"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </VisualShell>
  );
}
