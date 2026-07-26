"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY = "compass-assessment-session";

interface ComparableEvidence {
  record_id: string; organization: string; intervention: string;
  workflow: string; workflow_context: string; intervention_description: string;
  outcome_summary: string; evidence_tier: string; similarity_score: number;
  source_title: string; source_url: string; relevance_explanation: string;
  normalized_metrics: { metric: string; value: string; raw: string }[];
}

interface ImpactEstimate {
  status: string; low: number | null; expected: number | null; high: number | null;
  currency: string; basis: string; confidence: string;
}

interface TimelineEstimate {
  min_weeks: number | null; expected_weeks: number | null; max_weeks: number | null; basis: string;
}

interface ProjectTeam {
  min_people: number; expected_people: number; max_people: number; roles: string[]; basis: string;
}

interface ImpactSummary {
  annual_savings: ImpactEstimate;
  annual_hours_returned: ImpactEstimate;
  implementation_timeline: TimelineEstimate;
  project_team: ProjectTeam;
}

interface OutcomeRange {
  metric: string; unit: string;
  median: number | null; low: number | null; high: number | null;
  count: number; source: string;
}

interface Assumption {
  assumption: string; impact_on_outcome: string; confidence: string;
}

interface InformationGap {
  gap: string; why_needed: string; priority: string;
}

interface NextValidationStep {
  action: string; why: string; estimated_effort: string;
}

interface RecommendationData {
  rank: number; is_compass_choice: boolean; intervention_id: string;
  category: string; title: string; specific_action: string;
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
    summary: string; key_strengths: string[];
    scoring_dimensions: { dimension: string; score: number; detail: string }[];
    vs_alternatives: { alternative: string; rank: number; confidence_gap: number; why_lower: string; when_to_consider: string }[];
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
  if (tl.min_weeks && tl.max_weeks) return `${tl.min_weeks}\u2013${tl.max_weeks} weeks`;
  if (tl.expected_weeks) return `${tl.expected_weeks} weeks`;
  return "Not available";
}

function teamDisplay(team: ProjectTeam): string {
  if (team.min_people && team.max_people) return `${team.min_people}\u2013${team.max_people} people`;
  if (team.expected_people) return `${team.expected_people} people`;
  return "Not available";
}

function evidenceMixSummary(es: { total_comparables: number; gold_count: number; silver_count: number; bronze_count: number }): string {
  const parts: string[] = [];
  if (es.gold_count > 0) parts.push(`${es.gold_count} Gold`);
  if (es.silver_count > 0) parts.push(`${es.silver_count} Silver`);
  if (es.bronze_count > 0) parts.push(`${es.bronze_count} Bronze`);
  const label = es.total_comparables === 1 ? "1 implementation" : `${es.total_comparables} implementations`;
  if (!parts.length) return label;
  return `${label}: ${parts.join(", ")}`;
}

