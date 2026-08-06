import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

export function ImplementationIntelligence() {
  const i = marketing.home.intelligence;

  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <div
        aria-hidden="true"
        className="grid-backdrop pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader eyebrow={i.eyebrow} headline={i.headline} subtitle={i.supporting} align="center" />

        <ul className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
          {i.points.map((point, idx) => (
            <Reveal key={point} delay={80 + idx * 90} className="h-full">
              <li className="flex h-full items-start gap-3.5 border border-line bg-surface px-6 py-6">
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-deep"
                />
                <p className="text-[14px] leading-relaxed text-ink">{point}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
