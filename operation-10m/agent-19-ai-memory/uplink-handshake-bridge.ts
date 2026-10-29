import {
  buildMatchExplainabilityHandshakeBundle,
  matchExplainabilityHandshakeReady,
} from './match-explainability-handshake-bundle.ts';
import {
  buildMatchExplainabilityUplinkBundle,
  matchExplainabilityUplinkReady,
} from './match-explainability-uplink-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface UplinkHandshakeBridgeReport {
  aligned: boolean;
  handshakeReady: boolean;
  uplinkReady: boolean;
  narrativeLines: string[];
}

/** Handshake-ready should match uplink-ready when uplink export stack passes. */
export function auditUplinkHandshakeBridge(
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
): UplinkHandshakeBridgeReport {
  const handshake = buildMatchExplainabilityHandshakeBundle(packs, params);
  const uplink = buildMatchExplainabilityUplinkBundle(packs, params);
  const handshakeReady = matchExplainabilityHandshakeReady(handshake);
  const uplinkReady = matchExplainabilityUplinkReady(uplink);
  const aligned = handshakeReady === uplinkReady;
  const narrativeLines = [
    `Uplink/handshake bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (handshake ${handshakeReady ? 'ok' : 'fail'}, uplink ${uplinkReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, handshakeReady, uplinkReady, narrativeLines };
}

export function uplinkHandshakeBridgeHealthy(report: UplinkHandshakeBridgeReport): boolean {
  return report.handshakeReady && report.uplinkReady && report.aligned;
}
