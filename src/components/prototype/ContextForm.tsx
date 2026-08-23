"use client";

import { useState } from "react";
import type { PrototypeProblem } from "@/data/prototype/problems";
import type { ContextAnswer } from "@/lib/prototype/recommendation";
import { ArrowIcon } from "@/components/home/primitives";
import { cn } from "@/lib/utils";

/**
 * Screen 2 — optional context. 3 lightweight questions that deterministically
 * tune the (illustrative) recommendation. Values are never claimed as a real
 * analysis of organizational data.
 */
export function ContextForm({
  problem,
  initial,
  onBack,
  onGenerate,
}: {
  problem: PrototypeProblem;
  initial: ContextAnswer[];
  onBack: () => void;
  onGenerate: (answers: ContextAnswer[]) => void;
}) {
  const [answers, setAnswers] = useState<ContextAnswer[]>(initial);

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const rest = prev.filter((a) => a.questionId !== questionId);
      return [...rest, { questionId, value }];
    });
  };

  const valueFor = (questionId: string) =>
    answers.find((a) => a.questionId === questionId)?.value ?? "";

  const answered = problem.context.filter((q) => valueFor(q.id) !== "").length;
  const allAnswered = answered === problem.context.length;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted transition-colors hover:text-ink"
      >
        <span aria-hidden="true">←</span> Choose a different problem
      </button>

      <p className="mt-6 text-[11px] font-bold uppercase tracking-eyebrow text-accent-deep">
        {problem.category}
      </p>
      <h1 className="mt-3 text-hero font-semibold tracking-tight text-ink">
        Tell Compass a little more.
      </h1>
      <p className="mt-4 max-w-2xl text-lead leading-relaxed text-muted">
        A few quick questions about <span className="font-medium text-ink">{problem.name}</span>.
        This is a prototype, so your answers tune an illustrative recommendation — not a live
        analysis of your data.
      </p>

      <div className="mt-10 flex flex-col gap-6">
        {problem.context.map((question, qi) => {
          const value = valueFor(question.id);
          return (
            <div key={question.id} className="border border-line bg-surface px-5 py-6 sm:px-7">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[14.5px] font-semibold leading-snug text-ink">
                  <span className="mr-2 font-mono text-[12px] font-bold text-faint">
                    {qi + 1}
                  </span>
                  {question.label}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {question.options.map((option) => {
                  const active = value === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAnswer(question.id, option)}
                      aria-pressed={active}
                      className={cn(
                        "rounded-md border px-4 py-2.5 text-left text-[13.5px] font-medium leading-snug transition-colors",
                        active
                          ? "border-ink bg-accent-soft text-ink"
                          : "border-line bg-paper text-muted hover:border-ink hover:text-ink"
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[11.5px] text-faint">
        {answered} of {problem.context.length} answered — the prototype works with any
        combination.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-[13.5px] font-medium text-muted transition-colors hover:text-ink"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onGenerate(answers)}
          className={cn(
            "inline-flex items-center justify-center gap-2 bg-ink px-7 py-3.5 text-[14.5px] font-semibold text-paper transition-colors hover:bg-ink2",
            !allAnswered && "opacity-90"
          )}
        >
          Generate Recommendation
          <ArrowIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
