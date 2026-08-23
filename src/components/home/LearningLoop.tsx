import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

const LOOP = [
  { label: "Decide", note: "An evidence-backed intervention choice" },
  { label: "Implement", note: "A validated path to execution" },
  { label: "Measure", note: "Outcomes tracked against KPIs" },
  { label: "Learn", note: "Results feed the next decision" },
];

/**
 * Section 6 — The learning loop. Every completed implementation makes the next
 * decision better informed.
 */
export function LearningLoop() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper-dark">
      <div
        aria-hidden="true"
        className="grid-backdrop-dark pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader
          eyebrow="The learning loop"
          headline="Every decision makes the next one better."
          subtitle="Every completed implementation gives Compass better organizational evidence for the next decision."
          tone="dark"
          align="center"
        />

        <div className="mx-auto mt-14 flex max-w-4xl flex-col items-stretch gap-1.5 md:flex-row md:items-stretch md:gap-0">
          {LOOP.map((step, i) => (
            <Reveal key={step.label} delay={i * 100} className="flex flex-1 flex-col">
              <div className="flex flex-1 flex-col items-center border border-lineDark bg-paper-dark/50 px-5 py-7 text-center">
                <p className="text-[17px] font-semibold tracking-tight text-paper">{step.label}</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-paper/60">{step.note}</p>
              </div>
              {i < LOOP.length - 1 && (
                <div className="flex justify-center py-1 text-faint" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="md:rotate-90">
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal delay={240}>
          <div className="mx-auto mt-12 max-w-2xl border border-lineDark bg-paper-dark/60 px-7 py-6 text-center">
            <p className="text-[13.5px] leading-relaxed text-paper/80">
              <span className="font-mono font-bold text-accent">Decision #17</span>
              <span className="text-paper/50"> → implemented → measured → learned → </span>
              <span className="font-mono font-bold text-accent">Decision #18</span>
              <span className="text-paper/80"> becomes better informed.</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
