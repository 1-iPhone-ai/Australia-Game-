import {
  auditMatchExplainabilityBeaconGate,
  matchExplainabilityBeaconAllowed,
} from './match-explainability-beacon-gate.ts';
import {
  buildMatchExplainabilityRelayBundle,
  matchExplainabilityRelayReady,
} from './match-explainability-relay-bundle.ts';
import {
  buildSessionRelayExportBundle,
  sessionRelayExportShipped,
} from './session-relay-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_BEACON_NARRATIVE_CAP = 10;

export interface MatchExplainabilityBeaconBundle {
  beaconReady: boolean;
  beaconAllowed: boolean;
  relayReady: boolean;
  relayExportShipped: boolean;
  narrativeLines: string[];
}

type BeaconParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Beacon bundle: beacon gate and relay export must both be green. */
export function buildMatchExplainabilityBeaconBundle(
  packs: TurnExplainabilityPack[],
  params: BeaconParams,
): MatchExplainabilityBeaconBundle {
  const beacon = auditMatchExplainabilityBeaconGate(packs, params);
  const relay = buildMatchExplainabilityRelayBundle(packs, params);
  const relayExport = buildSessionRelayExportBundle(packs, params);
  const beaconAllowed = matchExplainabilityBeaconAllowed(beacon);
  const relayReady = matchExplainabilityRelayReady(relay);
  const relayExportShipped = sessionRelayExportShipped(relayExport);
  const beaconReady = beaconAllowed && relayReady && relayExportShipped;
  const narrativeLines = [
    `Match explainability beacon: ${beaconReady ? 'READY' : 'PENDING'} (gate ${beaconAllowed ? 'ok' : 'fail'}, relay ${relayReady ? 'ok' : 'fail'}).`,
    ...beacon.narrativeLines.slice(0, 2),
    ...relay.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_BEACON_NARRATIVE_CAP);
  return {
    beaconReady,
    beaconAllowed,
    relayReady,
    relayExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityBeaconReady(bundle: MatchExplainabilityBeaconBundle): boolean {
  return bundle.beaconReady;
}
