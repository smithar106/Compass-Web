import { marketing } from "@/content/marketing";
import { Eyebrow } from "./primitives";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function Stack() {
  const s = marketing.stack;
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* copy */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Eyebrow number={s.number}>{s.label}</Eyebrow>
              <h2 className="mt-5 text-title font-semibold tracking-tight text-ink">
                {s.headline}
              </h2>
              <p className="mt-5 font-serif text-xl italic leading-relaxed text-ink/80">
                {s.closing}
              </p>
              <p className="mt-5 max-w-lg text-lead leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          </div>

          {/* stack visual */}
          <Reveal delay={120}>
            <div className="relative">
              <div className="space-y-0">
                {s.layers.map((layer, i) => (
                  <div key={layer.name}>
                    <div
                      className={cn(
                        "border px-5 py-6",
                        layer.compass
                          ? "border-ink bg-ink"
                          : "border-line bg-surface"
                      )}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-baseline gap-3">
                          <span
                            className={cn(
                              "font-mono text-[10px] font-bold uppercase tracking-widest",
                              layer.compass ? "text-accent" : "text-faint"
                            )}
                          >
                            {layer.name}
                          </span>
                          <span
                            className={cn(
                              "text-[13px] font-semibold",
                              layer.compass ? "text-paper" : "text-ink"
                            )}
                          >
                            {layer.role}
                          </span>
                        </div>
                        {layer.compass && (
                          <span className="bg-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-ink">
                            Compass
                          </span>
                        )}
                        {!layer.compass && (
                          <span
                            className={cn(
                              "text-[11px] font-medium",
                              layer.compass ? "text-paper/60" : "text-muted"
                            )}
                          >
                            {layer.by}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {layer.items.map((item) => (
                          <span
                            key={item}
                            className={cn(
                              "px-2.5 py-1 text-[11px] font-medium",
                              layer.compass
                                ? "border border-accent/30 bg-accent/10 text-accent"
                                : "border border-line bg-paper text-muted"
                            )}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {i < s.layers.length - 1 && (
                      <div className="flex items-center justify-center py-1.5" aria-hidden="true">
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                          <path d="M9 1v15M4 12l5 6 5-6" stroke="currentColor" strokeWidth="1.25" className="text-faint" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* monitoring & learning loop note */}
              <div className="mt-5 flex items-start gap-3 border border-dashed border-line bg-paper px-5 py-4">
                <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-deep" />
                <p className="text-[13px] leading-relaxed text-muted">
                  Compass also closes the loop after execution: it monitors whether the intervention
                  is working and feeds verified results back into the next decision.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
