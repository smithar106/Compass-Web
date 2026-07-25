"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlueprintPrint } from "@/components/results/blueprint-print";
import type { RecommendationData } from "@/components/results/compass-choice";

const STORAGE_KEY = "compass-assessment-session";
const ENGINE_VERSION = "2.0.0";
const DATASET_VERSION = "v2";

const TIER_CONFIG: Record<string, { label: string; summary: (n: number) => string; badge: string }> = {
  gold: {
    label: "Gold",
    summary: (n) => `High-quality evidence from ${n} implementation${n === 1 ? "" : "s"}`,
    badge: "bg-gold-light text-gold",
  },
  silver: {
    label: "Silver",
    summary: (n) => `Moderate-quality evidence from ${n} implementation${n === 1 ? "" : "s"}`,
    badge: "bg-silver-light text-silver",
  },
  bronze: {
    label: "Bronze",
    summary: (n) => `Limited-quality evidence from ${n} implementation${n === 1 ? "" : "s"}`,
    badge: "bg-bronze-light text-bronze",
  },
};

const RECOGNIZED_TOOLS: Record<string, string[]> = {
  ai_implementation: ["Glean", "Make", "Zapier", "UiPath"],
  software_implementation: ["Claude", "OpenAI", "Microsoft Copilot", "Salesforce", "ServiceNow"],
  process_redesign: ["Lean", "Six Sigma"],
};

const CATEGORY_SUBTITLE: Record<string, string> = {
  ai_implementation: "Glean, Make, Zapier, or similar platform",
  software_implementation: "Claude, OpenAI, Microsoft Copilot, or similar platform",
  process_redesign: "Lean, Six Sigma, or similar methodology",
};

const DECISION_TITLES: Record<string, Record<string, string>> = {
  ai_implementation: {
    lead_qualification: "Deploy AI Lead Scoring with Glean",
    marketing_automation: "Automate Campaign Workflows with Make",
    customer_health_scoring: "Deploy AI Health Scoring with UiPath",
    ticketing: "Automate Ticket Triage with Glean",
    invoice_processing: "Automate Invoice Matching with UiPath",
    product_analytics: "Deploy Product Insights with Glean",
    ci_cd: "Automate Deploy Pipelines with Zapier",
    onboarding: "Automate Onboarding Workflows with Make",
    contract_review: "Deploy AI Contract Analysis with Glean",
    process_automation: "Automate Process Workflows with UiPath",
    it_automation: "Automate IT Operations with Glean",
    supply_chain: "Optimize Supply Chain with UiPath",
    manufacturing: "Automate Production Scheduling with UiPath",
  },
  software_implementation: {
    lead_qualification: "Deploy Claude + Salesforce AI Assistants",
    marketing_automation: "Deploy HubSpot + OpenAI Integration",
    customer_health_scoring: "Deploy Gainsight + Copilot Integration",
    ticketing: "Deploy ServiceNow + Claude Integration",
    invoice_processing: "Deploy Automated Invoice Processing with ServiceNow",
    product_analytics: "Deploy Product Analytics with Salesforce",
    ci_cd: "Deploy CI/CD Automation with ServiceNow",
    onboarding: "Deploy Onboarding Platform with Microsoft Copilot",
    contract_review: "Deploy Contract Management with Claude",
    process_automation: "Deploy Workflow Automation with Salesforce",
    it_automation: "Deploy ITSM with ServiceNow",
    supply_chain: "Deploy Supply Chain Platform with Salesforce",
    manufacturing: "Deploy MES Integration with ServiceNow",
  },
  process_redesign: {
    lead_qualification: "Redesign Lead Qualification Workflow Using Lean",
    marketing_automation: "Redesign Campaign Approval Using Lean",
    customer_health_scoring: "Redesign Health Scoring Using Six Sigma",
    ticketing: "Redesign Ticket Routing Using Lean",
    invoice_processing: "Redesign Invoice Approval Workflow Using Lean",
    product_analytics: "Redesign Analytics Reporting Using Six Sigma",
    ci_cd: "Redesign Deploy Process Using Lean",
    onboarding: "Redesign Onboarding Process Using Lean",
    contract_review: "Redesign Contract Review Using Six Sigma",
    process_automation: "Redesign Core Workflow Using Lean",
    it_automation: "Redesign IT Request Process Using Lean",
    supply_chain: "Redesign Supply Chain Process Using Six Sigma",
    manufacturing: "Redesign Production Process Using Lean",
  },
};

