import { demoSummary } from "@/data/demo-data";

const CARDS = [
  { key: "underReview", label: "Decisions under review", value: demoSummary.underReview, hint: "Awaiting executive decision" },
  { key: "approvedPilots", label: "Approved pilots", value: demoSummary.approvedPilots, hint: "Bounded, measurable pilots" },
  { key: "activeImplementations", label: "Active implementations", value: demoSummary.activeImplementations, hint: "In progress with baselines" },
  { key: "completedMeasured", label: "Completed · measured", value: demoSummary.completedMeasured, hint: "Outcomes captured" },
] as const;

export function SummaryCards() {
  return (
    <section aria-label="Decision summary">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => (
          <div key={c.key} className="border border-line bg-surface px-5 py-5">
            <p className="text-[34px] font-extrabold leading-none tracking-tight text-ink">{c.value}</p>
            <p className="mt-2.5 text-[13.5px] font-semibold text-ink">{c.label}</p>
            <p className="mt-1 text-[12px] leading-snug text-muted">{c.hint}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
