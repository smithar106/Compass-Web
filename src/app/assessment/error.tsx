"use client";

export default function AssessmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-title font-semibold tracking-tight text-ink">Something went wrong</h2>
      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted">
        {error.message || "The assessment could not be loaded. Please try again."}
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2"
      >
        Try again
      </button>
    </div>
  );
}
