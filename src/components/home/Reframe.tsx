import { site } from "@/content/site";
import { Eyebrow } from "./primitives";
import { Reveal } from "./Reveal";

export function Reframe() {
  const r = site.marketing.reframe;
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <Reveal>
          <Eyebrow number={r.number}>{r.label}</Eyebrow>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Most companies ask */}
          <div className="border-t border-line pt-8">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-faint">
              {r.mostLabel}
            </p>
            <p className="mt-6 text-section font-semibold leading-tight tracking-tight text-faint line-through decoration-line">
              <span aria-hidden="true">&ldquo;</span>
              {r.mostQuestion}
              <span aria-hidden="true">&rdquo;</span>
            </p>
          </div>

          {/* Compass asks */}
          <Reveal delay={150}>
            <div className="border-t-2 border-ink pt-8">
              <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                {r.compassLabel}
              </p>
              <p className="mt-6 text-section font-semibold leading-tight tracking-tight text-ink">
                <span aria-hidden="true" className="font-serif italic text-accent-deep">&ldquo;</span>
                {r.compassQuestion}
                <span aria-hidden="true" className="font-serif italic text-accent-deep">&rdquo;</span>
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={260}>
          <p className="mt-14 max-w-2xl text-lead leading-relaxed text-muted">{r.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