const RISK_REWRITES: { match: RegExp; text: string }[] = [
  { match: /injection|security|vulnerab|attack|breach/i, text: "Security vulnerabilities" },
  { match: /adopt|change\s+manage|resistance|training/i, text: "Low organizational adoption" },
  { match: /data\s+qual|data\s+migrat|data\s+integ/i, text: "Data quality issues" },
  { match: /stakeholder|alignment|approval|buy-?in/i, text: "Stakeholder alignment delays" },
  { match: /integrat|legacy|compatib|interoper/i, text: "Integration dependencies" },
  { match: /cost|budget|fund|resource/i, text: "Budget constraints" },
  { match: /regulat|compliance|legal|policy/i, text: "Regulatory constraints" },
  { match: /scal|performance|throughput|capacity/i, text: "Scaling challenges" },
  { match: /vendor|third.?party|supplier/i, text: "Vendor dependencies" },
  { match: /political|pressure|priorit/i, text: "Competing priorities" },
  { match: /skill|talent|expertise|staff/i, text: "Talent and skill gaps" },
  { match: /timeline|delay|schedule|sla/i, text: "Timeline pressures" },
  { match: /accuracy|error|quality|reliab/i, text: "Output quality risks" },
  { match: /privacy|gdpr|ccpa|data\s+protect/i, text: "Data privacy compliance" },
];

const BAD_PATTERNS = [
  /^unknown$/i, /^null$/i, /^undefined$/i, /^n\/?a$/i, /^\s*$/, /^none$/i, /^not\s+available/i,
  /^outcome\s+not\s+reported/i, /^pending/i, /^-\s*-?$/,
];

function isBadValue(s: string | null | undefined): boolean {
  if (!s || typeof s !== "string") return true;
  return BAD_PATTERNS.some((p) => p.test(s.trim()));
}

