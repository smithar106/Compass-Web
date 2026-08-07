import { implementationStories, type ImplementationStory } from "@/data/implementation-reality";
import { Reveal } from "@/components/home/Reveal";
import { SectionHeader } from "@/components/home/primitives";

function StoryCard({ story, index }: { story: ImplementationStory; index: number }) {
  return (
    <Reveal delay={index * 120}>
      <article className="group flex flex-col border-t border-line py-8 first:border-t-0 sm:flex-row sm:gap-10 sm:py-10">
        {/* Publication + date masthead */}
        <div className="mb-4 shrink-0 sm:mb-0 sm:w-[160px]">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            {story.publication}
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.10em] text-faint">
            {story.date}
          </p>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-colors"
          >
            <h3 className="font-serif text-[clamp(1.25rem,2.2vw,1.6rem)] font-medium leading-[1.18] tracking-[-0.01em] text-ink transition-colors group-hover:text-accent-deep">
              {story.headline}
              <span aria-hidden="true" className="ml-1.5 inline-block text-[0.7em] text-faint transition-colors group-hover:text-accent-deep">
                ↗
              </span>
            </h3>
          </a>
          <p className="mt-3 max-w-[58ch] text-[14px] leading-[1.6] text-muted">
            {story.takeaway}
          </p>
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-deep transition-colors hover:text-ink"
          >
            Read original
            <span aria-hidden="true" className="text-[11px]">→</span>
          </a>
        </div>
      </article>
    </Reveal>
  );
}

export function ImplementationReality() {
  const stories = implementationStories();

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-4xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader
          eyebrow="The reality on the ground"
          headline="AI implementation is having a reality check."
        />

        <p className="mx-auto mt-5 max-w-2xl text-center text-[15px] leading-[1.65] text-muted">
          Powerful models have made implementation easier than ever. But companies are discovering that
          access to AI does not guarantee business value. Choosing the right problem, intervention, and
          path to value remains the harder decision.
        </p>

        <div className="mx-auto mt-14 max-w-3xl">
          {stories.map((story, i) => (
            <StoryCard key={story.url} story={story} index={i} />
          ))}
        </div>

        {/* Transition into Compass */}
        <Reveal>
          <div className="mx-auto mt-14 max-w-2xl border-t border-line pt-10 text-center">
            <p className="font-serif text-[clamp(1.25rem,2vw,1.6rem)] italic leading-snug text-ink">
              The problem isn&rsquo;t access to AI.
            </p>
            <p className="mt-4 text-[15px] leading-[1.65] text-muted">
              It&rsquo;s knowing where AI belongs, what approach will actually work, and whether the
              economics justify implementation.
            </p>
            <p className="mt-6">
              <a
                href="#why-compass"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-deep transition-colors hover:text-ink"
              >
                See how Compass makes the decision
                <span aria-hidden="true">→</span>
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
