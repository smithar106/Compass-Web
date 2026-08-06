import type { Metadata } from "next";
import { Workspace } from "@/components/workspace/Workspace";

export const metadata: Metadata = {
  title: "Coverage — Compass",
  robots: { index: false, follow: false },
};

export default function WorkspaceCoveragePage() {
  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-tight text-ink sm:text-[24px]">Coverage</h1>
      <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
        Executive-level view of where Compass can ground a recommendation in comparable
        implementations today.
      </p>
      <div className="mt-8">
        <Workspace view="coverage" />
      </div>
    </div>
  );
}
