"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY = "compass-assessment-session";

interface ComparableEvidence {
  record_id: string; organization: string; intervention: string;
  workflow: string; problem: string; workflow_context: string;
  intervention_category: string; intervention_description: string;
  implementation_status: string; observed_outcome: string;
  outcome_summary: string; evidence_tier: string; evidence_score: number;
  similarity_score: number; relevance_explanation: string;
  limitations: string; source_url: string; publication_date: string;
  normalized_metrics: { metric: string; value: string; raw: string }[];
}

interface ImpactEstimate {
  status: string; low: number | null; expected: number | null; high: number | null;
  currency: string; basis: string; confidence: string;
  missing_inputs: string[]; what_can_be_reported: string; prompt_for_user: string;
}

interface TimelineEstimate {
  min_weeks: number | null; expected_weeks: number | null; max_weeks: number | null; basis: string;
}

interface ProjectTeam {
  min_people: number; expected_people: number; max_people: number; roles: string[]; basis: string;
}

interface ImpactSummary {
  annual_savings: ImpactEstimate; annual_hours_returned: ImpactEstimate;
  implementation_timeline: TimelineEstimate; project_team: ProjectTeam;
}

interface OutcomeRange {
  metric_key: string; metric_label: string; metric_category: string;
  unit: string; direction: string;
  low: number | null; median: number | null; high: number | null;
  sample_size: number; gold_count: number; silver_count: number; bronze_count: number;
  directly_comparable: boolean; compatibility_notes: string;
  calculation_method: string; source_record_ids: string[];
}

interface Assumption {
  title: string; explanation: string; effect_on_recommendation: string;
  effect_on_confidence: string; resolution_action: string;
}

interface InformationGap {
  title: string; explanation: string; effect_on_recommendation: string;
  effect_on_confidence: string; resolution_action: string;
}

interface NextValidationStep {
  action: string; purpose: string; owner: string; duration: string;
  required_inputs: string[]; success_criteria: string; decision_enabled: string;
}

interface SpecificIntervention {
  title: string; description: string;
  required_changes: string[]; scope_boundaries: string[];
  prerequisites: string[]; excluded_scope: string[];
}

interface RecommendationData {
  rank: number; is_compass_choice: boolean; intervention_id: string;
  category: string; title: string; specific_action: string;
  specific_intervention: SpecificIntervention;
  subtitle: string; description: string;
  selection_status: string; rationale: string; why_it_ranked_here: string[];
  assumptions: string[];
  confidence: { score: number; label: string; explanation: string };
  impact: ImpactSummary;
  evidence_summary: {
    overall_tier: string; total_comparables: number; gold_count: number;
    silver_count: number; bronze_count: number; average_evidence_score: number;
  };
  outcome_ranges: OutcomeRange[];
  why_ranked_first: {
    summary: string; supporting_reasons: string[]; tradeoffs: string[];
    alternative_differences: { alternative: string; rank: number; reasons: string[]; when_to_consider: string }[];
  } | null;
  alternative_comparison: {
    category: string; specific_intervention: string; rank: number;
    evidence_strength: string; outcome_support: string; data_requirements: string;
    implementation_complexity: string; expected_timeline: string;
    team_requirements: string; time_to_value: string;
    primary_advantages: string[]; primary_limitations: string[]; reason_for_rank: string;
  } | null;
  comparable_implementations: ComparableEvidence[];
  risks: any[];
  alternatives_considered: { family: string; reason: string; confidence_score: number }[];
  assumptions_detail: Assumption[];
  information_gaps: InformationGap[];
  next_validation_step: NextValidationStep | null;
}

const TIER_CONFIG: Record<string, { label: string; badge: string }> = {
  gold: { label: "Gold", badge: "bg-yellow-50 text-yellow-800 border-yellow-300" },
  silver: { label: "Silver", badge: "bg-gray-100 text-gray-600 border-gray-300" },
  bronze: { label: "Bronze", badge: "bg-orange-50 text-orange-800 border-orange-300" },
  insufficient: { label: "Insufficient", badge: "bg-red-50 text-red-700 border-red-200" },
};

