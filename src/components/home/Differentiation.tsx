import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function Differentiation() {
  const d = marketing.differentiation;
  return (
    <section className="border-b border-lineDark bg-paper-dark">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <SectionHeader
          eyebrow={d.label}
          number={d.number}
          tone="dark"
          headline={d.headline}
          subtitle={d.subtitle}
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
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

        {/* decision loop strip */}
        <Reveal delay={200}>
          <div className="mt-10 flex flex-col items-stretch gap-3 border border-lineDark bg-ink/40 p-6 sm:flex-row sm:items-center sm:gap-0 sm:p-0">
            {["Decision N", "Implemented", "Measured", "Decision N+1"].map((step, i) => (
              <div key={step} className="flex flex-1 items-center gap-3 sm:px-6 sm:py-5">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-bold",
                    i === 0 ? "bg-ink text-paper" : "bg-lineDark text-paper/70"
                  )}
                >
                  {i === 0 ? "N" : i === 3 ? "N+1" : "✓"}
                </span>
                <span className={cn("text-[13px] font-medium", i === 3 ? "text-accent" : "text-paper/80")}>
                  {step}
                </span>
                {i < 3 && (
                  <svg
                    className="hidden h-4 w-4 text-paper/30 sm:block"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
