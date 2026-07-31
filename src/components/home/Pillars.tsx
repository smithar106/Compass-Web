import { site } from "@/content/site";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

export function Pillars() {
  const p = site.marketing.pillars;
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow={p.label} number={p.number} headline={p.headline} subtitle={p.subtitle} />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
          {p.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 100} className="h-full">
              <article className="flex h-full flex-col bg-surface p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[38px] font-bold leading-none tracking-tight text-ink">
                    {item.number}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                    {item.name}
                  </span>
                </div>
                <h3 className="mt-6 text-[19px] font-semibold leading-snug tracking-tight text-ink">
                  {item.headline}
                </h3>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted">{item.body}</p>
                <p className="mt-6 flex items-start gap-2.5 border-t border-line pt-5 text-[12px] leading-snug text-ink">
                  <span aria-hidden="true" className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-deep" />
                  {item.tag}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-8 font-serif text-[15px] italic text-muted">{p.loop}</p>
        </Reveal>
      </div>
    </section>
  );
}
