"use client";

import Link from "next/link";
import { site } from "@/content/site";

const TIER_BADGE: Record<string, string> = {
  gold: "bg-gold-light text-gold",
  silver: "bg-silver-light text-silver",
  bronze: "bg-bronze-light text-bronze",
};

function initials(name: string): string {
  return name.split(/[\s-]+/).map((w: string) => w[0]).join("").toUpperCase().slice(0, 3);
}

function ExampleCard({ data, rank, accent, showEvidence = true }: { data: any; rank: number; accent: "green" | "blue" | "orange"; showEvidence?: boolean }) {
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
      <div className="flex items-center gap-[10px] mb-[15px]">
        <span className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[13px] font-extrabold text-white shrink-0 ${rankBg}`}>
          {rank}
        </span>
        <span className={`px-[11px] py-[5px] rounded-full text-[11px] font-extrabold uppercase tracking-normal ${isRec ? "bg-brand-green-light text-brand-green-dark" : "bg-[#edf0f3] text-[#1a1f2b]"}`}>
          {isRec ? "Recommended Path" : "Other path"}
        </span>
      </div>

      <p className="text-[13px] font-semibold text-[#4f6280] mb-3 leading-snug">{data.problem}</p>

      <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#101826] m-0 mb-[14px] leading-[1.3]">
        {data.recommendation}
      </h2>

      <div className="grid grid-cols-4 gap-2 mb-[22px]">
        <div className="min-w-0 overflow-hidden">
          <div className={`text-[12px] sm:text-[13px] font-extrabold ${metricColor} whitespace-nowrap overflow-hidden text-ellipsis`}>{data.impact}</div>
          <div className="text-[10px] font-bold text-[#4f6280] mt-1 whitespace-nowrap">Annual Savings</div>
        </div>
        <div className="min-w-0 overflow-hidden">
          <div className={`text-[12px] sm:text-[13px] font-extrabold ${metricColor} whitespace-nowrap overflow-hidden text-ellipsis`}>{data.confidence}</div>
          <div className="text-[10px] font-bold text-[#4f6280] mt-1 leading-tight">Recommendation<br/>Support</div>
        </div>
        <div className="min-w-0 overflow-hidden">
          <div className={`text-[12px] sm:text-[13px] font-extrabold ${metricColor} whitespace-nowrap overflow-hidden text-ellipsis`}>{data.timeline}</div>
          <div className="text-[10px] font-bold text-[#4f6280] mt-1 whitespace-nowrap">Duration</div>
        </div>
        <div className="min-w-0 overflow-hidden">
          <div className={`text-[12px] sm:text-[13px] font-extrabold ${metricColor} whitespace-nowrap overflow-hidden text-ellipsis`}>{data.teamSize || "1–2"}</div>
          <div className="text-[10px] font-bold text-[#4f6280] mt-1 whitespace-nowrap">Team Size</div>
        </div>
      </div>

      <p className="text-[10px] font-extrabold tracking-[0.06em] uppercase text-[#4f6280] m-0 mb-2">Tool Stack</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {tools.slice(0, 3).map((t, i) => (
          <span key={i} className={`px-[10px] py-[5px] rounded-lg text-[11px] font-extrabold ${tagClass}`}>{t}</span>
        ))}
        <span className={`px-[10px] py-[5px] rounded-lg text-[11px] font-bold ${tagClass}`}>+{Math.max(1, tools.length - 3)} more</span>
      </div>

      <p className="text-[10px] font-extrabold tracking-[0.06em] uppercase text-[#4f6280] m-0 mb-2">Evidence Quality</p>
      <div className="flex items-center gap-[10px] mb-4 flex-wrap">
        <span className={`px-[10px] py-[5px] rounded-full text-[11px] font-extrabold uppercase tracking-[0.04em] ${TIER_BADGE[tier] || TIER_BADGE.gold}`}>
          {tier === "gold" ? "Gold" : tier === "silver" ? "Silver" : "Bronze"}
        </span>
        <span className="text-[#4f6280] text-[11px] font-bold">{tier === "gold" ? "High-quality" : tier === "silver" ? "Medium-quality" : "Limited"} evidence from {data.evidenceCount || 143} implementations</span>
      </div>

      {showEvidence && (
        <>
      <p className="text-[10px] font-extrabold tracking-[0.06em] uppercase text-[#4f6280] m-0 mb-2">Top Evidence</p>
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
          <div className="text-[12px] text-[#4f6280] font-bold py-2">Verified implementation</div>
        )}
      </div>
        </>
      )}

      <div className="mt-auto pt-3 text-[12px] font-extrabold text-brand-green-dark">
        {data.evidenceCount || 143} comparable implementations
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-forest mb-4">{site.hero.eyebrow}</p>
              <h1 className="text-[2.5rem] md:text-[3.25rem] font-bold text-ink leading-[1.1] tracking-tight">
                {site.hero.headline}
              </h1>
              <p className="mt-5 text-lg text-ink/80 leading-relaxed font-[500] max-w-lg">
                {site.hero.subtitle}
              </p>
              <p className="mt-4 text-sm text-ink/50 italic max-w-lg">{site.hero.supportingLine}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/assessment?demo=true" className="inline-flex items-center px-8 py-4 bg-forest text-white text-lg font-semibold rounded-xl hover:bg-leaf transition-colors shadow-sm">
                  {site.hero.cta}
                </Link>
                <a href="#examples" className="inline-flex items-center px-8 py-4 border-2 border-forest text-forest text-lg font-semibold rounded-xl hover:bg-mist transition-colors">
                  {site.hero.ctaSecondary}
                </a>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-ink/30 mb-2 text-center">Illustrative Decision Brief</p>
              <ExampleCard
                data={{
                  evidenceCount: 121,
                  problem: site.exampleSales.problem,
                  recommendation: site.exampleSales.recommendation,
                  impact: site.exampleSales.impact,
                  confidence: "Strong",
                  timeline: site.exampleSales.timeline,
                  teamSize: "1–2",
                  evidenceTier: "gold",
                  tools: ["Conversational AI", "CRM", "Workflow Automation"],
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
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#fbfcfd]">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-forest mb-4 text-center">{site.problem.label}</p>
          <h2 className="text-[28px] md:text-[34px] font-bold text-ink tracking-tight text-center max-w-4xl mx-auto">{site.problem.headline}</h2>
          <p className="mt-4 text-base text-ink/70 max-w-3xl mx-auto text-center leading-relaxed">{site.problem.body}</p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {site.problem.painPoints.map((p, i) => (
              <div key={i} className="bg-white border border-[#dfe5ec] rounded-xl p-5 shadow-sm">
                <p className="text-[13px] font-extrabold text-[#101826] mb-1">{p.title}</p>
                <p className="text-[12px] text-[#4f6280] leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOLUTION ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-forest mb-4 text-center">{site.solution.label}</p>
          <h2 className="text-[28px] md:text-[34px] font-bold text-ink tracking-tight text-center">{site.solution.headline}</h2>
          <p className="mt-4 text-base text-ink/70 max-w-3xl mx-auto text-center leading-relaxed">{site.solution.body}</p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-3">
            {site.solution.steps.map((item, i) => (
              <div key={item.step} className="border border-[#dfe5ec] rounded-xl p-5 text-center bg-white shadow-sm">
                <span className="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center mx-auto text-sm font-bold">{i + 1}</span>
                <p className="mt-2 text-sm font-bold text-ink">{item.step}</p>
                <p className="mt-1 text-xs text-ink/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUTCOMES ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-mist/30">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[28px] md:text-[34px] font-bold text-ink tracking-tight text-center max-w-4xl mx-auto">{site.outcomes.headline}</h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {site.outcomes.items.map((item, i) => (
              <div key={i} className="bg-white border border-[#dfe5ec] rounded-xl p-5 shadow-sm">
                <p className="text-[14px] font-extrabold text-ink mb-1">{item.title}</p>
                <p className="text-[12px] text-[#4f6280] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DIFFERENTIATION ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[24px] md:text-[30px] font-bold text-ink tracking-tight text-center max-w-4xl mx-auto mb-12">{site.differentiation.headline}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {site.differentiation.columns.map((col, i) => (
              <div key={col.name} className={`rounded-2xl border ${col.highlighted ? "border-2 border-forest/40 shadow-[0_8px_32px_-8px_rgba(45,106,79,0.12)]" : "border-[#dfe5ec]"} bg-white overflow-hidden`}>
                <div className={`px-6 pt-7 pb-4 ${col.highlighted ? "bg-mist border-b border-forest/10" : "bg-[#f6f8fa] border-b border-[#dfe5ec]"}`}>
                  <h3 className={`text-[17px] font-bold ${col.highlighted ? "text-forest" : "text-[#4f6280]"}`}>{col.name}</h3>
                </div>
                <div className="px-6 py-5 space-y-3">
                  {col.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${col.highlighted ? "bg-forest" : "bg-[#cad3df]"}`} />
                      <p className="text-[12px] text-[#4f6280] leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EVIDENCE ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#fbfcfd]">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-[28px] md:text-[34px] font-bold text-ink tracking-tight">{site.evidence.headline}</h2>
          <p className="mt-4 text-base text-ink/70 max-w-3xl mx-auto leading-relaxed">{site.evidence.subtitle}</p>
        </div>
      </section>

      {/* ===== INDUSTRY EXAMPLES ===== */}
      <section id="examples" className="py-16 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="mx-auto max-w-[1500px]">
          <div className="text-center mb-2">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-ink/30 mb-2">Illustrative Decision Briefs</p>
            <h2 className="text-xl font-bold text-ink text-center mb-8">Example decisions across industries.</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            <ExampleCard
              data={{
                evidenceCount: 143, problem: site.exampleSales.problem, recommendation: site.exampleSales.recommendation,
                impact: site.exampleSales.impact, confidence: "Strong", timeline: site.exampleSales.timeline,
                teamSize: "1–2", evidenceTier: "gold", tools: ["Conversational AI", "CRM", "Workflow Automation"],
                evidence: [{ org: "Dialpad", outcome: "207% ROI" }, { org: "Kyber", outcome: "65% time saved" }, { org: "HubSpot", outcome: "32% faster" }],
              }}
              rank={1} accent="green"
            />
            <ExampleCard
              data={{
                evidenceCount: 87, problem: site.exampleFinance.problem, recommendation: site.exampleFinance.recommendation,
                impact: site.exampleFinance.impact, confidence: "Moderate", timeline: site.exampleFinance.timeline,
                teamSize: "1–2", evidenceTier: "silver", tools: ["Document AI", "Workflow Automation", "Exception Review"],
                evidence: [{ org: "Intercom", outcome: "72% automation" }, { org: "Exequtech", outcome: "40% faster matching" }, { org: "Stripe", outcome: "55% fewer errors" }],
              }}
              rank={2} accent="blue"
            />
            <ExampleCard
              data={{
                evidenceCount: 62, problem: site.exampleHealthcare.problem, recommendation: site.exampleHealthcare.recommendation,
                impact: site.exampleHealthcare.impact, confidence: "Moderate", timeline: site.exampleHealthcare.timeline,
                teamSize: "2–4", evidenceTier: "silver", tools: ["Rules Engine", "Claims Platform", "Human Escalation"],
                evidence: [{ org: "UnitedHealth", outcome: "68% faster triage" }, { org: "Anthem", outcome: "42% cost reduction" }, { org: "Kaiser", outcome: "3.5M claims auto-processed" }],
              }}
              rank={3} accent="orange"
            />
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
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
