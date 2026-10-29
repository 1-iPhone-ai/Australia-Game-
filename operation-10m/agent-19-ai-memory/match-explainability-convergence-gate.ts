import {
  buildMatchExplainabilityNexusBundle,
  matchExplainabilityNexusReady,
} from './match-explainability-nexus-bundle.ts';
import {
  buildSessionNexusExportBundle,
  sessionNexusExportShipped,
} from './session-nexus-export-bundle.ts';
import { auditVertexNexusBridge, vertexNexusBridgeHealthy } from './vertex-nexus-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityConvergenceGateReport {
  convergenceAllowed: boolean;
  nexusReady: boolean;
  nexusExportShipped: boolean;
  vertexNexusHealthy: boolean;
  narrativeLines: string[];
}

/** Convergence gate: nexus bundle + nexus export + vertex/nexus bridge. */
export function auditMatchExplainabilityConvergenceGate(
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
): MatchExplainabilityConvergenceGateReport {
  const nexus = buildMatchExplainabilityNexusBundle(packs, params);
  const nexusExport = buildSessionNexusExportBundle(packs, params);
  const bridge = auditVertexNexusBridge(packs, params);
  const nexusReady = matchExplainabilityNexusReady(nexus);
  const nexusExportShipped = sessionNexusExportShipped(nexusExport);
  const vertexNexusHealthy = vertexNexusBridgeHealthy(bridge);
  const convergenceAllowed = nexusReady && nexusExportShipped && vertexNexusHealthy;
  const narrativeLines = [
    `Match explainability convergence: ${convergenceAllowed ? 'ALLOWED' : 'DENIED'} (nexus ${nexusReady ? 'ok' : 'fail'}, export ${nexusExportShipped ? 'ok' : 'fail'}).`,
    ...nexus.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    convergenceAllowed,
    nexusReady,
    nexusExportShipped,
    vertexNexusHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityConvergenceAllowed(
  report: MatchExplainabilityConvergenceGateReport,
): boolean {
  return report.convergenceAllowed;
}
