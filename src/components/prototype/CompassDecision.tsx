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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-surface px-4 py-3.5">
      <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-[13.5px] font-semibold text-ink">{value}</p>
    </div>
  );
}

function SectionTitle({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-[11px] font-bold text-accent-deep"
      >
        {number}
      </span>
      <h2 className="text-[16px] font-semibold tracking-tight text-ink">{children}</h2>
    </div>
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
        {phase.dependencies.length > 0 && (
          <p className="mt-2 text-[11.5px] text-faint">
            <span className="font-semibold text-muted">Prerequisites:</span>{" "}
            {phase.dependencies.join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Screen 3 — the Compass Decision, written as a board-ready brief.
 *
 * Every section reads as a confident, declarative statement. The tool's
 * mechanics — evidence counts, tiers, provenance, scoring — are intentionally
 * absent from the page. What remains is what a CEO can present in a room:
 * the problem, the strategy, what has worked elsewhere, the impact, and why
 * this path was chosen.
 */
export function CompassDecision({
  resolved,
  onReset,
  source,
}: {
  resolved: ResolvedDecision;
  onReset: () => void;
  source?: "live" | "curated";
}) {
  const { decision, tuning, problem } = resolved;
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
          {problem.category}
        </p>
        <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-ink sm:text-[30px]">
          {decision.problem}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full px-3 py-1 text-[11.5px] font-bold", status.tone)}>
            {status.label}
          </span>
          {source === "live" && (
            <span className="rounded-full bg-ok-soft px-3 py-1 text-[11px] font-bold text-[#14532d]">
              Based on live comparable evidence
            </span>
          )}
        </div>
      </div>

      {/* Recommendation + strategy */}
      <div className="mt-4 border border-ink bg-ink px-6 py-6 sm:px-8">
        <p className="text-[10.5px] font-bold uppercase tracking-eyebrow text-accent">
          Recommended intervention
        </p>
        <p className="mt-2 text-[20px] font-semibold leading-snug tracking-tight text-paper sm:text-[22px]">
          {decision.recommendation}
        </p>
        <p className="mt-3 text-[14.5px] leading-relaxed text-paper/85">{decision.strategy}</p>
      </div>

      {/* The decision in one paragraph */}
      <div className="mt-4 border border-line bg-surface px-6 py-6 sm:px-8">
        <p className="text-[10.5px] font-bold uppercase tracking-eyebrow text-accent-deep">
          The decision in one paragraph
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink">{decision.decisionSummary}</p>
      </div>

      {/* Key facts */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Fact label="Expected impact" value={decision.expectedImpact} />
        <Fact label="Implementation effort" value={decision.implementationEffort} />
        <Fact label="Indicative timeline" value={tuning.timeline ?? decision.timeline} />
      </div>

      {/* 1. The strategy */}
      <section className="mt-10">
        <SectionTitle number="1">The strategy</SectionTitle>
        <div className="mt-4 border border-line bg-surface px-6 py-6 sm:px-7">
          <p className="text-[15px] font-semibold leading-relaxed text-ink">{decision.strategy}</p>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
            {decision.description} {decision.recommendation}. This path addresses the root cause
            directly and is the strongest option we evaluated.
          </p>
        </div>
      </section>

      {/* 2. Why this works */}
      <section className="mt-10">
        <SectionTitle number="2">Why this works</SectionTitle>
        <ul className="mt-4 flex flex-col gap-3">
          {decision.whyThis.map((reason) => (
            <li key={reason} className="flex gap-3 border border-line bg-surface px-5 py-4">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-deep" />
              <p className="text-[13.5px] leading-relaxed text-ink">{reason}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. What this delivers */}
      <section className="mt-10">
        <SectionTitle number="3">What this delivers</SectionTitle>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {decision.impactMetrics.map((metric) => (
            <div key={metric.label} className="border border-line bg-surface px-5 py-4">
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
                {metric.label}
              </p>
              <p className="mt-1 text-[18px] font-bold tracking-tight text-ink">{metric.value}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{metric.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. What has worked elsewhere */}
      <section className="mt-10">
        <SectionTitle number="4">What has worked elsewhere</SectionTitle>
        <div className="mt-4 flex flex-col gap-3">
          {decision.comparableExamples.map((example) => (
            <div key={example.statement} className="border border-line bg-surface px-6 py-5">
              <p className="text-[14px] leading-relaxed text-ink">{example.statement}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Why we chose this instead */}
      <section className="mt-10">
        <SectionTitle number="5">Why we chose this instead</SectionTitle>
        <div className="mt-4 flex flex-col gap-3">
          {decision.alternatives.map((alt) => (
            <div key={alt.name} className="border border-line bg-surface px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[14px] font-semibold text-ink">{alt.name}</p>
                <span className="rounded-full bg-paper px-2.5 py-0.5 text-[11px] font-bold text-muted">
                  Not selected
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink">
                <span className="font-semibold">Why we chose the recommendation instead:</span>{" "}
                {alt.whyRankedLower}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Implementation path */}
      <section className="mt-10">
        <SectionTitle number="6">Implementation path</SectionTitle>
        <div className="mt-4 flex flex-col gap-3">
          {decision.implementationPlan.map((phase, i) => (
            <PhaseRow key={phase.phase} phase={phase} index={i} />
          ))}
        </div>
      </section>

      {/* 7. Risks / constraints */}
      <section className="mt-10">
        <SectionTitle number="7">Risks / constraints</SectionTitle>
        <div className="mt-4 flex flex-col gap-3">
          {decision.risks.map((risk) => (
            <div key={risk.title} className="border border-line bg-surface px-5 py-4">
              <p className="text-[13.5px] font-semibold text-ink">{risk.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{risk.detail}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">
                <span className="font-semibold text-ink">Mitigation:</span> {risk.mitigation}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Measurement plan */}
      <section className="mt-10">
        <SectionTitle number="8">Measurement plan</SectionTitle>
        <div className="mt-4 border border-line bg-surface px-6 py-6 sm:px-7">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Baseline</p>
              <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-ink">
                {decision.measurement.baseline}
              </p>
            </div>
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Primary KPI</p>
              <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-ink">
                {decision.measurement.primaryKpi}
              </p>
            </div>
          </div>
          <p className="mt-6 text-[10.5px] font-bold uppercase tracking-wide text-muted">
            Secondary KPIs
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {decision.measurement.secondaryKpis.map((kpi) => (
              <li
                key={kpi}
                className="rounded-full bg-paper px-3 py-1 text-[12px] font-medium text-ink"
              >
                {kpi}
              </li>
            ))}
          </ul>
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
        </div>
      </section>

      {/* 9. What would change this decision */}
      <section className="mt-10">
        <SectionTitle number="9">What would change this decision?</SectionTitle>
        <div className="mt-4 border border-line bg-surface px-6 py-6 sm:px-7">
          <p className="text-[13.5px] leading-relaxed text-muted">
            This recommendation is right under the conditions we assessed. It changes if:
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {decision.whatWouldChangeThis.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 text-accent-deep">•</span>
                <p className="text-[13px] leading-relaxed text-ink">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer CTA */}
      <div className="mt-12 border-t border-line pt-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="max-w-md text-[13px] leading-relaxed text-muted">
            {source === "live"
              ? "This decision is based on comparable implementation evidence. Your organization\u2019s full assessment adds your specific context."
              : "This is a prototype demonstration brief. A recommendation based on your organization\u2019s actual inputs comes from the full assessment."}
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
