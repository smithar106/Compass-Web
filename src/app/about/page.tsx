import { about, marketing } from "@/content/marketing";
import { PageHeader } from "@/components/home/PageHeader";
import { Trust } from "@/components/home/Trust";
import { FinalCta } from "@/components/home/FinalCta";
import { Reveal } from "@/components/home/Reveal";

const PRINCIPLE_COLORS = [
  "bg-accent text-accent-ink",
  "bg-line text-ink",
  "bg-line text-ink",
  "bg-accent text-accent-ink",
];

export default function AboutPage() {
  const founder = marketing.founder;

  return (
    <>
      <PageHeader
        eyebrow="About"
        title={about.headline}
        subtitle={about.thesis}
      />

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
            <Reveal>
              <div className="max-w-2xl">
                {about.body.map((p) => (
                  <p key={p.slice(0, 24)} className="mb-5 text-lead leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="border border-line bg-surface p-7 lg:sticky lg:top-28">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-ink font-serif text-lg italic text-accent"
                  >
                    AS
                  </span>
                  <div>
                    <p className="text-[16px] font-semibold text-ink">{founder.name}</p>
                    <p className="text-[12.5px] text-muted">{founder.role}</p>
                  </div>
                </div>
                <p className="mt-5 border-t border-line pt-5 font-serif text-[15px] italic leading-relaxed text-ink">
                  {founder.headline}
                </p>
                <p className="mt-4 text-[13.5px] leading-relaxed text-muted">{founder.bio}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <Reveal>
            <h2 className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
              {about.principles.headline}
            </h2>
            <p className="mt-3 max-w-2xl text-lead leading-relaxed text-muted">
              {about.principles.subtitle}
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {about.principles.items.map((p, i) => (
              <Reveal key={p.title} delay={i * 70} className="h-full">
                <div className="flex h-full items-start gap-4 border border-line bg-surface p-6">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center text-[14px] font-bold ${PRINCIPLE_COLORS[i % PRINCIPLE_COLORS.length]}`}>
                    {p.title[0]}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-ink">{p.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">{p.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Trust />
      <FinalCta />
    </>
  );
}
