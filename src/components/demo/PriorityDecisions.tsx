import Link from "next/link";
import { priorityDecisions } from "@/data/demo-data";
import { DecisionCard } from "./DecisionCard";

export function PriorityDecisions() {
  return (
    <section aria-label="Priority decisions">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-[17px] font-semibold tracking-tight text-ink">Priority decisions</h2>
        <Link href="/demo/decisions" className="text-[12.5px] font-medium text-muted transition-colors hover:text-ink">
          View all decisions →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {priorityDecisions.map((d) => (
          <DecisionCard key={d.id} decision={d} />
        ))}
      </div>
    </section>
  );
}
