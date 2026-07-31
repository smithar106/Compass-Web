"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { questions } from "@/data/assessment-questions";
import { site } from "@/content/site";
import { ensureAuthenticated } from "@/lib/supabase";
import { createClient } from "@/lib/supabase";
import { trackAssessmentStarted, trackAssessmentCompleted } from "@/lib/analytics";
import type { Answer, AssessmentSession } from "@/types";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "compass-assessment-session";
const CURRENT_VERSION = "3.0.0";

type EntryMode = "analyze" | "opportunities" | "validate";

const insights: Record<string, string> = {
  situation: "I\u2019m learning about the operational problem.",
  dept: "Understanding which department owns this.",
  "workflow-type": "Mapping how work currently happens.",
  frequency: "Assessing the scale and frequency.",
  people: "Understanding team involvement.",
  handoffs: "Tracing process complexity.",
  tools: "Evaluating the current tool landscape.",
  exceptions: "Assessing variability and edge cases.",
  budget: "Understanding budget constraints.",
  timeline: "Noting expected urgency.",
  risk: "Evaluating business impact of failure.",
  stability: "Checking process maturity.",
  "prior-attempts": "Reviewing past improvement efforts.",
  "desired-outcome": "Identifying the success criteria.",
};

function loadSession(): (AssessmentSession & { mode?: EntryMode; proposed?: { intervention: string; category: string } }) | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.version === CURRENT_VERSION) return parsed;
    }
  } catch {}
  return null;
}

function saveSession(session: AssessmentSession): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...session, version: CURRENT_VERSION }));
  } catch {}
}

function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

function AssessmentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isDemo = searchParams.get("demo") === "true";
  const prefillProblem = (searchParams.get("problem") || "").trim();
  const mode = (searchParams.get("mode") || "analyze") as EntryMode;
  const intro = site.assessment.intro[mode];
  const supabase = typeof window !== "undefined" ? createClient() : null;
  const [started, setStarted] = useState(false);
  const [session, setSession] = useState<AssessmentSession & { mode?: EntryMode; proposed?: { intervention: string; category: string } }>({
    currentQuestion: 0,
    answers: [],
    completed: false,
  });
  const [currentValue, setCurrentValue] = useState<string | number | boolean>("");
  const [loaded, setLoaded] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentInsight, setCurrentInsight] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  // analyze / validate intake fields
  const [problemText, setProblemText] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [proposed, setProposed] = useState("");
  const [proposedCategory, setProposedCategory] = useState("");

  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setSession(saved);
      if (saved.completed) {
        setShowComplete(true);
      } else {
        setStarted(true);
      }
    }
    setLoaded(true);
  }, []);

  const currentQuestion = questions[session.currentQuestion];
  const progress = questions.length > 0
    ? Math.round((session.answers.length / questions.length) * 100)
    : 0;

  useEffect(() => {
    if (currentQuestion && currentQuestion.category && insights[currentQuestion.category]) {
      setCurrentInsight(insights[currentQuestion.category]);
    }
  }, [currentQuestion]);

  const handleAnswer = useCallback(async () => {
    if (!currentQuestion) return;
    if (currentValue === "" || currentValue === undefined || currentValue === null) return;

    const newAnswers: Answer[] = [
      ...session.answers.filter((a) => a.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, value: currentValue },
    ];

    if (session.currentQuestion + 1 >= questions.length) {
      const finalSession: AssessmentSession = {
        ...session,
        answers: newAnswers,
        completed: true,
      };
      setSession(finalSession);
      saveSession(finalSession);
      setShowComplete(true);
      trackAssessmentCompleted();
    } else {
      setSession((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        answers: newAnswers,
      }));
      setCurrentValue("");
    }
  }, [currentQuestion, currentValue, session]);

  const handleSkip = useCallback(async () => {
    if (!currentQuestion) return;
    setCurrentValue("");

    const newAnswers: Answer[] = [
      ...session.answers.filter((a) => a.questionId !== currentQuestion.id),
    ];

    if (session.currentQuestion + 1 >= questions.length) {
      const finalSession: AssessmentSession = {
        ...session,
        answers: newAnswers,
        completed: true,
      };
      setSession(finalSession);
      saveSession(finalSession);
      setShowComplete(true);
      trackAssessmentCompleted();
    } else {
      setSession((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        answers: newAnswers,
      }));
    }
  }, [currentQuestion, session]);

  const goToResults = async () => {
    if (submitting) return;
    setSubmitting(true);
    router.push("/assessment/results");
  };

  const startAssessment = async () => {
    const initialAnswers: Answer[] = [];
    if (mode === "analyze") {
      const p = problemText.trim() || prefillProblem;
      if (p) initialAnswers.push({ questionId: "problem-description", value: p });
    } else if (mode === "validate") {
      if (proposed.trim()) initialAnswers.push({ questionId: "proposed-intervention", value: proposed.trim() });
      if (proposedCategory) initialAnswers.push({ questionId: "proposed-category", value: proposedCategory });
    }
    const base = {
      currentQuestion: 0,
      answers: initialAnswers,
      completed: false,
      mode,
      proposed: mode === "validate" ? { intervention: proposed.trim(), category: proposedCategory } : undefined,
    };
    if (isDemo) {
      setSession({ ...base, userId: "demo-user" });
      setStarted(true);
      trackAssessmentStarted();
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      const user = await ensureAuthenticated();
      setSession({ ...base, userId: user.id });
      setStarted(true);
      trackAssessmentStarted();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Authentication failed");
      setAuthLoading(false);
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProblemText(String(reader.result ?? "").slice(0, 4000));
      setHint(`Uploaded ${file.name}`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (!loaded) {
    return <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[50vh]"><div className="text-stone text-sm">Loading...</div></div>;
  }

  if (!started && !showComplete) {
    return (
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted transition-colors hover:text-ink">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M14 8H3M7 3 2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All entry paths
          </Link>

          {isDemo && <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-xs font-medium text-amber-800">Demo mode</div>}

          {/* ---- ANALYZE: problem-first ---- */}
          {mode === "analyze" && (
            <div className="overflow-hidden border border-line bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-ink px-5 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/80">
                  {intro.label}
                </span>
                <span className="font-mono text-[10px] text-paper/50">{intro.time}</span>
              </div>
              <div className="p-5 sm:p-6">
                <h1 className="text-heading font-semibold tracking-tight text-ink">{intro.headline}</h1>
                <p className="mt-3 text-body text-muted leading-relaxed">{intro.body}</p>

                <label htmlFor="challenge-input" className="mt-6 block text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                  Describe the problem
                </label>
                <textarea
                  id="challenge-input"
                  rows={5}
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  placeholder="e.g. Our customer onboarding takes 45 days because approvals and setup are manual\u2026"
                  className="mt-2 w-full resize-y border border-line bg-paper/40 px-4 py-3.5 font-mono text-[13.5px] leading-relaxed text-ink placeholder:text-faint focus:border-ink focus:outline-none focus:ring-2 focus:ring-accent-deep/20"
                />
                <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] text-faint">
                  <span>{hint ?? "Paste a process, a policy, or upload a workflow file."}</span>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-faint">Try an example</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {site.assessment.intro.analyze.examples.map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => {
                          setProblemText(ex);
                          setHint(null);
                        }}
                        className="border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {site.assessment.intro.analyze.pasteOptions.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          setHint(label);
                          document.getElementById("challenge-input")?.focus();
                        }}
                        className="text-[12px] font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                      >
                        {label}
                      </button>
                    ))}
                    <span aria-hidden="true" className="hidden h-4 w-px bg-line sm:block" />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="text-[12px] font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                    >
                      {site.assessment.intro.analyze.uploadLabel}
                    </button>
                    <span className="font-mono text-[10px] text-faint">{site.assessment.intro.analyze.uploadHint}</span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".txt,.md,.csv,.tsv,.log,.json"
                      onChange={onFile}
                      className="hidden"
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={startAssessment}
                    disabled={authLoading}
                    className="inline-flex items-center justify-center gap-2 bg-ink px-7 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2 disabled:opacity-50"
                  >
                    {authLoading ? "Preparing..." : intro.cta}
                  </button>
                </div>
                {authError && <p className="mt-4 text-sm text-red-600">{authError}</p>}
              </div>
            </div>
          )}

          {/* ---- OPPORTUNITIES: guided assessment ---- */}
          {mode === "opportunities" && (
            <div className="text-center">
              <h1 className="text-heading font-bold text-ink">{intro.headline}</h1>
              <p className="mt-4 text-body text-muted leading-relaxed">{intro.body}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {["Teams", "Workflows", "Bottlenecks", "Software", "Goals", "KPIs", "Constraints", "AI usage"].map((s) => (
                  <span key={s} className="border border-line bg-surface px-2.5 py-1 text-[11.5px] font-medium text-muted">{s}</span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
                <span className="flex items-center gap-2"><ClockIcon />{intro.time}</span>
                <span className="flex items-center gap-2"><LayersIcon />Ranked opportunity map</span>
              </div>
              <div className="mt-10">
                <button onClick={startAssessment} disabled={authLoading} className="inline-flex items-center px-8 py-3 bg-ink text-paper text-sm font-semibold hover:bg-ink2 transition-colors disabled:opacity-50">
                  {authLoading ? "Preparing..." : intro.cta}
                </button>
              </div>
              {authError && <p className="mt-4 text-sm text-red-600">{authError}</p>}
            </div>
          )}

          {/* ---- VALIDATE: proposed intervention ---- */}
          {mode === "validate" && (
            <div className="overflow-hidden border border-line bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-ink px-5 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/80">
                  {intro.label}
                </span>
                <span className="font-mono text-[10px] text-paper/50">{intro.time}</span>
              </div>
              <div className="p-5 sm:p-6">
                <h1 className="text-heading font-semibold tracking-tight text-ink">{intro.headline}</h1>
                <p className="mt-3 text-body text-muted leading-relaxed">{intro.body}</p>

                <label htmlFor="proposed-intervention" className="mt-6 block text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                  The intervention you\u2019re planning
                </label>
                <input
                  id="proposed-intervention"
                  type="text"
                  value={proposed}
                  onChange={(e) => setProposed(e.target.value)}
                  placeholder="e.g. An AI support agent, a CRM rollout, invoice automation\u2026"
                  className="mt-2 w-full border border-line bg-paper/40 px-4 py-3 text-[14px] text-ink placeholder:text-faint focus:border-ink focus:outline-none focus:ring-2 focus:ring-accent-deep/20"
                />

                <div className="mt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-faint">How would you categorize it?</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {site.assessment.intro.validate.interventions.map((opt) => {
                      const active = proposedCategory === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setProposedCategory(active ? "" : opt)}
                          aria-pressed={active}
                          className={cn(
                            "border px-3 py-1.5 text-[12px] font-medium transition-colors",
                            active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-muted hover:border-ink hover:text-ink"
                          )}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
                  <p className="text-[11.5px] leading-snug text-muted">
                    Compass compares it against every alternative\u2014including no action.
                  </p>
                  <button
                    type="button"
                    onClick={startAssessment}
                    disabled={authLoading}
                    className="inline-flex shrink-0 items-center justify-center gap-2 bg-ink px-7 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2 disabled:opacity-50"
                  >
                    {authLoading ? "Preparing..." : intro.cta}
                  </button>
                </div>
                {authError && <p className="mt-4 text-sm text-red-600">{authError}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-accent-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h1 className="text-heading font-bold text-ink">{site.assessment.complete.headline}</h1>
          <p className="mt-4 text-body text-muted">{site.assessment.complete.body}</p>
          <div className="mt-10">
            <button
              onClick={goToResults}
              disabled={submitting}
              className="inline-flex items-center px-8 py-3 bg-ink text-paper text-sm font-semibold hover:bg-ink2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating your decision...
                </span>
              ) : site.assessment.complete.cta}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="pt-32 pb-20 px-4 text-center"><p className="text-stone">No questions loaded.</p></div>;
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* mode label + why we're asking */}
        <div className="mb-6 flex items-center justify-between">
          <span className="border border-line bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
            {intro.label}
          </span>
          <Link href="/" className="text-[11px] text-muted transition-colors hover:text-ink">Exit</Link>
        </div>

        {/* Dynamic insight */}
        <div className="mb-6 bg-accent-soft/60 border border-accent-deep/15 rounded-lg p-3">
          <p className="text-sm text-ink font-medium">{currentInsight}</p>
          <p className="mt-0.5 text-[11px] text-muted">Each answer improves the confidence of the decision.</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span className="font-medium text-ink">{currentQuestion.section}</span>
            <span>{session.answers.length + 1} of {questions.length}</span>
          </div>
          <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
            <div className="h-full bg-accent-deep rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white border border-line rounded-lg p-6">
          <h2 className="text-subhead font-semibold text-ink">{currentQuestion.question}</h2>

          <div className="mt-6">
            {currentQuestion.type === "boolean" && (
              <div className="flex gap-4">
                <button onClick={() => { setCurrentValue(true); }} className={`flex-1 px-6 py-3 border-2 rounded-lg text-sm font-semibold transition-colors ${currentValue === true ? "border-ink bg-accent-soft text-ink" : "border-line text-muted hover:border-ink"}`}>Yes</button>
                <button onClick={() => { setCurrentValue(false); }} className={`flex-1 px-6 py-3 border-2 rounded-lg text-sm font-semibold transition-colors ${currentValue === false ? "border-ink bg-accent-soft text-ink" : "border-line text-muted hover:border-ink"}`}>No</button>
              </div>
            )}

            {currentQuestion.options && (
              <div className={`${currentQuestion.chip ? "flex flex-wrap gap-2" : "flex flex-col gap-2"}`}>
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setCurrentValue(opt); }}
                    className={`text-left transition-colors ${
                      currentQuestion.chip
                        ? `px-4 py-2.5 border-2 rounded-lg text-sm font-medium ${
                            currentValue === opt ? "border-ink bg-accent-soft text-ink" : "border-line text-muted hover:border-ink"
                          }`
                        : `w-full px-4 py-3 border-2 rounded-lg text-sm transition-colors ${
                            currentValue === opt ? "border-ink bg-accent-soft text-ink" : "border-line text-muted hover:border-ink"
                          }`
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === "open" && !currentQuestion.options && (
              <textarea
                autoFocus
                value={typeof currentValue === "string" ? currentValue : ""}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder="Describe the workflow, pain points, and current process..."
                rows={4}
                className="w-full px-3 py-2 border-2 border-line rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-accent-deep/20 focus:border-ink resize-y"
              />
            )}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button onClick={handleSkip} className="text-xs text-muted hover:text-ink transition-colors">Skip</button>
            <div className="flex gap-2">
              {session.currentQuestion > 0 && (
                <button onClick={() => { setCurrentValue(""); setSession((s) => ({ ...s, currentQuestion: Math.max(0, s.currentQuestion - 1) })); }} className="text-xs text-muted hover:text-ink transition-colors px-3 py-1">Back</button>
              )}
              <button
                onClick={handleAnswer}
                disabled={currentValue === "" || currentValue === undefined}
                className="px-5 py-2 bg-ink text-paper text-sm font-semibold hover:bg-ink2 transition-colors disabled:opacity-40"
              >
                {session.currentQuestion + 1 >= questions.length ? "See results" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={<div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[50vh]"><div className="text-stone text-sm">Loading...</div></div>}>
      <AssessmentForm />
    </Suspense>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  );
}

function LayersIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
  );
}
