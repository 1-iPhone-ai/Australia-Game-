import {
  buildMatchExplainabilityProjectionBundle,
  matchExplainabilityProjectionReady,
} from './match-explainability-projection-bundle.ts';
import {
  buildMatchExplainabilityConvergenceBundle,
  matchExplainabilityConvergenceReady,
} from './match-explainability-projection-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface LatticeProjectionBridgeReport {
  aligned: boolean;
  projectionReady: boolean;
  convergenceReady: boolean;
  narrativeLines: string[];
}

/** Convergence-ready should match convergence-ready when projection export stack passes. */
export function auditLatticeProjectionBridge(
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
): LatticeProjectionBridgeReport {
  const projection = buildMatchExplainabilityProjectionBundle(packs, params);
  const convergence = buildMatchExplainabilityConvergenceBundle(packs, params);
  const projectionReady = matchExplainabilityProjectionReady(projection);
  const convergenceReady = matchExplainabilityConvergenceReady(convergence);
  const aligned = projectionReady === convergenceReady;
  const narrativeLines = [
    `Lattice/projection bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (projection ${projectionReady ? 'ok' : 'fail'}, convergence ${convergenceReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, projectionReady, convergenceReady, narrativeLines };
}

export function latticeProjectionBridgeHealthy(report: LatticeProjectionBridgeReport): boolean {
  return report.projectionReady && report.convergenceReady && report.aligned;
}
