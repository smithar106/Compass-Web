import Link from "next/link";
import type { DemoDecision } from "@/data/demo-data";
import { DEMO_EVIDENCE_LABELS, DEMO_ORG } from "@/data/demo-data";
import { StatusBadge, EvidenceBadge } from "./badges";

const C = {
  gold: "#8B6914",
  teal: "#0A5C55",
  blue: "#1E40AF",
  green: "#14532D",
  purple: "#6D28D9",
} as const;

function Fact({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="relative overflow-hidden border border-line bg-surface px-4 py-3.5">
      {color && <div aria-hidden="true" className="absolute left-0 top-0 h-1 w-full" style={{ backgroundColor: color }} />}
      <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-[13.5px] font-semibold text-ink">{value}</p>
    </div>
  );
}

export function DecisionDetail({ decision }: { decision: DemoDecision }) {
  return (
    <div>
      <Link
        href="/demo/decisions"
        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted transition-colors hover:text-ink"
      >
        <span aria-hidden="true">←</span> All decisions
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-eyebrow text-accent-deep">
            {decision.businessFunction}
          </p>
          <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-ink sm:text-[30px]">
            {decision.title}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={decision.status} />
          <EvidenceBadge strength={decision.evidence} />
        </div>
      </div>

      <div className="mt-6 border border-line bg-paper px-5 py-5 sm:px-6" style={{ borderLeft: `4px solid ${C.teal}` }}>
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Recommendation</p>
        <p className="mt-1.5 text-[16px] font-semibold leading-relaxed text-ink">
          {decision.recommendation}
        </p>
        <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-muted">{decision.summary}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Fact label="Expected impact" value={decision.expectedImpact} color={C.green} />
        <Fact label="Owner" value={decision.owner} color={C.blue} />
        <Fact label="Next action" value={decision.nextAction} color={C.purple} />
        <Fact label="Confidence" value={decision.confidence} color={C.teal} />
        <Fact label="Projected ROI" value={decision.roi} color={C.gold} />
        <Fact label="Timeline" value={decision.timeline} />
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2.5 mb-3">
          <span aria-hidden="true" className="h-4 w-0.5 rounded-full" style={{ backgroundColor: C.blue }} />
          <h2 className="text-[16px] font-semibold tracking-tight text-ink">Implementation plan</h2>
        </div>
        <ol className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {decision.phases.map((phase, i) => (
            <li key={phase} className="flex gap-3.5 border border-line bg-surface px-4 py-3.5">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold"
                style={{ backgroundColor: "#F1F3F6", color: C.blue, border: `2px solid ${C.blue}` }}
              >
                {i + 1}
              </span>
              <p className="text-[13px] leading-relaxed text-ink">{phase}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2.5 mb-3">
          <span aria-hidden="true" className="h-4 w-0.5 rounded-full" style={{ backgroundColor: C.gold }} />
          <h2 className="text-[16px] font-semibold tracking-tight text-ink">Evidence basis</h2>
        </div>
        <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-muted">
          This recommendation is grounded in {DEMO_EVIDENCE_LABELS[decision.evidence].toLowerCase()}{" "}
          from comparable implementations. {DEMO_ORG.name}&apos;s own completed decisions continue to
          strengthen the evidence behind future recommendations.
        </p>
      </div>

      {decision.outcome && decision.outcome.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2.5 mb-3">
            <span aria-hidden="true" className="h-4 w-0.5 rounded-full" style={{ backgroundColor: C.green }} />
            <h2 className="text-[16px] font-semibold tracking-tight text-ink">Results</h2>
          </div>
          <div className="mt-3 overflow-x-auto border border-line bg-surface">
            <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-line bg-paper text-[11px] uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-bold">Metric</th>
                  <th className="px-5 py-3 font-bold">Expected</th>
                  <th className="px-5 py-3 font-bold">Actual</th>
                </tr>
              </thead>
              <tbody>
                {decision.outcome.map((m) => (
                  <tr key={m.metric} className="border-b border-line last:border-b-0">
                    <td className="px-5 py-3.5 text-ink">{m.metric}</td>
                    <td className="px-5 py-3.5 text-muted">{m.expected}</td>
                    <td className="px-5 py-3.5 font-semibold text-ink">{m.actual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}