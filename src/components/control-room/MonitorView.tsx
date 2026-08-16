import { SectionHeading } from "./ControlRoomShell";

const METRICS = [
  { label: "Cost per ticket", target: "-35%", actual: "-28%", status: "ahead" },
  { label: "Tier-1 resolution rate", target: "70%", actual: "66%", status: "tracking" },
  { label: "Payback", target: "8 mo", actual: "—", status: "pending" },
  { label: "Service quality (CSAT)", target: "hold", actual: "+1pt", status: "ahead" },
];

export function MonitorView() {
  return (
    <div>
      <SectionHeading
        kicker="Monitor"
        title="Actual vs expected outcomes"
        sub="Compass tracks whether the decision delivered and flags when to reconsider."
      />

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr>
              {["Metric", "Target", "Actual", "Status"].map((h) => (
                <th
                  key={h}
                  className="border-b border-line bg-paper px-4 py-2.5 text-left text-[10.5px] font-bold uppercase tracking-wide text-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {METRICS.map((m) => (
              <tr key={m.label}>
                <td className="border-b border-line px-4 py-3.5 text-[14px] font-semibold text-ink">{m.label}</td>
                <td className="border-b border-line px-4 py-3.5 text-[13px] text-ink">{m.target}</td>
                <td className="border-b border-line px-4 py-3.5 text-[13px] text-ink">{m.actual}</td>
                <td className="border-b border-line px-4 py-3.5">
                  <span
                    className={
                      m.status === "ahead"
                        ? "text-[12px] font-semibold text-valid"
                        : m.status === "tracking"
                          ? "text-[12px] font-semibold text-amber"
                          : "text-[12px] font-semibold text-muted"
                    }
                  >
                    {m.status === "ahead" ? "✓ on track" : m.status === "tracking" ? "tracking" : "pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 border border-line bg-surface p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Compass review point</p>
        <p className="mt-2 text-[14px] leading-relaxed text-ink">
          If cost-per-ticket remains below target at month 6, Compass will recommend re-evaluating the
          escalation model or switching vendors — before the decision becomes stranded capital.
        </p>
      </div>
    </div>
  );
}
