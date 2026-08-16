import type { Metadata } from "next";
import { ControlRoomShell } from "@/components/control-room/ControlRoomShell";

export const metadata: Metadata = {
  title: "Control Room · Compass",
  description:
    "Know what works before you decide. Compass surfaces the recommendation, the evidence behind it, the implementation plan, and how it performs after approval.",
};

export default function ControlRoomPage() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-5xl px-5 pb-6 pt-16 sm:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-deep">Compass Control Room</p>
        <h1 className="mt-2 text-[32px] font-semibold tracking-tight text-ink sm:text-[38px]">
          Know what works before you decide.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          Five questions, answered in about ten seconds. The depth is one click away.
        </p>
      </div>
      <ControlRoomShell />
    </section>
  );
}
