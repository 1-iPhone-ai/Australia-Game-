import {
  buildMatchExplainabilityNexusBundle,
  matchExplainabilityNexusReady,
} from './match-explainability-nexus-bundle.ts';
import {
  buildMatchExplainabilityVertexBundle,
  matchExplainabilityVertexReady,
} from './match-explainability-vertex-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface VertexNexusBridgeReport {
  aligned: boolean;
  nexusReady: boolean;
  vertexReady: boolean;
  narrativeLines: string[];
}

/** Nexus-ready should match vertex-ready when vertex export stack passes. */
export function auditVertexNexusBridge(
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
): VertexNexusBridgeReport {
  const nexus = buildMatchExplainabilityNexusBundle(packs, params);
  const vertex = buildMatchExplainabilityVertexBundle(packs, params);
  const nexusReady = matchExplainabilityNexusReady(nexus);
  const vertexReady = matchExplainabilityVertexReady(vertex);
  const aligned = nexusReady === vertexReady;
  const narrativeLines = [
    `Vertex/nexus bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (nexus ${nexusReady ? 'ok' : 'fail'}, vertex ${vertexReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, nexusReady, vertexReady, narrativeLines };
}

export function vertexNexusBridgeHealthy(report: VertexNexusBridgeReport): boolean {
  return report.nexusReady && report.vertexReady && report.aligned;
}
