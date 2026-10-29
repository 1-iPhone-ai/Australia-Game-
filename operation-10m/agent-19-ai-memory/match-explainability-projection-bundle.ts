import {
  auditMatchExplainabilityLatticeGate,
  matchExplainabilityLatticeAllowed,
} from './match-explainability-lattice-gate.ts';
import {
  buildMatchExplainabilityProjectionBundle,
  matchExplainabilityProjectionReady,
} from './match-explainability-convergence-bundle.ts';
import {
  buildSessionProjectionExportBundle,
  sessionProjectionExportShipped,
} from './session-convergence-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_CONVERGENCE_NARRATIVE_CAP = 10;

export interface MatchExplainabilityProjectionBundle {
  projectionReady: boolean;
  projectionAllowed: boolean;
  convergenceReady: boolean;
  convergenceExportShipped: boolean;
  narrativeLines: string[];
}

type ProjectionParams = {
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

/** Projection bundle: projection gate and convergence export must both be green. */
export function buildMatchExplainabilityProjectionBundle(
  packs: TurnExplainabilityPack[],
  params: ProjectionParams,
): MatchExplainabilityProjectionBundle {
  const projection = auditMatchExplainabilityLatticeGate(packs, params);
  const convergence = buildMatchExplainabilityProjectionBundle(packs, params);
  const convergenceExport = buildSessionProjectionExportBundle(packs, params);
  const projectionAllowed = matchExplainabilityLatticeAllowed(projection);
  const convergenceReady = matchExplainabilityProjectionReady(convergence);
  const convergenceExportShipped = sessionProjectionExportShipped(convergenceExport);
  const projectionReady = projectionAllowed && convergenceReady && convergenceExportShipped;
  const narrativeLines = [
    `Match explainability projection bundle: ${projectionReady ? 'READY' : 'PENDING'} (gate ${projectionAllowed ? 'ok' : 'fail'}, convergence ${convergenceReady ? 'ok' : 'fail'}).`,
    ...projection.narrativeLines.slice(0, 2),
    ...convergence.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_CONVERGENCE_NARRATIVE_CAP);
  return {
    projectionReady,
    projectionAllowed,
    convergenceReady,
    convergenceExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityProjectionReady(bundle: MatchExplainabilityProjectionBundle): boolean {
  return bundle.projectionReady;
}
