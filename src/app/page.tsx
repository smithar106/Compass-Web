"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/content/site";
import { researchStatistics } from "@/data/research";

function RecommendationPanel({ data, accent }: { data: any; accent: string }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const accentMap: Record<string, { border: string; bg: string; text: string; pill: string }> = {
    amber: { border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-800", pill: "bg-amber-100 text-amber-700" },
    sky: { border: "border-sky-200", bg: "bg-sky-50", text: "text-sky-800", pill: "bg-sky-100 text-sky-700" },
    emerald: { border: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-800", pill: "bg-emerald-100 text-emerald-700" },
  };
  const c = accentMap[accent] || accentMap.amber;

  return (
    <div className={`border ${c.border} rounded-xl bg-white shadow-sm overflow-hidden text-xs`}>
      <div className="px-4 py-2 border-b border-border/40">
        <span className="text-stone">Problem: </span>
        <span className="text-ink">{data.problem}</span>
      </div>
      <div className="px-4 py-2 border-b border-border/40">
        <span className="text-stone">Recommendation: </span>
        <span className="text-ink font-semibold">{data.recommendation}</span>
      </div>
      <div className="px-4 py-2 flex flex-wrap gap-x-3 text-xs">
        <span className="text-forest font-bold">{data.impact}</span>
        <span className="text-stone">|</span>
        <span className="text-stone">{data.confidence} confidence</span>
        <span className="text-stone">|</span>
        <span className="text-stone">{data.timeline}</span>
        <span className="text-stone">|</span>
        <span className={`font-semibold px-1.5 py-0.5 rounded ${c.pill}`}>{data.type}</span>
      </div>
      <div className="border-t border-border/40">
        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="w-full px-4 py-1.5 text-left text-xs text-forest font-semibold hover:bg-mist/30 transition-colors"
        >
          {showEvidence ? "\u25B2 Hide evidence" : "Why this confidence? \u2192"}
        </button>
        {showEvidence && (
          <div className="px-4 py-2 bg-mist/30 border-t border-border/40 space-y-1">
            <div className="flex items-start gap-1.5 text-[11px] text-ink">
              <span className="text-forest shrink-0">{"\u2713"}</span>
              <span><span className="font-semibold">Industry benchmarks:</span> Comparable implementations show similar outcomes.</span>
            </div>
            <div className="flex items-start gap-1.5 text-[11px] text-ink">
              <span className="text-forest shrink-0">{"\u2713"}</span>
              <span><span className="font-semibold">Research sources:</span> Gartner, IBM, BCG studies on implementation outcomes.</span>
            </div>
            <div className="flex items-start gap-1.5 text-[11px] text-ink">
              <span className="text-forest shrink-0">{"\u2713"}</span>
              <span><span className="font-semibold">Customer inputs:</span> Operational data provided during investigation.</span>
            </div>
          </div>
        )}
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
            <RecommendationPanel data={site.hero.recommendation} accent="amber" />
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
              { step: "Evidence", desc: "Gather data and assess readiness." },
              { step: "Compare", desc: "Evaluate every intervention path." },
              { step: "Recommend", desc: "Select the highest-impact solution." },
              { step: "Blueprint", desc: "Produce the implementation plan." },
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

      {/* Industry examples */}
      <section id="examples" className="py-16 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-bold text-ink text-center">Real recommendations across industries.</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <RecommendationPanel data={site.exampleSales} accent="amber" />
            <RecommendationPanel data={site.exampleFinance} accent="sky" />
            <RecommendationPanel data={site.exampleHealthcare} accent="emerald" />
          </div>
        </div>
      </section>

      {/* Evidence */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-ink text-center">Why implementation decisions go wrong.</h2>
          <p className="mt-2 text-sm text-ink/80 text-center">Before organizations find Compass, they often learn the hard way.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            {researchStatistics.map((stat) => (
              <div key={stat.label} className="border border-amber-200 rounded-lg px-4 py-2 bg-white shadow-sm text-xs whitespace-nowrap">
                <span className="font-bold text-ink">{stat.value}</span>
                <span className="text-ink/70 mx-1.5">|</span>
                <span className="font-semibold text-amber-800 uppercase text-[11px]">{stat.label}</span>
                <span className="text-ink/70 mx-1.5">|</span>
                <span className="text-ink/60">{stat.detail}</span>
                <span className="text-ink/70 mx-1.5">|</span>
                <span className="text-stone">{stat.source}</span>
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