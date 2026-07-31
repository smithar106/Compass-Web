import Link from "next/link";
import { marketing } from "@/content/marketing";
import { Eyebrow, ArrowIcon } from "./primitives";
import { Reveal } from "./Reveal";

const PATH_ACCENTS = [
  { ring: "hover:border-ink", tag: "bg-ink text-paper", arrow: "text-accent" },
  { ring: "hover:border-ink", tag: "bg-ink text-paper", arrow: "text-accent" },
  { ring: "hover:border-ink", tag: "bg-ink text-paper", arrow: "text-accent" },
];

export function DecisionEntry() {
  const h = marketing.hero;
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <div
        aria-hidden="true"
        className="grid-backdrop pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_65%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 lg:px-10 lg:pb-20 lg:pt-36">
        <Reveal>
          <Eyebrow number="00">{h.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 max-w-3xl text-hero font-semibold tracking-tight text-ink">{h.heading}</h1>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-5 max-w-2xl font-serif text-[19px] italic leading-relaxed text-accent-deep">
            {h.quote}
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-3 max-w-2xl text-lead leading-relaxed text-muted">{h.sub}</p>
        </Reveal>

        {/* three entry paths */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {h.paths.map((p, i) => {
            const accent = PATH_ACCENTS[i % PATH_ACCENTS.length];
            return (
              <Reveal key={p.id} delay={240 + i * 100} className="h-full">
                <Link
                  href={p.href}
                  className={`group flex h-full flex-col border border-line bg-surface p-6 transition-colors ${accent.ring}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${accent.tag}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="shrink-0 border border-line bg-paper px-2 py-0.5 font-mono text-[10px] text-muted">
                      {p.time}
                    </span>
                  </div>
                  <h2 className="mt-4 text-[17px] font-semibold tracking-tight text-ink">{p.title}</h2>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">{p.lead}</p>
                  <span className="mt-5 inline-flex items-center gap-2 border-t border-line pt-4 text-[13px] font-semibold text-ink transition-colors group-hover:text-accent-deep">
                    {p.cta}
                    <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={320}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12.5px] leading-relaxed text-muted">{h.trustLine}</p>
            <Link
              href="/how-it-works"
              className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-deep transition-colors hover:text-ink"
            >
              {h.secondaryCta}
              <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
