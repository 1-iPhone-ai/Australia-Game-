import {
  buildMatchExplainabilityHandshakeBundle,
  matchExplainabilityHandshakeReady,
} from './match-explainability-handshake-bundle.ts';
import {
  buildSessionHandshakeExportBundle,
  sessionHandshakeExportShipped,
} from './session-handshake-export-bundle.ts';
import { auditUplinkHandshakeBridge, uplinkHandshakeBridgeHealthy } from './uplink-handshake-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityAckGateReport {
  ackAllowed: boolean;
  handshakeReady: boolean;
  handshakeExportShipped: boolean;
  uplinkHandshakeHealthy: boolean;
  narrativeLines: string[];
}

/** Ack gate: handshake bundle + handshake export + uplink/handshake bridge. */
export function auditMatchExplainabilityAckGate(
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
): MatchExplainabilityAckGateReport {
  const handshake = buildMatchExplainabilityHandshakeBundle(packs, params);
  const handshakeExport = buildSessionHandshakeExportBundle(packs, params);
  const bridge = auditUplinkHandshakeBridge(packs, params);
  const handshakeReady = matchExplainabilityHandshakeReady(handshake);
  const handshakeExportShipped = sessionHandshakeExportShipped(handshakeExport);
  const uplinkHandshakeHealthy = uplinkHandshakeBridgeHealthy(bridge);
  const ackAllowed = handshakeReady && handshakeExportShipped && uplinkHandshakeHealthy;
  const narrativeLines = [
    `Match explainability ack: ${ackAllowed ? 'ALLOWED' : 'DENIED'} (handshake ${handshakeReady ? 'ok' : 'fail'}, export ${handshakeExportShipped ? 'ok' : 'fail'}).`,
    ...handshake.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    ackAllowed,
    handshakeReady,
    handshakeExportShipped,
    uplinkHandshakeHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityAckAllowed(report: MatchExplainabilityAckGateReport): boolean {
  return report.ackAllowed;
}
