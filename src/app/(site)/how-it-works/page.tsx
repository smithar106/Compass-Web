import { DecisionTree } from "@/components/home/DecisionTree";
import { Reveal } from "@/components/home/Reveal";
import { FinalCta } from "@/components/home/FinalCta";

const LAYERS = [
  {
    num: "01",
    name: "Decide",
    color: "#8B6914",
    summary: "A company brings Compass a business problem, not a predetermined technology request. Compass assesses the workflow, constraints, economics, risk, and desired outcome — then compares AI, automation, software, process redesign, staffing, and hybrid approaches on the same evidence.",
    produces: "Executive Decision Brief — what to do, why, what it costs, expected value, evidence, and assumptions.",
  },
  {
    num: "02",
    name: "Execute",
    color: "#1E40AF",
    summary: "Once leadership approves, Compass determines the execution path. The decision is locked before any execution path is selected.",
    paths: [
      { title: "Your Team", detail: "Full implementation plan and success criteria — your team executes" },
      { title: "Implementation Partner", detail: "A qualified partner you select to execute the approved decision" },
    ],
  },
  {
    num: "03",
    name: "Measure",
    color: "#14532D",
    summary: "Regardless of who implements it, Compass stays. The Command Center retains the approved decision, expected economics, KPIs, milestones, risks, and actual outcomes.",
    produces: "Expected vs. actual comparison, outcome documentation, and the basis for future recommendations.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <DecisionTree />

      {/* Three layers */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-5xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
          <Reveal>
            <h2 className="text-section font-semibold tracking-tight text-ink text-center">
              Three layers. One system.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-center text-lead leading-relaxed text-muted">
              Compass owns the decision and the measurement. Execution flows through Compass, a verified partner, or your team — and the recommendation is identical regardless.
            </p>
          </Reveal>

          <div className="mt-14 space-y-16">
            {LAYERS.map((layer, i) => (
              <Reveal key={layer.name} delay={i * 100}>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[120px_1fr]">
                  <div className="lg:pt-1">
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold text-white"
                      style={{ backgroundColor: layer.color }}
                    >
                      {layer.num}
                    </span>
                    <h3
                      className="mt-3 text-[20px] font-semibold tracking-tight"
                      style={{ color: layer.color }}
                    >
                      {layer.name}
                    </h3>
                  </div>
                  <div>
                    <p className="text-[14px] leading-relaxed text-muted">{layer.summary}</p>
                    {layer.produces && (
                      <div className="mt-4 rounded-lg border border-line bg-surface px-4 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Produces</p>
                        <p className="mt-1 text-[13px] leading-snug text-ink">{layer.produces}</p>
                      </div>
                    )}
                    {layer.paths && (
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {layer.paths.map((path) => (
                          <div
                            key={path.title}
                            className="rounded-lg border border-line px-4 py-3"
                            style={{ borderLeft: `3px solid ${layer.color}` }}
                          >
                            <p className="text-[13px] font-semibold text-ink">{path.title}</p>
                            <p className="mt-0.5 text-[12px] leading-snug text-muted">{path.detail}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-5xl px-5 py-section sm:px-8 lg:px-10 lg:py-section text-center">
          <Reveal>
            <h2 className="text-section font-semibold tracking-tight text-ink">
              Evidence and economics determine the recommendation. Not commercial interests.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lead leading-relaxed text-muted">
              The decision engine produces a locked recommendation based on evidence,
              economics, and suitability — before any execution path is considered.
            </p>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}