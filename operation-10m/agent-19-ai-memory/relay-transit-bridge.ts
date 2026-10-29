import {
  buildMatchExplainabilityRelayBundle,
  matchExplainabilityRelayReady,
} from './match-explainability-relay-bundle.ts';
import {
  buildMatchExplainabilityTransitBundle,
  matchExplainabilityTransitReady,
} from './match-explainability-transit-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface RelayTransitBridgeReport {
  aligned: boolean;
  relayReady: boolean;
  transitReady: boolean;
  narrativeLines: string[];
}

/** Relay-ready should match transit-ready when transit export stack passes. */
export function auditRelayTransitBridge(
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
): RelayTransitBridgeReport {
  const relay = buildMatchExplainabilityRelayBundle(packs, params);
  const transit = buildMatchExplainabilityTransitBundle(packs, params);
  const relayReady = matchExplainabilityRelayReady(relay);
  const transitReady = matchExplainabilityTransitReady(transit);
  const aligned = relayReady === transitReady;
  const narrativeLines = [
    `Relay/transit bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (relay ${relayReady ? 'ok' : 'fail'}, transit ${transitReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, relayReady, transitReady, narrativeLines };
}

export function relayTransitBridgeHealthy(report: RelayTransitBridgeReport): boolean {
  return report.relayReady && report.transitReady && report.aligned;
}
