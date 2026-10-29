import {
  buildMatchExplainabilityAckBundle,
  matchExplainabilityAckReady,
} from './match-explainability-ack-bundle.ts';
import {
  buildMatchExplainabilityHandshakeBundle,
  matchExplainabilityHandshakeReady,
} from './match-explainability-handshake-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface HandshakeAckBridgeReport {
  aligned: boolean;
  ackReady: boolean;
  handshakeReady: boolean;
  narrativeLines: string[];
}

/** Ack-ready should match handshake-ready when handshake export stack passes. */
export function auditHandshakeAckBridge(
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
): HandshakeAckBridgeReport {
  const ack = buildMatchExplainabilityAckBundle(packs, params);
  const handshake = buildMatchExplainabilityHandshakeBundle(packs, params);
  const ackReady = matchExplainabilityAckReady(ack);
  const handshakeReady = matchExplainabilityHandshakeReady(handshake);
  const aligned = ackReady === handshakeReady;
  const narrativeLines = [
    `Handshake/ack bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (ack ${ackReady ? 'ok' : 'fail'}, handshake ${handshakeReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, ackReady, handshakeReady, narrativeLines };
}

export function handshakeAckBridgeHealthy(report: HandshakeAckBridgeReport): boolean {
  return report.ackReady && report.handshakeReady && report.aligned;
}
