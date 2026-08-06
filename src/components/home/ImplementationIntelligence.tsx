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
              <ul className="mt-10 space-y-3">
                {[
                  "Real-world implementations, not vendor claims",
                  "Measured outcomes captured against a baseline",
                  "The library grows with every completed implementation",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[14px] leading-relaxed text-ink">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-deep"
                    />
                    {point}
                  </li>
                ))}
              </ul>
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
