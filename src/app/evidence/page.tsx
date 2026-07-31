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
  { name: "Source documents", note: "Audits, evaluations, disclosures, records" },
  { name: "Evidence claims", note: "Extracted, attributable, deduplicated" },
  { name: "Implementation records", note: "Intervention, context, outcomes, risks" },
  { name: "Decision", note: "Ranked, sourced, reproducible" },
];

function GraphNode({
  node,
  index,
  left,
  top,
}: {
  node: { name: string; note: string };
  index: string;
  left: string;
  top: string;
}) {
  return (
    <div
      className="absolute h-[26%] w-[42%] overflow-hidden border border-line bg-surface p-3 shadow-card-sm"
      style={{ left, top }}
    >
      <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-accent-deep">{index}</p>
      <p className="mt-1 text-[12.5px] font-semibold leading-tight text-ink">{node.name}</p>
      <p className="mt-0.5 text-[10.5px] leading-snug text-muted">{node.note}</p>
    </div>
  );
}

export default function EvidencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Evidence"
        title="Decisions that trace back to a source you can read."
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
                <div aria-hidden="true" className="grid-backdrop absolute inset-0 opacity-50" />

                {/* nodes — fixed geometry so the connectors align */}
                <GraphNode node={GRAPH[0]} index="01" left="3%" top="6%" />
                <GraphNode node={GRAPH[1]} index="02" left="55%" top="6%" />
                <GraphNode node={GRAPH[2]} index="03" left="55%" top="68%" />
                <GraphNode node={GRAPH[3]} index="04" left="3%" top="68%" />

                {/* connectors — drawn at the node edges (square container ⇒ 1 viewBox unit = 1%) */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  aria-hidden="true"
                >
                  {/* source documents → evidence claims */}
                  <line x1="45" y1="19" x2="55" y2="19" stroke="#4C650C" strokeWidth="0.6" />
                  <path d="M55 19 l-3.2 -1.6 v3.2 z" fill="#4C650C" />

                  {/* evidence claims → implementation records */}
                  <line x1="76" y1="32" x2="76" y2="68" stroke="#4C650C" strokeWidth="0.6" />
                  <path d="M76 68 l-1.6 -3.2 h3.2 z" fill="#4C650C" />

                  {/* implementation records → decision */}
                  <line x1="55" y1="81" x2="45" y2="81" stroke="#4C650C" strokeWidth="0.6" />
                  <path d="M45 81 l3.2 -1.6 v3.2 z" fill="#4C650C" />

                  {/* decision → source documents (the learning loop) */}
                  <line x1="24" y1="68" x2="24" y2="32" stroke="#4C650C" strokeWidth="0.6" strokeDasharray="2 1.6" strokeLinecap="round" />
                  <path d="M24 32 l-1.6 3.2 h3.2 z" fill="#4C650C" />

                  <text x="50" y="12" textAnchor="middle" fontSize="3.4" letterSpacing="0.3" fill="#8A93A3">
                    EXTRACT
                  </text>
                  <text x="79" y="50" textAnchor="start" fontSize="3.4" letterSpacing="0.3" fill="#8A93A3" transform="rotate(90 79 50)">
                    STRUCTURE
                  </text>
                  <text x="27" y="50" textAnchor="start" fontSize="3.4" letterSpacing="0.3" fill="#8A93A3" transform="rotate(-90 27 50)">
                    LEARNING LOOP
                  </text>
                </svg>

                <p className="absolute bottom-2 right-3 text-[10px] text-faint">
                  a decision loop, not a one-way pipeline
                </p>
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
              visible in the decision.
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
