import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

export function Problem() {
  const p = marketing.home.problem;

  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeader eyebrow={p.eyebrow} headline={p.headline} subtitle={p.supporting} />
            <Reveal delay={160}>
              <p className="mt-8 max-w-xl border-l-2 border-accent-deep pl-4 font-serif text-[17px] italic leading-relaxed text-ink">
                {p.thesis}
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {p.cards.map((c, i) => (
              <Reveal key={c.label} delay={80 + i * 90}>
                <div className="flex h-full flex-col justify-between gap-6 border border-line bg-paper px-6 py-6">
                  <p className="text-[42px] font-semibold leading-none tracking-tight text-ink">
                    {c.stat}
                  </p>
                  <p className="text-[14.5px] leading-relaxed text-muted">{c.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
