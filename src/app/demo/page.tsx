import { SummaryCards } from "@/components/demo/SummaryCards";
import { PriorityDecisions } from "@/components/demo/PriorityDecisions";
import { ActivityFeed } from "@/components/demo/ActivityFeed";
import { CoveragePanel } from "@/components/demo/CoveragePanel";
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

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <ActivityFeed />
        <CoveragePanel />
      </div>

      <OutcomesPanel limit={4} />
    </div>
  );
}
