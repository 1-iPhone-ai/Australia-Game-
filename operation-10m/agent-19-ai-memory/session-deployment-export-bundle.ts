import {
  buildSessionOperationsExportBundle,
  type SessionOperationsExportBundle,
} from './session-operations-export-bundle.ts';
import {
  buildMatchExplainabilityDeploymentBundle,
  matchExplainabilityDeploymentReady,
} from './match-explainability-deployment-bundle.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionDeploymentExportBundle extends SessionOperationsExportBundle {
  deploymentReady: boolean;
  deploymentSchema: string;
}

/** Deployment export wraps operations export when deployment bundle is ready. */
export function buildSessionDeploymentExportBundle(
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
): SessionDeploymentExportBundle {
  const base = buildSessionOperationsExportBundle(packs, params);
  const deployment = buildMatchExplainabilityDeploymentBundle(packs, params);
  const deploymentReady = matchExplainabilityDeploymentReady(deployment);
  const exports = deploymentReady ? base.exports : [];
  return {
    ...base,
    exports,
    deploymentReady,
    deploymentSchema: 'agent19.deployment.v1',
    releaseReady: deploymentReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Deployment export: ${deploymentReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionDeploymentExportShipped(bundle: SessionDeploymentExportBundle): boolean {
  return bundle.deploymentReady && bundle.exports.length > 0 && bundle.deploymentSchema === 'agent19.deployment.v1';
}
