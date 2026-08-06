import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

export function Problem() {
  const p = marketing.home.problem;

  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader eyebrow={p.eyebrow} headline={p.headline} align="center" />

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
          {p.stats.map((s, i) => (
            <Reveal key={s.value} delay={i * 100} className="h-full">
              <div className="flex h-full flex-col border border-line bg-paper px-8 py-10">
                <p className="text-[56px] font-extrabold leading-none tracking-tight text-ink">
                  {s.value}
                </p>
                <p className="mt-6 text-[15.5px] font-semibold leading-snug text-ink">{s.title}</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{s.detail}</p>
                <p className="mt-auto pt-8 text-[11px] font-bold uppercase tracking-eyebrow text-faint">
                  Source: {s.source}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={180}>
          <p className="mx-auto mt-16 max-w-3xl text-center text-lead leading-relaxed text-ink">
            <em className="font-serif italic text-accent-deep">
              The challenge isn&rsquo;t building AI. It&rsquo;s deciding what should be built in
              the first place.
            </em>
            <br />
            <span className="mt-3 inline-block text-muted">
              Most organizations choose an implementation before comparing alternative approaches.
              That is the problem Compass solves.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
