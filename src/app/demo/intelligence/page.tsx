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
        Every recommendation in this portfolio is grounded in a library of real
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
            title: "Decisions trace to real implementations",
            body: "Every recommendation in this portfolio is built on documented implementations with measured outcomes.",
          },
          {
            title: "Matched to Northwind&apos;s functions",
            body: "Evidence is compared against this organization&apos;s operating functions and constraints.",
          },
          {
            title: "The portfolio sharpens the library",
            body: "Every completed decision here strengthens the evidence behind the next one.",
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
