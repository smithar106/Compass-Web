import Link from "next/link";
import type { DemoDecision } from "@/data/demo-data";
import { StatusBadge, EvidenceBadge } from "./badges";

export function DecisionCard({ decision }: { decision: DemoDecision }) {
  return (
    <Link
      href={`/demo/decisions/${decision.id}`}
      className="group block border border-line bg-surface p-5 transition-colors hover:border-ink/40"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-[15.5px] font-semibold tracking-tight text-ink group-hover:underline">
          {decision.title}
        </h3>
        <StatusBadge status={decision.status} />
      </div>

      <p className="mt-1 text-[12px] font-semibold uppercase tracking-wide text-muted">
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
