"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  DEPARTMENTS,
  PEOPLE_RANGES,
  OUTCOMES,
  TIMELINES,
  departmentByLabel,
} from "@/data/intake-taxonomy";
import { DecisionPackageView } from "@/components/analyze/DecisionPackageView";

type Stage = "intake" | "building" | "decision";

interface Selection {
  department?: string;
  problem?: string;
  people?: string;
  outcome?: string;
  timeline?: string;
}

interface AnalyzeResponse {
  analysis_id?: string;
  normalization?: any;
  decision?: any;
  status?: string;
  error?: string;
}

const BUILD_STEPS = [
  "Finding organizations that solved this...",
  "Comparing implementation paths...",
  "Building your Executive Decision Brief...",
];

const QUESTION_LABELS = [
  "Where does the problem exist?",
  "What best describes the problem?",
  "How many people are affected?",
  "What outcome matters most?",
  "When do you want to solve this?",
] as const;

export function FastIntake() {
  const [selection, setSelection] = useState<Selection>({});
  const [stage, setStage] = useState<Stage>("intake");
  const [buildStep, setBuildStep] = useState(0);
  const [decision, setDecision] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const decisionRef = useRef<HTMLDivElement>(null);

  const dept = useMemo(() => (selection.department ? departmentByLabel(selection.department) : undefined), [selection.department]);
  const activeProblems = dept?.problems ?? [];

  const answeredCount = [
    selection.department,
    selection.problem,
    selection.people,
    selection.outcome,
    selection.timeline,
  ].filter(Boolean).length;

  const complete = answeredCount === 5;

  // Sequential build messages once we submit.
  useEffect(() => {
    if (stage !== "building") return;
    const timers = BUILD_STEPS.map((_, i) => setTimeout(() => setBuildStep(i + 1), 700 + i * 900));
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  useEffect(() => {
    if (stage === "decision" && decisionRef.current) {
      decisionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [stage, decision]);

  const choose = (key: keyof Selection, value: string) => {
    setSelection((s) => {
      const next = { ...s, [key]: value };
      // Choosing a new department clears the problem selection.
      if (key === "department") next.problem = undefined;
      return next;
    });
  };

  const submit = async () => {
    if (!complete) return;
    setStage("building");
    setBuildStep(0);
    setError(null);
    setDecision(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "intake", ...selection }),
      });
      const data = (await res.json()) as AnalyzeResponse;
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setDecision(data);
      setStage("decision");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
      setStage("intake");
    }
  };

  const startOver = () => {
    setSelection({});
    setDecision(null);
    setStage("intake");
    setError(null);
  };

  if (stage === "decision" && decision?.decision) {
    return (
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-28 sm:px-8 lg:pt-32" ref={decisionRef}>
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted transition-colors hover:text-ink">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M14 8H3M7 3 2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Home
        </Link>

        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">Your Executive Decision Brief</p>
          <h1 className="mt-2 text-title font-semibold tracking-tight text-ink">Make the right decision, defensibly.</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              selection.department,
              selection.problem,
              selection.people,
              selection.outcome,
              selection.timeline,
            ].filter(Boolean).map((v) => (
              <span key={v} className="rounded bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-ink">
                {v}
              </span>
            ))}
          </div>
        </div>

        <DecisionPackageView
          recs={decision.decision.recommendations || []}
          meta={decision.decision.methodology}
          summary={decision.decision.assessment_summary}
          status={decision.status}
          recommendationId={decision.decision.recommendation_id}
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <button type="button" onClick={startOver} className="text-[13px] font-semibold text-muted transition-colors hover:text-ink">
            Start a new analysis
          </button>
          <Link href="/how-it-works" className="text-[13px] font-semibold text-accent-deep transition-colors hover:text-ink">
            See how it works →
          </Link>
        </div>
        {decision.analysis_id && (
          <div className="mt-3">
            <Link
              href={`/decisions/${decision.analysis_id}`}
              className="text-[12px] font-semibold text-accent-deep underline underline-offset-2 transition-colors hover:text-ink"
            >
              Open permanent decision link →
            </Link>
            <span className="ml-2 text-[11.5px] text-faint">This decision stays live at /decisions/{decision.analysis_id}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-28">
      <div className="mx-auto max-w-3xl px-5 pt-28 sm:px-8 lg:pt-32">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted transition-colors hover:text-ink">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M14 8H3M7 3 2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Home
        </Link>

        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">Analyze an Operational Problem</p>
          <h1 className="mt-2 text-title font-semibold tracking-tight text-ink">
            {selection.department && selection.problem
              ? `${selection.department} · ${selection.problem}`
              : "Five quick decisions. A defensible answer."}
          </h1>
          <p className="mt-2 text-[13.5px] text-muted">
            {complete && "You're ready. Get your Executive Decision Brief."}
          </p>
        </div>

        {/* progress */}
        <div className="mb-8 flex items-center gap-2" aria-hidden="true">
          {QUESTION_LABELS.map((_, i) => (
            <span
              key={i}
              className={cn("h-1 flex-1 rounded-full transition-colors", i < answeredCount ? "bg-ink" : "bg-line")}
            />
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-risk/30 bg-risk-soft px-4 py-3 text-[13px] text-[#7a1f1a]">
            {error}
          </div>
        )}

        {stage === "building" ? (
          <BuildProgress step={buildStep} />
        ) : (
          <div className="space-y-8">
            {/* Q1 — department */}
            <QuestionBlock
              index="1"
              label={QUESTION_LABELS[0]}
              answered={Boolean(selection.department)}
              onClear={selection.department ? () => setSelection((s) => ({ ...s, department: undefined, problem: undefined })) : undefined}
            >
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {DEPARTMENTS.map((d) => (
                  <ChoiceButton
                    key={d.label}
                    active={selection.department === d.label}
                    onClick={() => choose("department", d.label)}
                  >
                    {d.label}
                  </ChoiceButton>
                ))}
              </div>
            </QuestionBlock>

            {/* Q2 — problem (dynamic) */}
            <QuestionBlock
              index="2"
              label={QUESTION_LABELS[1]}
              answered={Boolean(selection.problem)}
              hint={selection.department ? undefined : "Choose a department first"}
              onClear={selection.problem ? () => setSelection((s) => ({ ...s, problem: undefined })) : undefined}
            >
              {selection.department ? (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {activeProblems.map((p) => (
                    <ChoiceButton
                      key={p.label}
                      active={selection.problem === p.label}
                      onClick={() => choose("problem", p.label)}
                      alignLeft
                    >
                      {p.label}
                    </ChoiceButton>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-line bg-surface/50 px-5 py-8 text-center">
                  <p className="text-[13px] text-muted">Select a department above to see its top operational problems.</p>
                </div>
              )}
            </QuestionBlock>

            {/* Q3 — people */}
            <QuestionBlock
              index="3"
              label={QUESTION_LABELS[2]}
              answered={Boolean(selection.people)}
              onClear={selection.people ? () => setSelection((s) => ({ ...s, people: undefined })) : undefined}
            >
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {PEOPLE_RANGES.map((r) => (
                  <ChoiceButton
                    key={r}
                    active={selection.people === r}
                    onClick={() => choose("people", r)}
                    alignLeft
                  >
                    {r}
                  </ChoiceButton>
                ))}
              </div>
            </QuestionBlock>

            {/* Q4 — outcome */}
            <QuestionBlock
              index="4"
              label={QUESTION_LABELS[3]}
              answered={Boolean(selection.outcome)}
              onClear={selection.outcome ? () => setSelection((s) => ({ ...s, outcome: undefined })) : undefined}
            >
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {OUTCOMES.map((o) => (
                  <ChoiceButton
                    key={o.label}
                    active={selection.outcome === o.label}
                    onClick={() => choose("outcome", o.label)}
                    alignLeft
                  >
                    {o.label}
                  </ChoiceButton>
                ))}
              </div>
            </QuestionBlock>

            {/* Q5 — timeline */}
            <QuestionBlock
              index="5"
              label={QUESTION_LABELS[4]}
              answered={Boolean(selection.timeline)}
              onClear={selection.timeline ? () => setSelection((s) => ({ ...s, timeline: undefined })) : undefined}
            >
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {TIMELINES.map((t) => (
                  <ChoiceButton
                    key={t}
                    active={selection.timeline === t}
                    onClick={() => choose("timeline", t)}
                    alignLeft
                  >
                    {t}
                  </ChoiceButton>
                ))}
              </div>
            </QuestionBlock>
          </div>
        )}

        {/* live summary + CTA */}
        <div className="sticky bottom-4 mt-10">
          <div className="rounded-xl border border-line bg-surface shadow-panel-lg">
            <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-5">
              {(["department", "problem", "people", "outcome", "timeline"] as const).map((key) => (
                <div key={key} className="bg-surface px-4 py-2.5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-faint">{key}</p>
                  <p className={cn("mt-0.5 truncate text-[12.5px] font-semibold", selection[key] ? "text-ink" : "text-faint")}>
                    {selection[key] || "—"}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 border-t border-line px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[12px] text-muted">
                {complete ? "Compass has everything it needs." : `${5 - answeredCount} selection${5 - answeredCount === 1 ? "" : "s"} remaining.`}
              </p>
              <button
                type="button"
                onClick={submit}
                disabled={!complete}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 px-7 py-3.5 text-[15px] font-semibold transition-colors sm:w-auto",
                  complete ? "bg-ink text-paper hover:bg-ink2" : "cursor-not-allowed bg-line text-faint"
                )}
              >
                Get My Recommendation
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* advanced route */}
        <div className="mt-6 text-center">
          <Link
            href="/analyze/advanced"
            className="text-[12px] font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
          >
            Can&rsquo;t find your problem? Describe it instead →
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuestionBlock({
  index,
  label,
  answered,
  hint,
  onClear,
  children,
}: {
  index: string;
  label: string;
  answered: boolean;
  hint?: string;
  onClear?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
              answered ? "border-transparent bg-ink text-accent" : "border-line bg-surface text-faint"
            )}
          >
            {index}
          </span>
          <h2 className="text-[17px] font-semibold tracking-tight text-ink">{label}</h2>
        </div>
        {answered && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] font-semibold text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
          >
            Change
          </button>
        )}
      </div>
      {hint && <p className="mt-2 pl-10 text-[12px] text-faint">{hint}</p>}
      <div className="mt-3 pl-0 sm:pl-10">{children}</div>
    </section>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
  alignLeft,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  alignLeft?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex min-h-[52px] items-center justify-center border px-4 py-3 text-[14px] font-medium transition-colors",
        alignLeft ? "justify-start text-left" : "text-center",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line bg-surface text-ink hover:border-ink/40 hover:bg-surface"
      )}
    >
      {children}
    </button>
  );
}

function BuildProgress({ step }: { step: number }) {
  return (
    <div className="rounded-xl border border-line bg-ink px-6 py-10 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50">
        Building your decision
      </p>
      <ul className="mx-auto mt-6 max-w-sm space-y-4">
        {BUILD_STEPS.map((label, i) => {
          const done = step > i;
          const active = step === i;
          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-3 text-[14.5px] transition-opacity duration-300",
                done || active ? "opacity-100" : "opacity-30"
              )}
            >
              {done ? (
                <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-ink">
                  ✓
                </span>
              ) : active ? (
                <span aria-hidden="true" className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-paper/25 border-t-accent" />
              ) : (
                <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-full border border-paper/25" />
              )}
              <span className={done ? "text-paper" : active ? "text-accent" : "text-paper/60"}>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
