import type { Metadata } from "next";
import { Workspace } from "@/components/workspace/Workspace";

export const metadata: Metadata = {
  title: "Implementation Intelligence — Compass",
  robots: { index: false, follow: false },
};

export default function WorkspaceIntelligencePage() {
  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-tight text-ink sm:text-[24px]">
        Implementation Intelligence
      </h1>
      <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
        How the evidence library grounds each of your decisions — and how every measured outcome
        sharpens the next recommendation.
      </p>
      <div className="mt-8">
        <Workspace view="intelligence" />
      </div>
    </div>
  );
}
