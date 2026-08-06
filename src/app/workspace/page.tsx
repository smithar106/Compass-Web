import { Workspace } from "@/components/workspace/Workspace";

export default function WorkspacePage() {
  return (
    <div>
      <header>
        <h1 className="text-[22px] font-semibold tracking-tight text-ink sm:text-[24px]">
          Operational decisions
        </h1>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
          Every decision Compass has helped you make, implement, and measure — with the next action
          required to keep it moving.
        </p>
      </header>
      <div className="mt-8">
        <Workspace />
      </div>
    </div>
  );
}
