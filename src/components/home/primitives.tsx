import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/** Small-caps section label with a hairline rule and optional number. */
export function Eyebrow({
  children,
  number,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  number?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[11px] font-semibold uppercase tracking-eyebrow",
        tone === "dark" ? "text-accent" : "text-accent-deep",
        className
      )}
    >
      {number && (
        <span
          className={cn(
            "font-mono text-[10px] font-bold tracking-normal",
            tone === "dark" ? "text-faint" : "text-faint"
          )}
        >
          {number}
        </span>
      )}
      <span
        aria-hidden="true"
        className={cn("h-px w-8", tone === "dark" ? "bg-accent/40" : "bg-accent-deep/40")}
      />
      {children}
    </p>
  );
}

/** Standard section header: eyebrow, headline, optional supporting copy. */
export function SectionHeader({
  eyebrow,
  number,
  headline,
  subtitle,
  tone = "light",
  align = "left",
  className,
  eyebrowClassName,
}: {
  eyebrow: string;
  number?: string;
  headline: React.ReactNode;
  subtitle?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
  eyebrowClassName?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <Eyebrow
        number={number}
        tone={tone}
        className={cn(align === "center" && "justify-center", eyebrowClassName)}
      >
        {eyebrow}
      </Eyebrow>
      <h2
        className={cn(
          "mt-5 text-title font-semibold tracking-tight",
          tone === "dark" ? "text-paper" : "text-ink"
        )}
      >
        {headline}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-lead leading-relaxed",
            tone === "dark" ? "text-paper/70" : "text-muted"
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

/** Confident arrow used on buttons and links. */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 8h11M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Compass needle mark used in the wordmark and section markers. */
export function Needle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M15.6 8.4 13.9 13.9 8.4 15.6 10.1 10.1z" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
