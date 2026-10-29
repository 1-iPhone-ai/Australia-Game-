import {
  auditMatchExplainabilityMatrixGate,
  matchExplainabilityMatrixAllowed,
} from './match-explainability-matrix-gate.ts';
import {
  buildMatchExplainabilityFusionBundle,
  matchExplainabilityFusionReady,
} from './match-explainability-projection-bundle.ts';
import {
  buildSessionFusionExportBundle,
  sessionFusionExportShipped,
} from './session-projection-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_CONVERGENCE_NARRATIVE_CAP = 10;

export interface MatchExplainabilityFusionBundle {
  fusionReady: boolean;
  fusionAllowed: boolean;
  projectionReady: boolean;
  projectionExportShipped: boolean;
  narrativeLines: string[];
}

type FusionParams = {
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

/** Fusion bundle: fusion gate and projection export must both be green. */
export function buildMatchExplainabilityFusionBundle(
  packs: TurnExplainabilityPack[],
  params: FusionParams,
): MatchExplainabilityFusionBundle {
  const fusion = auditMatchExplainabilityMatrixGate(packs, params);
  const projection = buildMatchExplainabilityFusionBundle(packs, params);
  const projectionExport = buildSessionFusionExportBundle(packs, params);
  const fusionAllowed = matchExplainabilityMatrixAllowed(fusion);
  const projectionReady = matchExplainabilityFusionReady(projection);
  const projectionExportShipped = sessionFusionExportShipped(projectionExport);
  const fusionReady = fusionAllowed && projectionReady && projectionExportShipped;
  const narrativeLines = [
    `Match explainability fusion bundle: ${fusionReady ? 'READY' : 'PENDING'} (gate ${fusionAllowed ? 'ok' : 'fail'}, projection ${projectionReady ? 'ok' : 'fail'}).`,
    ...fusion.narrativeLines.slice(0, 2),
    ...projection.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_CONVERGENCE_NARRATIVE_CAP);
  return {
    fusionReady,
    fusionAllowed,
    projectionReady,
    projectionExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityFusionReady(bundle: MatchExplainabilityFusionBundle): boolean {
  return bundle.fusionReady;
}
