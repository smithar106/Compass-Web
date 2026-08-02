import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";
import { DecisionLoop, type DecisionStep } from "./DecisionLoop";

export function CompoundingMoat() {
  const c = marketing.compounding;
  const steps = c.steps as DecisionStep[];
  return (
    <section className="border-b border-lineDark bg-paper-dark">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <SectionHeader
          eyebrow={c.label}
          number={c.number}
          tone="dark"
          headline={c.headline}
          subtitle={c.subtitle}
        />

        <Reveal delay={120}>
          <div className="mt-10 border border-lineDark bg-ink/40 p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-paper/40">
              Decision after decision, the organization gets better at deciding
            </p>
            <DecisionLoop steps={steps} />
            <p className="mt-6 border-t border-lineDark pt-5 font-serif text-[17px] italic text-accent">
              {c.moatLine}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
