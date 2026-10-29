import {
  buildSessionRelayExportBundle,
  type SessionRelayExportBundle,
} from './session-relay-export-bundle.ts';
import {
  buildMatchExplainabilityBeaconBundle,
  matchExplainabilityBeaconReady,
} from './match-explainability-beacon-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionBeaconExportBundle extends SessionRelayExportBundle {
  beaconReady: boolean;
  beaconSchema: string;
}

/** Beacon export wraps relay export when beacon bundle is ready. */
export function buildSessionBeaconExportBundle(
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
): SessionBeaconExportBundle {
  const base = buildSessionRelayExportBundle(packs, params);
  const beacon = buildMatchExplainabilityBeaconBundle(packs, params);
  const beaconReady = matchExplainabilityBeaconReady(beacon);
  const exports = beaconReady ? base.exports : [];
  return {
    ...base,
    exports,
    beaconReady,
    beaconSchema: 'agent19.beacon.v1',
    releaseReady: beaconReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Beacon export: ${beaconReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionBeaconExportShipped(bundle: SessionBeaconExportBundle): boolean {
  return (
    bundle.beaconReady &&
    bundle.exports.length > 0 &&
    bundle.beaconSchema === 'agent19.beacon.v1'
  );
}
