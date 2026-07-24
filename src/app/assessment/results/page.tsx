"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlueprintPrint } from "@/components/results/blueprint-print";
import type { RecommendationData } from "@/components/results/compass-choice";

const STORAGE_KEY = "compass-assessment-session";
const ENGINE_VERSION = "2.0.0";
const DATASET_VERSION = "v1 (baseline)";

const TIER_STYLES: Record<string, { label: string; ring: string; bg: string; text: string }> = {
  gold: { label: "Gold", ring: "ring-yellow-400/30", bg: "bg-yellow-50", text: "text-yellow-800" },
  silver: { label: "Silver", ring: "ring-gray-300/30", bg: "bg-gray-50", text: "text-gray-600" },
  bronze: { label: "Bronze", ring: "ring-amber-400/30", bg: "bg-amber-50", text: "text-amber-800" },
};

function EvidenceBadge({ tier }: { tier: string }) {
  const s = TIER_STYLES[tier] || TIER_STYLES.bronze;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${s.bg} ${s.text} border border-current/20`}>
      <span className={`w-1.5 h-1.5 rounded-full ${tier === "gold" ? "bg-yellow-400" : tier === "silver" ? "bg-gray-400" : "bg-amber-500"}`} />
      {s.label}
    </span>
  );
}

function ConfBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gray-800" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-900 w-8 text-right">{pct}%</span>
    </div>
  );
}

function Stat({ label, value, unsupported }: { label: string; value: string; unsupported?: boolean }) {
  if (unsupported) {
    return (
      <div>
        <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-[11px] text-gray-400 italic">Insufficient evidence to estimate reliably.</div>
      </div>
    );
  }
  return (
    <div>
      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="bg-white min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-lime-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Preparing your executive recommendation...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [recs, setRecs] = useState<RecommendationData[]>([]);
  const [confidenceBd, setConfidenceBd] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [progressIdx, setProgressIdx] = useState(0);
  const [runId, setRunId] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const progressMessages = [
    "Analyzing your workflow",
    "Comparing intervention paths",
    "Retrieving comparable implementations",
    "Evaluating evidence strength",
  ];

  useEffect(() => {
    const id = searchParams?.get("run_id");
    if (id) { loadExistingRun(id); } else { runRecommendation(); }
  }, [searchParams]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => setProgressIdx(i => Math.min(i + 1, progressMessages.length - 1)), 6000);
    return () => clearInterval(interval);
  }, [loading]);

  async function loadExistingRun(id: string) {
    try {
      setLoading(true);
      const res = await fetch(`/api/recommendations?run_id=${id}`);
      if (!res.ok) throw new Error((await res.json()).error || "Failed to load");
      const d = await res.json();
      setRecs(d.recommendations || []);
      setConfidenceBd(d.confidence_breakdown || {});
      setRunId(id);
    } catch (e) { setLoadError(e instanceof Error ? e.message : "Failed to load"); }
    finally { setLoading(false); }
  }

  async function runRecommendation() {
    try {
      setLoading(true);
      const stored = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
      if (!stored) { setLoadError("Investigation session not found. Please complete the investigation first."); setLoading(false); return; }
      let session: any;
      try { session = JSON.parse(stored); } catch { setLoadError("Investigation data is corrupted."); setLoading(false); return; }
      if (session.completed !== true) { setLoadError("Investigation is incomplete."); setLoading(false); return; }
      if (!session.answers?.length) { setLoadError("No answers found."); setLoading(false); return; }

      const profile = buildProfile(session.answers);
      const res = await fetch("/api/recommendations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
      if (!res.ok) {
        const text = await res.text();
        let msg = `Recommendation failed (${res.status})`, t = "server_error";
        try { const e = JSON.parse(text); msg = e.error || msg; t = e.type || t; } catch {}
        const p = t === "config_error" ? "Configuration Error" : t === "engine_unreachable" ? "Engine Unreachable" : t === "engine_error" ? "Engine Error" : "Error";
        throw new Error(`${p}: ${msg}`);
      }
      const d = await res.json();
      setRecs(d.recommendations || []);
      setConfidenceBd(d.confidence_breakdown || {});
      if (d.recommendation_run_id) {
        const url = `/assessment/results?run_id=${d.recommendation_run_id}`;
        window.history.replaceState({}, "", url);
        setRunId(d.recommendation_run_id);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) { setLoadError(e instanceof Error ? e.message : "Failed to generate"); }
    finally { setLoading(false); }
  }

  const generatedAt = new Date().toISOString();

  if (loading) return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-lime-500 rounded-full animate-spin mx-auto mb-4" />
        <div className="text-sm text-gray-400 mb-1">{progressMessages[progressIdx]}</div>
        <div className="w-full bg-gray-100 rounded-full h-1 mt-4 overflow-hidden">
          <div className="h-full bg-lime-500 rounded-full transition-all duration-1000" style={{ width: `${((progressIdx + 1) / progressMessages.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );

  if (loadError) return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
        </div>
        <h2 className="text-lg font-semibold text-ink mb-2">Failed to Generate Recommendations</h2>
        <p className="text-sm text-gray-500 mb-6">{loadError}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setLoadError(null); runRecommendation(); }} className="px-5 py-2 bg-lime-500 text-white text-sm font-semibold rounded-lg hover:bg-lime-600 transition-colors">Try Again</button>
          <button onClick={() => router.push("/assessment")} className="px-5 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">Retake Assessment</button>
        </div>
      </div>
    </div>
  );

  if (!recs.length) return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-lg font-semibold text-ink mb-2">No Recommendations Generated</h2>
        <p className="text-sm text-gray-500 mb-6">Unable to generate recommendations from your assessment data.</p>
        <button onClick={() => router.push("/assessment")} className="px-5 py-2 bg-lime-500 text-white text-sm font-semibold rounded-lg hover:bg-lime-600 transition-colors">Retake Assessment</button>
      </div>
    </div>
  );

  const primary = recs[0];
  const alternatives = recs.slice(1);

  function handlePrint() {
    const el = document.getElementById("compass-blueprint-print");
    if (el) {
      el.style.display = "block";
      setTimeout(() => { window.print(); setTimeout(() => { el.style.display = "none"; }, 100); }, 200);
    }
  }

  function timelineStr(r: RecommendationData): string {
    return r.timeline.low_weeks && r.timeline.high_weeks ? `${r.timeline.low_weeks}–${r.timeline.high_weeks} weeks` : "Estimate unavailable";
  }

  function whyStr(r: RecommendationData): string {
    return r.why_it_ranked[0] || r.summary.slice(0, 120);
  }

  function rankLabel(r: RecommendationData): { icon: string; label: string; style: string } {
    if (r.rank === 1) return { icon: "\uD83E\uDD47", label: "Recommended", style: "border-lime-500 bg-lime-50/50" };
    return { icon: "\uD83E\uDD48", label: "Alternative", style: "border-gray-200" };
  }

  return (
    <div className="bg-white min-h-screen">
      <div ref={printRef} />
      {primary && (
        <BlueprintPrint
          recommendation={primary}
          allRecommendations={recs}
          generatedAt={generatedAt}
          runId={runId || `run_${Date.now()}`}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* HEADER */}
        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Compass Recommendation</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            We evaluated multiple intervention strategies and identified the highest-impact implementation strategy based on comparable real-world evidence.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
            <span>Investigation Complete</span>
            <span>Engine v{ENGINE_VERSION}</span>
            <span>Dataset: {DATASET_VERSION}</span>
            <span>Generated {generatedAt}</span>
          </div>
        </div>

        {/* PRIMARY CTA */}
        <div className="text-center mb-12">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-8 py-3 bg-lime-500 text-white text-sm font-bold rounded-xl hover:bg-lime-600 transition-colors border border-lime-500 shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
            </svg>
            Accept Recommendation &amp; Generate Implementation Plan
          </button>
        </div>

        {/* RECOMMENDATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12">
          {recs.map((r) => {
            const rl = rankLabel(r);
            const isPrimary = r.rank === 1;

            return (
              <div key={r.rank} className={`bg-white border-2 rounded-xl p-6 flex flex-col ${rl.style} ${isPrimary ? "shadow-sm" : ""}`}>
                {/* Rank badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{rl.icon}</span>
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">{rl.label}</span>
                  </div>
                  <EvidenceBadge tier={r.evidence_summary.overall_tier} />
                </div>

                {/* Title */}
                <h2 className="text-base font-bold text-gray-900 mb-3">{r.title}</h2>

                {/* Why */}
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{whyStr(r)}</p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4 text-sm">
                  <Stat label="Estimated Annual Cost Savings" value={r.projected_impact.label} unsupported={!r.projected_impact.is_sufficiently_supported} />
                  <Stat label="Estimated Annual Time Savings" value={r.projected_impact.label} unsupported={!r.projected_impact.is_sufficiently_supported} />
                  <Stat label="Estimated Implementation Cost" value={r.projected_impact.label} unsupported={!r.projected_impact.is_sufficiently_supported} />
                  <Stat label="Implementation Duration" value={timelineStr(r)} />
                  <Stat label="Employees Required" value={r.summary.includes("team") ? "Existing team" : "2–5 FTEs"} />
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Confidence</div>
                    <ConfBar score={r.confidence.score} />
                  </div>
                </div>

                {/* Recommended tools */}
                <div className="mb-3">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Recommended Software</div>
                  <span className="text-xs font-medium text-gray-900">{r.title} platform / solution suite</span>
                </div>

                {/* Evidence panel */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Supporting Evidence</div>
                  {r.comparables.filter(c => c.evidence_tier !== "rejected").length > 0 ? (
                    <div className="space-y-1.5">
                      {r.comparables.filter(c => c.evidence_tier !== "rejected").slice(0, 5).map((c, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 py-1">
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-gray-900 truncate">{c.organization}</div>
                            <div className="text-[10px] text-gray-500 truncate">{c.outcome}</div>
                          </div>
                          <div className="shrink-0 flex items-center gap-1.5">
                            <EvidenceBadge tier={c.evidence_tier} />
                            <span className={`text-[10px] font-medium ${c.status === "successful" ? "text-green-600" : c.status === "partial" ? "text-amber-600" : "text-red-600"}`}>{c.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No comparable implementations available.</p>
                  )}
                  {r.timeline.low_weeks && r.timeline.high_weeks && (
                    <div className="mt-2 text-[10px] text-gray-400">Implementation timeline: {timelineStr(r)}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* NEGATIVE EVIDENCE */}
        {recs.some(r => r.negative_evidence.length > 0) && (
          <div className="mb-12">
            <h2 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Known Risks &amp; Failure Patterns</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-xs font-semibold text-amber-900 mb-2">Common Implementation Failures</div>
                  <ul className="space-y-1">
                    {recs.flatMap(r => r.negative_evidence.map(n => n.failure_reasons)).flat().slice(0, 5).map((reason, i) => (
                      <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">&#8226;</span>{reason}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold text-amber-900 mb-2">Conditions Where Performance Is Poor</div>
                  <ul className="space-y-1">
                    {recs.flatMap(r => r.negative_evidence).slice(0, 3).map((n, i) => (
                      <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">&#8226;</span>{n.intervention || n.organization} — failed at {n.organization}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold text-amber-900 mb-2">Lessons Learned</div>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Compass accounts for these failure patterns by adjusting confidence scores downward when conditions match known failure modes. The recommendation rankings already reflect these adjustments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IMPLEMENTATION SUMMARY */}
        <div className="mb-8">
          <h2 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Implementation Overview</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Teams Involved</div>
                <div className="text-sm text-gray-900">Operations, IT, Department stakeholders</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Business Owner</div>
                <div className="text-sm text-gray-900">Department head + Executive sponsor</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Project Duration</div>
                <div className="text-sm text-gray-900">{primary ? timelineStr(primary) : "Estimate unavailable"}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Internal Effort</div>
                <div className="text-sm text-gray-900">2–5 FTEs during implementation</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Dependencies</div>
                <div className="text-sm text-gray-900">Existing tool integration, data readiness</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Implementation Phases</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-gray-900 mb-1">Phase 1: Planning &amp; Setup</div>
                  <div className="text-[10px] text-gray-500">Stakeholder alignment, workflow audit, data assessment, team onboarding</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-gray-900 mb-1">Phase 2: Implementation</div>
                  <div className="text-[10px] text-gray-500">Core deployment, integration, testing, iteration based on feedback</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-gray-900 mb-1">Phase 3: Scale &amp; Optimize</div>
                  <div className="text-[10px] text-gray-500">Full rollout, monitoring setup, training, continuous improvement</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-gray-300">
          Compass AI &mdash; Evidence-driven recommendation engine
        </div>
      </div>
    </div>
  );
}

function buildProfile(answers: { questionId: string; value: any }[]) {
  const m = new Map<string, any>();
  for (const a of answers || []) m.set(a.questionId, a.value);

  const dept = (m.get("dept") as string) || "Operations";
  const dd = dept === "Customer Success" ? "customer_success" : dept === "People/HR" ? "human_resources" : dept.toLowerCase();
  const wf: Record<string, string> = {
    "Sales": "lead_qualification", "Marketing": "marketing_automation", "Customer Success": "customer_health_scoring",
    "Support": "ticketing", "Finance": "invoice_processing", "Product": "product_analytics",
    "Engineering": "ci_cd", "People/HR": "onboarding", "IT": "it_automation", "Supply Chain": "supply_chain",
    "Legal": "contract_review", "Operations": "process_automation",
  };

  const raw = m.get("desired-outcome") || "";
  const outcome = typeof raw === "string"
    ? raw.toLowerCase().includes("revenue") ? "revenue"
    : raw.toLowerCase().includes("cost") ? "cost"
    : raw.toLowerCase().includes("time") ? "time"
    : raw.toLowerCase().includes("satisfaction") ? "satisfaction"
    : raw.toLowerCase().includes("productivity") ? "productivity"
    : raw.toLowerCase().includes("compliance") ? "compliance"
    : raw.toLowerCase().includes("risk") ? "risk_reduction"
    : raw.toLowerCase().includes("quality") ? "quality"
    : raw.toLowerCase().includes("capacity") || raw.toLowerCase().includes("scale") ? "scale"
    : raw.toLowerCase().includes("manual") || raw.toLowerCase().includes("automation") ? "automation"
    : "efficiency"
    : "efficiency";

  return {
    business_function: dd,
    workflow: wf[dept] || "process_automation",
    problem_statement: m.get("situation") || `${dept} operations need optimization`,
    industry: "technology",
    company_size: "",
    workflow_frequency: m.get("frequency") || "",
    people_involved: m.get("people") || "",
    handoffs: m.get("handoffs") || "",
    current_tools: [],
    exception_rate: m.get("exceptions") || "",
    budget_range: m.get("budget") || "",
    implementation_timeline: m.get("timeline") || "",
    business_risk: m.get("risk") || "",
    process_stability: m.get("stability") || "",
    previous_attempts: m.get("prior-attempts") || "",
    desired_outcome: outcome,
  };
}
