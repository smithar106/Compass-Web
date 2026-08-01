"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  normalizeProblem,
  selectFollowUps,
  type FollowUpQuestion,
  type NormalizedProblem,
} from "@/lib/analyze";
import { DecisionPackageView } from "@/components/analyze/DecisionPackageView";

const DRAFT_KEY = "compass-analyze-draft";
const STEPS = ["Describe", "Confirm", "Clarify", "Decision"] as const;
type Step = (typeof STEPS)[number];
const STEP_INDEX: Record<Step, number> = { Describe: 0, Confirm: 1, Clarify: 2, Decision: 3 };

const EXAMPLES = [
  "Manual invoice processing is expensive and slow; matching errors",
  "Customer onboarding takes 45 days because approvals and setup are manual",
  "Support escalation triage is manual; resolution time is high",
  "Operational knowledge is trapped in spreadsheets; repeat questions",
];

interface AnalyzeResponse {
  analysis_id?: string;
  normalization: NormalizedProblem;
  questions: FollowUpQuestion[];
  decision: any;
  status: string;
}

export default function AnalyzePage() {
  const [step, setStep] = useState<Step>("Describe");
  const [problemText, setProblemText] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [normalization, setNormalization] = useState<NormalizedProblem | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<FollowUpQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [decision, setDecision] = useState<any>(null);
  const [status, setStatus] = useState("preliminary_result");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);

  // restore draft
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.problemText) setProblemText(d.problemText);
        if (d.attachments) setAttachments(d.attachments);
        if (d.analysisId) setAnalysisId(d.analysisId);
        if (d.normalization) setNormalization(d.normalization);
        if (d.edits) setEdits(d.edits);
        if (d.questions) setQuestions(d.questions);
        if (d.answers) setAnswers(d.answers);
        if (d.decision) setDecision(d.decision);
        if (d.status) setStatus(d.status);
        if (d.step && STEP_INDEX[d.step as Step] !== undefined) setStep(d.step as Step);
      }
    } catch {}
  }, []);

  const saveDraft = () => {
    try {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ problemText, attachments, analysisId, normalization, edits, questions, answers, decision, status, step })
      );
      setDraftSaved(true);
    } catch {}
  };

  useEffect(() => {
    if (problemText || normalization || decision) {
      const t = setTimeout(saveDraft, 400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemText, normalization, questions, answers, decision, status, step]);

  const callAnalyze = async (payload: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }
      const r = data as AnalyzeResponse;
      if (r.analysis_id) setAnalysisId(r.analysis_id);
      setNormalization(r.normalization);
      setQuestions(r.questions || []);
      setDecision(r.decision || null);
      setStatus(r.status || "preliminary_result");
      return r;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const onAnalyze = async () => {
    if (!problemText.trim()) return;
    const r = await callAnalyze({ action: "create", problem_text: problemText, attachments });
    if (r) {
      setEdits({});
      setAnswers({});
      setStep("Confirm");
    }
  };

  const onConfirm = async (skipToDecision: boolean) => {
    const r = await callAnalyze({ action: "confirm", analysis_id: analysisId, edits });
    if (r) {
      const remaining = (r.questions || []).length;
      if (skipToDecision || remaining === 0) {
        setStep("Decision");
      } else {
        setStep("Clarify");
      }
    }
  };

  const onGenerate = async () => {
    const r = await callAnalyze({ action: "answers", analysis_id: analysisId, answers });
    if (r) setStep("Decision");
  };

  const startOver = () => {
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {}
    setStep("Describe");
    setProblemText("");
    setAttachments([]);
    setAnalysisId(null);
    setNormalization(null);
    setEdits({});
    setQuestions([]);
    setAnswers({});
    setDecision(null);
    setStatus("preliminary_result");
    setError(null);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAttachments((prev) => [...prev.slice(0, 9), String(reader.result ?? "").slice(0, 4000)]);
      setHint(`Uploaded ${file.name} — included in the analysis.`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-paper pb-20">
      <div className="mx-auto max-w-3xl px-5 pt-28 sm:px-8 lg:pt-36">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted transition-colors hover:text-ink">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M14 8H3M7 3 2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Home
        </Link>

        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">Analyze an Operational Problem</p>
          <h1 className="mt-2 text-title font-semibold tracking-tight text-ink">Make the right decision, defensibly.</h1>
        </div>

        {/* stepper — advances on real progress */}
        <ol className="mb-8 flex items-center gap-2">
          {STEPS.map((s, i) => {
            const active = STEP_INDEX[step] === i;
            const done = STEP_INDEX[step] > i;
            return (
              <li key={s} className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
                    done ? "border-ink bg-ink text-paper" : active ? "border-ink bg-surface text-ink" : "border-line bg-surface text-faint"
                  )}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className={cn("text-[12px] font-semibold", active ? "text-ink" : done ? "text-muted" : "text-faint")}>{s}</span>
                {i < STEPS.length - 1 && <span aria-hidden="true" className={cn("h-px flex-1", done ? "bg-ink" : "bg-line")} />}
              </li>
            );
          })}
        </ol>

        {error && (
          <div className="mb-5 rounded-lg border border-risk/30 bg-risk-soft px-4 py-3 text-[13px] text-[#7a1f1a]">
            {error}
            <button onClick={() => setError(null)} className="ml-2 font-semibold underline">Dismiss</button>
          </div>
        )}

        {/* STEP 1 — Describe */}
        {step === "Describe" && (
          <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-panel">
            <div className="flex items-center justify-between gap-3 border-b border-line bg-ink px-5 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/80">Describe the problem</span>
              <span className="font-mono text-[10px] text-paper/50">2–3 minutes</span>
            </div>
            <div className="p-5 sm:p-6">
              <label htmlFor="analyze-input" className="block text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                Your operational problem
              </label>
              <textarea
                id="analyze-input"
                rows={5}
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder="Describe the workflow, the symptom, and what you want to improve. e.g. Our customer onboarding takes 45 days because approvals and setup are manual…"
                className="mt-2 w-full resize-y border border-line bg-paper/40 px-4 py-3.5 font-mono text-[13.5px] leading-relaxed text-ink placeholder:text-faint focus:border-ink focus:outline-none focus:ring-2 focus:ring-accent-deep/20"
              />
              <div className="mt-1.5 text-[10px] text-faint">{hint ?? "You can paste a process, a policy, or upload a workflow file."}</div>

              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-faint">Try an example</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {EXAMPLES.map((ex) => (
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
                  {["Paste process", "Paste policy", "Paste documentation"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setHint(label);
                        document.getElementById("analyze-input")?.focus();
                      }}
                      className="text-[12px] font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                    >
                      {label}
                    </button>
                  ))}
                  <span aria-hidden="true" className="hidden h-4 w-px bg-line sm:block" />
                  <button type="button" onClick={() => fileRef.current?.click()} className="text-[12px] font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink">
                    Upload workflow
                  </button>
                  <span className="font-mono text-[10px] text-faint">.txt, .md, .csv</span>
                  <input ref={fileRef} type="file" accept=".txt,.md,.csv,.tsv,.log,.json" onChange={onFile} className="hidden" aria-hidden="true" tabIndex={-1} />
                </div>
                <button
                  type="button"
                  onClick={onAnalyze}
                  disabled={loading || !problemText.trim()}
                  className="inline-flex shrink-0 items-center justify-center gap-2 bg-ink px-7 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-paper/30 border-t-paper" aria-hidden="true" />
                      Analyzing…
                    </>
                  ) : (
                    "Analyze"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Confirm */}
        {step === "Confirm" && normalization && (
          <div className="rounded-lg border border-line bg-surface p-6 shadow-panel">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">How Compass understood your problem</p>
            <p className="mt-1 text-[12.5px] text-muted">
              Confirm or correct the interpretation. Compass will not finalize a decision from an unconfirmed normalization.
            </p>
            <div className="mt-5 space-y-4">
              <Field label="Workflow" value={edits.workflow ?? normalization.workflow} onChange={(v) => setEdits((e) => ({ ...e, workflow: v }))} />
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Problem</label>
                <textarea
                  value={edits.problemStatement ?? normalization.problemStatement}
                  onChange={(e) => setEdits((s) => ({ ...s, problemStatement: e.target.value }))}
                  rows={3}
                  className="mt-1.5 w-full resize-y rounded-md border border-line bg-paper/40 px-3 py-2.5 text-[13px] text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-accent-deep/20"
                />
              </div>
              <Field label="Likely root cause" value={edits.rootCauseHypothesis ?? normalization.rootCauseHypothesis} onChange={(v) => setEdits((e) => ({ ...e, rootCauseHypothesis: v }))} />
              <Field label="Desired outcome" value={edits.desiredOutcome ?? normalization.desiredOutcome} onChange={(v) => setEdits((e) => ({ ...e, desiredOutcome: v }))} />
              <div className="rounded-md border border-line bg-paper/40 px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Decision being evaluated</p>
                <p className="mt-0.5 text-[13px] font-medium text-ink">{normalization.decision}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => onConfirm(true)} disabled={loading} className="text-[13px] font-semibold text-muted transition-colors hover:text-ink disabled:opacity-50">
                Skip to decision
              </button>
              <button
                type="button"
                onClick={() => onConfirm(false)}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2 disabled:opacity-50"
              >
                {loading ? "Analyzing…" : "Confirm & continue"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Clarify */}
        {step === "Clarify" && (
          <div className="rounded-lg border border-line bg-surface p-6 shadow-panel">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">A few targeted follow-ups</p>
            <p className="mt-1 text-[12.5px] text-muted">
              Compass asks a small number of targeted follow-ups — each one can change the ranking, confidence, or defensibility of the decision.
            </p>
            <div className="mt-5 space-y-5">
              {questions.map((q) => (
                <div key={q.id}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[14px] font-semibold text-ink">
                      {q.question}
                      {q.required && <span className="ml-1 text-accent-deep">*</span>}
                    </p>
                    {q.required ? (
                      <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-deep">Required</span>
                    ) : (
                      <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-faint">Optional</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted">
                    Why: {q.why} · Affects <span className="font-semibold text-ink">{q.factor}</span>
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {q.options?.map((opt) => {
                      const active = answers[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
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
              ))}
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-between">
              <button type="button" onClick={() => setStep("Confirm")} className="text-[13px] font-semibold text-muted transition-colors hover:text-ink">
                Back
              </button>
              <button
                type="button"
                onClick={onGenerate}
                disabled={loading || questions.some((q) => q.required && !answers[q.id])}
                className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2 disabled:opacity-50"
              >
                {loading ? "Generating decision…" : "Generate decision"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Decision */}
        {step === "Decision" && decision && (
          <div>
            <DecisionPackageView
              recs={decision.recommendations || []}
              meta={decision.methodology}
              summary={decision.assessment_summary}
              status={status}
              recommendationId={decision.recommendation_id}
            />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <button type="button" onClick={() => setStep("Clarify")} className="text-[13px] font-semibold text-muted transition-colors hover:text-ink">
                Edit context
              </button>
              <div className="flex items-center gap-3">
                <button type="button" onClick={startOver} className="text-[13px] font-semibold text-muted transition-colors hover:text-ink">
                  Start a new analysis
                </button>
                <Link href="/how-it-works" className="text-[13px] font-semibold text-accent-deep transition-colors hover:text-ink">
                  See how it works →
                </Link>
              </div>
            </div>
            <div className="mt-3">
              <Link
                href={`/decisions/${analysisId}`}
                className="text-[12px] font-semibold text-accent-deep underline underline-offset-2 transition-colors hover:text-ink"
              >
                Open permanent decision link →
              </Link>
              <span className="ml-2 text-[11.5px] text-faint">This decision stays live at /decisions/{analysisId}</span>
            </div>
          </div>
        )}

        {draftSaved && (
          <p className="mt-6 text-center text-[10.5px] text-faint">Draft saved automatically to this browser. You can continue later.</p>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-faint">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-line bg-paper/40 px-3 py-2.5 text-[13px] text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-accent-deep/20"
      />
    </div>
  );
}
