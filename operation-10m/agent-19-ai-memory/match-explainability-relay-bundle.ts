import {
  auditMatchExplainabilityRelayGate,
  matchExplainabilityRelayAllowed,
} from './match-explainability-relay-gate.ts';
import {
  buildMatchExplainabilityTransitBundle,
  matchExplainabilityTransitReady,
} from './match-explainability-transit-bundle.ts';
import {
  buildSessionTransitExportBundle,
  sessionTransitExportShipped,
} from './session-transit-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_RELAY_NARRATIVE_CAP = 10;

export interface MatchExplainabilityRelayBundle {
  relayReady: boolean;
  relayAllowed: boolean;
  transitReady: boolean;
  transitExportShipped: boolean;
  narrativeLines: string[];
}

type RelayParams = {
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

/** Relay bundle: relay gate and transit export must both be green. */
export function buildMatchExplainabilityRelayBundle(
  packs: TurnExplainabilityPack[],
  params: RelayParams,
): MatchExplainabilityRelayBundle {
  const relay = auditMatchExplainabilityRelayGate(packs, params);
  const transit = buildMatchExplainabilityTransitBundle(packs, params);
  const transitExport = buildSessionTransitExportBundle(packs, params);
  const relayAllowed = matchExplainabilityRelayAllowed(relay);
  const transitReady = matchExplainabilityTransitReady(transit);
  const transitExportShipped = sessionTransitExportShipped(transitExport);
  const relayReady = relayAllowed && transitReady && transitExportShipped;
  const narrativeLines = [
    `Match explainability relay: ${relayReady ? 'READY' : 'PENDING'} (gate ${relayAllowed ? 'ok' : 'fail'}, transit ${transitReady ? 'ok' : 'fail'}).`,
    ...relay.narrativeLines.slice(0, 2),
    ...transit.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_RELAY_NARRATIVE_CAP);
  return {
    relayReady,
    relayAllowed,
    transitReady,
    transitExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityRelayReady(bundle: MatchExplainabilityRelayBundle): boolean {
  return bundle.relayReady;
}
