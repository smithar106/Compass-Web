import { questions } from "./assessment-questions";
import type { AssessmentQuestion } from "@/types";

/**
 * The standalone assessment collects the minimum information needed to
 * generate a recommendation. Five existing questions, in order, each
 * mapped directly to a recommendation-engine profile field.
 */
export const STANDALONE_QUESTION_IDS = [
  "situation",
  "dept",
  "frequency",
  "desired-outcome",
  "risk",
] as const;

export const standaloneQuestions: AssessmentQuestion[] = STANDALONE_QUESTION_IDS.map((id) => {
  const q = questions.find((item) => item.id === id);
  if (!q) throw new Error(`Standalone assessment references unknown question: ${id}`);
  return q;
});

export const PROGRESS_STEPS = standaloneQuestions.length;
