import {
  buildNegotiationInfluenceBridge,
  negotiationInfluenceAligned,
} from './negotiation-influence-bridge.ts';
import type { AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

export interface NegotiationSessionRollup {
  turnCount: number;
  alignedTurns: number;
  mismatchTurns: number;
  narrativeLines: string[];
}

/** Tracks negotiation vs relationship-slice alignment across turn packs. */
export function buildNegotiationSessionRollup(
  packs: TurnExplainabilityPack[],
  params: {
    relationship: Partial<AiRelationship> | null | undefined;
    decisionsByTurn: Array<{ after: MemoryInfluenceDecisionLike[] }>;
  },
): NegotiationSessionRollup {
  let alignedTurns = 0;
  let mismatchTurns = 0;
  packs.forEach((pack, i) => {
    const after = params.decisionsByTurn[i]?.after ?? [];
    const bridge = buildNegotiationInfluenceBridge(params.relationship, after);
    if (negotiationInfluenceAligned(bridge)) alignedTurns += 1;
    else mismatchTurns += 1;
  });
  const narrativeLines = [
    `Negotiation session rollup: ${alignedTurns}/${packs.length} turn(s) aligned (${mismatchTurns} mismatch).`,
  ];
  return { turnCount: packs.length, alignedTurns, mismatchTurns, narrativeLines };
}

export function negotiationSessionMostlyAligned(rollup: NegotiationSessionRollup): boolean {
  return rollup.turnCount === 0 || rollup.mismatchTurns === 0;
}
