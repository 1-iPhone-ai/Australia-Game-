import { TeamMultiAgentLayerState, TeamMultiAgentPersistenceDecision } from './types.ts';
import { teamMultiAgentPersistSignature } from './layer-persistence.ts';

export interface PersistenceChurnReport {
  churnIndex: number;
  notes: string[];
}

/**
 * Gauge persistence churn from signature deltas and commit-gate outcomes.
 */
export function measurePersistenceChurn(
  previous: TeamMultiAgentLayerState | null,
  evaluated: TeamMultiAgentLayerState,
  decision: TeamMultiAgentPersistenceDecision,
): PersistenceChurnReport {
  const notes: string[] = [];
  const nextSig = teamMultiAgentPersistSignature(evaluated);
  const prevSig = previous ? teamMultiAgentPersistSignature(previous) : null;

  if (prevSig && prevSig !== nextSig) {
    notes.push('Persistence signature changed versus stored layer');
  }
  if (!decision.commit) {
    notes.push(`Persistence blocked: ${decision.reason}`);
  }

  const roleDelta = previous
    ? Math.abs(previous.roles.length - evaluated.roles.length)
    : evaluated.roles.length;
  const signatureChanged = !prevSig || prevSig !== nextSig;
  const blocked = !decision.commit;
  const churnIndex = Math.round(
    Math.min(
      100,
      (signatureChanged ? 35 : 8) + roleDelta * 12 + (blocked ? 55 : 0),
    ),
  );

  return { churnIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPersistenceChurn(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
