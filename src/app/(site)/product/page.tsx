import { PageHeader } from "@/components/home/PageHeader";
import { Lifecycle } from "@/components/home/Lifecycle";
import { Anatomy } from "@/components/home/Anatomy";
import { Operations } from "@/components/home/Operations";
import { Differentiation } from "@/components/home/Differentiation";
import { SearchRecommendations } from "@/components/home/SearchRecommendations";
import { FinalCta } from "@/components/home/FinalCta";
import { Reveal } from "@/components/home/Reveal";

const C = {
  gold: "#8B6914",
  teal: "#0A5C55",
  blue: "#1E40AF",
  green: "#14532D",
  silver: "#4A5568",
};

const DECIDE = [
  "Operational problem definition",
  "Evidence collection and comparability analysis",
  "Intervention comparison across AI, automation, software, process redesign, staffing, and hybrid approaches",
  "Executive Decision Brief with rationale, economics, evidence, and alternatives",
  "Scored comparison of rejected interventions",
  "Success metrics and assumptions stated before implementation begins",
];

const EXECUTE_PATHS = [
  {
    title: "Your Team",
    subtitle: "Full implementation plan and success criteria — your team executes",
    color: C.silver,
  },
  {
    title: "Implementation Partner",
    subtitle: "A qualified partner you select to execute the approved decision",
    color: C.blue,
  },
];

const MEASURE = [
  "Approved decision and original economics",
  "Implementation cost vs. estimate",
  "KPIs tracked against baseline",
  "Milestone completion",
  "Risk status and blockers",
  "Expected vs. actual business value",
  "Outcome documentation",
];

export default function ProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="Product"
        title={<>A decision system, not a consulting engagement.</>}
        subtitle="Compass is the persistent judgment layer for operational decisions. It defines the problem, compares every viable intervention against structured evidence, produces the Executive Decision Brief&mdash;then stays to measure whether it worked."
      />

      {/* Decide → Execute → Measure (3 Layers) */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                The Three-Layer Architecture
              </p>
              <h2 className="mt-3 text-[28px] md:text-[34px] font-semibold tracking-tight text-ink">
                Decision Intelligence. Implementation Intelligence. Outcome Intelligence.
              </h2>
              <p className="mt-4 text-lead leading-relaxed text-muted">
                The Decision Brief is how we land. The decision-to-outcome dataset is how we compound.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Layer 1 */}
            <Reveal delay={0}>
              <div className="flex h-full flex-col border border-line bg-surface p-8" style={{ borderTop: `3px solid ${C.gold}` }}>
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ backgroundColor: C.gold }}
                  >
                    01
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold">The Wedge</span>
                </div>
                <h3 className="text-[20px] font-semibold text-ink mb-1">Decision Intelligence</h3>
                <p className="text-[14px] font-medium text-accent-deep mb-3">Decide what to do.</p>
                <p className="mb-6 text-[13.5px] leading-relaxed text-muted">
                  A COO gives Compass a business problem—not an AI use case or vendor shortlist. Compass searches and reasons across 50,000+ implementations, combines evidence with economics, and compares interventions across AI, automation, software, process redesign, and staffing.
                </p>
                <ul className="space-y-2.5 mt-auto border-t border-line pt-4">
                  {DECIDE.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-ink">
                      <span
                        aria-hidden="true"
                        className="mt-[6px] h-1 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: C.gold }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Layer 2 */}
            <Reveal delay={100}>
              <div className="flex h-full flex-col border border-line bg-surface p-8" style={{ borderTop: `3px solid ${C.blue}` }}>
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ backgroundColor: C.blue }}
                  >
                    02
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">Execution</span>
                </div>
                <h3 className="text-[20px] font-semibold text-ink mb-1">Implementation Intelligence</h3>
                <p className="text-[14px] font-medium text-blue-700 mb-3">Make sure the decision gets delivered.</p>
                <p className="mb-6 text-[13.5px] leading-relaxed text-muted">
                  Once approved, the decision becomes the baseline (expected cost, value, timeline, success criteria, assumptions). Compass follows execution—not tracking tasks like Jira, but checking whether the original decision is still making economic sense.
                </p>
                <ul className="space-y-2.5 mt-auto border-t border-line pt-4">
                  {[
                    "Approved business case as baseline",
                    "Timeline and milestone monitoring",
                    "Expected vs actual economic tracking",
                    "Assumption drift and risk alerts",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-ink">
                      <span
                        aria-hidden="true"
                        className="mt-[6px] h-1 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: C.blue }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Layer 3 */}
            <Reveal delay={200}>
              <div className="flex h-full flex-col border border-line bg-surface p-8" style={{ borderTop: `3px solid ${C.green}` }}>
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ backgroundColor: C.green }}
                  >
                    03
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-700">The Moat</span>
                </div>
                <h3 className="text-[20px] font-semibold text-ink mb-1">Outcome Intelligence</h3>
                <p className="text-[14px] font-medium text-green-700 mb-3">Learn what actually works.</p>
                <p className="mb-6 text-[13.5px] leading-relaxed text-muted">
                  The flywheel closes: Problem → Context → Decision → Implementation → Outcome. Verified results feed back into the evidence library, creating proprietary first-party evidence that public web scraping and general AI cannot replicate.
                </p>
                <ul className="space-y-2.5 mt-auto border-t border-line pt-4">
                  {MEASURE.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-ink">
                      <span
                        aria-hidden="true"
                        className="mt-[6px] h-1 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: C.green }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Lifecycle />
      <Anatomy />
      <Operations />
      <Differentiation />
      <SearchRecommendations />
      <FinalCta />
    </>
  );
}