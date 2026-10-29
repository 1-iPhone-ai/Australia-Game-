import { buildSessionGiClaimsRollup, sessionGiRollupWithinCap } from './session-gi-claims-rollup.ts';
import { auditMatchExplainabilityGate, matchExplainabilityGateOpen } from './match-explainability-gate.ts';
import type { AiActorMemory, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionGiDeliveryBundle {
  deliverable: boolean;
  giWithinCap: boolean;
  claimCount: number;
  narrativeLines: string[];
}

/** Ask-the-Game delivery bundle: GI rollup only when base match gate is open. */
export function buildSessionGiDeliveryBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionGiDeliveryBundle {
  const gate = auditMatchExplainabilityGate(packs, params);
  const giRollup = buildSessionGiClaimsRollup(packs, {
    memoryInfluenceEnabled: params.memoryInfluenceEnabled,
  });
  const giWithinCap = sessionGiRollupWithinCap(giRollup);
  const deliverable = matchExplainabilityGateOpen(gate) && giWithinCap && packs.length > 0;
  const narrativeLines = [
    `Session GI delivery: ${deliverable ? 'READY' : 'HELD'} (${giRollup.claimCount} claim(s), cap ${giWithinCap ? 'ok' : 'FAIL'}).`,
    ...giRollup.narrativeLines.slice(0, 2),
  ];
  return {
    deliverable,
    giWithinCap,
    claimCount: giRollup.claimCount,
    narrativeLines,
  };
}

export function sessionGiDeliveryReady(bundle: SessionGiDeliveryBundle): boolean {
  return bundle.deliverable;
}
