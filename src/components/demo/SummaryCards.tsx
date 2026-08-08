import { demoSummary } from "@/data/demo-data";

export function SummaryCards() {
  return (
    <section aria-label="Decision summary">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="border border-line bg-surface px-6 py-7">
          <p className="text-[clamp(3rem,5vw,4rem)] font-extralight leading-none tracking-[-0.03em] text-ink">
            {demoSummary.underReview}
          </p>
          <p className="mt-3 text-[14px] font-semibold text-ink">Decisions to make</p>
        </div>
        <div className="border border-line bg-surface px-6 py-7">
          <p className="text-[clamp(3rem,5vw,4rem)] font-extralight leading-none tracking-[-0.03em] text-ink">
            {demoSummary.approvedPilots}
          </p>
          <p className="mt-3 text-[14px] font-semibold text-ink">Pilots approved</p>
        </div>
        <div className="border border-line bg-surface px-6 py-7">
          <p className="text-[clamp(3rem,5vw,4rem)] font-extralight leading-none tracking-[-0.03em] text-ink">
            {demoSummary.activeImplementations}
          </p>
          <p className="mt-3 text-[14px] font-semibold text-ink">In implementation</p>
        </div>
        <div className="border border-line bg-surface px-6 py-7">
          <p className="text-[clamp(3rem,5vw,4rem)] font-extralight leading-none tracking-[-0.03em] text-ink">
            {demoSummary.completedMeasured}
          </p>
          <p className="mt-3 text-[14px] font-semibold text-ink">Outcomes measured</p>
        </div>
        <div className="border border-[#cfe6d8] bg-[#f2faf5] px-6 py-7 lg:col-span-1">
          <p className="text-[clamp(2.2rem,4vw,3rem)] font-extralight leading-none tracking-[-0.03em] text-[#14532d]">
            $2.4M
          </p>
          <p className="mt-3 text-[14px] font-semibold text-[#14532d]">Expected annual value</p>
        </div>
      </div>
    </section>
  );
}
