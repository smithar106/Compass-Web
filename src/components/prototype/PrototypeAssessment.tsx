"use client";

import { useState } from "react";
import { ProblemSelect } from "./ProblemSelect";
import { ContextForm } from "./ContextForm";
import { CompassDecision } from "./CompassDecision";
import { resolveDecision, type ContextAnswer } from "@/lib/prototype/recommendation";
import { problemById } from "@/data/prototype/problems";

export type PrototypeView = "select" | "context" | "decision";

type Step =
  | { kind: "select" }
  | { kind: "context"; problemId: string }
  | { kind: "decision"; problemId: string };

/**
 * Prototype assessment flow: Problem → Context → Decision.
 * Fully deterministic — the UI never calls an LLM or engine.
 *
 * Optionally starts at a specific problem (initialProblemId) and optionally
 * jumps straight to the decision (view = "decision"), so homepage cards and
 * example sections can deep-link into the experience.
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
  const resolved = resolveDecision(step.problemId, context[step.problemId] ?? []);
  if (!resolved) {
    return <MissingProblem onReset={() => setStep({ kind: "select" })} />;
  }
  return <CompassDecision resolved={resolved} onReset={() => setStep({ kind: "select" })} />;
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
