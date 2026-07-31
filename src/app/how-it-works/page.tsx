import { PageHeader } from "@/components/home/PageHeader";
import { Stack } from "@/components/home/Stack";
import { FinalCta } from "@/components/home/FinalCta";
import { Reveal } from "@/components/home/Reveal";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    number: "01",
    name: "Bring a decision",
    tag: "Live today",
    tone: "now" as const,
    body: "Describe a real operational problem in a guided intake\u2014the workflow, the current cost of running it, and the constraints you are operating under.",
    output: "A structured problem statement Compass can reason over.",
  },
  {
    number: "02",
    name: "Compass analyzes",
    tag: "Live today",
    tone: "now" as const,
    body: "Compass diagnoses likely root causes, retrieves structured implementation evidence, and compares every viable intervention\u2014AI, deterministic software, process redesign, human work, hybrid, or no action.",
    output: "Every viable path scored on the same evidence and criteria.",
  },
  {
    number: "03",
    name: "Review the recommendation",
    tag: "Live today",
    tone: "now" as const,
    body: "You get a Decision Recommendation: the recommended intervention, why it won, why each alternative lost, the evidence behind it, the assumptions that could change it, and the success metrics.",
    output: "A recommendation you can interrogate and defend.",
  },
  {
    number: "04",
    name: "Choose the path and plan execution",
    tag: "Live today",
    tone: "now" as const,
    body: "Generate an Implementation Blueprint\u2014phases, owners, dependencies, milestones, and validation criteria\u2014and decide whether your internal team or a selected partner will execute it.",
    output: "A Blueprint that preserves the independence of the original recommendation.",
  },
  {
    number: "05",
    name: "Execute",
    tag: "Live today",
    tone: "now" as const,
    body: "Your team or the partner you selected does the implementation. Compass does not implement\u2014it keeps the rationale, requirements, and validation criteria intact.",
    output: "Execution stays yours; judgment stays institutional.",
  },
  {
    number: "06",
    name: "Monitor and improve",
    tag: "In development",
    tone: "next" as const,
    body: "Compass tracks the agreed success metrics, surfaces drift against the original recommendation, and runs structured reviews at 3, 6, 9, and 12 months\u2014feeding verified results back into the next decision.",
    output: "The Decide stage gets better every time a decision completes.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How It Works"
        title="From operational problem to measurable outcome."
        subtitle="Six steps. The first four are live today; monitoring and continuous learning complete the loop."
      />

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <ol className="relative">
            <span aria-hidden="true" className="absolute bottom-4 left-[15px] top-4 w-px bg-line" />
            {STEPS.map((step, i) => (
              <li key={step.number} className="relative pb-12 pl-[46px] last:pb-0">
                <Reveal delay={i * 70}>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-0 top-0 flex h-[31px] w-[31px] items-center justify-center rounded-full border text-[11px] font-bold",
                      step.tone === "now" ? "border-transparent bg-ink text-paper" : "border-line bg-surface text-muted"
                    )}
                  >
                    {step.number}
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-[18px] font-semibold tracking-tight text-ink">{step.name}</h2>
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        step.tone === "now" ? "bg-accent text-accent-ink" : "border border-line text-faint"
                      )}
                    >
                      {step.tag}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted">{step.body}</p>
                  <p className="mt-3 text-[12.5px] font-medium text-ink">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.11em] text-faint">
                      You get{" "}
                    </span>
                    {step.output}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Stack />
      <FinalCta />
    </>
  );
}
