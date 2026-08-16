import Link from "next/link";
import { controlRoom } from "@/content/marketing";
import { cn } from "@/lib/utils";

export function ControlRoomCard() {
  const dc = controlRoom.decisionCard;

  return (
    <article className="border border-ink/30 bg-surface text-left shadow-[0_18px_50px_-20px_rgba(0,0,0,0.35)]">
      {/* header */}
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Your problem</p>
          <p className="mt-0.5 text-[18px] font-semibold tracking-tight text-ink">{dc.problem}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-wide text-accent-deep">Compass recommends</p>
          <p className="mt-0.5 text-[14px] font-semibold text-ink">{dc.recommendation}</p>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 border-b border-line sm:grid-cols-4">
        <Stat value={dc.impact} label={dc.impactLabel} />
        <Stat value={dc.metric} label={dc.metricLabel} />
        <Stat value={dc.comparables} label={dc.comparablesLabel} />
        <Stat value={dc.confidence} label={dc.confidenceLabel} accent />
      </div>

      {/* why this wins */}
      <div className="px-6 py-5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Why this wins</p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink">{controlRoom.whyThisWins}</p>
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center gap-3 border-t border-line bg-paper/60 px-6 py-4">
        <Link
          href="/control-room#evidence"
          className="inline-flex items-center gap-1.5 bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper transition-colors hover:bg-ink2"
        >
          See why
          <span aria-hidden="true">→</span>
        </Link>
        <Link
          href="/assessment"
          className="inline-flex items-center gap-1.5 border border-line px-5 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink/40"
        >
          Build your own decision
        </Link>
      </div>
    </article>
  );
}

function Stat({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className={cn("border-b border-line px-6 py-4 sm:border-b-0", accent ? "" : "sm:border-r")}>
      <p className={cn("text-[clamp(1.5rem,2.2vw,1.9rem)] font-extralight leading-none tracking-[-0.02em]", accent ? "text-accent-deep" : "text-ink")}>
        {value}
      </p>
      <p className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}
