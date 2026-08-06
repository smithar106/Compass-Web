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
        How Compass grounds recommendations in a continuously growing library of real
        implementation evidence.
      </p>
      <div className="mt-8">
        <Workspace view="intelligence" />
      </div>
    </div>
  );
}
