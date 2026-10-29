import {
  buildMatchExplainabilityBeaconBundle,
  matchExplainabilityBeaconReady,
} from './match-explainability-beacon-bundle.ts';
import {
  buildMatchExplainabilityRelayBundle,
  matchExplainabilityRelayReady,
} from './match-explainability-relay-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface RelayBeaconBridgeReport {
  aligned: boolean;
  beaconReady: boolean;
  relayReady: boolean;
  narrativeLines: string[];
}

/** Beacon-ready should match relay-ready when relay export stack passes. */
export function auditRelayBeaconBridge(
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
): RelayBeaconBridgeReport {
  const beacon = buildMatchExplainabilityBeaconBundle(packs, params);
  const relay = buildMatchExplainabilityRelayBundle(packs, params);
  const beaconReady = matchExplainabilityBeaconReady(beacon);
  const relayReady = matchExplainabilityRelayReady(relay);
  const aligned = beaconReady === relayReady;
  const narrativeLines = [
    `Relay/beacon bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (beacon ${beaconReady ? 'ok' : 'fail'}, relay ${relayReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, beaconReady, relayReady, narrativeLines };
}

export function relayBeaconBridgeHealthy(report: RelayBeaconBridgeReport): boolean {
  return report.beaconReady && report.relayReady && report.aligned;
}
