import {
  auditMatchExplainabilityNexusGate,
  matchExplainabilityNexusAllowed,
} from './match-explainability-nexus-gate.ts';
import {
  buildMatchExplainabilityVertexBundle,
  matchExplainabilityVertexReady,
} from './match-explainability-vertex-bundle.ts';
import {
  buildSessionVertexExportBundle,
  sessionVertexExportShipped,
} from './session-vertex-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_NEXUS_NARRATIVE_CAP = 10;

export interface MatchExplainabilityNexusBundle {
  nexusReady: boolean;
  nexusAllowed: boolean;
  vertexReady: boolean;
  vertexExportShipped: boolean;
  narrativeLines: string[];
}

type NexusParams = {
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

/** Nexus bundle: nexus gate and vertex export must both be green. */
export function buildMatchExplainabilityNexusBundle(
  packs: TurnExplainabilityPack[],
  params: NexusParams,
): MatchExplainabilityNexusBundle {
  const nexus = auditMatchExplainabilityNexusGate(packs, params);
  const vertex = buildMatchExplainabilityVertexBundle(packs, params);
  const vertexExport = buildSessionVertexExportBundle(packs, params);
  const nexusAllowed = matchExplainabilityNexusAllowed(nexus);
  const vertexReady = matchExplainabilityVertexReady(vertex);
  const vertexExportShipped = sessionVertexExportShipped(vertexExport);
  const nexusReady = nexusAllowed && vertexReady && vertexExportShipped;
  const narrativeLines = [
    `Match explainability nexus bundle: ${nexusReady ? 'READY' : 'PENDING'} (gate ${nexusAllowed ? 'ok' : 'fail'}, vertex ${vertexReady ? 'ok' : 'fail'}).`,
    ...nexus.narrativeLines.slice(0, 2),
    ...vertex.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_NEXUS_NARRATIVE_CAP);
  return {
    nexusReady,
    nexusAllowed,
    vertexReady,
    vertexExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityNexusReady(bundle: MatchExplainabilityNexusBundle): boolean {
  return bundle.nexusReady;
}
