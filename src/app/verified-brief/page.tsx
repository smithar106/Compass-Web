import type { Metadata } from "next";
import Link from "next/link";
import { Needle, ArrowIcon } from "@/components/home/primitives";
import { compassApiBase } from "@/lib/engine-proxy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Decision Brief — Manual Invoice Processing (verified context)",
  description:
    "A source-verified decision brief for manual invoice processing. Source verification and comparability are shown separately; the brief states where direct implementation evidence is missing.",
};

interface VerifiedMetric {
  label: string;
  value: string;
  direction: string;
  passage: string;
}
interface VerifiedRecord {
  id: string;
  organization: string;
  intervention: string;
  what_it_establishes: string;
  metrics: VerifiedMetric[];
  source: { title: string; url: string; type: string; date: string };
  verification_status: string;
  comparability: string;
  outcome_attribution: string;
  comparability_reason: string;
  selection_reason: string;
  supports_direct_outcome: boolean;
  attribution_limitation: string;
}
interface VerifiedPayload {
  available: boolean;
  workflow?: string;
  category?: string;
  problem?: string;
  recommendation?: string;
  reviewed_at?: string;
  notes?: string;
  records: VerifiedRecord[];
  summary: {
    total?: number;
    direct_implementation?: number;
    indirect_contextual?: number;
    not_relevant?: number;
    unassessed?: number;
    supports_direct_outcome?: number;
  };
}

async function fetchVerified(workflow: string): Promise<VerifiedPayload | null> {
  const base = compassApiBase();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api/evidence/verified?workflow=${encodeURIComponent(workflow)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    return (await res.json()) as VerifiedPayload;
  } catch {
    return null;
  }
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-bold uppercase tracking-eyebrow text-accent-deep">{children}</h2>
  );
}

const COMPARABILITY_LABEL: Record<string, { label: string; tone: string }> = {
  direct_implementation: { label: "Direct implementation evidence", tone: "bg-ok-soft text-[#14532d]" },
  indirect_contextual: { label: "Indirect contextual evidence", tone: "bg-brand-blue-light text-[#1e40af]" },
  not_relevant: { label: "Not relevant to this decision", tone: "bg-warn-soft text-[#7a3b06]" },
  unassessed: { label: "Comparability unassessed", tone: "bg-paper text-muted" },
};

