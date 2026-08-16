import Link from "next/link";
import { ArrowIcon, Eyebrow } from "@/components/home/primitives";
import { Reveal } from "@/components/home/Reveal";
import { FinalCta } from "@/components/home/FinalCta";

const FLOW = [
  {
    step: "01",
    title: "Decide",
    copy: "Choose the right intervention. Compare AI, automation, software, process redesign, people, and hybrid approaches.",
  },
  {
    step: "02",
    title: "Prove",
    copy: "See why it should work. Inspect comparable implementations, measured outcomes, economics, and source evidence.",
  },
  {
    step: "03",
    title: "Implement",
    copy: "Know what happens next. Turn the decision into an implementation plan with owners, milestones, costs, and success criteria.",
  },
  {
    step: "04",
    title: "Measure",
    copy: "Learn from the outcome. Compare expected vs. actual results and make the next decision smarter.",
  },
];

const PATHS = [
  { approach: "Hybrid workflow + routing", evidence: "82%", impact: "25\u201340%", verdict: "Recommended", verdictTone: "recommended" },
  { approach: "Process redesign", evidence: "58%", impact: "10\u201318%", verdict: "Viable", verdictTone: "viable" },
  { approach: "Software routing", evidence: "50%", impact: "15\u201325%", verdict: "Compared", verdictTone: "compared" },
  { approach: "AI agent", evidence: "31%", impact: "Unsupported", verdict: "Rejected", verdictTone: "rejected" },
  { approach: "More staffing", evidence: "42%", impact: "Low", verdict: "Rejected", verdictTone: "rejected" },
  { approach: "No action", evidence: "\u2014", impact: "0%", verdict: "Rejected", verdictTone: "rejected" },
];

const EVIDENCE = [
  {
    org: "Lancashire Constabulary",
    intervention: "Robotic Process Automation",
    result: "\u00A32M savings \u00B7 >100 officer-equivalents saved",
    source:
      "Automating administrative policing processes freed 100+ officer-equivalents and delivered \u00A32M in savings after a \u00A3864K investment.",
  },
  {
    org: "Ipswich Hospital NHS Trust",
    intervention: "Referral automation",
    result: "500+ hours saved \u00B7 \u00A3220K projected savings",
    source:
      "Automated referral ingestion and first-stage triage saved 500+ staff hours with roughly \u00A3220K in projected savings over nine months.",
  },
  {
    org: "U.S. Air Force",
    intervention: "Process automation",
    result: "429,000 labor hours saved",
    source:
      "Enterprise robotic process automation deployments saved roughly 429,000 labor hours, with potential to exceed 577,000 hours.",
  },
];

const verdictTone: Record<string, string> = {
  recommended: "bg-accent/10 text-accent-deep",
  viable: "bg-valid/10 text-valid",
  compared: "bg-paper text-ink",
  rejected: "text-muted",
};

export default function ProductPage() {
  return (
    <>
      {/* 1 — Hero */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28">
          <Reveal>
            <h1 className="max-w-3xl text-title font-semibold tracking-tight text-ink">
              Make the right operational decision before you spend.
            </h1>
            <p className="mt-6 max-w-2xl text-lead leading-relaxed text-muted">
              Bring Compass a business problem. It compares the ways you could solve it, shows what has
              worked elsewhere, and recommends what to do next.
            </p>
            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
              <Link
                href="/assessment"
                className="group inline-flex items-center justify-center gap-2 bg-accent px-7 py-3.5 text-[15px] font-semibold text-accent-ink transition-colors hover:bg-paper-dark"
              >
                Run an Assessment
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/control-room"
                className="inline-flex items-center justify-center gap-2 border border-line px-7 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent-deep"
              >
                See a Decision
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 — One simple product flow */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-section sm:px-8 lg:px-10">
          <Reveal>
            <Eyebrow>How Compass works</Eyebrow>
            <h2 className="mt-5 max-w-2xl text-title font-semibold tracking-tight text-ink">
              From problem to plan.
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {FLOW.map((f) => (
              <div key={f.step} className="bg-surface px-6 py-8">
                <p className="font-mono text-[13px] font-bold tracking-normal text-accent-deep">{f.step}</p>
                <h3 className="mt-3 text-[20px] font-semibold tracking-tight text-ink">{f.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{f.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — An actual decision */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-5xl px-5 py-section sm:px-8 lg:px-10">
          <Reveal>
            <Eyebrow>A decision on the screen</Eyebrow>
            <h2 className="mt-5 max-w-2xl text-title font-semibold tracking-tight text-ink">
              One problem. Six possible paths.
            </h2>
            <p className="mt-4 max-w-2xl text-lead leading-relaxed text-muted">
              Reduce customer escalation handling time.
            </p>
          </Reveal>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr>
                  {["Approach", "Evidence", "Impact", "Verdict"].map((col) => (
                    <th
                      key={col}
                      className="border-b border-line bg-paper px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-muted"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PATHS.map((p) => (
                  <tr key={p.approach} className="transition-colors hover:bg-surface">
                    <td className="border-b border-line px-4 py-3.5 text-[14px] font-semibold text-ink">
                      {p.approach}
                    </td>
                    <td className="border-b border-line px-4 py-3.5 text-[13px] text-ink">{p.evidence}</td>
                    <td className="border-b border-line px-4 py-3.5 text-[13px] text-ink">{p.impact}</td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span className={`inline-block px-2 py-1 text-[11.5px] font-semibold ${verdictTone[p.verdictTone]}`}>
                        {p.verdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 max-w-3xl text-[15px] font-medium leading-relaxed text-ink">
            Compass doesn&apos;t start by assuming AI is the answer. It starts with the problem.
          </p>
        </div>
      </section>

      {/* 4 — Evidence */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-section sm:px-8 lg:px-10">
          <Reveal>
            <Eyebrow>Evidence</Eyebrow>
            <h2 className="mt-5 max-w-2xl text-title font-semibold tracking-tight text-ink">
              Every recommendation has receipts.
            </h2>
          </Reveal>

          <div className="mt-10 space-y-3">
            {EVIDENCE.map((e) => (
              <Reveal key={e.org}>
                <div className="border border-line bg-paper">
                  <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-5">
                    <div>
                      <h3 className="text-[16px] font-semibold tracking-tight text-ink">{e.org}</h3>
                      <p className="mt-0.5 text-[13px] font-medium text-muted">{e.intervention}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <p className="text-[13.5px] font-medium text-ink">{e.result}</p>
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-valid">
                        <span aria-hidden="true">✓</span> Claim verified
                      </span>
                      <Link href="/control-room" className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-accent-deep hover:underline">
                        View evidence <ArrowIcon className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                  <p className="border-t border-line px-6 py-4 text-[13px] leading-relaxed text-muted">{e.source}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-8">
            <Link href="/evidence" className="inline-flex items-center gap-2 text-[14px] font-semibold text-accent-deep hover:underline">
              Explore the evidence library
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </section>

      {/* 5 — Final CTA */}
      <FinalCta />
    </>
  );
}
