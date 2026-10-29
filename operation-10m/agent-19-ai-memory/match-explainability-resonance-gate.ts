import {
  buildMatchExplainabilityProjectionBundle,
  matchExplainabilityProjectionReady,
} from './match-explainability-projection-bundle.ts';
import {
  buildSessionProjectionExportBundle,
  sessionProjectionExportShipped,
} from './session-projection-export-bundle.ts';
import { auditResonanceProjectionBridge, resonanceProjectionBridgeHealthy } from './resonance-projection-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityResonanceGateReport {
  resonanceAllowed: boolean;
  projectionReady: boolean;
  projectionExportShipped: boolean;
  nexusProjectionHealthy: boolean;
  narrativeLines: string[];
}

/** Resonance gate: projection bundle + projection export + nexus/projection bridge. */
export function auditMatchExplainabilityResonanceGate(
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
): MatchExplainabilityResonanceGateReport {
  const projection = buildMatchExplainabilityProjectionBundle(packs, params);
  const projectionExport = buildSessionProjectionExportBundle(packs, params);
  const bridge = auditResonanceProjectionBridge(packs, params);
  const projectionReady = matchExplainabilityProjectionReady(projection);
  const projectionExportShipped = sessionProjectionExportShipped(projectionExport);
  const nexusProjectionHealthy = resonanceProjectionBridgeHealthy(bridge);
  const resonanceAllowed = projectionReady && projectionExportShipped && nexusProjectionHealthy;
  const narrativeLines = [
    `Match explainability resonance: ${resonanceAllowed ? 'ALLOWED' : 'DENIED'} (projection ${projectionReady ? 'ok' : 'fail'}, export ${projectionExportShipped ? 'ok' : 'fail'}).`,
    ...projection.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    resonanceAllowed,
    projectionReady,
    projectionExportShipped,
    nexusProjectionHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityResonanceAllowed(report: MatchExplainabilityResonanceGateReport): boolean {
  return report.resonanceAllowed;
}
