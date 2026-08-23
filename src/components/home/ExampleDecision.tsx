import Link from "next/link";
import { decisionById } from "@/data/prototype/decisions";
import { SectionHeader, ArrowIcon } from "./primitives";
import { Reveal } from "./Reveal";

const STATUS_LABEL: Record<string, string> = {
  defensible: "Defensible",
  directionally_supported: "Directionally supported",
  needs_more_evidence: "Needs more evidence",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-b-0">
      <dt className="text-[12.5px] font-medium text-muted">{label}</dt>
      <dd className="text-right text-[13.5px] font-semibold text-ink">{value}</dd>
    </div>
  );
}

/**
 * Section 4 — One strong example decision (slow customer onboarding), with a
 * compact decision card linking to the same recommendation experience used by
 * the assessment prototype.
 */
export function ExampleDecision() {
  const decision = decisionById("slow-customer-onboarding");
  if (!decision) return null;

  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader
          eyebrow="Example decision"
          headline="See what a Compass decision looks like."
          subtitle="One real operational problem, evaluated the way Compass evaluates every problem."
          align="center"
        />

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Problem → intervention */}
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col justify-between border border-line bg-paper px-7 py-8">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-eyebrow text-accent-deep">
                  Problem
                </p>
                <h3 className="mt-3 text-[22px] font-semibold leading-tight tracking-tight text-ink">
                  {decision.problem}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
                  {decision.description}
                </p>
              </div>
              <div className="mt-8 border-t border-line pt-6">
                <p className="text-[10.5px] font-bold uppercase tracking-eyebrow text-accent-deep">
                  Recommended intervention
                </p>
                <p className="mt-2 text-[17px] font-semibold leading-snug tracking-tight text-ink">
                  {decision.recommendation}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Decision card */}
          <Reveal delay={120} className="lg:col-span-3">
            <div className="flex h-full flex-col border border-line bg-surface shadow-panel">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper/70 px-7 py-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
                  Compass Decision
                </span>
                <span className="rounded-full bg-ok-soft px-2.5 py-0.5 text-[10.5px] font-bold text-[#14532d]">
                  {STATUS_LABEL[decision.decisionStatus]}
                </span>
              </div>

              <dl className="grid flex-1 grid-cols-1 gap-x-8 px-7 py-2 sm:grid-cols-2">
                <Row label="Expected impact" value={decision.expectedImpact} />
                <Row label="Implementation effort" value={decision.implementationEffort} />
                <Row label="Indicative timeline" value={decision.timeline} />
                <Row label="Strategy" value={decision.strategy} />
              </dl>

              <div className="border-t border-line px-7 py-5">
                <Link
                  href="/prototype/slow-customer-onboarding?view=decision"
                  className="group inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2"
                >
                  View the Decision
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
