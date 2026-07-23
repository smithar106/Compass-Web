"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { questions } from "@/data/assessment-questions";
import { site } from "@/content/site";
import { ensureAuthenticated } from "@/lib/supabase";
import { createClient } from "@/lib/supabase";
import { trackAssessmentStarted, trackAssessmentCompleted } from "@/lib/analytics";
import type { Answer, AssessmentSession } from "@/types";

const STORAGE_KEY = "compass-assessment-session";
const CURRENT_VERSION = "2.0.0";

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

function loadSession(): AssessmentSession | null {
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
  const supabase = typeof window !== "undefined" ? createClient() : null;
  const [started, setStarted] = useState(false);
  const [session, setSession] = useState<AssessmentSession>({
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
        currentQuestion: session.currentQuestion,
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
        currentQuestion: session.currentQuestion,
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

  const goToResults = () => {
    clearSession();
    router.push("/assessment/results");
  };

  const startAssessment = async () => {
    if (isDemo) {
      setSession({ currentQuestion: 0, answers: [], completed: false, userId: "demo-user" });
      setStarted(true);
      trackAssessmentStarted();
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      const user = await ensureAuthenticated();
      setSession({ currentQuestion: 0, answers: [], completed: false, userId: user.id });
      setStarted(true);
      trackAssessmentStarted();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Authentication failed");
      setAuthLoading(false);
    }
  };

  if (!loaded) {
    return <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[50vh]"><div className="text-stone text-sm">Loading...</div></div>;
  }

  if (!started && !showComplete) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {isDemo && <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-xs font-medium text-amber-800">Demo mode</div>}
          <h1 className="text-heading font-bold text-ink">{site.assessment.intro.headline}</h1>
          <p className="mt-4 text-body text-stone leading-relaxed">{site.assessment.intro.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-stone">
            <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>3&ndash;5 minutes</span>
            <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>Department problems</span>
          </div>
          <div className="mt-10">
            <button onClick={startAssessment} disabled={authLoading} className="inline-flex items-center px-8 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors disabled:opacity-50">
              {authLoading ? "Preparing..." : site.assessment.intro.cta}
            </button>
          </div>
          {authError && <p className="mt-4 text-sm text-red-600">{authError}</p>}
        </div>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-mist flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h1 className="text-heading font-bold text-ink">{site.assessment.complete.headline}</h1>
          <p className="mt-4 text-body text-stone">{site.assessment.complete.body}</p>
          <div className="mt-10">
            <button onClick={goToResults} className="inline-flex items-center px-8 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors">
              {site.assessment.complete.cta}
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
        {/* Dynamic insight */}
        <div className="mb-6 bg-mist/50 border border-forest/10 rounded-lg p-3">
          <p className="text-sm text-forest font-medium">{currentInsight}</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-stone mb-2">
            <span className="font-medium text-ink">{currentQuestion.section}</span>
            <span>{session.answers.length + 1} of {questions.length}</span>
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-forest rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white border border-border rounded-lg p-6">
          <h2 className="text-subhead font-semibold text-ink">{currentQuestion.question}</h2>

          <div className="mt-6">
            {currentQuestion.type === "boolean" && (
              <div className="flex gap-4">
                <button onClick={() => { setCurrentValue(true); }} className={`flex-1 px-6 py-3 border-2 rounded-lg text-sm font-semibold transition-colors ${currentValue === true ? "border-forest bg-mist text-forest" : "border-border text-stone hover:border-forest"}`}>Yes</button>
                <button onClick={() => { setCurrentValue(false); }} className={`flex-1 px-6 py-3 border-2 rounded-lg text-sm font-semibold transition-colors ${currentValue === false ? "border-forest bg-mist text-forest" : "border-border text-stone hover:border-forest"}`}>No</button>
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
                            currentValue === opt ? "border-forest bg-mist text-forest" : "border-border text-stone hover:border-forest"
                          }`
                        : `w-full px-4 py-3 border-2 rounded-lg text-sm transition-colors ${
                            currentValue === opt ? "border-forest bg-mist text-forest" : "border-border text-stone hover:border-forest"
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
                className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-y"
              />
            )}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button onClick={handleSkip} className="text-xs text-stone hover:text-ink transition-colors">Skip</button>
            <div className="flex gap-2">
              {session.currentQuestion > 0 && (
                <button onClick={() => { setCurrentValue(""); setSession((s) => ({ ...s, currentQuestion: Math.max(0, s.currentQuestion - 1) })); }} className="text-xs text-stone hover:text-ink transition-colors px-3 py-1">Back</button>
              )}
              <button
                onClick={handleAnswer}
                disabled={currentValue === "" || currentValue === undefined}
                className="px-5 py-2 bg-forest text-white text-sm font-semibold rounded-lg hover:bg-leaf transition-colors disabled:opacity-40"
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