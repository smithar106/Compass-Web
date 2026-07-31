import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";
import { DecisionLoop, type DecisionStep } from "./DecisionLoop";
import { cn } from "@/lib/utils";

export function Differentiation() {
  const d = marketing.differentiation;
  const steps = d.decisionSteps as DecisionStep[];
  return (
    <section className="border-b border-lineDark bg-paper-dark">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <SectionHeader
          eyebrow={d.label}
          number={d.number}
          tone="dark"
          headline={d.headline}
          subtitle={d.subtitle}
        />

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {d.columns.map((col, i) => {
            const isCompass = col.highlighted;
            return (
              <Reveal key={col.name} delay={i * 110} className="h-full">
                <div
                  className={cn(
                    "flex h-full flex-col border p-6",
                    isCompass
                      ? "border-accent/40 bg-ink"
                      : "border-lineDark bg-paper-dark/40"
                  )}
                >
                  <p
                    className={cn(
                      "text-[11px] font-semibold uppercase tracking-eyebrow",
                      isCompass ? "text-accent" : "text-paper/40"
                    )}
                  >
                    {col.note}
                  </p>
                  <h3
                    className={cn(
                      "mt-2 text-[20px] font-semibold tracking-tight",
                      isCompass ? "text-paper" : "text-paper/80"
                    )}
                  >
                    {col.name}
                  </h3>
                  <ul className="mt-6 space-y-3 border-t border-lineDark pt-5">
                    {col.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-[13px] leading-snug text-paper/70"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "mt-[7px] h-1 w-1 shrink-0 rounded-full",
                            isCompass ? "bg-accent" : "bg-paper/30"
                          )}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {isCompass && (
                    <p className="mt-auto pt-6 font-serif text-[15px] italic text-accent">
                      One completed decision becomes the input to the next.
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* decision loop: the moat, shown not told */}
        <Reveal delay={160}>
          <div className="mt-10 border border-lineDark bg-ink/40 p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-paper/40">
              This is what consultants cannot do
            </p>
            <DecisionLoop steps={steps} />
            <p className="mt-6 border-t border-lineDark pt-5 font-serif text-[17px] italic text-accent">
              {d.moatLine}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
