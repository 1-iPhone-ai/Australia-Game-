import {
  buildMatchExplainabilityCharterBundle,
  matchExplainabilityCharterReady,
} from './match-explainability-charter-bundle.ts';
import {
  buildMatchExplainabilityCovenantBundle,
  matchExplainabilityCovenantReady,
} from './match-explainability-covenant-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface CovenantCharterBridgeReport {
  aligned: boolean;
  charterReady: boolean;
  covenantReady: boolean;
  narrativeLines: string[];
}

/** Charter-ready should match covenant-ready when covenant export stack passes. */
export function auditCovenantCharterBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): CovenantCharterBridgeReport {
  const charter = buildMatchExplainabilityCharterBundle(packs, params);
  const covenant = buildMatchExplainabilityCovenantBundle(packs, params);
  const charterReady = matchExplainabilityCharterReady(charter);
  const covenantReady = matchExplainabilityCovenantReady(covenant);
  const aligned = charterReady === covenantReady;
  const narrativeLines = [
    `Covenant/charter bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (charter ${charterReady ? 'ok' : 'fail'}, covenant ${covenantReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, charterReady, covenantReady, narrativeLines };
}

export function covenantCharterBridgeHealthy(report: CovenantCharterBridgeReport): boolean {
  return report.charterReady && report.covenantReady && report.aligned;
}
