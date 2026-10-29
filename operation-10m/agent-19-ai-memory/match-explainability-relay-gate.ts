import {
  buildMatchExplainabilityTransitBundle,
  matchExplainabilityTransitReady,
} from './match-explainability-transit-bundle.ts';
import {
  buildSessionTransitExportBundle,
  sessionTransitExportShipped,
} from './session-transit-export-bundle.ts';
import { auditOrbitTransitBridge, orbitTransitBridgeHealthy } from './orbit-transit-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityRelayGateReport {
  relayAllowed: boolean;
  transitReady: boolean;
  transitExportShipped: boolean;
  orbitTransitHealthy: boolean;
  narrativeLines: string[];
}

/** Relay gate: transit bundle + transit export + orbit/transit bridge. */
export function auditMatchExplainabilityRelayGate(
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
): MatchExplainabilityRelayGateReport {
  const transit = buildMatchExplainabilityTransitBundle(packs, params);
  const transitExport = buildSessionTransitExportBundle(packs, params);
  const bridge = auditOrbitTransitBridge(packs, params);
  const transitReady = matchExplainabilityTransitReady(transit);
  const transitExportShipped = sessionTransitExportShipped(transitExport);
  const orbitTransitHealthy = orbitTransitBridgeHealthy(bridge);
  const relayAllowed = transitReady && transitExportShipped && orbitTransitHealthy;
  const narrativeLines = [
    `Match explainability relay: ${relayAllowed ? 'ALLOWED' : 'DENIED'} (transit ${transitReady ? 'ok' : 'fail'}, export ${transitExportShipped ? 'ok' : 'fail'}).`,
    ...transit.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    relayAllowed,
    transitReady,
    transitExportShipped,
    orbitTransitHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityRelayAllowed(report: MatchExplainabilityRelayGateReport): boolean {
  return report.relayAllowed;
}
