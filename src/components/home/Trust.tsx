import { site } from "@/content/site";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

export function Trust() {
  const t = site.marketing.trust;
  return (
    <section className="border-b border-lineDark bg-paper-dark">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader
              eyebrow={t.label}
              number={t.number}
              tone="dark"
              headline={t.headline}
              subtitle={t.subtitle}
            />
          </div>

          <div>
            <ul className="grid grid-cols-1 gap-px overflow-hidden border border-lineDark bg-lineDark sm:grid-cols-2">
              {t.principles.map((p, i) => (
                <li key={p.title} className="bg-paper-dark">
                  <Reveal delay={i * 70} className="h-full">
                    <div className="flex h-full gap-4 px-6 py-6">
                      <span
                        aria-hidden="true"
                        className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink"
                      >
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <div>
                        <h3 className="text-[14.5px] font-semibold text-paper">{p.title}</h3>
                        <p className="mt-1 text-[12.5px] leading-relaxed text-paper/60">{p.body}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
