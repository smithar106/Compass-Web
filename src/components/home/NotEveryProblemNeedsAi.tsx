import { controlRoom } from "@/content/marketing";

export function NotEveryProblemNeedsAi() {
  const s = controlRoom.notEveryProblemNeedsAi;
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-[30px]">
          {s.headline}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          {controlRoom.whyThisWins}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {s.options.map((option, i) => (
            <span
              key={option}
              className={
                i === 1 || i === 3
                  ? "border border-accent/50 bg-accent/10 px-4 py-2 text-[13px] font-semibold text-accent-deep"
                  : "border border-line bg-surface px-4 py-2 text-[13px] font-medium text-muted"
              }
            >
              {option}
              {(i === 1 || i === 3) && (
                <span aria-hidden="true" className="ml-1.5 text-accent-deep">
                  ✓
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
