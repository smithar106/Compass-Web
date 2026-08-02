import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function ConsultingRebuilt() {
  const c = marketing.consultingRebuilt;
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <SectionHeader
          eyebrow={c.label}
          number={c.number}
          headline={c.headline}
          subtitle={c.supporting}
        />

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {c.columns.map((col, i) => {
            const isCompass = col.highlighted;
            return (
              <Reveal key={col.name} delay={i * 100} className="h-full">
                <div
                  className={cn(
                    "flex h-full flex-col border p-6",
                    isCompass ? "border-accent/50 bg-ink shadow-panel-lg" : "border-line bg-surface"
                  )}
                >
                  <h3
                    className={cn(
                      "text-[16px] font-semibold tracking-tight",
                      isCompass ? "text-paper" : "text-ink"
                    )}
                  >
                    {col.name}
                  </h3>
                  <ul className="mt-5 flex-1 space-y-3">
                    {col.items.map((item) => (
                      <li
                        key={item}
                        className={cn(
                          "flex items-start gap-2.5 text-[13px] leading-snug",
                          isCompass ? "text-paper/80" : "text-muted"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "mt-[7px] h-1 w-1 shrink-0 rounded-full",
                            isCompass ? "bg-accent" : "bg-lineDark"
                          )}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {isCompass && (
                    <p className="mt-6 border-t border-lineDark pt-5 font-serif text-[15px] italic leading-relaxed text-accent">
                      {c.prominent}
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
