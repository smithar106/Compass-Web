import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

const FLYWHEEL = [
  "Operational problem",
  "Executive Decision Brief",
  "Implementation",
  "Measured outcome",
  "Implementation intelligence",
  "Better decisions",
];

export function ConsultingRebuilt() {
  const c = marketing.consultingRebuilt;
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <SectionHeader
          eyebrow={c.label}
          number={c.number}
          headline={c.headline}
          subtitle={c.supporting}
        />

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {c.columns.map((col, i) => {
            const isCompass = col.highlighted;
            return (
              <Reveal key={col.name} delay={i * 100} className="h-full">
                <div
                  className={cn(
                    "flex h-full flex-col border p-6",
                    isCompass ? "border-accent/50 bg-ink shadow-panel-lg" : "border-line bg-surface"
                  )}
                >
                  <h3
                    className={cn(
                      "text-[16px] font-semibold tracking-tight",
                      isCompass ? "text-paper" : "text-ink"
                    )}
                  >
                    {col.name}
                  </h3>
                  <ul className="mt-5 flex-1 space-y-3">
                    {col.items.map((item) => (
                      <li
                        key={item}
                        className={cn(
                          "flex items-start gap-2.5 text-[13px] leading-snug",
                          isCompass ? "text-paper/80" : "text-muted"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "mt-[7px] h-1 w-1 shrink-0 rounded-full",
                            isCompass ? "bg-accent" : "bg-lineDark"
                          )}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* flywheel */}
        <Reveal delay={200}>
          <div className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 lg:flex-nowrap">
              {FLYWHEEL.map((step, i) => (
                <div key={step} className="flex items-center">
                  <span
                    className={cn(
                      "whitespace-nowrap border px-3.5 py-2.5 text-center text-[13px] font-semibold",
                      i === FLYWHEEL.length - 1
                        ? "border-ink bg-ink text-accent"
                        : "border-line bg-surface text-ink"
                    )}
                  >
                    {step}
                  </span>
                  {i < FLYWHEEL.length - 1 && (
                    <span aria-hidden="true" className="mx-1.5 flex items-center text-faint">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </div>
              ))}
            </div>
            {/* return arrow */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-accent-deep" aria-hidden="true">
                <path d="M12.5 2.5v4h-4M3.5 13.5v-4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 7.5A5.5 5.5 0 0 1 12.5 5M12 8.5A5.5 5.5 0 0 1 3.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accent-deep">
                feeds back into the next decision
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={280}>
          <p className="mt-8 max-w-2xl font-serif text-[17px] italic leading-relaxed text-ink">
            {c.closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
