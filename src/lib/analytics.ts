const SESSION_EVENTS_KEY = "compass-analytics-events";

type EventName =
  | "assessment_started"
  | "assessment_completed"
  | "opportunity_map_generated"
  | "opportunity_viewed"
  | "intervention_comparison_opened"
  | "intervention_selected"
  | "evidence_viewed"
  | "assumption_viewed"
  | "blueprint_generated"
  | "blueprint_viewed"
  | "recommendation_useful"
  | "recommendation_challenged"
  | "demo_completed";

interface AnalyticsEvent {
  name: EventName;
  properties?: Record<string, unknown>;
  timestamp: string;
}

function getStoredEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(SESSION_EVENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function storeEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  try {
    const events = getStoredEvents();
    events.push(event);
    sessionStorage.setItem(SESSION_EVENTS_KEY, JSON.stringify(events));
  } catch {}
}

function sendToPostHog(event: AnalyticsEvent): void {
  try {
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture(event.name, {
        ...event.properties,
        timestamp: event.timestamp,
      });
    }
  } catch {}
}

export function trackEvent(name: EventName, properties?: Record<string, unknown>): void {
  const event: AnalyticsEvent = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  };
  storeEvent(event);
  sendToPostHog(event);
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  return getStoredEvents();
}

export function clearAnalyticsEvents(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_EVENTS_KEY);
  } catch {}
}

export function trackAssessmentStarted(): void {
  trackEvent("assessment_started");
}

export function trackAssessmentCompleted(): void {
  trackEvent("assessment_completed");
}

export function trackOpportunityMapGenerated(): void {
  trackEvent("opportunity_map_generated");
}

export function trackOpportunityViewed(rank: number, name: string): void {
  trackEvent("opportunity_viewed", { rank, name });
}

export function trackInterventionComparisonOpened(opportunityRank: number): void {
  trackEvent("intervention_comparison_opened", { opportunityRank });
}

export function trackInterventionSelected(opportunityRank: number, interventionType: string): void {
  trackEvent("intervention_selected", { opportunityRank, interventionType });
}

export function trackBlueprintGenerated(opportunityRank: number): void {
  trackEvent("blueprint_generated", { opportunityRank });
}

export function trackBlueprintViewed(opportunityRank: number): void {
  trackEvent("blueprint_viewed", { opportunityRank });
}