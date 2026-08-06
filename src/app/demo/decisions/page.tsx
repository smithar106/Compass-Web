import type { Metadata } from "next";
import { demoDecisions } from "@/data/demo-data";
import { DecisionCard } from "@/components/demo/DecisionCard";

export const metadata: Metadata = {
  title: "Compass Demo — Decisions",
  robots: { index: false, follow: false },
};

export default function DemoDecisionsPage() {
  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-tight text-ink sm:text-[24px]">Decisions</h1>
      <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
        Every operational decision in this organization&apos;s portfolio — with the recommendation,
        status, expected impact, owner, and next action. Open any decision for its full brief.
      </p>
      <div className="mt-7 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {demoDecisions.map((d) => (
          <DecisionCard key={d.id} decision={d} />
        ))}
      </div>
    </div>
  );
}
