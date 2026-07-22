"use client";

export default function ResultsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="pt-32 pb-20 px-4 flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-subhead font-semibold text-ink mb-2">Failed to load results</h2>
      <p className="text-sm text-stone mb-6 max-w-md text-center">
        {error.message || "Your Opportunity Map could not be loaded. Please try again."}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center px-5 py-2 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
