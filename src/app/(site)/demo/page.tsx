import Link from "next/link";
import type { Metadata } from "next";
import { metadata as siteMetadata } from "@/content/marketing";
import { PageHeader } from "@/components/home/PageHeader";
import { ExecutiveBrief } from "@/components/home/ExecutiveBrief";
import { Reveal } from "@/components/home/Reveal";
import { ArrowIcon } from "@/components/home/primitives";

export const metadata: Metadata = {
  title: `Demo \u2014 ${siteMetadata.title}`,
  description: siteMetadata.description,
};

const DEMO_STEPS = [
  {
    title: "1. Describe the problem",
    detail:
      "An operations leader describes a business problem \u2014 for example, manual invoice processing consuming finance capacity.",
  },
  {
    title: "2. Compass compares the paths",
    detail:
      "AI implementation, workflow automation, process redesign, software, staffing, hybrid approaches, and no action are compared on evidence.",
  },
  {
    title: "3. You get an executive recommendation",
    detail:
      "The decision, expected outcomes, supporting evidence, strategy, and implementation plan \u2014 in one page you can act on.",
  },
];

export default function DemoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Demo"
        title="See a Compass decision, end to end."
        subtitle="This is an illustrative sample of what an assessment produces \u2014 a real assessment is built from your organization\u2019s problem and context."
      />

      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {DEMO_STEPS.map((s) => (
              <Reveal key={s.title}>
                <div className="border border-line bg-paper px-6 py-7">
                  <h2 className="text-[15.5px] font-semibold tracking-tight text-ink">{s.title}</h2>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{s.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ExecutiveBrief />

      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 lg:py-24">
          <Reveal>
            <h2 className="text-title font-semibold tracking-tight text-ink">
              Now run one on your own problem.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lead leading-relaxed text-muted">
              The assessment takes minutes and produces a recommendation specific to your operations.
            </p>
            <Link
              href="/assessment"
              className="group mt-9 inline-flex items-center justify-center gap-2 bg-ink px-7 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:bg-ink2"
            >
              Start Assessment
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
