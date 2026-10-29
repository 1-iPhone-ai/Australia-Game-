import {
  buildMatchExplainabilityBeaconBundle,
  matchExplainabilityBeaconReady,
} from './match-explainability-beacon-bundle.ts';
import {
  buildSessionBeaconExportBundle,
  sessionBeaconExportShipped,
} from './session-beacon-export-bundle.ts';
import { auditRelayBeaconBridge, relayBeaconBridgeHealthy } from './relay-beacon-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilitySignalGateReport {
  signalAllowed: boolean;
  beaconReady: boolean;
  beaconExportShipped: boolean;
  relayBeaconHealthy: boolean;
  narrativeLines: string[];
}

/** Signal gate: beacon bundle + beacon export + relay/beacon bridge. */
export function auditMatchExplainabilitySignalGate(
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
): MatchExplainabilitySignalGateReport {
  const beacon = buildMatchExplainabilityBeaconBundle(packs, params);
  const beaconExport = buildSessionBeaconExportBundle(packs, params);
  const bridge = auditRelayBeaconBridge(packs, params);
  const beaconReady = matchExplainabilityBeaconReady(beacon);
  const beaconExportShipped = sessionBeaconExportShipped(beaconExport);
  const relayBeaconHealthy = relayBeaconBridgeHealthy(bridge);
  const signalAllowed = beaconReady && beaconExportShipped && relayBeaconHealthy;
  const narrativeLines = [
    `Match explainability signal: ${signalAllowed ? 'ALLOWED' : 'DENIED'} (beacon ${beaconReady ? 'ok' : 'fail'}, export ${beaconExportShipped ? 'ok' : 'fail'}).`,
    ...beacon.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    signalAllowed,
    beaconReady,
    beaconExportShipped,
    relayBeaconHealthy,
    narrativeLines,
  };
}

export function matchExplainabilitySignalAllowed(report: MatchExplainabilitySignalGateReport): boolean {
  return report.signalAllowed;
}
