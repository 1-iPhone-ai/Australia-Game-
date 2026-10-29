import {
  buildMatchExplainabilityConvergenceBundle,
  matchExplainabilityConvergenceReady,
} from './match-explainability-convergence-bundle.ts';
import {
  buildMatchExplainabilityNexusBundle,
  matchExplainabilityNexusReady,
} from './match-explainability-nexus-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface NexusConvergenceBridgeReport {
  aligned: boolean;
  convergenceReady: boolean;
  nexusReady: boolean;
  narrativeLines: string[];
}

/** Convergence-ready should match nexus-ready when convergence export stack passes. */
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
  const nexus = buildMatchExplainabilityNexusBundle(packs, params);
  const convergenceReady = matchExplainabilityConvergenceReady(convergence);
  const nexusReady = matchExplainabilityNexusReady(nexus);
  const aligned = convergenceReady === nexusReady;
  const narrativeLines = [
    `Nexus/convergence bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (convergence ${convergenceReady ? 'ok' : 'fail'}, nexus ${nexusReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, convergenceReady, nexusReady, narrativeLines };
}

export function nexusConvergenceBridgeHealthy(report: NexusConvergenceBridgeReport): boolean {
  return report.convergenceReady && report.nexusReady && report.aligned;
}
