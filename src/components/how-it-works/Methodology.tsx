import { Reveal } from "@/components/home/Reveal";
import { Section } from "./Section";
import { AnalyzeFlow } from "./AnalyzeFlow";
import { DefensibilityChecklist } from "./DefensibilityChecklist";
import { QualityFactors } from "./QualityFactors";

export function Methodology() {
  return (
    <Section
      id="methodology"
      number="02"
      eyebrow="The decision methodology"
      headline="A recommendation must survive eight questions."
      subtitle="The Assessment pathway runs a real decision through a repeatable methodology — from problem statement to Executive Recommendation. Nothing is recommended until it can be defended."
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
              The Assessment flow
            </h3>
            <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-ink">
              Live today
            </span>
          </div>
          <div className="mt-6">
            <AnalyzeFlow />
          </div>
        </Reveal>

        <div className="space-y-10">
          <Reveal delay={80}>
            <DefensibilityChecklist />
          </Reveal>
          <Reveal delay={160}>
            <QualityFactors />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
