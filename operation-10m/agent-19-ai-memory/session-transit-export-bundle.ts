import {
  buildSessionSustainmentExportBundle,
  type SessionSustainmentExportBundle,
} from './session-sustainment-export-bundle.ts';
import {
  buildMatchExplainabilityTransitBundle,
  matchExplainabilityTransitReady,
} from './match-explainability-transit-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionTransitExportBundle extends SessionSustainmentExportBundle {
  transitReady: boolean;
  transitSchema: string;
}

/** Transit export wraps sustainment export when transit bundle is ready. */
export function buildSessionTransitExportBundle(
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
): SessionTransitExportBundle {
  const base = buildSessionSustainmentExportBundle(packs, params);
  const transit = buildMatchExplainabilityTransitBundle(packs, params);
  const transitReady = matchExplainabilityTransitReady(transit);
  const exports = transitReady ? base.exports : [];
  return {
    ...base,
    exports,
    transitReady,
    transitSchema: 'agent19.transit.v1',
    releaseReady: transitReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Transit export: ${transitReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionTransitExportShipped(bundle: SessionTransitExportBundle): boolean {
  return (
    bundle.transitReady &&
    bundle.exports.length > 0 &&
    bundle.transitSchema === 'agent19.transit.v1'
  );
}
