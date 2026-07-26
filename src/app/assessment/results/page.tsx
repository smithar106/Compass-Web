"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY = "compass-assessment-session";

interface ComparableEvidence {
  record_id: string; organization: string; intervention: string;
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

interface RecommendationData {
  rank: number; is_compass_choice: boolean; intervention_id: string;
  category: string; title: string; subtitle: string; description: string;
  selection_status: string; rationale: string; why_it_ranked_here: string[];
  assumptions: string[];
  confidence: { score: number; label: string; explanation: string };
  impact: ImpactSummary;
  evidence_summary: {
    overall_tier: string; total_comparables: number; gold_count: number;
    silver_count: number; bronze_count: number; average_evidence_score: number;
  };
  comparable_implementations: ComparableEvidence[];
  risks: any[];
  alternatives_considered: { family: string; reason: string; confidence_score: number }[];
}

const TIER_CONFIG: Record<string, { label: string; badge: string }> = {
  gold: { label: "Gold", badge: "bg-yellow-50 text-yellow-800 border-yellow-300" },
  silver: { label: "Silver", badge: "bg-gray-100 text-gray-600 border-gray-300" },
  bronze: { label: "Bronze", badge: "bg-orange-50 text-orange-800 border-orange-300" },
  insufficient: { label: "Insufficient", badge: "bg-red-50 text-red-700 border-red-200" },
};

const BAD_PATTERNS = [/^unknown$/i, /^null$/i, /^undefined$/i, /^n\/?a$/i, /^\s*$/, /^none$/i, /^not\s+available/i];

const STATUS_LABELS: Record<string, string> = {
  calculated: "", insufficient_input: "Additional operating data required", not_applicable: "Not applicable",
};

function tierBadge(tier: string): string {
  return (TIER_CONFIG[tier?.toLowerCase()] || TIER_CONFIG.insufficient).badge;
}

function tierLabel(tier: string): string {
  return (TIER_CONFIG[tier?.toLowerCase()] || TIER_CONFIG.insufficient).label;
}

function formatCurrency(n: number | null | undefined): string {
  if (n == null) return "";
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
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

function impactValue(est: ImpactEstimate): string {
  if (est.status === "calculated" && est.expected != null) {
    return formatCurrency(est.expected);
  }
  return STATUS_LABELS[est.status] || "Additional operating data required";
}

function impactRange(est: ImpactEstimate): string | null {
  if (est.status === "calculated" && est.low != null && est.high != null) {
    return `${formatCurrency(est.low)} – ${formatCurrency(est.high)} range`;
  }
  return null;
}

function hoursValue(est: ImpactEstimate): string {
  if (est.status === "calculated" && est.expected != null) {
    return `${formatHours(est.expected)} hrs/yr`;
  }
  return STATUS_LABELS[est.status] || "Additional operating data required";
}

function hoursRange(est: ImpactEstimate): string | null {
  if (est.status === "calculated" && est.low != null && est.high != null) {
    return `${formatHours(est.low)} – ${formatHours(est.high)} hours range`;
  }
  return null;
}

function timelineDisplay(tl: { min_weeks: number | null; expected_weeks: number | null; max_weeks: number | null }): string {
  if (tl.min_weeks && tl.max_weeks) return `${tl.min_weeks}–${tl.max_weeks} weeks`;
  if (tl.expected_weeks) return `${tl.expected_weeks} weeks`;
  return "Not available";
}

function teamDisplay(team: { min_people: number; expected_people: number; max_people: number }): string {
  if (team.min_people && team.max_people) return `${team.min_people}–${team.max_people} people`;
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
  const statusLabel = recs.length > 0 && recs.every(r => r.selection_status === "recommended") ? "Recommendation Complete" : "";

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

  return (
    <div className="bg-[#fbfcfd] min-h-screen">
      <div ref={contentRef} className="w-full max-w-[1500px] mx-auto px-[min(36px,5vw)] pt-24 pb-8">
        <div id="compass-report-content" className="bg-white rounded-2xl p-8 shadow-sm border border-[#dfe5ec]">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8 pb-6 border-b border-[#dfe5ec]">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[28px] sm:text-[34px] font-extrabold tracking-[-0.04em] text-[#101826] m-0 leading-tight">Compass Recommendation</h1>
                {statusLabel && <span className="px-3 py-1 rounded-full bg-brand-green-light text-brand-green-dark text-[11px] font-extrabold uppercase">{statusLabel}</span>}
              </div>
              <p className="text-[#4f6280] font-semibold mt-1 mb-2 text-[15px]">Evidence-driven analysis complete</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] font-semibold text-[#5f718f]">
                <span>Engine v3.0.0</span>
                <span>Dataset v3</span>
                <span>Generated {ts}</span>
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
          {pdfError && <p className="text-xs text-red-600 mb-4">{pdfError}</p>}

          {/* RECOMMENDATION CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8 items-stretch">
            {recs.map((r) => {
              const savings = r.impact.annual_savings;
              const hours = r.impact.annual_hours_returned;
              const tl = r.impact.implementation_timeline;
              const team = r.impact.project_team;
              const es = r.evidence_summary;
              const hasSavings = savings.status === "calculated";
              const hasHours = hours.status === "calculated";
              const topEv = (r.comparable_implementations || []).filter(c => c.evidence_tier !== "rejected" && !isBadValue(c.organization)).slice(0, 2);

              return (
                <div key={r.rank} className={`bg-white border-2 ${r.rank === 1 ? "border-brand-green" : r.rank === 2 ? "border-brand-blue" : "border-brand-orange"} rounded-[14px] p-[18px] flex flex-col shadow-[0_8px_24px_rgba(15,23,42,0.05)]`}>
                  {/* Rank + Status */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-extrabold text-white shrink-0 ${r.rank === 1 ? "bg-[#d7a500]" : r.rank === 3 ? "bg-[#a8490c]" : "bg-[#657386]"}`}>{r.rank}</span>
                    <span className={`px-[8px] py-[3px] rounded-full text-[9px] font-extrabold uppercase ${r.rank === 1 ? "bg-brand-green-light text-brand-green-dark" : "bg-[#edf0f3] text-[#1a1f2b]"}`}>
                      {r.rank === 1 ? "Recommended" : "Alternative"}
                    </span>
                  </div>

                  {/* Title + Subtitle */}
                  <h2 className="text-[16px] font-extrabold tracking-[-0.02em] text-[#101826] m-0 leading-[1.2]">{r.title}</h2>
                  {r.subtitle && <p className="text-[11px] font-semibold text-[#4f6280] m-0 mt-0.5 mb-2">{r.subtitle}</p>}

                  {/* Why it ranked */}
                  {r.rationale && (
                    <p className="text-[10px] text-[#5a6b84] leading-[1.4] mb-3 border-l-2 border-brand-green pl-2">{r.rationale}</p>
                  )}

                  {/* Impact grid */}
                  <div className="grid grid-cols-4 gap-1 mb-3 mt-1">
                    <div>
                      <div className="text-[10px] font-extrabold text-brand-green truncate">{hasSavings ? formatCurrency(savings.expected) : "N/A"}</div>
                      <div className="text-[8px] font-bold text-[#61718a] uppercase tracking-[0.04em]">Annual savings</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold text-brand-blue truncate">{hasHours ? `${formatHours(hours.expected)}h` : "N/A"}</div>
                      <div className="text-[8px] font-bold text-[#61718a] uppercase tracking-[0.04em]">Hours returned</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold text-brand-purple truncate">{timelineDisplay(tl)}</div>
                      <div className="text-[8px] font-bold text-[#61718a] uppercase tracking-[0.04em]">Timeline</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold text-brand-orange truncate">{teamDisplay(team)}</div>
                      <div className="text-[8px] font-bold text-[#61718a] uppercase tracking-[0.04em]">Project team</div>
                    </div>
                  </div>

                  {/* Evidence badge + mix */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`px-[6px] py-[2px] rounded-full text-[8px] font-extrabold uppercase tracking-[0.04em] border ${tierBadge(es.overall_tier)}`}>{tierLabel(es.overall_tier)}</span>
                    <span className="text-[#586984] text-[9px] font-bold">{evidenceMixSummary(es)}</span>
                    <span className="text-[10px] font-extrabold text-brand-green-dark ml-auto">{Math.round(r.confidence.score * 100)}% confidence</span>
                  </div>

                  {/* Top comparative evidence */}
                  <div className="flex-1 min-h-0">
                    {topEv.length > 0 ? topEv.map((c, i) => {
                      const company = formatCompany(c.organization);
                      return (
                        <div key={i} className="py-[6px] border-b border-[#ebeff4] last:border-0">
                          <div className="flex items-center gap-[6px] mb-1">
                            <span className="w-[16px] h-[16px] rounded-full shrink-0 bg-[#11263c] text-white flex items-center justify-center text-[7px] font-bold uppercase">{companyInitials(company)}</span>
                            <span className="text-[10px] font-extrabold text-[#101826]">{company}</span>
                          </div>
                          <p className="text-[9px] text-[#4f6280] leading-[1.3] ml-[22px]">{c.outcome_summary}</p>
                          {c.relevance_explanation && (
                            <p className="text-[8px] text-[#75859b] italic ml-[22px]">{c.relevance_explanation}</p>
                          )}
                        </div>
                      );
                    }) : (
                      <div className="text-[10px] text-[#5a6b84] font-bold py-[6px]">Evidence unavailable</div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-[10px] border-t border-[#ebeff4] flex items-center justify-between">
                    <span className="text-[9px] font-semibold text-[#5a6b84]">{r.confidence.explanation.slice(0, 60)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RISKS */}
          {recs[0]?.risks?.length > 0 && (
            <section className="mt-5 border border-[#f3c7c9] rounded-[18px] bg-risk-light px-7 py-[22px] pb-[25px]">
              <h2 className="flex items-center gap-3 text-[19px] font-extrabold tracking-[-0.02em] m-0 mb-[22px]">Potential Risks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recs[0].risks.slice(0, 4).map((risk, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-[#efc8ca]">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-[12px] font-extrabold text-[#1b2432] mb-1">{risk.title || risk.category || "Risk"}</p>
                        <p className="text-[11px] text-[#4f6280] leading-[1.4] mb-2">{risk.explanation || risk.risk || ""}</p>
                        {risk.mitigation && (
                          <p className="text-[10px] text-brand-green-dark font-semibold">Mitigation: {risk.mitigation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DATA QUALITY NOTE */}
          {recs[0]?.impact.annual_savings.status === "insufficient_input" && recs[0]?.impact.annual_hours_returned.status === "insufficient_input" && (
            <section className="mt-5 border border-[#dfe5ec] rounded-[18px] bg-white px-7 py-[22px]">
              <h2 className="text-[13px] font-extrabold text-[#4f6280] mb-2">Additional data would improve estimates</h2>
              <p className="text-[11px] text-[#5a6b84] leading-[1.5]">
                Financial and time-savings estimates require current workflow volume, headcount, and labor cost information.
                {recs[0].impact.annual_savings.basis && ` ${recs[0].impact.annual_savings.basis}`}
              </p>
            </section>
          )}
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
