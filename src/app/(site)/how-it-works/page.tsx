import { DecisionTree } from "@/components/home/DecisionTree";
import { FinalCta } from "@/components/home/FinalCta";
import { Reveal } from "@/components/home/Reveal";

export default function HowItWorksPage() {
  return (
    <>
      {/* Why believe Compass can make this decision */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-4xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
          <Reveal>
            <h1 className="text-section font-semibold tracking-tight text-ink text-center">
              Compass doesn&apos;t copy what another company did.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lead leading-relaxed text-muted">
              It first understands your problem and compares every viable intervention. Only then
              does relevant evidence from 50,000+ implementations validate the recommendation.
              Suitability, economics, evidence, risk, and feasibility each play a different role in
              the decision.
            </p>
          </Reveal>
        </div>
      </section>

      <DecisionTree />
      <FinalCta />
    </>
  );
}