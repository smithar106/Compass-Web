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
  const [dbSessionId, setDbSessionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const answerTimestamps = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setSession(saved);
      setDbSessionId(saved.sessionId || null);
      if (saved.completed) {
        setShowComplete(true);
      } else {
        setStarted(true);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!dbSessionId && session.userId && started && !showComplete) {
      createDbSession(session.userId);
    }
  }, [session.userId, started, showComplete, dbSessionId]);

  async function createDbSession(userId: string) {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("assessment_sessions" as any)
        .insert({
          user_id: userId,
          status: "in_progress",
          assessment_version: CURRENT_VERSION,
          metadata: {},
        })
        .select("id")
        .single();
      if (error) throw error;
      setDbSessionId((data as any).id);
      setSession((prev) => ({ ...prev, sessionId: (data as any).id }));
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  }

  const currentQuestion = questions[session.currentQuestion];
  const progress = questions.length > 0
    ? Math.round((session.answers.length / questions.length) * 100)
    : 0;

  const handleAnswer = useCallback(async () => {
    if (!currentQuestion) return;
    if (currentValue === "" || currentValue === undefined || currentValue === null) return;

    const newAnswers: Answer[] = [
      ...session.answers.filter((a) => a.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, value: currentValue },
    ];

    if (!answerTimestamps.current.has(currentQuestion.id)) {
      answerTimestamps.current.set(currentQuestion.id, Date.now());
    }

    if (session.currentQuestion + 1 >= questions.length) {
      const finalSession: AssessmentSession = {
        currentQuestion: session.currentQuestion,
        answers: newAnswers,
        completed: true,
        sessionId: dbSessionId || undefined,
        userId: session.userId,
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
  }, [currentQuestion, currentValue, session, dbSessionId]);

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
        sessionId: dbSessionId || undefined,
        userId: session.userId,
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
  }, [currentQuestion, session, dbSessionId]);

  const goToResults = () => {
    clearSession();
    router.push("/assessment/results");
  };

  const startAssessment = async () => {
    if (isDemo) {
      setSession({
        currentQuestion: 0,
        answers: [],
        completed: false,
        userId: "demo-user",
      });
      setStarted(true);
      trackAssessmentStarted();
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      const user = await ensureAuthenticated();
      setSession({
        currentQuestion: 0,
        answers: [],
        completed: false,
        userId: user.id,
      });
      setStarted(true);
      trackAssessmentStarted();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Authentication failed");
      setAuthLoading(false);
    }
  };

  if (!loaded) {
    return (
      <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[50vh]">
        <div className="text-stone text-sm">Loading...</div>
      </div>
    );
  }

  if (!started && !showComplete) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {isDemo && (
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-xs font-medium text-amber-800">
              Demo mode
            </div>
          )}
          <h1 className="text-heading font-bold text-ink">{site.assessment.intro.headline}</h1>
          <p className="mt-4 text-body text-stone leading-relaxed">{site.assessment.intro.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-stone">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {site.assessment.intro.estimatedTime}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              {site.assessment.intro.sections}
            </span>
          </div>
          <div className="mt-10">
            <button
              onClick={startAssessment}
              disabled={authLoading}
              className="inline-flex items-center px-8 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors disabled:opacity-50"
            >
              {authLoading ? "Preparing..." : site.assessment.intro.cta}
            </button>
          </div>
          {authError && (
            <p className="mt-4 text-sm text-red-600">{authError}</p>
          )}
        </div>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-mist flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-heading font-bold text-ink">{site.assessment.complete.headline}</h1>
          <p className="mt-4 text-body text-stone">{site.assessment.complete.body}</p>
          <div className="mt-10">
            <button
              onClick={goToResults}
              className="inline-flex items-center px-8 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
            >
              {site.assessment.complete.cta}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <p className="text-stone">No questions loaded.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <div className="text-xs text-stone mb-1">
            <span className="font-medium text-forest">{currentQuestion.category || currentQuestion.section}</span>
            <span className="mx-2">/</span>
            {currentQuestion.section}
          </div>
          <div className="flex items-center gap-2 text-xs text-stone mb-2">
            <span>Question {session.answers.length + 1} of {questions.length}</span>
            {saving && <span className="text-forest italic">Saving...</span>}
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-forest rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-8">
          <h2 className="text-subhead font-semibold text-ink">{currentQuestion.question}</h2>
          <p className="text-xs text-stone mt-2">
            {currentQuestion.type === "boolean" ? "Select Yes or No" :
             currentQuestion.type === "scale" ? "Select a value on the scale" :
             currentQuestion.type === "multi-choice" ? "Select one option" :
             "Type your answer"}
          </p>

          <div className="mt-6">
            {currentQuestion.type === "boolean" && (
              <div className="flex gap-4">
                <button
                  onClick={() => { setCurrentValue(true); }}
                  className={`flex-1 px-6 py-3 border rounded-lg text-sm font-medium transition-colors ${
                    currentValue === true ? "border-forest bg-mist text-forest" : "border-border text-stone hover:border-forest"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => { setCurrentValue(false); }}
                  className={`flex-1 px-6 py-3 border rounded-lg text-sm font-medium transition-colors ${
                    currentValue === false ? "border-forest bg-mist text-forest" : "border-border text-stone hover:border-forest"
                  }`}
                >
                  No
                </button>
              </div>
            )}

            {currentQuestion.type === "scale" && currentQuestion.options && (
              <div className="flex flex-wrap gap-2">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setCurrentValue(opt); }}
                    className={`px-4 py-2.5 border rounded-lg text-sm transition-colors ${
                      currentValue === opt ? "border-forest bg-mist text-forest" : "border-border text-stone hover:border-forest"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === "multi-choice" && currentQuestion.options && (
              <div className="flex flex-col gap-2">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setCurrentValue(opt); }}
                    className={`text-left px-4 py-3 border rounded-lg text-sm transition-colors ${
                      currentValue === opt ? "border-forest bg-mist text-forest" : "border-border text-stone hover:border-forest"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === "open" && (
              <div>
                <textarea
                  autoFocus
                  value={typeof currentValue === "string" ? currentValue : ""}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder="Describe the workflow, pain points, and current process..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-y"
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="text-xs text-stone hover:text-ink transition-colors"
            >
              Skip this question
            </button>
            <div className="flex gap-2">
              {session.currentQuestion > 0 && (
                <button
                  onClick={() => {
                    setCurrentValue("");
                    setSession((s) => ({ ...s, currentQuestion: Math.max(0, s.currentQuestion - 1) }));
                  }}
                  className="text-xs text-stone hover:text-ink transition-colors px-3 py-1"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleAnswer}
                disabled={currentValue === "" || currentValue === undefined}
                className="px-4 py-1 bg-forest text-white text-xs font-medium rounded-md hover:bg-leaf transition-colors disabled:opacity-40"
              >
                {session.currentQuestion + 1 >= questions.length ? "Complete" : "Next"}
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
    <Suspense fallback={
      <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[50vh]">
        <div className="text-stone text-sm">Loading...</div>
      </div>
    }>
      <AssessmentForm />
    </Suspense>
  );
}