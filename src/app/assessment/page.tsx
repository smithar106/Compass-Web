"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/assessment-questions";
import { site } from "@/content/site";
import { ensureAuthenticated } from "@/lib/supabase";
import { createClient } from "@/lib/supabase";
import type { Answer, AssessmentSession } from "@/types";

const STORAGE_KEY = "compass-assessment-session";
const CURRENT_VERSION = "1.0.0";

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

const questionTypeLabels: Record<string, string> = {
  boolean: "Yes / No",
  scale: "Scale 1\u20135",
  "multi-choice": "Select one",
  open: "Open response",
};

export default function AssessmentPage() {
  const router = useRouter();
  const supabase = useMemo(() => typeof window !== "undefined" ? createClient() : null, []);
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
  const [persisting, setPersisting] = useState(false);
  const [dbSessionId, setDbSessionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const answerTimestamps = useRef<Map<number, number>>(new Map());

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

  async function persistAnswer(
    questionId: number,
    value: string | number | boolean,
    order: number,
    wasSkipped: boolean
  ) {
    if (!dbSessionId || !supabase) return;
    setSaving(true);
    const startTime = answerTimestamps.current.get(questionId) || Date.now();
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    try {
      const { error } = await (supabase as any).from("assessment_answers").upsert(
        {
          session_id: dbSessionId,
          question_id: questionId,
          question_version: CURRENT_VERSION,
          answer_value: value,
          answer_type: typeof value === "boolean" ? "boolean" : typeof value === "number" ? "scale" : "text",
          question_order: order,
          was_skipped: wasSkipped,
          time_spent: timeSpent,
          metadata: {},
        },
        {
          onConflict: "session_id,question_id",
          ignoreDuplicates: false,
        }
      );
      if (error) console.error("Failed to persist answer:", error);
    } catch (err) {
      console.error("Failed to persist answer:", err);
    } finally {
      setSaving(false);
    }
  }

  const currentQuestion = questions[session.currentQuestion];
  const progress = questions.length > 0
    ? Math.round((session.answers.length / questions.length) * 100)
    : 0;

  // Detect when section changes to show section context
  const prevSection = useRef<string | null>(null);
  const [sectionIntro, setSectionIntro] = useState<string | null>(null);
  useEffect(() => {
    if (currentQuestion && currentQuestion.section !== prevSection.current) {
      const ctx = (site.assessment.sections as any)[currentQuestion.section];
      if (ctx) {
        setSectionIntro(ctx);
        prevSection.current = currentQuestion.section;
        const timer = setTimeout(() => setSectionIntro(null), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentQuestion]);

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

      if (dbSessionId && supabase) {
        await persistAnswer(currentQuestion.id, currentValue, session.answers.length, false);
        await (supabase as any)
          .from("assessment_sessions")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            total_questions_presented: questions.length,
            questions_skipped: 0,
          })
          .eq("id", dbSessionId);
      }
    } else {
      setSession({
        currentQuestion: session.currentQuestion + 1,
        answers: newAnswers,
        completed: false,
        sessionId: dbSessionId || undefined,
        userId: session.userId,
      });
      setCurrentValue("");

      if (dbSessionId) {
        await persistAnswer(currentQuestion.id, currentValue, session.answers.length, false);
      }
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

      if (dbSessionId && supabase) {
        await (supabase as any)
          .from("assessment_sessions")
          .update({ status: "completed", completed_at: new Date().toISOString() })
          .eq("id", dbSessionId);
      }
    } else {
      setSession({
        currentQuestion: session.currentQuestion + 1,
        answers: newAnswers,
        completed: false,
        sessionId: dbSessionId || undefined,
        userId: session.userId,
      });

      if (dbSessionId) {
        await persistAnswer(currentQuestion.id, "", session.answers.length, true);
      }
    }
  }, [currentQuestion, session, dbSessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && currentQuestion?.type === "open") {
      e.preventDefault();
      handleAnswer();
    }
  };

  const goToResults = () => {
    clearSession();
    router.push("/assessment/results");
  };

  const startAssessment = async () => {
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
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {site.assessment.intro.questions}
            </span>
          </div>
          <div className="mt-10">
            <button
              onClick={startAssessment}
              disabled={authLoading}
              className="inline-flex items-center px-8 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors disabled:opacity-50"
            >
              {authLoading ? "Preparing organizational discovery..." : site.assessment.intro.cta}
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
          <div className="mt-4 text-xs text-stone">Responses saved securely</div>
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
        {/* Section context banner */}
        {sectionIntro && (
          <div className="mb-6 bg-mist border border-forest/20 rounded-lg p-4 animate-fadeIn">
            <p className="text-sm text-ink leading-relaxed">
              <span className="font-semibold text-forest">{currentQuestion.section}: </span>
              {sectionIntro}
            </p>
          </div>
        )}

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-stone mb-2">
            <span className="flex items-center gap-2">
              <span className="font-medium text-ink">{currentQuestion.section}</span>
              <span className="text-xs text-stone">Question {session.answers.length + 1} of {questions.length}</span>
              {saving && <span className="ml-1 text-xs text-forest italic">Saving...</span>}
            </span>
            {saving && (
              <span className="w-2 h-2 bg-forest rounded-full animate-pulse" />
            )}
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-forest rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white border border-border rounded-lg p-8">
          <div className="mb-3">
            <span className="text-xs text-stone font-medium uppercase tracking-wider">
              {questionTypeLabels[currentQuestion.type]}
            </span>
          </div>
          <h2 className="text-subhead font-semibold text-ink">{currentQuestion.question}</h2>

          <div className="mt-6" onKeyDown={handleKeyDown}>
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
                {currentQuestion.options.map((opt) => {
                  const val = opt.split("-")[0].trim();
                  return (
                    <button
                      key={opt}
                      onClick={() => { setCurrentValue(opt); }}
                      className={`px-4 py-2.5 border rounded-lg text-sm transition-colors ${
                        currentValue === opt ? "border-forest bg-mist text-forest" : "border-border text-stone hover:border-forest"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
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
                  placeholder="Type your answer..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-y"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleAnswer}
                    disabled={!currentValue || currentValue === ""}
                    className="px-6 py-2.5 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
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
            <div className="flex gap-1">
              {session.answers.length > 0 && (
                <button
                  onClick={() => {
                    const prev = Math.max(0, session.currentQuestion - 1);
                    setCurrentValue("");
                    setSession((s) => ({ ...s, currentQuestion: prev }));
                  }}
                  className="text-xs text-stone hover:text-ink transition-colors px-3 py-1"
                >
                  Back
                </button>
              )}
              {(currentQuestion.type === "boolean" || currentQuestion.type === "scale" || currentQuestion.type === "multi-choice") && currentValue !== "" && (
                <button
                  onClick={handleAnswer}
                  disabled={saving}
                  className="px-4 py-1 bg-forest text-white text-xs font-medium rounded-md hover:bg-leaf transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Next"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
