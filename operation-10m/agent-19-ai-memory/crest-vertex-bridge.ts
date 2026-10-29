import {
  buildMatchExplainabilityVertexBundle,
  matchExplainabilityVertexReady,
} from './match-explainability-vertex-bundle.ts';
import {
  buildMatchExplainabilityCrestBundle,
  matchExplainabilityCrestReady,
} from './match-explainability-crest-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface CrestVertexBridgeReport {
  aligned: boolean;
  vertexReady: boolean;
  crestReady: boolean;
  narrativeLines: string[];
}

/** Vertex-ready should match crest-ready when crest export stack passes. */
export function auditCrestVertexBridge(
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
): CrestVertexBridgeReport {
  const vertex = buildMatchExplainabilityVertexBundle(packs, params);
  const crest = buildMatchExplainabilityCrestBundle(packs, params);
  const vertexReady = matchExplainabilityVertexReady(vertex);
  const crestReady = matchExplainabilityCrestReady(crest);
  const aligned = vertexReady === crestReady;
  const narrativeLines = [
    `Crest/vertex bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (vertex ${vertexReady ? 'ok' : 'fail'}, crest ${crestReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, vertexReady, crestReady, narrativeLines };
}

export function crestVertexBridgeHealthy(report: CrestVertexBridgeReport): boolean {
  return report.vertexReady && report.crestReady && report.aligned;
}
