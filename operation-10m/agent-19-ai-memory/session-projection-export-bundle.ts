import {
  buildSessionNexusExportBundle,
  type SessionNexusExportBundle,
} from './session-nexus-export-bundle.ts';
import {
  buildMatchExplainabilityProjectionBundle,
  matchExplainabilityProjectionReady,
} from './match-explainability-projection-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionProjectionExportBundle extends SessionNexusExportBundle {
  projectionReady: boolean;
  projectionSchema: string;
}

/** Projection export wraps nexus export when projection bundle is ready. */
export function buildSessionProjectionExportBundle(
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
): SessionProjectionExportBundle {
  const base = buildSessionNexusExportBundle(packs, params);
  const projection = buildMatchExplainabilityProjectionBundle(packs, params);
  const projectionReady = matchExplainabilityProjectionReady(projection);
  const exports = projectionReady ? base.exports : [];
  return {
    ...base,
    exports,
    projectionReady,
    projectionSchema: 'agent19.projection.v1',
    releaseReady: projectionReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Projection export: ${projectionReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionProjectionExportShipped(bundle: SessionProjectionExportBundle): boolean {
  return bundle.projectionReady && bundle.exports.length > 0 && bundle.projectionSchema === 'agent19.projection.v1';
}
