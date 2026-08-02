import { cn } from "@/lib/utils";
import { Reveal } from "@/components/home/Reveal";
import { Section } from "./Section";

const LOOP = [
  { name: "Decision", note: "A defensible choice, made once" },
  { name: "Implementation", note: "Executed by your team or a partner" },
  { name: "Measurement", note: "Outcomes vs. the agreed baseline" },
  { name: "Lessons learned", note: "Assumptions tested, results captured" },
  { name: "Better evidence", note: "Verified outcomes enter the graph" },
  { name: "Better decision", note: "The next decision starts stronger" },
] as const;

export function CompoundingLoop() {
  return (
    <Section
      id="loop"
      number="04"
      eyebrow="The compounding loop"
      headline="Every implementation improves the next decision."
      subtitle="The decision process and the evidence system are one loop. Each measured implementation becomes evidence for the next decision — so judgment compounds inside the organization."
    >
      <Reveal>
        <div className="border border-line bg-surface shadow-panel">
          {/* desktop: horizontal step rail */}
          <ol className="hidden md:flex md:items-stretch">
            {LOOP.map((step, i) => (
              <li key={step.name} className="flex flex-1 items-center">
                <div
                  className={cn(
                    "flex h-full w-full flex-col items-center justify-center gap-1.5 border px-3 py-6 text-center",
                    i === 0 ? "border-ink bg-ink" : "border-line bg-paper"
                  )}
                >
                  <span className={cn("font-mono text-[10px] font-bold", i === 0 ? "text-accent" : "text-faint")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={cn("text-[13px] font-semibold leading-tight", i === 0 ? "text-paper" : "text-ink")}>
                    {step.name}
                  </span>
                </div>
                {i < LOOP.length - 1 && (
                  <span aria-hidden="true" className="mx-1 flex h-8 shrink-0 items-center text-faint">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ol>

          {/* desktop: return label */}
          <div className="hidden items-center justify-center gap-2 border-t border-line bg-paper/60 px-4 py-2.5 md:flex">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-accent-deep">
              <path d="M12.5 2.5v4h-4M3.5 13.5v-4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 7.5A5.5 5.5 0 0 1 12.5 5M12 8.5A5.5 5.5 0 0 1 3.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-deep">
              feeds back into the next decision
            </p>
          </div>

          {/* mobile: vertical loop */}
          <ol className="md:hidden">
            {LOOP.map((step, i) => {
              const isLast = i === LOOP.length - 1;
              return (
                <li key={step.name}>
                  <div
                    className={cn(
                      "flex items-start gap-3 border px-4 py-3.5",
                      i === 0 ? "border-ink bg-ink" : "border-line bg-paper"
                    )}
                  >
                    <span className={cn("font-mono text-[10px] font-bold", i === 0 ? "text-accent" : "text-faint")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className={cn("text-[13.5px] font-semibold", i === 0 ? "text-paper" : "text-ink")}>
                        {step.name}
                      </p>
                      <p className={cn("text-[11.5px] leading-snug", i === 0 ? "text-paper/70" : "text-muted")}>
                        {step.note}
                      </p>
                    </div>
                  </div>
                  {!isLast && (
                    <div className="flex justify-center py-1" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-faint">
                        <path d="M8 2v11M3.5 9 8 13.5 12.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </li>
              );
            })}
            <p className="mt-3 flex items-center justify-center gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-deep">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M12.5 2.5v4h-4M3.5 13.5v-4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 7.5A5.5 5.5 0 0 1 12.5 5M12 8.5A5.5 5.5 0 0 1 3.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              feeds back into the next decision
            </p>
          </ol>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            {
              title: "Consulting moat",
              body: "The repeatable methodology becomes institutional capability, not a one-time engagement.",
            },
            {
              title: "Data moat",
              body: "Every measured implementation adds structured evidence no model or firm can recall from memory.",
            },
            {
              title: "Model moat",
              body: "Better evidence produces better decisions — and the next implementation generates more evidence.",
            },
          ].map((m) => (
            <div key={m.title} className="border border-line bg-surface p-5">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-accent-deep">{m.title}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{m.body}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
