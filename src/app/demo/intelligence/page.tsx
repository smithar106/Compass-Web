import type { Metadata } from "next";
import { CoveragePanel } from "@/components/demo/CoveragePanel";

export const metadata: Metadata = {
  title: "Compass Demo — Implementation Intelligence",
  robots: { index: false, follow: false },
};

export default function DemoIntelligencePage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-ink sm:text-[24px]">
        Implementation Intelligence
      </h1>
      <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
        Compass recommendations are grounded in a continuously growing library of real
        implementation evidence — what organizations did, in what context, and what actually
        happened. This view shows where that evidence is strongest for this organization&apos;s
        operating functions.
      </p>

      <div className="mt-7">
        <CoveragePanel />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            title: "Real implementation evidence",
            body: "Recommendations are built on documented implementations with measured outcomes — not opinion.",
          },
          {
            title: "Matched to your context",
            body: "Evidence is compared against your industry, process, and operating constraints.",
          },
          {
            title: "Keeps getting better",
            body: "Every completed decision and measured outcome sharpens the next recommendation.",
          },
        ].map((f) => (
          <div key={f.title} className="border border-line bg-surface px-5 py-5">
            <p className="text-[14px] font-semibold tracking-tight text-ink">{f.title}</p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
