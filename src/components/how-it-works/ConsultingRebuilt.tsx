import { Reveal } from "@/components/home/Reveal";
import { Section } from "./Section";

const ROWS = [
  {
    consulting: "Project begins from scratch",
    compass: "Reuses structured implementation intelligence",
  },
  {
    consulting: "Knowledge concentrated in a team",
    compass: "Methodology embedded in the product",
  },
  {
    consulting: "Static report",
    compass: "Executive Recommendation and implementation plan",
  },
  {
    consulting: "Engagement ends at delivery",
    compass: "Outcomes monitored over time",
  },
  {
    consulting: "Learning may leave with consultants",
    compass: "Learning remains with the organization",
  },
];

export function ConsultingRebuilt() {
  return (
    <Section
      number="01"
      eyebrow="Consulting, rebuilt"
      headline="The rigor of consulting without the one-time engagement."
      subtitle="Consulting delivered judgment as a service. Compass delivers it as a persistent decision system — the same discipline, embedded in software that keeps learning after the engagement would have ended."
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
        <Reveal>
          <ComparisonTable />
        </Reveal>
        <Reveal delay={120}>
          <div className="space-y-6">
            <p className="font-serif text-xl italic leading-relaxed text-ink/80">
              The next evolution of the operating model: the methodology of a great advisor,
              running continuously instead of inside a bounded project.
            </p>
            <ul className="space-y-3">
              {[
                "The decision process is visible, not held in a team's head.",
                "Every recommendation points to the evidence behind it.",
                "When the engagement would end, the learning loop keeps running.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] leading-relaxed text-muted">
                  <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-deep" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function ComparisonTable() {
  return (
    <div className="overflow-hidden border border-line bg-surface shadow-panel">
      <div className="grid grid-cols-2 border-b border-line">
        <div className="bg-paper px-5 py-3.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Traditional consulting</p>
        </div>
        <div className="border-l border-line bg-accent-soft px-5 py-3.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent-deep">Compass</p>
        </div>
      </div>
      <div>
        {ROWS.map((row, i) => (
          <div key={i} className="grid grid-cols-2 border-b border-line last:border-b-0">
            <div className="px-5 py-4">
              <p className="text-[13px] leading-relaxed text-muted">{row.consulting}</p>
            </div>
            <div className="flex items-start gap-2.5 border-l border-line bg-surface px-5 py-4">
              <span aria-hidden="true" className="mt-1 text-accent-deep">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 8.5 6 12l7.5-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="text-[13px] font-medium leading-relaxed text-ink">{row.compass}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
