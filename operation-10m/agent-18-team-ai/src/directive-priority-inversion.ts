import { TeammateDirectiveProposal } from './types.ts';

export interface DirectivePriorityInversionReport {
  inversionIndex: number;
  invertedProposalIds: string[];
  notes: string[];
}

function collisionKey(p: TeammateDirectiveProposal): string | null {
  if (p.taskId) return `task:${p.taskId}`;
  if (p.targetRegionId) return `region:${p.targetRegionId}`;
  return null;
}

export interface DirectivePriorityInversionContext {
  allowed: TeammateDirectiveProposal[];
  suppressed: TeammateDirectiveProposal[];
}

/**
 * Detect higher-priority (lower number) directives suppressed while lower-priority peers remain allowed on the same target.
 */
export function computeDirectivePriorityInversion(
  proposals: TeammateDirectiveProposal[],
  collidingProposalIds: string[],
  context: DirectivePriorityInversionContext,
): DirectivePriorityInversionReport {
  const notes: string[] = [];
  const colliding = new Set(collidingProposalIds);
  const byKey = new Map<string, TeammateDirectiveProposal[]>();

  proposals.forEach(p => {
    if (colliding.size > 0 && !colliding.has(p.id)) return;
    const key = collisionKey(p);
    if (!key) return;
    const list = byKey.get(key) || [];
    list.push(p);
    byKey.set(key, list);
  });

  const allowedIds = new Set(context.allowed.map(p => p.id));
  const suppressedIds = new Set(context.suppressed.map(p => p.id));
  const invertedIds = new Set<string>();
  let inversionPairs = 0;
  let pairTotal = 0;

  byKey.forEach(list => {
    const allowedInCluster = list.filter(p => allowedIds.has(p.id));
    const suppressedInCluster = list.filter(p => suppressedIds.has(p.id));
    if (!allowedInCluster.length || !suppressedInCluster.length) return;

    allowedInCluster.forEach(a => {
      suppressedInCluster.forEach(s => {
        pairTotal += 1;
        if (s.priority < a.priority) {
          inversionPairs += 1;
          invertedIds.add(a.id);
          invertedIds.add(s.id);
          notes.push(
            `Priority inversion: suppressed ${s.actorId} priority ${s.priority} loses to allowed ${a.actorId} priority ${a.priority}`,
          );
        }
      });
    });
  });

  const inversionIndex =
    pairTotal === 0 ? 0 : Math.round(Math.min(100, (inversionPairs / pairTotal) * 100));

  return {
    inversionIndex,
    invertedProposalIds: [...invertedIds].slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamPriorityInversion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
