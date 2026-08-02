import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

export function Pillars() {
  const p = marketing.pillars;
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <SectionHeader eyebrow={p.label} number={p.number} headline={p.headline} subtitle={p.subtitle} />

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
          {p.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 90} className="h-full">
              <article className="flex h-full flex-col bg-surface p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[38px] font-bold leading-none tracking-tight text-ink">
                    {item.number}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                    {item.name}
                  </span>
                </div>
                <h3 className="mt-6 text-[17px] font-semibold leading-snug tracking-tight text-ink">
                  {item.headline}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-muted">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={180}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {["Evidence", "Execution", "Measurement", "Learning"].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className="border border-line bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-ink">
                  {step}
                </span>
                {i < 3 && (
                  <span aria-hidden="true" className="text-faint">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </div>
            ))}
            <span className="w-full sm:w-auto sm:flex-1" />
            <span className="text-[12px] italic text-muted">{p.loop}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
