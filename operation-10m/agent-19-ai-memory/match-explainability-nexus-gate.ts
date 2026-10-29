import {
  buildMatchExplainabilityVertexBundle,
  matchExplainabilityVertexReady,
} from './match-explainability-vertex-bundle.ts';
import {
  buildSessionVertexExportBundle,
  sessionVertexExportShipped,
} from './session-vertex-export-bundle.ts';
import { auditCrestVertexBridge, crestVertexBridgeHealthy } from './crest-vertex-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityNexusGateReport {
  nexusAllowed: boolean;
  vertexReady: boolean;
  vertexExportShipped: boolean;
  crestVertexHealthy: boolean;
  narrativeLines: string[];
}

/** Nexus gate: vertex bundle + vertex export + crest/vertex bridge. */
export function auditMatchExplainabilityNexusGate(
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
): MatchExplainabilityNexusGateReport {
  const vertex = buildMatchExplainabilityVertexBundle(packs, params);
  const vertexExport = buildSessionVertexExportBundle(packs, params);
  const bridge = auditCrestVertexBridge(packs, params);
  const vertexReady = matchExplainabilityVertexReady(vertex);
  const vertexExportShipped = sessionVertexExportShipped(vertexExport);
  const crestVertexHealthy = crestVertexBridgeHealthy(bridge);
  const nexusAllowed = vertexReady && vertexExportShipped && crestVertexHealthy;
  const narrativeLines = [
    `Match explainability nexus: ${nexusAllowed ? 'ALLOWED' : 'DENIED'} (vertex ${vertexReady ? 'ok' : 'fail'}, export ${vertexExportShipped ? 'ok' : 'fail'}).`,
    ...vertex.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    nexusAllowed,
    vertexReady,
    vertexExportShipped,
    crestVertexHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityNexusAllowed(report: MatchExplainabilityNexusGateReport): boolean {
  return report.nexusAllowed;
}
