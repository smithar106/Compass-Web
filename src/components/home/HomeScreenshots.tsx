import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

export function HomeScreenshots() {
  const s = marketing.home.screenshots;

  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader eyebrow={s.eyebrow} headline={s.headline} subtitle={s.supporting} align="center" />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal delay={80}>
            <Frame label="Assessment">
              <div className="space-y-3.5">
                <p className="text-[13px] font-semibold text-ink">What operational problem are you trying to solve?</p>
                <div className="rounded border border-line bg-paper px-4 py-3 text-[12.5px] text-ink">
                  Manual invoice processing is slow, error-prone, and consumes finance capacity…
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {["Invoice processing", "Customer onboarding", "Support triage", "Contract review"].map((chip) => (
                    <span key={chip} className="rounded border border-line bg-paper px-3 py-2 text-[11.5px] font-medium text-muted">
                      {chip}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-faint">2–3 minutes · Private by default</span>
                  <span className="inline-flex items-center gap-1.5 rounded bg-ink px-4 py-2 text-[12px] font-semibold text-paper">
                    Analyze Problem
                  </span>
                </div>
              </div>
            </Frame>
          </Reveal>

          <Reveal delay={160}>
            <Frame label="Decision brief">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13.5px] font-bold text-ink">Approve AI-Powered Invoice Processing</p>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#E5F3EA] px-2.5 py-0.5 text-[10px] font-bold text-[#14532d]">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#1E7B4C]" />
                    Recommended
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { m: "90%", l: "Fraud detection" },
                    { m: "50%", l: "Cost" },
                    { m: "8–16 wks", l: "To value" },
                  ].map((k) => (
                    <div key={k.l} className="rounded border border-line bg-paper px-3 py-2.5">
                      <p className="text-[18px] font-extrabold leading-none text-ink">{k.m}</p>
                      <p className="mt-1 text-[9.5px] font-bold uppercase tracking-wide text-muted">{k.l}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded border border-line bg-paper px-3.5 py-2.5">
                  <p className="text-[11px] font-bold text-ink">Thermo Fisher</p>
                  <p className="text-[10.5px] leading-snug text-muted">
                    Implemented intelligent document processing to automate invoice handling. 70% lower
                    processing time.
                  </p>
                </div>
                <div className="rounded border border-line bg-paper px-3.5 py-2.5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#463a9e]">Implementation</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {["Phase 1", "Phase 2", "Phase 3", "Phase 4"].map((p) => (
                      <span key={p} className="rounded bg-white px-2 py-1 text-[10px] font-semibold text-ink">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Frame>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-panel">
      <div className="flex items-center justify-between border-b border-line bg-paper/70 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-line" />
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-line" />
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-line" />
        </div>
        <span className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-faint">{label}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