export default async function VerifiedBriefPage({
  searchParams,
}: {
  searchParams?: { workflow?: string };
}) {
  const workflow = searchParams?.workflow || "document_process_automation";
  const data = await fetchVerified(workflow);

  if (!data || !data.available) {
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
        <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-24 text-center sm:px-8">
          <h1 className="text-[22px] font-semibold tracking-tight text-ink">
            Verified evidence is currently unavailable
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-muted">
            The verified evidence set is served by the Compass engine and could not be reached. No
            cached or hardcoded copy is shown.
          </p>
        </main>
      </div>
    );
  }

  const records = data.records;
  const s = data.summary;
  const hasDirectEvidence = (s.supports_direct_outcome ?? 0) > 0;

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
          <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-muted">
            {data.category || "Finance"}
          </p>
          <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-ink sm:text-[30px]">
            {data.problem || "Manual document and process handling"}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {hasDirectEvidence ? (
              <>
                <span className="rounded-full bg-ok-soft px-3 py-1 text-[11.5px] font-bold text-[#14532d]">
                  Implementation-backed
                </span>
                <span className="rounded-full bg-ok-soft px-3 py-1 text-[11.5px] font-bold text-[#14532d]">
                  {s.supports_direct_outcome ?? 0} verified direct implementation
                  {(s.supports_direct_outcome ?? 0) === 1 ? "" : "s"}
                </span>
              </>
            ) : (
              <>
                <span className="rounded-full bg-warn-soft px-3 py-1 text-[11.5px] font-bold text-[#7a3b06]">
                  Directionally supported
                </span>
                <span className="rounded-full bg-brand-blue-light px-3 py-1 text-[11.5px] font-bold text-[#1e40af]">
                  Verified context · no direct implementation evidence
                </span>
              </>
            )}
          </div>
        </div>

        {/* Evidence status notice */}
        {hasDirectEvidence ? (
          <div className="mt-4 border border-[#BBF7D0] bg-[#F0FDF4] px-6 py-5">
            <p className="text-[13.5px] font-semibold text-[#14532d]">
              Supported by verified direct implementation evidence.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#14532d]">
              {s.supports_direct_outcome ?? 0} of {s.total ?? 0} records document an implementation
              of this intervention with an outcome the source explicitly attributes to it. Each
              record shows its source, passage, verification, comparability, and attribution.
            </p>
          </div>
        ) : (
          <div className="mt-4 border border-[#FCD34D] bg-[#FFFBEB] px-6 py-5">
            <p className="text-[13.5px] font-semibold text-[#7a3b06]">
              No direct implementation evidence was found for this intervention.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#7a3b06]">
              The sources below are <span className="font-semibold">source-verified facts</span>, but
              they do not document an implementation of this intervention with an attributable
              outcome. This brief does not claim that its recommendation is supported by verified
              implementation outcomes.
            </p>
          </div>
        )}

        {/* 1. Recommendation */}
        <div className="mt-4 border border-ink bg-ink px-6 py-6 sm:px-8">
          <SectionTitle>
            <span className="text-accent">1 · Recommendation</span>
          </SectionTitle>
          <p className="mt-2 text-[20px] font-semibold leading-snug tracking-tight text-paper sm:text-[22px]">
            {data.recommendation || "Automated invoice capture with exception-based review"}
          </p>
          <p className="mt-3 text-[14.5px] leading-relaxed text-paper/85">
            {hasDirectEvidence
              ? "Backed by verified direct implementation evidence: the sources below document implementations of this intervention with outcomes the sources attribute to it."
              : "A directionally supported hypothesis, based on the scale and adoption of adjacent programs. It is not yet backed by direct, verified implementation outcomes."}
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
            {records.map((e) => {
              const c = COMPARABILITY_LABEL[e.comparability] ?? COMPARABILITY_LABEL.unassessed;
              return (
                <div key={e.id} className="border border-line bg-surface px-5 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold tracking-tight text-ink">
                        {e.organization}
                      </p>
                      <p className="mt-0.5 text-[13px] text-muted">{e.what_it_establishes}</p>
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
                    {!e.supports_direct_outcome && e.attribution_limitation && (
                      <span className="text-[10.5px] text-faint">{e.attribution_limitation}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-[12px] leading-relaxed text-muted">
            {s.direct_implementation ?? 0} direct implementation · {s.indirect_contextual ?? 0}{" "}
            indirect contextual · {s.not_relevant ?? 0} not relevant
            {s.unassessed ? ` · ${s.unassessed} unassessed` : ""}. Comparability is reported
            separately and does not change source-verification status.
          </p>
        </section>

        {/* 3. Impact */}
        <section className="mt-10">
          <SectionTitle>
            3 · Impact {hasDirectEvidence ? "(verified implementation outcomes)" : "(contextual facts, not comparable outcomes)"}
          </SectionTitle>
          <div className="mt-4 border border-line bg-surface px-6 py-6">
            <p className="text-[13px] leading-relaxed text-ink">
              {hasDirectEvidence
                ? "These outcomes are reported by the implementing organizations and attributed to the intervention by the source. Each row links to its source; records whose benefit is only expected (not reported) are marked uncertain and do not support a direct-outcome claim."
                : "These figures are reported scale and savings from the sources above. They are not attributed to the recommended intervention and must not be read as expected results of the recommendation."}
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
                  {records.flatMap((e) =>
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
                          {(COMPARABILITY_LABEL[e.comparability] ?? COMPARABILITY_LABEL.unassessed).label}
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
                <span className="font-semibold">
                  {hasDirectEvidence ? "Direct implementation evidence present." : "No direct implementation evidence."}
                </span>{" "}
                {hasDirectEvidence
                  ? "The records document implementations of this intervention with outcomes the sources attribute to it."
                  : "None of the sources documents an implementation of this intervention with an attributable outcome."}
              </li>
              <li>
                <span className="font-semibold">Explicit attribution ≠ causal proof.</span> "Explicit"
                means the source states the intervention produced the outcome; it is not rigorous
                causal identification.
              </li>
              <li>
                <span className="font-semibold">Verified source ≠ verified comparable.</span> The
                records are verified facts; comparability is a separate dimension.
              </li>
              <li>
                <span className="font-semibold">Observed ≠ projected.</span> No figure here is an
                expected result for your organization.
              </li>
              <li>
                <span className="font-semibold">Organization-specific impact requires your inputs.</span>{" "}
                Volume, handling time, and loaded labor cost are needed and are not assumed.
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
                whether the source documents an implementation of this intervention and attributes
                the outcome to it.
              </li>
            </ol>
          </div>
        </section>

        <div className="mt-12 border-t border-line pt-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-md text-[13px] leading-relaxed text-muted">
              This brief separates source verification from comparability and states where direct
              evidence is missing. Served by the Compass engine.
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
