import { cn } from "@/lib/utils";

export function VisualShell({
  title,
  meta,
  footnote,
  children,
  className,
}: {
  title: string;
  meta?: string;
  footnote?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-white shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-paper/60 px-4 py-2.5">
        <span className="text-[11px] font-semibold tracking-wide text-ink">{title}</span>
        {meta && <span className="font-mono text-[10px] text-faint">{meta}</span>}
      </div>
      <div className={cn("p-4 sm:p-5", className)}>{children}</div>
      {footnote && (
        <div className="border-t border-line bg-paper px-4 py-2.5">
          <span className="text-[10px] leading-relaxed text-faint">{footnote}</span>
        </div>
      )}
    </div>
  );
}

export function ULabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-[9.5px] font-semibold uppercase tracking-[0.11em] text-faint",
        className
      )}
    >
      {children}
    </p>
  );
}

export function StatusTag({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "recommended" | "ok" | "warn" | "muted" | "accent";
}) {
  const styles: Record<string, string> = {
    recommended: "bg-ink text-accent",
    ok: "bg-ok text-white",
    warn: "bg-warn text-white",
    muted: "bg-line text-muted",
    accent: "bg-accent text-accent-ink",
  };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
        styles[tone]
      )}
    >
      {children}
    </span>
  );
}

export function Meter({
  value,
  className,
  tone = "default",
  delay = 0,
}: {
  value: number;
  className?: string;
  tone?: "default" | "accent";
  delay?: number;
}) {
  return (
    <div className={cn("h-1 w-full overflow-hidden rounded-full bg-line", className)}>
      <div
        className={cn(
          "h-full rounded-full",
          tone === "accent" ? "bg-accent-deep" : "bg-ink/70"
        )}
        style={{
          width: `${Math.round(value * 100)}%`,
          transition: "width 0.9s cubic-bezier(0.22,1,0.36,1)",
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  );
}
