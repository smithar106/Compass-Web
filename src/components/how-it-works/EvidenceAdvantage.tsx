import { cn } from "@/lib/utils";
import { fetchEvidenceMeta, formatCount } from "@/lib/evidence-meta";

const PIPELINE = [
  { name: "Source document", note: "Audit, evaluation, disclosure, or operating record" },
  { name: "Evidence claims", note: "Extracted, attributable statements" },
  { name: "Implementation record", note: "Structured: intervention, context, outcomes" },
  { name: "Evidence role", note: "Problem, intervention, implementation, outcome, or risk" },
  { name: "Recommendation", note: "Ranked and cited in the Decision Brief" },
];

const RECORD_FIELDS = [
  "organization",
  "problem",
  "intervention",
  "implementation partner",
  "pilot structure",
  "rollout strategy",
  "duration",
  "governance model",
  "training",
  "change management",
  "adoption",
  "validation gate",
  "lessons learned",
  "outcomes",
  "risks",
  "provenance",
];

export async function EvidenceAdvantage() {
  const meta = await fetchEvidenceMeta();
  const count = formatCount(meta?.published_records);

  return (
    <section id="evidence" className="scroll-mt-24 border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                03 — The evidence advantage
              </p>
              <h2 className="mt-5 text-title font-semibold tracking-tight text-ink">
                Built on structured evidence from real-world implementations.
              </h2>
              <p className="mt-5 max-w-lg text-lead leading-relaxed text-muted">
                Compass does not start with documents. It starts with structured
                implementation records — organizations, problems, interventions,
                outcomes, and risks — normalized so differently worded problems can
                be compared consistently.
              </p>
            </div>

            <div className="mt-8 border border-line bg-surface shadow-panel">
              <div className="border-b border-line bg-paper/60 px-5 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent-deep">
                  Published implementation records
                </p>
              </div>
              <div className="px-5 py-5">
                {count ? (
                  <>
                    <p className="font-mono text-[40px] font-bold leading-none tracking-tight text-ink">
                      {count}
                    </p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                      and growing. Each record is a structured unit of
                      implementation evidence — not a document.
                    </p>
                  </>
                ) : (
                  <p className="text-[13px] leading-relaxed text-muted">
                    Compass is built on a growing library of published
                    implementation records.
                  </p>
                )}
                {meta?.last_published_at && (
                  <p className="mt-3 text-[10.5px] text-faint">
                    Updated continuously · last published{" "}
                    {new Date(meta.last_published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                From document to recommendation
              </h3>
              <div className="mt-5">
                <DocumentPipeline />
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                What an implementation record contains
              </h3>
              <div className="mt-5 border border-line bg-surface shadow-panel">
                <div className="flex flex-wrap gap-1.5 px-5 py-4">
                  {RECORD_FIELDS.map((f) => (
                    <span
                      key={f}
                      className="border border-line bg-paper px-2.5 py-1 text-[11px] font-medium text-muted"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <p className="border-t border-line bg-paper/60 px-5 py-3 text-[11.5px] leading-relaxed text-muted">
                  Every field keeps its provenance: the source it came from, whether
                  it is explicit or inferred, and when it was published. Sources must
                  be resolvable before they support a production recommendation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DocumentPipeline() {
  return (
    <ol className="space-y-0">
      {PIPELINE.map((step, i) => {
        const isLast = i === PIPELINE.length - 1;
        return (
          <li key={step.name} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-bold",
                  isLast ? "border-transparent bg-ink text-accent" : "border-line bg-surface text-faint"
                )}
              >
                {i + 1}
              </span>
              {!isLast && <span aria-hidden="true" className="w-px flex-1 bg-line" />}
            </div>
            <div className="pb-6">
              <p className="text-[13.5px] font-semibold text-ink">{step.name}</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-muted">{step.note}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
