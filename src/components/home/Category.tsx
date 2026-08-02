import { marketing } from "@/content/marketing";
import { Eyebrow } from "./primitives";
import { Reveal } from "./Reveal";

export function Category() {
  const c = marketing.category;
  const q = c.question;

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <Reveal>
          <Eyebrow number={c.number}>{c.label}</Eyebrow>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal delay={80}>
              <h2 className="max-w-xl text-title font-semibold tracking-tight text-ink">
                {c.headline}
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-2 font-serif text-[22px] italic leading-snug tracking-tight text-accent-deep">
                {c.subheadline}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-6 max-w-xl text-lead leading-relaxed text-muted">{c.supporting}</p>
            </Reveal>

            {/* what you have vs. what's missing */}
            <Reveal delay={280}>
              <div className="mt-8 border border-line bg-surface p-5">
                <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-faint">
                  You already have
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.have.map((item) => (
                    <span key={item} className="border border-line bg-paper px-2.5 py-1 text-[11.5px] font-medium text-muted">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="my-4 flex items-center gap-3" aria-hidden="true">
                  <span className="h-px flex-1 bg-line" />
                  <span className="font-mono text-[10px] text-faint">missing</span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <p className="text-[15px] font-semibold text-ink">{c.missing}</p>
              </div>
            </Reveal>
          </div>

          {/* the question */}
          <Reveal delay={120}>
            <div className="border border-line bg-surface">
              <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-faint">
                    {q.mostLabel}
                  </p>
                  <p className="mt-4 text-[20px] font-semibold leading-snug tracking-tight text-faint line-through decoration-line">
                    &ldquo;{q.mostQuestion}&rdquo;
                  </p>
                </div>
                <div className="bg-paper p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                    {q.compassLabel}
                  </p>
                  <p className="mt-4 font-serif text-[19px] italic leading-snug tracking-tight text-ink">
                    &ldquo;{q.compassQuestion}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* thesis */}
        <Reveal delay={140}>
          <p className="mt-10 border-t border-line pt-10 text-[28px] font-semibold leading-tight tracking-tight text-ink sm:text-[32px]">
            {c.thesis}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
