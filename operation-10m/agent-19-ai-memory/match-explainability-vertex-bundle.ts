import {
  auditMatchExplainabilityVertexGate,
  matchExplainabilityVertexAllowed,
} from './match-explainability-vertex-gate.ts';
import {
  buildMatchExplainabilityCrestBundle,
  matchExplainabilityCrestReady,
} from './match-explainability-crest-bundle.ts';
import {
  buildSessionCrestExportBundle,
  sessionCrestExportShipped,
} from './session-crest-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_VERTEX_NARRATIVE_CAP = 10;

export interface MatchExplainabilityVertexBundle {
  vertexReady: boolean;
  vertexAllowed: boolean;
  crestReady: boolean;
  crestExportShipped: boolean;
  narrativeLines: string[];
}

type VertexParams = {
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

/** Vertex bundle: vertex gate and crest export must both be green. */
export function buildMatchExplainabilityVertexBundle(
  packs: TurnExplainabilityPack[],
  params: VertexParams,
): MatchExplainabilityVertexBundle {
  const vertex = auditMatchExplainabilityVertexGate(packs, params);
  const crest = buildMatchExplainabilityCrestBundle(packs, params);
  const crestExport = buildSessionCrestExportBundle(packs, params);
  const vertexAllowed = matchExplainabilityVertexAllowed(vertex);
  const crestReady = matchExplainabilityCrestReady(crest);
  const crestExportShipped = sessionCrestExportShipped(crestExport);
  const vertexReady = vertexAllowed && crestReady && crestExportShipped;
  const narrativeLines = [
    `Match explainability vertex bundle: ${vertexReady ? 'READY' : 'PENDING'} (gate ${vertexAllowed ? 'ok' : 'fail'}, crest ${crestReady ? 'ok' : 'fail'}).`,
    ...vertex.narrativeLines.slice(0, 2),
    ...crest.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_VERTEX_NARRATIVE_CAP);
  return {
    vertexReady,
    vertexAllowed,
    crestReady,
    crestExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityVertexReady(bundle: MatchExplainabilityVertexBundle): boolean {
  return bundle.vertexReady;
}
