import type { Metadata } from "next";
import { DemoBanner, ExecutiveHeader } from "@/components/demo/ExecutiveHeader";
import { DemoNav } from "@/components/demo/DemoNav";

export const metadata: Metadata = {
  title: "Compass Demo — Executive Overview",
  description:
    "A fully populated demo of the Compass decision portal: priority decisions, implementation intelligence, and measured outcomes. Illustrative data only.",
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <DemoBanner />
      <ExecutiveHeader />
      <DemoNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8 sm:py-10">{children}</main>
      <footer className="border-t border-line bg-surface">
        <p className="mx-auto w-full max-w-6xl px-5 py-5 text-[11.5px] text-faint sm:px-8">
          Compass demo portal — illustrative data for demonstration. No production systems are
          connected, and no demo action writes to customer records.
        </p>
      </footer>
    </div>
  );
}
