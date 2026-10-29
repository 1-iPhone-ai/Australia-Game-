import {
  buildMatchExplainabilitySealBundle,
  matchExplainabilitySealReady,
} from './match-explainability-seal-bundle.ts';
import {
  buildMatchExplainabilityConfirmBundle,
  matchExplainabilityConfirmReady,
} from './match-explainability-confirm-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface ConfirmSealBridgeReport {
  aligned: boolean;
  sealReady: boolean;
  confirmReady: boolean;
  narrativeLines: string[];
}

/** Seal-ready should match confirm-ready when confirm export stack passes. */
export function auditConfirmSealBridge(
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
): ConfirmSealBridgeReport {
  const seal = buildMatchExplainabilitySealBundle(packs, params);
  const confirm = buildMatchExplainabilityConfirmBundle(packs, params);
  const sealReady = matchExplainabilitySealReady(seal);
  const confirmReady = matchExplainabilityConfirmReady(confirm);
  const aligned = sealReady === confirmReady;
  const narrativeLines = [
    `Confirm/seal bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (seal ${sealReady ? 'ok' : 'fail'}, confirm ${confirmReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, sealReady, confirmReady, narrativeLines };
}

export function confirmSealBridgeHealthy(report: ConfirmSealBridgeReport): boolean {
  return report.sealReady && report.confirmReady && report.aligned;
}
