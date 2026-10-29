import { AGENT18_LIMITS, HandoffRequest } from './types.ts';

export interface HandoffCascadeReport {
  cascadeRiskIndex: number;
  cascadeChainActorIds: string[];
  notes: string[];
}

/**
 * Score risk from long pending handoff chains (sequential actor delegation).
 */
export function analyzeHandoffCascadeRisk(handoffs: HandoffRequest[]): HandoffCascadeReport {
  const pending = handoffs
    .filter(h => h.status === 'pending')
    .slice(0, AGENT18_LIMITS.maxHandoffs);
  const notes: string[] = [];
  const nextByFrom = new Map<string, string>();

  pending.forEach(h => {
    if (!nextByFrom.has(h.fromActorId)) nextByFrom.set(h.fromActorId, h.toActorId);
  });

  let maxChain = 0;
  let worstChain: string[] = [];
  const starts = new Set(pending.map(h => h.fromActorId));

  starts.forEach(start => {
    const chain: string[] = [start];
    const seen = new Set<string>([start]);
    let cursor: string | undefined = start;
    while (cursor && nextByFrom.has(cursor)) {
      const next = nextByFrom.get(cursor) as string;
      if (seen.has(next)) {
        notes.push(`Handoff cascade cycle includes ${next}`);
        break;
      }
      chain.push(next);
      seen.add(next);
      cursor = next;
      if (chain.length > maxChain) {
        maxChain = chain.length;
        worstChain = [...chain];
      }
    }
  });

  const cascadeRiskIndex = Math.round(
    Math.min(100, Math.max(0, (maxChain - 1) * 28 + (maxChain >= 4 ? 20 : 0))),
  );
  if (maxChain >= 3) {
    notes.push(`Handoff cascade length ${maxChain}: ${worstChain.join(' → ')}`);
  }

  return {
    cascadeRiskIndex,
    cascadeChainActorIds: worstChain.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamHandoffCascadeRisk(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
