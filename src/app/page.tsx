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
  const tagClass = accent === "green" ? "bg-brand-green-light text-brand-green-dark" : accent === "blue" ? "bg-brand-blue-light text-brand-blue" : "bg-brand-orange-light text-brand-orange";
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
          {isRec ? "Evidence supports this path" : "Other path"}
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
          <div className="text-[10px] font-bold text-[#61718a] mt-1 leading-tight">Evidence<br/>strength</div>
        </div>
        <div className="min-w-0 overflow-hidden">
          <div className={`text-[12px] sm:text-[13px] font-extrabold ${metricColor} whitespace-nowrap overflow-hidden text-ellipsis`}>{data.timeline}</div>
          <div className="text-[10px] font-bold text-[#61718a] mt-1 whitespace-nowrap">Duration</div>
        </div>
        <div className="min-w-0 overflow-hidden">
          <div className={`text-[12px] sm:text-[13px] font-extrabold ${metricColor} whitespace-nowrap overflow-hidden text-ellipsis`}>{data.teamSize || "1–2"}</div>
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
        <span className="text-[#586984] text-[11px] font-bold">High-quality evidence from {data.evidenceCount || 143} implementations</span>
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
        {data.evidenceCount || 143} comparable implementations
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
                <Link href="/assessment?demo=true" className="inline-flex items-center px-8 py-4 bg-forest text-white text-lg font-semibold rounded-xl hover:bg-leaf transition-colors shadow-sm">
                  {site.hero.cta}
                </Link>
                <a href="#examples" className="inline-flex items-center px-8 py-4 border-2 border-forest text-forest text-lg font-semibold rounded-xl hover:bg-mist transition-colors">
                  {site.hero.ctaSecondary}
                </a>
              </div>
            </div>
            <ExampleCard
              data={{
                evidenceCount: 121,
                problem: site.hero.recommendation.problem,
                recommendation: site.hero.recommendation.recommendation,
                impact: site.hero.recommendation.impact,
                confidence: site.hero.recommendation.confidence,
                timeline: site.hero.recommendation.timeline,
                teamSize: "1–2",
                evidenceTier: "gold",
                tools: ["Claude", "OpenAI", "Salesforce"],
                evidence: [
                  { org: "Samsara", outcome: "207% ROI" },
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

      {/* Trust line */}
      <div className="pb-12 px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/40">
            Powered by evidence from thousands of operational interventions across industries
          </p>
        </div>
      </div>

      {/* How Compass works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-mist/30">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-ink text-center">How Compass works</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { step: "Define", desc: "Describe the operational problem." },
              { step: "Assess", desc: "Map constraints, readiness, and risk." },
              { step: "Match", desc: "Compare against real-world implementations." },
              { step: "Recommend", desc: "Surface the highest-evidence path." },
              { step: "Plan", desc: "Outline what to do next." },
            ].map((item, i) => (
              <div key={item.step} className="border border-[#dfe5ec] rounded-xl p-5 text-center bg-white shadow-sm">
                <span className="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center mx-auto text-sm font-bold">{i + 1}</span>
                <p className="mt-2 text-sm font-bold text-ink">{item.step}</p>
                <p className="mt-1 text-xs text-ink/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Compass Is Different — comparison table */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-[28px] md:text-[34px] font-bold text-ink tracking-tight">Why Compass Is Different</h2>
            <p className="mt-4 text-base text-ink/70 max-w-3xl mx-auto leading-relaxed">
              Compass doesn&apos;t replace executive judgment. It gives leaders access to operational evidence that no individual consultant could realistically assemble, retain, and analyze at scale.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="w-[140px] p-4 text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink/40"></th>
                  <th className="p-4 text-[15px] font-bold text-[#4f6280]">Traditional Consulting</th>
                  <th className="p-4 text-[15px] font-bold text-[#4f6280]">AI Consulting</th>
                  <th className="p-4 text-[15px] font-bold text-forest">Compass</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "Primary Asset",
                    consulting: "Consultant expertise",
                    ai: "AI implementation expertise",
                    compass: "Evidence graph of comparable implementations",
                  },
                  {
                    label: "Typical Recommendation",
                    consulting: "Strategic advice",
                    ai: "Deploy AI",
                    compass: "Best operational solution—AI, software, process redesign, automation, staffing, or no intervention",
                  },
                  {
                    label: "Evidence",
                    consulting: "Limited to projects consultants have seen",
                    ai: "Limited to previous AI deployments",
                    compass: "Grounded in comparable real-world operational implementations",
                  },
                  {
                    label: "Business Model",
                    consulting: "Consulting engagement",
                    ai: "AI implementation",
                    compass: "Independent decision intelligence",
                  },
                  {
                    label: "Time to Decision",
                    consulting: "Weeks",
                    ai: "Days to weeks",
                    compass: "Minutes",
                  },
                  {
                    label: "Recommendations are based on",
                    consulting: "Consultant experience",
                    ai: "Previous AI projects",
                    compass: "Comparable real-world implementations",
                  },
                ].map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-[#f9fafb]" : "bg-white"}>
                    <td className="p-4 text-[12px] font-extrabold text-ink/60 uppercase tracking-[0.06em]">{row.label}</td>
                    <td className="p-4 text-[13px] text-[#4f6280] leading-snug">{row.consulting}</td>
                    <td className="p-4 text-[13px] text-[#4f6280] leading-snug">{row.ai}</td>
                    <td className="p-4 text-[13px] text-ink/90 leading-snug font-[500]">{row.compass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom callout */}
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <p className="text-[22px] md:text-[26px] font-bold text-ink leading-tight">
              Consultants rely on experience. Compass relies on evidence.
            </p>
            <p className="mt-6 text-base text-ink/60 leading-relaxed">
              Compass doesn&apos;t replace executive judgment.
              It gives leaders access to operational evidence that no individual consultant could realistically assemble, retain, and analyze at scale.
            </p>
          </div>

          {/* Who Compass is for (8th section) */}
          <div className="mt-16 pt-14 border-t border-slate-200">
            <div className="text-center mb-8">
              <h3 className="text-[22px] font-bold text-ink">Who Compass is for</h3>
              <p className="mt-2 text-sm text-ink/80">Built for the teams responsible for how work gets done.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {[
                { name: "Operations", icon: "\u2699\uFE0F" },
                { name: "Finance", icon: "\uD83D\uDCB0" },
                { name: "Customer Support", icon: "\uD83C\uDFA7" },
                { name: "Sales", icon: "\uD83D\uDCC8" },
                { name: "HR", icon: "\uD83D\uDC65" },
                { name: "IT", icon: "\uD83D\uDCBB" },
                { name: "Supply Chain", icon: "\uD83D\uDCE6" },
                { name: "Legal & Compliance", icon: "\u2696\uFE0F" },
              ].map((dept) => (
                <div key={dept.name} className="border-2 border-slate-100 rounded-xl p-4 bg-white shadow-sm text-center hover:border-slate-200 transition-colors cursor-default">
                  <div className="text-2xl mb-1.5">{dept.icon}</div>
                  <p className="text-sm font-bold text-ink">{dept.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom callout */}
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <p className="text-[22px] md:text-[26px] font-bold text-ink leading-tight">
              Consultants rely on experience. Compass relies on evidence.
            </p>
            <p className="mt-6 text-base text-ink/60 leading-relaxed">
              Compass doesn&apos;t replace executive judgment.
              It gives leaders access to operational evidence that no individual consultant could realistically assemble, retain, and analyze at scale.
            </p>
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
                evidenceCount: 143,
                problem: site.exampleSales.problem,
                recommendation: site.exampleSales.recommendation,
                impact: site.exampleSales.impact,
                confidence: site.exampleSales.confidence,
                timeline: site.exampleSales.timeline,
                teamSize: "1–2",
                evidenceTier: "gold",
                tools: ["Anthropic", "OpenAI", "Salesforce"],
                evidence: [
                  { org: "Dialpad", outcome: "207% ROI" },
                  { org: "Kyber", outcome: "65% time saved" },
                  { org: "HubSpot", outcome: "32% faster" },
                ],
              }}
              rank={1}
              accent="green"
            />
            <ExampleCard
              data={{
                evidenceCount: 87,
                problem: site.exampleFinance.problem,
                recommendation: site.exampleFinance.recommendation,
                impact: site.exampleFinance.impact,
                confidence: site.exampleFinance.confidence,
                timeline: site.exampleFinance.timeline,
                teamSize: "1–2",
                evidenceTier: "gold",
                tools: ["Microsoft Copilot", "ServiceNow", "Salesforce"],
                evidence: [
                  { org: "Intercom", outcome: "72% automation" },
                  { org: "Exequtech", outcome: "40% faster matching" },
                  { org: "Stripe", outcome: "55% fewer errors" },
                ],
              }}
              rank={2}
              accent="blue"
            />
            <ExampleCard
              data={{
                evidenceCount: 62,
                problem: site.exampleHealthcare.problem,
                recommendation: site.exampleHealthcare.recommendation,
                impact: site.exampleHealthcare.impact,
                confidence: site.exampleHealthcare.confidence,
                timeline: site.exampleHealthcare.timeline,
                teamSize: "2–4",
                evidenceTier: "gold",
                tools: ["Lean", "Six Sigma", "Change Mgmt"],
                evidence: [
                  { org: "UnitedHealth", outcome: "68% faster triage" },
                  { org: "Anthem", outcome: "42% cost reduction" },
                  { org: "Kaiser", outcome: "3.5M claims auto-processed" },
                ],
              }}
              rank={3}
              accent="orange"
            />
          </div>
        </div>
      </section>

      {/* Evidence */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#fbfcfd]">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-ink text-center">The cost of guessing</h2>
          <p className="mt-2 text-sm text-ink/60 text-center">Before evidence-based decisions, organizations rely on intuition. The results speak for themselves.</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {researchStatistics.map((stat) => (
              <div key={stat.label} className="border border-[#dfe5ec] rounded-xl p-5 bg-white shadow-sm text-center">
                <p className="text-[10px] font-extrabold text-ink/50 uppercase tracking-[0.08em]">{stat.label}</p>
                <p className="text-3xl font-bold text-ink mt-2">{stat.value}</p>
                <p className="text-sm text-ink/70 mt-1 leading-snug">{stat.detail}</p>
                <p className="text-[10px] text-ink/40 mt-2">{stat.source}</p>
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
            <Link href="/assessment?demo=true" className="inline-flex items-center px-8 py-4 bg-cream text-ink text-lg font-semibold rounded-xl hover:bg-white transition-colors shadow-sm">
              {site.finalCta.cta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
