import { PageHeader } from "@/components/home/PageHeader";
import { Lifecycle } from "@/components/home/Lifecycle";
import { Anatomy } from "@/components/home/Anatomy";
import { Operations } from "@/components/home/Operations";
import { Differentiation } from "@/components/home/Differentiation";
import { SearchRecommendations } from "@/components/home/SearchRecommendations";
import { FinalCta } from "@/components/home/FinalCta";
import { Reveal } from "@/components/home/Reveal";

const OWNED = [
  "Operational problem definition",
  "Evidence collection",
  "Intervention comparison",
  "Decision records",
  "Decision rationale",
  "Implementation Plans",
  "Success metrics",
  "Assumptions and risks",
  "Monitoring frameworks",
  "Outcome reviews",
  "Organizational learning",
  "Future decision improvement",
];

const EXECUTED = [
  "Customer's internal team",
  "A selected implementation partner",
  "An external vendor",
  "A technical services firm",
];

export default function ProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="Product"
        title={
          <>
            A decision system, not a consulting engagement.
          </>
        }
        subtitle="Compass is the persistent judgment layer for operational decisions. It defines the problem, compares every viable intervention against structured evidence, produces the decision and the Blueprint&mdash;then stays with you to measure whether it worked."
      />

      {/* What Compass owns */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <h2 className="text-section font-semibold tracking-tight text-ink">
                  Compass owns the judgment. You own the execution.
                </h2>
                <p className="mt-5 max-w-md text-lead leading-relaxed text-muted">
                  The decision layer stays with Compass. The implementation is executed by your team
                  or a partner you select&mdash;and a partner becomes relevant only after you choose
                  the intervention.
                </p>
              </Reveal>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Reveal>
                <div className="border-t-2 border-ink pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                    Compass owns
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {OWNED.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-snug text-ink">
                        <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent-deep" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="border-t border-line pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-faint">
                    Executed by you or your partner
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {EXECUTED.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-snug text-muted">
                        <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-line" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 border-l-2 border-accent-deep bg-surface px-4 py-3.5">
                    <p className="text-[12.5px] leading-relaxed text-muted">
                      Vendors cannot pay to influence decisions. Independence is preserved from
                      problem to decision.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Lifecycle />
      <Anatomy />
      <Operations />
      <Differentiation />
      <SearchRecommendations />
      <FinalCta />
    </>
  );
}
