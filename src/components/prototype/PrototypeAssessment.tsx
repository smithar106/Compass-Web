"use client";

import { useEffect, useState } from "react";
import { ProblemSelect } from "./ProblemSelect";
import { ContextForm } from "./ContextForm";
import { CompassDecision } from "./CompassDecision";
import { resolveDecision, type ContextAnswer } from "@/lib/prototype/recommendation";
import { problemById, type PrototypeProblem } from "@/data/prototype/problems";
import type { PrototypeDecision } from "@/types/prototype";

export type PrototypeView = "select" | "context" | "decision";

type Step =
  | { kind: "select" }
  | { kind: "context"; problemId: string }
  | { kind: "decision"; problemId: string };

/**
 * Prototype assessment flow: Problem → Context → Decision.
 *
 * The decision step resolves from the LIVE engine when available (via
 * /api/prototype/decision) and falls back to the curated deterministic
 * prototype data when the engine is unreachable or the problem is thin.
 * The UI never changes — both sources produce a PrototypeDecision.
 */
export function PrototypeAssessment({
  initialProblemId,
  view = "select",
}: {
  initialProblemId?: string;
  view?: PrototypeView;
}) {
  const initialStep: Step =
    view === "decision" && initialProblemId
      ? { kind: "decision", problemId: initialProblemId }
      : view === "context" && initialProblemId
        ? { kind: "context", problemId: initialProblemId }
        : { kind: "select" };

  const [step, setStep] = useState<Step>(initialStep);
  const [context, setContext] = useState<Record<string, ContextAnswer[]>>({});

  if (step.kind === "select") {
    return (
      <ProblemSelect
        onSelect={(problemId) => setStep({ kind: "context", problemId })}
        selectedId={null}
      />
    );
  }

  if (step.kind === "context") {
    const problem = problemById(step.problemId);
    if (!problem) {
      return <MissingProblem onReset={() => setStep({ kind: "select" })} />;
    }
    return (
      <ContextForm
        problem={problem}
        initial={context[step.problemId] ?? []}
        onBack={() => setStep({ kind: "select" })}
        onGenerate={(answers) => {
          setContext((prev) => ({ ...prev, [step.problemId]: answers }));
          setStep({ kind: "decision", problemId: step.problemId });
        }}
      />
    );
  }

  // step.kind === "decision"
  return (
    <LiveDecision
      problemId={step.problemId}
      answers={context[step.problemId] ?? []}
      onReset={() => setStep({ kind: "select" })}
    />
  );
}

function LiveDecision({
  problemId,
  answers,
  onReset,
}: {
  problemId: string;
  answers: ContextAnswer[];
  onReset: () => void;
}) {
  const problem = problemById(problemId);
  if (!problem) {
    return <MissingProblem onReset={onReset} />;
  }

  const { decision, loading } = useLiveDecision(problemId, answers);
  const fallback = resolveDecision(problemId, answers);

  const resolved = {
    problem,
    decision: decision ?? fallback?.decision ?? ({} as PrototypeDecision),
    tuning: fallback?.tuning ?? { note: "Decision generated from Compass evidence." },
  };

  return (
    <div>
      {loading && <DecisionLoading />}
      {!loading && <CompassDecision resolved={resolved} onReset={onReset} />}
    </div>
  );
}

function useLiveDecision(problemId: string, answers: ContextAnswer[]) {
  const [decision, setDecision] = useState<PrototypeDecision | null>(null);
  const [source, setSource] = useState<"live" | "curated" | "loading">("loading");

  useEffect(() => {
    let alive = true;
    setDecision(null);
    setSource("loading");
    (async () => {
      try {
        const res = await fetch("/api/prototype/decision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problemId, answers }),
        });
        const data = await res.json();
        if (!alive) return;
        if (data?.decision) {
          setDecision(data.decision);
          setSource("live");
        } else {
          setSource("curated");
        }
      } catch {
        if (alive) setSource("curated");
      }
    })();
    return () => {
      alive = false;
    };
  }, [problemId, JSON.stringify(answers)]);

  return { decision, source, loading: source === "loading" };
}

function DecisionLoading() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
      <div
        aria-hidden="true"
        className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-line border-t-ink"
      />
      <p className="mt-6 text-[14px] font-medium text-ink">Evaluating comparable evidence…</p>
      <p className="mt-2 text-[12.5px] text-muted">
        Compass is matching your problem against the evidence library.
      </p>
    </div>
  );
}

function MissingProblem({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Decision not found</h1>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-paper"
      >
        Choose a problem
      </button>
    </div>
  );
}
