import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

export function Problem() {
  const p = marketing.home.problem;

  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <SectionHeader eyebrow={p.eyebrow} headline={p.headline} subtitle={p.supporting} />
            <Reveal delay={160}>
              <p className="mt-8 max-w-xl border-l-2 border-accent-deep pl-4 font-serif text-[17px] italic leading-relaxed text-ink">
                {p.closing}
              </p>
            </Reveal>
          </div>

          <Reveal delay={120} className="h-full">
            <div className="flex h-full flex-col justify-center border border-line bg-paper px-6 py-8 sm:px-8">
              <p className="text-[11px] font-bold uppercase tracking-eyebrow text-accent-deep">
                {p.optionsLabel}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {p.options.map((option) => (
                  <li
                    key={option}
                    className="rounded-sm border border-line bg-surface px-3.5 py-2 text-[13px] font-medium text-ink"
                  >
                    {option}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[13px] leading-relaxed text-muted">
                Compared on evidence, expected impact, effort, and risk{" \u2014 "}before you commit.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
