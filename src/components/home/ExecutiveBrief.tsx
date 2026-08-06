import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

const KPIS = [
  { metric: "90%", label: "Improved fraud detection" },
  { metric: "50%", label: "Lower processing cost" },
  { metric: "8–16 wks", label: "Time to measurable value" },
];

const PHASES = ["Establish the Baseline", "Configure the Solution", "Run the Pilot", "Scale Deployment"];

export function ExecutiveBrief() {
  const b = marketing.home.brief;

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader eyebrow={b.eyebrow} headline={b.headline} subtitle={b.supporting} align="center" />

        <Reveal delay={160}>
          <div className="relative mx-auto mt-14 max-w-4xl">
            {/* doc chrome */}
            <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-panel-lg">
              <div className="flex items-center justify-between border-b border-line bg-paper/70 px-5 py-3">
                <div className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-line" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
                  Executive Decision Brief
                </span>
                <span className="border border-line bg-surface px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-faint">
                  Illustrative
                </span>
              </div>

              {/* brief body */}
              <div className="bg-[#e9f5ec] px-6 py-7 sm:px-10 sm:py-9">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-serif text-[24px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[28px]">
                    Approve AI-Powered Invoice Processing
                  </h3>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#E5F3EA] px-3 py-1 text-[11px] font-bold text-[#14532d]">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#1E7B4C]" />
                    Recommended for Pilot Approval
                  </span>
                </div>

                <p className="mt-4 max-w-3xl text-[13px] leading-[1.65] text-ink">
                  Manual invoice processing is consuming valuable finance capacity and creating
                  unnecessary operational friction. AI-powered invoice processing offers the strongest
                  opportunity to reduce manual effort, accelerate processing, and improve financial
                  controls while limiting implementation risk through a phased rollout. We recommend
                  approving a controlled pilot, with expansion contingent on achieving predefined
                  operational and financial success criteria.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {KPIS.map((k) => (
                    <div key={k.label} className="rounded border border-[#c8dacb] bg-white px-4 py-3.5">
                      <p className="text-[26px] font-extrabold leading-none tracking-tight text-ink">{k.metric}</p>
                      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.08em] text-ink">{k.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* evidence */}
              <div className="bg-[#e8f0fe] px-6 py-6 sm:px-10">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#1e40af]">Evidence</p>
                <p className="mt-1 text-[12px] font-medium text-ink">
                  Comparable organizations have successfully implemented similar solutions and reported
                  measurable improvements in cost, processing speed, and operational performance.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {["Thermo Fisher", "A large retailer", "A global bank"].map((org, i) => (
                    <div key={org} className="rounded bg-white px-4 py-3.5">
                      <p className="text-[13.5px] font-bold text-ink">{org}</p>
                      <p className="mt-1 text-[11px] leading-[1.45] text-ink/75">
                        {i === 0
                          ? "Implemented intelligent document processing to streamline invoice processing."
                          : i === 1
                            ? "Deployed automated matching to streamline invoice processing."
                            : "Adopted workflow automation to streamline invoice processing."}
                      </p>
                      <p className="mt-1.5 text-[11px] leading-[1.45] text-ink">
                        {i === 0
                          ? "70% lower processing time · 53% more invoices handled without human involvement"
                          : i === 1
                            ? "45% lower processing cost · 2x throughput"
                            : "38% lower cost · 60% fewer exceptions"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* implementation phases */}
              <div className="bg-[#f0ebfa] px-6 py-6 sm:px-10">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#463a9e]">Implementation</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {PHASES.map((p, i) => (
                    <div key={p} className="rounded bg-white px-3.5 py-3">
                      <p className="text-[11px] font-bold text-ink">Phase {i + 1}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-ink/80">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
