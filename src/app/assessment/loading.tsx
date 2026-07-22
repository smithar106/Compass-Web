export default function AssessmentLoading() {
  return (
    <div className="pt-32 pb-20 px-4 flex flex-col items-center justify-center min-h-[50vh]">
      <div className="relative w-10 h-10 mb-4">
        <div className="absolute inset-0 border-2 border-border rounded-full" />
        <div className="absolute inset-0 border-2 border-forest rounded-full border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-stone">Loading assessment...</p>
    </div>
  );
}
