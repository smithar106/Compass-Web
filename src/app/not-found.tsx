import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-display font-bold text-ink">404</h1>
      <p className="mt-4 text-body text-stone">Page not found</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center px-6 py-2.5 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
