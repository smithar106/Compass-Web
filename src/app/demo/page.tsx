import { SummaryCards } from "@/components/demo/SummaryCards";
import { PriorityDecisions } from "@/components/demo/PriorityDecisions";
import { OutcomesPanel } from "@/components/demo/OutcomesPanel";

export default function DemoOverviewPage() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-[22px] font-semibold tracking-tight text-ink sm:text-[24px]">
          Executive overview
        </h1>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
          A live view of the decisions Compass is helping this organization make, implement, and
          measure — from first recommendation to captured outcome.
        </p>
      </header>

      <SummaryCards />

      <PriorityDecisions />

      <OutcomesPanel limit={4} />
    </div>
  );
}
