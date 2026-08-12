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

const RELEVANCE = [
  {
    title: "Direct comparable",
    note: "Similar workflow and intervention in a comparable organization. The strongest evidence for a decision.",
  },
  {
    title: "Supporting",
    note: "Relevant outcome in an adjacent domain or intervention type. Directionally useful, weighted lower.",
  },
  {
    title: "Adjacent — not evidence",
    note: "Records that retrieval surfaced but that do not support this decision are excluded, never forced into the brief.",
  },
  {
    title: "Observed vs. predicted",
    note: "What another company achieved is never presented as what you will achieve. The two are kept strictly separate.",
  },
];

export default function EvidencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Evidence"
        title="Not all evidence supports your decision."
        subtitle="Compass separates what exists from what matters: it finds relevant implementations, verifies where each came from, and only lets evidence that actually supports your decision into the recommendation."
      />

      {/* The three trust questions */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Reveal className="h-full">
              <div className="flex h-full flex-col border border-line bg-surface p-7" style={{ borderTop: "3px solid #0A5C55" }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0A5C55]">What has actually happened?</p>
                <p className="mt-3 text-[18px] font-semibold tracking-tight text-ink">50,000+ implementations</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  Real interventions with documented outcomes, across industries, functions, and
                  intervention types — not marketing claims.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100} className="h-full">
              <div className="flex h-full flex-col border border-line bg-surface p-7" style={{ borderTop: "3px solid #8B6914" }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8B6914]">Can we verify where it came from?</p>
                <p className="mt-3 text-[18px] font-semibold tracking-tight text-ink">Provenance</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  Every record is attributable to a source, weighted by independence — audits and
                  academic evaluations outrank vendor case studies.
                </p>
              </div>
            </Reveal>
            <Reveal delay={200} className="h-full">
              <div className="flex h-full flex-col border border-line bg-surface p-7" style={{ borderTop: "3px solid #1E40AF" }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1E40AF]">Does it support this decision?</p>
                <p className="mt-3 text-[18px] font-semibold tracking-tight text-ink">Relevance</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  A record must pass a strict relevance threshold. Retrieval may be broad; what
                  qualifies as evidence stays narrow.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What has actually happened — live library */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep text-center">
              What has actually happened
            </p>
            <h2 className="mt-5 text-section font-semibold tracking-tight text-ink text-center">
              A structured evidence base, not a pile of documents.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-center text-lead leading-relaxed text-muted">
              Compass extracts structured claims from real sources, builds implementation records,
              and matches them to your problem and operating context before anything is recommended.
            </p>
          </Reveal>

          <div className="mt-12">
            <Reveal>
              <EvidenceStats variant="full" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Provenance */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
              Can we verify where it came from?
            </p>
            <h2 className="mt-5 max-w-2xl text-section font-semibold tracking-tight text-ink">
              Different sources carry different forms of confidence.
            </h2>
            <p className="mt-5 max-w-2xl text-lead leading-relaxed text-muted">
              Compass tracks which type of source backs each claim — and never inflates it. A vendor
              record is treated differently from an independent audit, and the difference is visible
              in the decision.
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

      {/* Relevance */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
              Does it support this decision?
            </p>
            <h2 className="mt-5 max-w-2xl text-section font-semibold tracking-tight text-ink">
              Relevant evidence is a narrow set, not everything we found.
            </h2>
            <p className="mt-5 max-w-2xl text-lead leading-relaxed text-muted">
              Retrieval can be broad. What qualifies as evidence stays strict. A record only reaches
              a recommendation if it independently passes the relevance threshold for that workflow
              and intervention.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {RELEVANCE.map((r, i) => (
              <Reveal key={r.title} delay={i * 70} className="h-full">
                <div className="flex h-full items-start gap-3.5 border border-line bg-surface p-5">
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-deep"
                  />
                  <div>
                    <p className="text-[14px] font-semibold tracking-tight text-ink">{r.title}</p>
                    <p className="mt-1 text-[13px] leading-snug text-muted">{r.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
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