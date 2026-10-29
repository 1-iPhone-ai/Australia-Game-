import {
  buildMatchExplainabilityConfirmBundle,
  matchExplainabilityConfirmReady,
} from './match-explainability-confirm-bundle.ts';
import {
  buildMatchExplainabilityAckBundle,
  matchExplainabilityAckReady,
} from './match-explainability-ack-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface AckConfirmBridgeReport {
  aligned: boolean;
  confirmReady: boolean;
  ackReady: boolean;
  narrativeLines: string[];
}

/** Confirm-ready should match ack-ready when ack export stack passes. */
export function auditAckConfirmBridge(
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
): AckConfirmBridgeReport {
  const confirm = buildMatchExplainabilityConfirmBundle(packs, params);
  const ack = buildMatchExplainabilityAckBundle(packs, params);
  const confirmReady = matchExplainabilityConfirmReady(confirm);
  const ackReady = matchExplainabilityAckReady(ack);
  const aligned = confirmReady === ackReady;
  const narrativeLines = [
    `Ack/confirm bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (confirm ${confirmReady ? 'ok' : 'fail'}, ack ${ackReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, confirmReady, ackReady, narrativeLines };
}

export function ackConfirmBridgeHealthy(report: AckConfirmBridgeReport): boolean {
  return report.confirmReady && report.ackReady && report.aligned;
}
