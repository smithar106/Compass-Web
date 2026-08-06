import type { Metadata } from "next";
import Link from "next/link";
import { Needle } from "@/components/home/primitives";

export const metadata: Metadata = {
  title: "Assessment — Compass",
  description:
    "Answer five quick questions and get an executive-ready recommendation on the right operational intervention.",
  robots: { index: false, follow: false },
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex h-14 w-full max-w-xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2" aria-label="Compass home">
            <Needle className="h-5 w-5 text-ink" />
            <span className="text-[15px] font-bold tracking-tight text-ink">Compass</span>
          </Link>
          <span className="text-[10.5px] font-bold uppercase tracking-eyebrow text-muted">
            Assessment
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
