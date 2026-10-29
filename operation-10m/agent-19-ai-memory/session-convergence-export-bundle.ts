import {
  buildSessionNexusExportBundle,
  type SessionNexusExportBundle,
} from './session-nexus-export-bundle.ts';
import {
  buildMatchExplainabilityConvergenceBundle,
  matchExplainabilityConvergenceReady,
} from './match-explainability-convergence-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionConvergenceExportBundle extends SessionNexusExportBundle {
  convergenceReady: boolean;
  convergenceSchema: string;
}

/** Convergence export wraps nexus export when convergence bundle is ready. */
export function buildSessionConvergenceExportBundle(
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
): SessionConvergenceExportBundle {
  const base = buildSessionNexusExportBundle(packs, params);
  const convergence = buildMatchExplainabilityConvergenceBundle(packs, params);
  const convergenceReady = matchExplainabilityConvergenceReady(convergence);
  const exports = convergenceReady ? base.exports : [];
  return {
    ...base,
    exports,
    convergenceReady,
    convergenceSchema: 'agent19.convergence.v1',
    releaseReady: convergenceReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Convergence export: ${convergenceReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionConvergenceExportShipped(bundle: SessionConvergenceExportBundle): boolean {
  return bundle.convergenceReady && bundle.exports.length > 0 && bundle.convergenceSchema === 'agent19.convergence.v1';
}
