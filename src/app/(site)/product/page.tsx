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
  "Counterfactual reasoning — why each rejected intervention lost",
  "Success metrics and assumptions stated before implementation begins",
];

const EXECUTE_PATHS = [
  {
    title: "Compass Deployment",
    subtitle: "Dedicated FDE implementation when AI or automation is recommended",
    color: C.teal,
  },
  {
    title: "Verified Partner",
    subtitle: "Best-fit qualified executor matched to the intervention type",
    color: C.blue,
  },
  {
    title: "Your Team",
    subtitle: "Full implementation plan and success criteria — your team executes",
    color: C.silver,
  },
];

const MEASURE = [
  "Approved decision and original economics",
  "Implementation cost vs. estimate",
  "KPIs tracked against baseline",
  "Milestone completion",
  "Risk status",
  "Expected vs. actual business value",
  "Business-case drift detection",
  "Structured outcome reviews at 3, 6, 9, and 12 months",
];

export default function ProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="Product"
        title={<>A decision system, not a consulting engagement.</>}
        subtitle="Compass is the persistent judgment layer for operational decisions. It defines the problem, compares every viable intervention against structured evidence, produces the Executive Decision Brief&mdash;then stays to measure whether it worked."
      />

      {/* Decide → Execute → Measure */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
          <Reveal>
            <h2 className="text-section font-semibold tracking-tight text-ink text-center">
              Decide. Execute. Measure.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-center text-lead leading-relaxed text-muted">
              Compass owns the decision and the measurement. Execution can be Compass, a verified
              partner, or your team — and the recommendation is the same regardless.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Decide */}
            <Reveal delay={0}>
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ backgroundColor: C.gold }}
                  >
                    01
                  </span>
                  <h3 className="text-[17px] font-semibold text-ink">Decide</h3>
                </div>
                <p className="mb-4 text-[13.5px] leading-relaxed text-muted">
                  A company brings Compass a business problem, not a predetermined technology
                  request. Compass assesses the workflow, constraints, economics, risk, and desired
                  outcome — then produces the Executive Decision Brief.
                </p>
                <ul className="space-y-2">
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

            {/* Execute */}
            <Reveal delay={100}>
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ backgroundColor: C.blue }}
                  >
                    02
                  </span>
                  <h3 className="text-[17px] font-semibold text-ink">Execute</h3>
                </div>
                <p className="mb-4 text-[13.5px] leading-relaxed text-muted">
                  Once leadership approves the decision, Compass determines the execution path.
                  Three options — and the recommendation was the same regardless of which you
                  choose.
                </p>
                <div className="space-y-3">
                  {EXECUTE_PATHS.map((path) => (
                    <div
                      key={path.title}
                      className="rounded-lg border border-line px-4 py-3"
                      style={{ borderLeft: `3px solid ${path.color}` }}
                    >
                      <p className="text-[13px] font-semibold text-ink">{path.title}</p>
                      <p className="mt-0.5 text-[12px] leading-snug text-muted">{path.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Measure */}
            <Reveal delay={200}>
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ backgroundColor: C.green }}
                  >
                    03
                  </span>
                  <h3 className="text-[17px] font-semibold text-ink">Measure</h3>
                </div>
                <p className="mb-4 text-[13.5px] leading-relaxed text-muted">
                  Regardless of who implements it, Compass stays. The Command Center retains the
                  decision, the economics, and the actual outcome — answering the executive
                  question: did this produce the value we approved it for?
                </p>
                <ul className="space-y-2">
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