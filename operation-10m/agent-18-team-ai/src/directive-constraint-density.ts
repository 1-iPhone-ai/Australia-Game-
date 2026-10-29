export interface DirectiveConstraintDensityReport {
  densityIndex: number;
  constrainedActorIds: string[];
  notes: string[];
}

/**
 * Measure how many actors carry active directive coordination constraints.
 */
export function computeDirectiveConstraintDensity(
  constraintsByActor: Record<string, string>,
): DirectiveConstraintDensityReport {
  const notes: string[] = [];
  const constrainedActorIds = Object.entries(constraintsByActor)
    .filter(([, value]) => value.trim().length > 0)
    .map(([actorId]) => actorId);

  if (constrainedActorIds.length > 0) {
    notes.push(`Directive constraints on: ${constrainedActorIds.join(', ')}`);
  }

  const densityIndex = Math.round(Math.min(100, constrainedActorIds.length * 18 + 8));

  return {
    densityIndex,
    constrainedActorIds: constrainedActorIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamDirectiveConstraintDensity(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
