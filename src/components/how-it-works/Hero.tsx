import { Reveal } from "@/components/home/Reveal";
import { Eyebrow } from "@/components/home/primitives";
import { cn } from "@/lib/utils";

const SHORT_PROCESS = ["Understand", "Compare", "Defend", "Implement", "Learn"] as const;

export function Hero() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8 lg:px-10 lg:pb-20 lg:pt-36">
        <Reveal>
          <Eyebrow>How It Works</Eyebrow>
          <h1 className="mt-6 max-w-4xl text-display font-semibold tracking-tight text-ink">
            How Compass Makes Decisions
          </h1>
          <p className="mt-6 max-w-3xl text-lead leading-relaxed text-muted">
            Compass combines structured implementation evidence with a repeatable decision
            methodology to deliver the rigor of consulting as a persistent software system.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
              The short process
            </p>
            <ProcessRail />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProcessRail() {
  return (
    <div className="mt-5">
      {/* desktop: horizontal flow */}
      <ol className="hidden items-stretch md:flex">
        {SHORT_PROCESS.map((step, i) => {
          const isLast = i === SHORT_PROCESS.length - 1;
          return (
            <li key={step} className="flex flex-1 items-center">
              <div
                className={cn(
                  "flex flex-1 flex-col items-center gap-1.5 border px-3 py-4 text-center",
                  isLast ? "border-ink bg-ink" : "border-line bg-surface"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[10px] font-bold",
                    isLast ? "text-accent" : "text-faint"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "text-[13px] font-semibold",
                    isLast ? "text-paper" : "text-ink"
                  )}
                >
                  {step}
                </span>
              </div>
              {i < SHORT_PROCESS.length - 1 && (
                <span aria-hidden="true" className="mx-1.5 flex h-8 items-center text-faint">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {/* mobile: vertical flow */}
      <ol className="md:hidden">
        {SHORT_PROCESS.map((step, i) => {
          const isLast = i === SHORT_PROCESS.length - 1;
          return (
            <li key={step}>
              <div
                className={cn(
                  "flex items-center gap-3 border px-4 py-3",
                  isLast ? "border-ink bg-ink" : "border-line bg-surface"
                )}
              >
                <span className={cn("font-mono text-[10px] font-bold", isLast ? "text-accent" : "text-faint")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={cn("text-[14px] font-semibold", isLast ? "text-paper" : "text-ink")}>
                  {step}
                </span>
              </div>
              {i < SHORT_PROCESS.length - 1 && (
                <div className="flex justify-center py-1" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-faint">
                    <path d="M8 2v11M3.5 9 8 13.5 12.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
