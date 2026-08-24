"use client";

import Link from "next/link";
import type { ResolvedDecision } from "@/lib/prototype/recommendation";
import type { ImplementationPhase } from "@/types/prototype";
import { ArrowIcon, Needle } from "@/components/home/primitives";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, { label: string; tone: string }> = {
  defensible: { label: "Defensible", tone: "bg-ok-soft text-[#14532d]" },
  directionally_supported: { label: "Directionally supported", tone: "bg-brand-blue-light text-[#1e40af]" },
  needs_more_evidence: { label: "Needs more evidence", tone: "bg-warn-soft text-[#7a3b06]" },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-bold uppercase tracking-eyebrow text-accent-deep">
      {children}
    </h2>
  );
}

function PhaseRow({ phase, index }: { phase: ImplementationPhase; index: number }) {
  return (
    <div className="flex gap-4 border border-line bg-surface px-4 py-4">
      <div className="flex flex-col items-center">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[11px] font-bold text-paper">
          {index + 1}
        </span>
        {index < 3 && <span aria-hidden="true" className="mt-1 h-full w-px bg-line" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[14px] font-semibold text-ink">{phase.phase}</p>
          <span className="rounded-full bg-paper px-2 py-0.5 text-[10px] font-semibold text-faint">
            {phase.timeline}
          </span>
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">{phase.summary}</p>
      </div>
    </div>
  );
}

/**
 * Screen 3 — the Compass Decision.
 *
 * A five-section executive brief: Recommendation, Reasons for recommendation,
 * Impact, Implementation guidelines, Next steps. Impact is stated with clear
 * numbers ("78% reduction in processing time"). No evidence mechanics — no
 * evidence counts, tiers, comparable-implementation language, or provenance —
 * appear on the page.
 */
export function CompassDecision({
  resolved,
  onReset,
}: {
  resolved: ResolvedDecision;
  onReset: () => void;
}) {
  const { decision, tuning } = resolved;
  const status = STATUS_LABEL[decision.decisionStatus] ?? STATUS_LABEL.defensible;

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span> Back
        </button>
        <p className="text-[10.5px] font-bold uppercase tracking-eyebrow text-muted">
          Decision brief
        </p>
      </div>

      {/* Header */}
      <div className="mt-8 border border-line bg-paper px-6 py-7 sm:px-8">
        <div className="flex items-center gap-2.5">
          <Needle className="h-5 w-5 text-ink" />
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">
            Compass Decision
          </p>
        </div>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-muted">
          {decision.category}
        </p>
        <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-ink sm:text-[30px]">
          {decision.problem}
        </h1>
        <div className="mt-5">
          <span className={cn("rounded-full px-3 py-1 text-[11.5px] font-bold", status.tone)}>
            {status.label}
          </span>
        </div>
      </div>

      {/* 1. Recommendation */}
      <div className="mt-4 border border-ink bg-ink px-6 py-6 sm:px-8">
        <SectionTitle>
          <span className="text-accent">1 · Recommendation</span>
        </SectionTitle>
        <p className="mt-2 text-[20px] font-semibold leading-snug tracking-tight text-paper sm:text-[22px]">
          {decision.recommendation}
        </p>
        {decision.techStack.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-2.5 border-t border-paper/15 pt-5 sm:grid-cols-2">
            {decision.techStack.map((item) => (
              <div key={item.role} className="flex items-baseline gap-2">
                <span className="text-[10.5px] font-bold uppercase tracking-wide text-paper/50">
                  {item.role}
                </span>
                <span className="text-[13.5px] font-semibold text-paper">{item.tool}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Reasons for recommendation */}
      {decision.whyThis.length > 0 && (
        <section className="mt-10">
          <SectionTitle>2 · Reasons for recommendation</SectionTitle>
          <ul className="mt-4 flex flex-col gap-3">
            {decision.whyThis.map((reason) => (
              <li key={reason} className="flex gap-3 border border-line bg-surface px-5 py-4">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-deep" />
                <p className="text-[13.5px] leading-relaxed text-ink">{reason}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 3. Impact */}
      <section className="mt-10">
        <SectionTitle>3 · Impact</SectionTitle>
        {decision.impactMetrics.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {decision.impactMetrics.map((metric) => (
              <div key={metric.label} className="border border-line bg-surface px-5 py-5">
                <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
                  {metric.label}
                </p>
                <p className="mt-1 text-[19px] font-bold tracking-tight text-ink">
                  {metric.value}
                </p>
                {metric.detail && (
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{metric.detail}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 border border-line bg-surface px-5 py-5 text-[13.5px] leading-relaxed text-ink">
            {decision.expectedImpact}
          </p>
        )}
      </section>

      {/* 4. Implementation guidelines */}
      <section className="mt-10">
        <SectionTitle>4 · Implementation guidelines</SectionTitle>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="border border-line bg-surface px-5 py-4">
            <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Effort</p>
            <p className="mt-1 text-[14px] font-semibold text-ink">{decision.implementationEffort}</p>
          </div>
          <div className="border border-line bg-surface px-5 py-4">
            <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
              Indicative timeline
            </p>
            <p className="mt-1 text-[14px] font-semibold text-ink">
              {tuning.timeline ?? decision.timeline}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {decision.implementationPlan.map((phase, i) => (
            <PhaseRow key={phase.phase} phase={phase} index={i} />
          ))}
        </div>

        {decision.risks.length > 0 && (
          <div className="mt-6 border border-line bg-surface px-6 py-5">
            <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Key risks</p>
            <ul className="mt-3 flex flex-col gap-3">
              {decision.risks.map((risk) => (
                <li key={risk.title} className="text-[13px] leading-relaxed text-ink">
                  <span className="font-semibold">{risk.title}.</span>{" "}
                  {risk.detail}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 5. Next steps */}
      <section className="mt-10">
        <SectionTitle>5 · Next steps</SectionTitle>
        <div className="mt-4 border border-line bg-surface px-6 py-6 sm:px-7">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Baseline</p>
              <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-ink">
                {decision.measurement.baseline}
              </p>
            </div>
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
                Primary KPI
              </p>
              <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-ink">
                {decision.measurement.primaryKpi}
              </p>
            </div>
          </div>
          <p className="mt-6 text-[10.5px] font-bold uppercase tracking-wide text-muted">
            30 / 60 / 90-day validation
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {decision.measurement.validationPoints.map((point) => (
              <div key={point.at} className="flex items-start gap-3">
                <span className="w-12 shrink-0 rounded bg-accent-soft px-2 py-1 text-center font-mono text-[11px] font-bold text-accent-deep">
                  {point.at}
                </span>
                <p className="text-[13px] leading-relaxed text-muted">{point.check}</p>
              </div>
            ))}
          </div>

          {decision.whatWouldChangeThis.length > 0 && (
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
                What would change this decision
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {decision.whatWouldChangeThis.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-muted">
                    <span aria-hidden="true" className="mt-1 text-faint">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <div className="mt-12 border-t border-line pt-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="max-w-md text-[13px] leading-relaxed text-muted">
            This decision is generated from Compass evidence. Your organization&apos;s full
            assessment adds your specific context.
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Link
              href="/prototype"
              className="inline-flex items-center justify-center gap-2 border border-line bg-surface px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:border-ink/40"
            >
              Another problem
            </Link>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-paper transition-colors hover:bg-ink2"
            >
              Analyze my problem
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
