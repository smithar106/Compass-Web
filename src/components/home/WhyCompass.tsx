import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

const C = {
  gold: "#8B6914",
  blue: "#1E40AF",
  green: "#14532D",
} as const;

export function WhyCompass() {
  const w = marketing.home.whyCompass;

  return (
    <section id="why-compass" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader eyebrow={w.eyebrow} headline={w.headline} subtitle={w.supporting} align="center" />

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {w.cards.map((card, i) => {
            const color = i === 0 ? C.gold : i === 1 ? C.blue : C.green;
            return (
              <Reveal key={card.name} delay={i * 110} className="h-full">
                <div
                  className="relative flex h-full flex-col overflow-hidden border border-line bg-paper px-8 py-10"
                  style={{ borderTop: `3px solid ${color}` }}
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color }}>
                    {card.name}
                  </p>
                  <p className="mt-4 text-[18px] font-semibold leading-snug tracking-tight text-ink">
                    {card.title}
                  </p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{card.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={340}>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 text-left border border-line bg-paper p-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-accent-deep">Technology Neutrality</p>
              <p className="mt-2 text-[16px] font-semibold tracking-tight text-ink">The answer isn&apos;t always AI. That&apos;s the point.</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                Compass starts with your business problem, not a predetermined technology. It compares AI, software, automation, process redesign, staffing, and hybrid approaches against your economics.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-accent-deep">Executive Leverage</p>
              <p className="mt-2 text-[16px] font-semibold tracking-tight text-ink">Compass doesn&apos;t replace judgment. It gives it leverage.</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                Leadership owns and approves the decision. Compass provides the rigorous research, economic analysis, intervention comparison, and evidence synthesis required to make it bulletproof.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <p className="mt-12 text-center text-[16px] font-medium leading-relaxed text-ink">
            {w.closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}