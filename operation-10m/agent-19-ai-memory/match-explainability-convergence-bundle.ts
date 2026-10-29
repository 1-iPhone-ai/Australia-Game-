import {
  auditMatchExplainabilityLatticeGate,
  matchExplainabilityLatticeAllowed,
} from './match-explainability-lattice-gate.ts';
import {
  buildMatchExplainabilityConvergenceBundle,
  matchExplainabilityConvergenceReady,
} from './match-explainability-projection-bundle.ts';
import {
  buildSessionConvergenceExportBundle,
  sessionConvergenceExportShipped,
} from './session-projection-export-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_CONVERGENCE_NARRATIVE_CAP = 10;

export interface MatchExplainabilityConvergenceBundle {
  convergenceReady: boolean;
  convergenceAllowed: boolean;
  projectionReady: boolean;
  projectionExportShipped: boolean;
  narrativeLines: string[];
}

type ConvergenceParams = {
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

/** Convergence bundle: convergence gate and projection export must both be green. */
export function buildMatchExplainabilityConvergenceBundle(
  packs: TurnExplainabilityPack[],
  params: ConvergenceParams,
): MatchExplainabilityConvergenceBundle {
  const convergence = auditMatchExplainabilityLatticeGate(packs, params);
  const projection = buildMatchExplainabilityConvergenceBundle(packs, params);
  const projectionExport = buildSessionConvergenceExportBundle(packs, params);
  const convergenceAllowed = matchExplainabilityLatticeAllowed(convergence);
  const projectionReady = matchExplainabilityConvergenceReady(projection);
  const projectionExportShipped = sessionConvergenceExportShipped(projectionExport);
  const convergenceReady = convergenceAllowed && projectionReady && projectionExportShipped;
  const narrativeLines = [
    `Match explainability convergence bundle: ${convergenceReady ? 'READY' : 'PENDING'} (gate ${convergenceAllowed ? 'ok' : 'fail'}, projection ${projectionReady ? 'ok' : 'fail'}).`,
    ...convergence.narrativeLines.slice(0, 2),
    ...projection.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_CONVERGENCE_NARRATIVE_CAP);
  return {
    convergenceReady,
    convergenceAllowed,
    projectionReady,
    projectionExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityConvergenceReady(bundle: MatchExplainabilityConvergenceBundle): boolean {
  return bundle.convergenceReady;
}
