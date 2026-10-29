import {
  buildMatchExplainabilityCovenantBundle,
  matchExplainabilityCovenantReady,
} from './match-explainability-covenant-bundle.ts';
import {
  buildMatchExplainabilitySealBundle,
  matchExplainabilitySealReady,
} from './match-explainability-seal-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SealCovenantBridgeReport {
  aligned: boolean;
  covenantReady: boolean;
  sealReady: boolean;
  narrativeLines: string[];
}

/** Covenant-ready should match seal-ready when seal export stack passes. */
export function auditSealCovenantBridge(
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
): SealCovenantBridgeReport {
  const covenant = buildMatchExplainabilityCovenantBundle(packs, params);
  const seal = buildMatchExplainabilitySealBundle(packs, params);
  const covenantReady = matchExplainabilityCovenantReady(covenant);
  const sealReady = matchExplainabilitySealReady(seal);
  const aligned = covenantReady === sealReady;
  const narrativeLines = [
    `Seal/covenant bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (covenant ${covenantReady ? 'ok' : 'fail'}, seal ${sealReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, covenantReady, sealReady, narrativeLines };
}

export function sealCovenantBridgeHealthy(report: SealCovenantBridgeReport): boolean {
  return report.covenantReady && report.sealReady && report.aligned;
}
