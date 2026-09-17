import type { Metadata } from "next";
import Link from "next/link";
import { Needle, ArrowIcon } from "@/components/home/primitives";
import { VERIFIED_INVOICE_EVIDENCE } from "@/data/prototype/verified-invoice";

export const metadata: Metadata = {
  title: "Verified Decision Brief — Manual Invoice Processing",
  description:
    "A fully verified Compass decision brief: every claim is traced to a primary source, calculations are transparent, and the evidence is independently reconstructable.",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-bold uppercase tracking-eyebrow text-accent-deep">{children}</h2>
  );
}

export default function VerifiedBriefPage() {
  const evidence = VERIFIED_INVOICE_EVIDENCE;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label="Compass home">
            <Needle className="h-5 w-5 text-ink" />
            <span className="text-[15px] font-bold tracking-tight text-ink">Compass</span>
          </Link>
          <span className="text-[10.5px] font-bold uppercase tracking-eyebrow text-muted">
            Verified Decision Brief
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
            <span className="rounded-full bg-ok-soft px-3 py-1 text-[11.5px] font-bold text-[#14532d]">
              Verified evidence
            </span>
            <span className="rounded-full bg-ok-soft px-3 py-1 text-[11.5px] font-bold text-[#14532d]">
              {evidence.length} claim-verified implementations
            </span>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-muted">
            Every claim below is traced to a primary source. The material evidence and the
            calculations can be independently reconstructed without relying on Compass.
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
            Digitize invoice intake and matching, and route only exceptions to human review. This is
            the intervention supported by the verified implementations below.
          </p>
        </div>

        {/* 2. Verified evidence */}
        <section className="mt-10">
          <SectionTitle>2 · Verified comparable implementations</SectionTitle>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            Each record was verified against a primary source: the document was retrieved and the
            supporting passage located in the source text. Click a source to open it.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {evidence.map((e) => (
              <div key={e.id} className="border border-line bg-surface px-5 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-semibold tracking-tight text-ink">
                      {e.organization}
                    </p>
                    <p className="mt-0.5 text-[13px] text-muted">{e.intervention}</p>
                  </div>
                  <a
                    href={e.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ok-soft px-3 py-1 text-[10.5px] font-bold text-[#14532d] hover:underline"
                  >
                    {e.source.type} · {e.source.date} ↗
                  </a>
                </div>

                <dl className="mt-4 flex flex-col gap-2.5">
                  {e.metrics.map((m) => (
                    <div key={m.label} className="border-l-2 border-accent-deep pl-3">
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

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-[11px] text-faint">
                  <span>Source: {e.source.title}</span>
                  <span className="font-semibold text-[#14532d]">
                    ✓ source authentic · ✓ document retrieved · ✓ passage matched
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Impact calculation */}
        <section className="mt-10">
          <SectionTitle>3 · Impact calculation</SectionTitle>
          <div className="mt-4 border border-line bg-surface px-6 py-6">
            <p className="text-[13px] leading-relaxed text-ink">
              This brief reports <span className="font-semibold">observed scale and outcomes</span>{" "}
              from the verified implementations above. It does not project a savings figure for your
              organization — that requires your invoice volume and loaded labor cost.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-line text-[10.5px] uppercase tracking-wide text-muted">
                    <th className="py-2 pr-4 font-bold">Metric</th>
                    <th className="py-2 pr-4 font-bold">Observed value</th>
                    <th className="py-2 pr-4 font-bold">Source record</th>
                    <th className="py-2 font-bold">Method</th>
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
                        <td className="py-2.5 text-muted">Reported value, verified verbatim</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-faint">
              No aggregation or modelling is applied. Each figure is the value stated in its source.
              Where a source reports a range or a point value, the figure is shown as reported.
            </p>
          </div>
        </section>

        {/* 4. Assumptions & limitations */}
        <section className="mt-10">
          <SectionTitle>4 · Assumptions &amp; limitations</SectionTitle>
          <div className="mt-4 border border-line bg-surface px-6 py-6">
            <ul className="flex flex-col gap-3 text-[13px] leading-relaxed text-ink">
              <li>
                <span className="font-semibold">Observed ≠ projected.</span> These are outcomes
                other organizations reported. They validate the intervention path, not your result.
              </li>
              <li>
                <span className="font-semibold">Scope of verification.</span> The verified set is
                deliberately small ({evidence.length} implementations) and drawn from primary SEC
                filings/exhibits. It is not a statistical sample of the market.
              </li>
              <li>
                <span className="font-semibold">Recency.</span> Sources span 2001–2022. Older
                figures may not reflect current costs or tooling.
              </li>
              <li>
                <span className="font-semibold">Organization-specific impact requires your inputs.</span>{" "}
                Invoice volume, average handling time, and loaded labor cost are needed to compute
                organization-specific savings. None are assumed here.
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
                <span className="font-semibold">1.</span> Open each source link above (all on
                sec.gov).
              </li>
              <li>
                <span className="font-semibold">2.</span> Search the document for the quoted
                passage shown with each metric.
              </li>
              <li>
                <span className="font-semibold">3.</span> Confirm the figure stated in the source
                matches the value reported here.
              </li>
            </ol>
            <p className="mt-4 text-[12px] leading-relaxed text-faint">
              No claim in this brief depends on Compass's interpretation. The sources are public and
              the passages are quoted.
            </p>
          </div>
        </section>

        {/* Footer CTA */}
        <div className="mt-12 border-t border-line pt-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-md text-[13px] leading-relaxed text-muted">
              This is the first fully verified Compass decision brief. The verified set is small by
              design and grows deliberately.
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
