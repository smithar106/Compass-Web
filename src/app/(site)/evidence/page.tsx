import { PageHeader } from "@/components/home/PageHeader";
import { FinalCta } from "@/components/home/FinalCta";
import { EvidenceStats } from "@/components/home/EvidenceStats";
import { Reveal } from "@/components/home/Reveal";
import { cn } from "@/lib/utils";

const PROVENANCE = [
  { name: "Government audit", note: "Outcomes verified by an independent public body. Highest independent weight.", tone: "high" },
  { name: "Academic evaluation", note: "Controlled comparisons with declared methods and limitations.", tone: "high" },
  { name: "Public-company disclosure", note: "Accountable reporting with regulatory consequences for accuracy.", tone: "medium" },
  { name: "Customer documentation", note: "First-party operating evidence from the organization that ran the implementation.", tone: "medium" },
  { name: "Vendor implementation record", note: "Context and limitations declared; weighted accordingly and never treated as independent.", tone: "low" },
];

const VERIFICATION = [
  {
    title: "Weighted by independence",
    note: "Government audits and academic evaluations carry more weight than vendor records — and vendor claims are never treated as independent.",
  },
  {
    title: "Attributable to a source",
    note: "Every material claim traces to a document you can read: an audit, an evaluation, a disclosure, or a first-party record.",
  },
  {
    title: "Gaps are disclosed",
    note: "When the evidence for a decision is thin or missing, Compass says so instead of forcing a confident answer.",
  },
];

const GRAPH = [
  { name: "Source documents", note: "Audits, evaluations, disclosures, records" },
  { name: "Evidence claims", note: "Extracted, attributable, deduplicated" },
  { name: "Implementation records", note: "Intervention, context, outcomes, risks" },
  { name: "Decision", note: "Ranked, sourced, reproducible" },
];

function CircleNode({ node, x, y }: { node: { name: string; note: string }; x: string; y: string }) {
  return (
    <div
      className="absolute w-[38%] -translate-x-1/2 -translate-y-1/2 border border-line bg-surface p-3 shadow-card-sm"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <p className="text-[12px] font-semibold leading-tight text-ink">{node.name}</p>
      <p className="mt-0.5 text-[10px] leading-snug text-muted">{node.note}</p>
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
                <div aria-hidden="true" className="grid-backdrop absolute inset-0 opacity-40" />

                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  aria-hidden="true"
                >
                  <defs>
                    <marker id="ev-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                      <path d="M0 0 L10 5 L0 10 z" fill="#4C650C" />
                    </marker>
                    <marker id="ev-arrow-faint" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                      <path d="M0 0 L10 5 L0 10 z" fill="#4C650C" fillOpacity="0.45" />
                    </marker>
                  </defs>

                  {/* quadrant dividers */}
                  <line x1="50" y1="6" x2="50" y2="94" stroke="#E3E0D7" strokeWidth="0.5" />
                  <line x1="6" y1="50" x2="94" y2="50" stroke="#E3E0D7" strokeWidth="0.5" />

                  {/* ring passing through the four node centers */}
                  <circle cx="50" cy="50" r="35.36" fill="none" stroke="#4C650C" strokeOpacity="0.18" strokeWidth="0.8" />

                  {/* clockwise loop: Source → Claims → Records → Decision → Source */}
                  <path d="M75 25 A 35.36 35.36 0 0 1 75 75" fill="none" stroke="#4C650C" strokeWidth="1" markerEnd="url(#ev-arrow)" />
                  <path d="M75 75 A 35.36 35.36 0 0 1 25 75" fill="none" stroke="#4C650C" strokeWidth="1" markerEnd="url(#ev-arrow)" />
                  <path d="M25 75 A 35.36 35.36 0 0 1 25 25" fill="none" stroke="#4C650C" strokeWidth="1" markerEnd="url(#ev-arrow)" />
                  {/* the learning loop return */}
                  <path d="M25 25 A 35.36 35.36 0 0 1 75 25" fill="none" stroke="#4C650C" strokeWidth="1" strokeDasharray="2.4 1.8" strokeLinecap="round" markerEnd="url(#ev-arrow-faint)" />
                </svg>

                <CircleNode node={GRAPH[0]} x="75" y="25" />
                <CircleNode node={GRAPH[1]} x="75" y="75" />
                <CircleNode node={GRAPH[2]} x="25" y="75" />
                <CircleNode node={GRAPH[3]} x="25" y="25" />

                {/* center */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mx-auto text-accent-deep" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.1" />
                    <path d="M14.5 9.5 13.3 13.3 9.5 14.5 10.7 10.7z" fill="currentColor" />
                  </svg>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-faint">Evidence loop</p>
                </div>

                <p className="absolute bottom-2 right-3 text-[10px] text-faint">
                  a decision loop, not a one-way pipeline
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Evidence library stats */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
          <Reveal>
            <EvidenceStats variant="full" />
          </Reveal>
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

      {/* Evidence verification + cited claim */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <Reveal>
                <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                  Evidence quality
                </p>
                <h2 className="mt-5 text-section font-semibold tracking-tight text-ink">
                  Every claim carries its source. Every gap is disclosed.
                </h2>
                <div className="mt-7 space-y-5">
                  {VERIFICATION.map((v) => (
                    <div key={v.title} className="flex items-start gap-3.5 border-b border-line pb-4 last:border-b-0">
                      <span
                        aria-hidden="true"
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-deep"
                      />
                      <div>
                        <p className="text-[14px] font-semibold tracking-tight text-ink">{v.title}</p>
                        <p className="mt-1 text-[13px] leading-snug text-muted">{v.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <div className="border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line bg-paper/60 px-4 py-2.5">
                  <span className="text-[11px] font-semibold tracking-wide text-ink">How a claim is presented</span>
                  <span className="border border-line bg-surface px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-faint">
                    Illustrative
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[13.5px] leading-relaxed text-ink">
                    &ldquo;Across comparable implementations, exception-based routing reduced
                    resolution time by 25&ndash;40% within the first quarter.&rdquo;
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="border border-line bg-paper px-2 py-0.5 text-[10px] font-medium text-muted">
                      Public-company disclosure
                    </span>
                    <span className="border border-line bg-paper px-2 py-0.5 text-[10px] font-medium text-muted">
                      38 comparable implementations
                    </span>
                  </div>
                  <div className="mt-4 border-t border-line pt-3">
                    <p className="font-mono text-[10.5px] leading-relaxed text-faint">
                      Source: [document type], [year], p. [page] &middot; Excerpt shown inline
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