const BAD_PATTERNS = [/^unknown$/i, /^null$/i, /^undefined$/i, /^n\/?a$/i, /^\s*$/, /^none$/i, /^not\s+available/i];

function tierBadge(tier: string): string {
  return (TIER_CONFIG[tier?.toLowerCase()] || TIER_CONFIG.insufficient).badge;
}

function tierLabel(tier: string): string {
  return (TIER_CONFIG[tier?.toLowerCase()] || TIER_CONFIG.insufficient).label;
}

function formatCurrency(n: number | null | undefined): string {
  if (n == null) return "";
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

function formatHours(n: number | null | undefined): string {
  if (n == null) return "";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

function isBadValue(s: string | null | undefined): boolean {
  if (!s || typeof s !== "string") return true;
  return BAD_PATTERNS.some((p) => p.test(s.trim()));
}

function formatCompany(name: string): string {
  if (isBadValue(name)) return "Verified implementation";
  return name.replace(/[^\w\s&.-]/g, "").trim().slice(0, 30);
}

function companyInitials(name: string): string {
  return name.split(/[\s-]+/).map((w) => w[0]).join("").toUpperCase().slice(0, 3);
}

function timelineDisplay(tl: TimelineEstimate): string {
  if (tl.min_weeks && tl.max_weeks) return `${tl.min_weeks}–${tl.max_weeks} weeks`;
  if (tl.expected_weeks) return `${tl.expected_weeks} weeks`;
  return "Not available";
}

function teamDisplay(team: ProjectTeam): string {
  if (team.min_people && team.max_people) return `${team.min_people}–${team.max_people} people`;
  if (team.expected_people) return `${team.expected_people} people`;
  return "Not available";
}

function formatNum(n: number, unit: string): string {
  if (unit === "%") return `${n}%`;
  if (unit === "currency") return `$${Math.round(n).toLocaleString()}`;
  return Math.round(n).toLocaleString();
}

function formatRange(r: OutcomeRange): string {
  if (!r.directly_comparable) return r.compatibility_notes || "Incompatible metrics";
  if (r.calculation_method === "single_value" && r.median != null) {
    return formatNum(r.median, r.unit);
  }
  if (r.low != null && r.high != null) {
    const low = formatNum(r.low, r.unit);
    const high = formatNum(r.high, r.unit);
    return `${low}–${high}`;
  }
  return "";
}

function formatDirection(d: string): string {
  if (d === "reduction") return "reduction";
  if (d === "improvement") return "improvement";
  return d;
}

function formatDirectionPast(d: string): string {
  if (d === "reduction") return "reduced";
  if (d === "improvement") return "improved";
  return d;
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="bg-white min-h-screen flex items-center justify-center"><div className="w-7 h-7 border-2 border-gray-300 border-t-brand-green rounded-full animate-spin" /></div>}>
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
  const [recId, setRecId] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = searchParams?.get("recommendation_id");
    if (id) loadRun(id);
    else submit();
  }, [searchParams]);

  async function loadRun(id: string, retries = 2) {
    try {
      setLoading(true);
      setLoadError(null);
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const r = await fetch(`/api/recommendations?recommendation_id=${encodeURIComponent(id)}`);
          if (r.ok) {
            const d = await r.json();
            setRecs(d.recommendations || []);
            setRecId(id);
            return;
          }
          if (r.status === 404) {
            throw new Error("Recommendation not found.");
          }
          if (attempt < retries) {
            await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
            continue;
          }
          throw new Error((await r.json().catch(() => ({}))).error || "Failed to load");
        } catch (fetchErr: any) {
          if (fetchErr.message === "Recommendation not found.") throw fetchErr;
          if (attempt >= retries) throw fetchErr;
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    } catch (e: any) {
      setLoadError(e.message || "Failed to load");
    } finally { setLoading(false); }
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
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      if (!res.ok) {
        const t = await res.text();
        let m = `Error (${res.status})`, ty = "err";
        try { const e = JSON.parse(t); m = e.error || m; ty = e.type || ty; } catch {}
        throw new Error(ty === "engine_unreachable" ? "Engine unreachable. Please try again." : m);
      }
      const d = await res.json();
      setRecs(d.recommendations || []);
      if (d.recommendation_id) {
        window.history.replaceState({}, "", `/assessment/results?recommendation_id=${encodeURIComponent(d.recommendation_id)}`);
        setRecId(d.recommendation_id);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }



  const ts = new Date().toISOString().slice(0, 10);

  if (loading) return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-brand-green rounded-full animate-spin mx-auto mb-3" />
        <div className="text-xs text-[#4f6280] font-semibold mb-1">Analyzing comparable implementations</div>
      </div>
    </div>
  );

  if (loadError) {
    const isNotFound = loadError.includes("not found");
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          {isNotFound ? (
            <>
              <p className="text-sm text-[#4f6280] font-semibold mb-1">Recommendation not found</p>
              <p className="text-xs text-[#5f718f] mb-4">This link may be incomplete or the recommendation may no longer be available.</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => router.push("/assessment")} className="px-4 py-1.5 bg-brand-green text-white text-xs font-bold rounded-lg hover:bg-brand-green-dark">Start new assessment</button>
                <button onClick={() => router.push("/")} className="px-4 py-1.5 border border-[#cad3df] text-[#4f6280] text-xs font-bold rounded-lg">Return home</button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-[#4f6280] font-semibold mb-1">Recommendation temporarily unavailable</p>
              <p className="text-xs text-[#5f718f] mb-4">Your result has not been deleted.</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => { setLoadError(null); if (recId) loadRun(recId); else submit(); }} className="px-4 py-1.5 bg-brand-green text-white text-xs font-bold rounded-lg hover:bg-brand-green-dark">Retry</button>
                <button onClick={() => router.push("/assessment")} className="px-4 py-1.5 border border-[#cad3df] text-[#4f6280] text-xs font-bold rounded-lg">Back</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!recs.length) return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-sm text-[#4f6280] font-semibold mb-1">No recommendations generated</p>
        <p className="text-xs text-[#5f718f] mb-4">The assessment did not produce results.</p>
        <button onClick={() => router.push("/assessment")} className="px-4 py-1.5 border border-[#cad3df] text-[#4f6280] text-xs font-bold rounded-lg">Back</button>
      </div>
    </div>
  );

  const top = recs[0];
  const alternatives = recs.slice(1);

  function AlternativeCard({ rec, accent }: { rec: RecommendationData; accent: "blue" | "orange" }) {
    const borderClass = accent === "blue" ? "border-brand-blue/30" : "border-brand-orange/30";
    const rankBg = accent === "blue" ? "bg-[#657386]" : "bg-[#a8490c]";
    const badgeText = accent === "blue" ? "Alternative" : "Alternative";
    return (
      <section className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${borderClass}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shrink-0 ${rankBg}`}>{rec.rank}</span>
          <span className="text-[11px] font-extrabold text-[#4f6280] uppercase">{badgeText}</span>
          <span className="text-[10px] text-[#5f718f] ml-auto">{Math.round(rec.confidence.score * 100)}% evidence strength</span>
        </div>
        <h3 className="text-[16px] font-extrabold tracking-[-0.01em] text-[#101826] mb-1">{rec.title}</h3>
        {rec.subtitle && <p className="text-[11px] text-[#4f6280] mb-3">{rec.subtitle}</p>}
        {rec.alternative_comparison && (
          <div className="grid grid-cols-2 gap-2 mb-3 text-[10px]">
            <div><span className="text-[#5f718f]">Evidence:</span> <span className="font-bold text-[#101826]">{rec.alternative_comparison.evidence_strength}</span></div>
            <div><span className="text-[#5f718f]">Outcome support:</span> <span className="font-bold text-[#101826]">{rec.alternative_comparison.outcome_support}</span></div>
            <div><span className="text-[#5f718f]">Complexity:</span> <span className="font-bold text-[#101826]">{rec.alternative_comparison.implementation_complexity}</span></div>
            <div><span className="text-[#5f718f]">Timeline:</span> <span className="font-bold text-[#101826]">{rec.alternative_comparison.expected_timeline}</span></div>
          </div>
        )}
        {rec.evidence_summary && (
          <p className="text-[10px] text-[#5f718f] mb-2">{rec.evidence_summary.total_comparables} comparable implementations</p>
        )}
        {rec.alternative_comparison?.reason_for_rank && (
          <p className="text-[10px] text-[#4f6280] italic">{rec.alternative_comparison.reason_for_rank}</p>
        )}
      </section>
    );
  }

  return (
    <div className="bg-[#fbfcfd] min-h-screen">
      <div ref={contentRef} className="w-full max-w-[1000px] mx-auto px-[min(36px,5vw)] pt-24 pb-8">
        <div id="compass-report-content" className="space-y-3">

          {/* ===== 1. EXECUTIVE SUMMARY ===== */}
          <header className="bg-white rounded-2xl p-8 shadow-sm border border-[#dfe5ec]">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-[28px] sm:text-[34px] font-extrabold tracking-[-0.04em] text-[#101826] m-0 leading-tight">Recommendation</h1>
                  <span className="px-3 py-1 rounded-full bg-brand-green-light text-brand-green-dark text-[11px] font-extrabold uppercase whitespace-nowrap">Recommendation Complete</span>
                </div>
                <p className="text-[#4f6280] font-semibold mt-1 mb-2 text-[15px]">Evidence-based findings for your operational assessment</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] font-semibold text-[#5f718f]">
                  <span>Generated {ts}</span>
                  <span>Engine v3.0.0</span>
                  <span>Dataset v3</span>
                  <span>{top.evidence_summary.total_comparables} comparable implementations</span>
                </div>
              </div>
            </div>
          </header>

          {/* ===== 2. INVESTIGATION SUMMARY ===== */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#dfe5ec]">
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
              <div><span className="font-bold text-[#4f6280]">Problem:</span> <span className="text-[#101826]">{top.specific_action || top.title}</span></div>
              <div><span className="font-bold text-[#4f6280]">Workflow:</span> <span className="text-[#101826]">{top.intervention_id?.replace(/_/g, " ") || "Process"}</span></div>
              <div><span className="font-bold text-[#4f6280]">Evidence:</span> <span className="text-[#101826]">{top.evidence_summary.total_comparables} comparable implementations</span></div>
              <div><span className="font-bold text-[#4f6280]">Evidence strength:</span> <span className="text-[#101826]">{Math.round(top.confidence.score * 100)}% ({top.confidence.label})</span></div>
            </div>
          </section>

          {/* ===== 3. PRIMARY RECOMMENDATION ===== */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border-2 border-brand-green shadow-[0_8px_32px_-8px_rgba(25,164,58,0.12)]">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#d7a500] text-white flex items-center justify-center text-[12px] font-extrabold">1</span>
              <span className="px-3 py-0.5 rounded-full bg-brand-green-light text-brand-green-dark text-[11px] font-extrabold uppercase">Evidence supports this path</span>
              <span className="text-[12px] font-bold text-[#5f718f] ml-auto">{Math.round(top.confidence.score * 100)}% evidence strength</span>
            </div>

            {/* Title + Category */}
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#101826] mb-1 leading-[1.2]">
              {top.specific_action || top.title}
            </h2>
            {top.subtitle && (
              <p className="text-[12px] font-semibold text-[#4f6280] mb-4">{top.subtitle}</p>
            )}

            {/* Category + Confidence badge row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="px-2.5 py-1 rounded-full bg-mist text-forest text-[10px] font-extrabold">{top.category?.replace(/_/g, " ")}</span>
            </div>

            {/* Potential impact */}
            {top.outcome_ranges && top.outcome_ranges.filter(r => r.directly_comparable).length > 0 && (
              <div className="mb-5 p-4 bg-[#f6f8fa] rounded-xl border border-[#e6eaef]">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#5f718f] mb-2.5">Potential impact observed across comparable implementations</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {top.outcome_ranges.filter(r => r.directly_comparable).slice(0, 3).map((r, i) => {
                    const label = r.unit === "currency" ? "Annual cost savings" : r.unit === "number" ? "Annual time savings" : r.metric_label;
                    return (
                      <div key={i}>
                        <div className="text-[17px] font-extrabold text-[#101826]">{formatRange(r)}</div>
                        <div className="text-[9px] font-bold text-[#586984] uppercase tracking-[0.04em]">{r.direction} in {label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Why this path */}
            {top.why_ranked_first && (
              <div className="mb-5 border-t border-[#ebeff4] pt-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#5f718f] mb-2">Why this path</p>
                <p className="text-[12px] text-[#4f6280] leading-[1.6] mb-3">{top.why_ranked_first.summary}</p>
                {top.why_ranked_first.supporting_reasons.length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {top.why_ranked_first.supporting_reasons.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-[#4f6280]">
                        <span className="text-brand-green mt-0.5 shrink-0">&#10003;</span>{s}
                      </li>
                    ))}
                  </ul>
                )}
                {top.why_ranked_first.tradeoffs.length > 0 && (
                  <div className="bg-[#fcf8f0] rounded-xl px-4 py-3 border border-[#f0e8d4]">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.06em] text-[#5f718f] mb-1">Tradeoffs</p>
                    <ul className="space-y-0.5">
                      {top.why_ranked_first.tradeoffs.map((t, i) => (
                        <li key={i} className="text-[11px] text-[#4f6280] flex items-start gap-2">
                          <span className="text-[#a8490c] mt-0.5 shrink-0">&#8226;</span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ===== 4. ALTERNATIVES ===== */}
          {alternatives.length > 0 && alternatives.filter(r => r.rank === 2).length > 0 && (
            <AlternativeCard rec={alternatives.filter(r => r.rank === 2)[0]} accent="blue" />
          )}
          {alternatives.length > 0 && alternatives.filter(r => r.rank === 3).length > 0 && (
            <AlternativeCard rec={alternatives.filter(r => r.rank === 3)[0]} accent="orange" />
          )}

          {/* ===== 5. RISK ASSESSMENT ===== */}
          {top.risks?.length > 0 && (
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#efc8ca]">
              <h2 className="text-[17px] font-extrabold tracking-[-0.01em] text-[#101826] mb-5">Risk Assessment</h2>
              <div className="space-y-3">
                {top.risks.slice(0, 4).map((risk, i) => (
                  <div key={i} className="bg-[#fff8f8] rounded-xl p-4 border border-[#efc8ca]">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[13px] font-extrabold text-[#1b2432]">{risk.title || risk.category || "Risk"}</p>
                      {risk.severity && (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${risk.severity === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-800"}`}>{risk.severity}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#4f6280] leading-[1.5] mb-2">{risk.explanation || risk.risk || ""}</p>
                    {risk.mitigation && (
                      <p className="text-[11px] text-brand-green-dark font-semibold">Mitigation: {risk.mitigation}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===== 6. ASSUMPTIONS & INFORMATION GAPS ===== */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#dfe5ec]">
            <h2 className="text-[17px] font-extrabold tracking-[-0.01em] text-[#101826] mb-5">Assumptions &amp; Information Gaps</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#5f718f] mb-3">What Compass knows</p>
                <div className="space-y-2.5">
                  {top.assumptions_detail?.length > 0 ? top.assumptions_detail.map((a, i) => (
                    <div key={i} className="bg-[#f6f8fa] rounded-xl px-4 py-3 border border-[#e6eaef]">
                      <p className="text-[12px] font-bold text-[#4f6280]">{a.title}</p>
                      <p className="text-[11px] text-[#4f6280] leading-[1.4] mt-0.5">{a.explanation}</p>
                    </div>
                  )) : <p className="text-[11px] text-[#5f718f]">No significant assumptions identified.</p>}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#5f718f] mb-3">What would improve this analysis</p>
                <div className="space-y-2.5">
                  {top.information_gaps?.length > 0 ? top.information_gaps.map((g, i) => (
                    <div key={i} className="bg-[#fcf8f0] rounded-xl px-4 py-3 border border-[#f0e8d4]">
                      <p className="text-[12px] font-bold text-[#4f6280]">{g.title}</p>
                      <p className="text-[11px] text-[#4f6280] leading-[1.4] mt-0.5">{g.explanation}</p>
                      <p className="text-[10px] text-brand-green-dark font-semibold mt-1">Resolution: {g.resolution_action}</p>
                    </div>
                  )) : <p className="text-[11px] text-[#5f718f]">No major information gaps identified.</p>}
                </div>
              </div>
            </div>
          </section>

          {/* ===== 7. NEXT VALIDATION STEP ===== */}
          {top.next_validation_step && (
            <section className="bg-white rounded-2xl p-8 shadow-sm border-2 border-brand-green/40 shadow-[0_8px_32px_-8px_rgba(25,164,58,0.10)]">
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-full bg-brand-green-light flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-brand-green-dark text-[18px] font-extrabold">&#8594;</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-[18px] font-extrabold tracking-[-0.01em] text-[#101826] mb-1">Next step</h2>
                  <p className="text-[16px] font-bold text-[#101826] mb-2">{top.next_validation_step.action}</p>
                  <p className="text-[12px] text-[#4f6280] leading-[1.5] mb-3"><span className="font-bold">Purpose:</span> {top.next_validation_step.purpose}</p>
                  <div className="flex flex-wrap gap-x-8 gap-y-1 text-[11px] text-[#5f718f]">
                    <span><span className="font-bold">Owner:</span> {top.next_validation_step.owner}</span>
                    <span><span className="font-bold">Duration:</span> {top.next_validation_step.duration}</span>
                  </div>
                  {top.next_validation_step.success_criteria && (
                    <p className="text-[11px] text-[#586984] mt-2"><span className="font-bold">Success criteria:</span> {top.next_validation_step.success_criteria}</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ===== 8. METHODOLOGY ===== */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#dfe5ec] text-[11px] text-[#5f718f] leading-[1.6]">
            <p>
              Compass compares your operational problem against comparable real-world implementations. Recommendations are ranked using workflow similarity, evidence quality, implementation complexity, organizational readiness, and measured outcomes. The database contains {top.evidence_summary.total_comparables} implementations relevant to this assessment. Outcomes observed in comparable organizations do not guarantee identical results.
            </p>
          </section>
        </div>
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
    Sales: "lead_qualification", Marketing: "marketing_automation", "Customer Success": "customer_health_scoring",
    Support: "ticketing", Finance: "invoice_processing", Product: "product_analytics",
    Engineering: "ci_cd", HR: "onboarding", IT: "it_automation", "Supply Chain": "supply_chain",
    Manufacturing: "manufacturing", Legal: "contract_review", Operations: "process_automation",
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
    industry: dd === "engineering" || dd === "it" || dd === "product" ? "technology" : dd === "manufacturing" ? "manufacturing" : dd === "supply_chain" ? "logistics" : dd === "legal" ? "legal" : dd === "finance" ? "financial_services" : dd === "hr" ? "human_resources" : "professional_services",
    company_size: "",
    workflow_frequency: m.get("frequency") || "", people_involved: m.get("people") || "",
    handoffs: m.get("handoffs") || "", current_tools: [],
    exception_rate: m.get("exceptions") || "", budget_range: m.get("budget") || "",
    implementation_timeline: m.get("timeline") || "", business_risk: m.get("risk") || "",
    process_stability: m.get("stability") || "", previous_attempts: m.get("prior-attempts") || "",
    desired_outcome: outcome,
  };
}
