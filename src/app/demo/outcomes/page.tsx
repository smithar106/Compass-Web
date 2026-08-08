import type { Metadata } from "next";
import { OutcomesPanel } from "@/components/demo/OutcomesPanel";

export const metadata: Metadata = {
  title: "Compass Demo — Outcomes",
  robots: { index: false, follow: false },
};

export default function DemoOutcomesPage() {
  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-tight text-ink sm:text-[24px]">
        Results
      </h1>
      <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
        Completed decisions with expected versus actual results. Every outcome is captured against
        the baseline agreed before implementation began.
      </p>
      <div className="mt-7">
        <OutcomesPanel />
      </div>
    </div>
  );
}
