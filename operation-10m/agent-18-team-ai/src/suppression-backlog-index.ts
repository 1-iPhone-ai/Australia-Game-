import { AGENT18_LIMITS } from './types.ts';

export interface SuppressionBacklogInputs {
  suppressedDirectiveIds: string[];
  droppedDirectiveCount: number;
  quotaExhaustedActorIds: string[];
}

export interface SuppressionBacklogReport {
  backlogIndex: number;
  notes: string[];
}

/**
 * Measure pressure from suppressed and quota-dropped directives versus team caps.
 */
export function computeSuppressionBacklogIndex(
  inputs: SuppressionBacklogInputs,
): SuppressionBacklogReport {
  const notes: string[] = [];
  const uniqueSuppressed = new Set(inputs.suppressedDirectiveIds);
  const suppressedLoad = uniqueSuppressed.size + inputs.droppedDirectiveCount;
  const capRatio = suppressedLoad / Math.max(1, AGENT18_LIMITS.maxSuppressedDirectives);
  const actorPressure = inputs.quotaExhaustedActorIds.length / Math.max(1, AGENT18_LIMITS.maxDirectivesPerActorPerTurn);
  const backlogIndex = Math.round(Math.min(100, capRatio * 65 + actorPressure * 35));

  if (capRatio >= 0.75) {
    notes.push(`Suppressed directive backlog at ${Math.round(capRatio * 100)}% of cap`);
  }
  if (inputs.quotaExhaustedActorIds.length > 0) {
    notes.push(`Quota exhausted for: ${inputs.quotaExhaustedActorIds.join(', ')}`);
  }

  return {
    backlogIndex,
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamSuppressionBacklog(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
