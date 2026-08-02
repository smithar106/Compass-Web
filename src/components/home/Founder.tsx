import { marketing } from "@/content/marketing";
import { Eyebrow } from "./primitives";
import { Reveal } from "./Reveal";

export function Founder() {
  const f = marketing.founder;
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow number={f.number}>{f.label}</Eyebrow>
            </Reveal>
            <Reveal delay={90}>
              <p className="mt-6 font-serif text-3xl italic leading-snug tracking-tight text-ink sm:text-4xl">
                {f.headline}
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-7 max-w-xl text-lead leading-relaxed text-muted">{f.bio}</p>
              <p className="mt-5 max-w-xl font-serif text-[19px] italic leading-relaxed text-ink">
                {f.body2}
              </p>
              <p className="mt-6 max-w-xl border-l-2 border-accent-deep pl-4 font-serif text-[15px] italic leading-relaxed text-ink">
                {f.founderLine}
              </p>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="border border-line bg-surface p-7">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-ink font-serif text-lg italic text-accent"
                >
                  AS
                </span>
                <div>
                  <p className="text-[16px] font-semibold text-ink">{f.name}</p>
                  <p className="text-[12.5px] text-muted">{f.role}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-line pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                  {f.proofPointsLabel}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {f.proofPoints.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-[13px] leading-snug text-muted">
                      <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent-deep" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
