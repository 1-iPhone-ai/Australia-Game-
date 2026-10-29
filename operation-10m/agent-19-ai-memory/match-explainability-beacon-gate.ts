import {
  buildMatchExplainabilityRelayBundle,
  matchExplainabilityRelayReady,
} from './match-explainability-relay-bundle.ts';
import {
  buildSessionRelayExportBundle,
  sessionRelayExportShipped,
} from './session-relay-export-bundle.ts';
import { auditRelayTransitBridge, relayTransitBridgeHealthy } from './relay-transit-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityBeaconGateReport {
  beaconAllowed: boolean;
  relayReady: boolean;
  relayExportShipped: boolean;
  relayTransitHealthy: boolean;
  narrativeLines: string[];
}

/** Beacon gate: relay bundle + relay export + relay/transit bridge. */
export function auditMatchExplainabilityBeaconGate(
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
): MatchExplainabilityBeaconGateReport {
  const relay = buildMatchExplainabilityRelayBundle(packs, params);
  const relayExport = buildSessionRelayExportBundle(packs, params);
  const bridge = auditRelayTransitBridge(packs, params);
  const relayReady = matchExplainabilityRelayReady(relay);
  const relayExportShipped = sessionRelayExportShipped(relayExport);
  const relayTransitHealthy = relayTransitBridgeHealthy(bridge);
  const beaconAllowed = relayReady && relayExportShipped && relayTransitHealthy;
  const narrativeLines = [
    `Match explainability beacon: ${beaconAllowed ? 'ALLOWED' : 'DENIED'} (relay ${relayReady ? 'ok' : 'fail'}, export ${relayExportShipped ? 'ok' : 'fail'}).`,
    ...relay.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    beaconAllowed,
    relayReady,
    relayExportShipped,
    relayTransitHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityBeaconAllowed(report: MatchExplainabilityBeaconGateReport): boolean {
  return report.beaconAllowed;
}