function formatRange(r: OutcomeRange): string {
  if (r.low != null && r.high != null) {
    const unit = r.unit === "%" ? "%" : "";
    return `${r.low}${unit} \u2013 ${r.high}${unit}`;
  }
  if (r.median != null) return `${r.median}${r.unit === "%" ? "%" : ""}`;
  return "";
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
  const [runId, setRunId] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = searchParams?.get("run_id");
    if (id) loadRun(id);
    else submit();
  }, [searchParams]);

  async function loadRun(id: string) {
    try {
      setLoading(true);
      const r = await fetch(`/api/recommendations?run_id=${id}`);
      if (!r.ok) throw new Error((await r.json()).error || "Failed");
      const d = await r.json();
      setRecs(d.recommendations || []);
      setRunId(id);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed");
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
        window.history.replaceState({}, "", `/assessment/results?run_id=${d.recommendation_id}`);
        setRunId(d.recommendation_id);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }

  const handleDownloadPdf = useCallback(async () => {
    if (!recs.length || pdfLoading) return;
    setPdfLoading(true);
    setPdfError(null);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const el = document.getElementById("compass-report-content");
      if (!el) throw new Error("Content not found");
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "in", format: "letter" });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const margin = 0.5;
      const iw = pw - margin * 2;
      const ih = (canvas.height * iw) / canvas.width;
      const usable = ph - margin * 2;
      let remaining = ih;
      pdf.addImage(imgData, "PNG", margin, margin, iw, ih);
      remaining -= usable;
      while (remaining > 0) {
        const offsetPx = (ih - remaining) / (ih / canvas.height);
        pdf.addPage();
        const clipped = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff", y: offsetPx, height: canvas.height - offsetPx });
        const clipData = clipped.toDataURL("image/png");
        const ch = (clipped.height * iw) / clipped.width;
        pdf.addImage(clipData, "PNG", margin, margin, iw, ch);
        remaining -= usable;
      }
      const today = new Date().toISOString().slice(0, 10);
      pdf.save(`compass-report-${today}.pdf`);
    } catch (e) {
      setPdfError("Could not generate PDF. Please try again.");
    } finally { setPdfLoading(false); }
  }, [recs, pdfLoading]);

  const ts = new Date().toISOString().slice(0, 10);

  if (loading) return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-brand-green rounded-full animate-spin mx-auto mb-3" />
        <div className="text-xs text-[#4f6280] font-semibold mb-1">Analyzing comparable implementations</div>
      </div>
    </div>
  );

  if (loadError) return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-sm text-[#4f6280] font-semibold mb-4">{loadError}</p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => { setLoadError(null); submit(); }} className="px-4 py-1.5 bg-brand-green text-white text-xs font-bold rounded-lg hover:bg-brand-green-dark">Retry</button>
          <button onClick={() => router.push("/assessment")} className="px-4 py-1.5 border border-[#cad3df] text-[#4f6280] text-xs font-bold rounded-lg">Back</button>
        </div>
      </div>
    </div>
  );

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
  const statusLabel = "Recommendation Complete";

  return (
    <div className="bg-[#fbfcfd] min-h-screen">
      <div ref={contentRef} className="w-full max-w-[1200px] mx-auto px-[min(36px,5vw)] pt-24 pb-8">
        <div id="compass-report-content" className="space-y-4">

          {/* ===== HEADER ===== */}
          <header className="bg-white rounded-2xl p-8 shadow-sm border border-[#dfe5ec]">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-[28px] sm:text-[34px] font-extrabold tracking-[-0.04em] text-[#101826] m-0 leading-tight">Compass Recommendation</h1>
                  <span className="px-3 py-1 rounded-full bg-brand-green-light text-brand-green-dark text-[11px] font-extrabold uppercase whitespace-nowrap">{statusLabel}</span>
                </div>
                <p className="text-[#4f6280] font-semibold mt-1 mb-2 text-[15px]">Evidence-driven decision brief for your team</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] font-semibold text-[#5f718f]">
                  <span>Engine v3.0.0</span>
                  <span>Dataset v3</span>
                  <span>Generated {ts}</span>
                  <span>{top.evidence_summary.total_comparables} comparable implementations analyzed</span>
                </div>
              </div>
              <button
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
                className="min-h-[44px] px-[18px] rounded-lg border border-[#cad3df] bg-white text-[#101826] font-extrabold text-sm inline-flex items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                {pdfLoading ? (
                  <><div className="w-4 h-4 border-2 border-gray-300 border-t-brand-green rounded-full animate-spin" /> Preparing report...</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download PDF</>
                )}
              </button>
            </div>
            {pdfError && <p className="text-xs text-red-600 mt-4">{pdfError}</p>}
          </header>

          {/* ===== RECOMMENDED PATH (top recommendation) ===== */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-brand-green/30">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-[#d7a500] text-white flex items-center justify-center text-[11px] font-extrabold">1</span>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-green-light text-brand-green-dark text-[10px] font-extrabold uppercase">Recommended Path</span>
              <span className="text-[11px] font-bold text-[#4f6280] ml-auto">{Math.round(top.confidence.score * 100)}% confidence</span>
            </div>

            {/* Action statement */}
            <h2 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#101826] mb-1">
              {top.specific_action || top.title}
            </h2>
            {top.subtitle && (
              <p className="text-[12px] font-semibold text-[#4f6280] mb-4">{top.subtitle}</p>
            )}
            {top.description && (
              <p className="text-[12px] text-[#4f6280] leading-[1.5] mb-5 border-l-2 border-brand-green pl-3">{top.description}</p>
            )}

            {/* Evidence-derived outcome ranges */}
            {top.outcome_ranges && top.outcome_ranges.length > 0 && (
              <div className="mb-6">
                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#5f718f] mb-2.5">Observed outcomes from comparable implementations</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {top.outcome_ranges.slice(0, 5).map((r, i) => (
                    <div key={i} className="bg-[#f6f8fa] rounded-xl px-4 py-3 border border-[#e6eaef]">
                      <div className="text-[16px] font-extrabold text-[#101826]">{formatRange(r)}</div>
                      <div className="text-[9px] font-bold text-[#586984] uppercase tracking-[0.04em] mt-0.5">{r.metric}</div>
                      <div className="text-[8px] text-[#75859b] mt-0.5">{r.count} implementation{r.count !== 1 ? "s" : ""}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial estimates (if available) */}
            {top.impact.annual_savings.status === "calculated" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-[#f0faf0] rounded-xl px-4 py-3 border border-[#d4ebd4]">
                  <div className="text-[16px] font-extrabold text-brand-green-dark">{formatCurrency(top.impact.annual_savings.expected)}</div>
                  <div className="text-[9px] font-bold text-[#4f6280] uppercase tracking-[0.04em]">Est. annual savings</div>
                </div>
                <div className="bg-[#eef4fb] rounded-xl px-4 py-3 border border-[#d4e0f0]">
                  <div className="text-[16px] font-extrabold text-brand-blue">{formatHours(top.impact.annual_hours_returned.expected)}h</div>
                  <div className="text-[9px] font-bold text-[#4f6280] uppercase tracking-[0.04em]">Est. hours returned</div>
                </div>
                <div className="bg-[#f4eefb] rounded-xl px-4 py-3 border border-[#e0d4f0]">
                  <div className="text-[16px] font-extrabold text-brand-purple">{timelineDisplay(top.impact.implementation_timeline)}</div>
                  <div className="text-[9px] font-bold text-[#4f6280] uppercase tracking-[0.04em]">Timeline</div>
                </div>
                <div className="bg-[#fbf4ee] rounded-xl px-4 py-3 border border-[#f0e0d4]">
                  <div className="text-[16px] font-extrabold text-brand-orange">{teamDisplay(top.impact.project_team)}</div>
                  <div className="text-[9px] font-bold text-[#4f6280] uppercase tracking-[0.04em]">Project team</div>
                </div>
              </div>
            )}

            {/* If savings insufficient, show outcome ranges more prominently + data note */}
            {top.impact.annual_savings.status !== "calculated" && (
              <div className="text-[10px] text-[#5f718f] italic mb-5 border-t border-[#ebeff4] pt-4">
                Organization-specific savings estimates require current workflow volume, headcount, and labor cost information.
                {top.impact.annual_savings.basis && ` ${top.impact.annual_savings.basis}`}
                <br />The ranges above show what comparable organizations achieved.
              </div>
            )}

            {/* Why ranked first */}
            {top.why_ranked_first && (
              <div className="mb-6 border-t border-[#ebeff4] pt-5">
                <h3 className="flex items-center gap-2 text-[15px] font-extrabold tracking-[-0.01em] text-[#101826] mb-3">
                  Why this ranked first
                </h3>
                <p className="text-[11px] text-[#4f6280] leading-[1.5] mb-4">{top.why_ranked_first.summary}</p>

                {top.why_ranked_first.key_strengths.length > 0 && (
                  <ul className="space-y-1.5 mb-4">
                    {top.why_ranked_first.key_strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-[#4f6280]">
                        <span className="text-brand-green mt-0.5 shrink-0">&#10003;</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                )}

                {/* vs Alternatives comparison */}
                {top.why_ranked_first.vs_alternatives.length > 0 && (
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#5f718f] mb-2">How it compares to alternatives</p>
                    <div className="space-y-2">
                      {top.why_ranked_first.vs_alternatives.map((alt, i) => (
                        <div key={i} className="bg-[#f6f8fa] rounded-lg px-4 py-3 border border-[#e6eaef]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-extrabold text-[#101826]">vs {alt.alternative}</span>
                            {alt.confidence_gap > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-brand-green-light text-brand-green-dark text-[8px] font-extrabold">
                                +{alt.confidence_gap}% confidence
                              </span>
                            )}
                          </div>
                          {alt.why_lower && <p className="text-[10px] text-[#5f718f]">{alt.why_lower}</p>}
                          {alt.when_to_consider && <p className="text-[10px] text-[#75859b] italic mt-0.5">{alt.when_to_consider}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Comparable implementations */}
            {top.comparable_implementations && top.comparable_implementations.length > 0 && (
              <div className="border-t border-[#ebeff4] pt-5">
                <h3 className="text-[15px] font-extrabold tracking-[-0.01em] text-[#101826] mb-3">Comparable implementations</h3>
                <div className="space-y-3">
                  {top.comparable_implementations.filter(c => c.evidence_tier !== "rejected" && !isBadValue(c.organization)).slice(0, 4).map((c, i) => {
                    const company = formatCompany(c.organization);
                    return (
                      <div key={i} className="bg-[#f6f8fa] rounded-xl px-4 py-3.5 border border-[#e6eaef]">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span className="w-[18px] h-[18px] rounded-full shrink-0 bg-[#11263c] text-white flex items-center justify-center text-[7px] font-bold uppercase">{companyInitials(company)}</span>
                          <span className="text-[12px] font-extrabold text-[#101826]">{company}</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-[0.04em] border ml-auto ${tierBadge(c.evidence_tier)}`}>{tierLabel(c.evidence_tier)}</span>
                        </div>
                        {c.workflow_context && <p className="text-[10px] text-[#586984] font-semibold mb-1 ml-[26px]">{c.workflow_context}</p>}
                        {c.intervention && <p className="text-[10px] text-[#4f6280] ml-[26px] leading-[1.4]">Applied: {c.intervention}</p>}
                        <p className="text-[10px] text-[#4f6280] ml-[26px] leading-[1.3]">{c.outcome_summary}</p>
                        {c.relevance_explanation && (
                          <p className="text-[9px] text-[#75859b] italic ml-[26px] mt-1">{c.relevance_explanation}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {top.comparable_implementations.filter(c => c.evidence_tier !== "rejected" && !isBadValue(c.organization)).length > 4 && (
                  <details className="mt-2">
                    <summary className="text-[10px] font-bold text-brand-green cursor-pointer py-1">Show all {top.comparable_implementations.length} comparable implementations</summary>
                    <div className="space-y-3 mt-2">
                      {top.comparable_implementations.filter(c => c.evidence_tier !== "rejected" && !isBadValue(c.organization)).slice(4).map((c, i) => {
                        const company = formatCompany(c.organization);
                        return (
                          <div key={i} className="bg-[#f6f8fa] rounded-xl px-4 py-3.5 border border-[#e6eaef]">
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <span className="w-[18px] h-[18px] rounded-full shrink-0 bg-[#11263c] text-white flex items-center justify-center text-[7px] font-bold uppercase">{companyInitials(company)}</span>
                              <span className="text-[12px] font-extrabold text-[#101826]">{company}</span>
                              <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-[0.04em] border ml-auto ${tierBadge(c.evidence_tier)}`}>{tierLabel(c.evidence_tier)}</span>
                            </div>
                            {c.workflow_context && <p className="text-[10px] text-[#586984] font-semibold mb-1 ml-[26px]">{c.workflow_context}</p>}
                            {c.intervention && <p className="text-[10px] text-[#4f6280] ml-[26px] leading-[1.4]">Applied: {c.intervention}</p>}
                            <p className="text-[10px] text-[#4f6280] ml-[26px] leading-[1.3]">{c.outcome_summary}</p>
                            {c.relevance_explanation && (
                              <p className="text-[9px] text-[#75859b] italic ml-[26px] mt-1">{c.relevance_explanation}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </details>
                )}
              </div>
            )}

            {/* Evidence + confidence footer */}
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#ebeff4]">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-[0.04em] border ${tierBadge(top.evidence_summary.overall_tier)}`}>{tierLabel(top.evidence_summary.overall_tier)}</span>
              <span className="text-[10px] font-bold text-[#586984]">{evidenceMixSummary(top.evidence_summary)}</span>
              <span className="text-[10px] text-[#5f718f] ml-auto">{top.confidence.explanation.slice(0, 80)}{top.confidence.explanation.length > 80 ? "..." : ""}</span>
            </div>
          </section>

          {/* ===== ALTERNATIVE OPTIONS ===== */}
          {alternatives.length > 0 && (
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#dfe5ec]">
              <h2 className="text-[15px] font-extrabold tracking-[-0.01em] text-[#101826] mb-4">Alternative approaches considered</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {alternatives.map((r) => {
                  const isSecond = r.rank === 2;
                  return (
                    <div key={r.rank} className={`bg-white rounded-xl p-5 border-2 ${isSecond ? "border-brand-blue/30" : "border-brand-orange/30"} shadow-sm`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shrink-0 ${isSecond ? "bg-[#657386]" : "bg-[#a8490c]"}`}>{r.rank}</span>
                        <span className="text-[12px] font-extrabold text-[#101826]">{r.title}</span>
                      </div>
                      {r.subtitle && <p className="text-[10px] font-semibold text-[#4f6280] mb-2">{r.subtitle}</p>}
                      <div className="flex items-center gap-3 mb-2 text-[10px] text-[#5f718f]">
                        <span className="font-bold">{Math.round(r.confidence.score * 100)}% confidence</span>
                        <span>{r.evidence_summary.total_comparables} comparable{r.evidence_summary.total_comparables !== 1 ? "s" : ""}</span>
                      </div>
                      {r.rationale && <p className="text-[10px] text-[#4f6280] leading-[1.4]">{r.rationale}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ===== RISKS ===== */}
          {top.risks?.length > 0 && (
            <section className="border border-[#f3c7c9] rounded-[18px] bg-risk-light px-7 py-[22px] pb-[25px] shadow-sm">
              <h2 className="flex items-center gap-2 text-[17px] font-extrabold tracking-[-0.02em] m-0 mb-[18px]">Potential risks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {top.risks.slice(0, 4).map((risk, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-[#efc8ca]">
                    <p className="text-[12px] font-extrabold text-[#1b2432] mb-1">{risk.title || risk.category || "Risk"}</p>
                    <p className="text-[11px] text-[#4f6280] leading-[1.4] mb-2">{risk.explanation || risk.risk || ""}</p>
                    {risk.mitigation && (
                      <p className="text-[10px] text-brand-green-dark font-semibold">Mitigation: {risk.mitigation}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===== ASSUMPTIONS & INFORMATION GAPS ===== */}
          {(top.assumptions_detail?.length > 0 || top.information_gaps?.length > 0) && (
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#dfe5ec]">
              <h2 className="text-[15px] font-extrabold tracking-[-0.01em] text-[#101826] mb-4">Assumptions and information gaps</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {top.assumptions_detail?.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#5f718f] mb-2.5">Assumptions made</h3>
                    <div className="space-y-2.5">
                      {top.assumptions_detail.map((a, i) => (
                        <div key={i} className="bg-[#fcf8f0] rounded-lg px-3.5 py-2.5 border border-[#f0e8d4]">
                          <p className="text-[11px] text-[#4f6280] leading-[1.4]">{a.assumption}</p>
                          {a.impact_on_outcome && <p className="text-[9px] text-[#75859b] italic mt-1">{a.impact_on_outcome}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {top.information_gaps?.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#5f718f] mb-2.5">What would improve this analysis</h3>
                    <div className="space-y-2.5">
                      {top.information_gaps.map((g, i) => (
                        <div key={i} className={`rounded-lg px-3.5 py-2.5 border ${g.priority === "high" ? "bg-[#fcf0f0] border-[#f0d4d4]" : "bg-[#f6f8fa] border-[#e6eaef]"}`}>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="text-[11px] font-bold text-[#4f6280]">{g.gap}</p>
                            {g.priority === "high" && <span className="px-1 py-0.5 rounded bg-red-100 text-red-700 text-[7px] font-extrabold uppercase">Critical</span>}
                          </div>
                          {g.why_needed && <p className="text-[9px] text-[#75859b]">{g.why_needed}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ===== NEXT VALIDATION STEP ===== */}
          {top.next_validation_step && (
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-brand-green/20">
              <h2 className="flex items-center gap-2 text-[17px] font-extrabold tracking-[-0.02em] text-[#101826] mb-3">Recommended next step</h2>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-brand-green-light flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-brand-green-dark text-[16px] font-extrabold">&#8594;</span>
                </div>
                <div>
                  <p className="text-[14px] font-extrabold text-[#101826] mb-1.5">{top.next_validation_step.action}</p>
                  <p className="text-[11px] text-[#4f6280] leading-[1.5] mb-1.5">{top.next_validation_step.why}</p>
                  {top.next_validation_step.estimated_effort && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#edf0f3] text-[#1a1f2b] text-[9px] font-extrabold">{top.next_validation_step.estimated_effort}</span>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ===== ABOUT THIS ANALYSIS ===== */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#dfe5ec] text-[11px] text-[#5f718f] leading-[1.5]">
            <h2 className="text-[13px] font-extrabold text-[#4f6280] mb-2">About this analysis</h2>
            <p>
              Compass is an evidence-driven recommendation engine. It does not generate outcomes — it surfaces
              real implementations from organizations with similar workflows, constraints, and objectives.
              Each recommendation is ranked by a combination of evidence volume, outcome quality, workflow fit,
              and organizational similarity. The database contains {top.evidence_summary.total_comparables} implementations
              relevant to this assessment. Confidence reflects how many of those implementations measured and
              quantified their outcomes, not just tool adoption.
            </p>
            <p className="mt-2">
              This analysis is based on the information you provided. Outcomes observed in comparable organizations
              do not guarantee identical results. We recommend validating the recommended approach through a
              bounded pilot before making a full commitment.
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
