import { serializeCoordinationPlan } from './coordination-orchestrator.ts';
import { AGENT18_LIMITS, TeamMultiAgentLayerState, TeamMultiAgentPersistenceDecision } from './types.ts';

export function teamMultiAgentPersistSignature(state: TeamMultiAgentLayerState): string {
  return (
    serializeCoordinationPlan(state.coordination) +
    '::' +
    state.roles.map(r => [r.actorId, r.primaryRole, r.exclusiveSlotId].join(':')).join(',') +
    '::' +
    JSON.stringify(state.meta.auditSummary)
  );
}

/**
 * Loop-safe persistence gate (mirrors Team OS commit throttling).
 * Identical signatures skip; cap automatic commits per turn.
 */
export function decideTeamMultiAgentPersistence(
  stored: TeamMultiAgentLayerState | null | undefined,
  evaluated: TeamMultiAgentLayerState,
  lastCommittedSignature: string | null,
  commitsThisTurn: number,
  maxCommitsPerTurn: number = AGENT18_LIMITS.maxCommitsPerTurn,
): TeamMultiAgentPersistenceDecision {
  const signature = teamMultiAgentPersistSignature(evaluated);
  if (!stored) {
    return { commit: true, reason: 'initial state', signature };
  }
  const prevSig = teamMultiAgentPersistSignature(stored);
  if (signature === prevSig) {
    return { commit: false, reason: 'signature unchanged', signature };
  }
  if (lastCommittedSignature === signature) {
    return { commit: false, reason: 'already committed this signature', signature };
  }
  if (commitsThisTurn >= maxCommitsPerTurn) {
    return { commit: false, reason: `commit cap (${maxCommitsPerTurn}/turn)`, signature };
  }
  return { commit: true, reason: 'material change', signature };
}

export interface PersistTracker {
  turn: number;
  commits: number;
  lastSignature: string | null;
}

export function bumpPersistTracker(
  tracker: PersistTracker,
  turn: number,
  signature: string | null,
  committed: boolean,
): PersistTracker {
  if (tracker.turn !== turn) {
    return { turn, commits: committed ? 1 : 0, lastSignature: committed ? signature : tracker.lastSignature };
  }
  return {
    turn,
    commits: committed ? tracker.commits + 1 : tracker.commits,
    lastSignature: committed && signature ? signature : tracker.lastSignature,
  };
}
