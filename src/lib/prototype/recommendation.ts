/**
 * Compass Decision prototype — deterministic recommendation layer.
 *
 * Pure functions that resolve a decision from a problem id and optional
 * context answers. No LLM, no API, no runtime generation. The layer is
 * intentionally thin so a live evidence/retrieval/ranking engine can replace
 * it later without touching the UI or the decision schema.
 */

import { PROBLEM_LIBRARY, type PrototypeProblem } from "@/data/prototype/problems";
import { DECISION_LIBRARY, decisionForProblem } from "@/data/prototype/decisions";
import type { PrototypeDecision } from "@/types/prototype";

export interface ContextAnswer {
  questionId: string;
  value: string;
}

export interface ResolvedDecision {
  problem: PrototypeProblem;
  decision: PrototypeDecision;
  /** Deterministic tuning applied from context answers (illustrative). */
  tuning: {
    timeline?: string;
    expectedImpact?: string;
    note: string;
  };
}

/**
 * Resolve a decision for a problem. Deterministic: the same problem and
 * context answers always produce the same result.
 */
export function resolveDecision(
  problemId: string,
  answers: ContextAnswer[] = []
): ResolvedDecision | null {
  const problem = PROBLEM_LIBRARY.find((p) => p.id === problemId);
  const decision = decisionForProblem(problemId);
  if (!problem || !decision) return null;

  return {
    problem,
    decision,
    tuning: tune(decision, answers),
  };
}

/**
 * Context-aware, deterministic tuning. Answers scale the illustrative
 * timeline/impact expectations so the demo responds to the user, but every
 * adjusted value is still labeled illustrative and never claimed as real.
 */
function tune(
  decision: PrototypeDecision,
  answers: ContextAnswer[]
): ResolvedDecision["tuning"] {
  const answerFor = (id: string) => answers.find((a) => a.questionId === id)?.value;

  const orgSize = answerFor("org-size");
  const volume = answerFor("volume");
  const invoiceVolume = answerFor("invoice-volume");
  const ticketVolume = answerFor("ticket-volume");
  const volumeValue = volume ?? invoiceVolume ?? ticketVolume;

  let timeline = decision.timeline;
  let expectedImpact = decision.expectedImpact;

  // Larger organizations tend to add coordination time (illustrative rule).
  if (orgSize === "500–2,000" || orgSize === "2,000+") {
    timeline = `${decision.timeline} (scaled for org size)`;
  }

  // Higher volume tends to amplify measured impact (illustrative rule).
  if (volumeValue === "500+" || volumeValue === "10,000+" || volumeValue === "5,000+") {
    expectedImpact = `${decision.expectedImpact} (high volume)`;
  }

  const note =
    orgSize || volumeValue
      ? "Illustrative scaling applied from your context; not a live analysis."
      : "Prototype recommendation with illustrative values.";

  return {
    ...(timeline !== decision.timeline ? { timeline } : {}),
    ...(expectedImpact !== decision.expectedImpact ? { expectedImpact } : {}),
    note,
  };
}

/** All 10 prototype decisions, used by lists and grids. */
export function allDecisions(): PrototypeDecision[] {
  return DECISION_LIBRARY;
}

export function allProblems(): PrototypeProblem[] {
  return PROBLEM_LIBRARY;
}
