import {
  buildSessionTransitExportBundle,
  type SessionTransitExportBundle,
} from './session-transit-export-bundle.ts';
import {
  buildMatchExplainabilityRelayBundle,
  matchExplainabilityRelayReady,
} from './match-explainability-relay-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionRelayExportBundle extends SessionTransitExportBundle {
  relayReady: boolean;
  relaySchema: string;
}

/** Relay export wraps transit export when relay bundle is ready. */
export function buildSessionRelayExportBundle(
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
): SessionRelayExportBundle {
  const base = buildSessionTransitExportBundle(packs, params);
  const relay = buildMatchExplainabilityRelayBundle(packs, params);
  const relayReady = matchExplainabilityRelayReady(relay);
  const exports = relayReady ? base.exports : [];
  return {
    ...base,
    exports,
    relayReady,
    relaySchema: 'agent19.relay.v1',
    releaseReady: relayReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Relay export: ${relayReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionRelayExportShipped(bundle: SessionRelayExportBundle): boolean {
  return (
    bundle.relayReady &&
    bundle.exports.length > 0 &&
    bundle.relaySchema === 'agent19.relay.v1'
  );
}
