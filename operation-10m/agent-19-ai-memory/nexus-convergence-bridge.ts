import {
  buildMatchExplainabilityConvergenceBundle,
  matchExplainabilityConvergenceReady,
} from './match-explainability-convergence-bundle.ts';
import {
  buildMatchExplainabilityProjectionBundle,
  matchExplainabilityProjectionReady,
} from './match-explainability-convergence-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface NexusConvergenceBridgeReport {
  aligned: boolean;
  convergenceReady: boolean;
  projectionReady: boolean;
  narrativeLines: string[];
}

/** Projection-ready should match projection-ready when convergence export stack passes. */
export function auditNexusConvergenceBridge(
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
): NexusConvergenceBridgeReport {
  const convergence = buildMatchExplainabilityConvergenceBundle(packs, params);
  const projection = buildMatchExplainabilityProjectionBundle(packs, params);
  const convergenceReady = matchExplainabilityConvergenceReady(convergence);
  const projectionReady = matchExplainabilityProjectionReady(projection);
  const aligned = convergenceReady === projectionReady;
  const narrativeLines = [
    `Nexus/convergence bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (convergence ${convergenceReady ? 'ok' : 'fail'}, projection ${projectionReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, convergenceReady, projectionReady, narrativeLines };
}

export function nexusConvergenceBridgeHealthy(report: NexusConvergenceBridgeReport): boolean {
  return report.convergenceReady && report.projectionReady && report.aligned;
}
