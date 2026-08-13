import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function Differentiation() {
  const d = marketing.differentiation;
  return (
    <section className="border-b border-lineDark bg-paper-dark">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <SectionHeader
          eyebrow="What Compass does differently"
          number="04"
          tone="dark"
          headline="From searching and thinking to a defensible decision."
          subtitle="How Compass compares with traditional information retrieval, generative AI, and human consulting."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* SEARCH */}
          <Reveal delay={0} className="h-full">
            <div className="flex h-full flex-col border border-lineDark bg-paper-dark/40 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-paper/40">Search</p>
              <h3 className="mt-2 text-[18px] font-semibold tracking-tight text-paper/90">Finds information.</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-paper/70">
                Returns articles, vendors, case studies, and research.
              </p>
              <div className="mt-auto pt-6 border-t border-lineDark">
                <p className="text-[13px] font-medium text-paper/90">You still make the decision.</p>
              </div>
            </div>
          </Reveal>

          {/* GENERAL AI */}
          <Reveal delay={80} className="h-full">
            <div className="flex h-full flex-col border border-lineDark bg-paper-dark/40 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-paper/40">General AI</p>
              <h3 className="mt-2 text-[18px] font-semibold tracking-tight text-paper/90">Helps you think.</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-paper/70">
                Generates ideas, summarizes information, and proposes possible approaches.
              </p>
              <div className="mt-auto pt-6 border-t border-lineDark">
                <p className="text-[13px] font-medium text-paper/90">You still determine what to trust and implement.</p>
              </div>
            </div>
          </Reveal>

          {/* CONSULTING */}
          <Reveal delay={160} className="h-full">
            <div className="flex h-full flex-col border border-lineDark bg-paper-dark/40 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-paper/40">Consulting</p>
              <h3 className="mt-2 text-[18px] font-semibold tracking-tight text-paper/90">Provides human analysis.</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-paper/70">
                Experts research the problem and develop a recommendation through an engagement.
              </p>
              <div className="mt-auto pt-6 border-t border-lineDark">
                <p className="text-[13px] font-medium text-paper/90">High-quality judgment, but constrained by engagement time, cost, and team evidence.</p>
              </div>
            </div>
          </Reveal>

          {/* COMPASS */}
          <Reveal delay={240} className="h-full">
            <div className="flex h-full flex-col border border-accent/60 bg-ink p-6 relative overflow-hidden">
              <div aria-hidden="true" className="absolute left-0 top-0 h-1 w-full bg-accent" />
              <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">Compass</p>
              <h3 className="mt-2 text-[18px] font-semibold tracking-tight text-paper">Produces a decision.</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-paper/80">
                Compares interventions against your operating context, economics, and relevant implementation evidence.
              </p>
              <div className="mt-auto pt-6 border-t border-lineDark">
                <p className="text-[13px] font-semibold text-accent">You get what to do, why it beats the alternatives, and how to proceed.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
