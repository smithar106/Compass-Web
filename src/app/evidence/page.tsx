import { PageHeader } from "@/components/home/PageHeader";
import { FinalCta } from "@/components/home/FinalCta";
import { Reveal } from "@/components/home/Reveal";
import { cn } from "@/lib/utils";

const PROVENANCE = [
  { name: "Government audit", note: "Outcomes verified by an independent public body. Highest independent weight.", tone: "high" },
  { name: "Academic evaluation", note: "Controlled comparisons with declared methods and limitations.", tone: "high" },
  { name: "Public-company disclosure", note: "Accountable reporting with regulatory consequences for accuracy.", tone: "medium" },
  { name: "Customer documentation", note: "First-party operating evidence from the organization that ran the implementation.", tone: "medium" },
  { name: "Vendor implementation record", note: "Context and limitations declared; weighted accordingly and never treated as independent.", tone: "low" },
];

const TIERS = [
  { name: "Gold", note: "Independently validated or corroborated outcomes", className: "bg-accent text-accent-ink" },
  { name: "Silver", note: "Strong documentation with reasonable limitations", className: "bg-line text-ink" },
  { name: "Bronze", note: "Directional evidence, clearly labeled as such", className: "bg-line text-muted" },
];

const GRAPH = [
  { name: "Source documents", note: "Audits, evaluations, disclosures, records", x: "0%", y: "0%" },
  { name: "Evidence claims", note: "Extracted, attributable, deduplicated", x: "50%", y: "0%" },
  { name: "Implementation records", note: "Intervention, context, outcomes, risks", x: "50%", y: "62%" },
  { name: "Recommendation", note: "Ranked, sourced, reproducible", x: "0%", y: "62%" },
];

export default function EvidencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Evidence"
        title="Recommendations that trace back to a source you can read."
        subtitle="Compass reasons over a growing structured evidence base of real-world implementations. Every material claim carries its source&mdash;and when the evidence is insufficient, Compass says so."
      />

      {/* Evidence graph */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                  The Evidence Graph
                </p>
                <h2 className="mt-5 text-section font-semibold tracking-tight text-ink">
                  Four layers between a document and a decision.
                </h2>
                <p className="mt-5 max-w-md text-lead leading-relaxed text-muted">
                  Compass does not ask a model to recall an example. It extracts structured claims
                  from real sources, builds implementation records, and matches them to your problem
                  and operating context before anything is recommended.
                </p>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <div className="relative aspect-square w-full overflow-hidden border border-line bg-surface">
                <div
                  aria-hidden="true"
                  className="grid-backdrop absolute inset-0 opacity-50"
                />
                {GRAPH.map((node, i) => (
                  <div
                    key={node.name}
                    className="absolute w-[44%] border border-line bg-surface p-4 shadow-card-sm"
                    style={{ left: node.x, top: node.y }}
                  >
                    <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-accent-deep">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-1 text-[13px] font-semibold text-ink">{node.name}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted">{node.note}</p>
                  </div>
                ))}
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M44 9 C 60 9, 44 9, 50 9" stroke="#C7F246" strokeWidth="0.4" fill="none" />
                  <path d="M56 38 C 56 48, 56 50, 56 58" stroke="#C7F246" strokeWidth="0.4" fill="none" strokeDasharray="1.5 1.5" />
                  <path d="M50 76 C 40 76, 44 76, 44 76" stroke="#C7F246" strokeWidth="0.4" fill="none" />
                  <path d="M44 92 C 44 92, 44 92, 44 92" stroke="#0E1722" strokeWidth="0.3" fill="none" strokeDasharray="1 1.5" />
                </svg>
                <p className="absolute bottom-3 right-4 text-[10px] text-faint">a recommendation loop, not a one-way pipeline</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Provenance */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
              Source provenance
            </p>
            <h2 className="mt-5 max-w-2xl text-section font-semibold tracking-tight text-ink">
              Different sources carry different forms of confidence.
            </h2>
            <p className="mt-5 max-w-2xl text-lead leading-relaxed text-muted">
              Compass tracks which type of source backs each claim&mdash;and never inflates it. A
              vendor record is treated differently from an independent audit, and the difference is
              visible in the recommendation.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PROVENANCE.map((p, i) => (
              <Reveal key={p.name} delay={i * 70} className="h-full">
                <div className="flex h-full flex-col border border-line bg-surface p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-[14.5px] font-semibold text-ink">{p.name}</h3>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-2 w-2 rounded-full",
                        p.tone === "high" ? "bg-accent-deep" : p.tone === "medium" ? "bg-warn" : "bg-faint"
                      )}
                    />
                  </div>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{p.note}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={280} className="h-full">
              <div className="flex h-full flex-col justify-center border border-dashed border-line bg-paper p-5">
                <p className="font-serif text-[15px] italic leading-relaxed text-ink">
                  Insufficient evidence is a finding, not a failure.
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                  When comparable evidence is too thin, Compass defers judgment instead of inventing
                  an answer.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Quality tiers + citation */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <Reveal>
                <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                  Evidence quality
                </p>
                <h2 className="mt-5 text-section font-semibold tracking-tight text-ink">
                  Every claim is tiered and cited.
                </h2>
                <div className="mt-7 space-y-3">
                  {TIERS.map((t) => (
                    <div key={t.name} className="flex items-start gap-3 border-b border-line pb-3 last:border-b-0">
                      <span className={cn("shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", t.className)}>
                        {t.name}
                      </span>
                      <p className="text-[13px] leading-snug text-muted">{t.note}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <div className="border border-line bg-surface">
                <div className="border-b border-line bg-paper/60 px-4 py-2.5">
                  <span className="text-[11px] font-semibold tracking-wide text-ink">A cited claim</span>
                </div>
                <div className="p-5">
                  <p className="text-[13.5px] leading-relaxed text-ink">
                    &ldquo;Across comparable implementations, exception-based routing reduced
                    resolution time by 25&ndash;40% within the first quarter.&rdquo;
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-ink">Gold</span>
                    <span className="border border-line bg-paper px-2 py-0.5 text-[10px] font-medium text-muted">Government audit</span>
                    <span className="border border-line bg-paper px-2 py-0.5 text-[10px] font-medium text-muted">38 comparable implementations</span>
                  </div>
                  <div className="mt-4 border-t border-line pt-3">
                    <p className="font-mono text-[10.5px] leading-relaxed text-faint">
                      Source: <span className="text-muted">Demo audit report, FY2025, p. 14</span> · Excerpt shown inline
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
