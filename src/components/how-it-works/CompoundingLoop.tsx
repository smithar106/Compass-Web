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
          {/* desktop: circular layout */}
          <div className="hidden md:block">
            <div className="relative aspect-[2.4/1] w-full">
              <div aria-hidden="true" className="grid-backdrop absolute inset-0 opacity-30" />
              <div className="absolute left-[10%] right-[10%] top-[16%] flex items-center justify-between gap-0">
                {LOOP.map((step, i) => (
                  <div key={step.name} className="flex flex-1 items-center">
                    <div
                      className={cn(
                        "flex h-24 w-full flex-col items-center justify-center border px-2 text-center",
                        i === 0 ? "border-ink bg-ink" : "border-line bg-paper"
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[10px] font-bold",
                          i === 0 ? "text-accent" : "text-faint"
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "mt-1 text-[12.5px] font-semibold leading-tight",
                          i === 0 ? "text-paper" : "text-ink"
                        )}
                      >
                        {step.name}
                      </span>
                    </div>
                    {i < LOOP.length - 1 && (
                      <span aria-hidden="true" className="mx-1 text-faint">
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                          <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {/* return path */}
              <div className="absolute bottom-[12%] left-[10%] right-[10%]">
                <svg className="h-10 w-full" viewBox="0 0 600 40" fill="none" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    d="M560 34 C 400 34, 200 4, 40 34"
                    stroke="#4C650C"
                    strokeWidth="1.4"
                    strokeDasharray="5 4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-deep">
                  feeds back into the next decision
                </p>
              </div>
            </div>
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
            <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-deep">
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
