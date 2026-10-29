import {
  buildSessionCrestExportBundle,
  type SessionCrestExportBundle,
} from './session-crest-export-bundle.ts';
import {
  buildMatchExplainabilityVertexBundle,
  matchExplainabilityVertexReady,
} from './match-explainability-vertex-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionVertexExportBundle extends SessionCrestExportBundle {
  vertexReady: boolean;
  vertexSchema: string;
}

/** Vertex export wraps crest export when vertex bundle is ready. */
export function buildSessionVertexExportBundle(
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
): SessionVertexExportBundle {
  const base = buildSessionCrestExportBundle(packs, params);
  const vertex = buildMatchExplainabilityVertexBundle(packs, params);
  const vertexReady = matchExplainabilityVertexReady(vertex);
  const exports = vertexReady ? base.exports : [];
  return {
    ...base,
    exports,
    vertexReady,
    vertexSchema: 'agent19.vertex.v1',
    releaseReady: vertexReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Vertex export: ${vertexReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionVertexExportShipped(bundle: SessionVertexExportBundle): boolean {
  return bundle.vertexReady && bundle.exports.length > 0 && bundle.vertexSchema === 'agent19.vertex.v1';
}
