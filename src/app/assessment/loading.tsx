export default function AssessmentLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative h-9 w-9">
        <div className="absolute inset-0 rounded-full border-2 border-line" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-accent-deep border-t-transparent" />
      </div>
      <p className="mt-4 text-sm text-muted">Loading assessment...</p>
    </div>
  );
}
