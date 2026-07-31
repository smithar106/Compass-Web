"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { marketing } from "@/content/marketing";
import { Eyebrow, ArrowIcon } from "./primitives";
import { Reveal } from "./Reveal";

export function DecisionEntry() {
  const h = marketing.hero;
  const router = useRouter();
  const [text, setText] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const analyze = () => {
    if (analyzing) return;
    setAnalyzing(true);
    const query = new URLSearchParams();
    if (text.trim()) query.set("problem", text.trim());
    const qs = query.toString();
    setTimeout(() => router.push(`/assessment${qs ? `?${qs}` : ""}`), 900);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setText(String(reader.result ?? "").slice(0, 4000));
      setHint(`Uploaded ${file.name}`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const focusWith = (label: string) => {
    setHint(label);
    textareaRef.current?.focus();
  };

  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <div
        aria-hidden="true"
        className="grid-backdrop pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_65%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 lg:px-10 lg:pb-20 lg:pt-36">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow number="00">{h.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 text-hero font-semibold tracking-tight text-ink">{h.claim}</h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-2xl text-lead leading-relaxed text-muted">{h.subtitle}</p>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <div className="mt-10 overflow-hidden border border-line bg-surface shadow-panel-lg">
            {/* console bar */}
            <div className="flex items-center justify-between gap-3 border-b border-line bg-ink px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/80">
                  Compass // decision environment
                </span>
              </div>
              <span className="hidden font-mono text-[10px] text-paper/40 sm:block">
                {analyzing ? "analyzing…" : text.length > 0 ? `${text.length} chars` : "ready"}
              </span>
            </div>

            <div className="grid grid-cols-1 divide-y divide-line lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              {/* Path A — I know my problem */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-[17px] font-semibold tracking-tight text-ink">{h.pathA.title}</h2>
                  <span className="shrink-0 border border-line bg-paper px-2 py-0.5 font-mono text-[10px] text-muted">
                    {h.pathA.time}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{h.pathA.lead}</p>

                <label htmlFor="challenge-input" className="mt-4 block text-[11px] font-semibold uppercase tracking-eyebrow text-accent-deep">
                  {h.inputLabel}
                </label>
                <textarea
                  ref={textareaRef}
                  id="challenge-input"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") analyze();
                  }}
                  placeholder={h.inputPlaceholder}
                  className="mt-2 w-full resize-y border border-line bg-paper/40 px-4 py-3 font-mono text-[13.5px] leading-relaxed text-ink placeholder:text-faint focus:border-ink focus:outline-none focus:ring-2 focus:ring-accent-deep/20"
                />
                <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] text-faint">
                  <span>{hint ?? "You can also paste a process, a policy, or an uploaded workflow."}</span>
                  <span className="hidden sm:inline">Ctrl/⌘ + Enter</span>
                </div>

                {/* examples */}
                <div className="mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-faint">{h.examplesLabel}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {h.examples.map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => {
                          setText(ex);
                          setHint(null);
                        }}
                        className="border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                {/* paste / upload / analyze */}
                <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {h.pasteOptions.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => focusWith(label)}
                        className="text-[12px] font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                      >
                        {label}
                      </button>
                    ))}
                    <span aria-hidden="true" className="hidden h-4 w-px bg-line sm:block" />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M8 10.5v-8M4.5 5 8 1.5 11.5 5M2.5 10.5v3a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {h.uploadLabel}
                    </button>
                    <span className="font-mono text-[10px] text-faint">{h.uploadHint}</span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".txt,.md,.csv,.tsv,.log,.json"
                      onChange={onFile}
                      className="hidden"
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={analyze}
                    disabled={analyzing}
                    className="group inline-flex shrink-0 items-center justify-center gap-2 bg-ink px-7 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2 disabled:opacity-70"
                  >
                    {analyzing ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-paper/30 border-t-paper" aria-hidden="true" />
                        Analyzing…
                      </>
                    ) : (
                      <>
                        {h.analyzeCta}
                        <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Path B — I'm not sure what's wrong */}
              <div className="flex flex-col bg-paper/40 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-[17px] font-semibold tracking-tight text-ink">{h.pathB.title}</h2>
                  <span className="shrink-0 border border-line bg-surface px-2 py-0.5 font-mono text-[10px] text-muted">
                    {h.pathB.time}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{h.pathB.lead}</p>

                <div className="mt-4 space-y-2">
                  {["Current workflow", "Pain points", "Goals", "Existing systems", "Constraints"].map((s) => (
                    <div key={s} className="flex items-center gap-2.5 text-[12.5px] text-muted">
                      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent-deep" />
                      {s}
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <Link
                    href="/assessment"
                    className="group inline-flex w-full items-center justify-center gap-2 border border-ink bg-surface px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    {h.pathB.cta}
                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <p className="mt-2.5 text-center text-[10.5px] text-faint">
                    Generates a problem list first, then recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12.5px] leading-relaxed text-muted">{h.trustLine}</p>
            <Link
              href="/how-it-works"
              className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-deep transition-colors hover:text-ink"
            >
              {h.secondaryCta}
              <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
