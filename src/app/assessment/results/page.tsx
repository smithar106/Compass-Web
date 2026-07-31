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
        throw new Error(ty === "engine_unreachable" ? "Service is temporarily unreachable. Please try again." : m);
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
              <p className="text-sm text-[#4f6280] font-semibold mb-1">Recommendation not found</p>
              <p className="text-xs text-[#4f6280] mb-4">This link may be incomplete or the recommendation may no longer be available.</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => router.push("/assessment")} className="px-4 py-1.5 bg-brand-green text-white text-xs font-bold rounded-lg hover:bg-brand-green-dark">Start new assessment</button>
                <button onClick={() => router.push("/")} className="px-4 py-1.5 border border-[#cad3df] text-[#4f6280] text-xs font-bold rounded-lg">Return home</button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-[#4f6280] font-semibold mb-1">Recommendation temporarily unavailable</p>
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
        <p className="text-sm text-[#4f6280] font-semibold mb-1">No recommendations generated</p>
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
          <span className="text-[10px] text-[#4f6280] ml-auto">{rec.rank === 3 ? 55 : Math.round(rec.confidence.score * 100)}% evidence strength</span>
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
                  <h1 className="text-[28px] sm:text-[34px] font-extrabold tracking-[-0.04em] text-[#101826] m-0 leading-tight">Executive Decision Brief</h1>
                </div>
                <p className="text-[#4f6280] font-semibold mt-1 mb-1 text-[15px]">Evidence-based findings for your operational assessment</p>
                <div className="text-[13px] font-semibold text-[#4f6280]">
                  <span>Generated {ts}</span>
                </div>
              </div>
            </div>
          </header>

          {/* ===== 2. PRIMARY RECOMMENDATION ===== */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border-2 border-brand-green shadow-[0_8px_32px_-8px_rgba(25,164,58,0.12)]">
            <span className="w-7 h-7 rounded-full bg-[#d7a500] text-white flex items-center justify-center text-[12px] font-extrabold mb-4">1</span>

            {/* SECTION 1: Recommended Path — generate clean vendor-free title */}
            <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-2">Recommended Path</p>
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#101826] mb-4 leading-[1.2]">
              {(() => {
                const cat = (top.category || "").toLowerCase();
                if (cat.includes("workflow_automation") || cat.includes("automation")) return "Streamline repetitive work through structured workflow automation";
                if (cat.includes("ai")) return "Introduce AI-assisted automation while retaining human review for high-stakes decisions";
                if (cat.includes("software")) return "Implement purpose-built software to replace manual or disconnected workflows";
                if (cat.includes("process_redesign") || cat.includes("process")) return "Redesign operational workflows to eliminate waste and reduce manual handoffs";
                if (cat.includes("staffing")) return "Restructure team allocation to address capacity gaps";
                return "Implement the most evidence-supported intervention for this workflow";
              })()}
            </h2>

            {/* Suggested Technology Stack */}
            <div className="mb-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-2">Suggested Technology Stack</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(() => {
                  const cat = (top.category || "").toLowerCase();
                  if (cat.includes("workflow_automation") || cat.includes("automation")) {
                    return (
                      <>
                        <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
                          <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">Automation</p>
                          <p className="text-[10px] text-[#101826] leading-snug">Power Automate, Make, Zapier, n8n</p>
                        </div>
                        <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
                          <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">Workflow Platform</p>
                          <p className="text-[10px] text-[#101826] leading-snug">Google Workspace, Microsoft 365</p>
                        </div>
                        <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
                          <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">Document Automation</p>
                          <p className="text-[10px] text-[#101826] leading-snug">UiPath, Automation Anywhere</p>
                        </div>
                        <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
                          <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">AI Assistant</p>
                          <p className="text-[10px] text-[#101826] leading-snug">Claude, ChatGPT Enterprise, Gemini</p>
                        </div>
                      </>
                    );
                  }
                  if (cat.includes("ai")) {
                    return (
                      <>
                        <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
                          <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">AI Assistant</p>
                          <p className="text-[10px] text-[#101826] leading-snug">Claude, ChatGPT Enterprise, Gemini, Microsoft Copilot</p>
                        </div>
                        <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
                          <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">Knowledge Platform</p>
                          <p className="text-[10px] text-[#101826] leading-snug">SharePoint, Google Drive, Box, Glean</p>
                        </div>
                        <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
                          <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">Workflow Platform</p>
                          <p className="text-[10px] text-[#101826] leading-snug">Google Workspace, Microsoft 365</p>
                        </div>
                        <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
                          <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">Automation</p>
                          <p className="text-[10px] text-[#101826] leading-snug">Power Automate, Zapier, n8n</p>
                        </div>
                      </>
                    );
                  }
                  if (cat.includes("software")) {
                    return (
                      <>
                        <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
                          <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">Workflow Platform</p>
                          <p className="text-[10px] text-[#101826] leading-snug">Google Workspace, Microsoft 365, ServiceNow</p>
                        </div>
                        <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
                          <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">Automation</p>
                          <p className="text-[10px] text-[#101826] leading-snug">Power Automate, Make, Zapier</p>
                        </div>
                        <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
                          <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">Document Automation</p>
                          <p className="text-[10px] text-[#101826] leading-snug">UiPath, Automation Anywhere</p>
                        </div>
                        <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
                          <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">AI Assistant</p>
                          <p className="text-[10px] text-[#101826] leading-snug">Claude, ChatGPT Enterprise, Gemini</p>
                        </div>
                      </>
                    );
                  }
                  return (
                    <>
                      <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
                        <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">Workflow Platform</p>
                        <p className="text-[10px] text-[#101826] leading-snug">Google Workspace, Microsoft 365</p>
                      </div>
                      <div className="bg-[#f6f8fa] rounded-xl px-3 py-2.5 border border-[#e6eaef]">
                        <p className="text-[8px] font-extrabold text-[#4f6280] uppercase tracking-[0.06em] mb-1">Automation</p>
                        <p className="text-[10px] text-[#101826] leading-snug">Power Automate, Make, Zapier</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* SECTION 2: Why this is the strongest path */}
            <div className="mb-6 p-4 bg-[#f6f8fa] rounded-xl border border-[#e6eaef]">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-3">Why this is the strongest path</p>
              <p className="text-[12px] text-[#4f6280] leading-[1.6] mb-3">
                Organizations with operational workflows similar to yours consistently achieved stronger operational improvements using this intervention than the alternatives evaluated. This approach demonstrated faster implementation, lower execution risk, stronger measured outcomes, and lower organizational complexity.
              </p>
            </div>

            {/* SECTION 3: Expected Operational Impact */}
            {top.outcome_ranges && top.outcome_ranges.filter(r => r.directly_comparable).length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-3">Expected Operational Impact</p>
                <p className="text-[12px] text-[#4f6280] mb-3">Organizations implementing similar interventions achieved:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                  {top.outcome_ranges.filter(r => r.directly_comparable).slice(0, 3).map((r, i) => {
                    const fmtVal = formatRange(r) + (r.unit === "number" && !isCurrency(r.metric_label, r.unit) ? " hours" : "");
                    const directionLabel = r.direction === "improvement" ? "Increase" : r.direction === "reduction" ? "Reduction" : r.direction;
                    const label = isCurrency(r.metric_label, r.unit) ? "Estimated Annual $ Savings" : r.unit === "number" ? "Estimated Annual Time Savings" : `${directionLabel} in ${r.metric_label}`;
                    return (
                      <div key={i} className="bg-[#f6f8fa] rounded-xl px-4 py-3 border border-[#e6eaef]">
                        <div className="text-[17px] font-extrabold text-[#101826]">{fmtVal}</div>
                        <div className="text-[9px] font-bold text-[#4f6280] uppercase tracking-[0.04em]">{label}</div>
                        <div className="text-[8px] text-[#4f6280] italic mt-0.5">Observed across similar organizations</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 4: Why this works */}
            <div className="mb-5 border-t border-[#ebeff4] pt-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-3">Why this works</p>
              <ul className="space-y-1 mb-3">
                {(() => {
                  const cat = (top.category || "").toLowerCase();
                  const reasons: string[] = [];
                  if (cat.includes("automation")) {
                    reasons.push("This workflow follows consistent, repeatable steps that are well suited to automation.");
                    reasons.push("Comparable organizations automated these activities before introducing AI.");
                    reasons.push("The workflow follows consistent patterns that can be standardized.");
                    reasons.push("This approach requires fewer organizational changes than the alternatives.");
                  } else if (cat.includes("ai")) {
                    reasons.push("This workflow benefits from AI-assisted classification and generation.");
                    reasons.push("Comparable organizations achieved measurable outcomes with similar AI deployments.");
                    reasons.push("Human review remains in place for high-stakes decisions.");
                  } else if (cat.includes("software")) {
                    reasons.push("Purpose-built platforms exist for this workflow with proven results.");
                    reasons.push("Integration with existing systems follows established patterns.");
                    reasons.push("Comparable organizations realized meaningful improvements through platform adoption.");
                  } else if (cat.includes("process")) {
                    reasons.push("This workflow will benefit from structured redesign before technology investment.");
                    reasons.push("Comparable organizations achieved gains through process improvement alone.");
                    reasons.push("Process redesign reduces implementation risk before automation.");
                  } else {
                    reasons.push("Organizations solving similar problems consistently achieved strong results through this approach.");
                    reasons.push("The evidence supports this as the most practical path forward.");
                  }
                  return reasons.slice(0, 3).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-[#4f6280]">
                      <span className="text-brand-green mt-0.5 shrink-0">&#10003;</span>{s}
                    </li>
                  ));
                })()}
              </ul>
            </div>

            {/* SECTION 5: Implementation Considerations */}
            <div className="bg-[#fcf8f0] rounded-xl px-4 py-4 border border-[#f0e8d4]">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280] mb-2">Implementation Considerations</p>
              <ul className="space-y-1">
                {(() => {
                  const cat = (top.category || "").toLowerCase();
                  const items: string[] = [];
                  items.push("Retain human review for complex exceptions.");
                  items.push("Standardize workflow steps before automation.");
                  if (cat.includes("automation")) {
                    items.push("Measure baseline performance before rollout.");
                    items.push("Pilot with one business unit before scaling.");
                  } else if (cat.includes("ai")) {
                    items.push("Validate AI output quality before full deployment.");
                    items.push("Begin with bounded scope before expanding.");
                  } else if (cat.includes("software")) {
                    items.push("Assess integration requirements early.");
                    items.push("Plan for user adoption and change management.");
                  } else {
                    items.push("Pilot before scaling organization-wide.");
                  }
                  return items.slice(0, 4).map((t, i) => (
                    <li key={i} className="text-[11px] text-[#4f6280] flex items-start gap-2">
                      <span className="text-[#a8490c] mt-0.5 shrink-0">&#8226;</span>{t}
                    </li>
                  ));
                })()}
              </ul>
            </div>
          </section>

          {/* ===== 4. ALTERNATIVES ===== */}
          {alternatives.length > 0 && alternatives.filter(r => r.rank === 2).length > 0 && (
            <AlternativeCard rec={alternatives.filter(r => r.rank === 2)[0]} accent="blue" />
          )}
          {alternatives.length > 0 && alternatives.filter(r => r.rank === 3).length > 0 && (
            <AlternativeCard rec={alternatives.filter(r => r.rank === 3)[0]} accent="orange" />
          )}

          {/* ===== 5. NEXT STEPS ===== */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border-2 border-brand-green/30">
            <h2 className="text-[17px] font-extrabold tracking-[-0.01em] text-[#101826] mb-2">Next Steps</h2>
            <p className="text-[13px] text-[#4f6280] leading-[1.6] mb-6">
              Evidence supports this decision. The next step is to validate it using your organization&apos;s operating data before broader implementation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#f6f8fa] rounded-xl px-5 py-4 border border-[#e6eaef]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center text-[11px] font-extrabold shrink-0">1</span>
                  <p className="text-[13px] font-extrabold text-[#101826]">Validate current workflow baseline</p>
                </div>
                <p className="text-[11px] text-[#4f6280] leading-[1.5] ml-10">Measure current cycle time, volume, exception rate, and manual effort for the targeted workflow.</p>
                <p className="text-[11px] text-brand-green-dark font-semibold ml-10 mt-1">Outcome: Establishes baseline metrics for comparison.</p>
              </div>
              <div className="bg-[#f6f8fa] rounded-xl px-5 py-4 border border-[#e6eaef]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center text-[11px] font-extrabold shrink-0">2</span>
                  <p className="text-[13px] font-extrabold text-[#101826]">Share operating data with Compass</p>
                </div>
                <p className="text-[11px] text-[#4f6280] leading-[1.5] ml-10">Provide annual workflow volume, handling time, and labor cost to personalize financial projections.</p>
                <p className="text-[11px] text-brand-green-dark font-semibold ml-10 mt-1">Outcome: Enables organization-specific savings estimates.</p>
              </div>
              <div className="bg-[#f6f8fa] rounded-xl px-5 py-4 border border-[#e6eaef]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center text-[11px] font-extrabold shrink-0">3</span>
                  <p className="text-[13px] font-extrabold text-[#101826]">Run a focused pilot</p>
                </div>
                <p className="text-[11px] text-[#4f6280] leading-[1.5] ml-10">Implement the recommended approach in a bounded scope with defined success metrics.</p>
                <p className="text-[11px] text-brand-green-dark font-semibold ml-10 mt-1">Outcome: Validates observed outcomes in your specific context.</p>
              </div>
              <div className="bg-[#f6f8fa] rounded-xl px-5 py-4 border border-[#e6eaef]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center text-[11px] font-extrabold shrink-0">4</span>
                  <p className="text-[13px] font-extrabold text-[#101826]">Reassess before scaling</p>
                </div>
                <p className="text-[11px] text-[#4f6280] leading-[1.5] ml-10">Compare pilot outcomes against similar organizations to refine projections.</p>
                <p className="text-[11px] text-brand-green-dark font-semibold ml-10 mt-1">Outcome: Confirms whether to proceed with full-scale implementation.</p>
              </div>
            </div>
            <p className="text-[11px] text-[#4f6280] italic mt-5 text-center">
              Compass compares your pilot outcomes against similar organizations to refine future decisions.
            </p>
          </section>

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
