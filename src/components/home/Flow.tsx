import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

const FLOW = [
  { label: "Problem", note: "The operational problem you want to fix" },
  { label: "Evidence", note: "Comparable implementations from the evidence library" },
  { label: "Recommendation", note: "The intervention ranked highest against evidence" },
  { label: "Implementation", note: "A concrete path: validate, pilot, deploy, measure" },
  { label: "Measurement", note: "KPIs and checkpoints that prove it worked" },
];

const DELIVERABLES = [
  "what intervention is recommended",
  "why it was selected",
  "what alternatives were considered",
  "evidence from comparable implementations",
  "expected impact",
  "implementation requirements",
  "risks and constraints",
  "how success should be measured",
];

/**
 * Section 3 — From operational problem to defensible decision.
 */
export function Flow() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader
          eyebrow="What Compass returns"
          headline="From operational problem to defensible decision."
          align="center"
        />

        <div className="mx-auto mt-14 flex max-w-3xl flex-col items-stretch gap-1.5">
          {FLOW.map((item, i) => (
            <Reveal key={item.label} delay={i * 90}>
              <div className="group flex flex-col border border-line bg-surface transition-colors hover:border-ink/30 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 px-6 py-4">
                  <span className="font-mono text-[12px] font-bold text-faint">0{i + 1}</span>
                  <p className="text-[16px] font-semibold tracking-tight text-ink">{item.label}</p>
                </div>
                <p className="px-6 pb-4 text-[13px] leading-relaxed text-muted sm:py-4 sm:text-right">
                  {item.note}
                </p>
              </div>
              {i < FLOW.length - 1 && (
                <div className="flex justify-center py-0.5 text-faint" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2v11M3.5 9.5 8 14l4.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mx-auto mt-14 max-w-3xl border border-line bg-surface px-7 py-8 sm:px-10">
            <p className="font-serif text-[19px] italic leading-relaxed text-ink">
              Compass doesn&rsquo;t just tell you what could work.
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">It shows:</p>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {DELIVERABLES.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink">
                  <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-deep" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
