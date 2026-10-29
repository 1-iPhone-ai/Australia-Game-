import {
  buildMatchExplainabilitySignalBundle,
  matchExplainabilitySignalReady,
} from './match-explainability-signal-bundle.ts';
import {
  buildMatchExplainabilityBeaconBundle,
  matchExplainabilityBeaconReady,
} from './match-explainability-beacon-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface BeaconSignalBridgeReport {
  aligned: boolean;
  signalReady: boolean;
  beaconReady: boolean;
  narrativeLines: string[];
}

/** Signal-ready should match beacon-ready when beacon export stack passes. */
export function auditBeaconSignalBridge(
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
): BeaconSignalBridgeReport {
  const signal = buildMatchExplainabilitySignalBundle(packs, params);
  const beacon = buildMatchExplainabilityBeaconBundle(packs, params);
  const signalReady = matchExplainabilitySignalReady(signal);
  const beaconReady = matchExplainabilityBeaconReady(beacon);
  const aligned = signalReady === beaconReady;
  const narrativeLines = [
    `Beacon/signal bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (signal ${signalReady ? 'ok' : 'fail'}, beacon ${beaconReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, signalReady, beaconReady, narrativeLines };
}

export function beaconSignalBridgeHealthy(report: BeaconSignalBridgeReport): boolean {
  return report.signalReady && report.beaconReady && report.aligned;
}
