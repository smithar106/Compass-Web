import type { Metadata } from "next";
import Link from "next/link";
import { Needle, ArrowIcon } from "@/components/home/primitives";
import {
  VERIFIED_INVOICE_EVIDENCE,
  VERIFIED_INVOICE_SUMMARY,
} from "@/data/prototype/verified-invoice";

export const metadata: Metadata = {
  title: "Decision Brief — Manual Invoice Processing (verified context)",
  description:
    "A source-verified decision brief for manual invoice processing. Source verification and comparability are shown separately; the brief states where direct implementation evidence is missing.",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-bold uppercase tracking-eyebrow text-accent-deep">{children}</h2>
  );
}

const COMPARABILITY_LABEL: Record<string, { label: string; tone: string }> = {
  direct_implementation: { label: "Direct implementation evidence", tone: "bg-ok-soft text-[#14532d]" },
  indirect_contextual: { label: "Indirect contextual evidence", tone: "bg-brand-blue-light text-[#1e40af]" },
  not_relevant: { label: "Not relevant to this decision", tone: "bg-warn-soft text-[#7a3b06]" },
};

export default function VerifiedBriefPage() {
  const evidence = VERIFIED_INVOICE_EVIDENCE;
  const s = VERIFIED_INVOICE_SUMMARY;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label="Compass home">
            <Needle className="h-5 w-5 text-ink" />
            <span className="text-[15px] font-bold tracking-tight text-ink">Compass</span>
          </Link>
          <span className="text-[10.5px] font-bold uppercase tracking-eyebrow text-muted">
            Decision Brief
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        {/* Header */}
        <div className="border border-line bg-paper px-6 py-7 sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">
            Compass Decision
          </p>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-muted">Finance</p>
          <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-ink sm:text-[30px]">
            Manual invoice processing
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-warn-soft px-3 py-1 text-[11.5px] font-bold text-[#7a3b06]">
              Directionally supported
            </span>
            <span className="rounded-full bg-brand-blue-light px-3 py-1 text-[11.5px] font-bold text-[#1e40af]">
              Verified context · no direct implementation evidence
            </span>
          </div>
        </div>

        {/* Evidence-gap notice */}
        <div className="mt-4 border border-[#FCD34D] bg-[#FFFBEB] px-6 py-5">
          <p className="text-[13.5px] font-semibold text-[#7a3b06]">
            No direct implementation evidence was found for this intervention.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#7a3b06]">
            The sources below are <span className="font-semibold">source-verified facts</span>, but
            they document platform scale and adjacent cost programs — not an implementation of
            automated invoice capture with exception-based review. This brief therefore does not
            claim that its recommendation is supported by verified implementation outcomes.
          </p>
        </div>

        {/* 1. Recommendation */}
        <div className="mt-4 border border-ink bg-ink px-6 py-6 sm:px-8">
          <SectionTitle>
            <span className="text-accent">1 · Recommendation</span>
          </SectionTitle>
          <p className="mt-2 text-[20px] font-semibold leading-snug tracking-tight text-paper sm:text-[22px]">
            Automated invoice capture with exception-based review
          </p>
          <p className="mt-3 text-[14.5px] leading-relaxed text-paper/85">
            A directionally supported hypothesis, based on the scale and adoption of e-invoicing and
            adjacent cost programs. It is not yet backed by direct, verified implementation
            outcomes.
          </p>
        </div>

        {/* 2. Evidence — two dimensions */}
        <section className="mt-10">
          <SectionTitle>2 · Evidence (two independent dimensions)</SectionTitle>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            <span className="font-semibold text-ink">Source verification</span> asks whether the
            document is authentic and contains the claim.{" "}
            <span className="font-semibold text-ink">Comparability</span> asks whether the record
            documents an implementation of <em>this</em> intervention. A record can be verified and
            still not be a comparable.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {evidence.map((e) => {
              const c = COMPARABILITY_LABEL[e.comparability.classification];
              return (
                <div key={e.id} className="border border-line bg-surface px-5 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold tracking-tight text-ink">
                        {e.organization}
                      </p>
                      <p className="mt-0.5 text-[13px] text-muted">{e.whatItEstablishes}</p>
                    </div>
                    <a
                      href={e.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-paper px-3 py-1 text-[10.5px] font-bold text-muted hover:underline"
                    >
                      {e.source.type} · {e.source.date} ↗
                    </a>
                  </div>

                  <dl className="mt-4 flex flex-col gap-2.5">
                    {e.metrics.map((m) => (
                      <div key={m.label} className="border-l-2 border-line pl-3">
                        <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
                          {m.label}
                        </dt>
                        <dd className="text-[14px] font-semibold text-ink">{m.value}</dd>
                        <dd className="mt-1 text-[12px] italic leading-relaxed text-faint">
                          “{m.passage}”
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                    <span className="rounded-full bg-ok-soft px-2.5 py-0.5 text-[10px] font-bold text-[#14532d]">
                      ✓ Source verified
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${c.tone}`}>
                      {c.label}
                    </span>
                    {!e.comparability.establishesInterventionOutcome && (
                      <span className="text-[10.5px] text-faint">
                        does not establish intervention → outcome
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-[12px] leading-relaxed text-muted">
            {s.directImplementation} direct implementation · {s.indirectContextual} indirect
            contextual · {s.notRelevant} not relevant. Comparability is reported separately and does
            not change source-verification status.
          </p>
        </section>

        {/* 3. Impact */}
        <section className="mt-10">
          <SectionTitle>3 · Impact (contextual facts, not comparable outcomes)</SectionTitle>
          <div className="mt-4 border border-line bg-surface px-6 py-6">
            <p className="text-[13px] leading-relaxed text-ink">
              These figures are reported scale and savings from the sources above. They are{" "}
              <span className="font-semibold">not</span> attributed to automated invoice capture and
              must not be read as expected results of the recommendation.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-line text-[10.5px] uppercase tracking-wide text-muted">
                    <th className="py-2 pr-4 font-bold">Metric</th>
                    <th className="py-2 pr-4 font-bold">Value</th>
                    <th className="py-2 pr-4 font-bold">Source</th>
                    <th className="py-2 font-bold">Comparability</th>
                  </tr>
                </thead>
                <tbody>
                  {evidence.flatMap((e) =>
                    e.metrics.map((m) => (
                      <tr key={`${e.id}-${m.label}`} className="border-b border-line last:border-0">
                        <td className="py-2.5 pr-4 text-ink">{m.label}</td>
                        <td className="py-2.5 pr-4 font-semibold text-ink">{m.value}</td>
                        <td className="py-2.5 pr-4">
                          <a
                            href={e.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-deep hover:underline"
                          >
                            {e.organization}
                          </a>
                        </td>
                        <td className="py-2.5 text-muted">
                          {COMPARABILITY_LABEL[e.comparability.classification].label}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 4. Assumptions & limitations */}
        <section className="mt-10">
          <SectionTitle>4 · Assumptions &amp; limitations</SectionTitle>
          <div className="mt-4 border border-line bg-surface px-6 py-6">
            <ul className="flex flex-col gap-3 text-[13px] leading-relaxed text-ink">
              <li>
                <span className="font-semibold">No direct implementation evidence.</span> None of
                the sources documents an invoice-automation implementation with an attributable
                outcome.
              </li>
              <li>
                <span className="font-semibold">Verified source ≠ verified comparable.</span> The
                records are verified facts; comparability is a separate dimension and is reported
                as such.
              </li>
              <li>
                <span className="font-semibold">Observed ≠ projected.</span> No figure here is an
                expected result for your organization.
              </li>
              <li>
                <span className="font-semibold">Organization-specific impact requires your inputs.</span>{" "}
                Invoice volume, handling time, and loaded labor cost are needed and are not assumed.
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Reproducibility */}
        <section className="mt-10">
          <SectionTitle>5 · Reproducibility</SectionTitle>
          <div className="mt-4 border border-line bg-surface px-6 py-6">
            <p className="text-[13px] leading-relaxed text-ink">
              An independent reviewer can reconstruct this brief:
            </p>
            <ol className="mt-3 flex flex-col gap-2.5 text-[13px] leading-relaxed text-ink">
              <li>
                <span className="font-semibold">1.</span> Open each source link (all on sec.gov).
              </li>
              <li>
                <span className="font-semibold">2.</span> Search the document for the quoted passage.
              </li>
              <li>
                <span className="font-semibold">3.</span> Confirm the figure matches, and confirm
                whether the source actually documents an invoice-automation implementation (it does
                not, in these cases).
              </li>
            </ol>
          </div>
        </section>

        <div className="mt-12 border-t border-line pt-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-md text-[13px] leading-relaxed text-muted">
              This brief separates source verification from comparability and states where direct
              evidence is missing.
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/prototype"
                className="inline-flex items-center justify-center gap-2 border border-line bg-surface px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:border-ink/40"
              >
                Decision prototype
              </Link>
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-paper transition-colors hover:bg-ink2"
              >
                Analyze my problem
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
