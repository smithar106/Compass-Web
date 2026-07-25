"use client";

import Link from "next/link";
import { site } from "@/content/site";
import { researchStatistics } from "@/data/research";

const TIER_BADGE: Record<string, string> = {
  gold: "bg-gold-light text-gold",
  silver: "bg-silver-light text-silver",
  bronze: "bg-bronze-light text-bronze",
};

function initials(name: string): string {
  return name.split(/[\s-]+/).map((w: string) => w[0]).join("").toUpperCase().slice(0, 3);
}

function extractNum(s: string): string {
  const m = s.match(/[\d,.]+/);
  return m ? m[0] : s;
}

function ExampleCard({ data, rank, accent }: { data: any; rank: number; accent: "green" | "blue" | "orange" }) {
  const isRec = rank === 1;
  const borderClass = accent === "green" ? "border-brand-green" : accent === "blue" ? "border-brand-blue" : "border-brand-orange";
  const tagClass = accent === "green" ? "bg-brand-green-light text-brand-green-dark" : accent === "blue" ? "bg-brand-blue-light text-[#0958c9]" : "bg-brand-orange-light text-[#9b3c00]";
  const metricColor = accent === "green" ? "text-brand-green" : accent === "blue" ? "text-brand-blue" : "text-brand-orange";
  const rankBg = rank === 1 ? "bg-[#d7a500]" : rank === 3 ? "bg-[#a8490c]" : "bg-[#657386]";
  const tier = data.evidenceTier || "gold";
  const tools: string[] = data.tools || ["Claude", "OpenAI", "Salesforce"];
  const evidenceItems: { org: string; outcome: string }[] = data.evidence || [];

  return (
    <div className={`bg-white border-2 ${borderClass} rounded-[18px] p-[22px] flex flex-col shadow-[0_12px_32px_rgba(15,23,42,0.05)] overflow-hidden`}>
      {/* Rank header */}
      <div className="flex items-center gap-[10px] mb-[15px]">
        <span className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[13px] font-extrabold text-white shrink-0 ${rankBg}`}>
          {rank}
        </span>
        <span className={`px-[11px] py-[5px] rounded-full text-[11px] font-extrabold uppercase tracking-normal ${isRec ? "bg-brand-green-light text-brand-green-dark" : "bg-[#edf0f3] text-[#1a1f2b]"}`}>
          {isRec ? "Recommended" : "Alternative"}
        </span>
      </div>

      {/* Problem statement */}
      <p className="text-[13px] font-semibold text-[#4f6280] mb-3 leading-snug">{data.problem}</p>

      {/* Title */}
      <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#101826] m-0 mb-[14px] leading-[1.3]">
        {data.recommendation}
      </h2>

      {/* Metrics row */}
      <div className="grid grid-cols-4 gap-2 mb-[22px]">
        <div className="min-w-0 overflow-hidden">
          <div className={`text-[12px] sm:text-[13px] font-extrabold ${metricColor} whitespace-nowrap overflow-hidden text-ellipsis`}>{data.impact}</div>
          <div className="text-[10px] font-bold text-[#61718a] mt-1 whitespace-nowrap">Annual Savings</div>
        </div>
        <div className="min-w-0 overflow-hidden">
          <div className={`text-[12px] sm:text-[13px] font-extrabold ${metricColor} whitespace-nowrap overflow-hidden text-ellipsis`}>{data.confidence}</div>
          <div className="text-[10px] font-bold text-[#61718a] mt-1 whitespace-nowrap">Confidence</div>
        </div>
        <div className="min-w-0 overflow-hidden">
          <div className={`text-[12px] sm:text-[13px] font-extrabold ${metricColor} whitespace-nowrap overflow-hidden text-ellipsis`}>{data.timeline}</div>
          <div className="text-[10px] font-bold text-[#61718a] mt-1 whitespace-nowrap">Duration</div>
        </div>
        <div className="min-w-0 overflow-hidden">
          <div className={`text-[12px] sm:text-[13px] font-extrabold ${metricColor} whitespace-nowrap overflow-hidden text-ellipsis`}>{data.teamSize || "1\u20132"}</div>
          <div className="text-[10px] font-bold text-[#61718a] mt-1 whitespace-nowrap">Team Size</div>
        </div>
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
        <span className={`px-[10px] py-[5px] rounded-full text-[11px] font-extrabold uppercase tracking-[0.04em] ${TIER_BADGE[tier] || TIER_BADGE.gold}`}>
          {tier === "gold" ? "Gold" : tier === "silver" ? "Silver" : "Bronze"}
        </span>
        <span className="text-[#586984] text-[11px] font-bold">High-quality evidence from 143 implementations</span>
      </div>

      {/* Top Evidence */}
      <p className="text-[10px] font-extrabold tracking-[0.06em] uppercase text-[#5a6b84] m-0 mb-2">Top Evidence</p>
      <div className="mb-[14px] flex-1">
        {evidenceItems.length > 0 ? evidenceItems.slice(0, 3).map((c, i) => (
          <div key={i} className="min-h-[36px] grid grid-cols-[1fr_auto] gap-[10px] items-center border-b border-[#ebeff4] text-[12px]">
            <div className="flex items-center gap-[9px] min-w-0 font-extrabold overflow-hidden">
              <span className="w-5 h-5 rounded-full shrink-0 bg-[#11263c] text-white flex items-center justify-center text-[9px] font-bold uppercase">
                {initials(c.org)}
              </span>
              <span className="overflow-hidden text-ellipsis text-[#101826]">{c.org}</span>
            </div>
            <span className={`text-right font-bold shrink-0 ${metricColor} overflow-hidden text-ellipsis max-w-[140px]`}>
              {c.outcome}
            </span>
          </div>
        )) : (
          <div className="text-[12px] text-[#5a6b84] font-bold py-2">Verified implementation</div>
        )}
      </div>

      {/* Proof statement */}
      <div className="mt-auto pt-3 text-[12px] font-extrabold text-brand-green-dark">
        143 comparable implementations
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero — product first */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-[2.5rem] md:text-[3.25rem] font-bold text-ink leading-[1.1] tracking-tight">
                {site.hero.headline}
              </h1>
              <p className="mt-5 text-lg text-ink/80 leading-relaxed font-[500] max-w-lg">
                {site.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/assessment" className="inline-flex items-center px-8 py-4 bg-forest text-white text-lg font-semibold rounded-xl hover:bg-leaf transition-colors shadow-sm">
                  {site.hero.cta}
                </Link>
                <a href="#examples" className="inline-flex items-center px-8 py-4 border-2 border-forest text-forest text-lg font-semibold rounded-xl hover:bg-mist transition-colors">
                  {site.hero.ctaSecondary}
                </a>
              </div>
            </div>
            <ExampleCard
              data={{
                problem: site.hero.recommendation.problem,
                recommendation: site.hero.recommendation.recommendation,
                impact: site.hero.recommendation.impact,
                confidence: site.hero.recommendation.confidence,
                timeline: site.hero.recommendation.timeline,
                teamSize: "1\u20132",
                evidenceTier: "gold",
                tools: ["Claude", "OpenAI", "Salesforce"],
                evidence: [
                  { org: "TinyPilot", outcome: "207% ROI" },
                  { org: "Kyber", outcome: "65% time saved" },
                  { org: "HubSpot", outcome: "32% faster" },
                ],
              }}
              rank={1}
              accent="green"
            />
          </div>
        </div>
      </section>

      {/* How Compass works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-50/40">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-ink text-center">How Compass works.</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { step: "Problem", desc: "Identify the operational issue." },
              { step: "Investigate", desc: "Gather data and assess readiness." },
              { step: "Compare", desc: "Evaluate every intervention path." },
              { step: "Recommend", desc: "Select the highest-impact solution." },
              { step: "Implementation Plan", desc: "Produce the implementation plan." },
            ].map((item, i) => (
              <div key={item.step} className="border-2 border-indigo-200 rounded-xl p-5 text-center bg-white shadow-sm">
                <span className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto text-sm font-bold">{i + 1}</span>
                <p className="mt-2 text-sm font-bold text-ink">{item.step}</p>
                <p className="mt-1 text-xs text-ink/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry examples — same format as results page */}
      <section id="examples" className="py-16 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="mx-auto max-w-[1500px]">
          <h2 className="text-xl font-bold text-ink text-center mb-8">Real recommendations across industries.</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            <ExampleCard
              data={{
                problem: site.exampleSales.problem,
                recommendation: site.exampleSales.recommendation,
                impact: site.exampleSales.impact,
                confidence: site.exampleSales.confidence,
                timeline: site.exampleSales.timeline,
                teamSize: "1\u20132",
                evidenceTier: "gold",
                tools: ["Claude", "OpenAI", "Salesforce"],
                evidence: [
                  { org: "TinyPilot", outcome: "207% ROI" },
                  { org: "Kyber", outcome: "65% time saved" },
                  { org: "HubSpot", outcome: "32% faster" },
                ],
              }}
              rank={1}
              accent="green"
            />
            <ExampleCard
              data={{
                problem: site.exampleFinance.problem,
                recommendation: site.exampleFinance.recommendation,
                impact: site.exampleFinance.impact,
                confidence: site.exampleFinance.confidence,
                timeline: site.exampleFinance.timeline,
                teamSize: "1\u20132",
                evidenceTier: "gold",
                tools: ["Microsoft Copilot", "ServiceNow", "Salesforce"],
                evidence: [
                  { org: "Intercom", outcome: "72% automation" },
                  { org: "Exequtech", outcome: "Process improvement" },
                  { org: "Google", outcome: "Pilot validated" },
                ],
              }}
              rank={2}
              accent="blue"
            />
            <ExampleCard
              data={{
                problem: site.exampleHealthcare.problem,
                recommendation: site.exampleHealthcare.recommendation,
                impact: site.exampleHealthcare.impact,
                confidence: site.exampleHealthcare.confidence,
                timeline: site.exampleHealthcare.timeline,
                teamSize: "2\u20134",
                evidenceTier: "gold",
                tools: ["Lean", "Six Sigma", "Change Mgmt"],
                evidence: [
                  { org: "AWS", outcome: "Infrastructure savings" },
                  { org: "Amazon", outcome: "Cost reduction" },
                  { org: "TinyPilot", outcome: "Process optimization" },
                ],
              }}
              rank={3}
              accent="orange"
            />
          </div>
        </div>
      </section>

      {/* Evidence */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-ink text-center">Why implementation decisions go wrong.</h2>
          <p className="mt-2 text-sm text-ink/80 text-center">Before organizations find Compass, they often learn the hard way.</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {researchStatistics.map((stat) => (
              <div key={stat.label} className="border-2 border-amber-200 rounded-xl p-5 bg-white shadow-sm text-center">
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold text-ink mt-2">{stat.value}</p>
                <p className="text-sm text-ink mt-1 leading-snug">{stat.detail}</p>
                <p className="text-xs text-stone mt-2">{stat.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-ink text-cream px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[28px] font-bold">{site.finalCta.headline}</h2>
          <p className="mt-4 text-lg text-cream/90">{site.finalCta.subtitle}</p>
          <div className="mt-8">
            <Link href="/assessment" className="inline-flex items-center px-8 py-4 bg-cream text-ink text-lg font-semibold rounded-xl hover:bg-white transition-colors shadow-sm">
              {site.finalCta.cta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
