"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlueprintPrint } from "@/components/results/blueprint-print";
import type { RecommendationData } from "@/components/results/compass-choice";

const STORAGE_KEY = "compass-assessment-session";
const ENGINE_VERSION = "2.0.0";
const DATASET_VERSION = "v1 (baseline)";

const TIER_PALETTE: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  gold: { label: "Gold", dot: "bg-yellow-400", bg: "bg-yellow-50", text: "text-yellow-800" },
  silver: { label: "Silver", dot: "bg-gray-400", bg: "bg-gray-50", text: "text-gray-600" },
  bronze: { label: "Bronze", dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-800" },
};

function TinyBadge({ tier }: { tier: string }) {
  const p = TIER_PALETTE[tier] || TIER_PALETTE.bronze;
  return <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${p.bg} ${p.text}`}>{p.label}</span>;
}

function Stars({ score, size = 12 }: { score: number; size?: number }) {
  const full = Math.round(score / 20);
  return (
    <span className="text-gray-800" style={{ fontSize: size, letterSpacing: "0.05em" }}>
      {"★".repeat(Math.min(full, 5))}{"☆".repeat(Math.max(0, 5 - full))}
    </span>
  );
}

function Metric({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div>
      <div className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">{label}</div>
      <div className={`${big ? "text-lg sm:text-xl font-bold" : "text-sm font-semibold"} text-gray-900`}>{value}</div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="bg-white min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-gray-300 border-t-lime-500 rounded-full animate-spin" /></div>}>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [recs, setRecs] = useState<RecommendationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [progressIdx, setProgressIdx] = useState(0);
  const [runId, setRunId] = useState("");
  const [showBP, setShowBP] = useState(false);
  const SG = ["Analyzing your workflow","Comparing intervention paths","Retrieving comparable implementations","Evaluating evidence strength"];

  useEffect(() => {
    const id = searchParams?.get("run_id");
    if (id) loadRun(id); else submit();
  }, [searchParams]);
  useEffect(() => {
    if (!loading) return;
    const i = setInterval(() => setProgressIdx(p => Math.min(p + 1, SG.length - 1)), 6000);
    return () => clearInterval(i);
  }, [loading]);

  async function loadRun(id: string) {
    try {
      setLoading(true);
      const r = await fetch(`/api/recommendations?run_id=${id}`);
      if (!r.ok) throw new Error((await r.json()).error || "Failed");
      const d = await r.json();
      setRecs(d.recommendations || []); setRunId(id);
    } catch (e) { setLoadError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }

  async function submit() {
    try {
      setLoading(true);
      const raw = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
      if (!raw) { setLoadError("Session not found."); setLoading(false); return; }
      let s: any;
      try { s = JSON.parse(raw); } catch { setLoadError("Corrupted session."); setLoading(false); return; }
      if (!s.completed || !s.answers?.length) { setLoadError("Incomplete investigation."); setLoading(false); return; }

      const p = buildProfile(s.answers);
      const res = await fetch("/api/recommendations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      if (!res.ok) {
        const t = await res.text(); let m = `Error (${res.status})`, ty = "err";
        try { const e = JSON.parse(t); m = e.error || m; ty = e.type || ty; } catch {}
        const pr = ty === "config_error" ? "Config" : ty === "engine_unreachable" ? "Unreachable" : ty === "engine_error" ? "Engine" : "Error";
        throw new Error(`${pr}: ${m}`);
      }
      const d = await res.json();
      setRecs(d.recommendations || []);
      if (d.recommendation_run_id) { window.history.replaceState({}, "", `/assessment/results?run_id=${d.recommendation_run_id}`); setRunId(d.recommendation_run_id); sessionStorage.removeItem(STORAGE_KEY); }
    } catch (e) { setLoadError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }

  const ts = new Date().toISOString();

  if (loading) return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-lime-500 rounded-full animate-spin mx-auto mb-3" />
        <div className="text-xs text-gray-400 mb-1">{SG[progressIdx]}</div>
        <div className="w-full bg-gray-100 rounded-full h-0.5 mt-3 overflow-hidden">
          <div className="h-full bg-lime-500 rounded-full transition-all duration-1000" style={{ width: `${((progressIdx + 1) / SG.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );

  if (loadError) return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-3">
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <p className="text-sm text-gray-500 mb-4">{loadError}</p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => { setLoadError(null); submit(); }} className="px-4 py-1.5 bg-lime-500 text-white text-xs font-semibold rounded-lg hover:bg-lime-600">Retry</button>
          <button onClick={() => router.push("/assessment")} className="px-4 py-1.5 border border-gray-300 text-gray-600 text-xs font-medium rounded-lg">Back</button>
        </div>
      </div>
    </div>
  );

  if (!recs.length) return null;

  const primary = recs[0];
  const hasImpact = primary.projected_impact.is_sufficiently_supported;
  const headline = hasImpact ? primary.projected_impact.label : "Pending Analysis";

  return (
    <div className="bg-white min-h-screen">
      {showBP && primary && <BlueprintPrint recommendation={primary} allRecommendations={recs} generatedAt={ts} runId={runId || `r_${Date.now()}`} onClose={() => setShowBP(false)} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* HERO — BIG NUMBER */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span>Compass Recommendation</span>
            <span className="text-gray-300">·</span>
            <span>v{ENGINE_VERSION}</span>
            <span className="text-gray-300">·</span>
            <span>{ts}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Expected Business Outcome</div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">{headline}</div>
            </div>
            <button onClick={() => setShowBP(true)} className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2 bg-lime-500 text-white text-xs font-bold rounded-lg hover:bg-lime-600 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Blueprint & PDF
            </button>
          </div>
        </div>

        {/* CARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          {recs.map((r) => {
            const is1 = r.rank === 1;
            const label = r.rank === 1 ? "Recommended" : "Alternative";
            const icon = r.rank === 1 ? "\uD83E\uDD47" : "\uD83E\uDD48";
            const border = is1 ? "border-lime-500/60 ring-1 ring-lime-500/20" : "border-gray-200";
            const impactOk = r.projected_impact.is_sufficiently_supported;
            const pct = Math.round(r.confidence.score * 100);

            return (
              <div key={r.rank} className={`bg-white border-2 ${border} rounded-xl p-5 flex flex-col`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{icon}</span>
                    <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">{label}</span>
                  </div>
                  <Stars score={pct} size={11} />
                </div>

                <div className="text-xs font-semibold text-gray-900 mb-3">{r.title}</div>

                {/* Scorecard metrics */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-3">
                  <Metric label="Annual Savings" value={impactOk ? r.projected_impact.label : "—"} big />
                  <Metric label="Hours Returned" value={impactOk ? r.projected_impact.label : "—"} big />
                  <Metric label="Duration" value={r.timeline.low_weeks && r.timeline.high_weeks ? `${r.timeline.low_weeks}–${r.timeline.high_weeks} wks` : "—"} />
                  <Metric label="Project Team" value={r.evidence_summary.total_comparables > 0 ? `${Math.ceil(r.evidence_summary.total_comparables / 5)}–${Math.ceil(r.evidence_summary.total_comparables / 3)} people` : "—"} />
                </div>

                {/* Tool stack */}
                <div className="mb-3">
                  <div className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Tool Stack</div>
                  <div className="flex flex-wrap gap-1">
                    {r.intervention_category.split("_").map((t, i) => (
                      <span key={i} className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-medium">{t}</span>
                    ))}
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded italic">+integrations</span>
                  </div>
                </div>

                {/* Evidence compact */}
                <div className="pt-3 border-t border-gray-100 mt-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Evidence</span>
                    <TinyBadge tier={r.evidence_summary.overall_tier} />
                  </div>
                  {r.comparables.filter(c => c.evidence_tier !== "rejected").length > 0 ? (
                    <div className="space-y-1">
                      {r.comparables.filter(c => c.evidence_tier !== "rejected").slice(0, 3).map((c, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 py-0.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[11px] font-medium text-gray-900 truncate">{c.organization}</span>
                            <Stars score={c.evidence_score} size={9} />
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] text-gray-500">{c.outcome.length > 20 ? c.outcome.slice(0, 20) + "…" : c.outcome}</span>
                            <span className="text-[9px] text-gray-400 font-mono">{Math.round(c.similarity_score)}%</span>
                          </div>
                        </div>
                      ))}
                      {r.comparables.filter(c => c.evidence_tier !== "rejected").length > 3 && (
                        <div className="text-[10px] text-gray-400 pt-0.5">+{r.comparables.filter(c => c.evidence_tier !== "rejected").length - 3} more</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[10px] text-gray-400 italic">No comparable implementations</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM ROW: Confidence + Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Confidence */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold mb-3">Confidence Breakdown</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {[
                { l: "Evidence Quality", v: Math.min(primary.evidence_summary.average_evidence_score / 100, 1) },
                { l: "Workflow Match", v: primary.comparables.length > 0 ? Math.min(primary.comparables.reduce((s, c) => s + c.similarity_score, 0) / primary.comparables.length / 100, 1) : 0 },
                { l: "Outcome Consistency", v: primary.evidence_summary.failed_comparables > 0 ? Math.max(0, 1 - primary.evidence_summary.failed_comparables / Math.max(primary.evidence_summary.total_comparables, 1)) : 0.8 },
                { l: "Data Completeness", v: Math.min(primary.evidence_summary.total_comparables / 30, 1) },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-600 w-28 shrink-0">{f.l}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gray-800" style={{ width: `${Math.round(f.v * 100)}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 w-6 text-right">{Math.round(f.v * 100)}%</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[10px] text-gray-400 italic">{primary.confidence.explanation}</div>
          </div>

          {/* Risks */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold mb-3">Known Risks</div>
            <div className="space-y-2">
              {primary.risks.length > 0 ? primary.risks.slice(0, 4).map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 text-[11px] mt-0.5">⚠</span>
                  <span className="text-[11px] text-gray-700">{r}</span>
                </div>
              )) : primary.negative_evidence.length > 0 ? primary.negative_evidence.slice(0, 4).flatMap(n => n.failure_reasons).slice(0, 4).map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 text-[11px] mt-0.5">⚠</span>
                  <span className="text-[11px] text-gray-700">{r}</span>
                </div>
              )) : <div className="text-[11px] text-gray-400 italic">No significant risks identified</div>}
            </div>
            <div className="mt-3 text-[10px] text-gray-400 italic">Lessons learned from failed implementations are factored into confidence scores.</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[9px] text-gray-300">Compass AI — Evidence-driven recommendation engine</div>
      </div>
    </div>
  );
}

function buildProfile(answers: { questionId: string; value: any }[]) {
  const m = new Map<string, any>();
  for (const a of answers || []) m.set(a.questionId, a.value);
  const dept = (m.get("dept") as string) || "Operations";
  const dd = dept === "Customer Success" ? "customer_success" : dept === "HR" ? "human_resources" : dept.toLowerCase();
  const wf: Record<string, string> = {
    "Sales": "lead_qualification", "Marketing": "marketing_automation", "Customer Success": "customer_health_scoring",
    "Support": "ticketing", "Finance": "invoice_processing", "Product": "product_analytics",
    "Engineering": "ci_cd", "HR": "onboarding", "IT": "it_automation", "Supply Chain": "supply_chain",
    "Manufacturing": "manufacturing", "Legal": "contract_review", "Operations": "process_automation",
  };
  const raw = m.get("desired-outcome") || "";
  const outcome = typeof raw === "string"
    ? raw.toLowerCase().includes("revenue") ? "revenue" : raw.toLowerCase().includes("cost") ? "cost"
    : raw.toLowerCase().includes("time") ? "time" : raw.toLowerCase().includes("satisfaction") ? "satisfaction"
    : raw.toLowerCase().includes("productivity") ? "productivity" : raw.toLowerCase().includes("compliance") ? "compliance"
    : raw.toLowerCase().includes("risk") ? "risk_reduction" : raw.toLowerCase().includes("quality") ? "quality"
    : raw.toLowerCase().includes("capacity") || raw.toLowerCase().includes("scale") ? "scale"
    : raw.toLowerCase().includes("manual") || raw.toLowerCase().includes("automation") ? "automation" : "efficiency"
    : "efficiency";
  return {
    business_function: dd, workflow: wf[dept] || "process_automation",
    problem_statement: m.get("situation") || `${dept} ops optimization`,
    industry: "technology", company_size: "",
    workflow_frequency: m.get("frequency") || "", people_involved: m.get("people") || "",
    handoffs: m.get("handoffs") || "", current_tools: [],
    exception_rate: m.get("exceptions") || "", budget_range: m.get("budget") || "",
    implementation_timeline: m.get("timeline") || "", business_risk: m.get("risk") || "",
    process_stability: m.get("stability") || "", previous_attempts: m.get("prior-attempts") || "",
    desired_outcome: outcome,
  };
}
