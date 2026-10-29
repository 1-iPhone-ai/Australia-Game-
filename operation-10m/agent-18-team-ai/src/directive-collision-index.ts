import { TeammateDirectiveProposal } from './types.ts';

export interface DirectiveCollisionReport {
  collisionIndex: number;
  collidingProposalIds: string[];
  notes: string[];
}

function targetsSameResource(a: TeammateDirectiveProposal, b: TeammateDirectiveProposal): boolean {
  if (a.actorId === b.actorId) return false;
  if (a.taskId && b.taskId && a.taskId === b.taskId) return true;
  if (a.targetRegionId && b.targetRegionId && a.targetRegionId === b.targetRegionId) {
    return /deposit|defend|take|region/i.test(a.goalKind) && /deposit|defend|take|region/i.test(b.goalKind);
  }
  return false;
}

/**
 * Cross-actor directive overlap on the same region or task (after in-team scoping).
 */
export function computeDirectiveCollisionIndex(
  proposals: TeammateDirectiveProposal[],
): DirectiveCollisionReport {
  const notes: string[] = [];
  const collidingIds = new Set<string>();
  let pairCount = 0;

  for (let i = 0; i < proposals.length; i++) {
    for (let j = i + 1; j < proposals.length; j++) {
      const a = proposals[i];
      const b = proposals[j];
      if (!targetsSameResource(a, b)) continue;
      pairCount += 1;
      collidingIds.add(a.id);
      collidingIds.add(b.id);
      notes.push(
        `Directive collision ${a.actorId} vs ${b.actorId} on ${a.taskId || a.targetRegionId || 'resource'}`,
      );
    }
  }

  const maxPairs = Math.max(1, (proposals.length * (proposals.length - 1)) / 2);
  const collisionIndex = proposals.length < 2 ? 0 : Math.round(Math.min(100, (pairCount / maxPairs) * 100));

  return {
    collisionIndex,
    collidingProposalIds: [...collidingIds].slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamDirectiveCollision(
  friendly: DirectiveCollisionReport,
  enemy: DirectiveCollisionReport | null,
): number {
  if (!enemy) return friendly.collisionIndex;
  return Math.max(friendly.collisionIndex, enemy.collisionIndex);
}
