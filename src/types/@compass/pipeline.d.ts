declare module "@compass/pipeline" {
  export function runAssessment(
    input: { sessionId: string; userId: string },
    supabase: any
  ): Promise<any>;
}
