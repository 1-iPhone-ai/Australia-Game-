import {
  buildMatchExplainabilityAckBundle,
  matchExplainabilityAckReady,
} from './match-explainability-ack-bundle.ts';
import {
  buildSessionAckExportBundle,
  sessionAckExportShipped,
} from './session-ack-export-bundle.ts';
import { auditHandshakeAckBridge, handshakeAckBridgeHealthy } from './handshake-ack-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityConfirmGateReport {
  confirmAllowed: boolean;
  ackReady: boolean;
  ackExportShipped: boolean;
  handshakeAckHealthy: boolean;
  narrativeLines: string[];
}

/** Confirm gate: ack bundle + ack export + handshake/ack bridge. */
export function auditMatchExplainabilityConfirmGate(
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
): MatchExplainabilityConfirmGateReport {
  const ack = buildMatchExplainabilityAckBundle(packs, params);
  const ackExport = buildSessionAckExportBundle(packs, params);
  const bridge = auditHandshakeAckBridge(packs, params);
  const ackReady = matchExplainabilityAckReady(ack);
  const ackExportShipped = sessionAckExportShipped(ackExport);
  const handshakeAckHealthy = handshakeAckBridgeHealthy(bridge);
  const confirmAllowed = ackReady && ackExportShipped && handshakeAckHealthy;
  const narrativeLines = [
    `Match explainability confirm: ${confirmAllowed ? 'ALLOWED' : 'DENIED'} (ack ${ackReady ? 'ok' : 'fail'}, export ${ackExportShipped ? 'ok' : 'fail'}).`,
    ...ack.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    confirmAllowed,
    ackReady,
    ackExportShipped,
    handshakeAckHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityConfirmAllowed(report: MatchExplainabilityConfirmGateReport): boolean {
  return report.confirmAllowed;
}
