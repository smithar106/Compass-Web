"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { standaloneQuestions, PROGRESS_STEPS } from "@/data/assessment-flow";
import { buildProfile } from "@/lib/assessment-profile";
import { ensureAuthenticated } from "@/lib/supabase";
import { trackAssessmentStarted, trackAssessmentCompleted } from "@/lib/analytics";
import { ArrowIcon } from "@/components/home/primitives";
import type { Answer } from "@/types";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "compass-assessment-session";
const CURRENT_VERSION = "4.0.0";

interface SavedSession {
  version: string;
  currentQuestion: number;
  answers: Answer[];
}

function loadSession(): SavedSession | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as SavedSession;
      if (parsed.version === CURRENT_VERSION && Array.isArray(parsed.answers)) return parsed;
    }
  } catch {}
  return null;
}

function saveSession(session: Omit<SavedSession, "version">): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...session, version: CURRENT_VERSION }));
  } catch {}
}

function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

const ANSWER_FOR_QUESTION = (answers: Answer[], questionId: string) =>
  answers.find((a) => a.questionId === questionId)?.value ?? "";

export default function AssessmentPage() {
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [value, setValue] = useState<string | number | boolean>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const startedRef = useRef(false);

  const question = standaloneQuestions[current];
  const isLast = current + 1 >= PROGRESS_STEPS;
  const hasAnswer = value !== "" && value !== undefined && value !== null;
  const progress = Math.round((current / Math.max(1, PROGRESS_STEPS - 1)) * 100);

  // Restore any in-progress session and authenticate (preserved gate).
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      const safeIndex = Math.min(Math.max(0, saved.currentQuestion), PROGRESS_STEPS - 1);
      setCurrent(safeIndex);
      setAnswers(saved.answers);
      setValue(ANSWER_FOR_QUESTION(saved.answers, standaloneQuestions[safeIndex]?.id));
    }
    setLoaded(true);
    ensureAuthenticated()
      .then(() => {
        if (!startedRef.current) {
          startedRef.current = true;
          trackAssessmentStarted();
        }
      })
      .catch((err: unknown) => {
        setAuthError(err instanceof Error ? err.message : "Authentication failed");
      });
  }, []);

  const goBack = useCallback(() => {
    if (current === 0) return;
    const prevIndex = current - 1;
    const prevQuestion = standaloneQuestions[prevIndex];
    setValue(prevQuestion ? ANSWER_FOR_QUESTION(answers, prevQuestion.id) : "");
    setCurrent(prevIndex);
    setSubmitError(null);
  }, [current, answers]);

  const submit = useCallback(
    async (finalAnswers: Answer[]) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setSubmitting(true);
      setSubmitError(null);
      try {
        const profile = buildProfile(finalAnswers);
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        });
        if (!res.ok) {
          let message = `Generation failed (${res.status})`;
          try {
            const body = await res.json();
            if (body?.error) message = body.error;
          } catch {}
          throw new Error(message);
        }
        const data = await res.json();
        if (!data?.recommendation_id) {
          throw new Error("No recommendation was generated. Please try again.");
        }
        clearSession();
        trackAssessmentCompleted();
        router.push(`/decisions/${encodeURIComponent(data.recommendation_id)}`);
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : "Failed to generate your recommendation. Please try again.");
        setSubmitting(false);
        submittingRef.current = false;
      }
    },
    [router]
  );

  const continueForward = useCallback(() => {
    if (!question || !hasAnswer) return;
    const nextAnswers: Answer[] = [
      ...answers.filter((a) => a.questionId !== question.id),
      { questionId: question.id, value },
    ];
    if (isLast) {
      setAnswers(nextAnswers);
      void submit(nextAnswers);
      return;
    }
    const nextIndex = current + 1;
    setAnswers(nextAnswers);
    setCurrent(nextIndex);
    setValue("");
    saveSession({ currentQuestion: nextIndex, answers: nextAnswers });
  }, [question, hasAnswer, answers, value, isLast, current, submit]);

  if (!loaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="text-sm text-muted">Loading assessment...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <p className="text-[11px] font-bold uppercase tracking-eyebrow text-accent-deep">Assessment</p>
        <h1 className="mt-3 text-title font-semibold tracking-tight text-ink">Could not start your assessment</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted">{authError}</p>
        <button
          type="button"
          onClick={() => {
            setAuthError(null);
            ensureAuthenticated()
              .then(() => setAuthError(null))
              .catch((err: unknown) =>
                setAuthError(err instanceof Error ? err.message : "Authentication failed")
              );
          }}
          className="mt-8 inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <p className="text-sm text-muted">No questions loaded.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-10 sm:py-14">
      {/* Progress */}
      <div className="flex items-center justify-between text-[12.5px] text-muted">
        <span className="font-medium text-ink">
          <span data-testid="assessment-question-label">
            Question {current + 1} of {PROGRESS_STEPS}
          </span>
        </span>
        <span>{progress}%</span>
      </div>
      <div
        className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="Assessment progress"
      >
        <div
          data-testid="assessment-progress"
          className="h-full rounded-full bg-accent-deep transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="mt-8 rounded-lg border border-line bg-surface px-5 py-7 sm:px-8 sm:py-8">
        <p className="text-[10.5px] font-bold uppercase tracking-eyebrow text-accent-deep">
          {question.section}
        </p>
        <h1 className="mt-3 text-[22px] font-semibold leading-snug tracking-tight text-ink sm:text-[24px]">
          {question.question}
        </h1>

        <div className="mt-6">
          {question.options && question.chip ? (
            <div className="flex flex-wrap gap-2">
              {question.options.map((opt) => {
                const active = value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setValue(opt)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-md border px-4 py-2.5 text-left text-[13.5px] font-medium leading-snug transition-colors",
                      active
                        ? "border-ink bg-accent-soft text-ink"
                        : "border-line bg-paper text-muted hover:border-ink hover:text-ink"
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {(question.options ?? []).map((opt) => {
                const active = value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setValue(opt)}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded-md border px-4 py-3.5 text-left text-[14px] font-medium leading-snug transition-colors",
                      active
                        ? "border-ink bg-accent-soft text-ink"
                        : "border-line bg-paper text-muted hover:border-ink hover:text-ink"
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {submitError && (
          <div
            role="alert"
            className="mt-6 rounded-md border border-risk-soft bg-risk-soft px-4 py-3 text-[13px] leading-relaxed text-[#7f1d1d]"
          >
            {submitError}
          </div>
        )}

        {/* Controls */}
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={current === 0 || submitting}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-[13.5px] font-medium text-muted transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-40"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M14 8H3M7 3 2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={continueForward}
              disabled={!hasAnswer || submitting}
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 bg-ink px-6 py-3.5 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2 sm:w-auto",
                (!hasAnswer || submitting) && "pointer-events-none opacity-40"
              )}
            >
              {submitting ? (
                <>
                  <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-paper border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Executive Recommendation
                  <ArrowIcon className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={continueForward}
              disabled={!hasAnswer}
              className={cn(
                "inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2 disabled:pointer-events-none disabled:opacity-40"
              )}
            >
              Continue
              <ArrowIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <p className="mt-5 text-center text-[11.5px] leading-relaxed text-faint">
        Your answers are saved as you go. Each one sharpens the recommendation.
      </p>
    </div>
  );
}
