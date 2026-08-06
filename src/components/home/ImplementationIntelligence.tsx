import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

export function ImplementationIntelligence() {
  const i = marketing.home.intelligence;

  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeader eyebrow={i.eyebrow} headline={i.headline} subtitle={i.supporting} />
            <Reveal delay={200}>
              <div className="mt-10 space-y-2.5">
                {["Gold", "Silver", "Bronze"].map((tier, idx) => (
                  <div
                    key={tier}
                    className="flex items-center justify-between gap-4 border border-line bg-paper px-5 py-3.5"
                  >
                    <span className="flex items-center gap-3 text-[13px] font-semibold text-ink">
                      <span
                        aria-hidden="true"
                        className={`h-2.5 w-2.5 rounded-full ${
                          idx === 0 ? "bg-accent-deep" : idx === 1 ? "bg-muted" : "bg-faint"
                        }`}
                      />
                      {tier} evidence
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
                      {idx === 0 ? "Independently verified" : idx === 1 ? "Strong documentation" : "Directional"}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {i.features.map((f, idx) => (
              <Reveal key={f.name} delay={80 + idx * 90} className="h-full">
                <div className="flex h-full flex-col border border-line bg-paper px-6 py-6 transition-colors duration-200 hover:border-ink/30">
                  <p className="text-[15px] font-semibold tracking-tight text-ink">{f.name}</p>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{f.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
