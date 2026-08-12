"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { standaloneQuestions } from "@/data/assessment-flow";
import { situationOptionsFor } from "@/data/assessment-questions";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "@/components/home/primitives";

const DEMO_RESULT = "/demo/decisions/invoice-ai";

/** Sandboxed demo of the assessment — deterministic, no auth, no API calls. */
export function DemoAssessment() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const total = standaloneQuestions.length;
  const q = standaloneQuestions[current];
  const selected = answers[q.id] ?? "";

  const options =
    q.id === "situation" ? situationOptionsFor(answers["dept"]) : q.options;

  const canContinue = Boolean(selected);
  const isLast = current === total - 1;

  const choose = (option: string) => {
    const next = { ...answers, [q.id]: option };
    setAnswers(next);
  };

  const forward = () => {
    if (!canContinue) return;
    if (isLast) {
      router.push(DEMO_RESULT);
      return;
    }
    setCurrent((c) => c + 1);
  };

  const back = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  return (
    <div className="mx-auto max-w-xl px-5 py-8">
      <div className="flex items-center justify-between text-[12px] font-semibold text-muted">
        <span>
          Question {current + 1} of {total}
        </span>
        <span>{Math.round((current / Math.max(total - 1, 1)) * 100)}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((current / Math.max(total - 1, 1)) * 100)}
        aria-label="Assessment progress"
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-accent-deep transition-all duration-300"
          style={{ width: `${(current / Math.max(total - 1, 1)) * 100}%` }}
        />
      </div>

      <div className="mt-8 rounded-lg border border-line bg-surface p-6">
        <h2 className="text-[19px] font-semibold tracking-tight text-ink">{q.question}</h2>
        <div className="mt-5 space-y-2.5">
          {options?.map((option) => {
            const active = selected === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(option)}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-[14px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep",
                  active
                    ? "border-accent-deep bg-accent-soft text-ink"
                    : "border-line bg-paper text-ink hover:border-ink/40"
                )}
              >
                {option}
                {active && (
                  <span aria-hidden="true" className="text-accent-deep">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={current === 0}
          className="border border-line bg-surface px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
        >
          Back
        </button>
        <button
          type="button"
          onClick={forward}
          disabled={!canContinue}
          className="group inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-paper transition-colors hover:bg-ink2 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
        >
          {isLast ? "View Executive Recommendation" : "Continue"}
          <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <p className="mt-10 border-t border-line pt-5 text-center text-[12px] leading-relaxed text-muted">
        This is a sandboxed demo — no data is saved and nothing is sent to production.{" "}
        <a
          href="/assessment"
          className="font-semibold text-accent-deep transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
        >
          Run the real assessment →
        </a>
      </p>
    </div>
  );
}
