import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

export function CompoundingValue() {
  const c = marketing.home.compounding;

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader eyebrow={c.eyebrow} headline={c.headline} subtitle={c.supporting} align="center" />

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
          {c.points.map((p, i) => (
            <Reveal key={p.title} delay={80 + i * 90} className="h-full">
              <div className="flex h-full flex-col border border-line bg-surface px-6 py-7">
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] font-bold text-accent-deep"
                >
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-[15.5px] font-semibold tracking-tight text-ink">{p.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{p.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-12 text-center font-serif text-[19px] italic leading-relaxed text-ink">
            The moat is memory, not models.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
