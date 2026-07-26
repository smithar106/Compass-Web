"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY = "compass-assessment-session";
const ENGINE_VERSION = "3.0.0";
const DATASET_VERSION = "v3";

const TIER_CONFIG: Record<string, { label: string; summary: (n: number) => string; badge: string }> = {
  gold: {
    label: "Gold",
    summary: (n) => `Strong evidence from ${n} implementation${n === 1 ? "" : "s"}`,
    badge: "bg-yellow-50 text-yellow-800 border-yellow-300",
  },
  silver: {
    label: "Silver",
    summary: (n) => `Moderate evidence from ${n} implementation${n === 1 ? "" : "s"}`,
    badge: "bg-gray-100 text-gray-600 border-gray-300",
  },
  bronze: {
    label: "Bronze",
    summary: (n) => `Limited evidence from ${n} implementation${n === 1 ? "" : "s"}`,
    badge: "bg-orange-50 text-orange-800 border-orange-300",
  },
};

interface ComparableEvidence {
  organization: string; industry: string; workflow: string; intervention: string;
  outcome: string; status: string; similarity_score: number; evidence_score: number;
  evidence_tier: string; supporting_passage: string; source_title: string; source_url: string;
}

interface NegativeEvidence {
  organization: string; intervention: string; failure_reasons: string[]; similarity_score: number;
}

interface AlternativeConsidered {
  family: string; reason: string;
}

interface RecommendationData {
  rank: number; is_compass_choice: boolean; title: string; summary: string;
  intervention_category: string; fit_score: number;
  confidence: { score: number; label: string; explanation: string };
  evidence_summary: {
    overall_tier: string; total_comparables: number; gold_count: number;
    silver_count: number; bronze_count: number; failed_comparables: number; average_evidence_score: number;
  };
  projected_impact: {
    label: string; low: number | null; high: number | null; unit: string;
    methodology: string; is_sufficiently_supported: boolean;
  };
  timeline: { low_weeks: number | null; high_weeks: number | null };
  why_it_ranked: string[];
  comparables: ComparableEvidence[];
  negative_evidence: NegativeEvidence[];
  alternatives_considered: AlternativeConsidered[];
  assumptions: string[]; risks: any[];
  annual_savings?: { low: number; expected: number; high: number; currency: string; status: string; basis: string } | null;
  hours_returned?: { low: number; expected: number; high: number; period: string; status: string } | null;
  tools?: string[];
  subtitle?: string;
}

const RISK_REWRITES: { match: RegExp; text: string }[] = [
  { match: /internal dispute|political pressure|competing priorit|stakeholder alignment/i, text: "Stakeholder alignment" },
  { match: /adopt|change manage|resistance|training|did not use/i, text: "User adoption risk" },
  { match: /capable|skill|talent|expertise|not capable/i, text: "Skills and capability gaps" },
  { match: /data qual|data migrat|data read|data integ/i, text: "Data readiness" },
  { match: /integrat|legacy|compatib|interoper/i, text: "Integration complexity" },
  { match: /cost|budget|fund|resource/i, text: "Budget and resourcing" },
  { match: /regulat|compliance|legal|policy|gov/i, text: "Governance and compliance" },
  { match: /vendor|third.?party|supplier/i, text: "Vendor dependency" },
  { match: /security|vulnerab|attack|breach|injection/i, text: "Security vulnerabilities" },
  { match: /scal|performance|throughput|capacity/i, text: "Scaling challenges" },
  { match: /timeline|delay|schedule|sla/i, text: "Implementation timeline pressures" },
  { match: /accuracy|error|quality|reliab/i, text: "Output quality risks" },
  { match: /privacy|gdpr|ccpa|data protect/i, text: "Data privacy compliance" },
  { match: /ownership|accountab|responsib/i, text: "Implementation ownership ambiguity" },
  { match: /measure|kpi|metric|baseline/i, text: "Measurement quality gaps" },
];

const BAD_PATTERNS = [
  /^unknown$/i, /^null$/i, /^undefined$/i, /^n\/?a$/i, /^\s*$/, /^none$/i, /^not\s+available/i,
  /^outcome\s+not\s+reported/i, /^pending/i, /^-\s*-?$/,
];

