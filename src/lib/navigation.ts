/**
 * Single source of truth for navigation.
 *
 * Public navigation belongs on public-site pages; application navigation
 * belongs in the workspace shell; the assessment uses minimal navigation.
 * Items whose routes do not exist are intentionally omitted (no dead links):
 * "Sign In" has no /sign-in route yet, and "Settings" has no settings route.
 */

export interface NavItem {
  label: string;
  href: string;
}

export const PUBLIC_NAV: NavItem[] = [
  { label: "Control Room", href: "/control-room" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Evidence", href: "/evidence" },
  { label: "Product", href: "/product" },
];

export const PUBLIC_NAV_CTA: NavItem = {
  label: "Start Assessment",
  href: "/assessment",
};

export const APP_NAV: NavItem[] = [
  { label: "Workspace", href: "/workspace" },
  { label: "Decisions", href: "/workspace/decisions" },
  { label: "Coverage", href: "/workspace/coverage" },
  { label: "Evidence Library", href: "/workspace/intelligence" },
];

export const APP_NAV_CTA: NavItem = {
  label: "New Decision",
  href: "/assessment",
};

/**
 * Every route that actually exists in the app, used by tests to prove that
 * rendered navigation links have no dead ends. Dynamic routes are represented
 * by their path prefixes (e.g. /decisions/ and /workspace/decisions/).
 */
export const VALID_ROUTES = [
  "/",
  "/about",
  "/assessment",
  "/control-room",
  "/demo",
  "/demo/assessment",
  "/demo/decisions",
  "/demo/decisions/",
  "/demo/intelligence",
  "/demo/outcomes",
  "/decisions/",
  "/design-partners",
  "/evidence",
  "/how-it-works",
  "/implementations/",
  "/privacy",
  "/product",
  "/terms",
  "/workspace",
  "/workspace/decisions",
  "/workspace/coverage",
  "/workspace/intelligence",
] as const;

export function isValidRoute(href: string): boolean {
  if (!href.startsWith("/")) return false;
  // Exact match or a dynamic-route prefix.
  return (VALID_ROUTES as readonly string[]).some(
    (r) => href === r || (r.endsWith("/") && href.startsWith(r))
  );
}
