import { buildSessionExplainabilityRollup } from './session-explainability-rollup.ts';
import { buildSessionGiClaimsRollup, sessionGiRollupWithinCap } from './session-gi-claims-rollup.ts';
import {
  buildSessionConfidenceRollup,
  sessionConfidenceAtLeast,
} from './session-confidence-rollup.ts';
import type { AiActorMemory, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityGateReport {
  gateOpen: boolean;
  giWithinCap: boolean;
  sessionRollupTurns: number;
  narrativeLines: string[];
}

/** Match-level gate: session rollup present, GI cap respected, min confidence band. */
export function auditMatchExplainabilityGate(
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
): MatchExplainabilityGateReport {
  const minBand = params.minConfidenceBand ?? 'medium';
  const session = buildSessionExplainabilityRollup(packs);
  const gi = buildSessionGiClaimsRollup(packs, { memoryInfluenceEnabled: params.memoryInfluenceEnabled });
  const confidence = buildSessionConfidenceRollup(packs, {
    memory: params.memory,
    decisionsByTurn: params.decisionsByTurn,
  });
  const giWithinCap = sessionGiRollupWithinCap(gi);
  const confidenceOk = sessionConfidenceAtLeast(confidence, minBand);
  const gateOpen = packs.length > 0 && giWithinCap && confidenceOk;
  const narrativeLines = [
    `Match explainability gate: ${gateOpen ? 'OPEN' : 'CLOSED'} (${packs.length} pack(s), GI cap ${giWithinCap ? 'ok' : 'FAIL'}, confidence ${confidence.minBand}).`,
    ...session.narrativeLines.slice(0, 1),
    ...confidence.narrativeLines,
  ];
  return {
    gateOpen,
    giWithinCap,
    sessionRollupTurns: session.turnCount,
    narrativeLines,
  };
}

export function matchExplainabilityGateOpen(report: MatchExplainabilityGateReport): boolean {
  return report.gateOpen;
}
