import { demoActivity } from "@/data/demo-data";

const TYPE_LABELS = {
  recommendation_submitted: "Recommendation submitted",
  pilot_approved: "Pilot approved",
  baseline_completed: "Baseline completed",
  measured_outcome: "Measured outcome added",
  partner_assigned: "Implementation partner assigned",
} as const;

const TYPE_DOTS = {
  recommendation_submitted: "bg-brand-blue",
  pilot_approved: "bg-ok",
  baseline_completed: "bg-accent-deep",
  measured_outcome: "bg-warn",
  partner_assigned: "bg-[#762ee8]",
} as const;

export function ActivityFeed() {
  return (
    <section aria-label="Recent activity">
      <h2 className="mb-4 text-[17px] font-semibold tracking-tight text-ink">Recent activity</h2>
      <ol className="border border-line bg-surface">
        {demoActivity.map((a) => (
          <li
            key={a.id}
            className="flex items-start gap-3.5 border-b border-line px-5 py-4 last:border-b-0"
          >
            <span
              aria-hidden="true"
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TYPE_DOTS[a.type]}`}
            />
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                {TYPE_LABELS[a.type]}
              </p>
              <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink">{a.text}</p>
              <p className="mt-1 text-[11.5px] text-faint">
                {a.actor} · {a.time}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
