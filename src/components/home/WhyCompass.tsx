import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";

const COLUMNS = [
  {
    name: "Consulting",
    points: [
      "Expert recommendation",
      "Point-in-time engagement",
      "Knowledge often leaves with the project",
    ],
    muted: true,
  },
  {
    name: "Generic AI",
    points: [
      "Fast answers",
      "Weak evidence discipline",
      "No consistent decision methodology",
    ],
    muted: true,
  },
  {
    name: "Compass",
    points: [
      "Evidence-backed recommendation",
      "Repeatable decision methodology",
      "Implementation + measurement",
      "Institutional memory",
    ],
    featured: true,
  },
];

function Check({ featured }: { featured?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-[7px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
        featured ? "bg-accent text-accent-ink" : "bg-line text-muted"
      }`}
    >
      <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
        <path d="m3 8 3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Cross() {
  return (
    <span
      aria-hidden="true"
      className="mt-[7px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-line text-faint"
    >
      <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
        <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/**
 * Section 5 — Why Compass. Three-column comparison of consulting, generic AI,
 * and Compass, closing on the moat line.
 */
export function WhyCompass() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-section sm:px-8 lg:px-10 lg:py-section">
        <SectionHeader
          eyebrow="Why Compass"
          headline={
            <>
              Implementation is becoming easier.
              <br />
              <span className="text-muted">Choosing what to implement is not.</span>
            </>
          }
          align="center"
        />

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
          {COLUMNS.map((col, i) => (
            <Reveal key={col.name} delay={i * 100} className="h-full">
              <div
                className={`flex h-full flex-col border px-7 py-8 ${
                  col.featured
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-surface"
                }`}
              >
                <p
                  className={`text-[15px] font-bold uppercase tracking-[0.12em] ${
                    col.featured ? "text-accent" : "text-faint"
                  }`}
                >
                  {col.name}
                </p>
                <ul className="mt-6 flex flex-col gap-3.5">
                  {col.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      {col.featured ? <Check featured /> : <Cross />}
                      <p
                        className={`text-[13.5px] leading-relaxed ${
                          col.featured ? "text-paper/90" : "text-muted"
                        }`}
                      >
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={220}>
          <p className="mt-14 text-center font-serif text-[20px] italic leading-relaxed text-ink">
            The moat is memory, not models.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