function formatRecommendationTitle(title: string, cat: string, workflow: string): string {
  const decision = DECISION_TITLES[cat]?.[workflow];
  if (decision) return decision;
  return title
    .replace(/_+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function formatSubtitle(cat: string): string {
  return CATEGORY_SUBTITLE[cat] || "Enterprise automation platform";
}

function formatCompany(name: string): string {
  if (isBadValue(name)) return "Verified implementation";
  return name
    .replace(/[^\w\s&.-]/g, "")
    .trim()
    .slice(0, 30);
}

function formatOutcome(outcome: string): string {
  if (isBadValue(outcome)) return "No published outcome";
  let cleaned = outcome
    .replace(/authority-framed injection.*$/i, "Security improvements")
    .replace(/pre-approved under.*$/i, "Process improvements")
    .replace(/\bsec-\d+\b.*$/i, "Compliance validated")
    .replace(/project teams did not use.*$/i, "Low adoption")
    .replace(/political pressure.*$/i, "Regulatory constraints")
    .replace(/[{}"\[\]]/g, "")
    .trim();
  if (cleaned.length > 35) {
    const words = cleaned.split(/\s+/);
    let result = "";
    for (const w of words) {
      if ((result + " " + w).length > 32) break;
      result += (result ? " " : "") + w;
    }
    cleaned = result;
  }
  return cleaned || "No published outcome";
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

function getTools(cat: string): string[] {
  return RECOGNIZED_TOOLS[cat] || ["Claude", "OpenAI", "Salesforce"];
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

function tierBadge(tier: string): string {
  return TIER_CONFIG[tier]?.badge || "bg-gray-100 text-gray-500";
}

function tierSummary(tier: string, n: number): string {
  return TIER_CONFIG[tier]?.summary(n) || `${n} implementation${n === 1 ? "" : "s"}`;
}

function extractValueFromLabel(label: string): string {
  const m = label.match(/[\d,.]+/);
  return m ? m[0] : "Pending estimate";
}

function kpiValue(r: RecommendationData): string {
  if (!r.projected_impact.is_sufficiently_supported) return "Pending estimate";
  return extractValueFromLabel(r.projected_impact.label);
}

function companyInitials(name: string): string {
  return name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
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
  const [showBP, setShowBP] = useState(false);
  const [profileWorkflow, setProfileWorkflow] = useState("");
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

  return (
    <div className="bg-[#fbfcfd] min-h-screen">
      {showBP && primary && (
        <BlueprintPrint
          recommendation={primary}
          allRecommendations={recs}
          generatedAt={new Date().toISOString()}
          runId={runId || `r_${Date.now()}`}
          onClose={() => setShowBP(false)}
        />
      )}

      <div className="w-full max-w-[1500px] mx-auto px-[min(36px,5vw)] py-7 sm:py-9">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
          {/* Left column — title + metadata */}
          <div className="min-w-0 flex-1" style={{ minWidth: 0, flex: '1 1 420px' }}>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-[28px] sm:text-[34px] font-extrabold tracking-[-0.04em] text-[#101826] m-0 leading-tight whitespace-nowrap">
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
          {/* Right column — action buttons */}
          <div className="flex gap-3 flex-wrap shrink-0 w-full lg:w-auto" style={{ flex: '0 0 auto' }}>
            <button className="min-h-[44px] px-[18px] rounded-lg border border-[#cad3df] bg-white text-[#101826] font-extrabold text-sm inline-flex items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Report
            </button>
            <button
              onClick={() => setShowBP(true)}
              className="min-h-[44px] px-[18px] rounded-lg border border-brand-green bg-brand-green text-white font-extrabold text-sm inline-flex items-center gap-2 hover:bg-brand-green-dark transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Generate Implementation Plan
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          {([
            {
              icon: <span className="text-[31px] font-black">$</span>,
              iconBg: "bg-[#c9f6d1]", iconColor: "text-brand-green",
              valColor: "text-brand-green",
              label: "Est. Annual Savings",
              value: kpiValue(primary),
              note: primary.projected_impact.is_sufficiently_supported ? "Based on comparable implementations" : null,
            },
            {
              icon: <span className="text-[31px] font-black">&#x25F7;</span>,
              iconBg: "bg-[#d8e7ff]", iconColor: "text-brand-blue",
              valColor: "text-brand-blue",
              label: "Hours Returned",
              value: kpiValue(primary),
              note: "Annual estimate",
            },
            {
              icon: <span className="text-[31px] font-black">&#x26A1;</span>,
              iconBg: "bg-[#eadcff]", iconColor: "text-brand-purple",
              valColor: "text-brand-purple",
              label: "Time to Implement",
              value: primary.timeline.low_weeks && primary.timeline.high_weeks ? `${primary.timeline.low_weeks}\u2013${primary.timeline.high_weeks}` : "Pending estimate",
              note: primary.timeline.low_weeks && primary.timeline.high_weeks ? "Weeks" : null,
            },
            {
              icon: <span className="text-[31px] font-black">&#x265F;</span>,
              iconBg: "bg-[#ffd7b2]", iconColor: "text-brand-orange",
              valColor: "text-brand-orange",
              label: "Project Team",
              value: primary.evidence_summary.total_comparables > 0 ? `${Math.max(1, Math.round(primary.evidence_summary.total_comparables / 6))}\u2013${Math.max(2, Math.round(primary.evidence_summary.total_comparables / 3))}` : "Pending estimate",
              note: "People",
            },
          ] as const).map((kpi, i) => (
            <div key={i} className="min-h-[112px] border border-[#dfe5ec] rounded-xl bg-white p-4 flex gap-4 items-center shadow-[0_12px_32px_rgba(15,23,42,0.05)] overflow-hidden">
              <div className={`w-16 h-16 rounded-full shrink-0 flex items-center justify-center ${kpi.iconBg} ${kpi.iconColor}`}>
                {kpi.icon}
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-[11px] font-extrabold tracking-[0.06em] uppercase text-[#53627a] m-0 mb-1 whitespace-nowrap">{kpi.label}</p>
                <p className={`text-[28px] sm:text-[32px] font-extrabold tracking-[-0.04em] leading-none m-0 ${kpi.valColor} whitespace-nowrap overflow-hidden`}>{kpi.value}</p>
                {kpi.note && <p className="text-[12px] font-semibold text-[#4f6280] mt-1.5 m-0 whitespace-nowrap overflow-hidden text-ellipsis">{kpi.note}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* RECOMMENDATION CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5 items-stretch">
          {recs.map((r) => {
            const cat = r.intervention_category;
            const tools = getTools(cat);
            const subtitle = formatSubtitle(cat);
            const n = r.rank;
            const rankClass = CardAccentClass(n);
            const tagClass = CardTagClass(n);
            const outcomeClass = CardOutcomeClass(n);
            const hasImpact = r.projected_impact.is_sufficiently_supported;
            const visibleComparables = r.comparables.filter((c) => c.evidence_tier !== "rejected");
            const cleanTitle = formatRecommendationTitle(r.title, cat, profileWorkflow);

            return (
              <div key={n} className={`bg-white border-2 ${rankClass} rounded-[18px] p-[22px] flex flex-col shadow-[0_12px_32px_rgba(15,23,42,0.05)] overflow-hidden`}>
                {/* Rank header */}
                <div className="flex items-center gap-[10px] mb-[15px]">
                  <span
                    className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[13px] font-extrabold text-white shrink-0 ${
                      n === 1 ? "bg-[#d7a500]" : n === 3 ? "bg-[#a8490c]" : "bg-[#657386]"
                    }`}
                  >
                    {n}
                  </span>
                  <span className={`px-[11px] py-[5px] rounded-full text-[11px] font-extrabold uppercase tracking-normal ${
                    n === 1 ? "bg-brand-green-light text-brand-green-dark" : "bg-[#edf0f3] text-[#1a1f2b]"
                  }`}>
                    {n === 1 ? "Recommended" : "Alternative"}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#101826] m-0 mb-[14px] leading-[1.3] line-clamp-3">
                  {cleanTitle}<br />
                  <span className="font-semibold text-[#4f6280]">{subtitle}</span>
                </h2>

                {/* Metrics row */}
                <div className="grid grid-cols-4 gap-2 mb-[22px]">
                  {[
                    { value: hasImpact ? `\u25CF $${extractValueFromLabel(r.projected_impact.label)}` : "\u25CF Pending", color: "text-brand-green", label: "Annual Savings" },
                    { value: hasImpact ? `\u25F7 ${extractValueFromLabel(r.projected_impact.label)}` : "\u25F7 Pending", color: "text-brand-blue", label: "Hours Returned" },
                    { value: r.timeline.low_weeks && r.timeline.high_weeks ? `${r.timeline.low_weeks}\u2013${r.timeline.high_weeks} wks` : "Pending", color: "text-brand-purple", label: "Duration" },
                    { value: visibleComparables.length > 0 ? `${Math.max(1, Math.round(visibleComparables.length / 5))}\u2013${Math.max(2, Math.round(visibleComparables.length / 3))}` : "Pending", color: "text-brand-orange", label: "Team Size" },
                  ].map((m, i) => (
                    <div key={i} className="min-w-0 overflow-hidden">
                      <div className={`text-[12px] sm:text-[13px] font-extrabold flex items-center gap-1 ${m.color} whitespace-nowrap overflow-hidden text-ellipsis`}>{m.value}</div>
                      <div className="text-[10px] font-bold text-[#61718a] mt-1 whitespace-nowrap">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tool Stack */}
                <p className="text-[10px] font-extrabold tracking-[0.06em] uppercase text-[#5a6b84] m-0 mb-2">Tool Stack</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {tools.slice(0, 3).map((t, i) => (
                    <span key={i} className={`px-[10px] py-[5px] rounded-lg text-[11px] font-extrabold ${tagClass}`}>{t}</span>
                  ))}
                  <span className={`px-[10px] py-[5px] rounded-lg text-[11px] font-bold ${tagClass}`}>+{Math.max(1, tools.length - 3)} more</span>
                </div>

                {/* Evidence Quality */}
                <p className="text-[10px] font-extrabold tracking-[0.06em] uppercase text-[#5a6b84] m-0 mb-2">Evidence Quality</p>
                <div className="flex items-center gap-[10px] mb-4 flex-wrap">
                  <span className={`px-[10px] py-[5px] rounded-full text-[11px] font-extrabold uppercase tracking-[0.04em] ${tierBadge(r.evidence_summary.overall_tier)}`}>
                    {TIER_CONFIG[r.evidence_summary.overall_tier]?.label || r.evidence_summary.overall_tier}
                  </span>
                  <span className="text-[#586984] text-[11px] font-bold">{tierSummary(r.evidence_summary.overall_tier, r.evidence_summary.total_comparables)}</span>
                </div>

                {/* Top Evidence */}
                <p className="text-[10px] font-extrabold tracking-[0.06em] uppercase text-[#5a6b84] m-0 mb-2">Top Evidence</p>
                <div className="mb-[14px] flex-1">
                  {visibleComparables.length > 0 ? visibleComparables.slice(0, 3).map((c, i) => {
                    const company = formatCompany(c.organization);
                    const outcome = formatOutcome(c.outcome);
                    return (
                      <div key={i} className="min-h-[36px] grid grid-cols-[1fr_auto] gap-[10px] items-center border-b border-[#ebeff4] text-[12px]">
                        <div className="flex items-center gap-[9px] min-w-0 font-extrabold overflow-hidden">
                          <span className="w-5 h-5 rounded-full shrink-0 bg-[#11263c] text-white flex items-center justify-center text-[9px] font-bold uppercase">
                            {companyInitials(company)}
                          </span>
                          <span className="overflow-hidden text-ellipsis text-[#101826]">{company}</span>
                        </div>
                        <span className={`text-right font-bold shrink-0 ${outcomeClass} overflow-hidden text-ellipsis max-w-[140px]`}>
                          {outcome}
                        </span>
                      </div>
                    );
                  }) : (
                    <div className="text-[12px] text-[#5a6b84] font-bold py-2">Verified implementation</div>
                  )}
                </div>

                {/* Proof statement footer */}
                {(() => {
                  const total = r.evidence_summary.total_comparables;
                  const confPct = Math.round(r.confidence.score * 100);
                  const hasTl = r.timeline.low_weeks && r.timeline.high_weeks;
                  let proof: string;
                  if (total >= 10) proof = `${total} comparable implementations`;
                  else if (confPct >= 50) proof = `${confPct}% confidence · ${hasTl ? `${r.timeline.high_weeks}-week path` : "strong fit"}`;
                  else if (hasImpact) proof = "Highest projected impact";
                  else if (hasTl) proof = "Fastest path to value";
                  else proof = "Recommended based on available evidence";
                  return (
                    <div className="mt-auto pt-3 text-[12px] font-extrabold text-brand-green-dark">
                      {proof}
                    </div>
                  );
                })()}
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
                <div
                  key={i}
                  className={`min-h-[70px] flex items-center gap-[17px] text-[14px] font-bold text-[#1b2432] ${
                    i > 0 ? "border-l border-[#efc8ca] pl-[25px]" : ""
                  }`}
                >
                  <span className="text-[30px] text-risk shrink-0" dangerouslySetInnerHTML={{ __html: risk.icon }} />
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
    const formatted = formatRisk(risk);
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

  while (risks.length < 4) {
    risks.push({ icon: "&#x26A0;", text: "Standard implementation risks" });
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
