declare module "@compass/pipeline" {
  export function runAssessment(
    params: { sessionId: string; userId: string },
    supabase: any
  ): Promise<import("./types").OpportunityMap>;

  export function generateBlueprint(opportunity: any): import("./types").ImplementationBlueprint;

  export function compareInterventions(
    opportunity: any
  ): import("./types").InterventionRecommendation & { alternatives: import("./types").ComparedPath[] };

  export const sampleOpportunityMap: import("./types").OpportunityMap;
}
