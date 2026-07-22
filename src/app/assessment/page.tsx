"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/assessment-questions";
import { site } from "@/content/site";
import type { Answer, AssessmentSession } from "@/types";

const STORAGE_KEY = "compass-assessment-session";

function loadSession(): AssessmentSession | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function saveSession(session: AssessmentSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

const questionTypeLabels: Record<string, string> = {
  boolean: "Yes / No",
  scale: "Scale 1–5",
  "multi-choice": "Select one",
  open: "Open response",
};

export default function AssessmentPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [session, setSession] = useState<AssessmentSession>({
    currentQuestion: 0,
    answers: [],
    completed: false,
  });
  const [currentValue, setCurrentValue] = useState<string | number | boolean>("");
  const [loaded, setLoaded] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

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

  useEffect(() => {
    if (loaded && started && !showComplete) {
      saveSession(session);
    }
  }, [session, loaded, started, showComplete]);

  const currentQuestion = questions[session.currentQuestion];
  const progress = questions.length > 0
    ? Math.round((session.answers.length / questions.length) * 100)
    : 0;

  const handleAnswer = useCallback(() => {
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
    } else {
      setSession({
        currentQuestion: session.currentQuestion + 1,
        answers: newAnswers,
        completed: false,
      });
      setCurrentValue("");
    }
  }, [currentQuestion, currentValue, session]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAnswer();
    }
  };

  const goToResults = () => {
    clearSession();
    router.push("/assessment/results");
  };

  const startAssessment = () => {
    setStarted(true);
    setSession({ currentQuestion: 0, answers: [], completed: false });
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
            <span>⏱ {site.assessment.intro.estimatedTime}</span>
            <span>📋 {site.assessment.intro.sections}</span>
            <span>❓ {site.assessment.intro.questions}</span>
          </div>
          <div className="mt-10">
            <button
              onClick={startAssessment}
              className="inline-flex items-center px-8 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
            >
              {site.assessment.intro.cta}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
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
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-stone mb-2">
            <span>
              {session.answers.length + 1} of {questions.length}
            </span>
            <span>{currentQuestion.section}</span>
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-forest rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-8">
          <div className="mb-2">
            <span className="text-xs text-stone font-medium uppercase tracking-wider">
              {questionTypeLabels[currentQuestion.type]}
            </span>
          </div>
          <h2 className="text-subhead font-semibold text-ink">{currentQuestion.question}</h2>

          <div className="mt-6" onKeyDown={handleKeyDown}>
            {currentQuestion.type === "boolean" && (
              <div className="flex gap-4">
                <button
                  onClick={() => { setCurrentValue(true); setTimeout(handleAnswer, 100); }}
                  className={`flex-1 px-6 py-3 border rounded-lg text-sm font-medium transition-colors ${
                    currentValue === true ? "border-forest bg-mist text-forest" : "border-border text-stone hover:border-forest"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => { setCurrentValue(false); setTimeout(handleAnswer, 100); }}
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
                      onClick={() => { setCurrentValue(opt); setTimeout(handleAnswer, 100); }}
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
                    onClick={() => { setCurrentValue(opt); setTimeout(handleAnswer, 100); }}
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
        </div>
      </div>
    </div>
  );
}
