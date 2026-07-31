import { marketing } from "@/content/marketing";
import { Eyebrow } from "./primitives";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function Category() {
  const c = marketing.category;
  const q = c.question;
  const model = c.model;

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <Reveal>
          <Eyebrow number={c.number}>{c.label}</Eyebrow>
        </Reveal>

        {/* the missing system */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal delay={80}>
              <h2 className="text-title font-semibold tracking-tight text-ink">{c.headline}</h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-6 max-w-xl text-lead leading-relaxed text-muted">{c.consequence}</p>
              <p className="mt-4 text-lead font-semibold text-accent-deep">{c.resolve}</p>
            </Reveal>
          </div>

          {/* the question */}
          <Reveal delay={120}>
            <div className="border border-line bg-surface">
              <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-faint">
                    {q.mostLabel}
                  </p>
                  <p className="mt-4 text-[20px] font-semibold leading-snug tracking-tight text-faint line-through decoration-line">
                    &ldquo;{q.mostQuestion}&rdquo;
                  </p>
                </div>
                <div className="bg-paper p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                    {q.compassLabel}
                  </p>
                  <p className="mt-4 font-serif text-[19px] italic leading-snug tracking-tight text-ink">
                    &ldquo;{q.compassQuestion}&rdquo;
                  </p>
                </div>
              </div>
              <div className="border-t border-line px-6 py-4">
                <p className="text-[13px] leading-relaxed text-muted">{q.body}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* the belief */}
        <Reveal delay={140}>
          <div className="mt-10 border-t border-line pt-10">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-faint">
              {c.beliefLead}
            </p>
            <ul className="mt-5 max-w-4xl space-y-3">
              {c.belief.map((line, i) => (
                <li
                  key={line}
                  className={cn(
                    "text-section font-semibold leading-tight tracking-tight",
                    i === c.belief.length - 1 ? "text-accent-deep" : "text-ink"
                  )}
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* the decision process model */}
        <Reveal delay={160}>
          <div className="mt-10 border border-line bg-paper/50 p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
              {model.label}
            </p>
            <DecisionModel steps={model.steps} />
            <p className="mt-6 font-serif text-[14px] italic text-muted">{model.closing}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DecisionModel({ steps }: { steps: string[] }) {
  return (
    <div className="mt-5">
      {/* desktop: horizontal flow */}
      <ol className="hidden items-stretch md:flex">
        {steps.map((step, i) => {
          const isFinal = i === steps.length - 1;
          return (
            <li key={step} className="flex flex-1 items-center">
              <div
                className={cn(
                  "flex flex-1 flex-col items-center gap-2 border px-3 py-4 text-center",
                  isFinal ? "border-ink bg-ink" : "border-line bg-surface"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[10px] font-bold",
                    isFinal ? "text-accent" : "text-faint"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "text-[13px] font-semibold leading-snug",
                    isFinal ? "text-paper" : "text-ink"
                  )}
                >
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="mx-1.5 flex h-8 items-center text-faint">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {/* mobile: vertical flow */}
      <ol className="md:hidden">
        {steps.map((step, i) => {
          const isFinal = i === steps.length - 1;
          return (
            <li key={step}>
              <div
                className={cn(
                  "flex items-center gap-3 border px-4 py-3",
                  isFinal ? "border-ink bg-ink" : "border-line bg-surface"
                )}
              >
                <span className={cn("font-mono text-[10px] font-bold", isFinal ? "text-accent" : "text-faint")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={cn("text-[14px] font-semibold", isFinal ? "text-paper" : "text-ink")}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center py-1" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-faint">
                    <path d="M8 2v11M3.5 9 8 13.5 12.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
