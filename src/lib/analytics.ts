import posthog from "posthog-js";

export function initAnalytics(): void {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_POSTHOG_KEY &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST
  ) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      loaded: (ph) => {
        if (process.env.NODE_ENV !== "production") ph.opt_out_capturing();
      },
    });
  }
}

export function trackEvent(event: string, properties?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture(event, properties);
  }
}
