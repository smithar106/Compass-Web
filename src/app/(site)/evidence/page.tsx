import { PageHeader } from "@/components/home/PageHeader";
import { FinalCta } from "@/components/home/FinalCta";
import { EvidenceStats } from "@/components/home/EvidenceStats";
import { Reveal } from "@/components/home/Reveal";
import { LibraryStats } from "@/components/home/LibraryStats";
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
  { name: "Decision", note: "Ranked, sourced, reproducible", color: "#0A5C55" },
  { name: "Source documents", note: "Audits, evaluations, disclosures, records", color: "#8B6914" },
  { name: "Implementation records", note: "Intervention, context, outcomes, risks", color: "#1E40AF" },
  { name: "Evidence claims", note: "Extracted, attributable, deduplicated", color: "#6D28D9" },
];

export default function EvidencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Evidence"
        title="Decisions that trace back to a source you can read."
        subtitle="Compass reasons over a growing structured evidence base of real-world implementations. Every material claim carries its source&mdash;and when the evidence is insufficient, Compass says so."
      />

      {/* Evidence layers */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep text-center">
              The Evidence Graph
            </p>
            <h2 className="mt-5 text-section font-semibold tracking-tight text-ink text-center">
              Four layers between a document and a decision.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-center text-lead leading-relaxed text-muted">
              Compass does not ask a model to recall an example. It extracts structured claims
              from real sources, builds implementation records, and matches them to your problem
              and operating context before anything is recommended.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GRAPH.map((node, i) => (
              <Reveal key={node.name} delay={i * 80}>
                <div
                  className="relative overflow-hidden rounded-lg border border-line bg-surface p-6"
                  style={{ borderTop: `3px solid ${node.color}` }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ backgroundColor: node.color }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Layer</span>
                  </div>
                  <p
                    className="text-[16px] font-semibold tracking-tight"
                    style={{ color: node.color }}
                  >
                    {node.name}
                  </p>
                  <p className="mt-2 text-[13px] leading-snug text-muted">{node.note}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={360}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[12px] text-muted">
              <span className="font-semibold text-ink">a decision loop, not a one-way pipeline</span>
              <span aria-hidden="true">→</span>
              <span>every completed outcome strengthens the next recommendation</span>
            </div>
          </Reveal>
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
                  Evidence is weighted, not inflated.
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

      {/* Library stats */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center sm:px-8 lg:px-10 lg:py-16">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep mb-6">
              The library today
            </p>
            <LibraryStats size="lg" />
            <p className="mx-auto mt-10 max-w-2xl text-[13px] leading-relaxed text-muted">
              The evidence library is weighted by source independence — government audits and
              academic evaluations carry more weight than vendor case studies — and every record
              is attributable to a documented source.
            </p>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