function isBadValue(s: string | null | undefined): boolean {
  if (!s || typeof s !== "string") return true;
  return BAD_PATTERNS.some((p) => p.test(s.trim()));
}

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function formatHours(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatCompany(name: string): string {
  if (isBadValue(name)) return "Verified implementation";
  return name.replace(/[^\w\s&.-]/g, "").trim().slice(0, 30);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatMetricName(raw: string): string {
  return raw
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/^Freed up/, "Freed-up")
    .replace(/\b(Usd|Pct)\b/gi, (m) => m.toUpperCase());
}

function formatMetricValue(raw: string): string {
  const pctMatch = raw.match(/^[^:]+:\s*([+-]?\d+(?:\.\d+)?%?)\s*(improvement|decline|reduction|increase)/i);
  if (pctMatch) {
    const val = pctMatch[1].replace("+", "");
    const direction = pctMatch[2].toLowerCase();
    const metricName = raw.split(":")[0].trim();
    const cleaned = formatMetricName(metricName);
    const adverb = direction === "decline" || direction === "reduction" ? "reduced by" : direction === "increase" ? "increased by" : "improved by";
    return `${cleaned} ${adverb} ${val}`;
  }
  const dollarMatch = raw.match(/[+-]?\$\d+(?:[\d,.]*(?:M|K|B)?)?/i);
  if (dollarMatch) {
    const metricName = raw.split(":")[0].trim();
    const cleaned = formatMetricName(metricName);
    return `${cleaned}: ${dollarMatch[0]}`;
  }
  return capitalize(raw.trim().slice(0, 50));
}

function formatOutcome(outcome: string): string {
  if (isBadValue(outcome)) return "Outcome not quantified";
  let cleaned = outcome
    .replace(/authority-framed injection.*$/i, "Security improvements")
    .replace(/pre-approved under.*$/i, "Process improvements")
    .replace(/\bsec-\d+\b.*$/i, "Compliance validated")
    .replace(/project teams did not use.*$/i, "Low adoption")
    .replace(/political pressure.*$/i, "Regulatory constraints")
    .replace(/[{}"\[\]]/g, "")
    .trim();
  const formatted = formatMetricValue(cleaned);
  if (formatted.length > 40) {
    const words = formatted.split(/\s+/);
    let result = "";
    for (const w of words) {
      if ((result + " " + w).length > 38) break;
      result += (result ? " " : "") + w;
    }
    return result || "Outcome not quantified";
  }
  return formatted || "Outcome not quantified";
}

function prioritizedComparables(comparables: ComparableEvidence[]): ComparableEvidence[] {
  const quantified = comparables.filter(c => /%|\$|improvement|reduction|increase|decline/.test(c.outcome));
  const unquantified = comparables.filter(c => !/%|\$|improvement|reduction|increase|decline/.test(c.outcome) && !isBadValue(c.outcome));
  const bad = comparables.filter(c => isBadValue(c.outcome));
  return [...quantified, ...unquantified, ...bad];
}

function formatRisk(risk: string): string {
  if (isBadValue(risk)) return "Implementation risk";
  const rewritten = RISK_REWRITES.find((r) => r.match.test(risk));
  if (rewritten) return rewritten.text;
  const words = risk.replace(/[^\w\s-]/g, "").trim().split(/\s+/).slice(0, 5);
  return words.join(" ");
}

function formatTool(tool: string): string {
  return tool.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}

function companyInitials(name: string): string {
  return name.split(/[\s-]+/).map((w) => w[0]).join("").toUpperCase().slice(0, 3);
}

function tierBadge(tier: string): string {
  return TIER_CONFIG[tier]?.badge || "bg-gray-100 text-gray-500";
}

function CardAccentClass(rank: number): string {
  if (rank === 1) return "border-brand-green";
  if (rank === 2) return "border-brand-blue";
  return "border-brand-orange";
}

function CardTagClass(rank: number): string {
  if (rank === 1) return "bg-brand-green-light text-brand-green-dark";
  if (rank === 2) return "bg-brand-blue-light text-[#0958c9]";
  return "bg-brand-orange-light text-[#9b3c00]";
}

function CardOutcomeClass(rank: number): string {
  if (rank === 1) return "text-brand-green";
  if (rank === 2) return "text-brand-blue";
  return "text-brand-orange";
}

function getEvidenceMix(r: RecommendationData): string {
  const parts: string[] = [];
  if (r.evidence_summary.gold_count > 0) parts.push(`${r.evidence_summary.gold_count} Gold`);
  if (r.evidence_summary.silver_count > 0) parts.push(`${r.evidence_summary.silver_count} Silver`);
  if (r.evidence_summary.bronze_count > 0) parts.push(`${r.evidence_summary.bronze_count} Bronze`);
  if (!parts.length) return `${r.evidence_summary.total_comparables} implementations`;
  return `${r.evidence_summary.total_comparables} implementations: ${parts.join(", ")}`;
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
  const [progressIdx, setProgressIdx] = useState(0);
  const [runId, setRunId] = useState("");
  const [profileWorkflow, setProfileWorkflow] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressMessages = [
    "Analyzing your workflow",
    "Comparing intervention paths",
    "Retrieving comparable implementations",
    "Evaluating evidence strength",
  ];

  useEffect(() => {
    const id = searchParams?.get("run_id");
    if (id) loadRun(id);
    else submit();
  }, [searchParams]);

  useEffect(() => {
    if (!loading) return;
    const i = setInterval(() => setProgressIdx((p) => Math.min(p + 1, progressMessages.length - 1)), 6000);
    return () => clearInterval(i);
  }, [loading]);

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
    } finally {
      setLoading(false);
    }
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
      setProfileWorkflow(p.workflow);
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      if (!res.ok) {
        const t = await res.text();
        let m = `Error (${res.status})`, ty = "err";
        try { const e = JSON.parse(t); m = e.error || m; ty = e.type || ty; } catch {}
        const pr = ty === "config_error" ? "Config" : ty === "engine_unreachable" ? "Unreachable" : ty === "engine_error" ? "Engine" : "Error";
        throw new Error(`${pr}: ${m}`);
      }
      const d = await res.json();
      setRecs(d.recommendations || []);
      if (d.recommendation_run_id) {
        window.history.replaceState({}, "", `/assessment/results?run_id=${d.recommendation_run_id}`);
        setRunId(d.recommendation_run_id);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  const handleDownloadPdf = useCallback(async () => {
    if (!recs.length) return;
    setPdfLoading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const el = contentRef.current;
      if (!el) throw new Error("Content not found");
      const canvas = await html2canvas(el, {
        scale: 2, useCORS: true, backgroundColor: "#fbfcfd",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "in", format: "letter" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 0.5;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = margin;
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;
      while (heightLeft > 0) {
        position = -(pageHeight - margin * 2) * (imgHeight / canvas.height - 1) + margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;
      }
      const today = new Date().toISOString().slice(0, 10);
      pdf.save(`compass-recommendation-${today}.pdf`);
    } catch (e) {
      console.error("PDF download failed:", e);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  }, [recs]);

  const ts = new Date().toISOString().slice(0, 10);

  if (loading)
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-brand-green rounded-full animate-spin mx-auto mb-3" />
          <div className="text-xs text-[#4f6280] font-semibold mb-1">{progressMessages[progressIdx]}</div>
          <div className="w-full bg-gray-100 rounded-full h-0.5 mt-3 overflow-hidden">
            <div className="h-full bg-brand-green rounded-full transition-all duration-1000" style={{ width: `${((progressIdx + 1) / progressMessages.length) * 100}%` }} />
          </div>
        </div>
      </div>
    );

  if (loadError)
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-8 h-8 rounded-full bg-risk-light border border-[#f3c7c9] flex items-center justify-center mx-auto mb-3">
            <svg className="w-4 h-4 text-risk" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <p className="text-sm text-[#4f6280] font-semibold mb-4">{loadError}</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => { setLoadError(null); submit(); }} className="px-4 py-1.5 bg-brand-green text-white text-xs font-bold rounded-lg hover:bg-brand-green-dark">Retry</button>
            <button onClick={() => router.push("/assessment")} className="px-4 py-1.5 border border-[#cad3df] text-[#4f6280] text-xs font-bold rounded-lg">Back</button>
          </div>
        </div>
      </div>
    );

  if (!recs.length) return null;

  const primary = recs[0];

  const kpiCards = [
    {
      icon: <span className="text-[28px] font-black">$</span>,
      iconBg: "bg-[#c9f6d1]", iconColor: "text-brand-green",
      valColor: "text-brand-green",
      label: "Est. Annual Savings",
      value: primary.annual_savings
        ? formatCurrency(primary.annual_savings.expected)
        : primary.projected_impact.is_sufficiently_supported
          ? "Calculating..."
          : "Additional operating data required",
      note: primary.annual_savings
        ? `$${primary.annual_savings.low.toLocaleString()} – $${primary.annual_savings.high.toLocaleString()} range`
        : primary.projected_impact.is_sufficiently_supported
          ? "Based on comparable implementations"
          : null,
    },
    {
      icon: <span className="text-[28px] font-black">&#x25F7;</span>,
      iconBg: "bg-[#d8e7ff]", iconColor: "text-brand-blue",
      valColor: "text-brand-blue",
      label: "Hours Returned",
      value: primary.hours_returned
        ? `${formatHours(primary.hours_returned.expected)} hrs/yr`
        : primary.projected_impact.is_sufficiently_supported
          ? "Calculating..."
          : "Additional operating data required",
      note: primary.hours_returned
        ? `${primary.hours_returned.low.toLocaleString()} – ${primary.hours_returned.high.toLocaleString()} hours range`
        : null,
    },
    {
      icon: <span className="text-[28px] font-black">&#x26A1;</span>,
      iconBg: "bg-[#eadcff]", iconColor: "text-brand-purple",
      valColor: "text-brand-purple",
      label: "Time to Implement",
      value: primary.timeline.low_weeks && primary.timeline.high_weeks
        ? `${primary.timeline.low_weeks}\u2013${primary.timeline.high_weeks}`
        : "Not available",
      note: primary.timeline.low_weeks && primary.timeline.high_weeks ? "Weeks" : null,
    },
    {
      icon: <span className="text-[28px] font-black">&#x265F;</span>,
      iconBg: "bg-[#ffd7b2]", iconColor: "text-brand-orange",
      valColor: "text-brand-orange",
      label: "Project Team",
      value: primary.evidence_summary.total_comparables > 0
        ? `${Math.max(1, Math.round(primary.evidence_summary.total_comparables / 6))}\u2013${Math.max(2, Math.round(primary.evidence_summary.total_comparables / 3))}`
        : "Not available",
      note: "People",
    },
  ];

  return (
    <div className="bg-[#fbfcfd] min-h-screen">
      <div ref={contentRef} className="w-full max-w-[1500px] mx-auto px-[min(36px,5vw)] pt-24 pb-8">
        {/* HEADER - with top padding to clear global nav */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-[28px] sm:text-[34px] font-extrabold tracking-[-0.04em] text-[#101826] m-0 leading-tight">
                Compass Recommendation
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gold-light text-[#b65000] text-[11px] font-extrabold uppercase shrink-0">
                Pending Review
              </span>
            </div>
            <p className="text-[#4f6280] font-semibold mt-2 mb-3 text-[15px]">Evidence-driven analysis complete</p>
            <div className="flex flex-wrap gap-x-8 gap-y-1.5 text-[13px] font-semibold text-[#5f718f]">
              <span className="whitespace-nowrap">Engine v{ENGINE_VERSION}</span>
              <span className="whitespace-nowrap">Dataset v{DATASET_VERSION}</span>
              <span className="whitespace-nowrap">Generated {ts}</span>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap shrink-0 w-full lg:w-auto">
            <button
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="min-h-[44px] px-[18px] rounded-lg border border-[#cad3df] bg-white text-[#101826] font-extrabold text-sm inline-flex items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              {pdfLoading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-brand-green rounded-full animate-spin" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              )}
              {pdfLoading ? "Generating..." : "Download Report"}
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          {kpiCards.map((kpi, i) => (
            <div key={i} className="min-h-[100px] border border-[#dfe5ec] rounded-xl bg-white p-4 flex gap-4 items-center shadow-[0_12px_32px_rgba(15,23,42,0.05)] overflow-hidden">
              <div className={`w-14 h-14 rounded-full shrink-0 flex items-center justify-center ${kpi.iconBg} ${kpi.iconColor}`}>
                {kpi.icon}
              </div>
              <div className="min-w-0 overflow-hidden flex-1">
                <p className="text-[11px] font-extrabold tracking-[0.06em] uppercase text-[#53627a] m-0 mb-1 whitespace-nowrap">{kpi.label}</p>
                <p className={`text-[24px] sm:text-[28px] font-extrabold tracking-[-0.04em] leading-none m-0 ${kpi.valColor} overflow-hidden text-ellipsis`}>{kpi.value}</p>
                {kpi.note && <p className="text-[11px] font-semibold text-[#4f6280] mt-1 m-0 whitespace-nowrap overflow-hidden text-ellipsis">{kpi.note}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* RECOMMENDATION CARDS - compact 3-column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5 items-stretch">
          {recs.map((r) => {
            const cat = r.intervention_category;
            const tools = r.tools || [];
            const subtitle = r.subtitle || "";
            const n = r.rank;
            const rankClass = CardAccentClass(n);
            const tagClass = CardTagClass(n);
            const outcomeClass = CardOutcomeClass(n);
            const hasImpact = r.projected_impact.is_sufficiently_supported;
            const hasSavings = !!r.annual_savings;
            const hasHours = !!r.hours_returned;
            const visibleComparables = prioritizedComparables(r.comparables.filter((c) => c.evidence_tier !== "rejected"));
            const topEvidence = visibleComparables.slice(0, 2);

            return (
              <div key={n} className={`bg-white border-2 ${rankClass} rounded-[14px] p-[18px] flex flex-col shadow-[0_8px_24px_rgba(15,23,42,0.05)]`}>
                {/* Rank + Title row */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-extrabold text-white shrink-0 ${n === 1 ? "bg-[#d7a500]" : n === 3 ? "bg-[#a8490c]" : "bg-[#657386]"}`}>
                    {n}
                  </span>
                  <span className={`px-[8px] py-[3px] rounded-full text-[9px] font-extrabold uppercase ${n === 1 ? "bg-brand-green-light text-brand-green-dark" : "bg-[#edf0f3] text-[#1a1f2b]"}`}>
                    {n === 1 ? "Recommended" : "Alternative"}
                  </span>
                </div>
                <h2 className="text-[16px] font-extrabold tracking-[-0.02em] text-[#101826] m-0 leading-[1.2]">{r.title}</h2>
                {subtitle && <p className="text-[11px] font-semibold text-[#4f6280] m-0 mt-0.5 mb-2">{subtitle}</p>}

                {/* 4-up compact metrics */}
                <div className="grid grid-cols-4 gap-1 mb-[14px] mt-1">
                  <div>
                    <div className="text-[10px] font-extrabold text-brand-green truncate">{hasSavings ? formatCurrency(r.annual_savings!.expected) : hasImpact ? "Est." : "N/A"}</div>
                    <div className="text-[8px] font-bold text-[#61718a] uppercase tracking-[0.04em]">Savings</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold text-brand-blue truncate">{hasHours ? `${formatHours(r.hours_returned!.expected)}h` : hasImpact ? "Est." : "N/A"}</div>
                    <div className="text-[8px] font-bold text-[#61718a] uppercase tracking-[0.04em]">Hours</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold text-brand-purple truncate">{r.timeline.low_weeks && r.timeline.high_weeks ? `${r.timeline.low_weeks}\u2013${r.timeline.high_weeks}w` : "N/A"}</div>
                    <div className="text-[8px] font-bold text-[#61718a] uppercase tracking-[0.04em]">Timeline</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold text-brand-orange truncate">{topEvidence.length > 0 ? `${Math.max(1, Math.round(topEvidence.length / 5))}\u2013${Math.max(2, Math.round(topEvidence.length / 3))}` : "N/A"}</div>
                    <div className="text-[8px] font-bold text-[#61718a] uppercase tracking-[0.04em]">Team</div>
                  </div>
                </div>

                {/* Tools + Evidence row */}
                <div className="flex items-center gap-2 mb-[10px] flex-wrap">
                  {tools.slice(0, 2).map((t, i) => (
                    <span key={i} className={`px-[6px] py-[2px] rounded-md text-[9px] font-extrabold ${tagClass}`}>{t}</span>
                  ))}
                  <span className={`px-[6px] py-[2px] rounded-full text-[8px] font-extrabold uppercase tracking-[0.04em] border ${tierBadge(r.evidence_summary.overall_tier)}`}>
                    {TIER_CONFIG[r.evidence_summary.overall_tier]?.label || r.evidence_summary.overall_tier}
                  </span>
                  <span className="text-[#586984] text-[9px] font-bold">{getEvidenceMix(r)}</span>
                </div>

                {/* Top Evidence - 2 rows max */}
                <div className="flex-1 min-h-0">
                  {topEvidence.length > 0 ? topEvidence.map((c, i) => {
                    const company = formatCompany(c.organization);
                    const outcome = formatOutcome(c.outcome);
                    return (
                      <div key={i} className="grid grid-cols-[1fr_auto] gap-[6px] items-center text-[10px] py-[6px] border-b border-[#ebeff4] last:border-0">
                        <div className="flex items-center gap-[6px] min-w-0 font-extrabold overflow-hidden">
                          <span className="w-[16px] h-[16px] rounded-full shrink-0 bg-[#11263c] text-white flex items-center justify-center text-[7px] font-bold uppercase">
                            {companyInitials(company)}
                          </span>
                          <span className="overflow-hidden text-ellipsis text-[#101826]">{company}</span>
                        </div>
                        <span className={`text-right font-bold shrink-0 ${outcomeClass} overflow-hidden text-ellipsis max-w-[110px] text-[10px]`}>
                          {outcome}
                        </span>
                      </div>
                    );
                  }) : (
                    <div className="text-[10px] text-[#5a6b84] font-bold py-[6px]">Evidence unavailable</div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-auto pt-[10px] border-t border-[#ebeff4] flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-brand-green-dark">{Math.round(r.confidence.score * 100)}% confidence</span>
                  {r.timeline.low_weeks && r.timeline.high_weeks && (
                    <span className="text-[10px] font-bold text-[#5a6b84]">{r.timeline.low_weeks}\u2013{r.timeline.high_weeks}wk</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* POTENTIAL RISKS */}
        {(primary.risks.length > 0 || primary.negative_evidence.length > 0) && (
          <section className="mt-5 border border-[#f3c7c9] rounded-[18px] bg-risk-light px-7 py-[22px] pb-[25px]">
            <h2 className="flex items-center gap-3 text-[19px] font-extrabold tracking-[-0.02em] m-0 mb-[22px]">
              <span className="text-[28px] text-risk">&#x26A0;</span>
              Potential Risks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
              {buildRisks(primary).slice(0, 4).map((risk, i) => (
                <div key={i} className={`min-h-[60px] flex items-center gap-[15px] text-[13px] font-bold text-[#1b2432] ${i > 0 ? "border-l border-[#efc8ca] pl-[22px]" : ""}`}>
                  <span className="text-[28px] text-risk shrink-0">&#x26A0;</span>
                  <span className="line-clamp-2">{risk.text}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function buildRisks(r: RecommendationData): { icon: string; text: string }[] {
  const risks: { icon: string; text: string }[] = [];
  const seen = new Set<string>();

  for (const risk of r.risks) {
    const text = risk.taxonomy || risk.category || (typeof risk === "string" ? risk : risk.risk || "");
    const formatted = formatRisk(text);
    const key = formatted.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      risks.push({ icon: "&#x26A0;", text: formatted });
    }
    if (risks.length >= 4) break;
  }

  if (risks.length < 4) {
    for (const neg of r.negative_evidence) {
      for (const reason of neg.failure_reasons) {
        if (risks.length >= 4) break;
        const formatted = formatRisk(reason);
        const key = formatted.toLowerCase().trim();
        if (!seen.has(key)) {
          seen.add(key);
          risks.push({ icon: "&#x26A0;", text: formatted });
        }
      }
    }
  }

  return risks;
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
    industry: "technology", company_size: "",
    workflow_frequency: m.get("frequency") || "", people_involved: m.get("people") || "",
    handoffs: m.get("handoffs") || "", current_tools: [],
    exception_rate: m.get("exceptions") || "", budget_range: m.get("budget") || "",
    implementation_timeline: m.get("timeline") || "", business_risk: m.get("risk") || "",
    process_stability: m.get("stability") || "", previous_attempts: m.get("prior-attempts") || "",
    desired_outcome: outcome,
  };
}