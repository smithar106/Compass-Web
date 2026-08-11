import Link from "next/link";
import type { DemoDecision, DecisionStatus } from "@/data/demo-data";
import { StatusBadge, EvidenceBadge } from "./badges";

const STATUS_COLOR: Record<DecisionStatus, string> = {
  under_review: "#8B6914",
  pilot_approved: "#0A5C55",
  active: "#1E40AF",
  completed: "#14532D",
};

export function DecisionCard({ decision }: { decision: DemoDecision }) {
  const accent = STATUS_COLOR[decision.status] ?? "#8B6914";

  return (
    <Link
      href={`/demo/decisions/${decision.id}`}
      className="group relative block overflow-hidden border border-line bg-surface p-5 transition-colors hover:border-ink/40"
    >
      <div aria-hidden="true" className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: accent }} />

      <div className="flex flex-wrap items-start justify-between gap-2 pl-2">
        <h3 className="text-[15.5px] font-semibold tracking-tight text-ink group-hover:underline">
          {decision.title}
        </h3>
        <StatusBadge status={decision.status} />
      </div>

      <p className="mt-1 pl-2 text-[12px] font-semibold uppercase tracking-wide" style={{ color: accent }}>
        {decision.businessFunction}
      </p>

      <p className="mt-4 text-[clamp(1.6rem,2.5vw,2rem)] font-extralight leading-none tracking-[-0.02em] text-ink">
        {decision.expectedImpact}
      </p>
      <p className="mt-1 text-[12px] leading-snug text-muted">{decision.recommendation}</p>

      <div className="mt-4 flex items-center gap-2 border-t border-line pt-3.5">
        <EvidenceBadge strength={decision.evidence} />
        <span className="ml-auto text-[12px] font-medium text-muted transition-colors group-hover:text-ink">
          Open decision →
        </span>
      </div>
    </Link>
  );
}