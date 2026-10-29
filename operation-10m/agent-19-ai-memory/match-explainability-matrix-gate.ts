import {
  buildMatchExplainabilityFusionBundle,
  matchExplainabilityFusionReady,
} from './match-explainability-fusion-bundle.ts';
import {
  buildSessionFusionExportBundle,
  sessionFusionExportShipped,
} from './session-fusion-export-bundle.ts';
import { auditMatrixFusionBridge, matrixFusionBridgeHealthy } from './matrix-fusion-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityMatrixGateReport {
  matrixAllowed: boolean;
  fusionReady: boolean;
  fusionExportShipped: boolean;
  nexusFusionHealthy: boolean;
  narrativeLines: string[];
}

/** Matrix gate: fusion bundle + fusion export + nexus/fusion bridge. */
export function auditMatchExplainabilityMatrixGate(
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
): MatchExplainabilityMatrixGateReport {
  const fusion = buildMatchExplainabilityFusionBundle(packs, params);
  const fusionExport = buildSessionFusionExportBundle(packs, params);
  const bridge = auditMatrixFusionBridge(packs, params);
  const fusionReady = matchExplainabilityFusionReady(fusion);
  const fusionExportShipped = sessionFusionExportShipped(fusionExport);
  const nexusFusionHealthy = matrixFusionBridgeHealthy(bridge);
  const matrixAllowed = fusionReady && fusionExportShipped && nexusFusionHealthy;
  const narrativeLines = [
    `Match explainability matrix: ${matrixAllowed ? 'ALLOWED' : 'DENIED'} (fusion ${fusionReady ? 'ok' : 'fail'}, export ${fusionExportShipped ? 'ok' : 'fail'}).`,
    ...fusion.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    matrixAllowed,
    fusionReady,
    fusionExportShipped,
    nexusFusionHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityMatrixAllowed(report: MatchExplainabilityMatrixGateReport): boolean {
  return report.matrixAllowed;
}
