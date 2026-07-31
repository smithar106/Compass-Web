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
  source_title?: string; supporting_passage?: string;
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

function isCurrency(metricLabel: string, unit: string): boolean {
  if (unit === "currency") return true;
  const label = metricLabel.toLowerCase();
  return label.includes("cost") || label.includes("savings") || label.includes("revenue") || label.includes("annual $");
}

function formatNum(n: number, unit: string, metricLabel?: string): string {
  if (unit === "%") return `${n}%`;
  if (isCurrency(metricLabel || "", unit)) return `$${Math.round(n).toLocaleString()}`;
  return Math.round(n).toLocaleString();
}

function formatRange(r: OutcomeRange): string {
  if (!r.directly_comparable) return r.compatibility_notes || "Incompatible metrics";
  if (r.calculation_method === "single_value" && r.median != null) {
    return formatNum(r.median, r.unit, r.metric_label);
  }
  if (r.low != null && r.high != null) {
    const low = formatNum(r.low, r.unit, r.metric_label);
    const high = formatNum(r.high, r.unit, r.metric_label);
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
  const [entryMode, setEntryMode] = useState<string | null>(null);
  const [proposed, setProposed] = useState<{ intervention: string; category: string } | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
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
            setMeta(d.methodology || null);
            setSummary(d.assessment_summary || null);
            setRecId(id);
            return;
          }
          if (r.status === 404) {
            throw new Error("Decision not found.");
          }
          if (attempt < retries) {
            await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
            continue;
          }
          throw new Error((await r.json().catch(() => ({}))).error || "Failed to load");
        } catch (fetchErr: any) {
          if (fetchErr.message === "Decision not found.") throw fetchErr;
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

      setEntryMode(s.mode || null);
      setProposed(s.proposed || null);

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
        throw new Error(ty === "engine_unreachable" ? "Service is temporarily unreachable. Please try again." : m);
      }
      const d = await res.json();
      setRecs(d.recommendations || []);
      setMeta(d.methodology || null);
      setSummary(d.assessment_summary || null);
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
        <div className="text-xs text-[#4f6280] font-semibold mb-1">Generating your findings</div>
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
              <p className="text-sm text-[#4f6280] font-semibold mb-1">Decision not found</p>
              <p className="text-xs text-[#4f6280] mb-4">This link may be incomplete or the decision may no longer be available.</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => router.push("/assessment")} className="px-4 py-1.5 bg-brand-green text-white text-xs font-bold rounded-lg hover:bg-brand-green-dark">Start new assessment</button>
                <button onClick={() => router.push("/")} className="px-4 py-1.5 border border-[#cad3df] text-[#4f6280] text-xs font-bold rounded-lg">Return home</button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-[#4f6280] font-semibold mb-1">Decision temporarily unavailable</p>
              <p className="text-xs text-[#4f6280] mb-4">Your result has not been deleted.</p>
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
        <p className="text-sm text-[#4f6280] font-semibold mb-1">No decision generated</p>
        <p className="text-xs text-[#4f6280] mb-4">The assessment did not produce results.</p>
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
          <span className="text-[10px] text-[#4f6280] ml-auto">{Math.round(rec.confidence.score * 100)}% evidence strength</span>
        </div>
        <h3 className="text-[16px] font-extrabold tracking-[-0.01em] text-[#101826] mb-1">{rec.title}</h3>

        {rec.alternative_comparison && (
          <div className="grid grid-cols-2 gap-2 mb-3 text-[10px]">
            <div><span className="text-[#4f6280]">Evidence:</span> <span className="font-bold text-[#101826]">{rec.alternative_comparison.evidence_strength}</span></div>
            <div><span className="text-[#4f6280]">Outcome support:</span> <span className="font-bold text-[#101826]">{rec.alternative_comparison.outcome_support}</span></div>
            <div><span className="text-[#4f6280]">Complexity:</span> <span className="font-bold text-[#101826]">{rec.alternative_comparison.implementation_complexity}</span></div>
            <div><span className="text-[#4f6280]">Timeline:</span> <span className="font-bold text-[#101826]">{rec.alternative_comparison.expected_timeline}</span></div>
          </div>
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
                  <h1 className="text-[28px] sm:text-[34px] font-extrabold tracking-[-0.04em] text-[#101826] m-0 leading-tight">Decision Package</h1>
                </div>
                <p className="text-[#4f6280] font-semibold mt-1 mb-1 text-[15px]">An evidence-backed decision with full traceability</p>
                <div className="text-[13px] font-semibold text-[#4f6280]">
                  <span>Generated {ts}</span>
                </div>
              </div>
            </div>
          </header>

          {/* ===== 1.5 VALIDATION REPORT (validate entry) ===== */}
          {entryMode === "validate" && proposed?.category && recs.length > 0 && (
            <ValidationReport proposed={proposed} recs={recs} />
          )}

          {/* ===== 1.6 GROUNDING STATE ===== */}
          <GroundingBanner rec={top} meta={meta} />

          {/* ===== 2. PRIMARY RECOMMENDATION ===== */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border-2 border-brand-green shadow-[0_8px_32px_-8px_rgba(25,164,58,0.12)]">
            <span className="w-7 h-7 rounded-full bg-[#d7a500] text-white flex items-center justify-center text-[12px] font-extrabold mb-4">1</span>

            {/* SECTION 1: Recommended Path — label derived from engine category */}
            <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-2">Recommended Path</p>
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#101826] mb-4 leading-[1.2]">
              {top.title || "Evidence-supported intervention"}
            </h2>
            {top.description && (
              <p className="text-[12.5px] text-[#4f6280] leading-[1.6] mb-4">{top.description}</p>
            )}

            {/* SECTION 2: Why this decision — engine rationale + why-it-ranked */}
            <div className="mb-6 p-4 bg-[#f6f8fa] rounded-xl border border-[#e6eaef]">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-2">Why this is the strongest path</p>
              <p className="text-[12px] text-[#4f6280] leading-[1.6] mb-2">
                {top.rationale || (top.why_ranked_first?.summary) || "Ranked by comparable evidence and workflow fit."}
              </p>
              {top.why_it_ranked_here && top.why_it_ranked_here.length > 0 && (
                <ul className="space-y-1">
                  {top.why_it_ranked_here.slice(0, 5).map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11.5px] text-[#101826]/85">
                      <span className="text-brand-green mt-0.5 shrink-0">&#10003;</span>{r}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* SECTION 3: Expected Operational Impact (evidence-derived ranges) */}
            {top.outcome_ranges && top.outcome_ranges.filter(r => r.directly_comparable).length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-3">Expected Operational Impact</p>
                <p className="text-[12px] text-[#4f6280] mb-3">Ranges observed across comparable implementations:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                  {top.outcome_ranges.filter(r => r.directly_comparable).slice(0, 3).map((r, i) => {
                    const fmtVal = formatRange(r) + (r.unit === "number" && !isCurrency(r.metric_label, r.unit) ? " hours" : "");
                    const directionLabel = r.direction === "improvement" ? "Increase" : r.direction === "reduction" ? "Reduction" : r.direction;
                    const label = isCurrency(r.metric_label, r.unit) ? "Estimated Annual $ Savings" : r.unit === "number" ? "Estimated Annual Time Savings" : `${directionLabel} in ${r.metric_label}`;
                    return (
                      <div key={i} className="bg-[#f6f8fa] rounded-xl px-4 py-3 border border-[#e6eaef]">
                        <div className="text-[17px] font-extrabold text-[#101826]">{fmtVal}</div>
                        <div className="text-[9px] font-bold text-[#4f6280] uppercase tracking-[0.04em]">{label}</div>
                        <div className="text-[8px] text-[#4f6280] italic mt-0.5">Observed across {r.sample_size} comparable implementations</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 4: Decision Defensibility (explainable scorecard) */}
            <DecisionDefensibility rec={top} meta={meta} summary={summary} />

            {/* SECTION 5: Recommendation Quality (factor bars + detail) */}
            <ConfidenceFactors rec={top} recs={recs} meta={meta} summary={summary} />

            {/* SECTION 5: Indicative technology stack — clearly labeled, not vendor selection */}
            <div className="mb-6">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-1">
                Indicative technology stack
              </p>
              <p className="text-[11px] text-[#4f6280] leading-[1.5] mb-2">
                Typical tool categories for this intervention type. Compass does not select or recommend specific vendors.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(() => {
                  const cat = (top.category || "").toLowerCase();
                  if (cat.includes("workflow_automation") || cat.includes("automation")) {
                    return (
                      <>
                        <StackCell label="Automation" value="Rules-based automation platforms" />
                        <StackCell label="Workflow Platform" value="Workflow and orchestration tools" />
                        <StackCell label="Document Automation" value="Document processing tools" />
                        <StackCell label="AI Assistant" value="AI-assisted drafting tools" />
                      </>
                    );
                  }
                  if (cat.includes("ai")) {
                    return (
                      <>
                        <StackCell label="AI Assistant" value="LLM / generative AI platforms" />
                        <StackCell label="Knowledge Platform" value="Knowledge and retrieval systems" />
                        <StackCell label="Workflow Platform" value="Workflow and orchestration tools" />
                        <StackCell label="Automation" value="Rules-based automation platforms" />
                      </>
                    );
                  }
                  if (cat.includes("software")) {
                    return (
                      <>
                        <StackCell label="Workflow Platform" value="Purpose-built SaaS platforms" />
                        <StackCell label="Automation" value="Rules-based automation platforms" />
                        <StackCell label="Document Automation" value="Document processing tools" />
                        <StackCell label="AI Assistant" value="AI-assisted drafting tools" />
                      </>
                    );
                  }
                  return (
                    <>
                      <StackCell label="Workflow Platform" value="Workflow and orchestration tools" />
                      <StackCell label="Automation" value="Rules-based automation platforms" />
                    </>
                  );
                })()}
              </div>
            </div>

            {/* SECTION 6: Evidence behind this decision */}
            <EvidenceBehind rec={top} />

            {/* SECTION 7: Assumptions, gaps, risks */}
            <AssumptionsGapsPanel rec={top} />
          </section>

          {/* ===== 4. ALTERNATIVES ===== */}
          {alternatives.length > 0 && alternatives.filter(r => r.rank === 2).length > 0 && (
            <AlternativeCard rec={alternatives.filter(r => r.rank === 2)[0]} accent="blue" />
          )}
          {alternatives.length > 0 && alternatives.filter(r => r.rank === 3).length > 0 && (
            <AlternativeCard rec={alternatives.filter(r => r.rank === 3)[0]} accent="orange" />
          )}

          {/* ===== 5. NEXT VALIDATION STEP (from engine) ===== */}
          <NextValidationStepPanel rec={top} />

          {/* ===== 8. METHODOLOGY ===== */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#dfe5ec] text-[11px] text-[#4f6280] leading-[1.6]">
            <p>
              Compass evaluates your operational needs against real-world business outcomes from organizations facing similar challenges. Each decision is assessed on operational fit, evidence strength, expected business impact, organizational readiness, and speed to value. Outcomes observed in other organizations do not guarantee identical results.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function StackCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
      <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">{label}</p>
      <p className="text-[10px] text-[#101826] leading-snug">{value}</p>
    </div>
  );
}

function categoryFamily(cat: string | undefined): string {
  const c = (cat || "").toLowerCase();
  if (c.includes("no_action") || c.includes("no-action") || c.includes("defer")) return "No action";
  if (c.includes("ai")) return "AI";
  if (c.includes("process")) return "Process redesign";
  if (c.includes("staffing") || c.includes("human")) return "Human work";
  if (c.includes("software") || c.includes("automation") || c.includes("workflow")) return "Deterministic software";
  return c;
}

function familiesMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (a === "Hybrid" && (b === "AI" || b === "Deterministic software")) return true;
  if (b === "Hybrid" && (a === "AI" || a === "Deterministic software")) return true;
  return false;
}

function ValidationReport({ proposed, recs }: { proposed: { intervention: string; category: string }; recs: RecommendationData[] }) {
  const top = recs[0];
  const topFamily = categoryFamily(top?.category);
  const validated = !!top && familiesMatch(proposed.category, topFamily);
  let rank = 0;
  recs.forEach((r, i) => {
    if (rank === 0 && familiesMatch(proposed.category, categoryFamily(r.category))) rank = i + 1;
  });

  return (
    <section className={`rounded-2xl p-6 shadow-sm border-2 ${validated ? "border-[#1E7B4C] bg-[#E5F3EA]" : "border-[#B45309] bg-[#FBF0E0]"}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-2">Decision Validation Report</p>
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-[11px] font-bold ${validated ? "bg-[#1E7B4C]" : "bg-[#B45309]"}`} aria-hidden="true">
          {validated ? "✓" : "!"}
        </span>
        <div>
          <h2 className="text-[16px] font-extrabold text-[#101826]">
            {validated ? "Your proposed approach is validated." : "The evidence points to a different approach."}
          </h2>
          <p className="mt-1 text-[13px] leading-[1.6] text-[#4f6280]">
            {validated ? (
              <>
                You proposed <strong>{proposed.intervention || proposed.category}</strong> ({proposed.category}).
                Compass ranked it first, with the strongest evidence among every alternative compared. The
                rationale and alternatives below show why.
              </>
            ) : (
              <>
                You proposed <strong>{proposed.intervention || proposed.category}</strong> ({proposed.category}).
                Compass ranked <strong>{top?.title}</strong> ({topFamily}) first.{" "}
                {rank > 0 ? <>Your proposed approach ranked #{rank} among the compared paths.</> : <>It did not rank among the compared paths.</>}{" "}
                The evidence and alternatives below show why.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Recommendation integrity helpers
// ---------------------------------------------------------------------------

function avgComparableSimilarity(rec: RecommendationData): number {
  const c = rec.comparable_implementations || [];
  if (!c.length) return 0;
  return Math.round(c.reduce((s, x) => s + (x.similarity_score || 0), 0) / c.length);
}

function groundingState(rec: RecommendationData, meta: any) {
  const tier = rec.evidence_summary?.overall_tier;
  const total = rec.evidence_summary?.total_comparables || 0;
  const label = rec.confidence?.label;
  if (label === "insufficient" || tier === "insufficient" || total === 0) {
    return {
      key: "insufficient" as const,
      label: "Insufficient Evidence",
      tone: "bg-[#FBF0E0] border-[#B45309] text-[#7a3b06]",
      dot: "bg-[#B45309]",
      note:
        "Compass found too little highly comparable evidence to make a defensible recommendation. The next validation step below shows what would change that.",
    };
  }
  const avgSim = avgComparableSimilarity(rec);
  const gaps = (rec.information_gaps || []).length;
  if (avgSim < 40 || gaps > 0) {
    return {
      key: "partial" as const,
      label: "Partially Grounded",
      tone: "bg-[#EAF2FF] border-[#156ff5] text-[#0b3f8f]",
      dot: "bg-[#156ff5]",
      note: `Live evidence-backed, but with partial grounding: comparable implementations matched at ${avgSim}/100 average similarity${gaps ? `, and ${gaps} material information gap${gaps > 1 ? "s" : ""} remain` : ""}. Source links for the underlying records are pending.`,
    };
  }
  const orgs = (meta?.evidence_count?.unique_organizations) || 0;
  return {
    key: "live" as const,
    label: "Live Evidence-Backed",
    tone: "bg-[#E5F3EA] border-[#1E7B4C] text-[#14532d]",
    dot: "bg-[#1E7B4C]",
    note: `Derived live from ${total} comparable implementations${orgs ? ` across ${orgs} organizations` : ""}, with deterministic scoring over the evidence graph.`,
  };
}

function factorValue(value: string, detail: string, tone: "ok" | "warn" | "muted") {
  return { value, detail, tone };
}

function defensibilityChecks(rec: RecommendationData, meta: any, summary: any) {
  const es = rec.evidence_summary || {};
  const comparables = rec.comparable_implementations || [];
  const outcomeRanges = (rec.outcome_ranges || []).filter((r) => r.directly_comparable);
  const hasOutcome = outcomeRanges.length > 0;
  const hasImplementationPattern = comparables.some(
    (c) => (c.intervention && c.intervention.length > 5) || (c.intervention_description && c.intervention_description.length > 5)
  );
  const gaps = rec.information_gaps || [];
  const assumptions = rec.assumptions_detail || [];
  const risks = rec.risks || [];
  const alternatives = rec.alternatives_considered || [];

  const checks = [
    {
      key: "problem",
      label: "Why this problem?",
      ok: !!(summary?.problem_statement || summary?.workflow),
      detail: summary?.problem_statement ? "Problem statement captured from your input." : "Workflow identified, free-text problem not provided.",
    },
    {
      key: "intervention",
      label: "Why this intervention?",
      ok: !!rec.title && alternatives.length > 0,
      detail: alternatives.length > 0 ? `${alternatives.length} alternative paths compared.` : "Recommended intervention selected; alternatives not surfaced.",
    },
    {
      key: "comparables",
      label: "Who else solved it?",
      ok: (es.total_comparables || 0) > 0,
      detail: es.total_comparables ? `${es.total_comparables} comparable implementations retrieved.` : "No comparable implementations attached to this decision.",
    },
    {
      key: "implementation",
      label: "How did they implement it?",
      ok: hasImplementationPattern,
      detail: hasImplementationPattern ? "Implementation patterns present in comparable records." : "No implementation detail in comparable records.",
    },
    {
      key: "outcomes",
      label: "What outcomes did they achieve?",
      ok: hasOutcome,
      detail: hasOutcome ? `Outcome ranges from ${outcomeRanges.length} comparable metric${outcomeRanges.length > 1 ? "s" : ""}.` : "Outcomes not quantified in retrieved records.",
    },
    {
      key: "risk",
      label: "What risks should we expect?",
      ok: risks.length > 0,
      detail: risks.length > 0 ? `${risks.length} risk${risks.length > 1 ? "s" : ""} identified from evidence.` : "No risks surfaced for this decision.",
    },
    {
      key: "measurement",
      label: "How will we measure success?",
      ok: !!rec.next_validation_step,
      detail: rec.next_validation_step ? "Validation step with success criteria defined." : "No measurement plan defined yet.",
    },
    {
      key: "gaps",
      label: "What would change this?",
      ok: gaps.length > 0 || assumptions.length > 0,
      detail: `${gaps.length} evidence gap${gaps.length !== 1 ? "s" : ""} and ${assumptions.length} assumption${assumptions.length !== 1 ? "s" : ""} surfaced.`,
    },
  ];

  return { checks, score: checks.filter((c) => c.ok).length, total: checks.length };
}

function DecisionDefensibility({ rec, meta, summary }: { rec: RecommendationData; meta: any; summary: any }) {
  const { checks, score, total } = defensibilityChecks(rec, meta, summary);
  const tone = score >= 6 ? "text-[#1E7B4C]" : score >= 4 ? "text-[#B45309]" : "text-[#C4382C]";
  const gapsCount = (rec.information_gaps || []).length;
  return (
    <div className="mb-6 border border-[#e6eaef] rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-[#f6f8fa] border-b border-[#e6eaef] flex items-center justify-between gap-3">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280]">
          Decision Defensibility
        </p>
        <span className={`font-mono text-[16px] font-bold ${tone}`}>
          {score} <span className="text-[#4f6280] text-[12px]">/ {total}</span>
        </span>
      </div>
      <div className="p-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {checks.map((c) => (
            <li key={c.key} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                  c.ok ? "bg-[#1E7B4C]" : "bg-[#B45309]"
                }`}
              >
                {c.ok ? "✓" : "⚠"}
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[#101826]">{c.label}</p>
                <p className="text-[11px] text-[#4f6280] leading-[1.45]">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        {gapsCount > 0 && (
          <p className="mt-3 pt-3 border-t border-[#ebeff4] text-[11px] text-[#B45309]">
            Evidence gaps: {gapsCount} — see “What is missing” below for what would raise this score.
          </p>
        )}
        <p className="mt-2 text-[10.5px] text-[#4f6280] italic">
          Each check reflects the evidence actually retrieved for this decision. Nothing here is assumed.
        </p>
      </div>
    </div>
  );
}

function buildConfidenceFactors(rec: RecommendationData, recs: RecommendationData[], meta: any) {
  const es = rec.evidence_summary || {};
  const ec = meta?.evidence_count || {};
  const avgSim = avgComparableSimilarity(rec);
  const gaps = (rec.information_gaps || []).length;
  const margin = Math.round((rec.confidence?.score || 0) * 100 - (recs[1]?.confidence?.score || 0) * 100);
  const gold = es.gold_count || 0;
  const silver = es.silver_count || 0;
  const tierLabel = es.overall_tier || "insufficient";
  const measured = ec.outcome_measured_implementations || 0;
  const quantified = ec.quantified_outcome_implementations || 0;
  const orgs = ec.unique_organizations || 0;

  const factors: { label: string; value: string; detail: string; tone: "ok" | "warn" | "muted" }[] = [];

  // Problem match — average similarity of top comparables to the user's problem
  factors.push({
    label: "Problem match",
    ...(avgSim >= 50
      ? factorValue("Strong", `Top comparables matched at ~${avgSim}/100 similarity.`, "ok")
      : avgSim >= 30
        ? factorValue("Moderate", `Top comparables matched at ~${avgSim}/100 similarity.`, "warn")
        : factorValue("Limited", `Top comparables matched at ~${avgSim}/100 similarity — broad, not exact.`, "warn"))
  });

  // Evidence strength — tier + gold/silver
  factors.push({
    label: "Evidence strength",
    ...(gold >= 1
      ? factorValue("Strong", `${gold} gold-tier source${gold > 1 ? "s" : ""} with quantified outcomes.`, "ok")
      : silver >= 3 || tierLabel === "silver"
        ? factorValue("Moderate", `${silver} silver-tier sources; overall tier ${tierLabel}.`, "warn")
        : factorValue("Limited", `Overall evidence tier ${tierLabel}. No gold-tier sources in this result.`, "warn"))
  });

  // Outcome evidence — measured + quantified comparables
  factors.push({
    label: "Outcome evidence",
    ...(measured >= 5
      ? factorValue("Strong", `${measured} comparable implementations measured outcomes (${quantified} quantified).`, "ok")
      : measured >= 2
        ? factorValue("Moderate", `${measured} comparable implementations measured outcomes (${quantified} quantified).`, "warn")
        : factorValue("Limited", `${measured} comparable implementations measured outcomes.`, "warn"))
  });

  // Evidence diversity — unique organizations
  factors.push({
    label: "Evidence diversity",
    ...(orgs >= 20
      ? factorValue("Strong", `Evidence spans ${orgs} independent organizations.`, "ok")
      : orgs >= 8
        ? factorValue("Moderate", `Evidence spans ${orgs} independent organizations.`, "warn")
        : factorValue("Limited", `Evidence spans ${orgs} independent organizations.`, "warn"))
  });

  // Missing information — information gaps
  factors.push({
    label: "Missing information",
    ...(gaps === 0
      ? factorValue("None", "No material information gaps flagged.", "ok")
      : gaps <= 2
        ? factorValue("Moderate", `${gaps} information gap${gaps > 1 ? "s" : ""} listed below.`, "warn")
        : factorValue("Material", `${gaps} information gaps listed below.`, "warn"))
  });

  // Alternative margin
  factors.push({
    label: "Alternative margin",
    ...(margin >= 15
      ? factorValue("Wide", `Top decision leads the runner-up by ${margin} confidence points.`, "ok")
      : margin >= 5
        ? factorValue("Moderate", `Top decision leads the runner-up by ${margin} confidence points.`, "warn")
        : factorValue("Narrow", `Top decision leads the runner-up by ${margin} confidence points.`, "warn"))
  });

  return factors;
}

function GroundingBanner({ rec, meta }: { rec: RecommendationData; meta: any }) {
  const g = groundingState(rec, meta);
  return (
    <div className={`rounded-2xl px-5 py-4 border ${g.tone} flex items-start gap-3`}>
      <span aria-hidden="true" className={`mt-1 h-2 w-2 shrink-0 rounded-full ${g.dot}`} />
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.06em]">{g.label}</p>
        <p className="mt-1 text-[12.5px] leading-[1.6] text-[#101826]/80">{g.note}</p>
      </div>
    </div>
  );
}

function ConfidenceFactorRow({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: "ok" | "warn" | "muted" }) {
  const color = tone === "ok" ? "text-[#1E7B4C]" : tone === "warn" ? "text-[#B45309]" : "text-[#4f6280]";
  return (
    <div className="py-2.5 border-b border-[#ebeff4] last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-semibold text-[#101826]">{label}</span>
        <span className={`text-[12px] font-extrabold ${color}`}>{value}</span>
      </div>
      <p className="mt-0.5 text-[11px] text-[#4f6280] leading-[1.5]">{detail}</p>
    </div>
  );
}

function QualityBar({ label, value, note }: { label: string; value: number; note: string }) {
  const v = Math.max(0, Math.min(100, value));
  const color = v >= 60 ? "bg-[#1E7B4C]" : v >= 35 ? "bg-[#B45309]" : "bg-[#C4382C]";
  return (
    <div className="py-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-semibold text-[#101826]">{label}</span>
        <span className="text-[11px] text-[#4f6280]">{note}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#eef1f5]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

function ConfidenceFactors({ rec, recs, meta, summary }: { rec: RecommendationData; recs: RecommendationData[]; meta: any; summary: any }) {
  const factors = buildConfidenceFactors(rec, recs, meta);
  const es = rec.evidence_summary || {};
  const comparables = rec.comparable_implementations || [];
  const { score, total } = defensibilityChecks(rec, meta, summary);
  const avgSim = avgComparableSimilarity(rec);
  const implShare = comparables.length
    ? Math.round((comparables.filter((c) => (c.intervention && c.intervention.length > 5) || (c.intervention_description && c.intervention_description.length > 5)).length / comparables.length) * 100)
    : 0;
  const outcomeShare = (rec.outcome_ranges || []).filter((r) => r.directly_comparable).length > 0 ? 100 : 0;
  const riskCoverage = (rec.risks || []).length > 0 ? 100 : 0;
  const overall = rec.confidence?.label || "unknown";

  return (
    <div className="mb-6 border border-[#e6eaef] rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 mb-1">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280]">
          Recommendation Quality
        </p>
        <span className="text-[12px] font-bold text-[#101826]">
          Defensibility {score} / {total} · Overall: {overall}
        </span>
      </div>
      <p className="text-[11px] text-[#4f6280] leading-[1.5] mb-2">
        Confidence is shown as explainable factors instead of a single precise percentage, because a single
        number would imply more precision than the current model supports.
      </p>

      <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <QualityBar label="Problem fit" value={avgSim} note={`~${avgSim}/100 avg similarity`} />
        <QualityBar label="Implementation evidence" value={implShare} note={`${implShare}% of comparables with implementation detail`} />
        <QualityBar label="Outcome evidence" value={outcomeShare} note={outcomeShare ? "quantified outcome ranges present" : "no quantified outcomes"} />
        <QualityBar label="Risk coverage" value={riskCoverage} note={riskCoverage ? "risks surfaced from evidence" : "no risks surfaced"} />
      </div>

      <div className="pt-2 border-t border-[#ebeff4]">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-1">Factor detail</p>
        {factors.map((f) => (
          <ConfidenceFactorRow key={f.label} {...f} />
        ))}
      </div>
    </div>
  );
}

function EvidenceBehind({ rec }: { rec: RecommendationData }) {
  const c = (rec.comparable_implementations || []).slice(0, 5);
  const withSource = c.filter((x) => x.source_url).length;
  return (
    <div className="mb-6 border border-[#e6eaef] rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-[#f6f8fa] border-b border-[#e6eaef]">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280]">
          Evidence behind this decision
        </p>
      </div>
      <div className="p-4">
        {c.length === 0 ? (
          <p className="text-[12px] text-[#4f6280] italic">
            No comparable implementations were attached to this recommendation by the engine.
          </p>
        ) : (
          <ul className="divide-y divide-[#ebeff4]">
            {c.map((x) => (
              <li key={x.record_id || x.organization} className="py-3 first:pt-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[12.5px] font-bold text-[#101826]">{x.organization || "Verified implementation"}</span>
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-[#4f6280]">
                    <span className={`px-1.5 py-0.5 rounded ${x.evidence_tier === "gold" ? "bg-[#fff6d8] text-[#7a5b00]" : x.evidence_tier === "silver" ? "bg-[#f0f3f6] text-[#3f4a5a]" : "bg-[#fff0e6] text-[#7a3b06]"}`}>
                      {x.evidence_tier || "unknown"}
                    </span>
                    <span>sim {x.similarity_score || 0}%</span>
                  </span>
                </div>
                {x.intervention && <p className="mt-0.5 text-[11.5px] text-[#4f6280]">{x.intervention}</p>}
                <p className="mt-1 text-[11.5px] text-[#101826]/85 leading-[1.5]">{x.outcome_summary || x.observed_outcome || "Outcome not quantified"}</p>
                {x.supporting_passage && (
                  <p className="mt-1 text-[11px] italic text-[#4f6280] leading-[1.5]">&ldquo;{x.supporting_passage.slice(0, 220)}&rdquo;</p>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 pt-3 border-t border-[#ebeff4] text-[11px] leading-[1.5] text-[#4f6280]">
          Provenance: {withSource} of {c.length} records carry a resolvable source link. Compass will only treat
          records as fully traceable once their source can be opened; passages above are extracted evidence and
          should be treated as partially traceable until then.
        </p>
      </div>
    </div>
  );
}

function NextValidationStepPanel({ rec }: { rec: RecommendationData }) {
  const n = rec.next_validation_step;
  if (!n) return null;
  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#dfe5ec]">
      <h2 className="text-[17px] font-extrabold tracking-[-0.01em] text-[#101826] mb-1">Next validation step</h2>
      <p className="text-[11px] text-[#4f6280] mb-4">Recommended by the engine to close the confidence gap before committing to implementation.</p>
      <div className="bg-[#f6f8fa] rounded-xl px-5 py-4 border border-[#e6eaef]">
        <p className="text-[13px] font-extrabold text-[#101826]">{n.action}</p>
        <p className="mt-1 text-[11.5px] text-[#4f6280] leading-[1.5]">{n.purpose}</p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[11.5px]">
          <div><span className="font-bold text-[#4f6280]">Owner: </span><span className="text-[#101826]">{n.owner}</span></div>
          <div><span className="font-bold text-[#4f6280]">Duration: </span><span className="text-[#101826]">{n.duration}</span></div>
          <div className="sm:col-span-2"><span className="font-bold text-[#4f6280]">Success criteria: </span><span className="text-[#101826]">{n.success_criteria}</span></div>
          <div className="sm:col-span-2"><span className="font-bold text-[#4f6280]">Enables: </span><span className="text-[#101826]">{n.decision_enabled}</span></div>
        </div>
        {n.required_inputs && n.required_inputs.length > 0 && (
          <p className="mt-3 text-[11px] text-[#4f6280]">Required inputs: {n.required_inputs.join(" · ")}</p>
        )}
      </div>
    </section>
  );
}

function AssumptionsGapsPanel({ rec }: { rec: RecommendationData }) {
  const assumptions = rec.assumptions_detail || [];
  const gaps = rec.information_gaps || [];
  const risks = rec.risks || [];
  if (assumptions.length === 0 && gaps.length === 0 && risks.length === 0) return null;
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {assumptions.length > 0 && (
        <div className="border border-[#e6eaef] rounded-xl p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-3">Assumptions that could change this decision</p>
          <ul className="space-y-2.5">
            {assumptions.slice(0, 4).map((a) => (
              <li key={a.title} className="text-[11.5px]">
                <p className="font-bold text-[#101826]">{a.title}</p>
                <p className="text-[#4f6280] leading-[1.5] mt-0.5">{a.explanation}</p>
                <p className="text-[#1E7B4C] mt-0.5">Resolution: {a.resolution_action}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {gaps.length > 0 && (
        <div className="border border-[#e6eaef] rounded-xl p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-3">What is missing</p>
          <ul className="space-y-2.5">
            {gaps.slice(0, 4).map((g) => (
              <li key={g.title} className="text-[11.5px]">
                <p className="font-bold text-[#101826]">{g.title}</p>
                <p className="text-[#4f6280] leading-[1.5] mt-0.5">{g.explanation}</p>
                <p className="text-[#B45309] mt-0.5">Effect on confidence: {g.effect_on_confidence}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {risks.length > 0 && (
        <div className="md:col-span-2 border border-[#e6eaef] rounded-xl p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-3">Risks identified from evidence</p>
          <ul className="space-y-2.5">
            {risks.slice(0, 4).map((r: any, i: number) => (
              <li key={i} className="text-[11.5px]">
                <p className="font-bold text-[#101826]">{r.title}</p>
                <p className="text-[#4f6280] leading-[1.5] mt-0.5">{r.explanation}</p>
                {r.mitigation && <p className="text-[#1E7B4C] mt-0.5">Mitigation: {r.mitigation}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
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
    problem_statement: m.get("problem-description") || m.get("situation") || `${dept} ops optimization`,
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
