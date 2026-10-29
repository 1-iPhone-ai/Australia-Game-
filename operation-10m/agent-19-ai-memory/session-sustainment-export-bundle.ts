import {
  buildSessionDeploymentExportBundle,
  type SessionDeploymentExportBundle,
} from './session-deployment-export-bundle.ts';
import {
  buildMatchExplainabilitySustainmentBundle,
  matchExplainabilitySustainmentReady,
} from './match-explainability-sustainment-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionSustainmentExportBundle extends SessionDeploymentExportBundle {
  sustainmentReady: boolean;
  sustainmentSchema: string;
}

/** Sustainment export wraps deployment export when sustainment bundle is ready. */
export function buildSessionSustainmentExportBundle(
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
): SessionSustainmentExportBundle {
  const base = buildSessionDeploymentExportBundle(packs, params);
  const sustainment = buildMatchExplainabilitySustainmentBundle(packs, params);
  const sustainmentReady = matchExplainabilitySustainmentReady(sustainment);
  const exports = sustainmentReady ? base.exports : [];
  return {
    ...base,
    exports,
    sustainmentReady,
    sustainmentSchema: 'agent19.sustainment.v1',
    releaseReady: sustainmentReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Sustainment export: ${sustainmentReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionSustainmentExportShipped(bundle: SessionSustainmentExportBundle): boolean {
  return (
    bundle.sustainmentReady &&
    bundle.exports.length > 0 &&
    bundle.sustainmentSchema === 'agent19.sustainment.v1'
  );
}
