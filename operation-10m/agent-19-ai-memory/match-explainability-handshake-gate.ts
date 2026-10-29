import {
  buildMatchExplainabilityUplinkBundle,
  matchExplainabilityUplinkReady,
} from './match-explainability-uplink-bundle.ts';
import {
  buildSessionUplinkExportBundle,
  sessionUplinkExportShipped,
} from './session-uplink-export-bundle.ts';
import { auditSignalUplinkBridge, signalUplinkBridgeHealthy } from './signal-uplink-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityHandshakeGateReport {
  handshakeAllowed: boolean;
  uplinkReady: boolean;
  uplinkExportShipped: boolean;
  signalUplinkHealthy: boolean;
  narrativeLines: string[];
}

/** Handshake gate: uplink bundle + uplink export + signal/uplink bridge. */
export function auditMatchExplainabilityHandshakeGate(
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
): MatchExplainabilityHandshakeGateReport {
  const uplink = buildMatchExplainabilityUplinkBundle(packs, params);
  const uplinkExport = buildSessionUplinkExportBundle(packs, params);
  const bridge = auditSignalUplinkBridge(packs, params);
  const uplinkReady = matchExplainabilityUplinkReady(uplink);
  const uplinkExportShipped = sessionUplinkExportShipped(uplinkExport);
  const signalUplinkHealthy = signalUplinkBridgeHealthy(bridge);
  const handshakeAllowed = uplinkReady && uplinkExportShipped && signalUplinkHealthy;
  const narrativeLines = [
    `Match explainability handshake: ${handshakeAllowed ? 'ALLOWED' : 'DENIED'} (uplink ${uplinkReady ? 'ok' : 'fail'}, export ${uplinkExportShipped ? 'ok' : 'fail'}).`,
    ...uplink.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    handshakeAllowed,
    uplinkReady,
    uplinkExportShipped,
    signalUplinkHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityHandshakeAllowed(report: MatchExplainabilityHandshakeGateReport): boolean {
  return report.handshakeAllowed;
}
