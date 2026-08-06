import type { Metadata } from "next";
import { Workspace } from "@/components/workspace/Workspace";

export const metadata: Metadata = {
  title: "Decisions — Compass",
  robots: { index: false, follow: false },
};

export default function WorkspaceDecisionsPage() {
  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-tight text-ink sm:text-[24px]">Decisions</h1>
      <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
        Every decision Compass has helped you make — filter by status, function, or search.
      </p>
      <div className="mt-8">
        <Workspace view="decisions" />
      </div>
    </div>
  );
}
