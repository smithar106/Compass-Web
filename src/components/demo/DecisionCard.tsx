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

      <p className="mt-1.5 text-[12px] font-semibold uppercase tracking-wide text-muted">
        {decision.businessFunction}
      </p>

      <p className="mt-3 text-[13.5px] leading-relaxed text-ink">
        <span className="font-semibold">Recommendation:</span> {decision.recommendation}
      </p>

      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 text-[12.5px] sm:grid-cols-2">
        <div className="flex items-start justify-between gap-3">
          <dt className="text-muted">Expected impact</dt>
          <dd className="text-right font-semibold text-ink">{decision.expectedImpact}</dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="text-muted">Owner</dt>
          <dd className="text-right font-medium text-ink">{decision.owner}</dd>
        </div>
        <div className="flex items-start justify-between gap-3 sm:col-span-2">
          <dt className="text-muted">Next action</dt>
          <dd className="text-right font-medium text-ink">{decision.nextAction}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center gap-2 border-t border-line pt-3.5">
        <EvidenceBadge strength={decision.evidence} />
        <span className="ml-auto text-[12px] font-medium text-muted transition-colors group-hover:text-ink">
          Open decision →
        </span>
      </div>
    </Link>
  );
}
